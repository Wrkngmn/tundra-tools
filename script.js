console.log("Testing script connection");
let townSelectInstance;
document.addEventListener('DOMContentLoaded', function () {
  const snowData = {
    "Southcentral": {
      "Anchorage": 4,
      "Palmer": 8,
      "Wasilla": 6
    },
    "Interior": {
      "Fairbanks": 12,
      "North Pole": 15
    },
    "Southeast": {
      "Juneau": 10,
      "Sitka": 14
    }
  };

  const regionSelect = document.getElementById('regionSelect');
  const townSelect = document.getElementById('townSelect');
  const snowTableBody = document.querySelector('#snowTable tbody');

  const map = L.map('map').setView([61.17, -149.9], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const regionCenters = {
    "Southcentral": [61.17, -149.9],
    "Interior": [64.84, -147.72],
    "Southeast": [58.3, -134.42]
  };

  let marker;

townSelectInstance = new TomSelect('#townSelect', {
  create: false,
  sortField: 'text',
  placeholder: 'Select a town'
});
console.log("TownSelect initialized", townSelectInstance);
// 🟢 Make the instance globally available for debugging
window.townSelectInstance = townSelectInstance;
window.TomSelect.instances = window.TomSelect.instances || {};
window.TomSelect.instances['townSelect'] = townSelectInstance;

  new TomSelect('#regionSelect', {
    create: false,
    sortField: 'text',
    placeholder: 'Select a region'
  });

  // === Populate Region options ===
  function populateRegions() {
    regionSelect.innerHTML = `
      <option value="">Select a region</option>
      <option value="ALL_REGIONS">Show All Regions</option>
    `;
    Object.keys(snowData).forEach(region => {
      const opt = document.createElement('option');
      opt.value = region;
      opt.textContent = region;
      regionSelect.appendChild(opt);
    });
  }

  // === Populate Town options ===
  function populateTowns(region) {
    if (!region || !snowData[region]) {
      townSelectInstance.disable();
      townSelectInstance.clearOptions();
      townSelectInstance.addOption({ value: '', text: 'Select a town' });
      townSelectInstance.refreshOptions();
      townSelectInstance.setValue('');
      return;
    }

    townSelectInstance.enable();
    townSelectInstance.clearOptions();
    townSelectInstance.addOption({ value: '', text: 'All towns in region' });

    Object.keys(snowData[region]).forEach(town => {
      townSelectInstance.addOption({ value: town, text: town });
    });

    townSelectInstance.refreshOptions();
    townSelectInstance.setValue('');
  }

  // === Snow Table for selected region and town ===
  function updateSnowTable(region, specificTown = "") {
    snowTableBody.innerHTML = '';
    if (!region || !snowData[region]) return;

    const towns = snowData[region];
    for (const [town, depth] of Object.entries(towns)) {
      if (specificTown && town !== specificTown) continue;

      const row = document.createElement('tr');
      const townCell = document.createElement('td');
      townCell.textContent = town;

      const depthCell = document.createElement('td');
      depthCell.textContent = `${depth}"`;
      depthCell.style.backgroundColor = getSnowColor(depth);

      row.appendChild(townCell);
      row.appendChild(depthCell);
      snowTableBody.appendChild(row);
    }
  }

  // === Snow Table for all regions ===
  function updateSnowTableAllRegions() {
    snowTableBody.innerHTML = '';
    for (const region in snowData) {
      for (const [town, depth] of Object.entries(snowData[region])) {
        const row = document.createElement('tr');
        const townCell = document.createElement('td');
        townCell.textContent = town;

        const depthCell = document.createElement('td');
        depthCell.textContent = `${depth}"`;
        depthCell.style.backgroundColor = getSnowColor(depth);

        row.appendChild(townCell);
        row.appendChild(depthCell);
        snowTableBody.appendChild(row);
      }
    }
  }

  function getSnowColor(depth) {
    if (depth <= 6) return 'green';
    if (depth <= 12) return 'lightblue';
    if (depth <= 24) return 'orange';
    return 'red';
  }

  // === Event Listeners ===
 regionSelect.addEventListener('change', e => {
  const region = e.target.value;

  if (region === "ALL_REGIONS") {
    townSelectInstance.disable();
    updateSnowTableAllRegions();
    map.setView([62.5, -150], 4);
    if (marker) {
      map.removeLayer(marker);
      marker = null;
    }
    return;
  }

  populateTowns(region);
  updateSnowTable(region);
  townSelectInstance.enable(); // ✅ enable after region is selected

  if (regionCenters[region]) {
    map.setView(regionCenters[region], 7);
  }

  if (marker) {
    map.removeLayer(marker);
    marker = null;
  }
});

  townSelect.addEventListener('change', e => {
    const region = regionSelect.value;
    const selectedTown = e.target.value;

    if (!region || !snowData[region]) return;

    if (selectedTown === "") {
      updateSnowTable(region);
      if (marker) {
        map.removeLayer(marker);
        marker = null;
      }
      return;
    }

    updateSnowTable(region, selectedTown);

    const coords = {
      "Anchorage": [61.2181, -149.9003],
      "Palmer": [61.5996, -149.1128],
      "Wasilla": [61.5814, -149.4412],
      "Fairbanks": [64.8378, -147.7164],
      "North Pole": [64.7511, -147.3494],
      "Juneau": [58.3019, -134.4197],
      "Sitka": [57.0531, -135.3300]
    };

    if (coords[selectedTown]) {
      if (marker) map.removeLayer(marker);
      marker = L.marker(coords[selectedTown]).addTo(map);
      map.setView(coords[selectedTown], 9);
    }
  });

  // === Initial call ===
  populateRegions();
  // Force-enable dropdown after page load
if (townSelectInstance) {
  townSelectInstance.enable();
}
});

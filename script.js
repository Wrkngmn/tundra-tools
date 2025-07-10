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

  const regionCenters = {
    "Southcentral": [61.17, -149.9],
    "Interior": [64.84, -147.72],
    "Southeast": [58.3, -134.42]
  };

  const coords = {
    "Anchorage": [61.2181, -149.9003],
    "Palmer": [61.5996, -149.1128],
    "Wasilla": [61.5814, -149.4412],
    "Fairbanks": [64.8378, -147.7164],
    "North Pole": [64.7511, -147.3494],
    "Juneau": [58.3019, -134.4197],
    "Sitka": [57.0531, -135.3300]
  };

  const regionSelect = document.getElementById('regionSelect');
  const townSelect = document.getElementById('townSelect');
  const snowTableBody = document.querySelector('#snowTable tbody');

  const map = L.map('map').setView([61.17, -149.9], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  let marker;

  new TomSelect('#regionSelect', {
    placeholder: 'Select a region',
    sortField: 'text'
  });

  const townSelectInstance = new TomSelect('#townSelect', {
    placeholder: 'Select a town',
    sortField: 'text'
  });

  function getSnowColor(depth) {
    if (depth <= 6) return 'green';
    if (depth <= 12) return 'lightblue';
    if (depth <= 24) return 'orange';
    return 'red';
  }

  function populateRegions() {
    regionSelect.innerHTML = '<option value="">Select a region</option>';
    Object.keys(snowData).forEach(region => {
      const opt = document.createElement('option');
      opt.value = region;
      opt.textContent = region;
      regionSelect.appendChild(opt);
    });
  }

  function populateTowns(region) {
    if (!region || !snowData[region]) {
      townSelect.disabled = true;
      townSelectInstance.disable();
      townSelectInstance.clearOptions();
      return;
    }

    townSelect.disabled = false;
    townSelectInstance.enable();
    townSelectInstance.clearOptions();
    townSelectInstance.addOption({ value: '', text: 'All towns in region' });

    Object.keys(snowData[region]).forEach(town => {
      townSelectInstance.addOption({ value: town, text: town });
    });

    townSelectInstance.refreshOptions();
    townSelectInstance.setValue('');
  }

  function updateSnowTable(region, specificTown = '') {
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

  regionSelect.addEventListener('change', e => {
    const region = e.target.value;
    if (!region) return;

    populateTowns(region);
    updateSnowTable(region);

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
    const town = e.target.value;

    if (!region) return;

    if (town && coords[town]) {
      map.setView(coords[town], 9);
      if (marker) map.removeLayer(marker);
      marker = L.marker(coords[town]).addTo(map);
    } else {
      if (marker) {
        map.removeLayer(marker);
        marker = null;
      }
      if (regionCenters[region]) {
        map.setView(regionCenters[region], 7);
      }
    }

    updateSnowTable(region, town);
  });

  populateRegions();
});

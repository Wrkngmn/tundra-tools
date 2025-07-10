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
  const snowTable = document.getElementById('snowTable');

  const map = L.map('map').setView([61.17, -149.9], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  let marker = null;

  const townSelectInstance = new TomSelect('#townSelect', {
    create: false,
    placeholder: "Select a town",
    sortField: 'text'
  });

  new TomSelect('#regionSelect', {
    create: false,
    placeholder: "Select a region",
    sortField: 'text'
  });

  function populateRegions() {
    regionSelect.innerHTML = `<option value="">Select a region</option>`;
    Object.keys(snowData).forEach(region => {
      const opt = document.createElement('option');
      opt.value = region;
      opt.textContent = region;
      regionSelect.appendChild(opt);
    });
  }

  function populateTowns(region) {
    townSelectInstance.clearOptions();
    townSelectInstance.addOption({ value: '', text: 'All towns in region' });

    Object.keys(snowData[region]).forEach(town => {
      townSelectInstance.addOption({ value: town, text: town });
    });

    townSelectInstance.enable();
    townSelectInstance.setValue('');
    townSelectInstance.refreshOptions(false);
  }

  function updateSnowTable(region, selectedTown = '') {
    snowTable.innerHTML = '';
    const towns = snowData[region];

    for (const [town, depth] of Object.entries(towns)) {
      if (selectedTown && town !== selectedTown) continue;

      const row = document.createElement('tr');
      const townCell = document.createElement('td');
      const depthCell = document.createElement('td');

      townCell.textContent = town;
      depthCell.textContent = `${depth}"`;

      // Color logic
      if (depth <= 6) depthCell.style.backgroundColor = 'green';
      else if (depth <= 12) depthCell.style.backgroundColor = 'lightblue';
      else if (depth <= 24) depthCell.style.backgroundColor = 'orange';
      else depthCell.style.backgroundColor = 'red';

      row.appendChild(townCell);
      row.appendChild(depthCell);
      snowTable.appendChild(row);
    }
  }

  regionSelect.addEventListene

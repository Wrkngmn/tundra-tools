const regionTownMap = {
  "Southcentral": [...],
  "Interior": [...],
  "Southeast": [...],
  "Western": [...]
};

const regionCoords = {
  "Interior": [64.8378, -147.7164],
  "Southcentral": [61.2181, -149.9003],
  "Southeast": [58.3019, -134.4197],
  "Western": [64.5011, -165.4064]
};

const townCoords = {
  // Add all town coordinates as before...
};

let snowData = [];
let regionSelect, townSelect, regionSelectTomSelect, townTomSelect;
let map;
let townMarker = null;

// === Fetch live snow data from GitHub ===
async function fetchSnowData() {
  try {
    const response = await fetch("https://wrkngmn.github.io/tundra-tools/data/snow_data.json");
    const json = await response.json();
    snowData = json.data || [];
  } catch (err) {
    console.error("Error fetching snow data:", err);
  }
}

// === Initialize UI once data is ready ===
document.addEventListener("DOMContentLoaded", async () => {
  await fetchSnowData();

  regionSelect = document.getElementById("region-select");
  townSelect = document.getElementById("town-select");

  populateDropdown("region-select", Object.keys(regionTownMap));

  regionSelectTomSelect = new TomSelect(regionSelect, {
    create: false,
    maxItems: 1,
    allowEmptyOption: true,
    placeholder: "Select a Region",
    onChange: updateTownDropdown
  });

  townTomSelect = new TomSelect(townSelect, {
    create: false,
    maxItems: 1,
    allowEmptyOption: true,
    placeholder: "Select a Town"
  });

  townTomSelect.clearOptions();

  townTomSelect.on("change", (value) => {
    const selectedRegion = regionSelectTomSelect.getValue();
    const validTowns = regionTownMap[selectedRegion] || [];

    if (townMarker) {
      map.removeLayer(townMarker);
      townMarker = null;
    }

    if (value && validTowns.includes(value)) {
      const match = snowData.find(entry => entry.town === value);
      renderSnowTable([match || { town: value, depth: null }]);

      if (townCoords[value]) {
        townMarker = L.marker(townCoords[value]).addTo(map);
        map.flyTo(townCoords[value], 10);
      }
    } else {
      const filtered = snowData.filter(entry => validTowns.includes(entry.town));
      renderSnowTable(filtered);
    }
  });

  regionSelectTomSelect.on("change", (value) => {
    if (value === "all") {
      const allTowns = Object.values(regionTownMap).flat().sort();

      townTomSelect.clear(true);
      townTomSelect.clearOptions();
      townTomSelect.disable();

      renderSnowTable(allTowns.map(town => {
        const match = snowData.find(entry => entry.town === town);
        return match || { town, depth: null };
      }));

      if (townMarker) {
        map.removeLayer(townMarker);
        townMarker = null;
      }

      map.setView([61.2176, -149.8997], 5);
    } else {
      const towns = regionTownMap[value] || [];
      townTomSelect.enable();
      updateTownDropdown(value);
    }
  });

  map = L.map('map').setView([61.2176, -149.8997], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  renderHighestSnowCount();
});

// === Populate region dropdown ===
function populateDropdown(id, data) {
  const select = document.getElementById(id);
  select.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "-- Select a Region --";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);

  if (id === "region-select") {
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "See all Regions";
    select.appendChild(allOption);
  }

  data.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

function updateTownDropdown(region) {
  const towns = regionTownMap[region] || [];

  townTomSelect.clear(true);
  townTomSelect.clearOptions();
  townTomSelect.refreshOptions(false);

  towns.forEach(town => {
    townTomSelect.addOption({ value: town, text: town });
  });

  townTomSelect.setValue("");
  townTomSelect.refreshOptions(false);

  const filtered = snowData.filter(entry => towns.includes(entry.town));
  renderSnowTable(filtered);

  if (townMarker) {
    map.removeLayer(townMarker);
    townMarker = null;
  }

  if (regionCoords[region]) {
    map.flyTo(regionCoords[region], 6);
  }
}

function renderSnowTable(data) {
  const container = document.getElementById("data-container");
  if (!data.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <table class="snow-table">
      <thead>
        <tr>
          <th>Town</th>
          <th>Snow Depth</th>
        </tr>
      </thead>
      <tbody id="snowTableBody"></tbody>
    </table>
  `;

  const tbody = container.querySelector("#snowTableBody");

  data.forEach(item => {
    const row = document.createElement("tr");

    const townCell = document.createElement("td");
    townCell.textContent = item.town;

    const snowCell = document.createElement("td");
    if (item.depth == null) {
      snowCell.textContent = "No data available";
      snowCell.style.backgroundColor = "#f5f5f5";
    } else {
      snowCell.textContent = `${item.depth}"`;
      snowCell.style.backgroundColor = getSnowColor(item.depth);
    }

    row.appendChild(townCell);
    row.appendChild(snowCell);
    tbody.appendChild(row);
  });
}

function renderHighestSnowCount() {
  const container = document.getElementById("highest-snow-content");

  if (!snowData.length) {
    container.textContent = "No data available.";
    return;
  }

  const maxDepth = Math.max(...snowData.map(entry => entry.depth));
  const topTowns = snowData.filter(entry => entry.depth === maxDepth);

  const table = document.createElement("table");
  table.className = "snow-table";

  const thead = document.createElement("thead");
  thead.innerHTML = "<tr><th>Town</th><th>Snow Depth</th></tr>";
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  topTowns.forEach(town => {
    const row = document.createElement("tr");

    const townCell = document.createElement("td");
    townCell.textContent = town.town;

    const depthCell = document.createElement("td");
    depthCell.textContent = `${town.depth}"`;
    depthCell.style.backgroundColor = getSnowColor(town.depth);

    row.appendChild(townCell);
    row.appendChild(depthCell);
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.innerHTML = "";
  container.appendChild(table);
}

function getSnowColor(inches) {
  if (inches <= 6) return "#d2f8d2";
  if (inches <= 12) return "#d0ebff";
  if (inches <= 24) return "#ffe5b4";
  return "#ffcccc";
}

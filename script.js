const regionTownMap = {
  "Interior": ["Fairbanks", "North Pole"],
  "Southcentral": ["Anchorage", "Wasilla", "Palmer"],
  "Southeast": ["Juneau", "Sitka", "Ketchikan"],
  "Western": ["Nome", "Bethel", "Kotzebue"]
};

const snowData = [
  { town: "Anchorage", depth: 8 },
  { town: "Fairbanks", depth: 15 },
  { town: "Juneau", depth: 5 },
  { town: "Nome", depth: 27 },
  { town: "Wasilla", depth: 10 },
  { town: "Palmer", depth: 7 },
  { town: "Bethel", depth: 18 },
  { town: "Sitka", depth: 3 },
  { town: "Ketchikan", depth: 12 },
  { town: "Kotzebue", depth: 20 },
  { town: "North Pole", depth: 14 }
];

function getSnowColor(inches) {
  if (inches <= 6) return "#d2f8d2";
  if (inches <= 12) return "#d0ebff";
  if (inches <= 24) return "#ffe5b4";
  return "#ffcccc";
}

function populateDropdown(id, data) {
  const select = document.getElementById(id);
  select.innerHTML = "";
  data.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

let regionSelect, townSelect, regionSelectTomSelect, townTomSelect;

document.addEventListener("DOMContentLoaded", () => {
  regionSelect = document.getElementById("region-select");
  townSelect = document.getElementById("town-select");

  populateDropdown("region-select", ["-- Select a Region --", ...Object.keys(regionTownMap)]);

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

    if (value && validTowns.includes(value)) {
      const match = snowData.find(entry => entry.town === value);
      renderSnowTable(match ? [match] : []);
    } else {
      const filtered = snowData.filter(entry => validTowns.includes(entry.town));
      renderSnowTable(filtered);
    }
  });

  // ✅ Initialize Leaflet map centered on Anchorage
  const map = L.map('map').setView([61.2176, -149.8997], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
});

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
    snowCell.textContent = `${item.depth}"`;
    snowCell.style.backgroundColor = getSnowColor(item.depth);

    row.appendChild(townCell);
    row.appendChild(snowCell);
    tbody.appendChild(row);
  });
}


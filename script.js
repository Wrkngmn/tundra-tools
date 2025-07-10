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
  if (inches <= 6) return "#d2f8d2";         // light green
  if (inches <= 12) return "#d0ebff";        // light blue
  if (inches <= 24) return "#ffe5b4";        // light orange
  return "#ffcccc";                          // light red
}

function populateDropdown(id, data) {
  const select = document.getElementById(id);
  select.innerHTML = ""; // Clear options

  data.forEach(item => {
    const option = document.createElement("option");
    option.value = item === "-- Select a Region --" ? "" : item;
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

  // Start with empty town list
  townTomSelect.clearOptions();

  // 🧠 Update snow depth chart when a town is selected
function updateTownDropdown(region) {
  const towns = regionTownMap[region] || [];

  // Clear previous town list and selection
  townTomSelect.clearOptions();
  townTomSelect.clear();             // Clears selection
  townTomSelect.refreshOptions(false);  // Prevent flicker

  // Add new towns for selected region
  towns.forEach(town => {
    townTomSelect.addOption({ value: town, text: town });
  });

  // 👇 This is the missing key: force clearing of selection value internally
  setTimeout(() => {
    townTomSelect.setValue("");   // Reset selection after update
  }, 0);

  // Show all towns in this region
  const filtered = snowData.filter(entry => towns.includes(entry.town));
  renderSnowTable(filtered);
}


unction updateTownDropdown(region) {
  const towns = regionTownMap[region] || [];

  // Reset the Town dropdown entirely
  townTomSelect.clear(true);            // Clear any existing input
  townTomSelect.clearOptions();         // Clear all prior options
  townTomSelect.addOption({ value: "", text: "Select a Town" }); // Placeholder

  towns.forEach(town => {
    townTomSelect.addOption({ value: town, text: town });
  });

  townTomSelect.setValue("");           // Reset selection
  townTomSelect.refreshOptions(false);  // Refresh UI

  // Render table for region-level view
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


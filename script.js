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
  townTomSelect.on("change", function (value) {
    const selectedTown = value;
    const selectedRegion = regionSelectTomSelect.getValue();

    const validTowns = regionTownMap[selectedRegion] || [];

    if (selectedTown && validTowns.includes(selectedTown)) {
      const match = snowData.find(entry => entry.town === selectedTown);
      renderSnowTable(match ? [match] : []);
    } else {
      // No town selected or invalid town → show region towns
      const filtered = snowData.filter(entry => validTowns.includes(entry.town));
      renderSnowTable(filtered);
    }
  });
});


function updateTownDropdown(region) {
  const towns = regionTownMap[region] || [];
  townTomSelect.clearOptions();
 townTomSelect.clear(true);        // Clear input
townTomSelect.setValue("", true); // Fully reset selection and trigger change

  towns.forEach(town => {
    townTomSelect.addOption({ value: town, text: town });
  });
  townTomSelect.refreshOptions();

  // Show all towns in region when selected
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


 // === DROPDOWN SETUP ===
const regions = ["Interior", "Southcentral", "Southeast", "Western"];
const towns = ["Anchorage", "Fairbanks", "Juneau", "Nome", "Wasilla", "Bethel"];

function populateDropdown(id, data) {
  const select = document.getElementById(id);
  data.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });

  new TomSelect(select, {
    create: false,
    maxItems: 1,
    allowEmptyOption: true,
    sortField: { field: "text", direction: "asc" },
    placeholder: select.getAttribute("placeholder")
  });
}

// === BAR CHART SETUP ===
const snowData = [
  { town: "Anchorage", depth: 8 },
  { town: "Fairbanks", depth: 15 },
  { town: "Juneau", depth: 5 },
  { town: "Nome", depth: 27 }
];

function getSnowColor(inches) {
  if (inches <= 6) return "#d2f8d2";         // light green
  if (inches <= 12) return "#d0ebff";        // light blue
  if (inches <= 24) return "#ffe5b4";        // light orange
  return "#ffcccc";                          // light red
}

function renderSnowTable(data) {
  const container = document.getElementById("data-container");
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

// === INITIALIZE ALL ON LOAD ===
document.addEventListener("DOMContentLoaded", () => {
  populateDropdown("region-select", regions);
  populateDropdown("town-select", towns);
  renderSnowTable(snowData);
});

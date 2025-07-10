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

function getColor(depth) {
  if (depth <= 6) return "green";
  if (depth <= 12) return "blue";
  if (depth <= 24) return "orange";
  return "red";
}

function renderSnowData() {
  let html = "";
  snowData.forEach(entry => {
    const color = getColor(entry.depth);
    html += `
      <div class="bar-row">
        <div class="bar-label">${entry.town}</div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${entry.depth * 4}px; background-color:${color}"></div>
          <span class="bar-value">${entry.depth}"</span>
        </div>
      </div>
    `;
  });

  document.getElementById("data-container").innerHTML = html;
}

// === INITIALIZE ALL ON LOAD ===
document.addEventListener("DOMContentLoaded", () => {
  populateDropdown("region-select", regions);
  populateDropdown("town-select", towns);
  renderSnowData();
});

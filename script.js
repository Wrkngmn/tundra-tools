// Dummy region and town data for dropdowns
console.log("✅ script.js loaded");
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

document.addEventListener("DOMContentLoaded", () => {
  populateDropdown("region-select", regions);
  populateDropdown("town-select", towns);

  // Simulate snow data
  const dataContainer = document.getElementById("data-container");
  dataContainer.innerHTML = `
    <ul>
      <li>Anchorage: 8"</li>
      <li>Fairbanks: 15"</li>
      <li>Juneau: 5"</li>
      <li>Nome: 27"</li>
    </ul>
  `;
});


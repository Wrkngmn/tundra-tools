document.addEventListener("DOMContentLoaded", () => {
  const regionInput = document.getElementById("regionInput");
  const townInput = document.getElementById("townInput");

  const snowData = [
    { region: "Interior", town: "Fairbanks", depth: 22 },
    { region: "Southcentral", town: "Anchorage", depth: 12 },
    { region: "Southeast", town: "Juneau", depth: 5 },
    { region: "Interior", town: "North Pole", depth: 18 },
    { region: "Southwest", town: "Bethel", depth: 7 }
  ];

  function updateTable(filteredData) {
    const tableBody = document.querySelector("#snowDepthTable tbody");
    tableBody.innerHTML = "";

    if (filteredData.length === 0) {
      tableBody.innerHTML = "<tr><td>–</td><td>–</td></tr>";
      return;
    }

    for (const entry of filteredData) {
      const row = document.createElement("tr");
      const areaCell = document.createElement("td");
      const depthCell = document.createElement("td");

      areaCell.textContent = entry.town;
      depthCell.textContent = entry.depth;

      if (entry.depth > 18) {
        row.classList.add("heavy");
      } else if (entry.depth >= 7) {
        row.classList.add("moderate");
      }

      row.appendChild(areaCell);
      row.appendChild(depthCell);
      tableBody.appendChild(row);
    }
  }

  regionInput.addEventListener("input", () => {
    const region = regionInput.value.trim().toLowerCase();
    const filtered = snowData.filter(e =>
      e.region.toLowerCase().includes(region)
    );
    updateTable(filtered);
  });

  townInput.addEventListener("input", () => {
    const town = townInput.value.trim().toLowerCase();
    const filtered = snowData.filter(e =>
      e.town.toLowerCase().includes(town)
    );
    updateTable(filtered);
  });
});

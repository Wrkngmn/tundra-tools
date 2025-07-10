const fakeData = {
  "Southcentral": { "Anchorage": 12, "Wasilla": 6, "Palmer": 9 },
  "Interior": { "Fairbanks": 20, "North Pole": 16 },
  "Southeast": { "Juneau": 7, "Sitka": 4 },
  "Western": { "Nome": 10, "Bethel": 3 },
  "Northern": { "Utqiagvik": 25 }
};

const regionSelect = document.getElementById("region");
const townSelect = document.getElementById("town");
const snowBody = document.getElementById("snowBody");
const statusBox = document.getElementById("regionStatus");

function updateTownOptions(region) {
  townSelect.innerHTML = "";
  if (fakeData[region]) {
    Object.keys(fakeData[region]).forEach(town => {
      const option = document.createElement("option");
      option.value = town;
      option.textContent = town;
      townSelect.appendChild(option);
    });
  }
}

function updateSnowTable(region, town) {
  snowBody.innerHTML = "";
  if (region && town && fakeData[region] && fakeData[region][town] !== undefined) {
    const depth = fakeData[region][town];
    const row = document.createElement("tr");
    const level = depth <= 6 ? "light" : depth <= 18 ? "moderate" : "heavy";
    row.setAttribute("data-depth", level);
    row.innerHTML = `<td>${town}</td><td>${depth}</td>`;
    snowBody.appendChild(row);
    statusBox.textContent = `Snow depth for ${town}, ${region}: ${depth}"`;
  } else {
    snowBody.innerHTML = `<tr><td>–</td><td>–</td></tr>`;
    statusBox.textContent = `Select a Town or Region to see updates.`;
  }
}

regionSelect.addEventListener("change", () => {
  const selectedRegion = regionSelect.value;
  updateTownOptions(selectedRegion);
  updateSnowTable(null, null);
});

townSelect.addEventListener("change", () => {
  const region = regionSelect.value;
  const town = townSelect.value;
  updateSnowTable(region, town);
});

document.addEventListener("DOMContentLoaded", () => {
  new TomSelect("#region", {
    create: false,
    maxItems: 1,
    placeholder: "Select a region..."
  });

  new TomSelect("#town", {
    create: false,
    maxItems: 1,
    placeholder: "Select a town..."
  });

  Object.keys(fakeData).forEach(region => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    regionSelect.appendChild(option);
  });
});

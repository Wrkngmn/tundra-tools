const fakeData = {
  "Southcentral": {
    "Anchorage": 12,
    "Wasilla": 6,
    "Palmer": 9
  },
  "Interior": {
    "Fairbanks": 20,
    "North Pole": 16
  },
  "Southeast": {
    "Juneau": 7,
    "Sitka": 4
  },
  "Western": {
    "Nome": 10,
    "Bethel": 3
  },
  "Northern": {
    "Utqiagvik": 25
  }
};

const regionInput = document.getElementById("region");
const townInput = document.getElementById("town");
const regionList = document.getElementById("regionList");
const townList = document.getElementById("townList");
const snowBody = document.getElementById("snowBody");
const statusBox = document.getElementById("regionStatus");

function populateDropdowns() {
  Object.keys(fakeData).forEach(region => {
    const option = document.createElement("option");
    option.value = region;
    regionList.appendChild(option);
  });
}

function updateTownOptions(region) {
  townList.innerHTML = "";
  if (fakeData[region]) {
    Object.keys(fakeData[region]).forEach(town => {
      const option = document.createElement("option");
      option.value = town;
      townList.appendChild(option);
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
    statusBox.textContent = `Select a town to see updates.`;
  }
}

regionInput.addEventListener("input", () => {
  const selectedRegion = regionInput.value;
  updateTownOptions(selectedRegion);
  updateSnowTable(null, null);
});

townInput.addEventListener("input", () => {
  const region = regionInput.value;
  const town = townInput.value;
  updateSnowTable(region, town);
});

populateDropdowns();

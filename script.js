const fakeData = {
  "Southcentral": {
    "Anchorage": { depth: 12, coords: [61.2176, -149.8584] },
    "Wasilla":   { depth: 6, coords: [61.5814, -149.4522] },
    "Palmer":    { depth: 9, coords: [61.5996, -149.1128] }
  },
  "Interior": {
    "Fairbanks":  { depth: 20, coords: [64.8378, -147.7164] },
    "North Pole": { depth: 16, coords: [64.7511, -147.3494] }
  },
  "Southeast": {
    "Juneau": { depth: 7, coords: [58.3019, -134.4197] },
    "Sitka":  { depth: 4, coords: [57.0531, -135.3300] }
  },
  "Western": {
    "Nome":   { depth: 10, coords: [64.5011, -165.4064] },
    "Bethel": { depth: 3,  coords: [60.7922, -161.7558] }
  },
  "Northern": {
    "Utqiagvik": { depth: 25, coords: [71.2906, -156.7886] }
  }
};

const regionInput = document.getElementById("region");
const townInput = document.getElementById("town");
const regionList = document.getElementById("regionList");
const townList = document.getElementById("townList");
const snowBody = document.getElementById("snowBody");
const statusBox = document.getElementById("regionStatus");

let map;
let marker;

document.addEventListener("DOMContentLoaded", function () {
  map = L.map("mainMap").setView([61.2176, -149.8584], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
});

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
  if (
    region &&
    town &&
    fakeData[region] &&
    fakeData[region][town] &&
    fakeData[region][town].depth !== undefined
  ) {
    const depth = fakeData[region][town].depth;
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

function panMap(region, town) {
  if (
    region &&
    town &&
    fakeData[region] &&
    fakeData[region][town] &&
    fakeData[region][town].coords
  ) {
    const coords = fakeData[region][town].coords;
    map.setView(coords, 9);

    if (marker) {
      map.removeLayer(marker);
    }

    marker = L.marker(coords).addTo(map).bindPopup(town).openPopup();
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
  panMap(region, town); // ✅ this is essential
});

populateDropdowns();


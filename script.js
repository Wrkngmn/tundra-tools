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

const regionSelect = document.getElementById("region");
const townSelect = document.getElementById("town");
const snowBody = document.getElementById("snowBody");
const statusBox = document.getElementById("regionStatus");

let map;
let marker;

document.addEventListener("DOMContentLoaded", () => {
  map = L.map("mainMap").setView([61.2176, -149.8584], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  populateDropdowns();
});

function populateDropdowns() {
  Object.keys(fakeData).forEach(region => {
    const regionOption = document.createElement("option");
    regionOption.value = region;
    regionOption.textContent = region;
    regionSelect.appendChild(regionOption);
  });

  new TomSelect("#region", {
    maxItems: 1,
    placeholder: "Select a region...",
    onChange: value => {
      updateTownOptions(value);
      updateSnowTable(null, null);
    }
  });

  new TomSelect("#town", {
    maxItems: 1,
    placeholder: "Select a town...",
    onChange: value => {
      const region = regionSelect.value;
      const town = value;
      updateSnowTable(region, town);
      panMap(region, town);
    }
  });
}

function updateTownOptions(region) {
  townSelect.innerHTML = "";
  if (fakeData[region]) {
    Object.keys(fakeData[region]).forEach(town => {
      const option = document.createElement("option");
      option.value = town;
      option.textContent = town;
      townSelect.appendChild(option);
    });
    TomSelect.instances.town.sync();
  }
}

function updateSnowTable(region, town) {
  snowBody.innerHTML = "";
  if (
    region &&
    town &&
    fakeData[region] &&
    fakeData[region][town]
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
    statusBox.textContent = `Select a Town or Region to see updates.`;
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

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
  // Initialize Leaflet map
  map = L.map("mainMap").setView([61.2176, -149.8584], 6);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // === Populate Region <select> with options BEFORE TomSelect runs
  Object.keys(fakeData).forEach(region => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    regionSelect.appendChild(option);
  });

  // Initialize Region dropdown with Tom Select
  new TomSelect("#region", {
    maxItems: 1,
    placeholder: "Select a region...",
    onChange: (region) => {
      populateTowns(region);
      updateSnowTable(null, null);
    }
  });

  // Initialize Town dropdown with Tom Select (initially empty)
  new TomSelect("#town", {
    maxItems: 1,
    placeholder: "Select a town...",
    onChange: (town) => {
      const region = regionSelect.value;
      updateSnowTable(region, town);
      panMap(region, town);
    }
  });
});

function populateTowns(region) {
  townSelect.innerHTML = "";

  if (fakeData[region]) {
    Object.keys(fakeData[region]).forEach(town => {
      const option = document.createElement("option");
      option.value = town;
      option.textContent = town;
      townSelect.appendChild(option);
    });

    // Refresh Tom Select after adding options
    TomSelect.instances.town.clear();
    TomSelect.instances.town.sync();
  }
}

function updateSnowTable(region, town) {
  snowBody.innerHTML = "";
  if (
    region && town &&
    fakeData[region] &&
    fakeData[region][town]
  ) {
    const depth = fakeData[region][town].depth;
    const level = depth <= 6 ? "light" : depth <= 18 ? "moderate" : "heavy";

    const row = document.createElement("tr");
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
    region && town &&
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

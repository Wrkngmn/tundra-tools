const fakeData = {
  "Southcentral": {
    "Anchorage": { depth: 12, coords: [61.2176, -149.8997] },
    "Wasilla": { depth: 6, coords: [61.5807, -149.4523] },
    "Palmer": { depth: 9, coords: [61.6008, -149.1128] }
  },
  "Interior": {
    "Fairbanks": { depth: 20, coords: [64.8378, -147.7164] },
    "North Pole": { depth: 16, coords: [64.7511, -147.3494] }
  },
  "Southeast": {
    "Juneau": { depth: 7, coords: [58.3019, -134.4197] },
    "Sitka": { depth: 4, coords: [57.0531, -135.3300] }
  },
  "Western": {
    "Nome": { depth: 10, coords: [64.5011, -165.4064] },
    "Bethel": { depth: 3, coords: [60.7922, -161.7558] }
  },
  "Northern": {
    "Utqiagvik": { depth: 25, coords: [71.2906, -156.7886] }
  }
};

const regionSelect = document.getElementById("region");
const townSelect = document.getElementById("town");
const snowBody = document.getElementById("snowBody");
const statusBox = document.getElementById("regionStatus");

let map, marker;

function populateRegionOptions() {
  Object.keys(fakeData).forEach(region => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    regionSelect.appendChild(option);
  });

  new TomSelect("#region", {
    create: false,
    maxItems: 1,
    placeholder: "Select a region..."
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

    // Re-init TomSelect on town dropdown
    if (TomSelect.instances.hasOwnProperty("town")) {
      TomSelect.instances.town.destroy();
    }
    new TomSelect("#town", {
      create: false,
      maxItems: 1,
      placeholder: "Select a town..."
    });
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
    region && town &&
    fakeData[region] &&
    fakeData[region][town] &&
    fakeData[region][town].coords
  ) {
    const coords = fakeData[region][town].coords;
    map.setView(coords, 9);
    if (marker) map.removeLayer(marker);
    marker = L.marker(coords).addTo(map).bindPopup(town).openPopup();
  }
}

regionSelect.addEventListener("change", () => {
  const region = regionSelect.value;
  updateTownOptions(region);
  updateSnowTable(null, null);
});

townSelect.addEventListener("change", () => {
  const region = regionSelect.value;
  const town = townSelect.value;
  updateSnowTable(region, town);
  panMap(region, town);
});

document.addEventListener("DOMContentLoaded", () => {
  // Populate region and init Tom Selects
  populateRegionOptions();

  // Init map globally so other functions can use it
  map = L.map('mainMap').setView([61.2176, -149.8997], 5); // Anchorage

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  marker = L.marker([61.2176, -149.8997])
    .addTo(map)
    .bindPopup('Anchorage')
    .openPopup();
});

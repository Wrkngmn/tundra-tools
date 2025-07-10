let map, marker, regionBox;
let snowData = {};
let regionSelect, townSelect, snowBody, statusBox;
let regionTS, townTS;

const coordsMap = {
  "Anchorage": [61.2176, -149.8584],
  "Wasilla": [61.5814, -149.4522],
  "Palmer": [61.5996, -149.1128],
  "Fairbanks": [64.8378, -147.7164],
  "North Pole": [64.7511, -147.3494],
  "Juneau": [58.3019, -134.4197],
  "Sitka": [57.0531, -135.33],
  "Nome": [64.5011, -165.4064],
  "Bethel": [60.7922, -161.7558],
  "Utqiagvik": [71.2906, -156.7886]
};

const regionTowns = {
  "Southcentral": ["Anchorage", "Wasilla", "Palmer"],
  "Interior": ["Fairbanks", "North Pole"],
  "Southeast": ["Juneau", "Sitka"],
  "Western": ["Nome", "Bethel"],
  "Northern": ["Utqiagvik"]
};

document.addEventListener("DOMContentLoaded", () => {
  fetch("alaska_snow_depth.json")
    .then(resp => resp.json())
    .then(data => {
      snowData = data;
      initApp();
    });
});

function initApp() {
  regionSelect = document.getElementById("region");
  townSelect = document.getElementById("town");
  snowBody = document.getElementById("snowBody");
  statusBox = document.getElementById("regionStatus");

  Object.keys(regionTowns).forEach(region => {
    const opt = document.createElement("option");
    opt.value = region;
    opt.textContent = region;
    regionSelect.appendChild(opt);
  });

  regionTS = new TomSelect("#region", {
    maxItems: 1,
    placeholder: "Select a region...",
    onChange: region => {
      populateTowns(region);
      updateSnowTable(null, null);
    }
  });

  townTS = new TomSelect("#town", {
    maxItems: 1,
    placeholder: "Select a town...",
    onChange: town => {
      const region = regionSelect.value;
      updateSnowTable(region, town);
      panMap(town);
    }
  });

  map = L.map("mainMap").setView([61.2176, -149.8584], 6);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
}

function populateTowns(region) {
  townTS.clear(true);
  townTS.clearOptions();

  if (regionTowns[region]) {
    const options = regionTowns[region].map(town => ({
      value: town,
      text: town
    }));
    townTS.addOptions(options);
    townTS.refreshOptions();
    townTS.open();
  }
}

function updateSnowTable(region, town) {
  snowBody.innerHTML = "";
  if (town && snowData[town] !== undefined) {
    const depth = snowData[town];
    const level = depth <= 6 ? "light" : depth <= 18 ? "moderate" : "heavy";

    const row = document.createElement("tr");
    row.setAttribute("data-depth", level);
    row.innerHTML = `<td>${town}</td><td>${depth}</td>`;
    snowBody.appendChild(row);

    statusBox.textContent = `Snow depth for ${town}, ${region}: ${depth}"`;
  } else {
    snowBody.innerHTML = `<tr><td>–</td><td>–</td></tr>`;
    statusBox.textContent = "Select a Town or Region to see updates.";
  }
}

function panMap(town) {
  if (!town || !coordsMap[town]) return;

  if (regionBox) {
    map.removeLayer(regionBox);
    regionBox = null;
  }

  if (marker) {
    map.removeLayer(marker);
  }

  const coords = coordsMap[town];
  marker = L.marker(coords).addTo(map).bindPopup(town).openPopup();
  map.setView(coords, 9);
}

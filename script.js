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

const regionBounds = {
  "Southcentral": [[60.7, -150.5], [61.8, -148.5]],
  "Interior": [[64.5, -148.5], [65.3, -146.5]],
  "Southeast": [[57.5, -135.8], [58.5, -134.2]],
  "Western": [[60.5, -164], [64.5, -160.5]],
  "Northern": [[70.8, -157.5], [71.8, -155.5]]
};

let map, marker, regionBox;
let regionSelect, townSelect, snowBody, statusBox;
let regionTS, townTS;

document.addEventListener("DOMContentLoaded", () => {
  regionSelect = document.getElementById("region");
  townSelect = document.getElementById("town");
  snowBody = document.getElementById("snowBody");
  statusBox = document.getElementById("regionStatus");

  Object.keys(fakeData).forEach(region => {
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
      panToRegion(region); // zoom to region with highlight
    }
  });

  townTS = new TomSelect("#town", {
    maxItems: 1,
    placeholder: "Select a town...",
    onChange: town => {
      const region = regionSelect.value;
      updateSnowTable(region, town);
      panMap(region, town); // clears region box
    }
  });

  map = L.map("mainMap").setView([61.2176, -149.8584], 6);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
});

function populateTowns(region) {
  townTS.clear(true);
  townTS.clearOptions();

  if (fakeData[region]) {
    const options = Object.keys(fakeData[region]).map(town => ({
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

  if (
    region &&
    town &&
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
    region &&
    town &&
    fakeData[region] &&
    fakeData[region][town] &&
    fakeData[region][town].coords
  ) {
    const coords = fakeData[region][town].coords;
    map.setView(coords, 9);

    if (regionBox) {
      map.removeLayer(regionBox);
      regionBox = null;
    }

    if (marker) {
      map.removeLayer(marker);
    }

    marker = L.marker(coords).addTo(map).bindPopup(town).openPopup();
  }
}

function panToRegion(region) {
  if (region && regionBounds[region]) {
    const bounds = regionBounds[region];

    if (regionBox) map.removeLayer(regionBox);

    regionBox = L.rectangle(bounds, {
      color: "#007bff",
      weight: 2,
      fillOpacity: 0.08
    }).addTo(map);

    map.flyToBounds(bounds, {
      padding: [20, 20],
      duration: 1.2
    });
  }
}

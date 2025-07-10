const regionTownMap = {
  "Interior": ["Fairbanks", "North Pole"],
  "Southcentral": ["Anchorage", "Wasilla", "Palmer"],
  "Southeast": ["Juneau", "Sitka", "Ketchikan"],
  "Western": ["Nome", "Bethel", "Kotzebue"]
};

const townCoords = {
  "Anchorage": [61.2181, -149.9003],
  "Fairbanks": [64.8378, -147.7164],
  "Juneau": [58.3019, -134.4197],
  "Nome": [64.5011, -165.4064],
  "Wasilla": [61.5814, -149.4394],
  "Palmer": [61.5996, -149.1128],
  "Bethel": [60.7922, -161.7558],
  "Sitka": [57.0531, -135.33],
  "Ketchikan": [55.3422, -131.6461],
  "Kotzebue": [66.8983, -162.5986],
  "North Pole": [64.7511, -147.3494]
};

const snowData = [
  { town: "Anchorage", depth: 8 },
  { town: "Fairbanks", depth: 15 },
  { town: "Juneau", depth: 5 },
  { town: "Nome", depth: 27 },
  { town: "Wasilla", depth: 10 },
  { town: "Palmer", depth: 7 },
  { town: "Bethel", depth: 18 },
  { town: "Sitka", depth: 3 },
  { town: "Ketchikan", depth: 12 },
  { town: "Kotzebue", depth: 20 },
  { town: "North Pole", depth: 14 }
];

function getSnowColor(inches) {
  if (inches <= 12) return "#d2f8d2";         // light green
  if (inches <= 24) return "#d0ebff";         // light blue
  if (inches <= 36) return "#ffe5b4";         // light orange
  return "#ffcccc";                           // light red
}

function renderSnowTable(data) {
  const tbody = document.getElementById("snowTableBody");
  tbody.innerHTML = "";
  data.forEach(item => {
    const row = document.createElement("tr");

    const townCell = document.createElement("td");
    townCell.textContent = item.town;

    const snowCell = document.createElement("td");
    snowCell.textContent = `${item.depth}"`;
    snowCell.style.backgroundColor = getSnowColor(item.depth);

    row.appendChild(townCell);
    row.appendChild(snowCell);
    tbody.appendChild(row);
  });
}

const regionSelect = document.getElementById("region");
const townSelect = document.getElementById("town");
let marker = null;

populateDropdown("region", Object.keys(regionTownMap));

regionSelect.addEventListener("change", () => {
  const region = regionSelect.value;
  townSelect.innerHTML = '<option value="">Select a Town</option>';
  if (region && regionTownMap[region]) {
    regionTownMap[region].forEach(town => {
      const option = document.createElement("option");
      option.value = town;
      option.textContent = town;
      townSelect.appendChild(option);
    });

    // Fly to region center
    const townsInRegion = regionTownMap[region];
    const coords = townCoords[townsInRegion[0]];
    map.flyTo(coords, 6);

    // Clear pin and snow table
    if (marker) {
      map.removeLayer(marker);
      marker = null;
    }
    renderSnowTable(townsInRegion.map(name => {
      return snowData.find(d => d.town === name);
    }));
  } else {
    renderSnowTable([]);
  }
});

townSelect.addEventListener("change", () => {
  const selected = townSelect.value;
  if (!selected || !townCoords[selected]) return;

  const coords = townCoords[selected];
  map.flyTo(coords, 9);

  if (marker) map.removeLayer(marker);
  marker = L.marker(coords).addTo(map).bindPopup(selected).openPopup();

  const match = snowData.find(d => d.town === selected);
  renderSnowTable([match]);
});

// Initialize Leaflet map
const map = L.map("map").setView([61.2181, -149.9003], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 12,
  attribution: "© OpenStreetMap"
}).addTo(map);

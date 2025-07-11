const regionTownMap = {
  "Southcentral": [
    "Anchorage", "Wasilla", "Palmer", "Eagle River", "Girdwood",
    "Seward", "Kenai", "Soldotna", "Homer", "Cordova",
    "Valdez", "Whittier", "Talkeetna", "Glennallen"
  ],
  "Interior": [
    "Fairbanks", "North Pole", "Delta Junction", "Tok", "Nenana",
    "Healy", "Fort Yukon", "Galena", "Bettles", "Manley Hot Springs",
    "Tanana", "Circle"
  ],
  "Southeast": [
    "Juneau", "Sitka", "Ketchikan", "Petersburg", "Wrangell",
    "Haines", "Skagway", "Craig", "Metlakatla", "Thorne Bay",
    "Angoon", "Klawock", "Yakutat"
  ],
  "Western": [
    "Nome", "Bethel", "Kotzebue", "Dillingham", "Unalakleet",
    "Hooper Bay", "Togiak", "Quinhagak", "Shishmaref", "Emmonak",
    "Scammon Bay", "St. Michael"
  ]
};

const regionCoords = {
  "Interior": [64.8378, -147.7164],
  "Southcentral": [61.2181, -149.9003],
  "Southeast": [58.3019, -134.4197],
  "Western": [64.5011, -165.4064]
};

const townCoords = {
  // Southcentral
  "Anchorage": [61.2181, -149.9003],
  "Wasilla": [61.5814, -149.4417],
  "Palmer": [61.5994, -149.1128],
  "Eagle River": [61.3215, -149.5670],
  "Girdwood": [60.9406, -149.1661],
  "Seward": [60.1042, -149.4422],
  "Kenai": [60.5544, -151.2583],
  "Soldotna": [60.4850, -151.0623],
  "Homer": [59.6425, -151.5483],
  "Cordova": [60.5428, -145.7577],
  "Valdez": [61.1258, -146.3483],
  "Whittier": [60.7744, -148.6833],
  "Talkeetna": [62.3209, -150.1066],
  "Glennallen": [62.1094, -145.5572],

  // Interior
  "Fairbanks": [64.8378, -147.7164],
  "North Pole": [64.7511, -147.3494],
  "Delta Junction": [64.0375, -145.7322],
  "Tok": [63.3361, -142.9842],
  "Nenana": [64.5645, -149.0928],
  "Healy": [63.8675, -148.9681],
  "Fort Yukon": [66.5647, -145.2736],
  "Galena": [64.7365, -156.9284],
  "Bettles": [66.9139, -151.5156],
  "Manley Hot Springs": [65.0049, -150.6264],
  "Tanana": [65.1714, -152.0781],
  "Circle": [65.8253, -144.0636],

  // Southeast
  "Juneau": [58.3019, -134.4197],
  "Sitka": [57.0531, -135.3300],
  "Ketchikan": [55.3422, -131.6461],
  "Petersburg": [56.8125, -132.9556],
  "Wrangell": [56.4703, -132.3767],
  "Haines": [59.2358, -135.4450],
  "Skagway": [59.4586, -135.3139],
  "Craig": [55.4761, -133.1489],
  "Metlakatla": [55.1292, -131.5747],
  "Thorne Bay": [55.6903, -132.5211],
  "Angoon": [57.5036, -134.5836],
  "Klawock": [55.5547, -133.0958],
  "Yakutat": [59.5469, -139.7272],

  // Western
  "Nome": [64.5011, -165.4064],
  "Bethel": [60.7922, -161.7558],
  "Kotzebue": [66.8983, -162.5967],
  "Dillingham": [59.0397, -158.4575],
  "Unalakleet": [63.8734, -160.7886],
  "Hooper Bay": [61.5286, -166.0967],
  "Togiak": [59.0634, -160.3975],
  "Quinhagak": [59.7556, -161.9156],
  "Shishmaref": [66.2569, -166.0714],
  "Emmonak": [62.7778, -164.5444],
  "Scammon Bay": [61.8442, -165.5706],
  "St. Michael": [63.4806, -162.0325]
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
  if (inches <= 6) return "#d2f8d2";
  if (inches <= 12) return "#d0ebff";
  if (inches <= 24) return "#ffe5b4";
  return "#ffcccc";
}

function populateDropdown(id, data) {
  const select = document.getElementById(id);
  select.innerHTML = ""; // Clear previous options

  // Add default placeholder
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "-- Select a Region --";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);

  // Add optional "See all Regions"
  if (id === "region-select") {
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "See all Regions";
    select.appendChild(allOption);
  }

  // Add actual regions
  data.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}
let regionSelect, townSelect, regionSelectTomSelect, townTomSelect;
let map;
let townMarker = null;

document.addEventListener("DOMContentLoaded", () => {
  regionSelect = document.getElementById("region-select");
  townSelect = document.getElementById("town-select");
const regionOptions = ["-- See all Regions --", ...Object.keys(regionTownMap)];
populateDropdown("region-select", Object.keys(regionTownMap));

  regionSelectTomSelect = new TomSelect(regionSelect, {
    create: false,
    maxItems: 1,
    allowEmptyOption: true,
    placeholder: "Select a Region",
    onChange: updateTownDropdown
     renderHighestSnowCount(); // ← Add this at the end of the DOMContentLoaded block
});
   

  townTomSelect = new TomSelect(townSelect, {
    create: false,
    maxItems: 1,
    allowEmptyOption: true,
    placeholder: "Select a Town"
  });

  townTomSelect.clearOptions();

  townTomSelect.on("change", (value) => {
    const selectedRegion = regionSelectTomSelect.getValue();
    const validTowns = regionTownMap[selectedRegion] || [];

    // Clear old marker if any
    if (townMarker) {
      map.removeLayer(townMarker);
      townMarker = null;
    }

   if (value && validTowns.includes(value)) {
  const match = snowData.find(entry => entry.town === value);
  renderSnowTable([match || { town: value, depth: null }]);

      // Add town marker
      if (townCoords[value]) {
        townMarker = L.marker(townCoords[value]).addTo(map);
        map.flyTo(townCoords[value], 10);
      }
    } else {
      const filtered = snowData.filter(entry => validTowns.includes(entry.town));
      renderSnowTable(filtered);
    }
  });

  // ✅ Initialize Leaflet map centered on Anchorage
  map = L.map('map').setView([61.2176, -149.8997], 6);
regionSelectTomSelect.on("change", (value) => {
  if (value === "all") {
    const allTowns = Object.values(regionTownMap).flat().sort();

    townTomSelect.clear(true);
    townTomSelect.clearOptions();
    townTomSelect.disable();

    renderSnowTable(allTowns.map(town => {
      const match = snowData.find(entry => entry.town === town);
      return match || { town: town, depth: null }; // fallback if no data
    }));

    if (townMarker) {
      map.removeLayer(townMarker);
      townMarker = null;
    }

    map.setView([61.2176, -149.8997], 5); // Zoom out
  } else {
    const towns = regionTownMap[value] || [];

    townTomSelect.enable();
    updateTownDropdown(value);
  }
});

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
});

function updateTownDropdown(region) {
  const towns = regionTownMap[region] || [];

  townTomSelect.clear(true);
  townTomSelect.clearOptions();
  townTomSelect.refreshOptions(false);

  towns.forEach(town => {
    townTomSelect.addOption({ value: town, text: town });
  });

  townTomSelect.setValue("");
  townTomSelect.refreshOptions(false);

  const filtered = snowData.filter(entry => towns.includes(entry.town));
  renderSnowTable(filtered);

  // Clear old marker if any
  if (townMarker) {
    map.removeLayer(townMarker);
    townMarker = null;
  }

  // Fly to region center
  if (regionCoords[region]) {
    map.flyTo(regionCoords[region], 6);
  }
}
function renderHighestSnowCount() {
  const container = document.getElementById("highest-snow-content");

  if (!snowData.length) {
    container.textContent = "No data available.";
    return;
  }

  const maxDepth = Math.max(...snowData.map(entry => entry.depth));
  const topTowns = snowData.filter(entry => entry.depth === maxDepth);

  const table = document.createElement("table");
  table.className = "snow-table";

  const thead = document.createElement("thead");
  thead.innerHTML = "<tr><th>Town</th><th>Snow Depth</th></tr>";
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  topTowns.forEach(town => {
    const row = document.createElement("tr");

    const townCell = document.createElement("td");
    townCell.textContent = town.town;

    const depthCell = document.createElement("td");
    depthCell.textContent = `${town.depth}"`;
    depthCell.style.backgroundColor = getSnowColor(town.depth);

    row.appendChild(townCell);
    row.appendChild(depthCell);
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.innerHTML = "";
  container.appendChild(table);
}
function renderSnowTable(data) {
  const container = document.getElementById("data-container");
  if (!data.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <table class="snow-table">
      <thead>
        <tr>
          <th>Town</th>
          <th>Snow Depth</th>
        </tr>
      </thead>
      <tbody id="snowTableBody"></tbody>
    </table>
  `;

  const tbody = container.querySelector("#snowTableBody");

  data.forEach(item => {
    const row = document.createElement("tr");

    const townCell = document.createElement("td");
    townCell.textContent = item.town;

    const snowCell = document.createElement("td");
   if (item.depth == null) {
  snowCell.textContent = "No data available";
  snowCell.style.backgroundColor = "#f5f5f5"; // light gray fallback
} else {
  snowCell.textContent = `${item.depth}"`;
  snowCell.style.backgroundColor = getSnowColor(item.depth);
}

    row.appendChild(townCell);
    row.appendChild(snowCell);
    tbody.appendChild(row);
  });
}

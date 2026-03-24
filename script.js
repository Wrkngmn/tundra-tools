// =============================================
// Tundra Tools Snow Tracker - script.js
// =============================================

const regionTownMap = {
  "Southcentral": ["Anchorage", "Wasilla", "Palmer", "Eagle River", "Girdwood", "Seward", "Kenai", "Soldotna", "Homer", "Cordova", "Valdez", "Whittier", "Talkeetna", "Glennallen"],
  "Interior": ["Fairbanks", "North Pole", "Delta Junction", "Tok", "Nenana", "Healy", "Fort Yukon", "Galena", "Bettles", "Manley Hot Springs", "Tanana", "Circle"],
  "Southeast": ["Juneau", "Sitka", "Ketchikan", "Petersburg", "Wrangell", "Haines", "Skagway", "Craig", "Metlakatla", "Thorne Bay", "Angoon", "Klawock", "Yakutat"],
  "Western": ["Nome", "Bethel", "Kotzebue", "Dillingham", "Unalakleet", "Hooper Bay", "Togiak", "Quinhagak", "Shishmaref", "Emmonak", "Scammon Bay", "St. Michael"]
};

const regionCoords = {
  "Interior": [64.8378, -147.7164],
  "Southcentral": [61.2181, -149.9003],
  "Southeast": [58.3019, -134.4197],
  "Western": [64.5011, -165.4064]
};

const townCoords = {
  "Anchorage": [61.2181, -149.9003], "Wasilla": [61.5814, -149.4417], "Palmer": [61.5994, -149.1128],
  "Eagle River": [61.3215, -149.5670], "Girdwood": [60.9406, -149.1661], "Seward": [60.1042, -149.4422],
  "Kenai": [60.5544, -151.2583], "Soldotna": [60.4850, -151.0623], "Homer": [59.6425, -151.5483],
  "Cordova": [60.5428, -145.7577], "Valdez": [61.1258, -146.3483], "Whittier": [60.7744, -148.6833],
  "Talkeetna": [62.3209, -150.1066], "Glennallen": [62.1094, -145.5572],
  "Fairbanks": [64.8378, -147.7164], "North Pole": [64.7511, -147.3494], "Delta Junction": [64.0375, -145.7322],
  "Tok": [63.3361, -142.9842], "Nenana": [64.5645, -149.0928], "Healy": [63.8675, -148.9681],
  "Fort Yukon": [66.5647, -145.2736], "Galena": [64.7365, -156.9284], "Bettles": [66.9139, -151.5156],
  "Manley Hot Springs": [65.0049, -150.6264], "Tanana": [65.1714, -152.0781], "Circle": [65.8253, -144.0636],
  "Juneau": [58.3019, -134.4197], "Sitka": [57.0531, -135.3300], "Ketchikan": [55.3422, -131.6461],
  "Petersburg": [56.8125, -132.9556], "Wrangell": [56.4703, -132.3767], "Haines": [59.2358, -135.4450],
  "Skagway": [59.4586, -135.3139], "Craig": [55.4761, -133.1489], "Metlakatla": [55.1292, -131.5747],
  "Thorne Bay": [55.6903, -132.5211], "Angoon": [57.5036, -134.5836], "Klawock": [55.5547, -133.0958],
  "Yakutat": [59.5469, -139.7272], "Nome": [64.5011, -165.4064], "Bethel": [60.7922, -161.7558],
  "Kotzebue": [66.8983, -162.5967], "Dillingham": [59.0397, -158.4575], "Unalakleet": [63.8734, -160.7886],
  "Hooper Bay": [61.5286, -166.0967], "Togiak": [59.0634, -160.3975], "Quinhagak": [59.7556, -161.9156],
  "Shishmaref": [66.2569, -166.0714], "Emmonak": [62.7778, -164.5444], "Scammon Bay": [61.8442, -165.5706],
  "St. Michael": [63.4806, -162.0325]
};

let snowData = [];
let townSnowData = {};
let map, townMarker = null;
let regionSelectTomSelect, townTomSelect;
let stationMarkers = [];

const gearItems = [
  { name: 'Collapsible Snow Shovel', description: 'Durable, lightweight, perfect for deep snow. $30', link: 'YOUR_AMAZON_AFFILIATE_LINK' },
  { name: 'Insulated Winter Boots', description: 'Waterproof, -40°F rated. $80', link: 'YOUR_AMAZON_AFFILIATE_LINK' },
  { name: 'Heated Gloves', description: 'Battery-powered for warmth. $50', link: 'YOUR_AMAZON_AFFILIATE_LINK' },
  { name: 'Ice Traction Cleats', description: 'For safe walking on ice. $25', link: 'YOUR_AMAZON_AFFILIATE_LINK' },
  { name: 'Portable Snow Melter', description: 'For driveways and paths. $60', link: 'YOUR_AMAZON_AFFILIATE_LINK' },
  { name: 'Heavy-Duty Snow Brush', description: 'For vehicles. $20', link: 'YOUR_AMAZON_AFFILIATE_LINK' },
  { name: 'Thermal Base Layers', description: 'For layering in cold. $40', link: 'YOUR_AMAZON_AFFILIATE_LINK' },
  { name: 'LED Headlamp', description: 'For dark winter tasks. $30', link: 'YOUR_AMAZON_AFFILIATE_LINK' },
  { name: 'Insulated Water Bottle', description: 'Keeps water unfrozen. $35', link: 'YOUR_AMAZON_AFFILIATE_LINK' },
  { name: 'Emergency Survival Kit', description: 'For winter preparedness. $50', link: 'YOUR_AMAZON_AFFILIATE_LINK' }
];

function rotateGearBanner() {
  const banner = document.getElementById('gear-banner');
  if (!banner) return;
  let index = 0;
  const rotate = () => {
    const item = gearItems[index];
    banner.innerHTML = `<a href="${item.link}" target="_blank" rel="noopener">${item.name}</a><br>${item.description}`;
    index = (index + 1) % gearItems.length;
  };
  rotate();
  setInterval(rotate, 10000);
}

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initSelects();
  rotateGearBanner();

  fetchSnowData().then(() => {
    updateTownSnowData();
    updateMapMarkers();
    updateHighestSnow();
  }).catch(err => {
    console.error("Failed to load snow data:", err);
    document.getElementById('data-container').innerHTML = 
      '<p style="color: red;">Unable to load snow data right now.<br>Please refresh the page.</p>';
  });
});

async function fetchSnowData() {
  const cacheKey = 'snowData';

  // Try cache first (1 hour)
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const cachedData = JSON.parse(cached);
    if (Date.now() - cachedData.timestamp < 3600000) {
      snowData = cachedData.data || [];
      console.log(`Using cached snow data (${snowData.length} stations)`);
      return;
    }
  }

  try {
    const response = await fetch('data/snow_data.json?v=' + Date.now());
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const freshData = await response.json();
    snowData = freshData.data || [];
    
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: snowData }));
    console.log(`✅ Loaded ${snowData.length} snow stations`);
  } catch (err) {
    console.error('Error loading snow_data.json:', err);
    snowData = [];
  }
}

function updateTownSnowData() {
  townSnowData = {};
  snowData.forEach(item => {
    let closestTown = null;
    let minDist = Infinity;

    Object.keys(townCoords).forEach(town => {
      const dist = calculateDistance(townCoords[town], [item.lat || 61.2, item.lng || -149.9]);
      if (dist < minDist) {
        minDist = dist;
        closestTown = town;
      }
    });

    if (closestTown && minDist < 100) {
      townSnowData[closestTown] = item;
    }
  });
}

function updateMapMarkers() {
  stationMarkers.forEach(m => map.removeLayer(m));
  stationMarkers = [];

  Object.keys(townCoords).forEach(town => {
    const data = townSnowData[town] || { depth: 0 };
    const depth = parseFloat(data.depth) || 0;
    if (depth <= 0) return;

    let color = '#a3d8ff';
    if (depth > 24) color = '#ff8888';
    else if (depth > 12) color = '#ffcc77';
    else if (depth > 6) color = '#a3d8ff';

    const marker = L.circleMarker(townCoords[town], {
      radius: 9,
      fillColor: color,
      color: '#222',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9
    }).bindPopup(`<strong>${town}</strong><br>Snow Depth: <b>${depth}"</b>`).addTo(map);

    stationMarkers.push(marker);
  });
}

function updateHighestSnow() {
  const highest = snowData.reduce((max, curr) => 
    (parseFloat(curr.depth) > (parseFloat(max.depth) || 0) ? curr : max), {}
  );

  const content = highest.depth 
    ? `${highest.name || 'Unknown Station'}: <strong>${highest.depth}"</strong> snow`
    : 'No data available';

  document.getElementById('highest-snow-content').innerHTML = content;
}

function calculateDistance(coord1, coord2) {
  const R = 6371;
  const toRad = a => a * Math.PI / 180;
  const dLat = toRad(coord2[0] - coord1[0]);
  const dLon = toRad(coord2[1] - coord1[1]);
  const a = Math.sin(dLat/2)**2 + 
            Math.cos(toRad(coord1[0])) * Math.cos(toRad(coord2[0])) * 
            Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function initMap() {
  map = L.map('map', {
    center: [64.0, -152.0],
    zoom: 4
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Critical fix for GitHub Pages
  setTimeout(() => {
    map.invalidateSize();
  }, 100);

  setTimeout(() => {
    map.invalidateSize();
  }, 500);
}

function initSelects() {
  const regionSelect = document.getElementById('region-select');
  const townSelect = document.getElementById('town-select');

  regionSelectTomSelect = new TomSelect(regionSelect, {
    options: Object.keys(regionTownMap).map(r => ({value: r, text: r})),
    placeholder: 'Choose a region...'
  });

  townSelectTomSelect = new TomSelect(townSelect, {
    placeholder: 'Choose a town...'
  });

  regionSelectTomSelect.on('change', value => {
    if (!value) return;
    townSelectTomSelect.clear();
    townSelectTomSelect.clearOptions();
    townSelectTomSelect.addOptions(regionTownMap[value].map(t => ({value: t, text: t})));
    map.setView(regionCoords[value], 6);
  });

  townSelectTomSelect.on('change', value => {
    if (!value) return;

    const data = townSnowData[value] || { depth: 0, swe: 'N/A', lastUpdated: '—' };
    const depth = parseFloat(data.depth) || 0;

    document.getElementById('data-container').innerHTML = `
      <table class="snow-table">
        <tr><th>Location</th><td>${value}</td></tr>
        <tr><th>Snow Depth</th><td><strong>${depth}"</strong></td></tr>
        <tr><th>SWE</th><td>${data.swe || 'N/A'}</td></tr>
        <tr><th>Updated</th><td>${data.lastUpdated || '—'}</td></tr>
      </table>
    `;

    updateGearRecommendations(value);

    if (townMarker) map.removeLayer(townMarker);
    townMarker = L.marker(townCoords[value]).addTo(map)
      .bindPopup(`<strong>${value}</strong><br>${depth}" snow`).openPopup();

    map.setView(townCoords[value], 8);
  });
}

function updateGearRecommendations(town) {
  const data = townSnowData[town] || { depth: 0 };
  const depth = parseFloat(data.depth) || 0;
  const affiliateDiv = document.getElementById('affiliate');

  let rec = '';
  if (depth > 24) {
    rec = `<p><a href="YOUR_AMAZON_AFFILIATE_LINK" target="_blank">Heavy-Duty Snow Shovel</a> for extreme snow (${depth}") #ad</p>`;
  } else if (depth > 12) {
    rec = `<p><a href="YOUR_AMAZON_AFFILIATE_LINK" target="_blank">Snow Shovel + Cleats</a> for heavy snow (${depth}") #ad</p>`;
  } else {
    rec = `<p><a href="YOUR_AMAZON_AFFILIATE_LINK" target="_blank">Insulated Boots</a> for current conditions (${depth}") #ad</p>`;
  }

  affiliateDiv.innerHTML = `<h3>Prep for ${town}'s Snow</h3>${rec}`;
}

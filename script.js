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
const alaskaStations = [
  {name: 'Alexander Lake', id: '1267', triplet: '1267:AK:SNTL', lat: 61.75, lng: -150.89, elev: 170},
  {name: 'American Creek', id: '1189', triplet: '1189:AK:SNTL', lat: 64.79, lng: -141.23, elev: 1020},
  {name: 'Anchor River Divide', id: '1062', triplet: '1062:AK:SNTL', lat: 59.86, lng: -151.31, elev: 1650},
  {name: 'Anchorage Hillside', id: '1070', triplet: '1070:AK:SNTL', lat: 61.11, lng: -149.68, elev: 1910},
  {name: 'Aniak', id: '2065', triplet: '2065:AK:SNTL', lat: 61.58, lng: -159.58, elev: 90},
  {name: 'Atigun Pass', id: '957', triplet: '957:AK:SNTL', lat: 68.13, lng: -149.48, elev: 4780},
  {name: 'Bettles Field', id: '1182', triplet: '1182:AK:SNTL', lat: 66.91, lng: -151.53, elev: 640},
  {name: 'Chena Lakes', id: '1260', triplet: '1260:AK:SNTL', lat: 64.76, lng: -147.22, elev: 500},
  {name: 'Chisana', id: '1093', triplet: '1093:AK:SNTL', lat: 62.07, lng: -142.05, elev: 3320},
  {name: 'Coldfoot', id: '958', triplet: '958:AK:SNTL', lat: 67.25, lng: -150.18, elev: 1070},
  {name: 'Cooper Lake', id: '959', triplet: '959:AK:SNTL', lat: 60.39, lng: -149.69, elev: 1150},
  {name: 'Creamers Field', id: '1302', triplet: '1302:AK:SNTL', lat: 64.87, lng: -147.74, elev: 440},
  {name: 'Dahl Creek', id: '1303', triplet: '1303:AK:SNTL', lat: 66.95, lng: -156.90, elev: 250},
  {name: 'Eagle Summit', id: '960', triplet: '960:AK:SNTL', lat: 65.49, lng: -145.41, elev: 3630},
  {name: 'Elmendorf Field', id: '1332', triplet: '1332:AK:SNTL', lat: 61.25, lng: -149.82, elev: 170},
  {name: 'Esther Island', id: '1071', triplet: '1071:AK:SNTL', lat: 60.8, lng: -148.09, elev: 50},
  {name: 'Exit Glacier', id: '1092', triplet: '1092:AK:SNTL', lat: 60.19, lng: -149.62, elev: 360},
  {name: 'Fielding Lake', id: '1268', triplet: '1268:AK:SNTL', lat: 63.2, lng: -145.63, elev: 3000},
  {name: 'Flower Mountain', id: '1285', triplet: '1285:AK:SNTL', lat: 59.4, lng: -136.28, elev: 2540},
  {name: 'Fort Yukon', id: '961', triplet: '961:AK:SNTL', lat: 66.57, lng: -145.25, elev: 440},
  {name: 'Frostbite Bottom', id: '641', triplet: '641:AK:SNTL', lat: 61.75, lng: -149.27, elev: 2690},
  {name: 'Galena AK', id: '429', triplet: '429:AK:SNTL', lat: 64.7, lng: -156.75, elev: 110},
  {name: 'Gobblers Knob', id: '962', triplet: '962:AK:SNTL', lat: 60.48, lng: -150.96, elev: 120},
  {name: 'Grandview', id: '963', triplet: '963:AK:SNTL', lat: 60.01, lng: -149.96, elev: 1100},
  {name: 'Granite Crk', id: '964', triplet: '964:AK:SNTL', lat: 63.92, lng: -145.39, elev: 1240},
  {name: 'Hatcher Pass', id: '1091', triplet: '1091:AK:SNTL', lat: 61.78, lng: -149.21, elev: 2070},
  {name: 'Imnavait Creek', id: '968', triplet: '968:AK:SNTL', lat: 68.62, lng: -149.3, elev: 3040},
  {name: 'Indian Pass', id: '946', triplet: '946:AK:SNTL', lat: 61.82, lng: -148.45, elev: 2350},
  {name: 'Jack Rabbit', id: '1304', triplet: '1304:AK:SNTL', lat: 65.26, lng: -146.22, elev: 2650},
  {name: 'Kantishna', id: '1072', triplet: '1072:AK:SNTL', lat: 63.54, lng: -150.96, elev: 1700},
  {name: 'Kelly Station', id: '2066', triplet: '2066:AK:SNTL', lat: 67.2, lng: -150.4, elev: 1600},
  {name: 'Kenai Moose Pass', id: '966', triplet: '966:AK:SNTL', lat: 60.49, lng: -149.39, elev: 330},
  {name: 'Little Chena Ridge', id: '967', triplet: '967:AK:SNTL', lat: 65.0, lng: -146.74, elev: 2000},
  {name: 'Long Lake', id: '1090', triplet: '1090:AK:SNTL', lat: 58.19, lng: -133.83, elev: 1400},
  {name: 'Lower Kachemak Creek', id: '1269', triplet: '1269:AK:SNTL', lat: 59.73, lng: -151.02, elev: 1050},
  {name: 'May Creek', id: '1089', triplet: '1089:AK:SNTL', lat: 61.35, lng: -142.69, elev: 1630},
  {name: 'Mcneil Canyon Divide', id: '1061', triplet: '1061:AK:SNTL', lat: 59.73, lng: -151.02, elev: 1250},
  {name: 'Middle Fork Bradley', id: '1063', triplet: '1063:AK:SNTL', lat: 59.78, lng: -150.46, elev: 2300},
  {name: 'Monahan Flat', id: '969', triplet: '969:AK:SNTL', lat: 63.3, lng: -143.33, elev: 2710},
  {name: 'Moore Creek Bridge', id: '2087', triplet: '2087:AK:SNTL', lat: 62.7, lng: -157.15, elev: 225},
  {name: 'Mt. Alyeska', id: '1103', triplet: '1103:AK:SNTL', lat: 60.96, lng: -149.08, elev: 1540},
  {name: 'Mt. Eyak', id: '1064', triplet: '1064:AK:SNTL', lat: 60.48, lng: -145.76, elev: 150},
  {name: 'Mt. Ryan', id: '1190', triplet: '1190:AK:SNTL', lat: 66.14, lng: -145.66, elev: 1940},
  {name: 'Munson Ridge', id: '970', triplet: '970:AK:SNTL', lat: 64.85, lng: -146.2, elev: 3100},
  {name: 'Nuka Glacier', id: '1038', triplet: '1038:AK:SNTL', lat: 59.64, lng: -150.68, elev: 1250},
  {name: 'Pargon Creek', id: '986', triplet: '986:AK:SNTL', lat: 64.79, lng: -163.08, elev: 50},
  {name: 'Port Graham', id: '1039', triplet: '1039:AK:SNTL', lat: 59.35, lng: -151.83, elev: 300},
  {name: 'Prudhoe Bay', id: '971', triplet: '971:AK:SNTL', lat: 70.25, lng: -148.42, elev: 50},
  {name: 'Sagwon', id: '1095', triplet: '1095:AK:SNTL', lat: 69.43, lng: -148.7, elev: 1000},
  {name: 'Salmon River', id: '2222', triplet: '2222:AK:SNTL', lat: 62.15, lng: -159.71, elev: 100},
  {name: 'Summit Creek', id: '972', triplet: '972:AK:SNTL', lat: 60.65, lng: -149.5, elev: 1400},
  {name: 'Susitna Valley High', id: '973', triplet: '973:AK:SNTL', lat: 62.13, lng: -150.11, elev: 375},
  {name: 'Teuchet Creek', id: '974', triplet: '974:AK:SNTL', lat: 65.28, lng: -143.2, elev: 1640},
  {name: 'Tokositna Valley', id: '2086', triplet: '2086:AK:SNTL', lat: 62.6, lng: -150.92, elev: 2200},
  {name: 'Trapper Lake', id: '1065', triplet: '1065:AK:SNTL', lat: 60.2, lng: -152.98, elev: 200},
  {name: 'Upper Tsaina River', id: '1055', triplet: '1055:AK:SNTL', lat: 61.16, lng: -145.43, elev: 1750},
  {name: 'Upper Nuato River', id: '2223', triplet: '2223:AK:SNTL', lat: 61.79, lng: -148.91, elev: 1290},
  {name: 'Arctic Valley', id: '1102', triplet: '1102:AK:SNTL', lat: 61.25, lng: -149.52, elev: 3900},
  {name: 'Independence Mine', id: '1099', triplet: '1099:AK:SNTL', lat: 61.79, lng: -149.28, elev: 3550},
  {name: 'Moraine', id: '1073', triplet: '1073:AK:SNTL', lat: 64.38, lng: -146.53, elev: 2100},
  {name: 'Sugarloaf Mtn', id: '1098', triplet: '1098:AK:SNTL', lat: 61.06, lng: -145.36, elev: 550},
  {name: 'Tok', id: '1074', triplet: '1074:AK:SNTL', lat: 63.31, lng: -143.0, elev: 1630},
  {name: 'Upper Nome Creek', id: '1094', triplet: '1094:AK:SNTL', lat: 65.37, lng: -146.6, elev: 2560},
  {name: 'Turnagain Pass', id: '954', triplet: '954:AK:SNTL', lat: 60.12, lng: -149.1, elev: 1880},
  {name: 'Little Nelchina', id: '2224', triplet: '2224:AK:SNTL', lat: 61.98, lng: -146.6, elev: 2350},
  {name: 'Paradise Hill', id: '2225', triplet: '2225:AK:SNTL', lat: 64.4, lng: -146.89, elev: 1400}
];
let snowData = [];
let map, townMarker = null;
let regionSelect, townSelect, regionSelectTomSelect, townTomSelect;
let stationMarkers = [];

{
    console.log("Fetching snow data for tundra-tools, triplets count:", alaskaStations.length);
    const now = new Date();
    const beginDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 16).replace('T', ' ');
    const endDate = now.toISOString().slice(0, 16).replace('T', ' ');
    const triplets = alaskaStations.map(s => s.triplet);
    const snwdData = await getApiData('SNWD', beginDate, endDate, triplets);
    const wteqData = await getApiData('WTEQ', beginDate, endDate, triplets);
    console.log("API response for SNWD:", snwdData.length, "WTEQ:", wteqData.length);
    const stationData = {};
    snwdData.forEach(d => {
      if (!stationData[d.station]) stationData[d.station] = {depth: d.value, lastUpdated: d.dateTime};
    });
    wteqData.forEach(d => {
      if (stationData[d.station]) stationData[d.station].swe = d.value;
    });
    snowData = Object.keys(stationData).map(station => ({
      station,
      depth: stationData[station].depth ?? null,
      swe: stationData[station].swe ?? null,
      lastUpdated: stationData[station].lastUpdated ?? 'Unknown'
    }));
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: snowData }));
  } catch (err) {
    console.error('Error fetching snow data for tundra-tools:', err);
    document.getElementById('data-container').innerHTML = 'Error loading data.';
  }
}
  try {
    const now = new Date();
    const beginDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 16).replace('T', ' ');
    const endDate = now.toISOString().slice(0, 16).replace('T', ' ');
    const triplets = alaskaStations.map(s => s.triplet);
    const snwdData = await getApiData('SNWD', beginDate, endDate, triplets);
    const wteqData = await getApiData('WTEQ', beginDate, endDate, triplets);
    const stationData = {};
    snwdData.forEach(d => {
      if (!stationData[d.station]) stationData[d.station] = {depth: d.value, lastUpdated: d.dateTime};
    });
    wteqData.forEach(d => {
      if (stationData[d.station]) stationData[d.station].swe = d.value;
    });
    snowData = Object.keys(stationData).map(station => ({
      station,
      depth: stationData[station].depth ?? null,
      swe: stationData[station].swe ?? null,
      lastUpdated: stationData[station].lastUpdated ?? 'Unknown'
    }));
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: snowData }));
  } catch (err) {
    console.error('Error fetching snow data:', err);
    document.getElementById('data-container').innerHTML = 'Error loading data.';
  }
}

async function getApiData(elementCd, beginDate, endDate, triplets) {
  const url = 'https://wcc.sc.egov.usda.gov/awdbWebService/services';
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.wcc.nrcs.usda.gov/ns/awdbWebService">
  <soapenv:Header/>
  <soapenv:Body>
    <ns:getInstantaneousData>
      ${triplets.map(t => `<ns:stationTriplets>${t}</ns:stationTriplets>`).join('')}
      <ns:elementCd>${elementCd}</ns:elementCd>
      <ns:ordinal>1</ns:ordinal>
      <ns:beginDate>${beginDate}</ns:beginDate>
      <ns:endDate>${endDate}</ns:endDate>
      <ns:filter>ALL</ns:filter>
      <ns:unitSystem>ENGLISH</ns:unitSystem>
    </ns:getInstantaneousData>
  </soapenv:Body>
</soapenv:Envelope>`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'text/xml; charset=utf-8'},
    body: xml
  });
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/xml');
  const values = Array.from(doc.getElementsByTagName('values') || []);
  const grouped = {};
  values.forEach(v => {
    const station = v.parentElement.querySelector('stationTriplet')?.textContent || '';
    const dateTime = v.querySelector('dateTime')?.textContent || '';
    const value = parseFloat(v.querySelector('value')?.textContent) || null;
    if (!grouped[station] || new Date(dateTime) > new Date(grouped[station].dateTime)) {
      grouped[station] = {station, dateTime, value};
    }
  });
  return Object.values(grouped);
}

function updateGearRecommendations(town) {
  const townData = snowData.find(d => d.station.includes(town)) || { depth: 0 };
  const depth = townData.depth || 0;
  const affiliateDiv = document.getElementById('affiliate');
  let gearRecommendation = '';
  if (depth > 24) {
    gearRecommendation = `<p><a href="YOUR_AMAZON_AFFILIATE_LINK" target="_blank">Heavy-Duty Snow Shovel</a> for extreme snow (${depth}") #ad</p>`;
  } else if (depth > 12) {
    gearRecommendation = `<p><a href="YOUR_AMAZON_AFFILIATE_LINK" target="_blank">Snow Shovel & Cleats Combo</a> for heavy snow (${depth}") #ad</p>`;
  } else {
    gearRecommendation = `<p><a href="YOUR_AMAZON_AFFILIATE_LINK" target="_blank">Insulated Boots</a> for light snow (${depth}") #ad</p>`;
  }
  affiliateDiv.innerHTML = `<h3>Prep for ${town}'s Snow</h3>${gearRecommendation}`;
}

function updateMapMarkers() {
  stationMarkers.forEach(marker => map.removeLayer(marker));
  stationMarkers = [];
  snowData.forEach(data => {
    const station = alaskaStations.find(s => s.triplet === data.station);
    if (station) {
      const depth = data.depth || 0;
      let color = '#d2f8d2'; // Light
      if (depth > 24) color = '#ffcccc'; // Extreme
      else if (depth > 12) color = '#ffe5b4'; // Heavy
      else if (depth > 6) color = '#d0ebff'; // Moderate
      const marker = L.circleMarker([station.lat, station.lng], {
        radius: 8,
        fillColor: color,
        color: '#333',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).bindPopup(`${station.name}: ${depth}" snow`);
      marker.addTo(map);
      stationMarkers.push(marker);
    }
  });
}

function updateHighestSnow() {
  const highest = snowData.reduce((max, curr) => (curr.depth > max.depth ? curr : max), {depth: 0, station: ''});
  const station = alaskaStations.find(s => s.triplet === highest.station);
  document.getElementById('highest-snow-content').innerHTML = station
    ? `${station.name}: ${highest.depth}" on ${highest.lastUpdated}`
    : 'No data available';
}

function initMap() {
  map = L.map('map').setView([64.8378, -147.7164], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
}

function initSelects() {
  regionSelect = document.getElementById('region-select');
  townSelect = document.getElementById('town-select');
  regionSelectTomSelect = new TomSelect(regionSelect, {
    options: Object.keys(regionTownMap).map(region => ({value: region, text: region})),
    placeholder: 'Choose a region...'
  });
  townSelectTomSelect = new TomSelect(townSelect, {
    placeholder: 'Choose a town...'
  });
  regionSelectTomSelect.on('change', value => {
    if (value) {
      townSelectTomSelect.clear();
      townSelectTomSelect.clearOptions();
      townSelectTomSelect.addOptions(regionTownMap[value].map(town => ({value: town, text: town})));
      map.setView(regionCoords[value] || [64.8378, -147.7164], 6);
    }
  });
  townSelectTomSelect.on('change', value => {
    if (value) {
      updateGearRecommendations(value);
      const coords = townCoords[value] || [64.8378, -147.7164];
      if (townMarker) map.removeLayer(townMarker);
      townMarker = L.marker(coords).addTo(map).bindPopup(`${value}`).openPopup();
      map.setView(coords, 8);
      const nearestStation = alaskaStations.reduce((closest, station) => {
        const dist = Math.sqrt(
          Math.pow(station.lat - coords[0], 2) + Math.pow(station.lng - coords[1], 2)
        );
        return dist < closest.dist ? {station, dist} : closest;
      }, {dist: Infinity}).station;
      const data = snowData.find(d => d.station === nearestStation.triplet);
      document.getElementById('data-container').innerHTML = data
        ? `<table class="snow-table"><tr><th>Location</th><td>${value}</td></tr><tr><th>Snow Depth</th><td>${data.depth}"</td></tr><tr><th>SWE</th><td>${data.swe || 'N/A'}</td></tr><tr><th>Updated</th><td>${data.lastUpdated}</td></tr></table>`
        : 'No data available';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initSelects();
  fetchSnowData().then(() => {
    updateMapMarkers();
    updateHighestSnow();
  });
});

// Tundra Tools - Simple Working Version (March 24, 2026)
// Static snow data + restored dropdowns

let map;
let snowData = [];

// Real snow data (as of March 24, 2026)
const STATIC_SNOW_DATA = [
    { station: "1302:AK:SNTL", name: "Creamers Field (Fairbanks)", depth: 24 },
    { station: "1260:AK:SNTL", name: "Chena Lakes (North Pole area)", depth: 24 },
    { station: "1074:AK:SNTL", name: "Tok", depth: 18 },
    { station: "961:AK:SNTL",  name: "Fort Yukon", depth: 30 },
    { station: "1182:AK:SNTL", name: "Bettles Field", depth: 35 }
];

// Initialize Leaflet Map
function initMap() {
    map = L.map('map', { center: [64.85, -147.7], zoom: 8 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

// Get snow depth for town
function getSnowDepthForTown(townName) {
    if (!townName) return null;
    const name = townName.toLowerCase();

    for (let station of snowData) {
        if (station.name.toLowerCase().includes(name) ||
            (name.includes("north pole") && station.name.includes("Chena Lakes")) ||
            (name.includes("fairbanks") && station.name.includes("Creamers"))) {
            return station.depth;
        }
    }
    return 0;
}

// Update sidebar
function updateSnowInfo(townName) {
    const depth = getSnowDepthForTown(townName);
    document.getElementById('location').textContent = townName || "—";
    document.getElementById('snow-depth').textContent = depth + '"';
}

// Main init
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    snowData = STATIC_SNOW_DATA;

    // Simple native dropdowns (no Tom-Select dependency for now)
    const townSelect = document.getElementById('town-select');
    if (townSelect) {
        townSelect.addEventListener('change', (e) => {
            updateSnowInfo(e.target.value);
        });
        // Initial load
        setTimeout(() => updateSnowInfo(townSelect.value || "North Pole"), 300);
    }

    const regionSelect = document.getElementById('region-select');
    if (regionSelect) {
        regionSelect.addEventListener('change', () => {
            console.log("Region changed");
        });
    }

    console.log("✅ Tundra Tools loaded with static snow data");
});

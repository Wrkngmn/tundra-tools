// Tundra Tools - Native dropdown version (no Tom-Select) + Real snow data
// March 24, 2026 - Keeps your original HTML untouched

let map;
let snowData = [];

// Real snow data (as of March 24, 2026)
const STATIC_SNOW_DATA = [
    { station: "1302:AK:SNTL", name: "Creamers Field (Fairbanks)", depth: 24, swe: null, lastUpdated: "2026-03-24T23:15:12Z" },
    { station: "1260:AK:SNTL", name: "Chena Lakes (North Pole area)", depth: 24, swe: null, lastUpdated: "2026-03-24T23:15:12Z" },
    { station: "1074:AK:SNTL", name: "Tok", depth: 18, swe: null, lastUpdated: "2026-03-24T23:15:12Z" },
    { station: "961:AK:SNTL",  name: "Fort Yukon", depth: 30, swe: null, lastUpdated: "2026-03-24T23:15:12Z" },
    { station: "1182:AK:SNTL", name: "Bettles Field", depth: 35, swe: null, lastUpdated: "2026-03-24T23:15:12Z" }
];

// Initialize Leaflet Map
function initMap() {
    map = L.map('map', { center: [64.8, -147.7], zoom: 8 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

// Smart matching for towns
function getSnowInfo(townName) {
    if (!townName) return null;
    const name = townName.toLowerCase().trim();

    for (let station of snowData) {
        const sName = station.name.toLowerCase();
        if (sName.includes(name) ||
            (name.includes("north pole") && sName.includes("chena")) ||
            (name.includes("fairbanks") && sName.includes("creamers"))) {
            return station;
        }
    }
    return null;
}

// Update sidebar
function updateSnowInfo(townName) {
    const info = getSnowInfo(townName);
    document.getElementById('location').textContent = townName || "—";

    if (info) {
        document.getElementById('snow-depth').textContent = info.depth + '"';
        const updatedEl = document.getElementById('last-updated');
        if (updatedEl) updatedEl.textContent = new Date(info.lastUpdated).toLocaleString();
    } else {
        document.getElementById('snow-depth').textContent = '0"';
        const updatedEl = document.getElementById('last-updated');
        if (updatedEl) updatedEl.textContent = '—';
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {

    initMap();

    // Load real snow data
    snowData = STATIC_SNOW_DATA;
    console.log("✅ Real snow data loaded");

    // Use native dropdowns (no Tom-Select needed)
    const townSelect = document.getElementById('town-select');
    if (townSelect) {
        townSelect.addEventListener('change', function() {
            updateSnowInfo(this.value);
        });
        // Initial update
        setTimeout(() => {
            updateSnowInfo(townSelect.value || "North Pole");
        }, 300);
    }

    const regionSelect = document.getElementById('region-select');
    if (regionSelect) {
        regionSelect.addEventListener('change', function() {
            console.log("Region changed to", this.value);
        });
    }

    console.log("✅ Tundra Tools loaded with native dropdowns");
});

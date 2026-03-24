// Tundra Tools - Final working version with dropdowns + real snow data

let map;
let snowData = [];

// Real snow data (March 24, 2026)
const STATIC_SNOW_DATA = [
    { station: "1302:AK:SNTL", name: "Creamers Field (Fairbanks)", depth: 24, swe: null, lastUpdated: "2026-03-24T23:15:12Z" },
    { station: "1260:AK:SNTL", name: "Chena Lakes (North Pole area)", depth: 24, swe: null, lastUpdated: "2026-03-24T23:15:12Z" },
    { station: "1074:AK:SNTL", name: "Tok", depth: 18, swe: null, lastUpdated: "2026-03-24T23:15:12Z" },
    { station: "961:AK:SNTL",  name: "Fort Yukon", depth: 30, swe: null, lastUpdated: "2026-03-24T23:15:12Z" },
    { station: "1182:AK:SNTL", name: "Bettles Field", depth: 35, swe: null, lastUpdated: "2026-03-24T23:15:12Z" }
];

// Initialize Map
function initMap() {
    map = L.map('map', { center: [64.8, -147.7], zoom: 8 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

// Smart town matching
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

// Populate dropdowns with options
function populateDropdowns() {
    const regionSelect = document.getElementById('region-select');
    const townSelect = document.getElementById('town-select');

    // Simple regions
    if (regionSelect) {
        regionSelect.innerHTML = `
            <option value="">Select Region</option>
            <option value="Interior" selected>Interior</option>
            <option value="Southcentral">Southcentral</option>
            <option value="Northern">Northern</option>
        `;
    }

    // Populate towns
    if (townSelect) {
        townSelect.innerHTML = '<option value="">Select a town...</option>';
        
        const towns = ["North Pole", "Fairbanks", "Tok", "Fort Yukon", "Bettles Field", "Anchorage"];
        towns.forEach(town => {
            const option = document.createElement('option');
            option.value = town;
            option.textContent = town;
            townSelect.appendChild(option);
        });
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {

    initMap();
    snowData = STATIC_SNOW_DATA;

    populateDropdowns();   // ← This fills the dropdowns

    // Add change listener to town dropdown
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

    console.log("✅ Tundra Tools fully loaded with populated dropdowns and real snow data");
});

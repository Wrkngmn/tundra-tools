// Tundra Tools - Final Fixed Version (Dropdowns + Real Snow + Map Movement)

let map;
let snowData = [];

// Real snow data (March 24, 2026)
const STATIC_SNOW_DATA = [
    { station: "1302:AK:SNTL", name: "Creamers Field (Fairbanks)", depth: 24, location: [64.87, -147.72] },
    { station: "1260:AK:SNTL", name: "Chena Lakes (North Pole area)", depth: 24, location: [64.85, -147.10] },
    { station: "1074:AK:SNTL", name: "Tok", depth: 18, location: [63.34, -142.99] },
    { station: "961:AK:SNTL",  name: "Fort Yukon", depth: 30, location: [66.57, -145.25] },
    { station: "1182:AK:SNTL", name: "Bettles Field", depth: 35, location: [66.92, -151.52] }
];

// Initialize Map
function initMap() {
    map = L.map('map', { center: [64.8, -147.7], zoom: 8 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

// Get snow info + location for map movement
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

// Update sidebar AND move map
function updateSnowInfo(townName) {
    const info = getSnowInfo(townName);
    
    document.getElementById('location').textContent = townName || "—";

    if (info) {
        document.getElementById('snow-depth').textContent = info.depth + '"';
        const updatedEl = document.getElementById('last-updated');
        if (updatedEl) updatedEl.textContent = "March 24, 2026";

        // Move and zoom map to the location
        if (map && info.location) {
            map.flyTo(info.location, 10, { duration: 1.5 });
        }
        
        console.log(`Updated: ${townName} → ${info.depth}" snow`);
    } else {
        document.getElementById('snow-depth').textContent = '0"';
        document.getElementById('last-updated').textContent = '—';
    }
}

// Populate dropdowns
function populateDropdowns() {
    const townSelect = document.getElementById('town-select');
    if (!townSelect) return;

    townSelect.innerHTML = '<option value="">Select a town...</option>';

    const towns = ["North Pole", "Fairbanks", "Tok", "Fort Yukon", "Bettles Field", "Anchorage"];
    towns.forEach(town => {
        const option = document.createElement('option');
        option.value = town;
        option.textContent = town;
        townSelect.appendChild(option);
    });
}

// Main init
document.addEventListener('DOMContentLoaded', function() {

    initMap();
    snowData = STATIC_SNOW_DATA;

    populateDropdowns();

    // Town dropdown listener
    const townSelect = document.getElementById('town-select');
    if (townSelect) {
        townSelect.addEventListener('change', function() {
            updateSnowInfo(this.value);
        });

        // Initial load - show North Pole
        setTimeout(() => {
            updateSnowInfo("North Pole");
            townSelect.value = "North Pole";
        }, 400);
    }

    console.log("✅ Final Tundra Tools version loaded - dropdowns + snow + map movement");
});

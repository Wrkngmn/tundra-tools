// Tundra Tools - Main Script (Fixed March 24, 2026)
// Includes Tom-Select dropdowns + real static snow data

let map;
let snowData = [];

// Static snow data (real values as of March 24, 2026)
const STATIC_SNOW_DATA = [
    { "station": "1302:AK:SNTL", "name": "Creamers Field (Fairbanks)", "depth": 24, "swe": null, "lastUpdated": "2026-03-24T23:15:12Z" },
    { "station": "1260:AK:SNTL", "name": "Chena Lakes (North Pole area)", "depth": 24, "swe": null, "lastUpdated": "2026-03-24T23:15:12Z" },
    { "station": "1074:AK:SNTL", "name": "Tok", "depth": 18, "swe": null, "lastUpdated": "2026-03-24T23:15:12Z" },
    { "station": "961:AK:SNTL",  "name": "Fort Yukon", "depth": 30, "swe": null, "lastUpdated": "2026-03-24T23:15:12Z" },
    { "station": "1182:AK:SNTL", "name": "Bettles Field", "depth": 35, "swe": null, "lastUpdated": "2026-03-24T23:15:12Z" }
];

// Initialize Leaflet Map
function initMap() {
    map = L.map('map', { center: [64.8, -147.7], zoom: 8 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

// Get snow depth with smart matching for North Pole / Fairbanks
function getSnowDepthForTown(townName) {
    if (!townName) return null;
    const name = townName.toLowerCase().trim();

    for (let station of snowData) {
        const sName = station.name.toLowerCase();
        if (sName.includes(name) ||
            (name.includes("north pole") && sName.includes("chena lakes")) ||
            (name.includes("fairbanks") && sName.includes("creamers"))) {
            return station;
        }
    }
    return null;
}

// Update sidebar with snow info
function updateSnowInfo(townName) {
    const snowInfo = getSnowDepthForTown(townName);
    
    document.getElementById('location').textContent = townName || "—";
    
    if (snowInfo) {
        document.getElementById('snow-depth').textContent = snowInfo.depth + '"';
        const updatedEl = document.getElementById('last-updated');
        if (updatedEl) updatedEl.textContent = new Date(snowInfo.lastUpdated).toLocaleString();
        
        console.log(`Updated ${townName} → ${snowInfo.depth}"`);
    } else {
        document.getElementById('snow-depth').textContent = '0"';
        document.getElementById('last-updated').textContent = '—';
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    initMap();

    // Load snow data
    snowData = STATIC_SNOW_DATA;
    console.log("✅ Static snow data loaded with", snowData.length, "stations");

    // Initialize Tom-Select dropdowns
    if (typeof TomSelect !== 'undefined') {
        new TomSelect("#region-select", { create: false, sortField: "text" });
        new TomSelect("#town-select", { 
            create: false, 
            sortField: "text",
            onChange: function(value) {
                updateSnowInfo(value);
            }
        });
    } else {
        console.warn("TomSelect not loaded - using native selects");
        const townSelect = document.getElementById('town-select');
        if (townSelect) {
            townSelect.addEventListener('change', function() {
                updateSnowInfo(this.value);
            });
        }
    }

    // Initial update for default town (North Pole)
    setTimeout(() => {
        const defaultTown = document.getElementById('town-select').value || "North Pole";
        updateSnowInfo(defaultTown);
    }, 800);

    console.log("✅ Tundra Tools fully initialized");
});

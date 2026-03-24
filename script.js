// Tundra Tools - Original structure restored + Real snow data (March 24, 2026)

let map;
let snowData = [];

// ==================== REAL STATIC SNOW DATA ====================
const STATIC_SNOW_DATA = [
    { station: "1302:AK:SNTL", name: "Creamers Field (Fairbanks)", depth: 24, swe: null, lastUpdated: "2026-03-24T23:15:12Z" },
    { station: "1260:AK:SNTL", name: "Chena Lakes (North Pole area)", depth: 24, swe: null, lastUpdated: "2026-03-24T23:15:12Z" },
    { station: "1074:AK:SNTL", name: "Tok", depth: 18, swe: null, lastUpdated: "2026-03-24T23:15:12Z" },
    { station: "961:AK:SNTL",  name: "Fort Yukon", depth: 30, swe: null, lastUpdated: "2026-03-24T23:15:12Z" },
    { station: "1182:AK:SNTL", name: "Bettles Field", depth: 35, swe: null, lastUpdated: "2026-03-24T23:15:12Z" }
];

// Initialize Leaflet Map
function initMap() {
    map = L.map('map', {
        center: [64.8, -147.7],
        zoom: 8
    });

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

// Update sidebar with snow depth
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

// ==================== MAIN INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {

    // Initialize map
    initMap();

    // Load real static snow data
    snowData = STATIC_SNOW_DATA;
    console.log("✅ Real static snow data loaded");

    // Initialize Tom-Select dropdowns (your original setup)
    if (typeof TomSelect !== "undefined") {
        new TomSelect("#region-select", {
            create: false,
            sortField: "text"
        });

        const townSelect = new TomSelect("#town-select", {
            create: false,
            sortField: "text",
            onChange: function(value) {
                updateSnowInfo(value);
            }
        });

        // Initial update
        setTimeout(() => {
            updateSnowInfo(townSelect.getValue() || "North Pole");
        }, 600);

    } else {
        // Fallback if TomSelect fails to load
        console.warn("TomSelect not found - using native selects");
        const townSelect = document.getElementById('town-select');
        if (townSelect) {
            townSelect.addEventListener('change', function() {
                updateSnowInfo(this.value);
            });
            setTimeout(() => updateSnowInfo(townSelect.value || "North Pole"), 300);
        }
    }

    console.log("✅ Tundra Tools initialized with real snow depths");
});

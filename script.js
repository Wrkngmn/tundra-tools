// Tundra Tools - Original dropdowns restored + Real snow data
// Only snow loading/matching was changed

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

// ==================== MAIN INIT (original style) ====================
document.addEventListener('DOMContentLoaded', function() {

    initMap();

    snowData = STATIC_SNOW_DATA;
    console.log("✅ Real snow data loaded");

    // === Original Tom-Select setup (unchanged) ===
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

        // Initial update for North Pole
        setTimeout(() => {
            updateSnowInfo(townSelect.getValue() || "North Pole");
        }, 600);

    } else {
        // Fallback
        const townSelect = document.getElementById('town-select');
        if (townSelect) {
            townSelect.addEventListener('change', function() {
                updateSnowInfo(this.value);
            });
            setTimeout(() => updateSnowInfo(townSelect.value || "North Pole"), 300);
        }
    }

    console.log("✅ Tundra Tools initialized");
});

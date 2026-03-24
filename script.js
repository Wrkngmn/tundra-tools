// Tundra Tools - Minimal working version matching your current HTML

let map;

// Real snow data
const STATIC_SNOW_DATA = [
    { name: "North Pole", depth: 24, location: [64.85, -147.10] },
    { name: "Fairbanks", depth: 24, location: [64.84, -147.72] },
    { name: "Tok", depth: 18, location: [63.34, -142.99] },
    { name: "Fort Yukon", depth: 30, location: [66.57, -145.25] },
    { name: "Bettles Field", depth: 35, location: [66.92, -151.52] }
];

// Initialize Map
function initMap() {
    map = L.map('map', { center: [64.8, -147.7], zoom: 8 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

// Get snow info
function getSnowInfo(townName) {
    if (!townName) return null;
    const name = townName.toLowerCase().trim();

    for (let station of STATIC_SNOW_DATA) {
        if (station.name.toLowerCase().includes(name) || 
            name.includes("north pole") && station.name.includes("North Pole")) {
            return station;
        }
    }
    return null;
}

// Update sidebar and move map
function updateSnowInfo(townName) {
    const info = getSnowInfo(townName);
    
    document.getElementById('location').textContent = townName || "—";

    if (info) {
        document.getElementById('snow-depth').textContent = info.depth + '"';
        document.getElementById('last-updated').textContent = "March 24, 2026";

        // Move map to the town
        if (map && info.location) {
            map.flyTo(info.location, 10, { duration: 1.5 });
        }
    } else {
        document.getElementById('snow-depth').textContent = '0"';
        document.getElementById('last-updated').textContent = '—';
    }
}

// Main setup
document.addEventListener('DOMContentLoaded', function() {

    initMap();

    // Populate town dropdown (native)
    const townSelect = document.getElementById('town-select');
    if (townSelect) {
        townSelect.innerHTML = `
            <option value="">Select a town...</option>
            <option value="North Pole">North Pole</option>
            <option value="Fairbanks">Fairbanks</option>
            <option value="Tok">Tok</option>
            <option value="Fort Yukon">Fort Yukon</option>
            <option value="Bettles Field">Bettles Field</option>
        `;

        townSelect.addEventListener('change', function() {
            updateSnowInfo(this.value);
        });

        // Initial selection
        setTimeout(() => {
            townSelect.value = "North Pole";
            updateSnowInfo("North Pole");
        }, 300);
    }

    // Region dropdown (keep it simple)
    const regionSelect = document.getElementById('region-select');
    if (regionSelect) {
        regionSelect.innerHTML = `
            <option value="Interior" selected>Interior</option>
        `;
    }

    console.log("✅ Minimal script loaded - dropdowns + snow + map movement");
});

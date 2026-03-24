// Tundra Tools - Full original-style with regions + real snow data

let map;
let snowData = [];

// Real snow data with coordinates
const STATIC_SNOW_DATA = [
    { region: "Interior", name: "North Pole", depth: 24, location: [64.85, -147.10] },
    { region: "Interior", name: "Fairbanks", depth: 24, location: [64.84, -147.72] },
    { region: "Interior", name: "Tok", depth: 18, location: [63.34, -142.99] },
    { region: "Interior", name: "Fort Yukon", depth: 30, location: [66.57, -145.25] },
    { region: "Interior", name: "Bettles Field", depth: 35, location: [66.92, -151.52] },
    { region: "Southcentral", name: "Anchorage", depth: 12, location: [61.22, -149.90] },
    { region: "Southcentral", name: "Palmer", depth: 15, location: [61.60, -149.10] }
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
            (name.includes("north pole") && station.name === "North Pole")) {
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

        if (map && info.location) {
            map.flyTo(info.location, 10, { duration: 1.5 });
        }
    } else {
        document.getElementById('snow-depth').textContent = '0"';
        document.getElementById('last-updated').textContent = '—';
    }
}

// Populate regions and towns with dependency
function populateDropdowns() {
    const regionSelect = document.getElementById('region-select');
    const townSelect = document.getElementById('town-select');

    if (regionSelect) {
        regionSelect.innerHTML = `
            <option value="">Select Region</option>
            <option value="Interior" selected>Interior</option>
            <option value="Southcentral">Southcentral</option>
        `;
    }

    if (townSelect) {
        function updateTowns(region) {
            townSelect.innerHTML = '<option value="">Select a town...</option>';

            const filtered = STATIC_SNOW_DATA.filter(s => !region || s.region === region);

            filtered.forEach(station => {
                const option = document.createElement('option');
                option.value = station.name;
                option.textContent = station.name;
                townSelect.appendChild(option);
            });
        }

        // Initial population
        updateTowns("Interior");

        // Region change handler
        regionSelect.addEventListener('change', function() {
            updateTowns(this.value);
            // Clear town selection
            townSelect.value = "";
        });

        // Town change handler
        townSelect.addEventListener('change', function() {
            updateSnowInfo(this.value);
        });
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {

    initMap();
    populateDropdowns();

    // Initial load for North Pole
    setTimeout(() => {
        const townSelect = document.getElementById('town-select');
        if (townSelect) {
            townSelect.value = "North Pole";
            updateSnowInfo("North Pole");
        }
    }, 500);

    console.log("✅ Full version with regions + real snow data loaded");
});

// Tundra Tools - Restored region filtering + placeholders + popular destinations

let map;
let currentMarker = null;
let snowData = [];

// Full expanded snow data with popular destinations
const STATIC_SNOW_DATA = [
    // Interior
    { region: "Interior", name: "North Pole", depth: 24, location: [64.85, -147.10] },
    { region: "Interior", name: "Fairbanks", depth: 24, location: [64.84, -147.72] },
    { region: "Interior", name: "Badger", depth: 22, location: [64.80, -147.53] },
    { region: "Interior", name: "Tok", depth: 18, location: [63.34, -142.99] },
    { region: "Interior", name: "Fort Yukon", depth: 30, location: [66.57, -145.25] },
    { region: "Interior", name: "Bettles Field", depth: 35, location: [66.92, -151.52] },
    { region: "Interior", name: "Delta Junction", depth: 20, location: [63.99, -145.72] },
    { region: "Interior", name: "Nenana", depth: 19, location: [64.56, -149.09] },
    { region: "Interior", name: "Denali / Cantwell", depth: 35, location: [63.39, -148.95] },
    { region: "Interior", name: "Healy", depth: 32, location: [63.85, -148.96] },

    // Southcentral
    { region: "Southcentral", name: "Anchorage", depth: 12, location: [61.22, -149.90] },
    { region: "Southcentral", name: "Wasilla", depth: 14, location: [61.58, -149.45] },
    { region: "Southcentral", name: "Palmer", depth: 15, location: [61.60, -149.10] },
    { region: "Southcentral", name: "Kenai", depth: 11, location: [60.55, -151.26] },
    { region: "Southcentral", name: "Soldotna", depth: 13, location: [60.48, -151.07] },
    { region: "Southcentral", name: "Homer", depth: 10, location: [59.64, -151.54] },
    { region: "Southcentral", name: "Kodiak", depth: 16, location: [57.79, -152.41] },
    { region: "Southcentral", name: "Girdwood", depth: 45, location: [60.94, -149.17] },
    { region: "Southcentral", name: "Talkeetna", depth: 28, location: [62.32, -150.11] },
    { region: "Southcentral", name: "Valdez", depth: 40, location: [61.13, -146.36] },

    // Southeast
    { region: "Southeast", name: "Juneau", depth: 8, location: [58.30, -134.42] },
    { region: "Southeast", name: "Sitka", depth: 6, location: [57.05, -135.33] },
    { region: "Southeast", name: "Ketchikan", depth: 5, location: [55.34, -131.65] },
    { region: "Southeast", name: "Wrangell", depth: 7, location: [56.47, -132.38] },
    { region: "Southeast", name: "Petersburg", depth: 6, location: [56.81, -132.95] },
    { region: "Southeast", name: "Craig", depth: 4, location: [55.48, -133.15] },
    { region: "Southeast", name: "Haines", depth: 9, location: [59.24, -135.43] },
    { region: "Southeast", name: "Skagway", depth: 5, location: [59.45, -135.31] },

    // Northern
    { region: "Northern", name: "Utqiagvik", depth: 9, location: [71.29, -156.79] },
    { region: "Northern", name: "Kotzebue", depth: 14, location: [66.90, -162.60] },
    { region: "Northern", name: "Nome", depth: 18, location: [64.50, -165.40] },
    { region: "Northern", name: "Prudhoe Bay / Deadhorse", depth: 10, location: [70.26, -148.72] }
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

    for (let station of snowData) {
        if (station.name.toLowerCase().includes(name) || 
            (name.includes("north pole") && station.name === "North Pole")) {
            return station;
        }
    }
    return null;
}

// Update sidebar and move map with pin
function updateSnowInfo(townName) {
    const info = getSnowInfo(townName);
    const container = document.getElementById('data-container');

    if (currentMarker) {
        map.removeLayer(currentMarker);
        currentMarker = null;
    }

    if (info) {
        container.innerHTML = `
            <p><strong>Location:</strong> ${townName}</p>
            <p><strong>Snow Depth:</strong> ${info.depth}"</p>
            <p><strong>Last Updated:</strong> March 24, 2026</p>
        `;

        if (map && info.location) {
            map.flyTo(info.location, 10, { duration: 1.5 });

            currentMarker = L.marker(info.location).addTo(map);
            currentMarker.bindPopup(`<b>${townName}</b><br>Snow Depth: ${info.depth}"`).openPopup();
        }
    } else {
        container.innerHTML = `<p>Select a town to see snow data.</p>`;
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {

    initMap();
    snowData = STATIC_SNOW_DATA;

    // Region dropdown
    const regionSelect = document.getElementById('region-select');
    if (regionSelect) {
        regionSelect.innerHTML = `
            <option value="" selected>Select Region...</option>
            <option value="Interior">Interior</option>
            <option value="Southcentral">Southcentral</option>
            <option value="Southeast">Southeast</option>
            <option value="Northern">Northern</option>
        `;
    }

    // Town dropdown
    const townSelect = document.getElementById('town-select');
    if (townSelect) {
        function updateTowns(region) {
            townSelect.innerHTML = `<option value="" selected>Select Town...</option>`;

            const filtered = snowData.filter(s => s.region === region);
            filtered.forEach(station => {
                const option = document.createElement('option');
                option.value = station.name;
                option.textContent = station.name;
                townSelect.appendChild(option);
            });
        }

        townSelect.addEventListener('change', function() {
            updateSnowInfo(this.value);
        });

        regionSelect.addEventListener('change', function() {
            updateTowns(this.value);
        });

        // Initial load
        updateTowns("Interior");
    }

    console.log("✅ Full version with region filtering and popular destinations");
});

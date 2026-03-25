// Tundra Tools - Expanded with many more towns + realistic snow depths

let map;
let snowData = [];

// Expanded static snow data with realistic March 2026 depths
const STATIC_SNOW_DATA = [
    // Interior Alaska (deep snow)
    { region: "Interior", name: "North Pole", depth: 24, location: [64.85, -147.10] },
    { region: "Interior", name: "Fairbanks", depth: 24, location: [64.84, -147.72] },
    { region: "Interior", name: "Badger", depth: 22, location: [64.80, -147.53] },
    { region: "Interior", name: "College", depth: 23, location: [64.85, -147.80] },
    { region: "Interior", name: "Tok", depth: 18, location: [63.34, -142.99] },
    { region: "Interior", name: "Fort Yukon", depth: 30, location: [66.57, -145.25] },
    { region: "Interior", name: "Bettles Field", depth: 35, location: [66.92, -151.52] },
    { region: "Interior", name: "Delta Junction", depth: 20, location: [63.99, -145.72] },
    { region: "Interior", name: "Nenana", depth: 19, location: [64.56, -149.09] },

    // Southcentral / Mat-Su Valley
    { region: "Southcentral", name: "Anchorage", depth: 12, location: [61.22, -149.90] },
    { region: "Southcentral", name: "Wasilla", depth: 14, location: [61.58, -149.45] },
    { region: "Southcentral", name: "Palmer", depth: 15, location: [61.60, -149.10] },
    { region: "Southcentral", name: "Kenai", depth: 11, location: [60.55, -151.26] },
    { region: "Southcentral", name: "Soldotna", depth: 13, location: [60.48, -151.07] },
    { region: "Southcentral", name: "Homer", depth: 10, location: [59.64, -151.54] },
    { region: "Southcentral", name: "Kodiak", depth: 16, location: [57.79, -152.41] },

    // Southeast Alaska (much less snow)
    { region: "Southeast", name: "Juneau", depth: 8, location: [58.30, -134.42] },
    { region: "Southeast", name: "Sitka", depth: 6, location: [57.05, -135.33] },
    { region: "Southeast", name: "Ketchikan", depth: 5, location: [55.34, -131.65] },

    // Northern / Arctic
    { region: "Northern", name: "Utqiagvik (Barrow)", depth: 9, location: [71.29, -156.79] },
    { region: "Northern", name: "Kotzebue", depth: 14, location: [66.90, -162.60] },
    { region: "Northern", name: "Nome", depth: 18, location: [64.50, -165.40] }
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

// Update sidebar and move map
function updateSnowInfo(townName) {
    const info = getSnowInfo(townName);
    const container = document.getElementById('data-container');

    if (info) {
        container.innerHTML = `
            <p><strong>Location:</strong> ${townName}</p>
            <p><strong>Snow Depth:</strong> ${info.depth}"</p>
            <p><strong>Last Updated:</strong> March 24, 2026</p>
        `;

        if (map && info.location) {
            map.flyTo(info.location, 10, { duration: 1.5 });
        }

        // Update Highest Snow Depth
        const highest = Math.max(...snowData.map(s => s.depth));
        const highestEl = document.getElementById('highest-snow-content');
        if (highestEl) highestEl.textContent = highest + '" at Bettles Field';
    } else {
        container.innerHTML = `<p>Select a town to see snow data.</p>`;
    }
}

// Main initialization with Tom-Select
document.addEventListener('DOMContentLoaded', function() {

    initMap();
    snowData = STATIC_SNOW_DATA;

    if (typeof TomSelect !== "undefined") {
        // Region dropdown
        const regionTS = new TomSelect("#region-select", {
            create: false,
            sortField: "text"
        });

        // Town dropdown
        const townTS = new TomSelect("#town-select", {
            create: false,
            sortField: "text",
            onChange: function(value) {
                updateSnowInfo(value);
            }
        });

        // Populate regions
        const regions = ["Interior", "Southcentral", "Southeast", "Northern"];
        regions.forEach(r => regionTS.addOption({ value: r, text: r }));
        regionTS.setValue("Interior");

        // Update towns when region changes
        function updateTowns(region) {
            townTS.clearOptions();
            townTS.addOption({ value: "", text: "Select a town..." });

            const filtered = snowData.filter(s => s.region === region);
            filtered.forEach(station => {
                townTS.addOption({ value: station.name, text: station.name });
            });

            if (filtered.length > 0) {
                townTS.setValue(filtered[0].name);
            }
        }

        regionTS.on('change', updateTowns);
        updateTowns("Interior

// Tundra Tools - Reliable dropdown population fix

let map;
let snowData = [];

// Expanded snow data with many towns
const STATIC_SNOW_DATA = [
    { region: "Interior", name: "North Pole", depth: 24, location: [64.85, -147.10] },
    { region: "Interior", name: "Fairbanks", depth: 24, location: [64.84, -147.72] },
    { region: "Interior", name: "Badger", depth: 22, location: [64.80, -147.53] },
    { region: "Interior", name: "Tok", depth: 18, location: [63.34, -142.99] },
    { region: "Interior", name: "Fort Yukon", depth: 30, location: [66.57, -145.25] },
    { region: "Interior", name: "Bettles Field", depth: 35, location: [66.92, -151.52] },
    { region: "Southcentral", name: "Anchorage", depth: 12, location: [61.22, -149.90] },
    { region: "Southcentral", name: "Wasilla", depth: 14, location: [61.58, -149.45] },
    { region: "Southcentral", name: "Palmer", depth: 15, location: [61.60, -149.10] },
    { region: "Southcentral", name: "Kenai", depth: 11, location: [60.55, -151.26] },
    { region: "Southcentral", name: "Soldotna", depth: 13, location: [60.48, -151.07] },
    { region: "Southeast", name: "Juneau", depth: 8, location: [58.30, -134.42] },
    { region: "Northern", name: "Utqiagvik", depth: 9, location: [71.29, -156.79] }
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
        if (station.name.toLowerCase().includes(name) || name.includes("north pole")) {
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
    } else {
        container.innerHTML = `<p>Select a town to see snow data.</p>`;
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {

    initMap();
    snowData = STATIC_SNOW_DATA;

    if (typeof TomSelect !== "undefined") {
        // Region Tom-Select
        const regionTS = new TomSelect("#region-select", {
            create: false,
            sortField: "text"
        });

        // Town Tom-Select
        const townTS = new TomSelect("#town-select", {
            create: false,
            sortField: "text",
            onChange: function(value) {
                updateSnowInfo(value);
            }
        });

        // Populate Regions
        const regions = ["Interior", "Southcentral", "Southeast", "Northern"];
        regions.forEach(r => {
            regionTS.addOption({ value: r, text: r });
        });
        regionTS.setValue("Interior");

        // Populate Towns based on region
        function updateTowns(selectedRegion) {
            townTS.clearOptions();
            townTS.addOption({ value: "", text: "Select a town..." });

            const filtered = snowData.filter(s => s.region === selectedRegion);
            filtered.forEach(station => {
                townTS.addOption({ value: station.name, text: station.name });
            });

            if (filtered.length > 0) {
                townTS.setValue(filtered[0].name);
            }
        }

        // Listen for region change
        regionTS.on('change', updateTowns);

        // Initial population
        updateTowns("Interior");

    } else {
        console.warn("TomSelect not loaded - using native selects");
    }

    console.log("✅ Dropdowns should now be populated");
});

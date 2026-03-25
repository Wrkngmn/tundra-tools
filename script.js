// Tundra Tools - Safe version with Regions + Towns + Snow + Map
// Only affects dropdowns, snow display, and map movement

let map;
let snowData = [];

// Real snow data
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

// Main initialization
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
        ["Interior", "Southcentral"].forEach(r => {
            regionTS.addOption({ value: r, text: r });
        });
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

        // Initial load
        updateTowns("Interior");

    } else {
        console.warn("TomSelect not loaded");
    }

    console.log("✅ Safe version loaded - Regions should now appear");
});

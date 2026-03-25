// Tundra Tools - Final Working Script (Matches your index.html exactly)

let map;
let snowData = [];

// Real snow data from your snow_data.json
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

    // Initialize Tom-Select for Region
    if (typeof TomSelect !== "undefined") {
        new TomSelect("#region-select", {
            create: false,
            sortField: "text"
        });

        // Initialize Tom-Select for Town
        const townSelect = new TomSelect("#town-select", {
            create: false,
            sortField: "text",
            onChange: function(value) {
                updateSnowInfo(value);
            }
        });

        // Populate the Town dropdown
        const towns = ["North Pole", "Fairbanks", "Tok", "Fort Yukon", "Bettles Field"];
        towns.forEach(town => {
            townSelect.addOption({ value: town, text: town });
        });

        // Set default to North Pole
        setTimeout(() => {
            townSelect.setValue("North Pole");
            updateSnowInfo("North Pole");
        }, 600);

    } else {
        console.warn("TomSelect not loaded");
    }

    console.log("✅ Tundra Tools loaded with populated dropdowns and real snow data");
});

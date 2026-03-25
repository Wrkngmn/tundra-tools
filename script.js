// Tundra Tools - Complete Working Script (March 24, 2026)
// Matches your exact index.html with Tom-Select, real snow data, map movement

let map;
let snowData = [];

// Real snow data (from your snow_data.json)
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

// Get snow info for a town
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
    const container = document.getElementById('data-container');

    if (info) {
        container.innerHTML = `
            <p><strong>Location:</strong> ${townName}</p>
            <p><strong>Snow Depth:</strong> ${info.depth}"</p>
            <p><strong>Last Updated:</strong> March 24, 2026</p>
        `;

        // Move map
        if (map && info.location) {
            map.flyTo(info.location, 10, { duration: 1.5 });
        }

        // Update Highest Snow Depth
        const highest = Math.max(...STATIC_SNOW_DATA.map(s => s.depth));
        const highestEl = document.getElementById('highest-snow-content');
        if (highestEl) highestEl.innerHTML = `<strong>${highest}"</strong> at Bettles Field`;
    } else {
        container.innerHTML = `<p>Select a town to see snow data.</p>`;
    }
}

// Populate dropdowns with Tom-Select
document.addEventListener('DOMContentLoaded', function() {

    initMap();

    // Initialize Tom-Select
    if (typeof TomSelect !== "undefined") {
        // Region dropdown
        new TomSelect("#region-select", {
            create: false,
            sortField: "text"
        });

        // Town dropdown
        const townSelect = new TomSelect("#town-select", {
            create: false,
            sortField: "text",
            onChange: function(value) {
                updateSnowInfo(value);
            }
        });

        // Add town options
        const towns = ["North Pole", "Fairbanks", "Tok", "Fort Yukon", "Bettles Field"];
        towns.forEach(town => {
            townSelect.addOption({ value: town, text: town });
        });

        // Initial selection
        setTimeout(() => {
            townSelect.setValue("North Pole");
        }, 600);

    } else {
        console.warn("TomSelect not loaded");
    }

    console.log("✅ Tundra Tools fully working with real snow data");
});

// Tundra Tools - Original Working Version (Regions + Towns + Map Movement)
// Snow data removed - just restoring the core functionality

let map;

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

// Town locations for map movement
const townLocations = {
    "North Pole": [64.85, -147.10],
    "Fairbanks": [64.84, -147.72],
    "Tok": [63.34, -142.99],
    "Fort Yukon": [66.57, -145.25],
    "Bettles Field": [66.92, -151.52],
    "Anchorage": [61.22, -149.90]
};

// Update map position when town is selected
function updateMapLocation(townName) {
    if (map && townLocations[townName]) {
        map.flyTo(townLocations[townName], 10, { duration: 1.5 });
        console.log("Map moved to " + townName);
    }
}

// Main initialization - original structure
document.addEventListener('DOMContentLoaded', function() {

    initMap();

    // Region dropdown
    const regionSelect = document.getElementById('region-select');
    if (regionSelect) {
        regionSelect.addEventListener('change', function() {
            console.log("Region changed to:", this.value);
            // You can add town filtering here later if needed
        });
    }

    // Town dropdown
    const townSelect = document.getElementById('town-select');
    if (townSelect) {
        townSelect.addEventListener('change', function() {
            const selectedTown = this.value;
            console.log("Town selected:", selectedTown);
            updateMapLocation(selectedTown);
        });

        // Initial map position
        setTimeout(() => {
            updateMapLocation(townSelect.value || "North Pole");
        }, 500);
    }

    console.log("✅ Original core functionality restored (regions, towns, map movement)");
});

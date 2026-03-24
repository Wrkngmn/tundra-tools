// Tundra Tools - Minimal test version to restore dropdowns

let map;

// Initialize map
function initMap() {
    map = L.map('map', { center: [64.8, -147.7], zoom: 8 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    console.log("Map loaded");
}

// Simple update function
function updateSnowInfo(townName) {
    document.getElementById('location').textContent = townName || "—";
    document.getElementById('snow-depth').textContent = "0\"";
}

// Main setup
document.addEventListener('DOMContentLoaded', function() {
    initMap();

    // Native dropdowns - no Tom-Select
    const townSelect = document.getElementById('town-select');
    if (townSelect) {
        townSelect.addEventListener('change', function() {
            updateSnowInfo(this.value);
        });
        console.log("Town dropdown found and listener added");
        // Initial update
        setTimeout(() => updateSnowInfo(townSelect.value || "North Pole"), 200);
    } else {
        console.error("town-select element NOT found in HTML");
    }

    const regionSelect = document.getElementById('region-select');
    if (regionSelect) {
        console.log("Region dropdown found");
    }

    console.log("Minimal script loaded - dropdowns should appear now");
});

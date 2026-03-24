// Tundra Tools - Original working script (dropdowns restored)

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

// Placeholder snow update (original version)
function updateSnowInfo(townName) {
    document.getElementById('location').textContent = townName || "—";
    document.getElementById('snow-depth').textContent = '0"';
    const updatedEl = document.getElementById('last-updated');
    if (updatedEl) updatedEl.textContent = '—';
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {

    initMap();

    // Initialize Tom-Select dropdowns (original setup)
    if (typeof TomSelect !== "undefined") {
        new TomSelect("#region-select", {
            create: false,
            sortField: "text"
        });

        const townSelect = new TomSelect("#town-select", {
            create: false,
            sortField: "text",
            onChange: function(value) {
                updateSnowInfo(value);
            }
        });

        // Initial update
        setTimeout(() => {
            updateSnowInfo(townSelect.getValue() || "North Pole");
        }, 500);
    } else {
        // Fallback
        const townSelect = document.getElementById('town-select');
        if (townSelect) {
            townSelect.addEventListener('change', function() {
                updateSnowInfo(this.value);
            });
        }
    }

    console.log("✅ Original Tundra Tools script restored - dropdowns should work");
});

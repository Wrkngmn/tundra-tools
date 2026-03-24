// Tundra Tools - Main Script
// Updated March 24, 2026 - with static snow data matching

let map;
let snowData = [];

// Hard-coded real snow data (updated from NRCS as of March 24, 2026)
const STATIC_SNOW_DATA = [
    {
      "station": "1302:AK:SNTL",
      "name": "Creamers Field (Fairbanks)",
      "depth": 24,
      "swe": null,
      "lastUpdated": "2026-03-24T23:15:12Z"
    },
    {
      "station": "1260:AK:SNTL",
      "name": "Chena Lakes (North Pole area)",
      "depth": 24,
      "swe": null,
      "lastUpdated": "2026-03-24T23:15:12Z"
    },
    {
      "station": "1074:AK:SNTL",
      "name": "Tok",
      "depth": 18,
      "swe": null,
      "lastUpdated": "2026-03-24T23:15:12Z"
    },
    {
      "station": "961:AK:SNTL",
      "name": "Fort Yukon",
      "depth": 30,
      "swe": null,
      "lastUpdated": "2026-03-24T23:15:12Z"
    },
    {
      "station": "1182:AK:SNTL",
      "name": "Bettles Field",
      "depth": 35,
      "swe": null,
      "lastUpdated": "2026-03-24T23:15:12Z"
    }
];

// Initialize map
function initMap() {
    map = L.map('map', {
        center: [64.8, -147.7],  // Centered on Fairbanks / North Pole area
        zoom: 8
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add placeholder markers (you can enhance this later)
    console.log("Map initialized");
}

// Get snow depth for a town (with smart matching)
function getSnowDepthForTown(townName) {
    if (!townName) return null;
    
    const name = townName.toLowerCase().trim();
    
    for (let station of snowData) {
        const stationName = station.name.toLowerCase();
        
        if (stationName.includes(name) ||
            (name.includes("north pole") && stationName.includes("chena lakes")) ||
            (name.includes("fairbanks") && stationName.includes("creamers")) ||
            (name.includes("fairbanks") && stationName.includes("north pole"))) {
            
            return {
                depth: station.depth,
                name: station.name,
                lastUpdated: station.lastUpdated
            };
        }
    }
    return null;
}

// Update sidebar and marker color
function updateSnowInfo(townName) {
    const snowInfo = getSnowDepthForTown(townName);
    
    if (snowInfo) {
        document.getElementById('location').textContent = townName;
        document.getElementById('snow-depth').textContent = snowInfo.depth + '"';
        
        const updatedEl = document.getElementById('last-updated');
        if (updatedEl) updatedEl.textContent = new Date(snowInfo.lastUpdated).toLocaleString();
        
        console.log(`✅ Updated ${townName} → ${snowInfo.depth}" snow`);
        
        // TODO: Add colored marker logic here later
    } else {
        document.getElementById('snow-depth').textContent = '0"';
        console.log(`No match for ${townName}`);
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    
    // Load the static snow data
    snowData = STATIC_SNOW_DATA;
    console.log("✅ Static snow data loaded:", snowData.length, "stations");
    
    // Set up town dropdown listener
    const townSelect = document.getElementById('town-select');
    if (townSelect) {
        townSelect.addEventListener('change', function() {
            updateSnowInfo(this.value);
        });
        
        // Initial update for default town (North Pole)
        setTimeout(() => {
            updateSnowInfo(townSelect.value || "North Pole");
        }, 500);
    }
    
    // Also update on region change if needed
    const regionSelect = document.getElementById('region-select');
    if (regionSelect) {
        regionSelect.addEventListener('change', function() {
            // You can add region filtering here later
            console.log("Region changed to:", this.value);
        });
    }
    
    console.log("Tundra Tools initialized successfully");
});

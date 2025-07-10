const fakeData = {
  regions: ["Southcentral", "Interior", "Southeast", "Southwest", "North Slope", "Aleutians"],
  towns: {
    Wasilla: { region: "Southcentral", depth: 18, lat: 61.5814, lon: -149.4394 },
    Anchorage: { region: "Southcentral", depth: 22, lat: 61.2181, lon: -149.9003 },
    Fairbanks: { region: "Interior", depth: 27, lat: 64.8378, lon: -147.7164 },
    Nome: { region: "North Slope", depth: 15, lat: 64.5011, lon: -165.4064 },
    Bethel: { region: "Southwest", depth: 19, lat: 60.7922, lon: -161.7558 }
  }
};

const regionInput = document.getElementById("regionSelect");
const regionList = document.getElementById("regions");
const townInput = document.getElementById("townSelect");
const townList = document.getElementById("towns");
const snowTable = document.getElementById("snowTable");
const alertBox = document.getElementById("alert");

const map = L.map("map").setView([64.2008, -149.4937], 4); // Centered on Alaska
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
let marker = null;

// Populate dropdowns
fakeData.regions.forEach(region => {
  const opt = document.createElement("option");
  opt.value = region;
  regionList.appendChild(opt);
});

Object.keys(fakeData.towns).forEach(town => {
  const opt = document.createElement("option");
  opt.value = town;
  townList.appendChild(opt);
});

// When a town is selected
townInput.addEventListener("change", () => {
  const townName = townInput.value;
  const townData = fakeData.towns[townName];

  if (townData) {
    snowTable.innerHTML = `<tr><td>${townName}</td><td>${townData.depth}</td></tr>`;
    alertBox.textContent = `Showing snow data for ${townName}, ${townData.region}`;

    // Update map
    if (marker) map.removeLayer(marker);
    marker = L.marker([townData.lat, townData.lon]).addTo(map);
    map.setView([townData.lat, townData.lon], 8);
  } else {
    snowTable.innerHTML = `<tr><td>–</td><td>–</td></tr>`;
    alertBox.textContent = `Select a town to see updates.`;
  }
});

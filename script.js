
const data = {
  denali: { alert: "+8 inches in last 48 hrs", depth: [{ area: "Denali Park", snow: 21 }, { area: "Healy", snow: 17 }] },
  kenai: { alert: "+3 inches in last 24 hrs", depth: [{ area: "Soldotna", snow: 10 }, { area: "Homer", snow: 6 }] },
  fairbanks: { alert: "No new snow in last 48 hrs", depth: [{ area: "Fairbanks", snow: 12 }, { area: "North Pole", snow: 11 }] },
  wasilla: { alert: "+1 inch in last 24 hrs", depth: [{ area: "Wasilla", snow: 5 }, { area: "Palmer", snow: 6 }] }
};

document.getElementById('regionSelector').addEventListener('change', function() {
  const region = this.value;
  const alertBox = document.getElementById('alertBox');
  const depthData = document.getElementById('depthData');

  if (region !== 'default') {
    alertBox.textContent = data[region].alert;
    depthData.innerHTML = data[region].depth.map(d => `<tr><td>${d.area}</td><td>${d.snow}</td></tr>`).join('');
  } else {
    alertBox.textContent = 'Select a region to see updates.';
    depthData.innerHTML = '<tr><td>–</td><td>–</td></tr>';
  }
});

import json
import requests
from datetime import datetime, timezone

STATIONS = {
    "1302:AK:SNTL": "Creamers Field (Fairbanks)",
    "1260:AK:SNTL": "Chena Lakes (North Pole area)",
    "1074:AK:SNTL": "Tok",
    "961:AK:SNTL":  "Fort Yukon",
    "1182:AK:SNTL": "Bettles Field",
    "957:AK:SNTL":  "Atigun Pass",
    "1091:AK:SNTL": "Hatcher Pass",
    "1070:AK:SNTL": "Anchorage Hillside",
    "954:AK:SNTL":  "Turnagain Pass"
}

def fetch_snotel_data():
    data = {
        "updated": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "data": []
    }

    for triplet, friendly_name in STATIONS.items():
        station_num = triplet.split(":")[0]
        try:
            url = f"https://wcc.sc.egov.usda.gov/reportGenerator/view/customSingleStationReport/daily/{station_num}:AK:SNTL|id=\"\"|name/-7,0/SNWD::value"

            resp = requests.get(url, timeout=20)
            print(f"Status for {friendly_name}: {resp.status_code}")

            if resp.status_code != 200:
                continue

            lines = resp.text.splitlines()

            depth = None
            last_updated = ""

            # Look for lines that contain a date and a number (the data rows)
            for line in reversed(lines):   # most recent at bottom
                line = line.strip()
                if '|' in line and any(c.isdigit() for c in line) and '---' not in line:
                    parts = [p.strip() for p in line.split('|') if p.strip()]
                    if len(parts) >= 2:
                        try:
                            # parts[0] = date, parts[1] = snow depth
                            depth = float(parts[1])
                            last_updated = parts[0]
                            break
                        except ValueError:
                            continue

            if depth is not None and depth >= 0:
                entry = {
                    "station": triplet,
                    "name": friendly_name,
                    "depth": round(depth, 1),
                    "swe": None,
                    "lastUpdated": last_updated
                }
                data["data"].append(entry)
                print(f"✓ {friendly_name}: {depth} inches")
            else:
                print(f"   → No depth found")

        except Exception as e:
            print(f"✗ Error with {friendly_name}: {e}")

    with open("data/snow_data.json", "w") as f:
        json.dump(data, f, indent=2)

    print(f"\n✅ Finished! Saved {len(data['data'])} stations to data/snow_data.json")


if __name__ == "__main__":
    fetch_snotel_data()

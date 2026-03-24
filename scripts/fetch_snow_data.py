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
            # Reliable CSV Report Generator (much more stable than JSON)
            url = f"https://wcc.sc.egov.usda.gov/reportGenerator/view/customSingleStationReport/daily/{station_num}:AK:SNTL|id=\"\"|name/-7,0/SNWD::value?outputFormat=csv"

            resp = requests.get(url, timeout=20)
            print(f"Status for {friendly_name}: {resp.status_code}")

            if resp.status_code != 200:
                print(f"   → Bad status")
                continue

            lines = resp.text.strip().split('\n')
            if len(lines) < 3:
                print(f"   → Too few lines")
                continue

            # Skip header rows, find the last data row
            latest_line = lines[-1]
            if ',' not in latest_line:
                print(f"   → No comma-separated data")
                continue

            parts = latest_line.split(',')
            if len(parts) >= 2:
                try:
                    # Usually column 1 is Date, column 2 is SNWD value
                    depth_str = parts[1].strip()
                    depth = float(depth_str) if depth_str not in ['---', ''] else None

                    if depth is not None and depth >= 0:
                        entry = {
                            "station": triplet,
                            "name": friendly_name,
                            "depth": round(depth, 1),
                            "swe": None,
                            "lastUpdated": parts[0].strip() if len(parts) > 0 else ""
                        }
                        data["data"].append(entry)
                        print(f"✓ {friendly_name}: {depth} inches")
                    else:
                        print(f"   → No valid depth")
                except ValueError:
                    print(f"   → Could not parse depth")
            else:
                print(f"   → Not enough columns")

        except Exception as e:
            print(f"✗ Error with {friendly_name}: {e}")

    with open("data/snow_data.json", "w") as f:
        json.dump(data, f, indent=2)

    print(f"\n✅ Finished! Saved {len(data['data'])} stations to data/snow_data.json")


if __name__ == "__main__":
    fetch_snotel_data()

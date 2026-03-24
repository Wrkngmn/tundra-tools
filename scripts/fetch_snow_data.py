import json
import requests
from datetime import datetime, timezone

# Stations we care about for Alaska (especially Interior / Fairbanks area)
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
        try:
            # Official Report Generator - very reliable for current daily snow depth
            station_id = triplet.split(":")[0]   # e.g. 1302
            url = f"https://wcc.sc.egov.usda.gov/reportGenerator/view/custom/snowpack/siteReport?site={station_id}&report=daily&timeZone=AKST&outputFormat=json"

            resp = requests.get(url, timeout=15)
            print(f"Status for {friendly_name} ({triplet}): {resp.status_code}")

            if resp.status_code != 200:
                continue

            report = resp.json()

            # Navigate the report structure to find latest SNWD (snow depth)
            if not report or len(report) == 0:
                continue

            # Usually the first element contains the data rows
            rows = report[0].get("data", []) if isinstance(report[0], dict) else []

            if not rows:
                print(f"✗ No rows for {friendly_name}")
                continue

            # Take the most recent row
            latest = rows[-1]
            # Columns are usually: Date, Snow Depth (in), SWE (in), etc.
            depth = None
            for key, value in latest.items():
                if "Snow Depth" in key or "SNWD" in key.upper():
                    try:
                        depth = float(value)
                        break
                    except (ValueError, TypeError):
                        pass

            if depth is not None:
                entry = {
                    "station": triplet,
                    "name": friendly_name,
                    "depth": round(depth, 1),
                    "swe": None,
                    "lastUpdated": latest.get("Date", "")
                }
                data["data"].append(entry)
                print(f"✓ {friendly_name}: {depth} inches")
            else:
                print(f"✗ Could not find Snow Depth in report for {friendly_name}")

        except Exception as e:
            print(f"✗ Error with {friendly_name} ({triplet}): {e}")

    # Always save the file so the site doesn't break
    with open("data/snow_data.json", "w") as f:
        json.dump(data, f, indent=2)

    print(f"\n✅ Finished! Saved {len(data['data'])} stations to data/snow_data.json")


if __name__ == "__main__":
    fetch_snotel_data()

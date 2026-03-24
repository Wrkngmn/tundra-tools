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
            url = f"https://wcc.sc.egov.usda.gov/reportGenerator/view/customSingleStationReport/daily/{station_num}:AK:SNTL|id=\"\"|name/-7,0/SNWD::value?outputFormat=json"

            resp = requests.get(url, timeout=20)
            print(f"Status for {friendly_name}: {resp.status_code}")

            if resp.status_code != 200:
                print(f"   → Bad status")
                continue

            # Try to parse as JSON
            try:
                report = resp.json()
                print(f"   → Successfully parsed JSON for {friendly_name}")
            except json.JSONDecodeError:
                print(f"   → Not JSON (got HTML or error page)")
                print("   → First 400 characters of response:")
                print(repr(resp.text[:400]))
                continue

            if not report or len(report) == 0:
                print(f"   → Empty report")
                continue

            rows = report[0].get("data", []) if isinstance(report[0], dict) else []

            if not rows:
                print(f"   → No data rows")
                continue

            latest = rows[-1]
            depth = None
            for key, value in latest.items():
                if "SNWD" in key or "Snow Depth" in key:
                    try:
                        depth = float(value)
                        break
                    except (ValueError, TypeError):
                        pass

            if depth is not None and depth >= 0:
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
                print(f"   → No valid snow depth found")

        except Exception as e:
            print(f"✗ Error with {friendly_name}: {e}")

    with open("data/snow_data.json", "w") as f:
        json.dump(data, f, indent=2)

    print(f"\n✅ Finished! Saved {len(data['data'])} stations to data/snow_data.json")


if __name__ == "__main__":
    fetch_snotel_data()

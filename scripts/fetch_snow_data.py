import json
import requests
from datetime import datetime

STATIONS = [
    "1070:AK:SNTL",  # Anchorage Hillside
    "1062:AK:SNTL",  # Anchor River Divide
    "957:AK:SNTL",   # Atigun Pass
    "1182:AK:SNTL",  # Bettles Field
    "961:AK:SNTL",   # Fort Yukon
    "1091:AK:SNTL",  # Hatcher Pass
    "966:AK:SNTL",   # Kenai Moose Pass
    "1103:AK:SNTL",  # Mt. Alyeska
    "954:AK:SNTL",   # Turnagain Pass
    "1074:AK:SNTL",  # Tok
    "1302:AK:SNTL",  # Creamers Field (Fairbanks)
    "1260:AK:SNTL",  # Chena Lakes
    "1099:AK:SNTL",  # Independence Mine
    "1064:AK:SNTL",  # Mt. Eyak
    "1303:AK:SNTL"   # Dahl Creek
]

def fetch_snotel_data():
    base_url = "https://wcc.sc.egov.usda.gov/awdbRestApi/api/v1"
    data = {
        "updated": datetime.utcnow().isoformat() + "Z",
        "data": []
    }

    for triplet in STATIONS:
        try:
            url = f"{base_url}/station/{triplet}/element/SNWD?beginDate=2026-03-20&endDate=2026-03-24&unit=english"
            resp = requests.get(url, timeout=20)
            resp.raise_for_status()
            values = resp.json()

            if not values:
                continue

            latest = values[-1]
            depth = latest.get("value")

            # Get station name
            info = requests.get(f"{base_url}/station/{triplet}", timeout=10).json()
            name = info.get("name", triplet.split(":")[0])

            data["data"].append({
                "station": triplet,
                "name": name,
                "depth": round(depth, 1) if depth is not None else 0,
                "swe": None,
                "lastUpdated": latest.get("date")
            })

            print(f"✓ {name}: {depth} inches")

        except Exception as e:
            print(f"✗ Error with {triplet}: {e}")

    with open("data/snow_data.json", "w") as f:
        json.dump(data, f, indent=2)

    print(f"\n✅ Finished! Saved {len(data['data'])} stations.")

if __name__ == "__main__":
    fetch_snotel_data()

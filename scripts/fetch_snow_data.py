import json
import requests
from datetime import datetime

STATIONS = [
    "1070:AK:SNTL",  # Anchorage Hillside
    "1062:AK:SNTL",
    "957:AK:SNTL",
    "1182:AK:SNTL",
    "961:AK:SNTL",
    "1091:AK:SNTL",
    "966:AK:SNTL",
    "1103:AK:SNTL",
    "954:AK:SNTL",
    "1074:AK:SNTL",
    "1302:AK:SNTL",  # Creamers Field (Fairbanks)
    "1260:AK:SNTL",  # Chena Lakes (near North Pole)
    "1099:AK:SNTL",
    "1064:AK:SNTL",
    "1303:AK:SNTL"
]

def fetch_snotel_data():
    base_url = "https://wcc.sc.egov.usda.gov/awdbRestApi/api/v1"
    
    data = {
        "updated": datetime.utcnow().isoformat() + "Z",
        "data": []
    }

    for triplet in STATIONS:
        try:
            # Correct current endpoint for daily snow depth (SNWD)
            url = f"{base_url}/data?station={triplet}&element=SNWD&beginDate=2026-03-20&endDate=2026-03-24&unit=english&ordinal=1"
            
            resp = requests.get(url, timeout=20)
            resp.raise_for_status()
            values = resp.json()

            if not values or len(values) == 0:
                print(f"✗ No data returned for {triplet}")
                continue

            latest = values[-1]
            depth = latest.get("value")

            # Get station name
            info_url = f"{base_url}/station/{triplet}"
            info_resp = requests.get(info_url, timeout=10)
            name = info_resp.json().get("name", triplet) if info_resp.ok else triplet

            entry = {
                "station": triplet,
                "name": name,
                "depth": round(depth, 1) if depth is not None else 0,
                "swe": None,
                "lastUpdated": latest.get("date")
            }

            data["data"].append(entry)
            print(f"✓ {name}: {depth} inches")

        except Exception as e:
            print(f"✗ Error with {triplet}: {e}")

    # Save file
    with open("data/snow_data.json", "w") as f:
        json.dump(data, f, indent=2)

    print(f"\n✅ Finished! Saved {len(data['data'])} stations to data/snow_data.json")


if __name__ == "__main__":
    fetch_snotel_data()

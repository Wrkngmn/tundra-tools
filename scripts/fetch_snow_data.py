import json
import requests
from datetime import datetime

# Your 15 stations (kept the good Interior/Fairbanks ones)
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
    "1302:AK:SNTL",  # Creamers Field (Fairbanks) - very close to North Pole
    "1260:AK:SNTL",  # Chena Lakes (near North Pole/Fairbanks)
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
            # New correct endpoint for daily snow depth (SNWD)
            url = f"{base_url}/data?station={triplet}&element=SNWD&beginDate=2026-03-20&endDate=2026-03-24&unit=english&ordinal=1"
            
            resp = requests.get(url, timeout=20)
            resp.raise_for_status()
            values = resp.json()

            if not values or not isinstance(values, list) or len(values) == 0:
                print(f"✗ No data for {triplet}")
                continue

            # Take the most recent value
            latest = values[-1]
            depth = latest.get("value")

            # Get station metadata (name, etc.)
            info_url = f"{base_url}/station/{triplet}"
            info_resp = requests.get(info_url, timeout=10)
            info = info_resp.json() if info_resp.status_code == 200 else {}
            name = info.get("name", triplet.split(":")[0])

            entry = {
                "station": triplet,
                "name": name,
                "depth": round(depth, 1) if depth is not None else 0,
                "swe": None,                    # We can add SWE later if needed
                "lastUpdated": latest.get("date")
            }

            data["data"].append(entry)
            print(f"✓ {name}: {depth} inches")

        except Exception as e:
            print(f"✗ Error with {triplet}: {e}")

    # Save to the correct path (relative to the script)
    with open("data/snow_data.json", "w") as f:
        json.dump(data, f, indent=2)

    print(f"\n✅ Finished! Saved {len(data['data'])} stations to data/snow_data.json")


if __name__ == "__main__":
    fetch_snotel_data()

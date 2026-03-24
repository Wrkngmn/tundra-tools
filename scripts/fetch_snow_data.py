import json
import requests
from datetime import datetime

# Focused on Interior Alaska stations near your towns (especially Fairbanks/North Pole area)
STATIONS = [
    "1302:AK:SNTL",  # Creamers Field - Fairbanks
    "1260:AK:SNTL",  # Chena Lakes - very close to North Pole
    "1074:AK:SNTL",  # Tok
    "961:AK:SNTL",   # Fort Yukon
    "1182:AK:SNTL",  # Bettles Field
    "957:AK:SNTL",   # Atigun Pass
    "1091:AK:SNTL",  # Hatcher Pass
    "1070:AK:SNTL",  # Anchorage Hillside
    "954:AK:SNTL",   # Turnagain Pass
]

def fetch_snotel_data():
    base_url = "https://wcc.sc.egov.usda.gov/awdbRestApi/api/v1"

    data = {
        "updated": datetime.utcnow().isoformat() + "Z",
        "data": []
    }

    for triplet in STATIONS:
        try:
            # Simpler endpoint that many projects are successfully using in 2026
            url = f"{base_url}/data?stationTriplets={triplet}&elements=SNWD&beginDate=2026-03-20&endDate=2026-03-24&unit=english"

            resp = requests.get(url, timeout=15)
            if resp.status_code != 200:
                print(f"✗ HTTP {resp.status_code} for {triplet}")
                continue

            values = resp.json()

            if not values or len(values) == 0:
                print(f"✗ No data returned for {triplet}")
                continue

            # Response is usually a list; each item has 'values' list
            for station_entry in values:
                element_values = station_entry.get('values', [])
                if not element_values:
                    continue

                latest = element_values[-1]
                depth = latest.get("value")

                # Get name
                name = station_entry.get('stationName', triplet)

                entry = {
                    "station": triplet,
                    "name": name,
                    "depth": round(float(depth), 1) if depth is not None else 0,
                    "swe": None,
                    "lastUpdated": latest.get("date")
                }

                data["data"].append(entry)
                print(f"✓ {name}: {depth} inches")
                break  # one entry per station

        except Exception as e:
            print(f"✗ Error with {triplet}: {e}")

    with open("data/snow_data.json", "w") as f:
        json.dump(data, f, indent=2)

    print(f"\n✅ Finished! Saved {len(data['data'])} stations.")

if __name__ == "__main__":
    fetch_snotel_data()

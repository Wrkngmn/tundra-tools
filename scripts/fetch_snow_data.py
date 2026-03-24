import json
import requests
from datetime import datetime, timezone

# Focused on reliable Interior Alaska stations (including Fairbanks area)
STATIONS = [
    "1302:AK:SNTL",  # Creamers Field - Fairbanks
    "1260:AK:SNTL",  # Chena Lakes - near North Pole
    "1074:AK:SNTL",  # Tok
    "961:AK:SNTL",   # Fort Yukon
    "1182:AK:SNTL",  # Bettles Field
    "957:AK:SNTL",   # Atigun Pass
    "1091:AK:SNTL",  # Hatcher Pass
    "1070:AK:SNTL",  # Anchorage Hillside
    "954:AK:SNTL",   # Turnagain Pass
]

def fetch_snotel_data():
    # Current working base for the REST API
    base_url = "https://wcc.sc.egov.usda.gov/awdbRestApi/api/v1"

    data = {
        "updated": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "data": []
    }

    for triplet in STATIONS:
        try:
            # This is the currently reliable endpoint format
            url = (
                f"{base_url}/data"
                f"?stationTriplets={triplet}"
                f"&elements=SNWD"
                f"&beginDate=2026-03-20"
                f"&endDate=2026-03-24"
                f"&unit=english"
            )

            resp = requests.get(url, timeout=20)
            print(f"Status for {triplet}: {resp.status_code}")

            if resp.status_code != 200:
                continue

            values = resp.json()

            if not values or len(values) == 0:
                print(f"✗ No data array for {triplet}")
                continue

            # Parse the response structure
            for station_entry in values:
                element_values = station_entry.get("values", [])
                if not element_values:
                    continue

                latest = element_values[-1]
                depth = latest.get("value")

                name = station_entry.get("stationName", triplet.split(":")[0])

                if depth is not None:
                    entry = {
                        "station": triplet,
                        "name": name,
                        "depth": round(float(depth), 1),
                        "swe": None,
                        "lastUpdated": latest.get("date")
                    }
                    data["data"].append(entry)
                    print(f"✓ {name}: {depth} inches")
                    break

        except Exception as e:
            print(f"✗ Error with {triplet}: {e}")

    # Always write the file (even if empty, so site doesn't break)
    with open("data/snow_data.json", "w") as f:
        json.dump(data, f, indent=2)

    print(f"\n✅ Finished! Saved {len(data['data'])} stations to data/snow_data.json")


if __name__ == "__main__":
    fetch_snotel_data()

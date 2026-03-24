import json
import requests
from datetime import datetime, timedelta

# List of Alaska SNOTEL stations (you can expand this later)
ALASKA_STATIONS = [
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
    # Add more triplets here as needed
]

def fetch_snotel_data():
    base_url = "https://wcc.sc.egov.usda.gov/awdbRestApi/api/v1"
    end_date = datetime.utcnow()
    begin_date = end_date - timedelta(days=2)  # Get last 48 hours to be safe

    data = {
        "updated": end_date.isoformat() + "Z",
        "data": []
    }

    for triplet in ALASKA_STATIONS:
        try:
            # Fetch Snow Depth (SNWD)
            depth_url = f"{base_url}/station/{triplet}/element/SNWD?beginDate={begin_date.date()}&endDate={end_date.date()}&unit=english"
            depth_resp = requests.get(depth_url, timeout=15)
            depth_resp.raise_for_status()
            depth_values = depth_resp.json()

            # Fetch Snow Water Equivalent (WTEQ)
            swe_url = f"{base_url}/station/{triplet}/element/WTEQ?beginDate={begin_date.date()}&endDate={end_date.date()}&unit=english"
            swe_resp = requests.get(swe_url, timeout=15)
            swe_values = swe_resp.json()

            latest_depth = depth_values[-1]["value"] if depth_values else None
            latest_swe = swe_values[-1]["value"] if swe_values else None
            latest_date = depth_values[-1]["date"] if depth_values else None

            # Get friendly station name
            station_info = requests.get(f"{base_url}/station/{triplet}", timeout=10).json()
            name = station_info.get("name", triplet.split(":")[0])

            data["data"].append({
                "station": triplet,
                "name": name,
                "depth": round(latest_depth, 1) if latest_depth is not None else None,
                "swe": round(latest_swe, 1) if latest_swe is not None else None,
                "lastUpdated": latest_date
            })

        except Exception as e:
            print(f"Error fetching {triplet}: {e}")
            continue

    # Save to file
    with open("data/snow_data.json", "w") as f:
        json.dump(data, f, indent=2)

    print(f"✅ Successfully fetched data for {len(data['data'])} stations at {datetime.utcnow()}")

if __name__ == "__main__":
    fetch_snotel_data()


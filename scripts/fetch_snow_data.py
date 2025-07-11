import json
from datetime import datetime

def fetch_dummy_snow_data():
    # This is dummy data; real SNOTEL integration comes later
    snow_data = [
        {"town": "Anchorage", "depth": 12},
        {"town": "Fairbanks", "depth": 18},
        {"town": "Juneau", "depth": 8}
    ]

    with open("data/snow_data.json", "w") as f:
        json.dump({
            "updated": datetime.utcnow().isoformat() + "Z",
            "data": snow_data
        }, f, indent=2)

if __name__ == "__main__":
    fetch_dummy_snow_data()


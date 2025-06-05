import os
import requests
from dotenv import load_dotenv

load_dotenv()

def get_google_info(address, place, home_address):
    """
    Retrieves the place ID, Google Maps URL link, a photo, and distance from home address for a given address.
    Args:
        address (str): The full address of the place to search for.
        place (str): The name of the place.
        home_address (str): The full home address to calculate the distance to the place.
    Returns:
        dict: A dictionary containing the place ID, Google Maps URL link, a photo, and the distance and duration to home address for the given address.
    """
    API_KEY = os.getenv('REACT_APP_placesAPIKey', '')
    if not API_KEY:
        return {"placeID": None, "mapsLink": None, "photoURL": None, "distance": "Missing API Key", "duration": None}

    base_url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
    distance_url = "https://maps.googleapis.com/maps/api/distancematrix/json"
    params = {
        "input": f"{place} {address}",
        "inputtype": "textquery",
        "fields": "place_id",
        "key": API_KEY
    }

    try:
        response = requests.get(base_url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as e:
        return {"placeID": None, "mapsLink": None, "photoURL": None, "distance": f"Request error: {e}", "duration": None}
    except ValueError:
        return {"placeID": None, "mapsLink": None, "photoURL": None, "distance": "Invalid JSON response", "duration": None}

    if data.get("status") != "OK":
        return {"placeID": None, "mapsLink": None, "photoURL": None, "distance": f"API error: {data.get('status')}", "duration": None}

    candidates = data.get("candidates", [])
    if not candidates:
        return {"placeID": None, "mapsLink": None, "photoURL": None, "distance": "No place found", "duration": None}

    place_id = candidates[0].get("place_id")
    google_maps_link = f"https://www.google.com/maps/place/?q=place_id:{place_id}"

    # Get the photo
    photo_url = None
    details_url = "https://maps.googleapis.com/maps/api/place/details/json"
    details_params = {
        "place_id": place_id,
        "fields": "photo",
        "key": API_KEY
    }
    try:
        details_response = requests.get(details_url, params=details_params, timeout=10)
        details_response.raise_for_status()
        details_data = details_response.json()
        photos = details_data.get("result", {}).get("photos", [])
        if photos:
            photo_reference = photos[0].get("photo_reference")
            if photo_reference:
                photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={API_KEY}"
    except requests.RequestException:
        photo_url = None
    except ValueError:
        photo_url = None

    # Get the distance
    distance = "Unavailable"
    duration = "Unavailable"
    distance_params = {
        "origins": home_address,
        "destinations": address,
        "key": API_KEY,
        "units": "imperial"
    }
    try:
        distance_response = requests.get(distance_url, params=distance_params, timeout=10)
        distance_response.raise_for_status()
        distance_data = distance_response.json()
        if distance_data.get("status") == "OK":
            elements = distance_data.get("rows", [{}])[0].get("elements", [{}])
            if elements and elements[0].get("status") == "OK":
                distance = elements[0].get("distance", {}).get("text", "Unavailable")
                duration = elements[0].get("duration", {}).get("text", "Unavailable")
            else:
                distance = "No route found"
                duration = "No route found"
        else:
            distance = f"Distance API error: {distance_data.get('status')}"
            duration = None
    except requests.RequestException as e:
        distance = f"Distance request error: {e}"
        duration = None
    except ValueError:
        distance = "Invalid distance JSON"
        duration = None

    return {
        "placeID": place_id,
        "mapsLink": google_maps_link,
        "photoURL": photo_url,
        "distance": distance,
        "duration": duration
    }

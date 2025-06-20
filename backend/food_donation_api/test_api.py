import requests
import json
from datetime import datetime, timedelta

# API endpoint
base_url = 'http://localhost:8000/api'

def test_create_food_donation():
    # Endpoint for creating food donation
    url = f'{base_url}/donations/'
    
    # Sample food donation data
    donation_data = {
        "donor_id": "donor123",
        "food_type": "Cooked Food",
        "quantity": "25 meals",
        "pickup_address": "123 Test Street, Test City",
        "expiry_time": (datetime.now() + timedelta(hours=4)).isoformat(),
        "description": "Fresh cooked meals including rice and curry",
        "donor_name": "Test Restaurant",
        "donor_phone": "1234567890",
        "preferences": {
            "pickup_time": "14:00-16:00",
            "packaging": "Available in containers"
        }
    }
    
    try:
        # Make POST request
        response = requests.post(url, json=donation_data)
        
        # Print response status and data
        print("\nStatus Code:", response.status_code)
        print("\nResponse Body:")
        print(json.dumps(response.json(), indent=2))
        
        if response.status_code == 201:
            print("\n✅ Food donation created successfully!")
        else:
            print("\n❌ Failed to create food donation")
            
    except requests.exceptions.RequestException as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    print("Testing Food Donation API...")
    test_create_food_donation()

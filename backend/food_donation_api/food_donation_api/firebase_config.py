import os
import json
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# Load environment variables from .env file
load_dotenv()

service_account_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")

if service_account_json:
    cred = credentials.Certificate(json.loads(service_account_json))
else:
    raise RuntimeError("Firebase service account credentials not set in environment variables.")

firebase_admin.initialize_app(cred)
db = firestore.client()

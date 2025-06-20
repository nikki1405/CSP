import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

service_account_path = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON_PATH")
service_account_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")

if service_account_json:
    cred = credentials.Certificate(json.loads(service_account_json))
elif service_account_path:
    cred = credentials.Certificate(service_account_path)
else:
    raise RuntimeError("Firebase service account credentials not set in environment variables.")

firebase_admin.initialize_app(cred)

db = firestore.client()

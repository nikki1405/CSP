import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin with your service account
cred = credentials.Certificate("path/to/your/serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# Initialize Firestore client
db = firestore.client()

# auth_utils.py
import firebase_admin
from firebase_admin import credentials, auth

if not firebase_admin._apps:
    cred = credentials.Certificate("firebase-adminsdk.json")
    firebase_admin.initialize_app(cred)

def verify_token(id_token):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token.get('email')
    except Exception as e:
        print("Token verification failed:", e)
        return None

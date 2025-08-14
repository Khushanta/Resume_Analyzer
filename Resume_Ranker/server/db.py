from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Use environment variable for Mongo URI
MONGO_URI = os.getenv("MONGO_URI")

# Connect to MongoDB Atlas
client = MongoClient(MONGO_URI)
db = client.resume_ranker
history_collection = db.history

def save_match_history(email, resume, jd, score, keywords, justification=None):
    history_collection.insert_one({
        "email": email,
        "resume": resume[:100000],  # Store first 1000 characters for space efficiency
        "job_description": jd[:100000],
        "score": round(score * 100, 2),
        "keywords": keywords,
        "justification": justification,
        "timestamp": datetime.utcnow()
    })

def get_match_history(email):
    cursor = history_collection.find({"email": email}).sort("timestamp", -1)
    history = []
    for doc in cursor:
        history.append({
            "score": doc.get("score"),
            "keywords": doc.get("keywords"),
            "justification": doc.get("justification", ""),
            "timestamp": doc["timestamp"].strftime("%Y-%m-%d %H:%M:%S")
        })
    return history

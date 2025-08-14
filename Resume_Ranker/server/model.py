import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()  # Loads environment variables from .env

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("models/gemini-1.5-flash")

def extract_skills_from_text(text):
    prompt = f"""Extract all relevant hard and soft skills from the following text.
    Respond with a comma-separated list only.

    Text: {text}
    """

    try:
        response = model.generate_content(prompt)
        skills = response.text.strip().split(",")
        return [skill.strip() for skill in skills if skill.strip()]
    except Exception as e:
        print("Gemini skill extraction failed:", e)
        return []

def calculate_match_score(resume_text, jd_text):
    resume_skills = extract_skills_from_text(resume_text)
    jd_skills = extract_skills_from_text(jd_text)

    if not resume_skills or not jd_skills:
        return 0.0, []

    matched_skills = list(set(resume_skills) & set(jd_skills))
    score = len(matched_skills) / len(jd_skills)

    return score, matched_skills


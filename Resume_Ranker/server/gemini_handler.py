import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()  # Load .env
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def extract_skills_with_gemini(jd_text, resume_text):
    prompt = f"""
    JD:
    {jd_text}

    Resume:
    {resume_text}

    Perform the following:
    1. Extract all required skills from JD.
    2. Extract all technical related skills from the resume.
    3. Compare them and provide a matching score out of 100.
    4. Justify the score in 1–2 lines.

    Respond only in valid JSON with keys:
    - jd_skills
    - resume_skills
    - score
    - justification
    """

    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)

    try:
        return eval(response.text)
    except Exception as e:
        print("Failed to parse AI response:", e)
        return {
            "jd_skills": [],
            "resume_skills": [],
            "score": 0,
            "justification": "Parsing failed"
        }

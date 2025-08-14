from flask import Flask, request, jsonify
from flask_cors import CORS
from model import calculate_match_score
from db import save_match_history, get_match_history
from auth_utils import verify_token
import fitz  # PyMuPDF
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def extract_pdf_text(filepath):
    try:
        text = ""
        with fitz.open(filepath) as doc:
            for page in doc:
                text += page.get_text()
        return text
    except Exception as e:
        print(f"PDF extraction failed: {e}")
        return ""


@app.route('/')
def index():
    return jsonify({"message": "Resume Ranker API running"}), 200


@app.route('/api/history', methods=['GET'])
def get_history():
    id_token = request.headers.get('Authorization')
    email = verify_token(id_token)

    if not email:
        return jsonify({'error': 'Unauthorized'}), 401

    # Optional: match token email and param email
    query_email = request.args.get('email')
    if query_email and query_email != email:
        return jsonify({'error': 'Forbidden: Email mismatch'}), 403

    records = get_match_history(email)
    return jsonify(records), 200


@app.route('/api/upload', methods=['POST'])
def upload_resume_and_jd():
    id_token = request.headers.get('Authorization')
    email = verify_token(id_token)

    if not email:
        return jsonify({'error': 'Unauthorized'}), 401

    resume_file = request.files.get('resume')
    jd_file = request.files.get('job_description')

    if not resume_file or not jd_file:
        return jsonify({'error': 'Missing resume or job description file'}), 400

    if not (allowed_file(resume_file.filename) and allowed_file(jd_file.filename)):
        return jsonify({'error': 'Only PDF files are allowed'}), 400

    # Save resume
    resume_filename = f"resume_{secure_filename(resume_file.filename)}"
    resume_path = os.path.join(app.config['UPLOAD_FOLDER'], resume_filename)
    resume_file.save(resume_path)
    resume_text = extract_pdf_text(resume_path)

    # Save job description
    jd_filename = f"jd_{secure_filename(jd_file.filename)}"
    jd_path = os.path.join(app.config['UPLOAD_FOLDER'], jd_filename)
    jd_file.save(jd_path)
    jd_text = extract_pdf_text(jd_path)

    # Delete files after processing
    try:
        os.remove(resume_path)
        os.remove(jd_path)
    except Exception as cleanup_error:
        print(f"File cleanup error: {cleanup_error}")

    # Match calculation
    score, keywords = calculate_match_score(resume_text, jd_text)
    save_match_history(email, resume_text, jd_text, score, keywords)

    return jsonify({
        'match_score': round(score * 100, 2),
        'top_keywords': keywords
    }), 200


if __name__ == '__main__':
    app.run(debug=True)

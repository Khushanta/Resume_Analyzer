import { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { UploadCloud } from "lucide-react";
import { getAuth } from "firebase/auth";

const UploadResume = () => {
  const { user } = useAuth();
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [missingFiles, setMissingFiles] = useState(false);

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file?.type === "application/pdf") {
      setResumeFile(file);
      setMissingFiles(false);
    } else {
      setResumeFile(null);
      setResult(null);
      e.target.value = null;
    }
  };

  const handleJdChange = (e) => {
    const file = e.target.files[0];
    if (file?.type === "application/pdf") {
      setJdFile(file);
      setMissingFiles(false);
    } else {
      setJdFile(null);
      setResult(null);
      e.target.value = null;
    }
  };

  const handleUpload = async () => {
    if (!resumeFile || !jdFile || !user) {
      setMissingFiles(true);
      return;
    }

    try {
      setLoading(true);
      setMissingFiles(false);

      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("job_description", jdFile);
      formData.append("email", user.email);

      // 🔐 Get Firebase token
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken(true);

      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          Authorization: `${token}`,
        },
      });

      setResult(res.data);
    } catch (err) {
      console.error("Upload failed:", err);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <UploadCloud className="mx-auto w-12 h-12 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800 mt-2">Upload Resume & JD</h2>
          <p className="text-sm text-gray-500">PDFs only. We'll analyze your match.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Resume PDF</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeChange}
              className="file-input border border-gray-300 p-2 rounded-md"
            />
            {resumeFile && (
              <p className="text-sm mt-1 text-green-600">✔ {resumeFile.name}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Job Description PDF</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleJdChange}
              className="file-input border border-gray-300 p-2 rounded-md"
            />
            {jdFile && (
              <p className="text-sm mt-1 text-green-600">✔ {jdFile.name}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Upload & Match"}
        </button>

        {missingFiles && (
          <p className="text-red-600 mt-2 text-center text-sm">
            Please upload both Resume and JD.
          </p>
        )}

        {result && (
          <div className="mt-6 bg-gray-900 text-white p-4 rounded-lg shadow-md">
            <p className="mb-2 text-lg">
              <strong>Match Score:</strong> {result.match_score}%
            </p>
            <p className="text-sm">
              <strong>Top Keywords:</strong> {result.top_keywords.join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadResume;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/"); // ✅ navigate only after user state is set
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen max-w-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-10 rounded-xl shadow-md text-center space-y-6 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-gray-800">Resume Ranker</h1>
        <p className="text-gray-500">Sign in to continue</p>
        <button
          onClick={login}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;

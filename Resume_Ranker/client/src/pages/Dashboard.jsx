import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FileText, History, LogOut } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <p>Loading profile...</p>; // 🧠 Handle null safely

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-pink-200">
      <div className="bg-white p-10 rounded-xl shadow-lg w-[90%] max-w-xl text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Welcome, {user?.name}</h2>
        <p className="text-gray-600 mb-6">{user?.email}</p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/upload")}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FileText size={18} /> Rank My Resume
          </button>
          <button
            onClick={() => navigate("/history")}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <History size={18} /> View Match History
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            My Profile
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

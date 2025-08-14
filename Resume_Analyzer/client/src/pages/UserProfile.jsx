import { useAuth } from "../contexts/AuthContext";
import { LogOut, Edit3 } from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 to-blue-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center space-y-4">
        <div className="flex justify-center">
          <img
            src={user?.photo}
            alt="User"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow-md"
          />
        </div>

        <h2 className="text-xl font-semibold text-gray-800">{user?.name}</h2>
        <p className="text-gray-600 text-sm">{user?.email}</p>

        <div className="flex justify-center space-x-4 mt-4">
          <button
            className="flex items-center px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => alert("Edit Profile (future feature)")}
          >
            <Edit3 size={16} className="mr-2" />
            Edit Profile
          </button>

          <button
            onClick={logout}
            className="flex items-center px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </button>
        </div>

        <hr className="border-t mt-6" />

        <div className="text-sm text-gray-500 space-y-1 mt-4">
          <p>🎯 Matched resumes: <span className="font-medium text-gray-700">12</span></p>
          <p>📅 Joined: <span className="font-medium text-gray-700">June 2024</span></p>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Resume Expert</span>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Early User</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;

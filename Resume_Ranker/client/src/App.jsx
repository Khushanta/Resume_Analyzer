import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./contexts/AuthContext";
import MatchHistory from "./pages/MatchHistory";
import UploadResume from "./pages/UploadResume";
import UserProfile from "./pages/UserProfile";


function App() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/history"
        element={
          <PrivateRoute>
            <MatchHistory />
          </PrivateRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <PrivateRoute>
            <UploadResume />
          </PrivateRoute>
        }
      />
      {/* ✅ New Profile Route */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;

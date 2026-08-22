import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, logoutUser } from "../services/auth.api";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data.user);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to fetch profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return <h2>Loading profile...</h2>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>User Profile</h1>

      <p>
        <strong>Name:</strong>{" "}
        {user?.username || user?.name || "N/A"}
      </p>

      <p>
        <strong>Email:</strong>{" "}
        {user?.email || "N/A"}
      </p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Profile;
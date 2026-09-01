import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">BookIt</Link>
        <Link to="/">Resources</Link>
        {user && <Link to="/my-bookings">My Bookings</Link>}
        {user?.role === "ADMIN" && <Link to="/admin/resources">Manage Resources</Link>}
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span className="user-chip">{user.name} ({user.role})</span>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

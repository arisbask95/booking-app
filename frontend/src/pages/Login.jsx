import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("customer@booking.app");
  const [password, setPassword] = useState("Customer123!");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "login failed");
    }
  }

  return (
    <div className="card form-card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        <label>Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p className="hint">Seeded logins: admin@booking.app / Admin123! (admin), customer@booking.app / Customer123! (customer)</p>
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}

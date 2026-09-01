import { useEffect, useState } from "react";
import client from "../api/client";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  function load() {
    client
      .get("/bookings/me")
      .then((res) => setBookings(res.data))
      .catch(() => setError("could not load bookings"));
  }

  useEffect(load, []);

  async function handleCancel(id) {
    try {
      await client.patch(`/bookings/${id}/cancel`);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "cancel failed");
    }
  }

  return (
    <div>
      <h2>My bookings</h2>
      {error && <p className="error">{error}</p>}
      {bookings.length === 0 && <p className="muted">No bookings yet — go book a resource!</p>}
      <div className="grid">
        {bookings.map((b) => (
          <div key={b.id} className="card">
            <h3>{b.resource.name}</h3>
            <p>{new Date(b.startTime).toLocaleString()} → {new Date(b.endTime).toLocaleString()}</p>
            <p className="muted">Status: {b.status}</p>
            {b.status !== "CANCELLED" && (
              <button onClick={() => handleCancel(b.id)}>Cancel booking</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

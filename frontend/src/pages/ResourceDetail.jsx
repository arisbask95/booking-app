import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import ResourceIcon from "../components/ResourceIcon";
import { getResourceVisual, getResourceImageUrl } from "../utils/resourceVisuals";

function toLocalInput(date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

// Rounds "now" up to the next half hour, purely so the quick-pick buttons
// don't propose a start time that's already in the past.
function nextHalfHour() {
  const d = new Date();
  d.setSeconds(0, 0);
  const mins = d.getMinutes();
  d.setMinutes(mins < 30 ? 30 : 60);
  return d;
}

const DURATIONS = [
  { label: "30 min", hours: 0.5 },
  { label: "1 hour", hours: 1 },
  { label: "2 hours", hours: 2 },
  { label: "Half day", hours: 4 },
];

export default function ResourceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [resource, setResource] = useState(null);
  const [existingBookings, setExistingBookings] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [activeDuration, setActiveDuration] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function loadResource() {
    client.get(`/resources/${id}`).then((res) => setResource(res.data));
  }

  function loadAvailability() {
    client.get(`/resources/${id}/availability`).then((res) => setExistingBookings(res.data));
  }

  useEffect(() => {
    loadResource();
    loadAvailability();
  }, [id]);

  function applyQuickDuration(hours) {
    const start = nextHalfHour();
    const end = new Date(start.getTime() + hours * 60 * 60 * 1000);
    setStartTime(toLocalInput(start));
    setEndTime(toLocalInput(end));
    setActiveDuration(hours);
  }

  async function handleBook(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);
    try {
      await client.post("/bookings", { resourceId: id, startTime, endTime });
      setMessage("Booking confirmed!");
      loadAvailability();
    } catch (err) {
      setError(err.response?.data?.error || "booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (!resource) return <p>Loading...</p>;

  const visual = getResourceVisual(resource);
  const photoUrl = getResourceImageUrl(resource, visual);

  return (
    <div>
      <div
        className="detail-banner"
        style={{
          backgroundColor: visual.solid,
          backgroundImage: `linear-gradient(rgba(15,20,40,0.5), rgba(15,20,40,0.3)), url(${photoUrl})`,
        }}
      >
        <ResourceIcon icon={visual.icon} size={64} />
        <div>
          <span className="resource-badge">{visual.category}</span>
          <h2 style={{ margin: "8px 0 0" }}>{resource.name}</h2>
        </div>
      </div>

      <p>{resource.description}</p>
      <p className="muted">{resource.location} • capacity {resource.capacity} • €{resource.pricePerHour}/hr</p>

      <div className="card">
        <h3>Today's existing bookings</h3>
        {existingBookings.length === 0 && <p className="muted">No bookings yet today.</p>}
        <ul>
          {existingBookings.map((b, i) => (
            <li key={i}>{new Date(b.startTime).toLocaleString()} → {new Date(b.endTime).toLocaleString()} ({b.status})</li>
          ))}
        </ul>
      </div>

      {user ? (
        <div className="card form-card">
          <h3>Book this resource</h3>

          <label>Quick pick</label>
          <div className="quick-duration-row">
            {DURATIONS.map((d) => (
              <button
                type="button"
                key={d.label}
                className={`chip-btn ${activeDuration === d.hours ? "active" : ""}`}
                onClick={() => applyQuickDuration(d.hours)}
              >
                {d.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleBook}>
            <label>Start</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => { setStartTime(e.target.value); setActiveDuration(null); }}
              required
            />
            <label>End</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => { setEndTime(e.target.value); setActiveDuration(null); }}
              required
            />
            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}
            <button type="submit" disabled={submitting}>
              {submitting ? "Booking..." : "Book"}
            </button>
          </form>
        </div>
      ) : (
        <p><a href="/login">Log in</a> to book this resource.</p>
      )}
    </div>
  );
}

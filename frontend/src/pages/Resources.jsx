import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import ResourceIcon from "../components/ResourceIcon";
import { getResourceVisual, getResourceImageUrl } from "../utils/resourceVisuals";

const FILTERS = ["All", "Desk", "Meeting Room", "Conference Room"];

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    client
      .get("/resources")
      .then((res) => setResources(res.data))
      .catch(() => setError("could not load resources"));
  }, []);

  const visibleResources = useMemo(() => {
    if (activeFilter === "All") return resources;
    return resources.filter((r) => getResourceVisual(r).category === activeFilter);
  }, [resources, activeFilter]);

  return (
    <div>
      <h2>Bookable resources</h2>
      {error && <p className="error">{error}</p>}

      <div className="filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-btn ${activeFilter === f ? "active" : ""}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid">
        {visibleResources.map((r) => {
          const visual = getResourceVisual(r);
          const photoUrl = getResourceImageUrl(r, visual);
          return (
            <Link to={`/resources/${r.id}`} key={r.id} className="card resource-card">
              <div
                className="resource-banner"
                style={{
                  backgroundColor: visual.solid,
                  backgroundImage: `linear-gradient(rgba(15,20,40,0.45), rgba(15,20,40,0.25)), url(${photoUrl})`,
                }}
              >
                <ResourceIcon icon={visual.icon} />
                <span className="resource-badge">{visual.category}</span>
              </div>
              <div className="resource-card-body">
                <h3>{r.name}</h3>
                <p>{r.description}</p>
                <p className="muted">{r.location} • capacity {r.capacity} • €{r.pricePerHour}/hr</p>
              </div>
            </Link>
          );
        })}
      </div>

      {visibleResources.length === 0 && !error && (
        <p className="muted" style={{ marginTop: 16 }}>No resources match this filter.</p>
      )}
    </div>
  );
}

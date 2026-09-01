import { useEffect, useState } from "react";
import client from "../api/client";
import ResourceIcon from "../components/ResourceIcon";
import { getResourceVisual, getResourceImageUrl } from "../utils/resourceVisuals";

const emptyForm = { name: "", description: "", location: "", capacity: 1, pricePerHour: 0 };

export default function AdminResources() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  function load() {
    client.get("/resources").then((res) => setResources(res.data));
  }

  useEffect(load, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await client.put(`/resources/${editingId}`, form);
      } else {
        await client.post("/resources", form);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "save failed");
    }
  }

  function startEdit(r) {
    setEditingId(r.id);
    setForm({
      name: r.name,
      description: r.description || "",
      location: r.location || "",
      capacity: r.capacity,
      pricePerHour: r.pricePerHour,
    });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this resource?")) return;
    await client.delete(`/resources/${id}`);
    load();
  }

  return (
    <div>
      <h2>Manage resources (admin)</h2>

      <div className="card form-card">
        <h3>{editingId ? "Edit resource" : "New resource"}</h3>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
          <label>Description</label>
          <input name="description" value={form.description} onChange={handleChange} />
          <label>Location</label>
          <input name="location" value={form.location} onChange={handleChange} />
          <label>Capacity</label>
          <input name="capacity" type="number" min="1" value={form.capacity} onChange={handleChange} />
          <label>Price per hour (€)</label>
          <input name="pricePerHour" type="number" min="0" step="0.5" value={form.pricePerHour} onChange={handleChange} />
          {error && <p className="error">{error}</p>}
          <button type="submit">{editingId ? "Save changes" : "Create resource"}</button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
              Cancel edit
            </button>
          )}
        </form>
      </div>

      <div className="grid">
        {resources.map((r) => {
          const visual = getResourceVisual(r);
          const photoUrl = getResourceImageUrl(r, visual);
          return (
            <div key={r.id} className="card resource-card">
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
                <p className="muted">{r.location} • capacity {r.capacity} • €{r.pricePerHour}/hr</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => startEdit(r)}>Edit</button>
                  <button onClick={() => handleDelete(r.id)}>Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

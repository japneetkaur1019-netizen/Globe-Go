/**
 * GroupItinerary.jsx  —  Route: /group/itinerary
 *
 * Day-by-day group travel schedule and activity manager.
 *
 * React Router usage:
 *  - Link: navigation to /group/expenses to record activity costs, or /group/budget
 *  - useNavigate: jump to flight booking or polls
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  Check,
  Receipt,
  Plane,
  Vote,
  Sparkles,
} from "lucide-react";
import { useGroupTrip } from "../../context/GroupTripContext";

export default function GroupItinerary() {
  const navigate = useNavigate();

  const {
    destination,
    itinerary,
    addDay,
    removeDay,
    toggleDay,
    addActivity,
    removeActivity,
    ACTIVITY_TYPES,
  } = useGroupTrip();

  /* Local state for day creation */
  const [newDayDate, setNewDayDate]   = useState("");
  const [newDayLabel, setNewDayLabel] = useState("");

  /* Local state for adding activity to a specific day */
  const [addingActDay, setAddingActDay] = useState(null);
  const [newActivity, setNewActivity]   = useState({
    time: "",
    type: ACTIVITY_TYPES[0] || "✈️ Travel",
    title: "",
    notes: "",
  });

  function handleAddDay(e) {
    e.preventDefault();
    if (!newDayDate) return;
    const label = newDayLabel.trim() || `Day ${itinerary.length + 1}`;
    addDay({
      id: Date.now(),
      date: newDayDate,
      label,
      expanded: true,
      activities: [],
    });
    setNewDayDate("");
    setNewDayLabel("");
  }

  function handleSaveActivity(dayId) {
    if (!newActivity.title.trim()) return;
    addActivity(dayId, {
      id: Date.now(),
      ...newActivity,
    });
    setNewActivity({
      time: "",
      type: ACTIVITY_TYPES[0] || "✈️ Travel",
      title: "",
      notes: "",
    });
    setAddingActDay(null);
  }

  return (
    <div className="gp-tab-content">
      {/* ── Add Day Card ─────────────────────────────────── */}
      <div className="gp-card">
        <div className="gp-card-header">
          <div>
            <h2>
              <CalendarDays size={18} /> Trip Itinerary
            </h2>
            <p>Plan day-by-day schedule for your group travel.</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Link to="/group/polls" className="gp-btn gp-btn-ghost gp-btn-sm">
              <Vote size={14} /> Vote on Plans
            </Link>
            <Link to="/group/budget" className="gp-btn gp-btn-ghost gp-btn-sm">
              Check Trip Budget →
            </Link>
          </div>
        </div>

        <form onSubmit={handleAddDay} className="gp-day-add-row">
          <div className="gp-form-field">
            <label>Date</label>
            <input
              type="date"
              value={newDayDate}
              onChange={(e) => setNewDayDate(e.target.value)}
              required
            />
          </div>
          <div className="gp-form-field gp-field-grow">
            <label>Day Title / Label</label>
            <input
              type="text"
              placeholder="e.g. Day 1 — Arrival in Goa, Check-in"
              value={newDayLabel}
              onChange={(e) => setNewDayLabel(e.target.value)}
            />
          </div>
          <div className="gp-form-field">
            <label>&nbsp;</label>
            <button type="submit" className="gp-btn gp-btn-primary">
              <Plus size={15} /> Add Day
            </button>
          </div>
        </form>
      </div>

      {/* ── Days List ────────────────────────────────────── */}
      {itinerary.length === 0 ? (
        <div className="gp-card">
          <div className="gp-empty-box">
            No days scheduled yet. Add your arrival date above to start planning!
          </div>
        </div>
      ) : (
        itinerary.map((day) => (
          <div className="gp-card gp-day-card" key={day.id}>
            {/* Day Header */}
            <div className="gp-day-header" onClick={() => toggleDay(day.id)}>
              <div className="gp-day-header-left">
                <div className="gp-day-date-badge">
                  <CalendarDays size={14} />
                  {new Date(day.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <h3>{day.label}</h3>
                <span className="gp-activity-count">
                  {day.activities.length} activit{day.activities.length === 1 ? "y" : "ies"}
                </span>
              </div>
              <div className="gp-day-header-right">
                <button
                  type="button"
                  className="gp-icon-btn gp-icon-btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDay(day.id);
                  }}
                  title="Remove day"
                >
                  <Trash2 size={14} />
                </button>
                {day.expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>

            {/* Day Body */}
            {day.expanded && (
              <div className="gp-day-body">
                {day.activities.length === 0 ? (
                  <div className="gp-empty-box gp-empty-sm">
                    No activities planned for this day yet. Add one below.
                  </div>
                ) : (
                  <div className="gp-activity-list">
                    {day.activities.map((act) => (
                      <div className="gp-activity-row" key={act.id}>
                        <div className="gp-act-time">
                          <Clock size={12} /> {act.time || "--:--"}
                        </div>
                        <div className="gp-act-type-badge">{act.type}</div>
                        <div className="gp-act-info">
                          <strong>{act.title}</strong>
                          {act.notes && <span>{act.notes}</span>}
                        </div>
                        <Link
                          to={`/group/expenses?category=${encodeURIComponent(
                            act.type.replace(/^[^\s]+\s*/, "")
                          )}&q=${encodeURIComponent(act.title)}`}
                          style={{
                            fontSize: "11px",
                            color: "var(--primary)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px",
                            textDecoration: "none",
                            fontWeight: 600,
                          }}
                          title="Record expense for this activity in React Router"
                        >
                          <Receipt size={12} /> Log Cost
                        </Link>
                        <button
                          type="button"
                          className="gp-icon-btn gp-icon-btn-danger"
                          onClick={() => removeActivity(day.id, act.id)}
                          title="Remove activity"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add activity form */}
                {addingActDay === day.id ? (
                  <div className="gp-add-act-form">
                    <div className="gp-form-grid gp-form-4">
                      <div className="gp-form-field">
                        <label>Time</label>
                        <input
                          type="time"
                          value={newActivity.time}
                          onChange={(e) =>
                            setNewActivity((a) => ({ ...a, time: e.target.value }))
                          }
                        />
                      </div>
                      <div className="gp-form-field">
                        <label>Category</label>
                        <select
                          value={newActivity.type}
                          onChange={(e) =>
                            setNewActivity((a) => ({ ...a, type: e.target.value }))
                          }
                        >
                          {ACTIVITY_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="gp-form-field gp-field-grow">
                        <label>Activity</label>
                        <input
                          type="text"
                          placeholder="e.g. Scuba Diving at Grand Island, Sunset Cruise…"
                          value={newActivity.title}
                          onChange={(e) =>
                            setNewActivity((a) => ({ ...a, title: e.target.value }))
                          }
                        />
                      </div>
                      <div className="gp-form-field gp-field-grow">
                        <label>Notes (optional)</label>
                        <input
                          type="text"
                          placeholder="Booking ref, meeting point, attire…"
                          value={newActivity.notes}
                          onChange={(e) =>
                            setNewActivity((a) => ({ ...a, notes: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                    <div className="gp-act-btn-row">
                      <button
                        type="button"
                        className="gp-btn gp-btn-primary"
                        onClick={() => handleSaveActivity(day.id)}
                      >
                        <Check size={14} /> Save Activity
                      </button>
                      <button
                        type="button"
                        className="gp-btn gp-btn-ghost"
                        onClick={() => setAddingActDay(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="gp-add-act-btn"
                    onClick={() => {
                      setAddingActDay(day.id);
                      setNewActivity({
                        time: "",
                        type: ACTIVITY_TYPES[0] || "✈️ Travel",
                        title: "",
                        notes: "",
                      });
                    }}
                  >
                    <Plus size={14} /> Add Activity
                  </button>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

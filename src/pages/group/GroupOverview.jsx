/**
 * GroupOverview.jsx  —  Route: /group/overview
 *
 * Renders the Trip Details form, Budget Tracker ring gauge,
 * category breakdown, and Members list.
 *
 * React Router usage:
 *  - useNavigate  : "Find Group Flights" CTA navigates to /flights with prefill state
 *  - useLocation  : reads ?destination param if navigated from Explore
 *  - Link         : shortcut links to /group/expenses and /group/itinerary
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MapPin, Zap, PieChart, Users, Plus, Trash2, Plane,
  CalendarDays, Target, BarChart3,
} from "lucide-react";
import { useGroupTrip } from "../../context/GroupTripContext";

const CAT_COLORS = {
  "General":            "#6366f1",
  "Hotels & Stays":     "#0ea5e9",
  "Flights & Travel":   "#8b5cf6",
  "Food & Dining":      "#f97316",
  "Activities & Tours": "#10b981",
  "Local Transport":    "#f59e0b",
};

function Avatar({ name, size = 40 }) {
  const initials = name.slice(0, 2).toUpperCase();
  const hue = (name.charCodeAt(0) * 37 + name.charCodeAt(1 % name.length) * 13) % 360;
  return (
    <div
      className="gp-avatar"
      style={{
        width: size, height: size,
        background: `hsl(${hue},60%,88%)`,
        color: `hsl(${hue},50%,32%)`,
        fontSize: size * 0.32,
      }}
    >
      {initials}
    </div>
  );
}

export default function GroupOverview() {
  const navigate = useNavigate();

  const {
    groupName, destination, budget, startDate, endDate,
    setTripField,
    members, balances, addMember, removeMember,
    budgetNum, budgetPct, totalExpenses, catBreakdown,
  } = useGroupTrip();

  const [memberName, setMemberName] = useState("");

  function handleAddMember() {
    const n = memberName.trim();
    if (!n) return;
    addMember(n);
    setMemberName("");
  }

  return (
    <div className="gp-tab-content">

      {/* ── Trip Details Card ────────────────────────────── */}
      <div className="gp-card">
        <div className="gp-card-header">
          <div>
            <h2><MapPin size={18} /> Trip Details</h2>
            <p>Set up the basics for your group expedition.</p>
          </div>
          <button
            className="gp-btn gp-btn-amber"
            onClick={() => navigate("/flights", { state: { prefillDestination: destination } })}
          >
            <Plane size={15} /> Find Group Flights
          </button>
        </div>

        <div className="gp-form-grid gp-form-3">
          <div className="gp-form-field">
            <label>Trip / Group Name</label>
            <input
              type="text"
              placeholder="e.g. Goa Getaway…"
              value={groupName}
              onChange={(e) => setTripField("groupName", e.target.value)}
            />
          </div>
          <div className="gp-form-field">
            <label>Destination</label>
            <input
              type="text"
              placeholder="Goa, Manali, Bali, Tokyo…"
              value={destination}
              onChange={(e) => setTripField("destination", e.target.value)}
            />
          </div>
          <div className="gp-form-field">
            <label>Total Budget (₹)</label>
            <input
              type="number"
              placeholder="e.g. 45000"
              value={budget}
              onChange={(e) => setTripField("budget", e.target.value)}
            />
          </div>
          <div className="gp-form-field">
            <label>Departure Date</label>
            <input type="date" value={startDate} onChange={(e) => setTripField("startDate", e.target.value)} />
          </div>
          <div className="gp-form-field">
            <label>Return Date</label>
            <input type="date" value={endDate} onChange={(e) => setTripField("endDate", e.target.value)} />
          </div>
        </div>

        {/* Quick links to other sections */}
        <div className="gp-quick-links">
          <Link to="/group/budget" className="gp-quick-link"><Zap size={14} /> Budget Tracking</Link>
          <Link to="/group/expenses" className="gp-quick-link"><BarChart3 size={14} /> Go to Expenses</Link>
          <Link to="/group/itinerary" className="gp-quick-link"><CalendarDays size={14} /> Go to Itinerary</Link>
        </div>
      </div>

      {/* ── Budget Tracker ───────────────────────────────── */}
      {budgetNum > 0 && (
        <div className="gp-card gp-budget-card">
          <div className="gp-card-header">
            <div>
              <h2><Zap size={18} /> Budget Tracker</h2>
              <p>Real-time spend vs. budget allocation.</p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <Link to="/group/budget" className="gp-btn gp-btn-primary gp-btn-sm">
                <Zap size={14} /> Full Budget Analytics →
              </Link>
              <Link to="/group/expenses" className="gp-btn gp-btn-ghost gp-btn-sm">
                <Target size={14} /> Expenses
              </Link>
            </div>
          </div>

          <div className="gp-budget-layout">
            {/* Ring gauge */}
            <div className="gp-ring-wrap" style={{ cursor: "pointer" }} onClick={() => navigate("/group/budget")} title="Open Budget Tracker">
              <svg viewBox="0 0 120 120" className="gp-ring-svg">
                <circle cx="60" cy="60" r="50" className="gp-ring-track" />
                <circle
                  cx="60" cy="60" r="50"
                  className={`gp-ring-fill ${budgetPct >= 100 ? "gp-ring-danger" : budgetPct >= 75 ? "gp-ring-warn" : ""}`}
                  strokeDasharray={`${budgetPct * 3.14} 314`}
                  style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
                />
              </svg>
              <div className="gp-ring-center">
                <strong>{Math.round(budgetPct)}%</strong>
                <span>used</span>
              </div>
            </div>

            <div className="gp-budget-details">
              <div className="gp-budget-row"><span>Budget</span><strong>₹{budgetNum.toLocaleString("en-IN")}</strong></div>
              <div className="gp-budget-row">
                <span>Spent</span>
                <strong className={budgetPct >= 100 ? "gp-over-budget" : ""}>₹{totalExpenses.toLocaleString("en-IN")}</strong>
              </div>
              <div className="gp-budget-row">
                <span>Remaining</span>
                <strong className={budgetPct >= 100 ? "gp-over-budget" : "gp-remaining"}>
                  ₹{Math.max(0, budgetNum - totalExpenses).toLocaleString("en-IN")}
                </strong>
              </div>
              <div className="gp-budget-bar-wrap">
                <div className="gp-budget-bar">
                  <div
                    className={`gp-budget-fill ${budgetPct >= 100 ? "danger" : budgetPct >= 75 ? "warn" : ""}`}
                    style={{ width: `${budgetPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category breakdown */}
          {catBreakdown.length > 0 && (
            <div className="gp-cat-breakdown">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3><PieChart size={15} /> Spend by Category</h3>
                <Link to="/group/budget" style={{ fontSize: "12px", color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>
                  Detailed Breakdown →
                </Link>
              </div>
              <div className="gp-cat-rows">
                {catBreakdown.map(([cat, amt]) => {
                  const pct = totalExpenses > 0 ? (amt / totalExpenses) * 100 : 0;
                  return (
                    <div
                      className="gp-cat-row"
                      key={cat}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/group/expenses?category=${encodeURIComponent(cat)}`)}
                      title={`Filter ${cat} in Expenses`}
                    >
                      <div className="gp-cat-dot" style={{ background: CAT_COLORS[cat] || "#6366f1" }} />
                      <span className="gp-cat-name">{cat}</span>
                      <div className="gp-cat-bar-wrap">
                        <div className="gp-cat-bar-fill" style={{ width: `${pct}%`, background: CAT_COLORS[cat] || "#6366f1" }} />
                      </div>
                      <span className="gp-cat-pct">{Math.round(pct)}%</span>
                      <span className="gp-cat-amt">₹{amt.toLocaleString("en-IN")}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Members Card ─────────────────────────────────── */}
      <div className="gp-card">
        <div className="gp-card-header">
          <div>
            <h2><Users size={18} /> Group Members</h2>
            <p>Add friends joining the trip.</p>
          </div>
          <span className="gp-badge-count">{members.length} members</span>
        </div>

        <div className="gp-member-input-row">
          <input
            type="text"
            placeholder="Friend's name (Maya, Sam, Rohan…)"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddMember(); } }}
          />
          <button className="gp-btn gp-btn-primary" onClick={handleAddMember}>
            <Plus size={16} /> Add
          </button>
        </div>

        {members.length === 0 ? (
          <div className="gp-empty-box">Add at least 2 members to split expenses.</div>
        ) : (
          <div className="gp-member-grid">
            {members.map((m, i) => {
              const bal = balances.find((b) => b.member === m)?.balance || 0;
              return (
                <div className="gp-member-tile" key={i}>
                  <Avatar name={m} />
                  <div className="gp-member-info">
                    <strong>{m}</strong>
                    <span className={bal >= 0 ? "gp-positive" : "gp-negative"}>
                      {bal >= 0
                        ? `+₹${Math.round(bal).toLocaleString("en-IN")}`
                        : `-₹${Math.round(Math.abs(bal)).toLocaleString("en-IN")}`}
                    </span>
                  </div>
                  <button className="gp-remove-btn" onClick={() => removeMember(i)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

/**
 * GroupPlannerLayout.jsx
 *
 * Shell layout for the Group Trip Planner.
 * Renders the Hero, Stats bar, and tab NavLinks.
 * Child routes (overview, expenses, itinerary, polls) render in <Outlet />.
 *
 * React Router usage:
 *  - <NavLink> for tab navigation (active class handled by router)
 *  - <Outlet> renders the active sub-route
 *  - useLocation to display breadcrumb / current section
 *  - useNavigate for "Find Group Flights" CTA
 */

import { useMemo } from "react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Users, Wallet, DollarSign, Target,
  BarChart3, Receipt, CalendarDays, Vote, MapPin, Clock,
} from "lucide-react";
import { useGroupTrip } from "../../context/GroupTripContext";
import "./GroupPlanner.css";

const TABS = [
  { to: "/group/overview", label: "Overview", icon: BarChart3 },
  { to: "/group/budget", label: "Budget Tracking", icon: DollarSign },
  { to: "/group/expenses", label: "Expenses & Split", icon: Receipt },
  { to: "/group/itinerary", label: "Itinerary", icon: CalendarDays },
  { to: "/group/polls", label: "Polls", icon: Vote },
];

export default function GroupPlannerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    groupName, destination, budget,
    startDate, endDate,
    members, expenses,
  } = useGroupTrip();

  /* ── Derived stats ─────────────────────────────────────── */
  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const avgExpense = members.length > 0 ? totalExpenses / members.length : 0;
  const budgetNum = Number(budget) || 0;

  const tripDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return Math.max(0, Math.round((new Date(endDate) - new Date(startDate)) / 86400000));
  }, [startDate, endDate]);

  const daysUntil = useMemo(() => {
    if (!startDate) return null;
    return Math.round((new Date(startDate) - new Date()) / 86400000);
  }, [startDate]);

  /* ── Active section label for breadcrumb ──────────────── */
  const activeTab = TABS.find(t => location.pathname.startsWith(t.to))?.label ?? "Group Planner";

  return (
    <div className="gp-page">

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="gp-hero">
        <div className="gp-hero-inner">
          <div className="gp-hero-pill">
            <Users size={14} />
            <span>GROUP TRAVEL &amp; BUDGET TRACKING</span>
          </div>
          <h1>Your trip. Your crew.<br />Perfect splits.</h1>
          <p>
            Plan itineraries together, track group expenses in real-time,
            monitor budget utilization, and let our smart algorithm settle all debts automatically.
          </p>

          {groupName && (
            <div className="gp-hero-badges">
              <span className="gp-hero-badge"><MapPin size={13} /> {groupName}</span>
              {tripDays > 0 && <span className="gp-hero-badge"><CalendarDays size={13} /> {tripDays} nights</span>}
              {daysUntil !== null && daysUntil >= 0 && (
                <span className="gp-hero-badge gp-badge-amber">
                  <Clock size={13} /> {daysUntil === 0 ? "Today!" : `In ${daysUntil} days`}
                </span>
              )}
              <button
                className="gp-hero-badge gp-hero-badge-btn"
                onClick={() => navigate("/flights", { state: { prefillDestination: destination } })}
                title="Find Group Flights"
              >
                Find Group Flights →
              </button>
            </div>
          )}

          {/* Breadcrumb */}
          <div className="gp-breadcrumb">
            <Link to="/group/overview" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Group Planner</Link>
            <span className="gp-breadcrumb-sep">/</span>
            <span className="gp-breadcrumb-active">{activeTab}</span>
          </div>
        </div>

        <div className="gp-blob gp-blob1" />
        <div className="gp-blob gp-blob2" />
      </section>

      {/* ── STATS ROW ───────────────────────────────────────── */}
      <div className="gp-stats-row">
        <div className="gp-stat-card" style={{ cursor: "pointer" }} onClick={() => navigate("/group/expenses")} title="Go to Expenses">
          <div className="gp-stat-icon gp-icon-blue"><Wallet size={20} /></div>
          <div className="gp-stat-text">
            <span>Total Spent</span>
            <strong>₹{totalExpenses.toLocaleString("en-IN")}</strong>
          </div>
        </div>
        <div className="gp-stat-card" style={{ cursor: "pointer" }} onClick={() => navigate("/group/budget")} title="Go to Budget Tracking">
          <div className="gp-stat-icon gp-icon-amber"><DollarSign size={20} /></div>
          <div className="gp-stat-text">
            <span>Per Person</span>
            <strong>₹{Math.round(avgExpense).toLocaleString("en-IN")}</strong>
          </div>
        </div>
        <div className="gp-stat-card" style={{ cursor: "pointer" }} onClick={() => navigate("/group/overview")} title="Go to Overview">
          <div className="gp-stat-icon gp-icon-green"><Users size={20} /></div>
          <div className="gp-stat-text">
            <span>Crew Size</span>
            <strong>{members.length} Members</strong>
          </div>
        </div>
        <div className="gp-stat-card" style={{ cursor: "pointer" }} onClick={() => navigate("/group/budget")} title="Go to Budget Tracking">
          <div className="gp-stat-icon gp-icon-purple"><Target size={20} /></div>
          <div className="gp-stat-text">
            <span>Budget Left</span>
            <strong className={totalExpenses > budgetNum && budgetNum > 0 ? "gp-over-budget" : ""}>
              {budgetNum > 0
                ? `₹${Math.max(0, budgetNum - totalExpenses).toLocaleString("en-IN")}`
                : "Not set"}
            </strong>
          </div>
        </div>
      </div>

      {/* ── TAB NAV (NavLink-based) ──────────────────────────── */}
      <div className="gp-container">
        <nav className="gp-tab-bar" aria-label="Group Planner sections">
          {TABS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `gp-tab${isActive ? " active" : ""}`}
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>

        {/* ── Active sub-route renders here ─────────────────── */}
        <Outlet />
      </div>

    </div>
  );
}

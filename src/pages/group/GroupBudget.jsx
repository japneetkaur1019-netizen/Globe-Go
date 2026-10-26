/**
 * GroupBudget.jsx  —  Route: /group/budget
 *
 * Dedicated Budget Tracking and Financial Analytics for the group expedition.
 *
 * React Router usage:
 *  - useNavigate : programmatic jumps to /group/expenses with category filter or /flights
 *  - Link        : declarative links to filtered expenses, overview, itinerary
 *  - useLocation : breadcrumb / state awareness
 */

import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Zap,
  Target,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  Users,
  ArrowRight,
  Plane,
  Receipt,
  Sparkles,
  CalendarDays,
  ShieldCheck,
  Edit2,
  Check,
  Filter,
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

export default function GroupBudget() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    groupName,
    destination,
    budget,
    setTripField,
    members,
    expenses,
    totalExpenses,
    avgExpense,
    budgetNum,
    budgetPct,
    catBreakdown,
    settlements,
  } = useGroupTrip();

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudgetVal, setNewBudgetVal] = useState(budget);
  const [budgetSavedToast, setBudgetSavedToast] = useState(false);

  const remainingBudget = Math.max(0, budgetNum - totalExpenses);
  const isOverBudget = totalExpenses > budgetNum && budgetNum > 0;
  const overAmount = Math.max(0, totalExpenses - budgetNum);
  const targetPerPerson = members.length > 0 && budgetNum > 0 ? budgetNum / members.length : 0;

  function handleSaveBudget(e) {
    e.preventDefault();
    setTripField("budget", newBudgetVal);
    setIsEditingBudget(false);
    setBudgetSavedToast(true);
    setTimeout(() => setBudgetSavedToast(false), 3000);
  }

  return (
    <div className="gp-tab-content">
      {/* ── Budget Summary & Quick Actions Banner ───────── */}
      <div className="gp-card gp-budget-hero-card">
        <div className="gp-card-header">
          <div>
            <h2>
              <Zap size={20} /> Real-Time Budget Tracker
            </h2>
            <p>
              Monitor group spending, track variance against allocations, and drill down into expenses.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              className="gp-btn gp-btn-ghost gp-btn-sm"
              onClick={() => setIsEditingBudget(!isEditingBudget)}
            >
              <Edit2 size={14} /> {isEditingBudget ? "Cancel Edit" : "Adjust Budget"}
            </button>
            <button
              className="gp-btn gp-btn-primary gp-btn-sm"
              onClick={() => navigate("/group/expenses")}
            >
              <Receipt size={14} /> + Record Expense
            </button>
          </div>
        </div>

        {/* Quick Budget Inline Editor */}
        {isEditingBudget && (
          <form onSubmit={handleSaveBudget} className="gp-budget-edit-form" style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div className="gp-form-field" style={{ flex: 1 }}>
                <label>Set Total Trip Budget (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={newBudgetVal}
                  onChange={(e) => setNewBudgetVal(e.target.value)}
                  placeholder="e.g. 50000"
                  autoFocus
                />
              </div>
              <button type="submit" className="gp-btn gp-btn-primary" style={{ marginTop: "22px" }}>
                <Check size={16} /> Save Budget
              </button>
            </div>
          </form>
        )}

        {budgetSavedToast && (
          <div className="gp-settled-box" style={{ marginBottom: "16px", padding: "10px 16px" }}>
            <CheckCircle2 size={18} />
            <span>Budget target updated to ₹{Number(budget).toLocaleString("en-IN")} successfully!</span>
          </div>
        )}

        {/* ── Visual Metrics Grid ─────────────────────────── */}
        <div className="gp-budget-layout">
          {/* Ring gauge */}
          <div className="gp-ring-wrap">
            <svg viewBox="0 0 120 120" className="gp-ring-svg">
              <circle cx="60" cy="60" r="50" className="gp-ring-track" />
              <circle
                cx="60"
                cy="60"
                r="50"
                className={`gp-ring-fill ${
                  isOverBudget ? "gp-ring-danger" : budgetPct >= 75 ? "gp-ring-warn" : ""
                }`}
                strokeDasharray={`${Math.min(budgetPct, 100) * 3.14} 314`}
                style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
              />
            </svg>
            <div className="gp-ring-center">
              <strong>{Math.round(budgetPct)}%</strong>
              <span>{isOverBudget ? "exceeded" : "utilised"}</span>
            </div>
          </div>

          {/* Details breakdown */}
          <div className="gp-budget-details">
            <div className="gp-budget-row">
              <span>Total Planned Budget</span>
              <strong>₹{budgetNum.toLocaleString("en-IN")}</strong>
            </div>
            <div className="gp-budget-row">
              <span>Total Actual Spent</span>
              <strong className={isOverBudget ? "gp-over-budget" : ""}>
                ₹{totalExpenses.toLocaleString("en-IN")}
              </strong>
            </div>
            <div className="gp-budget-row">
              <span>{isOverBudget ? "Over Budget By" : "Remaining Allowance"}</span>
              <strong className={isOverBudget ? "gp-over-budget" : "gp-remaining"}>
                ₹{(isOverBudget ? overAmount : remainingBudget).toLocaleString("en-IN")}
              </strong>
            </div>

            {/* Visual Bar */}
            <div className="gp-budget-bar-wrap">
              <div className="gp-budget-bar">
                <div
                  className={`gp-budget-fill ${isOverBudget ? "danger" : budgetPct >= 75 ? "warn" : ""}`}
                  style={{ width: `${Math.min(budgetPct, 100)}%` }}
                />
              </div>
            </div>

            {/* Health Status Badge */}
            <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
              {isOverBudget ? (
                <span className="gp-hero-badge" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444", borderColor: "#fca5a5" }}>
                  <AlertTriangle size={14} /> Over-Budget Warning: Exceeded by ₹{overAmount.toLocaleString("en-IN")}
                </span>
              ) : budgetPct >= 75 ? (
                <span className="gp-hero-badge" style={{ background: "rgba(245,158,11,0.12)", color: "#d97706", borderColor: "#fcd34d" }}>
                  <TrendingUp size={14} /> Caution: 75%+ of budget spent
                </span>
              ) : (
                <span className="gp-hero-badge" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", borderColor: "#a7f3d0" }}>
                  <ShieldCheck size={14} /> Healthy Budget: ₹{remainingBudget.toLocaleString("en-IN")} safe margin
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Category Breakdown with React Router links ───── */}
      <div className="gp-card">
        <div className="gp-card-header">
          <div>
            <h2>
              <PieChart size={18} /> Category Spending Breakdown
            </h2>
            <p>
              Click any category to filter recorded expenses via URL query params.
            </p>
          </div>
          <Link to="/group/expenses" className="gp-btn gp-btn-ghost gp-btn-sm">
            <Filter size={14} /> View All Expenses
          </Link>
        </div>

        {catBreakdown.length === 0 ? (
          <div className="gp-empty-box">
            No expenses logged yet. Add flights, hotel stays, or dining to view categorical tracking.
          </div>
        ) : (
          <div className="gp-cat-rows">
            {catBreakdown.map(([cat, amt]) => {
              const pct = totalExpenses > 0 ? (amt / totalExpenses) * 100 : 0;
              return (
                <div
                  className="gp-cat-row"
                  key={cat}
                  style={{ cursor: "pointer", transition: "transform 0.15s ease" }}
                  onClick={() => navigate(`/group/expenses?category=${encodeURIComponent(cat)}`)}
                  title={`Click to view all ${cat} expenses in React Router`}
                >
                  <div className="gp-cat-dot" style={{ background: CAT_COLORS[cat] || "#6366f1" }} />
                  <span className="gp-cat-name" style={{ fontWeight: 600 }}>
                    {cat}
                  </span>
                  <div className="gp-cat-bar-wrap">
                    <div
                      className="gp-cat-bar-fill"
                      style={{
                        width: `${pct}%`,
                        background: CAT_COLORS[cat] || "#6366f1",
                      }}
                    />
                  </div>
                  <span className="gp-cat-pct">{Math.round(pct)}%</span>
                  <span className="gp-cat-amt">₹{amt.toLocaleString("en-IN")}</span>
                  <span style={{ fontSize: "11px", color: "var(--primary)", display: "inline-flex", alignItems: "center", gap: "2px" }}>
                    Filter →
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Per-Person Spending & Fair Split Analysis ─────── */}
      <div className="gp-card">
        <div className="gp-card-header">
          <div>
            <h2>
              <Users size={18} /> Per-Person Budget Allocation vs. Actual
            </h2>
            <p>
              Equal share benchmark: ₹{Math.round(targetPerPerson).toLocaleString("en-IN")} per member
              (based on ₹{budgetNum.toLocaleString("en-IN")} budget).
            </p>
          </div>
          <span className="gp-badge-count">{members.length} Members</span>
        </div>

        <div className="gp-member-grid">
          {members.map((m) => {
            const paid = expenses
              .filter((e) => e.person === m)
              .reduce((s, e) => s + e.amount, 0);
            const diffFromAverage = paid - avgExpense;

            return (
              <div className="gp-member-tile" key={m} style={{ flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      className="gp-avatar"
                      style={{
                        width: 38,
                        height: 38,
                        background: "var(--primary-light)",
                        color: "var(--primary)",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {m.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <strong>{m}</strong>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        Paid ₹{paid.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/group/expenses?member=${encodeURIComponent(m)}`}
                    style={{ fontSize: "11px", color: "var(--primary)", textDecoration: "none", fontWeight: 700 }}
                  >
                    View Logs
                  </Link>
                </div>

                {/* Progress compared to average */}
                <div style={{ width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", marginBottom: "4px" }}>
                    <span>Net Balance</span>
                    <strong className={diffFromAverage >= 0 ? "gp-positive" : "gp-negative"}>
                      {diffFromAverage >= 0
                        ? `+₹${Math.round(diffFromAverage).toLocaleString("en-IN")} (to receive)`
                        : `-₹${Math.round(Math.abs(diffFromAverage)).toLocaleString("en-IN")} (to pay)`}
                    </strong>
                  </div>
                  <div className="gp-budget-bar-wrap" style={{ height: "6px" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min(100, (paid / (totalExpenses || 1)) * 100)}%`,
                        background: diffFromAverage >= 0 ? "var(--success)" : "var(--primary)",
                        borderRadius: "999px",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── React Router Cross-Links & Navigation CTAs ────── */}
      <div className="gp-card" style={{ background: "linear-gradient(135deg, rgba(26,115,232,0.04), rgba(255,199,44,0.06))" }}>
        <div className="gp-card-header">
          <div>
            <h2>
              <Sparkles size={18} /> Next Actions &amp; Smart Routing
            </h2>
            <p>Direct navigation across the GlobeGo trip planning workspace.</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          <div
            className="gp-stat-card"
            style={{ cursor: "pointer", transition: "all 0.2s ease" }}
            onClick={() => navigate("/group/expenses")}
          >
            <div className="gp-stat-icon gp-icon-blue"><Receipt size={20} /></div>
            <div className="gp-stat-text">
              <span>Expenses &amp; Splits</span>
              <strong>{expenses.length} Records</strong>
            </div>
            <ArrowRight size={16} style={{ marginLeft: "auto", color: "var(--text-muted)" }} />
          </div>

          <div
            className="gp-stat-card"
            style={{ cursor: "pointer", transition: "all 0.2s ease" }}
            onClick={() => navigate("/flights", { state: { prefillDestination: destination } })}
          >
            <div className="gp-stat-icon gp-icon-amber"><Plane size={20} /></div>
            <div className="gp-stat-text">
              <span>Flight Booking</span>
              <strong>Compare Rates</strong>
            </div>
            <ArrowRight size={16} style={{ marginLeft: "auto", color: "var(--text-muted)" }} />
          </div>

          <div
            className="gp-stat-card"
            style={{ cursor: "pointer", transition: "all 0.2s ease" }}
            onClick={() => navigate("/group/itinerary")}
          >
            <div className="gp-stat-icon gp-icon-green"><CalendarDays size={20} /></div>
            <div className="gp-stat-text">
              <span>Trip Itinerary</span>
              <strong>Schedule Days</strong>
            </div>
            <ArrowRight size={16} style={{ marginLeft: "auto", color: "var(--text-muted)" }} />
          </div>

          <div
            className="gp-stat-card"
            style={{ cursor: "pointer", transition: "all 0.2s ease" }}
            onClick={() => navigate("/group/overview")}
          >
            <div className="gp-stat-icon gp-icon-purple"><Target size={20} /></div>
            <div className="gp-stat-text">
              <span>Trip Overview</span>
              <strong>Group Settings</strong>
            </div>
            <ArrowRight size={16} style={{ marginLeft: "auto", color: "var(--text-muted)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * GroupExpenses.jsx  —  Route: /group/expenses
 *
 * Expense tracking, split calculations, and debt settlement.
 *
 * React Router usage:
 *  - useSearchParams: reads and sets query params (?category=..., ?member=..., ?q=...)
 *  - Link: contextual navigation to /group/budget, /group/overview
 *  - useNavigate: jump to other trip sections
 */

import { useState, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  DollarSign,
  Receipt,
  Plus,
  Trash2,
  Check,
  CheckCircle,
  BadgeCheck,
  Tag,
  ArrowRight,
  Filter,
  X,
  Search,
  Zap,
  TrendingDown,
  Sparkles,
} from "lucide-react";
import { useGroupTrip } from "../../context/GroupTripContext";

const EXPENSE_CATEGORIES = [
  "General",
  "Hotels & Stays",
  "Flights & Travel",
  "Food & Dining",
  "Activities & Tours",
  "Local Transport",
];

const CAT_COLORS = {
  "General":            "#6366f1",
  "Hotels & Stays":     "#0ea5e9",
  "Flights & Travel":   "#8b5cf6",
  "Food & Dining":      "#f97316",
  "Activities & Tours": "#10b981",
  "Local Transport":    "#f59e0b",
};

function Avatar({ name, size = 36 }) {
  const initials = name ? name.slice(0, 2).toUpperCase() : "??";
  const hue = name ? (name.charCodeAt(0) * 37 + name.charCodeAt(1 % name.length) * 13) % 360 : 200;
  return (
    <div
      className="gp-avatar"
      style={{
        width: size,
        height: size,
        background: `hsl(${hue},60%,88%)`,
        color: `hsl(${hue},50%,32%)`,
        fontSize: size * 0.35,
        fontWeight: 700,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

export default function GroupExpenses() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategoryFilter = searchParams.get("category") || "";
  const activeMemberFilter   = searchParams.get("member") || "";
  const activeQueryFilter    = searchParams.get("q") || "";

  const {
    members,
    expenses,
    addExpense,
    removeExpense,
    toggleSettled,
    totalExpenses,
    settlements,
    budgetNum,
  } = useGroupTrip();

  /* Local form state */
  const [expensePerson, setExpensePerson]     = useState("");
  const [expenseTitle, setExpenseTitle]       = useState("");
  const [expenseCategory, setExpenseCategory] = useState("General");
  const [expenseAmount, setExpenseAmount]     = useState("");

  /* Filter helpers that modify URL query params */
  function setCategoryFilter(cat) {
    const next = new URLSearchParams(searchParams);
    if (cat) next.set("category", cat);
    else next.delete("category");
    setSearchParams(next);
  }

  function setMemberFilter(m) {
    const next = new URLSearchParams(searchParams);
    if (m) next.set("member", m);
    else next.delete("member");
    setSearchParams(next);
  }

  function setQueryFilter(query) {
    const next = new URLSearchParams(searchParams);
    if (query) next.set("q", query);
    else next.delete("q");
    setSearchParams(next);
  }

  function clearAllFilters() {
    setSearchParams({});
  }

  /* Filtered expenses based on React Router query parameters */
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (activeCategoryFilter && e.category !== activeCategoryFilter) return false;
      if (activeMemberFilter && e.person !== activeMemberFilter) return false;
      if (activeQueryFilter && !e.title.toLowerCase().includes(activeQueryFilter.toLowerCase())) return false;
      return true;
    });
  }, [expenses, activeCategoryFilter, activeMemberFilter, activeQueryFilter]);

  const filteredTotal = useMemo(() => {
    return filteredExpenses.reduce((s, e) => s + e.amount, 0);
  }, [filteredExpenses]);

  /* Form handler */
  function handleAddExpense(e) {
    e.preventDefault();
    if (!expensePerson || !expenseAmount || Number(expenseAmount) <= 0) return;

    addExpense({
      id: Date.now(),
      person: expensePerson,
      title: expenseTitle.trim() || `${expenseCategory} Expense`,
      category: expenseCategory,
      amount: Number(expenseAmount),
      settled: false,
    });

    setExpenseTitle("");
    setExpenseAmount("");
  }

  const hasActiveFilters = Boolean(activeCategoryFilter || activeMemberFilter || activeQueryFilter);

  return (
    <div className="gp-tab-content">
      {/* ── Add Expense Card ─────────────────────────────── */}
      <div className="gp-card">
        <div className="gp-card-header">
          <div>
            <h2>
              <DollarSign size={18} /> Add New Expense
            </h2>
            <p>Record who paid and what it was for.</p>
          </div>
          <Link to="/group/budget" className="gp-btn gp-btn-ghost gp-btn-sm">
            <Zap size={14} /> Check Budget Impact
          </Link>
        </div>

        {members.length > 0 ? (
          <form onSubmit={handleAddExpense} className="gp-expense-input-grid">
            <div className="gp-form-field">
              <label>Paid by</label>
              <select
                value={expensePerson}
                onChange={(e) => setExpensePerson(e.target.value)}
                required
              >
                <option value="">Select payer</option>
                {members.map((m, i) => (
                  <option key={i} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="gp-form-field">
              <label>Description</label>
              <input
                type="text"
                placeholder="e.g. Resort Booking, Dinner at Fisherman's Cove…"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
              />
            </div>

            <div className="gp-form-field">
              <label>Category</label>
              <select
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value)}
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="gp-form-field">
              <label>Amount (₹)</label>
              <input
                type="number"
                placeholder="₹ Amount"
                value={expenseAmount}
                min="1"
                onChange={(e) => setExpenseAmount(e.target.value)}
                required
              />
            </div>

            <div className="gp-form-field gp-add-btn-col">
              <label>&nbsp;</label>
              <button type="submit" className="gp-btn gp-btn-primary gp-btn-block">
                <Plus size={15} /> Add Expense
              </button>
            </div>
          </form>
        ) : (
          <div className="gp-empty-box">
            Add members first in the{" "}
            <Link to="/group/overview" style={{ color: "var(--primary)", fontWeight: 700 }}>
              Overview
            </Link>{" "}
            tab.
          </div>
        )}
      </div>

      {/* ── React Router URL Filter Bar ───────────────────── */}
      <div className="gp-card" style={{ padding: "18px 24px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", justifyContent: "space-between" }}>
          {/* Search box */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: "1 1 240px", position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: "12px", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search expenses..."
              value={activeQueryFilter}
              onChange={(e) => setQueryFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 34px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--bg-page)",
                color: "var(--text-dark)",
                fontSize: "13px",
              }}
            />
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Category:
            </span>
            <button
              type="button"
              className={`gp-voting-chip ${!activeCategoryFilter ? "active" : ""}`}
              onClick={() => setCategoryFilter("")}
              style={{ fontSize: "11px", padding: "4px 10px" }}
            >
              All
            </button>
            {EXPENSE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`gp-voting-chip ${activeCategoryFilter === cat ? "active" : ""}`}
                onClick={() => setCategoryFilter(activeCategoryFilter === cat ? "" : cat)}
                style={{ fontSize: "11px", padding: "4px 10px" }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Member Filter */}
          {members.length > 0 && (
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Payer:
              </span>
              <select
                value={activeMemberFilter}
                onChange={(e) => setMemberFilter(e.target.value)}
                style={{
                  padding: "5px 10px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)",
                  background: "var(--bg-page)",
                  color: "var(--text-dark)",
                  fontSize: "12px",
                }}
              >
                <option value="">All Payers</option>
                {members.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              className="gp-btn gp-btn-ghost gp-btn-sm"
              onClick={clearAllFilters}
              style={{ fontSize: "12px" }}
            >
              <X size={13} /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ── Expense Log ──────────────────────────────────── */}
      <div className="gp-card">
        <div className="gp-card-header">
          <div>
            <h2>
              <Receipt size={18} /> Expense Log ({filteredExpenses.length} of {expenses.length})
            </h2>
            <p>
              {hasActiveFilters
                ? `Showing filtered results (${filteredExpenses.length} items) total: ₹${filteredTotal.toLocaleString("en-IN")}`
                : "All recorded shared expenses for this group."}
            </p>
          </div>
          <div className="gp-expense-total-pill">
            Total Logged: <strong>₹{totalExpenses.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="gp-empty-box">
            {hasActiveFilters ? (
              <div>
                No expenses match the current filter criteria.{" "}
                <button
                  type="button"
                  onClick={clearAllFilters}
                  style={{
                    color: "var(--primary)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              "No expenses recorded yet. Use the form above to add your first expense."
            )}
          </div>
        ) : (
          <div className="gp-expense-list">
            {filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                className={`gp-expense-row ${exp.settled ? "settled" : ""}`}
              >
                <div
                  className="gp-exp-cat-dot"
                  style={{ background: CAT_COLORS[exp.category] || "#6366f1" }}
                />
                <Avatar name={exp.person} size={36} />
                <div className="gp-exp-info">
                  <strong>{exp.title}</strong>
                  <span>
                    <Tag size={11} /> {exp.category} · Paid by <em>{exp.person}</em>
                  </span>
                </div>
                <strong
                  className={`gp-exp-amount ${exp.settled ? "gp-settled-text" : ""}`}
                >
                  ₹{exp.amount.toLocaleString("en-IN")}
                  {exp.settled && (
                    <span className="gp-settled-badge">
                      <BadgeCheck size={13} /> Settled
                    </span>
                  )}
                </strong>
                <div className="gp-exp-actions">
                  <button
                    className={`gp-icon-btn ${exp.settled ? "gp-icon-btn-green" : ""}`}
                    onClick={() => toggleSettled(exp.id)}
                    title={exp.settled ? "Mark as unsettled" : "Mark as settled"}
                  >
                    <Check size={14} />
                  </button>
                  <button
                    className="gp-icon-btn gp-icon-btn-danger"
                    onClick={() => removeExpense(exp.id)}
                    title="Delete expense"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Smart Settlement Plan ─────────────────────────── */}
      <div className="gp-card">
        <div className="gp-card-header">
          <div>
            <h2>
              <CheckCircle size={18} /> Smart Debt Settlement Plan
            </h2>
            <p>
              Optimal minimum transactions calculated automatically to settle all outstanding balances.
            </p>
          </div>
          <Link to="/group/budget" className="gp-btn gp-btn-ghost gp-btn-sm">
            <Zap size={14} /> Review Budget Allocation
          </Link>
        </div>

        {settlements.length === 0 ? (
          <div className="gp-settled-box">
            <CheckCircle size={24} />
            <span>All balances are settled! Nobody owes anything.</span>
          </div>
        ) : (
          <div className="gp-settlement-list">
            {settlements.map((s, i) => (
              <div className="gp-settlement-card" key={i}>
                <div className="gp-settle-from">
                  <Avatar name={s.from} size={44} />
                  <div>
                    <strong>{s.from}</strong>
                    <span>pays</span>
                  </div>
                </div>
                <div className="gp-settle-arrow">
                  <ArrowRight size={20} />
                  <span>₹{Math.round(s.amount).toLocaleString("en-IN")}</span>
                </div>
                <div className="gp-settle-to">
                  <Avatar name={s.to} size={44} />
                  <div>
                    <strong>{s.to}</strong>
                    <span>receives</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

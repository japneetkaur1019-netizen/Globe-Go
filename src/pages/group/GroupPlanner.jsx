import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, Plus, Trash2, DollarSign, Wallet, ArrowRight,
  CheckCircle, Sparkles, MapPin, Tag, Plane, BarChart3,
  CalendarDays, Vote, Check, Clock, Star, ThumbsUp,
  Receipt, BadgeCheck, Pencil, ChevronDown, ChevronUp,
  PieChart, Zap, Target,
} from "lucide-react";
import "./GroupPlanner.css";

/* ─── Constants ─────────────────────────────────────────── */
const EXPENSE_CATEGORIES = [
  "General", "Hotels & Stays", "Flights & Travel",
  "Food & Dining", "Activities & Tours", "Local Transport",
];

const CAT_COLORS = {
  "General":            "#6366f1",
  "Hotels & Stays":     "#0ea5e9",
  "Flights & Travel":   "#8b5cf6",
  "Food & Dining":      "#f97316",
  "Activities & Tours": "#10b981",
  "Local Transport":    "#f59e0b",
};

const ACTIVITY_TYPES = [
  "🏨 Accommodation", "✈️ Travel", "🍽️ Dining", "🎭 Activity",
  "🛍️ Shopping", "🚌 Transport", "📸 Sightseeing", "💆 Wellness",
];

const TABS = [
  { key: "overview",   label: "Overview",   icon: BarChart3 },
  { key: "expenses",   label: "Expenses",   icon: Receipt },
  { key: "itinerary",  label: "Itinerary",  icon: CalendarDays },
  { key: "polls",      label: "Polls",      icon: Vote },
];

/* ─── Helpers ───────────────────────────────────────────── */
function Avatar({ name, size = 40, style = {} }) {
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
        ...style,
      }}
    >
      {initials}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function GroupPlanner() {
  const navigate = useNavigate();

  /* ── Tab ─────────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState("overview");

  /* ── Trip Details ────────────────────────────────────── */
  const [groupName,   setGroupName]   = useState("Goa Annual Getaway");
  const [destination, setDestination] = useState("Goa, India");
  const [budget,      setBudget]      = useState("45000");
  const [startDate,   setStartDate]   = useState("2025-12-20");
  const [endDate,     setEndDate]     = useState("2025-12-27");

  /* ── Members ─────────────────────────────────────────── */
  const [memberName, setMemberName] = useState("");
  const [members,    setMembers]    = useState(["Alex", "Priya", "Rahul"]);

  /* ── Expenses ────────────────────────────────────────── */
  const [expenses, setExpenses] = useState([
    { id: 1, person: "Alex",  title: "Resort Stay",      category: "Hotels & Stays",     amount: 18000, settled: false },
    { id: 2, person: "Priya", title: "Flight Tickets",   category: "Flights & Travel",   amount: 14500, settled: false },
    { id: 3, person: "Rahul", title: "Beachside Dinner", category: "Food & Dining",       amount: 4800,  settled: false },
  ]);
  const [expensePerson,   setExpensePerson]   = useState("");
  const [expenseTitle,    setExpenseTitle]    = useState("");
  const [expenseCategory, setExpenseCategory] = useState("General");
  const [expenseAmount,   setExpenseAmount]   = useState("");

  /* ── Itinerary ───────────────────────────────────────── */
  const [itinerary, setItinerary] = useState([
    {
      id: 1,
      date: "2025-12-20",
      label: "Day 1 — Arrival",
      expanded: true,
      activities: [
        { id: 11, time: "14:00", type: "✈️ Travel",      title: "Fly to Goa", notes: "Flight GoI-301" },
        { id: 12, time: "18:00", type: "🏨 Accommodation", title: "Check-in Resort", notes: "Taj Resort" },
        { id: 13, time: "20:00", type: "🍽️ Dining",       title: "Welcome Dinner", notes: "Beach shack" },
      ],
    },
    {
      id: 2,
      date: "2025-12-21",
      label: "Day 2 — Beach & Explore",
      expanded: false,
      activities: [
        { id: 21, time: "10:00", type: "📸 Sightseeing", title: "Calangute Beach", notes: "" },
        { id: 22, time: "14:00", type: "🛍️ Shopping",    title: "Anjuna Flea Market", notes: "" },
      ],
    },
  ]);

  const [newActivity, setNewActivity] = useState({ time: "", type: ACTIVITY_TYPES[0], title: "", notes: "" });
  const [addingActDay, setAddingActDay] = useState(null);
  const [newDayDate,   setNewDayDate]   = useState("");
  const [newDayLabel,  setNewDayLabel]  = useState("");

  /* ── Polls ───────────────────────────────────────────── */
  const [polls, setPolls] = useState([
    {
      id: 1,
      question: "Which accommodation do you prefer?",
      options: [
        { id: "a", label: "Beach Resort", votes: ["Alex"] },
        { id: "b", label: "Airbnb Villa", votes: ["Priya", "Rahul"] },
        { id: "c", label: "Budget Hostel", votes: [] },
      ],
      createdBy: "Alex",
      closed: false,
    },
  ]);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions]   = useState(["", ""]);
  const [votedPoll,   setVotedPoll]     = useState({}); // { [pollId]: member }
  const [votingAs,    setVotingAs]      = useState(members[0] || "");

  /* ──────────────────────────────────────────────────────
     DERIVED: EXPENSE CALCULATIONS
     ────────────────────────────────────────────────────── */
  const totalExpenses = useMemo(
    () => expenses.reduce((s, e) => s + e.amount, 0),
    [expenses]
  );
  const avgExpense = members.length > 0 ? totalExpenses / members.length : 0;
  const budgetNum  = Number(budget) || 0;
  const budgetPct  = budgetNum > 0 ? Math.min((totalExpenses / budgetNum) * 100, 100) : 0;

  const balances = useMemo(
    () =>
      members.map((m) => {
        const paid = expenses.filter((e) => e.person === m).reduce((s, e) => s + e.amount, 0);
        return { member: m, paid, balance: paid - avgExpense };
      }),
    [members, expenses, avgExpense]
  );

  /* Smart settlement algorithm */
  const settlements = useMemo(() => {
    const result  = [];
    const debtors  = balances.filter((p) => p.balance < -1).map((p) => ({ ...p, owe: Math.abs(p.balance) }));
    const creditors = balances.filter((p) => p.balance > 1).map((p) => ({ ...p, get: p.balance }));
    debtors.forEach((d) => {
      creditors.forEach((c) => {
        if (d.owe > 0 && c.get > 0) {
          const amt = Math.min(d.owe, c.get);
          if (amt > 0) {
            result.push({ from: d.member, to: c.member, amount: amt });
            d.owe -= amt;
            c.get -= amt;
          }
        }
      });
    });
    return result;
  }, [balances]);

  /* Category spend breakdown */
  const catBreakdown = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  /* Trip duration */
  const tripDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const diff = new Date(endDate) - new Date(startDate);
    return Math.max(0, Math.round(diff / 86400000));
  }, [startDate, endDate]);

  const daysUntil = useMemo(() => {
    if (!startDate) return null;
    const diff = new Date(startDate) - new Date();
    const days = Math.round(diff / 86400000);
    return days;
  }, [startDate]);

  /* ──────────────────────────────────────────────────────
     HANDLERS: MEMBERS
     ────────────────────────────────────────────────────── */
  function addMember() {
    const n = memberName.trim();
    if (!n || members.includes(n)) return;
    setMembers([...members, n]);
    setMemberName("");
    if (!votingAs) setVotingAs(n);
  }
  function removeMember(i) {
    const name = members[i];
    setMembers((m) => m.filter((_, j) => j !== i));
    setExpenses((e) => e.filter((x) => x.person !== name));
  }

  /* ──────────────────────────────────────────────────────
     HANDLERS: EXPENSES
     ────────────────────────────────────────────────────── */
  function addExpense() {
    if (!expensePerson || !expenseAmount || Number(expenseAmount) <= 0) return;
    setExpenses([
      ...expenses,
      {
        id:       Date.now(),
        person:   expensePerson,
        title:    expenseTitle.trim() || `${expenseCategory} Expense`,
        category: expenseCategory,
        amount:   Number(expenseAmount),
        settled:  false,
      },
    ]);
    setExpensePerson(""); setExpenseTitle(""); setExpenseAmount("");
  }
  function removeExpense(id) { setExpenses((e) => e.filter((x) => x.id !== id)); }
  function toggleSettled(id) {
    setExpenses((e) => e.map((x) => x.id === id ? { ...x, settled: !x.settled } : x));
  }

  /* ──────────────────────────────────────────────────────
     HANDLERS: ITINERARY
     ────────────────────────────────────────────────────── */
  function addDay() {
    if (!newDayDate) return;
    const label = newDayLabel.trim() || `Day ${itinerary.length + 1}`;
    setItinerary([
      ...itinerary,
      { id: Date.now(), date: newDayDate, label, expanded: true, activities: [] },
    ]);
    setNewDayDate(""); setNewDayLabel("");
  }
  function removeDay(id) { setItinerary((it) => it.filter((d) => d.id !== id)); }
  function toggleDay(id)  {
    setItinerary((it) => it.map((d) => d.id === id ? { ...d, expanded: !d.expanded } : d));
  }
  function addActivity(dayId) {
    if (!newActivity.title.trim()) return;
    setItinerary((it) =>
      it.map((d) =>
        d.id === dayId
          ? { ...d, activities: [...d.activities, { id: Date.now(), ...newActivity }] }
          : d
      )
    );
    setNewActivity({ time: "", type: ACTIVITY_TYPES[0], title: "", notes: "" });
    setAddingActDay(null);
  }
  function removeActivity(dayId, actId) {
    setItinerary((it) =>
      it.map((d) => d.id === dayId
        ? { ...d, activities: d.activities.filter((a) => a.id !== actId) }
        : d
      )
    );
  }

  /* ──────────────────────────────────────────────────────
     HANDLERS: POLLS
     ────────────────────────────────────────────────────── */
  function createPoll() {
    if (!pollQuestion.trim() || pollOptions.filter((o) => o.trim()).length < 2) return;
    setPolls([
      ...polls,
      {
        id:       Date.now(),
        question: pollQuestion.trim(),
        options:  pollOptions
          .filter((o) => o.trim())
          .map((o, i) => ({ id: String(i), label: o.trim(), votes: [] })),
        createdBy: members[0] || "You",
        closed:    false,
      },
    ]);
    setPollQuestion(""); setPollOptions(["", ""]);
  }
  function vote(pollId, optionId) {
    const voter = votingAs;
    if (!voter) return;
    setPolls((ps) =>
      ps.map((p) => {
        if (p.id !== pollId || p.closed) return p;
        return {
          ...p,
          options: p.options.map((o) => ({
            ...o,
            votes: o.id === optionId
              ? o.votes.includes(voter) ? o.votes : [...o.votes, voter]
              : o.votes.filter((v) => v !== voter),
          })),
        };
      })
    );
    setVotedPoll((prev) => ({ ...prev, [pollId]: optionId }));
  }
  function closePoll(id) { setPolls((ps) => ps.map((p) => p.id === id ? { ...p, closed: true } : p)); }
  function deletePoll(id) { setPolls((ps) => ps.filter((p) => p.id !== id)); }

  /* ──────────────────────────────────────────────────────
     RENDER
     ────────────────────────────────────────────────────── */
  return (
    <div className="gp-page">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="gp-hero">
        <div className="gp-hero-inner">
          <div className="gp-hero-pill">
            <Users size={14} />
            <span>GROUP TRAVEL & EXPENSE SPLITTER</span>
          </div>
          <h1>Your trip. Your crew.<br />Perfect splits.</h1>
          <p>
            Plan itineraries together, track group expenses in real-time,
            vote on decisions, and let our smart algorithm settle all debts automatically.
          </p>

          {/* Trip quick info */}
          {groupName && (
            <div className="gp-hero-badges">
              <span className="gp-hero-badge"><MapPin size={13}/> {groupName}</span>
              {tripDays > 0 && <span className="gp-hero-badge"><CalendarDays size={13}/> {tripDays} nights</span>}
              {daysUntil !== null && daysUntil >= 0 && (
                <span className="gp-hero-badge gp-badge-amber">
                  <Clock size={13}/> {daysUntil === 0 ? "Today!" : `In ${daysUntil} days`}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Blobs */}
        <div className="gp-blob gp-blob1" />
        <div className="gp-blob gp-blob2" />
      </section>


      {/* ── STATS ROW ─────────────────────────────────────── */}
      <div className="gp-stats-row">
        <div className="gp-stat-card">
          <div className="gp-stat-icon gp-icon-blue"><Wallet size={20}/></div>
          <div className="gp-stat-text">
            <span>Total Spent</span>
            <strong>₹{totalExpenses.toLocaleString("en-IN")}</strong>
          </div>
        </div>
        <div className="gp-stat-card">
          <div className="gp-stat-icon gp-icon-amber"><DollarSign size={20}/></div>
          <div className="gp-stat-text">
            <span>Per Person</span>
            <strong>₹{Math.round(avgExpense).toLocaleString("en-IN")}</strong>
          </div>
        </div>
        <div className="gp-stat-card">
          <div className="gp-stat-icon gp-icon-green"><Users size={20}/></div>
          <div className="gp-stat-text">
            <span>Crew Size</span>
            <strong>{members.length} Members</strong>
          </div>
        </div>
        <div className="gp-stat-card">
          <div className="gp-stat-icon gp-icon-purple"><Target size={20}/></div>
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


      {/* ── TAB NAV ───────────────────────────────────────── */}
      <div className="gp-container">
        <div className="gp-tab-bar">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                type="button"
                className={`gp-tab ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <Icon size={16}/> {tab.label}
              </button>
            );
          })}
        </div>


        {/* ════════════════════════════════════════════════════
            TAB: OVERVIEW
            ════════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="gp-tab-content">

            {/* Trip Details Card */}
            <div className="gp-card">
              <div className="gp-card-header">
                <div>
                  <h2><MapPin size={18}/> Trip Details</h2>
                  <p>Set up the basics for your group expedition.</p>
                </div>
                <button
                  className="gp-btn gp-btn-amber"
                  onClick={() => navigate("/flights", { state: { prefillDestination: destination } })}
                >
                  <Plane size={15}/> Find Group Flights
                </button>
              </div>

              <div className="gp-form-grid gp-form-3">
                <div className="gp-form-field">
                  <label>Trip / Group Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Goa Getaway, Japan Expedition…"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </div>
                <div className="gp-form-field">
                  <label>Destination</label>
                  <input
                    type="text"
                    placeholder="Goa, Manali, Bali, Tokyo…"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
                <div className="gp-form-field">
                  <label>Total Budget (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 45000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>
                <div className="gp-form-field">
                  <label>Departure Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="gp-form-field">
                  <label>Return Date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Budget Progress */}
            {budgetNum > 0 && (
              <div className="gp-card gp-budget-card">
                <div className="gp-card-header">
                  <div>
                    <h2><Zap size={18}/> Budget Tracker</h2>
                    <p>Real-time spend vs. budget allocation.</p>
                  </div>
                </div>
                <div className="gp-budget-layout">
                  {/* Ring gauge */}
                  <div className="gp-ring-wrap">
                    <svg viewBox="0 0 120 120" className="gp-ring-svg">
                      <circle cx="60" cy="60" r="50" className="gp-ring-track"/>
                      <circle
                        cx="60" cy="60" r="50"
                        className={`gp-ring-fill ${budgetPct >= 100 ? "gp-ring-danger" : budgetPct >= 75 ? "gp-ring-warn" : ""}`}
                        strokeDasharray={`${budgetPct * 3.14} 314`}
                        strokeDashoffset="0"
                        style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
                      />
                    </svg>
                    <div className="gp-ring-center">
                      <strong>{Math.round(budgetPct)}%</strong>
                      <span>used</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="gp-budget-details">
                    <div className="gp-budget-row">
                      <span>Budget</span>
                      <strong>₹{budgetNum.toLocaleString("en-IN")}</strong>
                    </div>
                    <div className="gp-budget-row">
                      <span>Spent</span>
                      <strong className={budgetPct >= 100 ? "gp-over-budget" : ""}>
                        ₹{totalExpenses.toLocaleString("en-IN")}
                      </strong>
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
                    <h3><PieChart size={15}/> Spend by Category</h3>
                    <div className="gp-cat-rows">
                      {catBreakdown.map(([cat, amt]) => {
                        const pct = totalExpenses > 0 ? (amt / totalExpenses) * 100 : 0;
                        return (
                          <div className="gp-cat-row" key={cat}>
                            <div
                              className="gp-cat-dot"
                              style={{ background: CAT_COLORS[cat] || "#6366f1" }}
                            />
                            <span className="gp-cat-name">{cat}</span>
                            <div className="gp-cat-bar-wrap">
                              <div
                                className="gp-cat-bar-fill"
                                style={{
                                  width: `${pct}%`,
                                  background: CAT_COLORS[cat] || "#6366f1"
                                }}
                              />
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

            {/* Members Card */}
            <div className="gp-card">
              <div className="gp-card-header">
                <div>
                  <h2><Users size={18}/> Group Members</h2>
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
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addMember(); }}}
                />
                <button className="gp-btn gp-btn-primary" onClick={addMember}>
                  <Plus size={16}/> Add
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
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}


        {/* ════════════════════════════════════════════════════
            TAB: EXPENSES
            ════════════════════════════════════════════════════ */}
        {activeTab === "expenses" && (
          <div className="gp-tab-content">
            <div className="gp-card">
              <div className="gp-card-header">
                <div>
                  <h2><DollarSign size={18}/> Add Expense</h2>
                  <p>Record who paid and what it was for.</p>
                </div>
              </div>

              {members.length > 0 ? (
                <div className="gp-expense-input-grid">
                  <div className="gp-form-field">
                    <label>Paid by</label>
                    <select value={expensePerson} onChange={(e) => setExpensePerson(e.target.value)}>
                      <option value="">Select payer</option>
                      {members.map((m, i) => <option key={i} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="gp-form-field">
                    <label>Description</label>
                    <input
                      type="text"
                      placeholder="Airbnb, Seafood dinner…"
                      value={expenseTitle}
                      onChange={(e) => setExpenseTitle(e.target.value)}
                    />
                  </div>
                  <div className="gp-form-field">
                    <label>Category</label>
                    <select value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)}>
                      {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="gp-form-field">
                    <label>Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="₹ Amount"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                    />
                  </div>
                  <div className="gp-form-field gp-add-btn-col">
                    <label>&nbsp;</label>
                    <button className="gp-btn gp-btn-primary gp-btn-block" onClick={addExpense}>
                      <Plus size={15}/> Add Expense
                    </button>
                  </div>
                </div>
              ) : (
                <div className="gp-empty-box">Add members first in the Overview tab.</div>
              )}
            </div>

            {/* Expense List */}
            <div className="gp-card">
              <div className="gp-card-header">
                <div>
                  <h2><Receipt size={18}/> Expense Log ({expenses.length})</h2>
                  <p>All recorded shared expenses.</p>
                </div>
                <div className="gp-expense-total-pill">
                  Total: <strong>₹{totalExpenses.toLocaleString("en-IN")}</strong>
                </div>
              </div>

              {expenses.length === 0 ? (
                <div className="gp-empty-box">No expenses yet. Record your first shared cost above.</div>
              ) : (
                <div className="gp-expense-list">
                  {expenses.map((exp) => (
                    <div
                      key={exp.id}
                      className={`gp-expense-row ${exp.settled ? "settled" : ""}`}
                    >
                      <div
                        className="gp-exp-cat-dot"
                        style={{ background: CAT_COLORS[exp.category] || "#6366f1" }}
                      />
                      <Avatar name={exp.person} size={36}/>
                      <div className="gp-exp-info">
                        <strong>{exp.title}</strong>
                        <span>
                          <Tag size={11}/> {exp.category} · Paid by <em>{exp.person}</em>
                        </span>
                      </div>
                      <strong className={`gp-exp-amount ${exp.settled ? "gp-settled-text" : ""}`}>
                        ₹{exp.amount.toLocaleString("en-IN")}
                        {exp.settled && <span className="gp-settled-badge"><BadgeCheck size={13}/> Settled</span>}
                      </strong>
                      <div className="gp-exp-actions">
                        <button
                          className={`gp-icon-btn ${exp.settled ? "gp-icon-btn-green" : ""}`}
                          onClick={() => toggleSettled(exp.id)}
                          title={exp.settled ? "Mark as unsettled" : "Mark as settled"}
                        >
                          <Check size={14}/>
                        </button>
                        <button className="gp-icon-btn gp-icon-btn-danger" onClick={() => removeExpense(exp.id)}>
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Settlement Plan */}
            <div className="gp-card">
              <div className="gp-card-header">
                <div>
                  <h2><CheckCircle size={18}/> Smart Settlement Plan</h2>
                  <p>Optimal minimum transactions to settle all debts.</p>
                </div>
              </div>

              {settlements.length === 0 ? (
                <div className="gp-settled-box">
                  <CheckCircle size={24}/>
                  <span>All balances are settled! Nobody owes anything.</span>
                </div>
              ) : (
                <div className="gp-settlement-list">
                  {settlements.map((s, i) => (
                    <div className="gp-settlement-card" key={i}>
                      <div className="gp-settle-from">
                        <Avatar name={s.from} size={44}/>
                        <div>
                          <strong>{s.from}</strong>
                          <span>pays</span>
                        </div>
                      </div>
                      <div className="gp-settle-arrow">
                        <ArrowRight size={20}/>
                        <span>₹{Math.round(s.amount).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="gp-settle-to">
                        <Avatar name={s.to} size={44}/>
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
        )}


        {/* ════════════════════════════════════════════════════
            TAB: ITINERARY
            ════════════════════════════════════════════════════ */}
        {activeTab === "itinerary" && (
          <div className="gp-tab-content">

            {/* Add Day */}
            <div className="gp-card">
              <div className="gp-card-header">
                <div>
                  <h2><CalendarDays size={18}/> Trip Itinerary</h2>
                  <p>Plan day-by-day activities for your crew.</p>
                </div>
              </div>
              <div className="gp-day-add-row">
                <div className="gp-form-field">
                  <label>Date</label>
                  <input type="date" value={newDayDate} onChange={(e) => setNewDayDate(e.target.value)}/>
                </div>
                <div className="gp-form-field gp-field-grow">
                  <label>Label (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Day 1 — Arrival in Goa"
                    value={newDayLabel}
                    onChange={(e) => setNewDayLabel(e.target.value)}
                  />
                </div>
                <div className="gp-form-field">
                  <label>&nbsp;</label>
                  <button className="gp-btn gp-btn-primary" onClick={addDay}>
                    <Plus size={15}/> Add Day
                  </button>
                </div>
              </div>
            </div>

            {/* Days list */}
            {itinerary.length === 0 ? (
              <div className="gp-card">
                <div className="gp-empty-box">
                  No days added yet. Add your first day above to start planning!
                </div>
              </div>
            ) : (
              itinerary.map((day) => (
                <div className="gp-card gp-day-card" key={day.id}>
                  {/* Day header */}
                  <div
                    className="gp-day-header"
                    onClick={() => toggleDay(day.id)}
                  >
                    <div className="gp-day-header-left">
                      <div className="gp-day-date-badge">
                        <CalendarDays size={14}/>
                        {new Date(day.date).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </div>
                      <h3>{day.label}</h3>
                      <span className="gp-activity-count">{day.activities.length} activities</span>
                    </div>
                    <div className="gp-day-header-right">
                      <button
                        className="gp-icon-btn gp-icon-btn-danger"
                        onClick={(e) => { e.stopPropagation(); removeDay(day.id); }}
                      >
                        <Trash2 size={14}/>
                      </button>
                      {day.expanded ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                    </div>
                  </div>

                  {/* Day body */}
                  {day.expanded && (
                    <div className="gp-day-body">
                      {/* Activities */}
                      {day.activities.length === 0 ? (
                        <div className="gp-empty-box gp-empty-sm">No activities yet. Add one below.</div>
                      ) : (
                        <div className="gp-activity-list">
                          {day.activities.map((act) => (
                            <div className="gp-activity-row" key={act.id}>
                              <div className="gp-act-time">
                                <Clock size={12}/> {act.time || "--:--"}
                              </div>
                              <div className="gp-act-type-badge">{act.type}</div>
                              <div className="gp-act-info">
                                <strong>{act.title}</strong>
                                {act.notes && <span>{act.notes}</span>}
                              </div>
                              <button
                                className="gp-icon-btn gp-icon-btn-danger"
                                onClick={() => removeActivity(day.id, act.id)}
                              >
                                <Trash2 size={13}/>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add activity */}
                      {addingActDay === day.id ? (
                        <div className="gp-add-act-form">
                          <div className="gp-form-grid gp-form-4">
                            <div className="gp-form-field">
                              <label>Time</label>
                              <input
                                type="time"
                                value={newActivity.time}
                                onChange={(e) => setNewActivity((a) => ({ ...a, time: e.target.value }))}
                              />
                            </div>
                            <div className="gp-form-field">
                              <label>Type</label>
                              <select
                                value={newActivity.type}
                                onChange={(e) => setNewActivity((a) => ({ ...a, type: e.target.value }))}
                              >
                                {ACTIVITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                              </select>
                            </div>
                            <div className="gp-form-field gp-field-grow">
                              <label>Activity</label>
                              <input
                                type="text"
                                placeholder="e.g. Taj Mahal Tour, Beach Volleyball…"
                                value={newActivity.title}
                                onChange={(e) => setNewActivity((a) => ({ ...a, title: e.target.value }))}
                              />
                            </div>
                            <div className="gp-form-field gp-field-grow">
                              <label>Notes</label>
                              <input
                                type="text"
                                placeholder="Optional notes…"
                                value={newActivity.notes}
                                onChange={(e) => setNewActivity((a) => ({ ...a, notes: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div className="gp-act-btn-row">
                            <button className="gp-btn gp-btn-primary" onClick={() => addActivity(day.id)}>
                              <Check size={14}/> Save Activity
                            </button>
                            <button className="gp-btn gp-btn-ghost" onClick={() => setAddingActDay(null)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="gp-add-act-btn"
                          onClick={() => { setAddingActDay(day.id); setNewActivity({ time: "", type: ACTIVITY_TYPES[0], title: "", notes: "" }); }}
                        >
                          <Plus size={14}/> Add Activity
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}

          </div>
        )}


        {/* ════════════════════════════════════════════════════
            TAB: POLLS
            ════════════════════════════════════════════════════ */}
        {activeTab === "polls" && (
          <div className="gp-tab-content">

            {/* Create Poll */}
            <div className="gp-card">
              <div className="gp-card-header">
                <div>
                  <h2><Vote size={18}/> Create a Poll</h2>
                  <p>Let the group vote on destinations, activities, or anything else.</p>
                </div>
              </div>

              <div className="gp-poll-create-form">
                <div className="gp-form-field">
                  <label>Poll Question</label>
                  <input
                    type="text"
                    placeholder="Which hotel should we book? / Best date to depart?"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                  />
                </div>

                <div className="gp-poll-options-grid">
                  <label>Options</label>
                  {pollOptions.map((opt, i) => (
                    <div key={i} className="gp-poll-option-row">
                      <input
                        type="text"
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...pollOptions];
                          updated[i] = e.target.value;
                          setPollOptions(updated);
                        }}
                      />
                      {pollOptions.length > 2 && (
                        <button
                          className="gp-icon-btn gp-icon-btn-danger"
                          onClick={() => setPollOptions(pollOptions.filter((_, j) => j !== i))}
                        >
                          <Trash2 size={13}/>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    className="gp-add-opt-btn"
                    onClick={() => setPollOptions([...pollOptions, ""])}
                  >
                    <Plus size={13}/> Add Option
                  </button>
                </div>

                <button className="gp-btn gp-btn-primary" onClick={createPoll}>
                  <Sparkles size={15}/> Create Poll
                </button>
              </div>
            </div>

            {/* Voting-as selector */}
            {members.length > 0 && (
              <div className="gp-voting-as-bar">
                <span>Voting as:</span>
                {members.map((m) => (
                  <button
                    key={m}
                    className={`gp-voting-chip ${votingAs === m ? "active" : ""}`}
                    onClick={() => setVotingAs(m)}
                  >
                    <Avatar name={m} size={24}/>
                    {m}
                  </button>
                ))}
              </div>
            )}

            {/* Poll cards */}
            {polls.length === 0 ? (
              <div className="gp-card">
                <div className="gp-empty-box">
                  No polls yet. Create one above to let your group vote!
                </div>
              </div>
            ) : (
              polls.map((poll) => {
                const totalVotes = poll.options.reduce((s, o) => s + o.votes.length, 0);
                const winner    = [...poll.options].sort((a,b) => b.votes.length - a.votes.length)[0];
                return (
                  <div className={`gp-card gp-poll-card ${poll.closed ? "gp-poll-closed" : ""}`} key={poll.id}>
                    <div className="gp-poll-header">
                      <div>
                        <h3>{poll.question}</h3>
                        <span>
                          {totalVotes} vote{totalVotes !== 1 ? "s" : ""} · by {poll.createdBy}
                          {poll.closed && <span className="gp-closed-badge"> · Closed</span>}
                        </span>
                      </div>
                      <div className="gp-poll-header-actions">
                        {!poll.closed && (
                          <button className="gp-btn gp-btn-ghost gp-btn-sm" onClick={() => closePoll(poll.id)}>
                            Close Poll
                          </button>
                        )}
                        <button
                          className="gp-icon-btn gp-icon-btn-danger"
                          onClick={() => deletePoll(poll.id)}
                        >
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    </div>

                    <div className="gp-poll-options">
                      {poll.options.map((opt) => {
                        const pct       = totalVotes > 0 ? (opt.votes.length / totalVotes) * 100 : 0;
                        const isWinner  = poll.closed && opt.id === winner.id && opt.votes.length > 0;
                        const userVoted = poll.options.find((o) => o.votes.includes(votingAs))?.id === opt.id;

                        return (
                          <div
                            key={opt.id}
                            className={`gp-poll-option ${userVoted ? "voted" : ""} ${isWinner ? "winner" : ""}`}
                            onClick={() => !poll.closed && vote(poll.id, opt.id)}
                          >
                            <div className="gp-poll-option-top">
                              <div className="gp-poll-option-label">
                                {isWinner && <Star size={13} fill="#ffc72c" color="#ffc72c"/>}
                                <span>{opt.label}</span>
                                {userVoted && <ThumbsUp size={12} className="gp-your-vote"/>}
                              </div>
                              <span className="gp-poll-count">
                                {opt.votes.length} vote{opt.votes.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                            <div className="gp-poll-bar-wrap">
                              <div
                                className="gp-poll-bar-fill"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            {opt.votes.length > 0 && (
                              <div className="gp-poll-voters">
                                {opt.votes.map((v) => (
                                  <Avatar key={v} name={v} size={22} style={{ flexShrink: 0 }}/>
                                ))}
                                <span>{opt.votes.join(", ")}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}

          </div>
        )}

      </div>
    </div>
  );
}

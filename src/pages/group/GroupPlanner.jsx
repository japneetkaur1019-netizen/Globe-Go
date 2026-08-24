import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Plus,
  Trash2,
  DollarSign,
  Wallet,
  ArrowRight,
  CheckCircle,
  Sparkles,
  MapPin,
  Tag,
  Plane
} from "lucide-react";
import "./GroupPlanner.css";

const EXPENSE_CATEGORIES = [
  "General",
  "Hotels & Stays",
  "Flights & Travel",
  "Food & Dining",
  "Activities & Tours",
  "Local Transport"
];

export default function GroupPlanner() {
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [members, setMembers] = useState(["Alex", "Priya", "Rahul"]);

  const [destination, setDestination] = useState("Goa, India");
  const [budget, setBudget] = useState("45000");

  const [expenses, setExpenses] = useState([
    { id: 1, person: "Alex", title: "Resort Stay", category: "Hotels & Stays", amount: 18000 },
    { id: 2, person: "Priya", title: "Flight Tickets", category: "Flights & Travel", amount: 14500 },
    { id: 3, person: "Rahul", title: "Beachside Dinner", category: "Food & Dining", amount: 4800 },
  ]);
  const [expensePerson, setExpensePerson] = useState("");
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("General");
  const [expenseAmount, setExpenseAmount] = useState("");

  function addMember() {
    if (memberName.trim() === "") return;
    if (members.includes(memberName.trim())) {
      alert("Member already added!");
      return;
    }
    setMembers([...members, memberName.trim()]);
    setMemberName("");
  }

  function removeMember(index) {
    const memberToRemove = members[index];
    setMembers(members.filter((_, i) => i !== index));
    setExpenses(expenses.filter((e) => e.person !== memberToRemove));
  }

  function addExpense() {
    if (
      expensePerson === "" ||
      expenseAmount === "" ||
      Number(expenseAmount) <= 0
    ) {
      return;
    }

    setExpenses([
      ...expenses,
      {
        id: Date.now(),
        person: expensePerson,
        title: expenseTitle.trim() || `${expenseCategory} Expense`,
        category: expenseCategory,
        amount: Number(expenseAmount)
      }
    ]);

    setExpensePerson("");
    setExpenseTitle("");
    setExpenseAmount("");
  }

  function removeExpense(id) {
    setExpenses(expenses.filter((e) => e.id !== id));
  }

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const averageExpense =
    members.length > 0 ? totalExpenses / members.length : 0;

  const balances = members.map((member) => {
    const paid = expenses
      .filter((expense) => expense.person === member)
      .reduce((total, expense) => total + expense.amount, 0);

    return {
      member,
      paid,
      balance: paid - averageExpense
    };
  });

  const settlements = [];
  const debtors = balances.filter((p) => p.balance < -1).map(p => ({ ...p, owe: Math.abs(p.balance) }));
  const creditors = balances.filter((p) => p.balance > 1).map(p => ({ ...p, get: p.balance }));

  debtors.forEach((debtor) => {
    creditors.forEach((creditor) => {
      if (debtor.owe > 0 && creditor.get > 0) {
        const transfer = Math.min(debtor.owe, creditor.get);
        if (transfer > 0) {
          settlements.push({
            from: debtor.member,
            to: creditor.member,
            amount: transfer
          });
          debtor.owe -= transfer;
          creditor.get -= transfer;
        }
      }
    });
  });

  const handleBookFlightsForGroup = () => {
    const dest = destination.trim() || "Goa";
    navigate("/flights", {
      state: {
        prefillDestination: dest,
      }
    });
  };

  return (
    <div className="group-page">
      <div className="group-container">

        {/* Hero Section */}
        <section className="group-hero">
          <div className="group-hero-content">
            <div className="group-hero-pill">
              <Users size={14} />
              <span>GROUP TRAVEL &amp; EXPENSE SPLITTER</span>
            </div>

            <h1>Your trip. Your crew. Perfect splits.</h1>

            <p>
              Plan itineraries together, track group expenses in real-time, and let our smart algorithm compute settlements automatically.
            </p>
          </div>
        </section>

        {/* Group Stats Bar */}
        <div className="group-summary-stats-grid">
          <div className="group-stat-card card">
            <div className="stat-icon-wrap bg-blue">
              <Wallet size={20} />
            </div>
            <div className="stat-text">
              <span className="stat-label">Total Spent</span>
              <strong className="stat-val">₹{totalExpenses.toLocaleString("en-IN")}</strong>
            </div>
          </div>

          <div className="group-stat-card card">
            <div className="stat-icon-wrap bg-amber">
              <DollarSign size={20} />
            </div>
            <div className="stat-text">
              <span className="stat-label">Per Person Split</span>
              <strong className="stat-val">₹{Math.round(averageExpense).toLocaleString("en-IN")}</strong>
            </div>
          </div>

          <div className="group-stat-card card">
            <div className="stat-icon-wrap bg-green">
              <Users size={20} />
            </div>
            <div className="stat-text">
              <span className="stat-label">Crew Members</span>
              <strong className="stat-val">{members.length} Explorers</strong>
            </div>
          </div>
        </div>

        {/* Group Basics & AI Planner Trigger */}
        <div className="group-card card">
          <div className="section-heading">
            <div>
              <h2><MapPin size={20} /> Trip Details</h2>
              <p>Set up the basics for your group expedition.</p>
            </div>
            <button
              type="button"
              className="btn btn-ai-quick"
              onClick={handleBookFlightsForGroup}
            >
              <Plane size={15} /> Find Group Flights
            </button>
          </div>

          <div className="group-form-grid">
            <div className="form-group">
              <label>Trip / Group Name</label>
              <input
                type="text"
                placeholder="e.g. Goa Annual Getaway, Japan Expedition..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Target Destination</label>
              <input
                type="text"
                placeholder="e.g. Goa, Manali, Bali, Tokyo..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Estimated Total Budget</label>
              <input
                type="number"
                placeholder="₹ Budget limit"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Members Management */}
        <div className="group-card card">
          <div className="section-heading">
            <div>
              <h2><Users size={20} /> Group Members</h2>
              <p>Add friends joining the trip.</p>
            </div>
            <span className="member-badge-count">{members.length} members</span>
          </div>

          <div className="member-input-row">
            <input
              type="text"
              placeholder="Enter friend's name (e.g. Maya, Sam, Rohan)..."
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addMember();
                }
              }}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={addMember}
            >
              <Plus size={16} /> Add Member
            </button>
          </div>

          {members.length === 0 ? (
            <div className="no-members-box">
              <p>No members added yet. Add at least 2 people to split expenses.</p>
            </div>
          ) : (
            <div className="member-tag-grid">
              {members.map((member, index) => {
                const bal = balances.find(b => b.member === member)?.balance || 0;
                return (
                  <div className="member-pill-item" key={index}>
                    <div className="member-avatar">
                      {member.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="member-meta">
                      <strong>{member}</strong>
                      <span className={`member-bal ${bal >= 0 ? "positive" : "negative"}`}>
                        {bal >= 0 ? `+₹${Math.round(bal).toLocaleString("en-IN")}` : `-₹${Math.round(Math.abs(bal)).toLocaleString("en-IN")}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="remove-member-btn"
                      onClick={() => removeMember(index)}
                      title={`Remove ${member}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Expense Tracker */}
        <div className="group-card card">
          <div className="section-heading">
            <div>
              <h2><DollarSign size={20} /> Add New Expense</h2>
              <p>Record who paid and what it was for.</p>
            </div>
          </div>

          {members.length > 0 ? (
            <div className="expense-inputs-grid">
              <div className="form-group">
                <label>Paid by</label>
                <select
                  value={expensePerson}
                  onChange={(e) => setExpensePerson(e.target.value)}
                >
                  <option value="">Select payer</option>
                  {members.map((m, i) => (
                    <option key={i} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description / Item</label>
                <input
                  type="text"
                  placeholder="e.g. Airbnb Booking, Seafood Dinner..."
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                >
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  placeholder="₹ Amount"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                />
              </div>

              <div className="add-btn-col">
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={addExpense}
                >
                  <Plus size={16} /> Add Expense
                </button>
              </div>
            </div>
          ) : (
            <p className="no-expenses">Please add members above to record expenses.</p>
          )}

          {/* Expenses Table / List */}
          <div className="expense-list-section">
            <h3>Recent Expenses ({expenses.length})</h3>
            {expenses.length === 0 ? (
              <p className="no-expenses">No expenses added yet. Record your first shared cost above.</p>
            ) : (
              <div className="expense-items-list">
                {expenses.map((expense) => (
                  <div className="expense-item-row" key={expense.id}>
                    <div className="expense-item-left">
                      <div className="expense-cat-badge">
                        <Tag size={12} /> {expense.category || "General"}
                      </div>
                      <div>
                        <strong>{expense.title}</strong>
                        <span className="expense-payer">Paid by <em>{expense.person}</em></span>
                      </div>
                    </div>

                    <div className="expense-item-right">
                      <strong className="expense-amount-val">
                        ₹{expense.amount.toLocaleString("en-IN")}
                      </strong>
                      <button
                        type="button"
                        className="btn-delete-expense"
                        onClick={() => removeExpense(expense.id)}
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

          {/* Settlement Solution Section */}
          <div className="settlement-section">
            <div className="settlement-header">
              <h3><CheckCircle size={18} /> Smart Settlement Plan</h3>
              <span className="settlement-sub">Optimal minimum transactions to settle all debts</span>
            </div>

            {settlements.length === 0 ? (
              <div className="all-settled-box">
                <CheckCircle size={24} color="#107c41" />
                <span>All balances are settled up! Nobody owes anything.</span>
              </div>
            ) : (
              <div className="settlement-cards-grid">
                {settlements.map((settlement, index) => (
                  <div className="settlement-card" key={index}>
                    <div className="settlement-actors">
                      <div className="actor-from">
                        <span className="actor-name">{settlement.from}</span>
                        <span className="actor-role">Pays</span>
                      </div>
                      <ArrowRight size={18} className="settlement-arrow" />
                      <div className="actor-to">
                        <span className="actor-name">{settlement.to}</span>
                        <span className="actor-role">Receives</span>
                      </div>
                    </div>
                    <div className="settlement-amount-box">
                      <strong>₹{Math.round(settlement.amount).toLocaleString("en-IN")}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

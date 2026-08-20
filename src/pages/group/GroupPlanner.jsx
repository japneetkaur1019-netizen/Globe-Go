import { useState } from "react";
import "./GroupPlanner.css";

function GroupPlanner() {
  const [groupName, setGroupName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [members, setMembers] = useState([]);

  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");

  const [expenses, setExpenses] = useState([]);
  const [expensePerson, setExpensePerson] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");

  function addMember() {
    if (memberName.trim() === "") return;

    setMembers([...members, memberName.trim()]);
    setMemberName("");
  }

  function removeMember(index) {
    setMembers(
      members.filter((_, i) => i !== index)
    );
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
        person: expensePerson,
        amount: Number(expenseAmount)
      }
    ]);

    setExpensePerson("");
    setExpenseAmount("");
  }

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total + expense.amount,
    0
  );
  const averageExpense =
  members.length > 0
    ? totalExpenses / members.length
    : 0;

const balances = members.map((member) => {

  const paid = expenses
    .filter(
      (expense) => expense.person === member
    )
    .reduce(
      (total, expense) =>
        total + expense.amount,
      0
    );

  return {
    member,
    paid,
    balance: paid - averageExpense
  };
});

const settlements = [];

balances.forEach((person) => {

  if (person.balance < 0) {

    const creditor = balances.find(
      (other) => other.balance > 0
    );

    if (creditor) {

      settlements.push({
        from: person.member,
        to: creditor.member,
        amount: Math.min(
          Math.abs(person.balance),
          creditor.balance
        )
      });

    }
  }
});

  return (
    <div className="group-page">

      <div className="group-container">

        {/* HERO */}

        <section className="group-hero">

          <div className="group-hero-content">

            <p className="flight-label">
              GROUP TRAVEL
            </p>

            <h1>
              Your trip.
              <br />
              Your people.
            </h1>

            <p>
              Plan your journey together,
              keep track of expenses and
              make every trip easier.
            </p>

          </div>

        </section>


        {/* GROUP DETAILS */}

        <div className="group-card card">

          <div className="section-heading">
            <h2>
              ✈️ Trip Details
            </h2>

            <p>
              Set up the basics of your group trip.
            </p>
          </div>


          <div className="group-form-grid">

            <div className="form-group">

              <label>
                Group Name
              </label>

              <input
                type="text"
                placeholder="e.g. Goa Trip"
                value={groupName}
                onChange={(e) =>
                  setGroupName(e.target.value)
                }
              />

            </div>


            <div className="form-group">

              <label>
                Destination
              </label>

              <input
                type="text"
                placeholder="e.g. Goa"
                value={destination}
                onChange={(e) =>
                  setDestination(e.target.value)
                }
              />

            </div>


            <div className="form-group">

              <label>
                Total Budget
              </label>

              <input
                type="number"
                placeholder="₹ Enter budget"
                value={budget}
                onChange={(e) =>
                  setBudget(e.target.value)
                }
              />

            </div>

          </div>

        </div>


        {/* MEMBERS */}

        <div className="group-card card">

          <div className="section-heading">

            <h2>
              👥 Group Members
            </h2>

            <p>
              Add everyone joining the trip.
            </p>

          </div>


          <div className="member-input">

            <input
              type="text"
              placeholder="Enter member name"
              value={memberName}
              onChange={(e) =>
                setMemberName(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addMember();
                }
              }}
            />

            <button
              className="btn btn-primary"
              onClick={addMember}
            >
              + Add
            </button>

          </div>


          {members.length === 0 ? (

            <p className="no-members">
              No members added yet.
            </p>

          ) : (

            <div className="member-list">

              {members.map(
                (member, index) => (

                  <div
                    className="member-item"
                    key={index}
                  >

                    <span>
                      👤 {member}
                    </span>

                    <button
                      onClick={() =>
                        removeMember(index)
                      }
                    >
                      Remove
                    </button>

                  </div>

                )
              )}

            </div>

          )}

        </div>


        {/* EXPENSE TRACKER */}

        <div className="group-card card">

          <div className="section-heading">

            <h2>
              💰 Trip Expenses
            </h2>

            <p>
              Keep track of who paid for what.
            </p>

          </div>


          {members.length > 0 && (

            <div className="expense-input">

              <select
                value={expensePerson}
                onChange={(e) =>
                  setExpensePerson(e.target.value)
                }
              >

                <option value="">
                  Who paid?
                </option>

                {members.map(
                  (member, index) => (
                    <option
                      key={index}
                      value={member}
                    >
                      {member}
                    </option>
                  )
                )}

              </select>


              <input
                type="number"
                placeholder="Amount ₹"
                value={expenseAmount}
                onChange={(e) =>
                  setExpenseAmount(e.target.value)
                }
              />


              <button
                className="btn btn-primary"
                onClick={addExpense}
              >
                Add Expense
              </button>

            </div>

          )}


          {expenses.length === 0 ? (

            <p className="no-expenses">
              No expenses added yet.
            </p>

          ) : (

            <>

              <div className="expense-list">

                {expenses.map(
                  (expense, index) => (

                    <div
                      className="expense-item"
                      key={index}
                    >

                      <span>
                        👤 {expense.person}
                      </span>

                      <strong>
                        ₹
                        {expense.amount.toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                  )
                )}

              </div>


              <div className="expense-total">

                <span>
                  Total Expenses
                </span>

                <strong>
                  ₹
                  {totalExpenses.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>
              <div className="settlement-section">

  <h3>
    💸 Who owes whom?
  </h3>

  {settlements.length === 0 ? (

    <p className="no-expenses">
      Everyone is settled up.
    </p>

  ) : (

    <div className="settlement-list">

      {settlements.map(
        (settlement, index) => (

          <div
            className="settlement-item"
            key={index}
          >

            <span>
              <strong>
                {settlement.from}
              </strong>

              {" owes "}

              <strong>
                {settlement.to}
              </strong>
            </span>

            <strong className="settlement-amount">
              ₹
              {Math.round(
                settlement.amount
              ).toLocaleString("en-IN")}
            </strong>

          </div>

        )
      )}

    </div>

  )}

</div>
            </>

          )}

        </div>

      </div>

    </div>
  );
}

export default GroupPlanner;


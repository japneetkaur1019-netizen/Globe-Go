/**
 * GroupPolls.jsx  —  Route: /group/polls
 *
 * Group voting and democratic trip decision making.
 *
 * React Router usage:
 *  - Link: navigation to /group/itinerary, /group/budget, /group/overview
 *  - useNavigate: jump to related sections
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Vote,
  Plus,
  Trash2,
  Sparkles,
  Star,
  ThumbsUp,
  CalendarDays,
  Zap,
} from "lucide-react";
import { useGroupTrip } from "../../context/GroupTripContext";

function Avatar({ name, size = 24, style = {} }) {
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
        fontSize: size * 0.38,
        fontWeight: 700,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}
    >
      {initials}
    </div>
  );
}

export default function GroupPolls() {
  const navigate = useNavigate();

  const {
    members,
    polls,
    addPoll,
    votePoll,
    closePoll,
    deletePoll,
  } = useGroupTrip();

  /* Form state */
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions]   = useState(["", ""]);
  const [votingAs, setVotingAs]         = useState(members[0] || "");

  function handleCreatePoll(e) {
    e.preventDefault();
    const validOptions = pollOptions.filter((o) => o.trim());
    if (!pollQuestion.trim() || validOptions.length < 2) return;

    addPoll({
      id: Date.now(),
      question: pollQuestion.trim(),
      options: validOptions.map((o, i) => ({
        id: String(i),
        label: o.trim(),
        votes: [],
      })),
      createdBy: votingAs || members[0] || "Crew Leader",
      closed: false,
    });

    setPollQuestion("");
    setPollOptions(["", ""]);
  }

  function handleVote(pollId, optionId) {
    if (!votingAs) return;
    votePoll(pollId, optionId, votingAs);
  }

  return (
    <div className="gp-tab-content">
      {/* ── Create Poll Card ─────────────────────────────── */}
      <div className="gp-card">
        <div className="gp-card-header">
          <div>
            <h2>
              <Vote size={18} /> Create Group Poll
            </h2>
            <p>Gather votes on hotels, activity options, dining spots, or budgets.</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Link to="/group/budget" className="gp-btn gp-btn-ghost gp-btn-sm">
              <Zap size={14} /> View Budget
            </Link>
            <Link to="/group/itinerary" className="gp-btn gp-btn-ghost gp-btn-sm">
              <CalendarDays size={14} /> Schedule Itinerary
            </Link>
          </div>
        </div>

        <form onSubmit={handleCreatePoll} className="gp-poll-create-form">
          <div className="gp-form-field">
            <label>Poll Question</label>
            <input
              type="text"
              placeholder="e.g. Which villa should we rent? / Preferred date to fly?"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              required
            />
          </div>

          <div className="gp-poll-options-grid">
            <label>Voting Choices (minimum 2)</label>
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
                  required={i < 2}
                />
                {pollOptions.length > 2 && (
                  <button
                    type="button"
                    className="gp-icon-btn gp-icon-btn-danger"
                    onClick={() =>
                      setPollOptions(pollOptions.filter((_, j) => j !== i))
                    }
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="gp-add-opt-btn"
              onClick={() => setPollOptions([...pollOptions, ""])}
            >
              <Plus size={13} /> Add Another Option
            </button>
          </div>

          <button type="submit" className="gp-btn gp-btn-primary" style={{ alignSelf: "flex-start", marginTop: "10px" }}>
            <Sparkles size={15} /> Publish Poll
          </button>
        </form>
      </div>

      {/* ── Active Voter Bar ──────────────────────────────── */}
      {members.length > 0 && (
        <div className="gp-voting-as-bar">
          <span>Active Voter:</span>
          {members.map((m) => (
            <button
              key={m}
              type="button"
              className={`gp-voting-chip ${votingAs === m ? "active" : ""}`}
              onClick={() => setVotingAs(m)}
            >
              <Avatar name={m} size={22} />
              {m}
            </button>
          ))}
        </div>
      )}

      {/* ── Polls List ────────────────────────────────────── */}
      {polls.length === 0 ? (
        <div className="gp-card">
          <div className="gp-empty-box">
            No active polls. Create one above to gather consensus with your crew!
          </div>
        </div>
      ) : (
        polls.map((poll) => {
          const totalVotes = poll.options.reduce((s, o) => s + o.votes.length, 0);
          const winner = [...poll.options].sort(
            (a, b) => b.votes.length - a.votes.length
          )[0];

          return (
            <div
              className={`gp-card gp-poll-card ${poll.closed ? "gp-poll-closed" : ""}`}
              key={poll.id}
            >
              <div className="gp-poll-header">
                <div>
                  <h3>{poll.question}</h3>
                  <span>
                    {totalVotes} vote{totalVotes !== 1 ? "s" : ""} · Created by {poll.createdBy}
                    {poll.closed && <span className="gp-closed-badge"> · Closed</span>}
                  </span>
                </div>
                <div className="gp-poll-header-actions">
                  {!poll.closed && (
                    <button
                      type="button"
                      className="gp-btn gp-btn-ghost gp-btn-sm"
                      onClick={() => closePoll(poll.id)}
                    >
                      Close Poll
                    </button>
                  )}
                  <button
                    type="button"
                    className="gp-icon-btn gp-icon-btn-danger"
                    onClick={() => deletePoll(poll.id)}
                    title="Delete poll"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="gp-poll-options">
                {poll.options.map((opt) => {
                  const pct = totalVotes > 0 ? (opt.votes.length / totalVotes) * 100 : 0;
                  const isWinner = poll.closed && opt.id === winner.id && opt.votes.length > 0;
                  const userVoted = opt.votes.includes(votingAs);

                  return (
                    <div
                      key={opt.id}
                      className={`gp-poll-option ${userVoted ? "voted" : ""} ${
                        isWinner ? "winner" : ""
                      }`}
                      onClick={() => !poll.closed && handleVote(poll.id, opt.id)}
                      style={{ cursor: poll.closed ? "default" : "pointer" }}
                    >
                      <div className="gp-poll-option-top">
                        <div className="gp-poll-option-label">
                          {isWinner && <Star size={13} fill="#ffc72c" color="#ffc72c" />}
                          <span>{opt.label}</span>
                          {userVoted && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", color: "var(--primary)", fontSize: "11px" }}>
                              <ThumbsUp size={12} className="gp-your-vote" /> Your Vote
                            </span>
                          )}
                        </div>
                        <span className="gp-poll-count">
                          {opt.votes.length} vote{opt.votes.length !== 1 ? "s" : ""} ({Math.round(pct)}%)
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
                            <Avatar key={v} name={v} size={20} />
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
  );
}

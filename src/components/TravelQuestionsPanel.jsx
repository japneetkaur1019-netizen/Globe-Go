import { useState } from 'react';
import { HelpCircle, Send } from 'lucide-react';
import AIConversation from './AIConversation.jsx';
import { answerTravelQuestion, QUESTION_PRESETS } from '../data/mockAI.js';

let idCounter = 0;
const nextId = () => { idCounter += 1; return idCounter; };

export default function TravelQuestionsPanel() {
  const [messages, setMessages] = useState([
    { id: nextId(), from: 'ai', text: 'Ask me anything regarding international packing lists, budgeting, local safety rules, or seasonal weather advice.' },
  ]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');

  const ask = (question) => {
    if (!question.trim()) return;
    setMessages((m) => [...m, { id: nextId(), from: 'user', text: question }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const answer = answerTravelQuestion(question);
      setMessages((m) => [...m, { id: nextId(), from: 'ai', text: answer }]);
      setTyping(false);
    }, 700);
  };

  return (
    <div>
      <div className="panel" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <HelpCircle size={22} color="#006ce4" />
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Travel Intelligence Q&amp;A</h3>
        </div>
        <p style={{ color: 'var(--ink-500)', fontSize: '0.9rem', marginBottom: 16 }}>
          Instant answers on luggage packing, visa protocols, seasonal highlights and traveler safety.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {QUESTION_PRESETS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => ask(q)}
              style={{
                padding: '7px 14px',
                borderRadius: 999,
                border: '1px solid var(--border-color)',
                background: 'var(--cream)',
                color: 'var(--ink-800)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <AIConversation messages={messages} typing={typing} />

      <form
        onSubmit={(e) => { e.preventDefault(); ask(input); }}
        style={{ display: 'flex', gap: 10, marginTop: 16 }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a travel question (e.g. What is the best season to visit Japan?)..."
          style={{ flex: 1, padding: '12px 16px', borderRadius: 8, border: '1.5px solid var(--border-color)', fontSize: '0.92rem' }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '0 20px' }}>
          <Send size={16} />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
}

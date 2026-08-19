import { useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';

export default function AIConversation({ messages, typing }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  if (!messages || !messages.length) return null;

  return (
    <div
      style={{
        background: 'var(--white)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: 24,
      }}
    >
      <div
        style={{
          padding: '12px 18px',
          background: 'var(--off-white)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontWeight: 700,
          fontSize: '0.88rem',
          color: 'var(--ink-900)',
        }}
      >
        <Bot size={17} color="#006ce4" />
        <span>GlobeGo Travel Intelligence Assistant</span>
      </div>

      <div
        ref={scrollRef}
        style={{
          padding: '16px 20px',
          maxHeight: 280,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
            }}
          >
            {m.from === 'ai' && (
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--pine-100)',
                  color: 'var(--expedia-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <Bot size={15} />
              </div>
            )}

            <div
              style={{
                padding: '10px 16px',
                borderRadius: 14,
                fontSize: '0.9rem',
                lineHeight: 1.45,
                background: m.from === 'user' ? 'var(--expedia-blue)' : 'var(--cream)',
                color: m.from === 'user' ? '#ffffff' : 'var(--ink-900)',
                border: m.from === 'user' ? 'none' : '1px solid var(--border-color)',
              }}
            >
              {m.text}
            </div>

            {m.from === 'user' && (
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--pine-900)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <User size={15} />
              </div>
            )}
          </div>
        ))}

        {typing && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--pine-100)',
                color: 'var(--expedia-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bot size={15} />
            </div>
            <div style={{ padding: '8px 14px', background: 'var(--cream)', borderRadius: 14, fontSize: '0.84rem', color: 'var(--ink-500)' }}>
              AI is computing travel itinerary...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

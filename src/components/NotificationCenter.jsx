import { useState, useRef, useEffect } from 'react';
import { Bell, Sparkles, Tag, Heart, BookmarkCheck, Calendar, DollarSign, Info } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

function getIcon(type) {
  switch (type) {
    case 'Sparkles':
      return <Sparkles size={16} color="#006ce4" />;
    case 'Tag':
      return <Tag size={16} color="#c8791a" />;
    case 'Heart':
      return <Heart size={16} color="#e11d48" />;
    case 'BookmarkCheck':
      return <BookmarkCheck size={16} color="#107c41" />;
    case 'Calendar':
      return <Calendar size={16} color="#006ce4" />;
    case 'DollarSign':
      return <DollarSign size={16} color="#107c41" />;
    default:
      return <Info size={16} color="#006ce4" />;
  }
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationCenter() {
  const { notifications, markNotificationsRead } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const toggle = () => {
    setOpen((o) => {
      if (!o) markNotificationsRead();
      return !o;
    });
  };

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button
        type="button"
        className="navbar-icon-btn"
        onClick={toggle}
        aria-label="Notifications"
        title="View Notifications"
      >
        <Bell size={17} />
        {unread > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 18,
              height: 18,
              background: '#e11d48',
              color: '#ffffff',
              borderRadius: '50%',
              fontSize: '0.7rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            right: 0,
            width: 320,
            background: 'var(--white)',
            border: '1px solid var(--border-color)',
            borderRadius: 14,
            boxShadow: 'var(--shadow-xl)',
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-color)',
              fontWeight: 700,
              fontSize: '0.92rem',
              color: 'var(--ink-900)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Notifications</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--ink-500)', fontWeight: 600 }}>{notifications.length} Total</span>
          </div>

          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--ink-500)', fontSize: '0.85rem' }}>
                No notifications right now
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                    background: n.read ? 'transparent' : 'var(--pine-50)',
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: 'var(--off-white)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {getIcon(n.iconType)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--ink-900)', marginBottom: 2 }}>{n.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-700)', lineHeight: 1.35, marginBottom: 4 }}>{n.body}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--ink-500)' }}>{timeAgo(n.time)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

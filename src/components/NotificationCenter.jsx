import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Bell, Sparkles, Tag, Heart, BookmarkCheck, Calendar, DollarSign,
  Info, Plane, X, CheckCheck, Search, ArrowRight, Clock3
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import './NotificationCenter.css';

function getIcon(type) {
  const icons = {
    Sparkles: <Sparkles size={17} />,
    Tag: <Tag size={17} />,
    Heart: <Heart size={17} />,
    BookmarkCheck: <BookmarkCheck size={17} />,
    Calendar: <Calendar size={17} />,
    DollarSign: <DollarSign size={17} />,
    Plane: <Plane size={17} />,
  };
  return icons[type] || <Info size={17} />;
}

function getTypeClass(type) {
  return {
    Sparkles: 'notification-icon--blue',
    Tag: 'notification-icon--gold',
    Heart: 'notification-icon--rose',
    BookmarkCheck: 'notification-icon--green',
    Calendar: 'notification-icon--blue',
    DollarSign: 'notification-icon--green',
    Plane: 'notification-icon--purple',
  }[type] || 'notification-icon--blue';
}

function timeAgo(iso) {
  if (!iso) return 'Just now';
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationCenter() {
  const { notifications = [], markNotificationsRead } = useApp();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const ref = useRef(null);

  const unread = notifications.filter((n) => !n.read).length;

  const filteredNotifications = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return notifications
      .filter((n) => filter === 'all' || (filter === 'unread' && !n.read))
      .filter((n) => {
        if (!normalized) return true;
        return `${n.title || ''} ${n.body || ''}`.toLowerCase().includes(normalized);
      })
      .sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0));
  }, [notifications, filter, query]);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSelected(null);
      }
    };

    const onEscape = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setSelected(null);
      }
    };

    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEscape);

    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEscape);
    };
  }, []);

  const toggle = () => {
    setOpen((wasOpen) => {
      if (!wasOpen && unread > 0) markNotificationsRead();
      return !wasOpen;
    });
  };

  return (
    <div className="notification-center" ref={ref}>
      <button
        type="button"
        className={`navbar-icon-btn notification-trigger ${open ? 'is-open' : ''}`}
        onClick={toggle}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        title="Notifications"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="notification-badge">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
        <span className="notification-pulse" />
      </button>

      {open && (
        <div className="notification-panel">
          <div className="notification-panel__hero">
            <div className="notification-hero-image">
              <img
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=85"
                alt="Airplane above the clouds"
              />
              <div className="notification-hero-overlay" />
              <div className="notification-hero-copy">
                <span className="notification-eyebrow">
                  <Sparkles size={12} /> GLOBEGO UPDATES
                </span>
                <h3>Your travel inbox</h3>
                <p>Deals, trip updates and personalized inspiration.</p>
              </div>
              <button
                type="button"
                className="notification-close"
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="notification-summary">
            <div>
              <strong>{unread}</strong>
              <span>unread</span>
            </div>
            <div>
              <strong>{notifications.length}</strong>
              <span>updates</span>
            </div>
            <div className="notification-summary__status">
              <span className="status-dot" />
              Live
            </div>
          </div>

          <div className="notification-toolbar">
            <div className="notification-search">
              <Search size={15} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search updates..."
                aria-label="Search notifications"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="notification-filters" role="tablist" aria-label="Notification filters">
              <button
                type="button"
                className={filter === 'all' ? 'active' : ''}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={filter === 'unread' ? 'active' : ''}
                onClick={() => setFilter('unread')}
              >
                Unread {unread > 0 && <b>{unread}</b>}
              </button>
            </div>
          </div>

          <div className="notification-list">
            {filteredNotifications.length === 0 ? (
              <div className="notification-empty">
                <div className="notification-empty__visual">
                  <img
                    src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=700&q=80"
                    alt=""
                  />
                  <span><Bell size={22} /></span>
                </div>
                <h4>{query ? 'No matching updates' : 'You’re all caught up'}</h4>
                <p>
                  {query
                    ? 'Try another keyword or clear your search.'
                    : 'New trip ideas and travel alerts will appear here.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <button
                  type="button"
                  key={n.id}
                  className={`notification-item ${n.read ? '' : 'is-unread'}`}
                  onClick={() => setSelected(selected?.id === n.id ? null : n)}
                >
                  <span className={`notification-icon ${getTypeClass(n.iconType)}`}>
                    {getIcon(n.iconType)}
                  </span>

                  <span className="notification-item__content">
                    <span className="notification-item__top">
                      <strong>{n.title}</strong>
                      {!n.read && <i aria-label="Unread notification" />}
                    </span>
                    <span className="notification-item__body">{n.body}</span>
                    <span className="notification-item__meta">
                      <Clock3 size={12} /> {timeAgo(n.time)}
                    </span>

                    {selected?.id === n.id && (
                      <span className="notification-item__expanded">
                        <span>Travel update</span>
                        <small>Tap to explore this notification in your GlobeGo journey.</small>
                        <ArrowRight size={14} />
                      </span>
                    )}
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="notification-panel__footer">
            <button
              type="button"
              className="notification-clear-read"
              onClick={() => markNotificationsRead()}
              disabled={!unread}
            >
              <CheckCheck size={15} />
              {unread ? 'Mark all as read' : 'All notifications read'}
            </button>
            <span><BookmarkCheck size={13} /> Personalized for you</span>
          </div>
        </div>
      )}
    </div>
  );
}
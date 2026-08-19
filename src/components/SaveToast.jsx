import { CheckCircle, Heart, RefreshCw, TrendingDown, BookmarkCheck } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

function getToastIcon(type) {
  switch (type) {
    case 'Heart':
      return <Heart size={20} color="#e11d48" fill="#e11d48" />;
    case 'RefreshCw':
      return <RefreshCw size={20} color="#006ce4" />;
    case 'TrendingDown':
      return <TrendingDown size={20} color="#107c41" />;
    case 'BookmarkCheck':
      return <BookmarkCheck size={20} color="#107c41" />;
    default:
      return <CheckCircle size={20} color="#107c41" />;
  }
}

export default function SaveToast() {
  const { toast } = useApp();
  if (!toast) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {getToastIcon(toast.iconType)}
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.94rem' }}>{toast.title}</div>
        {toast.body && <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: 2 }}>{toast.body}</div>}
      </div>
    </div>
  );
}

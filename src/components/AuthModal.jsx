import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import AuthForm from '../pages/auth/AuthForm.jsx';
import '../pages/auth/Auth.css';

export default function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && authModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  return (
    <div className="auth-modal-backdrop" onClick={closeAuthModal}>
      <div className="auth-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="auth-modal-close-btn"
          onClick={closeAuthModal}
          aria-label="Close login dialog"
        >
          <X size={18} />
        </button>

        <div className="auth-modal-body">
          <AuthForm initialMode={authModalMode} onSuccess={closeAuthModal} />
        </div>
      </div>
    </div>
  );
}

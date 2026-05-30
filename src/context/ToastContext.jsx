import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  function remove(id) {
    setToasts(prev => prev.filter(t => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {toasts.length > 0 && (
        <div style={styles.container}>
          {toasts.map(toast => (
            <div
              key={toast.id}
              onClick={() => remove(toast.id)}
              style={{
                ...styles.toast,
                background: toast.type === 'success' ? '#16a34a'
                  : toast.type === 'error' ? '#dc2626'
                  : '#2563eb',
              }}
            >
              <span style={styles.icon}>
                {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
              </span>
              {toast.message}
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

const styles = {
  container: {
    position: 'fixed',
    top: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    width: '90%',
    maxWidth: 440,
    pointerEvents: 'none',
  },
  toast: {
    color: '#fff',
    padding: '12px 16px',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
    pointerEvents: 'auto',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    animation: 'slideDown 0.25s ease',
  },
  icon: { fontSize: 16, flexShrink: 0 },
};

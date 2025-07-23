import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  color?: string;
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, color = 'green', duration = 2500, onClose }) => {
  useEffect(() => {
    if (!onClose) return;
    const timeout = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timeout);
  }, [onClose, duration]);

  return (
    <div
      aria-label="toast-message"
      style={{
        color,
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#fff',
        border: `1px solid ${color === 'green' ? '#b2f2bb' : color === 'red' ? '#ffa8a8' : '#ccc'}`,
        borderRadius: 8,
        padding: '12px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        zIndex: 1000,
        minWidth: 200,
        textAlign: 'center',
      }}
    >
      {message}
    </div>
  );
};

export default Toast; 
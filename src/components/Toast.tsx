import React, { useEffect } from "react";
import '../styles/components/Toast.scss';

interface ToastProps {
  message: string;
  color?: 'green' | 'red';
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
      className={`toast-message ${color}`}
    >
      {message}
    </div>
  );
};

export default Toast; 
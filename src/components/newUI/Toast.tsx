import { useEffect } from "react";
import { Check, Close } from '@mui/icons-material';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number; // ms
  type?: "success" | "error";
}

const Toast: React.FC<ToastProps> = ({
  message,
  show,
  onClose,
  duration = 3000,
  type = "success",
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
      <div
        className={`fixed bottom-10 right-10 transform  z-[2000] transition-all duration-300 bg-brand-whiteback border-2
        ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}
        ${type === "error" ? "border-red-400" : "border-green-500"}
        px-5 py-3 rounded shadow-lg text-gray-500 pointer-events-none select-none`}
    >
      {type === "error" ? (
        <Close className="text-red-400 mr-2"/>
      ) : (
        <Check className="text-green-500 mr-2"/>
        )}
      {message}
    </div>
  );
};

export default Toast;

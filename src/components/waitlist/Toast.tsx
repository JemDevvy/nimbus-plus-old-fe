import { useEffect } from "react";

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
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-[1000] transition-all duration-300
        ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}
        ${type === "error" ? "bg-red-400" : "bg-green-400"}
        text-white px-6 py-3 rounded shadow-lg font-medium`}
    >
      {message}
    </div>
  );
};

export default Toast;

import { useState, useEffect } from "react";
interface ToastProps {
  content: string;
  type?: "success" | "error" | "info";
  duration?: number; // Duration in milliseconds
  position?: "top" | "bottom" | "center"; // Toast position
}
const Toast = ({
  content,
  type = "info",
  duration = 3000,
  position = "bottom",
}: ToastProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    if (duration > 0) {
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [content, duration]);

  if (!visible) return null;

  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  };

  const positionStyles = {
    top: "top-5 left-1/2 transform -translate-x-1/2",
    bottom: "bottom-10 left-1/2 transform -translate-x-1/2", // 调整底部位置稍微上移
    center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  };

  return (
    <div
      className={`fixed px-6 py-3 rounded-xl shadow-md transition-opacity duration-300 ${typeStyles[type]} ${positionStyles[position]}`}
      style={{
        zIndex: 999, // 确保提示框在最前面
        opacity: visible ? 1 : 0, // 添加淡入淡出效果
      }}
    >
      {content}
    </div>
  );
};

export default Toast;

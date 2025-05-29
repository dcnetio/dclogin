"use client";
import { createContext, useContext, useState, ReactNode, useRef, useEffect } from "react";
import Toast from "@/components/common/Toast";

interface ToastContextProps {
  showToast: (options: {
    content: string;
    type?: "success" | "error" | "info";
    duration?: number;
    position?: "top" | "bottom" | "center";
  }) => void;
  clearToast: () => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{
    content: string;
    type: "success" | "error" | "info";
    duration: number;
    position: "top" | "bottom" | "center";
  } | null>(null);

  const showToast = ({
    content,
    type = "info",
    duration = 3000,
    position = "bottom",
  }: {
    content: string;
    type?: "success" | "error" | "info";
    duration?: number;
    position?: "top" | "bottom" | "center";
  }) => {
    setToast({ content, type, duration, position });
    if (duration > 0) {
      setTimeout(() => setToast(null), duration);
    }
  };

  const clearToast = () => {
    setToast(null);
  };

  const toastRef = useRef(showToast);

  useEffect(() => {
    toastRef.current = showToast;
    (window as any).showToast = ({
      content,
      type = "info",
      duration = 3000,
      position = "bottom",
    }: {
      content: string;
      type?: "success" | "error" | "info";
      duration?: number;
      position?: "top" | "bottom" | "center";
    }) => {
      toastRef.current({ content, type, duration, position });
    };

    (window as any).clearToast = () => {
      clearToast();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, clearToast }}>
      {children}
      {toast && (
        <Toast
          content={toast.content}
          type={toast.type}
          duration={toast.duration}
          position={toast.position}
        />
      )}
    </ToastContext.Provider>
  );
};
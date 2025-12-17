"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import Toast from "@/components/common/Toast";

interface ToastContextProps {
  showToast: (options: {
    key?: string;
    content: string;
    type?: "success" | "error" | "info";
    duration?: number;
    position?: "top" | "bottom" | "center";
  }) => void;
  clearToast: () => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const keyRef = useRef("");
  const [toast, setToast] = useState<{
    key: string;
    content: string;
    type: "success" | "error" | "info";
    duration: number;
    position: "top" | "bottom" | "center";
  } | null>(null);

  const showToast = ({
    key = "",
    content,
    type = "info",
    duration = 3000,
    position = "center",
  }: {
    key?: string;
    content: string;
    type?: "success" | "error" | "info";
    duration?: number;
    position?: "top" | "bottom" | "center";
  }) => {
    keyRef.current = key;
    setToast({ key, content, type, duration, position });
    if (duration > 0) {
      setTimeout(
        () => {
          if (key === keyRef.current) {
            setToast(null);
          }
        },
        duration,
        key
      );
    }
  };

  const clearToast = () => {
    setToast(null);
  };

  const toastRef = useRef(showToast);

  useEffect(() => {
    toastRef.current = showToast;
    (window as any).showToast = ({
      key = "",
      content,
      type = "info",
      duration = 3000,
      position = "bottom",
    }: {
      key?: string;
      content: string;
      type?: "success" | "error" | "info";
      duration?: number;
      position?: "top" | "bottom" | "center";
    }) => {
      console.log("showToast", key, content, type, duration, position);
      toastRef.current({ key, content, type, duration, position });
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

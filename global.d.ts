export {};

import type{ DC } from "web-dc-api";

declare global {
  interface Window {
    dc: DC,
    showToast: (options: {
      content: string;
      type?: "success" | "error" | "info";
      duration?: number;
      position?: "top" | "bottom" | "center";
    }) => void;
    clearToast: () => void;
  }
}
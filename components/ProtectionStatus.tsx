"use client";

import { useRefreshProtection } from "@/contexts/RefreshProtectionContext";

export const ProtectionStatus = () => {
  const { enabled } = useRefreshProtection();

  if (!enabled) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 flex items-start max-w-md shadow-lg">
      <div className="flex-shrink-0">
        <svg
          className="h-5 w-5 text-red-500 mt-0.5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.966-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium">⚠️ 页面刷新提醒</p>
        <p className="text-sm mt-1">
          刷新会影响授权，请关闭该网页，重新打开授权。
        </p>
      </div>
    </div>
  );
};

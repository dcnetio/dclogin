/**
 * 检查当前URL是否包含保护参数
 */
export const hasProtectionParam = (paramName: string = "open"): boolean => {
  if (typeof window === "undefined") return false;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has(paramName);
};

/**
 * 创建带有保护参数的URL
 */
export const createProtectedUrl = (
  url: string,
  paramName: string = "open",
  paramValue: string = "true"
): string => {
  if (typeof window === "undefined") return url;

  const fullUrl = new URL(url, window.location.origin);
  fullUrl.searchParams.set(paramName, paramValue);
  return fullUrl.toString();
};

/**
 * 移除保护参数（用于清理URL）
 */
export const removeProtectionParam = (paramName: string = "open"): string => {
  if (typeof window === "undefined") return window.location.href;

  const url = new URL(window.location.href);
  url.searchParams.delete(paramName);

  // 更新URL但不刷新页面
  window.history.replaceState({}, "", url.toString());
  return url.toString();
};

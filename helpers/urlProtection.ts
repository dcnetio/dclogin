/**
 * 检查当前URL是否包含保护参数
 */
export const hasProtectionParam = (paramName: string = "origin"): boolean => {
  if (typeof window === "undefined") return false;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has(paramName);
};

/**
 * 创建带有保护参数的URL
 */
export const createProtectedUrl = (
  url: string,
  paramName: string = "origin",
  paramValue: string = "true"
): string => {
  if (typeof window === "undefined") return url;

  const fullUrl = new URL(url, window.location.origin);
  fullUrl.searchParams.set(paramName, paramValue);
  return fullUrl.toString();
};

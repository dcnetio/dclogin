import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type QueryParams = Record<string, string | number | boolean>;

class RouterManager {
  private static instance: AppRouterInstance | null = null;

  static init(router: AppRouterInstance) {
    this.instance = router;
  }

  static navigate(path: string, params?: QueryParams) {
    if (!this.instance) {
      console.error('请先在客户端组件初始化路由实例');
      return;
    }
    
    // 构造带参URL
    const query = new URLSearchParams(params as Record<string, string>);
    const fullPath = query.toString() ? `${path}?${query}` : path;
    
    this.instance.push(fullPath);
  }
}

export default RouterManager;
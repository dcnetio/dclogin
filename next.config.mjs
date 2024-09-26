/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "export",// 导出静态页面
  distDir: "build",// 打包server
  generateBuildId: async () => { // 构建ID
    // For example get the latest git commit hash here
    return 'wallet0.1'
  }
};

export default nextConfig;

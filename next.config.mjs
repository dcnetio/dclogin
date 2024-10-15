/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  output: "export",// 导出静态页面
  assetPrefix: "/v0_0_1",
  // 控制URL尾部是否自动添加斜杠
  trailingSlash: true, // 或者false，根据你的需求
  // distDir: "build",// 打包server
  // generateBuildId: async () => { // 构建ID
  //   // For example get the latest git commit hash here
  //   return 'wallet0.1'
  // },
  // // generateBuildId: () => null, // 使用 `null` 禁用 SSR
  // generateEtags: false, // 禁用 etags
  // swcMinify: true // 启用 swc 代码压缩
};

export default nextConfig;

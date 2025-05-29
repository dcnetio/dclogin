
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 基本配置
  reactStrictMode: false,
  poweredByHeader: false,
  
  // 静态导出配置
  output: "export",
  
  // 资源前缀和路径配置
  assetPrefix: "/v0_0_1",
  trailingSlash: true,
  
  // 在 Next.js 15 中，如果使用 output: "export"，
  // Server Actions 和 Server Components 会自动禁用
  // 不需要显式配置 experimental.serverActions 和 serverComponents
  
  // 可选：如果需要显式禁用某些功能（仅在非 export 模式下有效）
  // experimental: {
  //   // Next.js 15 中大部分功能已稳定，experimental 选项较少
  // },
  
  // 其他可用配置
  // distDir: "build", // 自定义构建目录
  // generateBuildId: async () => {
  //   return 'wallet0.1'
  // },
  // generateEtags: false, // 禁用 ETags
  
  // 编译和优化配置
  // swcMinify: true, // Next.js 15 默认启用，无需显式设置
  
  // 图片优化配置（静态导出时需要禁用）
  images: {
    unoptimized: true // 静态导出时必须设置为 true
  }
};

export default nextConfig;

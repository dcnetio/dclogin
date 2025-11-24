/** @type {import('next').NextConfig} */
import { readFile } from "fs/promises";

const versionJson = JSON.parse(
  await readFile(new URL("./version.json", import.meta.url), "utf8")
);

const versionPath =
  process.env.NODE_ENV === "production" ? "/" + versionJson.versionName : "";
const nextConfig = {
  // === 启用SWC压缩（重要优化）===
  swcMinify: true, // 取消注释，SWC比Terser快很多
  // === 基础配置 ===
  reactStrictMode: false, // 根据需要开启，建议开发时开启
  poweredByHeader: false, // 隐藏 X-Powered-By 头

  // === 输出配置 ===
  output: "export", // 静态导出
  trailingSlash: true, // URL 尾部斜杠

  // === 环境相关配置 ===
  assetPrefix: versionPath,
  basePath: versionPath,

  // === 图片优化配置 ===
  images: {
    unoptimized: true, // 静态导出必需
    // 如果需要图片优化，可以配置外部 loader
    // loader: 'custom',
    // loaderFile: './my-loader.js',
    // 添加格式优化
    formats: ['image/webp', 'image/avif'],
    // 添加设备尺寸配置
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // === 编译器配置 ===
  compiler: {
    // 生产环境移除 console
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error"],
          }
        : false,

    // 移除 React 属性（生产环境）
    reactRemoveProperties: process.env.NODE_ENV === "production",
    // 添加情感化CSS优化（如果使用styled-components或emotion）
    // emotion: process.env.NODE_ENV === "production",

    // styled-components 支持（如果使用）
    // styledComponents: true,
  },

  // === 性能优化 ===
  compress: true, // 启用 gzip 压缩

  // === 构建ID优化 ===
  generateBuildId: async () => {
    // 使用版本号而不是时间戳，便于缓存
    return `${versionJson.versionName} || 'V0.0.1'}`;
  },


  // === TypeScript 配置 ===
  typescript: {
    // 生产构建时忽略类型错误（不推荐，但有时需要）
    // ignoreBuildErrors: false,
  },

  // === ESLint 配置 ===
  eslint: {
    // 生产构建时忽略 ESLint 错误（不推荐）
    // ignoreDuringBuilds: false,
  },

  // === 页面扩展名 ===
  pageExtensions: ["tsx", "ts", "jsx", "js", "mdx"],

  // === 环境变量配置 ===
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || "default-value",
    // 添加构建时间用于缓存控制
    BUILD_TIME: Date.now().toString(),
  },

  // === Webpack 优化配置（重要改进）===
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    if (!dev && !isServer) {
      // 更激进的代码分割
      config.optimization.splitChunks = {
        chunks: "all",
        minSize: 20000,      // 最小chunk大小
        maxSize: 200000,     // 最大chunk大小，减小单个文件大小
        minChunks: 1,
        maxAsyncRequests: 10, // 增加异步请求数
        maxInitialRequests: 6, // 增加初始请求数
        cacheGroups: {
          // React相关库单独分离
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: "react-vendor",
            priority: 30,
            reuseExistingChunk: true,
          },
          // UI库单独分离
          ui: {
            test: /[\\/]node_modules[\\/](@mui|antd|@ant-design|lucide-react)[\\/]/,
            name: "ui-vendor",
            priority: 25,
            reuseExistingChunk: true,
          },
          // 工具库单独分离
          utils: {
            test: /[\\/]node_modules[\\/](lodash|dayjs|moment|axios)[\\/]/,
            name: "utils-vendor",
            priority: 20,
            reuseExistingChunk: true,
          },
          // 其他vendor
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: 10,
            reuseExistingChunk: true,
          },
          // 公共代码
          common: {
            name: "common",
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };

      // 添加Tree Shaking优化
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;

      // 预加载优化
      config.optimization.moduleIds = 'deterministic';
      config.optimization.chunkIds = 'deterministic';
    }

    // SVG优化
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    });

    // 添加Bundle Analyzer（开发时）
    if (!dev && process.env.ANALYZE === 'true') {
      const BundleAnalyzerPlugin = require('@next/bundle-analyzer')({
        enabled: true,
      });
      config.plugins.push(new BundleAnalyzerPlugin());
    }

    return config;
  },


  // === 优化的头部配置 ===
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
      // 静态资源长期缓存
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // HTML文件短期缓存
      {
        source: "/((?!_next).*)",
        headers: [
          {
            key: "Cache-Control", 
            value: "public, max-age=300, s-maxage=300", // 5分钟缓存
          },
        ],
      },
      // API或动态内容不缓存
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },

  rewrites: async () => {
    // 仅在开发环境中使用重写
    if (process.env.NODE_ENV !== "production") {
      return [
        {
          source: "/iframe/:path*",
          destination: "http://localhost:5174/:path*",
        }, // 添加额外的重写规则来处理 Vite 特定资源
        {
          source: "/@vite/:path*",
          destination: "http://localhost:5174/@vite/:path*",
        },
        {
          source: "/src/:path*",
          destination: "http://localhost:5174/src/:path*",
        },
        {
          source: "/node_modules/:path*",
          destination: "http://localhost:5174/node_modules/:path*",
        },
        {
          source: "/assets/:path*",
          destination: "http://localhost:5174/assets/:path*",
        },
        {
          source: "/public/:path*",
          destination: "http://localhost:5174/public/:path*",
        },
      ];
    }
    return [];
  },

  // === 实验性功能优化 ===
  experimental: {
    optimizePackageImports: [
      "lucide-react", 
      "lodash", 
      "@mui/material",
      "@mui/icons-material",
      "antd"
    ],
    
    // 启用新的App Router（如果适用）
    appDir: false, // 根据你的项目结构设置
    
    // 优化CSS
    optimizeCss: true,
    
    // 启用SWC插件
    swcPlugins: [
      // ['@swc/plugin-styled-components', {}], // 如果使用styled-components
    ],

    // 关键资源内联
    largePageDataBytes: 128 * 1000, // 128KB
  },


  // === 开发配置 ===
  ...(process.env.NODE_ENV === "development" && {
    // 开发环境特定配置
    devIndicators: {
      buildActivity: true,
      buildActivityPosition: "bottom-right",
    },
    // 开发环境快速刷新
    fastRefresh: true,
  }),

  // === 生产配置 ===
  ...(process.env.NODE_ENV === "production" && {
    // 生产环境特定配置
    generateEtags: false, // 禁用 ETags

    // 压缩配置
    compress: true,
    productionBrowserSourceMaps: false, // 禁用生产环境的浏览器源映射
  }),
  // 添加构建优化
  distDir: 'out', // 与output: 'export'配合
};

export default nextConfig;

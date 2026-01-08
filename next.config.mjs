/** @type {import('next').NextConfig} */
import { readFile } from "fs/promises";

const APP_ENV =
  process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV || "development";
const IS_DEV = APP_ENV === "development";
const IS_PROD = APP_ENV === "production";

// 动态决定要加载哪个文件
let configFileName = "config.json"; // 默认
if (APP_ENV === "production") configFileName = "config.prod.json";
if (APP_ENV === "test") configFileName = "config.test.json";

const versionJson = JSON.parse(
  await readFile(new URL(configFileName, import.meta.url), "utf8")
);
const nextConfig = {
  // === 基础配置 ===

  reactStrictMode: false, // 根据需要开启，建议开发时开启
  poweredByHeader: false, // 隐藏 X-Powered-By 头

  // === 输出配置 ===
  output: IS_DEV ? undefined : "export", // 静态导出
  trailingSlash: true, // URL 尾部斜杠

  // === 环境相关配置 ===
  assetPrefix: versionJson.basePath,
  basePath: versionJson.basePath,

  // === 图片优化配置 ===
  images: {
    unoptimized: true, // 静态导出必需
    // 如果需要图片优化，可以配置外部 loader
    // loader: 'custom',
    // loaderFile: './my-loader.js',
  },

  // === 编译器配置 ===
  compiler: {
    // 生产环境移除 console
    removeConsole: false,
    // removeConsole:
    //   process.env.NODE_ENV === "production"
    //     ? {
    //         exclude: ["error"],
    //       }
    //     : false,

    // 移除 React 属性（生产环境）
    reactRemoveProperties: !IS_DEV,

    // styled-components 支持（如果使用）
    // styledComponents: true,
  },

  // === 性能优化 ===
  compress: IS_PROD, // 启用 gzip 压缩

  // === 构建配置 ===
  // generateBuildId: async () => {
  //   // 使用时间戳或版本号作为构建ID
  //   return `v0.0.1-${Date.now()}`;
  // },

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
  },

  // === Webpack 自定义配置 ===
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 添加别名
    config.resolve.alias = {
      ...config.resolve.alias,
      "@/*": "./*",
      // 定义一个别名 '@app-config' 指向具体的 json 文件
      "@app-config": new URL(configFileName, import.meta.url).pathname,
    };

    // 优化包大小
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: 10,
            reuseExistingChunk: true,
          },
          common: {
            name: "common",
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
        maxSize: 500000, // 最大chunk大小（字节），超过会继续拆分
      };
      // config.devtool = 'hidden-source-map'; // 确保生产环境启用 Source Maps
      // config.devtool = 'source-map';
    }

    // 处理 SVG
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },

  // === 头部配置 ===
  async headers() {
    if (IS_DEV) {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "X-Frame-Options",
              value: "ALLOWALL", // 或者 'ALLOWALL'
            },
            {
              key: "X-Content-Type-Options",
              value: "nosniff",
            },
            {
              key: "Referrer-Policy",
              value: "origin-when-cross-origin",
            },
            // 缓存静态资源
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
      ];
    }
    return [];
  },

  rewrites: async () => {
    // 仅在开发环境中使用重写
    if (IS_DEV) {
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

  // === 实验性功能 ===
  experimental: {
    // 优化字体加载
    optimizePackageImports: ["lucide-react", "lodash"],

    // 启用增量缓存
    // incrementalCacheHandlerPath: false,

    // Turbo 模式（如果稳定）
    // turbo: {
    //   rules: {
    //     '*.svg': {
    //       loaders: ['@svgr/webpack'],
    //       as: '*.js',
    //     },
    //   },
    // },
  },

  // === 开发配置 ===
  ...(IS_DEV && {
    // 开发环境特定配置
    devIndicators: {
      position: "bottom-right",
    },
  }),

  // === 生产配置 ===
  ...(!IS_DEV && {
    // 生产环境特定配置
    generateEtags: false, // 禁用 ETags

    // 压缩配置
    compress: true,
    productionBrowserSourceMaps: false, // 禁用生产环境的浏览器源映射
  }),
};

export default nextConfig;

# 第一阶段：构建 (Build Stage)
FROM node:18-alpine AS build-stage

# 1. 修改：规范工作目录为 /app，不要直接在根目录 / 操作
WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# 安装依赖
# 建议保留国内源配置，构建速度快很多
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install

# 复制源代码
COPY . .

# 【新增】设置自定义变量，必须以 NEXT_PUBLIC_ 开头
ENV NEXT_PUBLIC_APP_ENV=test

# 执行构建
RUN npm run build

# 第二阶段：生产环境 (Production Stage)
FROM nginx:stable-alpine AS production-stage

# 复制自定义的 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 2. 修改：对应第一阶段的修改，源路径要改为 /app/dist
# 如果你的项目是 Vite，通常是 /app/dist
# 如果你的项目是 Create React App (CRA)，通常是 /app/build (如果是 build 请修改下面路径)
COPY --from=build-stage /app/out /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
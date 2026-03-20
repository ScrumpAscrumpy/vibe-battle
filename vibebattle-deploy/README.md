# ⚡ VibeBattle - The Arena for Vibe Coders

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 http://localhost:5173

## 🚀 部署到 Vercel（推荐，最简单）

### 方法一：拖拽部署（零配置）
1. 打开 https://vercel.com/new
2. 点击页面底部的 **"Import Third-Party Git Repository"** 下方的链接，或直接把这个项目文件夹拖拽上传
3. Framework Preset 选择 **Vite**
4. 点击 **Deploy**
5. 等待 1-2 分钟，获得一个 `https://你的项目名.vercel.app` 链接

### 方法二：通过 GitHub 部署（推荐，支持自动更新）
1. 将此项目推送到 GitHub 仓库
2. 打开 https://vercel.com/new
3. 点击 **Import** 选择你的 GitHub 仓库
4. Framework Preset 选择 **Vite**
5. 点击 **Deploy**

### 方法三：使用 Vercel CLI
```bash
npm i -g vercel
vercel
```

## 🚀 部署到 Render

1. 将项目推送到 GitHub
2. 打开 https://dashboard.render.com/select-repo?type=static
3. 选择你的仓库
4. 设置：
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. 点击 **Create Static Site**

## 🚀 部署到 Netlify

1. 打开 https://app.netlify.com/drop
2. 先在本地运行 `npm install && npm run build`
3. 把生成的 `dist` 文件夹拖拽到 Netlify 页面
4. 即刻获得一个公开链接

## 📝 说明

- 本项目是纯前端静态应用（使用 Mock 数据）
- Neon 是 PostgreSQL 数据库服务，适合后端 API 使用，前端静态页面不需要
- 如果未来需要添加后端 API 和数据库，可以搭配 Neon + Vercel Serverless Functions

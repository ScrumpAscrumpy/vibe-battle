# ⚡ VibeBattle - The Arena for Vibe Coders

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 http://localhost:5173

---

## 🚀 方法一：Vercel CLI 部署（最简单，无需 GitHub）

打开终端，进入项目目录，运行以下命令：

```bash
# 1. 安装依赖
npm install

# 2. 安装 Vercel CLI（如果未安装过）
npm install -g vercel

# 3. 一键部署！
vercel
```

首次使用会要求登录 Vercel 账号，之后按提示操作：
- Set up and deploy? → **Y**
- Which scope? → 选择你的账号
- Link to existing project? → **N**
- Project name? → 直接回车（使用默认名）
- In which directory is your code located? → 直接回车（当前目录）
- 自动检测 Vite → 确认即可

等待约 1 分钟，终端会输出你的公开链接 🎉

如果之后修改了代码，再次运行 `vercel --prod` 即可更新。

---

## 🚀 方法二：通过 GitHub + Vercel Web 部署

```bash
# 1. 初始化 Git 并推送到 GitHub
git init
git add .
git commit -m "init: VibeBattle app"
git branch -M main
git remote add origin https://github.com/你的用户名/vibebattle.git
git push -u origin main
```

然后：
1. 打开 https://vercel.com/new
2. 点击 **Import** → 选择你刚推送的 `vibebattle` 仓库
3. Framework Preset 会自动检测为 **Vite**
4. 点击 **Deploy**
5. 等待约 1 分钟，获得公开链接

优点：之后每次 `git push` 都会自动触发重新部署。

---

## 🚀 方法三：Netlify 拖拽部署（真正的拖拽）

```bash
# 1. 安装依赖并构建
npm install
npm run build
```

构建完成后会生成一个 `dist` 文件夹，然后：
1. 打开 https://app.netlify.com/drop
2. 把 `dist` 文件夹直接拖拽到网页上
3. 几秒后即可获得公开链接

---

## 🚀 方法四：Render 静态站点

1. 先完成 GitHub 推送（见方法二的 git 步骤）
2. 打开 https://dashboard.render.com → New → Static Site
3. 连接你的 GitHub 仓库
4. 设置：
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. 点击 **Create Static Site**

---

## 🛠 一键部署脚本

也可以直接运行项目内的部署脚本：

```bash
bash DEPLOY.sh
```

## 📝 说明

- 本项目是纯前端静态应用（使用 Mock 数据），不需要后端或数据库
- Neon 是 PostgreSQL 数据库服务，当前项目不需要
- 如果未来需要添加后端 API 和数据库，可以搭配 Neon + Vercel Serverless Functions

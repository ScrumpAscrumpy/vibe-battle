#!/bin/bash
# ============================================
# VibeBattle 一键部署脚本
# ============================================
# 使用方法: 在项目根目录运行 bash DEPLOY.sh
# 前提: 已安装 Node.js (v18+) 和 npm
# ============================================

echo ""
echo "⚡ VibeBattle 部署助手"
echo "========================="
echo ""
echo "请选择部署方式:"
echo ""
echo "  1) Vercel CLI 部署 (最简单，无需 GitHub)"
echo "  2) 先构建，再手动部署到 Netlify Drop"
echo ""
read -p "请输入选项 (1 或 2): " choice

# 先安装依赖
echo ""
echo "📦 正在安装依赖..."
npm install

if [ "$choice" = "1" ]; then
    echo ""
    echo "🚀 使用 Vercel CLI 部署..."
    echo ""
    echo "如果尚未安装 Vercel CLI，正在安装..."
    npm install -g vercel
    echo ""
    echo "接下来会要求你登录 Vercel 账号（首次使用）"
    echo "然后按提示操作即可，大部分选项直接回车用默认值"
    echo ""
    vercel

elif [ "$choice" = "2" ]; then
    echo ""
    echo "🔨 正在构建项目..."
    npm run build
    echo ""
    echo "✅ 构建完成！dist/ 文件夹已生成"
    echo ""
    echo "👉 下一步:"
    echo "   1. 打开 https://app.netlify.com/drop"
    echo "   2. 把项目中的 dist 文件夹拖拽到网页上"
    echo "   3. 等待几秒，即可获得公开链接"
    echo ""

else
    echo "无效选项，请重新运行脚本"
fi

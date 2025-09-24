@echo off
echo ==============================
echo GameFlip GitHub Pages 部署脚本
echo ==============================

echo 1. 初始化Git仓库...
git init

echo 2. 添加远程仓库...
echo 请将下面的命令中的 YOUR_USERNAME 替换为您的GitHub用户名：
echo git remote add origin https://github.com/YOUR_USERNAME/gameflip-website.git

echo 3. 添加所有文件...
git add .

echo 4. 提交文件...
git commit -m "Initial commit: GameFlip 1.0 website"

echo 5. 推送到GitHub...
echo git push -u origin main

echo.
echo ==============================
echo 手动执行以下命令：
echo ==============================
echo git remote add origin https://github.com/YOUR_USERNAME/gameflip-website.git
echo git push -u origin main
echo.
echo 然后在GitHub仓库设置中启用Pages！

pause

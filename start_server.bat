@echo off
title GameFlip 本地开发服务器
color 0A

echo.
echo ===============================================
echo    🎮 GameFlip 本地开发服务器
echo ===============================================
echo.

REM 检查Python是否已安装
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到Python
    echo 💡 请先安装Python: https://python.org
    echo.
    pause
    exit /b 1
)

echo ✅ Python环境检测正常
echo 🚀 正在启动服务器...
echo.
echo 📱 服务启动后将自动打开浏览器
echo 🛑 按 Ctrl+C 可停止服务器
echo.

REM 启动Python HTTP服务器
python start_server.py

echo.
echo 👋 服务器已停止
pause

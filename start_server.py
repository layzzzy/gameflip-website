#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GameFlip 本地开发服务器
解决本地开发时的CORS问题

使用方法:
1. 运行: python start_server.py
2. 在浏览器中打开: http://localhost:8000
3. 按 Ctrl+C 停止服务器
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

# 设置端口
PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # 添加CORS头部，允许本地开发
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def main():
    # 确保在正确的目录中
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    print("🎮 GameFlip 本地开发服务器")
    print("=" * 50)
    print(f"📁 服务目录: {script_dir}")
    print(f"🌐 访问地址: http://localhost:{PORT}")
    print("⚠️  按 Ctrl+C 停止服务器")
    print("=" * 50)
    
    # 检查关键文件
    critical_files = [
        "index.html",
        "data/games_video.json",
        "js/gog-style.js",
        "css/gog-style.css"
    ]
    
    for file_path in critical_files:
        if not Path(file_path).exists():
            print(f"⚠️  警告: 文件不存在 - {file_path}")
    
    try:
        # 启动HTTP服务器
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            print(f"✅ 服务器已启动在端口 {PORT}")
            
            # 自动打开浏览器
            try:
                webbrowser.open(f'http://localhost:{PORT}')
                print("🌐 已自动打开浏览器")
            except:
                print("📱 请手动在浏览器中打开: http://localhost:{PORT}")
            
            print("\n⭐ 开发提示:")
            print("   - 修改文件后直接刷新浏览器即可")
            print("   - 查看浏览器控制台获取调试信息")
            print("   - JSON文件修改后会自动重新加载")
            print()
            
            # 启动服务器
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n👋 服务器已停止")
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ 端口 {PORT} 已被占用")
            print(f"💡 请尝试其他端口: python {__file__} --port 8001")
        else:
            print(f"❌ 启动服务器失败: {e}")

if __name__ == "__main__":
    # 检查命令行参数
    if len(sys.argv) > 1:
        if "--port" in sys.argv:
            try:
                port_index = sys.argv.index("--port") + 1
                PORT = int(sys.argv[port_index])
            except (IndexError, ValueError):
                print("❌ 无效的端口号")
                sys.exit(1)
    
    main()

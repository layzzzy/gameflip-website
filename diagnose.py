#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GameFlip 问题诊断工具
快速检查项目配置和常见问题

使用方法: python diagnose.py
"""

import json
import os
from pathlib import Path

def check_files():
    """检查关键文件是否存在"""
    print("📁 检查文件结构...")
    
    required_files = {
        "index.html": "主页面文件",
        "js/gog-style.js": "JavaScript主文件", 
        "css/gog-style.css": "CSS样式文件",
        "data/games_video.json": "视频数据文件"
    }
    
    missing_files = []
    
    for file_path, description in required_files.items():
        if Path(file_path).exists():
            print(f"  ✅ {file_path} - {description}")
        else:
            print(f"  ❌ {file_path} - {description}")
            missing_files.append(file_path)
    
    return missing_files

def check_json_format():
    """检查JSON文件格式"""
    print("\n📄 检查JSON文件格式...")
    
    json_path = Path("data/games_video.json")
    
    if not json_path.exists():
        print("  ❌ JSON文件不存在")
        return False
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"  ✅ JSON格式正确")
        print(f"  📊 包含 {len(data)} 条视频记录")
        
        # 检查数据结构
        required_fields = ['num', 'title', 'desc', 'link', 'cover', 'date']
        
        for i, video in enumerate(data):
            missing_fields = [field for field in required_fields if field not in video or not video[field]]
            
            if missing_fields:
                print(f"  ⚠️  第 {i+1} 条记录缺少字段: {missing_fields}")
            else:
                print(f"  ✅ 第 {i+1} 条记录: {video['title']}")
                
                # 检查封面图片
                cover_path = video['cover']
                if cover_path.startswith('http'):
                    print(f"    📱 使用在线封面: {cover_path[:50]}...")
                else:
                    if Path(cover_path).exists():
                        print(f"    🖼️  本地封面存在: {cover_path}")
                    else:
                        print(f"    ⚠️  本地封面不存在: {cover_path}")
        
        return True
        
    except json.JSONDecodeError as e:
        print(f"  ❌ JSON格式错误: {e}")
        return False
    except Exception as e:
        print(f"  ❌ 读取JSON文件失败: {e}")
        return False

def check_covers():
    """检查封面图片目录"""
    print("\n🖼️  检查封面图片...")
    
    covers_dir = Path("data/covers")
    
    if not covers_dir.exists():
        print("  ⚠️  covers目录不存在，将创建")
        covers_dir.mkdir(parents=True, exist_ok=True)
        return
    
    if not covers_dir.is_dir():
        print("  ❌ covers不是目录")
        return
    
    cover_files = list(covers_dir.glob("*"))
    print(f"  📁 找到 {len(cover_files)} 个文件")
    
    for cover_file in cover_files:
        file_size = cover_file.stat().st_size
        if file_size > 0:
            print(f"    ✅ {cover_file.name} ({file_size:,} bytes)")
        else:
            print(f"    ⚠️  {cover_file.name} (文件为空)")

def generate_recommendations():
    """生成解决建议"""
    print("\n💡 解决建议:")
    print("=" * 50)
    
    print("\n🔧 如果页面一直显示'正在加载':")
    print("  1. 使用本地服务器: python start_server.py")
    print("  2. 或者双击: start_server.bat")
    print("  3. 然后访问: http://localhost:8000")
    
    print("\n🔧 如果JSON文件有问题:")
    print("  1. 检查JSON格式是否正确")
    print("  2. 确保所有必需字段都存在")
    print("  3. 使用在线JSON验证器检查语法")
    
    print("\n🔧 如果图片无法显示:")
    print("  1. 检查图片文件路径是否正确")
    print("  2. 确保图片文件存在于data/covers/目录")
    print("  3. 或者使用完整的HTTP URL")
    
    print("\n🔧 调试方法:")
    print("  1. 打开浏览器开发者工具(F12)")
    print("  2. 查看Console标签页的错误信息")
    print("  3. 查看Network标签页的请求状态")

def main():
    print("🎮 GameFlip 问题诊断工具")
    print("=" * 50)
    
    # 检查当前目录
    if not Path("index.html").exists():
        print("❌ 错误: 请在GameFlip项目根目录运行此脚本")
        print("💡 当前目录应包含 index.html 文件")
        return
    
    # 执行各项检查
    missing_files = check_files()
    json_ok = check_json_format()
    check_covers()
    
    # 总结
    print("\n📊 诊断总结:")
    print("=" * 50)
    
    if not missing_files and json_ok:
        print("✅ 所有检查都通过了！")
        print("💡 如果仍有问题，请使用本地服务器运行")
    else:
        print("⚠️  发现以下问题需要修复:")
        if missing_files:
            print(f"  - 缺少文件: {', '.join(missing_files)}")
        if not json_ok:
            print("  - JSON文件格式有问题")
    
    generate_recommendations()

if __name__ == "__main__":
    main()

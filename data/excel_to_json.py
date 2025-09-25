#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Excel to JSON Converter for GameFlip Video Data
将Excel文件转换为JSON格式用于网站显示

使用方法:
1. 确保安装了 pandas 库: pip install pandas openpyxl
2. 运行: python excel_to_json.py
3. 生成的 games_video.json 文件将用于网站显示
"""

import pandas as pd
import json
from datetime import datetime
import os

def excel_to_json(excel_file='games_video.xlsx', json_file='games_video.json'):
    """
    将Excel文件转换为JSON格式
    
    Args:
        excel_file (str): Excel文件路径
        json_file (str): 输出的JSON文件路径
    """
    try:
        # 读取Excel文件
        print(f"正在读取 {excel_file}...")
        df = pd.read_excel(excel_file)
        
        # 确保列名正确
        expected_columns = ['num', 'title', 'desc', 'link', 'cover', 'date']
        missing_columns = [col for col in expected_columns if col not in df.columns]
        
        if missing_columns:
            print(f"警告: Excel文件缺少以下列: {missing_columns}")
            return False
        
        # 转换数据类型并清理数据
        video_data = []
        
        for index, row in df.iterrows():
            # 跳过空行
            if pd.isna(row['num']) or pd.isna(row['title']):
                continue
                
            video_item = {
                'num': int(row['num']) if not pd.isna(row['num']) else index + 1,
                'title': str(row['title']).strip() if not pd.isna(row['title']) else '',
                'desc': str(row['desc']).strip() if not pd.isna(row['desc']) else '',
                'link': str(row['link']).strip() if not pd.isna(row['link']) else '',
                'cover': f"data/covers/{str(row['cover']).strip()}.jpg" if not pd.isna(row['cover']) else f'https://via.placeholder.com/400x250/8B5CF6/ffffff?text=Video+{index+1}',
                'date': str(row['date']).strip() if not pd.isna(row['date']) else datetime.now().strftime('%Y%m%d')
            }
            
            video_data.append(video_item)
        
        # 按日期降序排序（最新的在前面）
        video_data.sort(key=lambda x: x['date'], reverse=True)
        
        # 输出JSON文件
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(video_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ 成功转换 {len(video_data)} 条记录")
        print(f"📄 JSON文件已保存到: {json_file}")
        
        # 显示前几条数据预览
        print("\n📊 数据预览:")
        for i, item in enumerate(video_data[:3]):
            print(f"  {i+1}. {item['title']}")
            print(f"     链接: {item['link'][:50]}...")
            print(f"     封面: {item['cover'][:50]}...")
            print()
        
        return True
        
    except FileNotFoundError:
        print(f"❌ 错误: 找不到文件 {excel_file}")
        print("请确保Excel文件在当前目录中")
        return False
        
    except Exception as e:
        print(f"❌ 转换过程中发生错误: {str(e)}")
        return False

def validate_json(json_file='games_video.json'):
    """
    验证生成的JSON文件格式是否正确
    """
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"✅ JSON文件格式验证通过")
        print(f"📊 共包含 {len(data)} 条视频记录")
        
        # 检查必要字段
        required_fields = ['num', 'title', 'desc', 'link', 'cover', 'date']
        for i, item in enumerate(data):
            missing_fields = [field for field in required_fields if field not in item]
            if missing_fields:
                print(f"⚠️  第 {i+1} 条记录缺少字段: {missing_fields}")
        
        return True
        
    except Exception as e:
        print(f"❌ JSON验证失败: {str(e)}")
        return False

if __name__ == "__main__":
    print("🎮 GameFlip Excel to JSON 转换器")
    print("=" * 50)
    
    # 检查Excel文件是否存在
    excel_file = "games_video.xlsx"
    if not os.path.exists(excel_file):
        print(f"❌ Excel文件不存在: {excel_file}")
        print("请确保以下文件在当前目录:")
        print(f"  - {excel_file}")
        exit(1)
    
    # 执行转换
    success = excel_to_json()
    
    if success:
        # 验证输出文件
        validate_json()
        
        print("\n🚀 转换完成！现在可以:")
        print("  1. 刷新网站页面查看新内容")
        print("  2. 检查 games_video.json 文件确认数据正确")
        print("  3. 如需修改，编辑Excel后重新运行此脚本")
    else:
        print("\n❌ 转换失败，请检查错误信息并重试")

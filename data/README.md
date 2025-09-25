# GameFlip 视频数据管理系统

## 📋 概述

这个系统允许您通过Excel文件管理游戏解构师页面的视频内容，无需手动修改HTML代码。

## 📁 文件结构

```
data/
├── games_video.xlsx      # Excel数据源文件
├── games_video.json      # 网站使用的JSON数据文件
├── excel_to_json.py      # Excel转JSON转换脚本
├── covers/               # 视频封面图片文件夹
│   ├── 1.jpg            # 视频封面图片
│   └── ...
└── README.md            # 本说明文档
```

## 🔧 使用方法

### 方法1: 使用Python脚本（推荐）

1. **安装依赖**
   ```bash
   pip install pandas openpyxl
   ```

2. **编辑Excel文件**
   - 打开 `games_video.xlsx`
   - 按照现有格式添加/修改视频数据
   - 保存文件

3. **运行转换脚本**
   ```bash
   cd data
   python excel_to_json.py
   ```

4. **刷新网站页面**
   - 网站会自动读取新的JSON数据并显示

### 方法2: 手动编辑JSON文件

如果您熟悉JSON格式，也可以直接编辑 `games_video.json` 文件。

## 📊 Excel文件格式

| 列名 | 说明 | 示例 |
|------|------|------|
| num | 序号 | 1 |
| title | 视频标题 | "What's The Point Of Hard Games, Anyway?" |
| desc | 视频描述 | "Hey all! I'm hard at work..." |
| link | 视频链接 | "https://youtu.be/..." 或 "https://www.bilibili.com/..." |
| cover | 封面图片 | "data/covers/1.jpg" 或完整URL |
| date | 发布日期 | "20250925" (YYYYMMDD格式) |

## 🖼️ 封面图片管理

1. 将封面图片放在 `covers/` 文件夹中
2. 建议命名格式: `序号.jpg` (如 `1.jpg`, `2.jpg`)
3. 推荐尺寸: 400×250像素
4. 支持格式: JPG, PNG, WebP

## 🔗 视频链接支持

- **YouTube**: `https://youtu.be/视频ID` 或 `https://www.youtube.com/watch?v=视频ID`
- **哔哩哔哩**: `https://www.bilibili.com/video/BV视频号`
- **其他平台**: 任何有效的视频URL

## 🚀 实时更新

- 修改Excel文件后运行转换脚本
- 网站会自动加载新数据，无需重启服务器
- 如果图片不存在，会显示默认占位图

## 🎨 自定义样式

如需调整卡片样式，请编辑 `../css/gog-style.css` 中的 `.digest-card` 相关样式。

## 🔍 故障排除

### 问题1: 页面显示"正在加载"但没有内容
- 检查 `games_video.json` 文件是否存在
- 确认JSON格式是否正确
- 查看浏览器控制台是否有错误

### 问题2: 图片无法显示
- 检查图片文件路径是否正确
- 确认图片文件是否存在于 `covers/` 文件夹
- 图片名称是否与Excel中的cover字段匹配

### 问题3: Python脚本运行错误
- 确认已安装pandas和openpyxl库
- 检查Excel文件格式是否正确
- 确认文件没有被其他程序占用

## 📝 注意事项

1. **编码问题**: Excel文件建议使用UTF-8编码保存
2. **数据备份**: 修改前请备份原始数据
3. **链接有效性**: 确保视频链接可以正常访问
4. **图片大小**: 建议优化图片大小以提升加载速度

## 🆘 技术支持

如遇到问题，请检查：
1. 浏览器开发者工具的控制台输出
2. JSON文件格式是否正确
3. 文件路径是否匹配

---

*最后更新: 2025年9月25日*

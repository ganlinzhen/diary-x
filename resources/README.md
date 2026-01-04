# Diary-X 应用图标资源

本目录包含 Diary-X 应用在不同平台上使用的图标文件。

## 目录结构

```
resources/
├── README.md          # 本文件
├── icon.png          # 源图标文件（推荐 1024x1024 PNG）
├── icon.ico          # Windows 图标
├── icon.icns         # macOS 图标
└── icons/            # 各尺寸图标（可选）
    ├── 16x16.png
    ├── 32x32.png
    ├── 64x64.png
    ├── 128x128.png
    ├── 256x256.png
    └── 512x512.png
```

## 图标规格要求

### 源图标 (icon.png)
- **尺寸**: 1024x1024 像素
- **格式**: PNG
- **背景**: 透明背景
- **用途**: 用于生成其他平台的图标文件

### Windows 图标 (icon.ico)
- **尺寸**: 包含多个尺寸（16x16, 32x32, 48x48, 64x64, 128x128, 256x256）
- **格式**: ICO
- **要求**: 
  - 必须包含至少 256x256 尺寸
  - 支持透明通道
  - 文件大小建议 < 1MB

### macOS 图标 (icon.icns)
- **尺寸**: 包含多个尺寸（16x16 到 1024x1024）
- **格式**: ICNS
- **要求**:
  - 必须包含以下尺寸：16, 32, 64, 128, 256, 512, 1024
  - 支持 Retina 显示（2x 尺寸）
  - 支持透明通道

## 如何准备图标

### 方法 1: 使用在线工具（推荐新手）

1. **准备源图标**
   - 创建或设计一个 1024x1024 的 PNG 图标
   - 确保图标在小尺寸下依然清晰可辨
   - 保存为 `icon.png`

2. **转换为 ICO（Windows）**
   - 访问 https://icoconvert.com/
   - 上传 `icon.png`
   - 选择输出尺寸：16, 32, 48, 64, 128, 256
   - 下载生成的 `icon.ico`

3. **转换为 ICNS（macOS）**
   - 访问 https://cloudconvert.com/png-to-icns
   - 上传 `icon.png`
   - 下载生成的 `icon.icns`

### 方法 2: 使用命令行工具

#### 生成 ICO（Windows 或 Linux）
```bash
# 使用 ImageMagick
convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
```

#### 生成 ICNS（macOS）
```bash
# 1. 创建 iconset 目录
mkdir icon.iconset

# 2. 生成各种尺寸
sips -z 16 16     icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32     icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64     icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256   icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512   icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   icon.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png

# 3. 转换为 icns
iconutil -c icns icon.iconset -o icon.icns

# 4. 清理
rm -rf icon.iconset
```

### 方法 3: 使用 electron-icon-builder（推荐开发者）

```bash
# 安装
npm install -g electron-icon-builder

# 使用（在项目根目录）
electron-icon-builder --input=./resources/icon.png --output=./resources --flatten
```

## 设计建议

### 图标设计原则
1. **简洁明了**: 图标在小尺寸下仍能识别
2. **代表性强**: 能体现应用的核心功能（日记本、笔记等）
3. **色彩鲜明**: 使用对比度高的颜色，易于辨识
4. **透明背景**: PNG 格式，背景透明
5. **统一风格**: 与应用 UI 风格保持一致

### Diary-X 图标建议元素
- 📖 书本/日记本图形
- ✍️ 钢笔/铅笔元素
- 📝 纸张/文档图形
- 🏷️ 标签元素（体现标签功能）
- 配色：可以使用蓝色、绿色等专业色调

## 临时解决方案

如果您暂时没有准备好图标，可以：

1. **使用占位图标**
   - electron-builder 会使用默认的 Electron 图标
   - 应用能正常打包，但图标是默认的

2. **使用简单的纯色图标**
   - 创建一个简单的纯色背景 + 文字的图标
   - 后续可以替换为正式设计的图标

## 验证图标

### Windows
- 在资源管理器中查看 `.exe` 文件图标
- 在任务栏中查看应用图标
- 检查安装程序的图标

### macOS
- 在 Finder 中查看 `.app` 文件图标
- 在 Dock 中查看应用图标
- 检查 DMG 文件的图标

## 常见问题

**Q: 为什么图标显示不正确？**
A: 检查图标文件路径是否正确，确保文件格式符合要求，清除系统图标缓存。

**Q: 图标在小尺寸下模糊？**
A: 为每个尺寸单独优化图标，而不是简单缩放大图标。

**Q: macOS 上图标不显示？**
A: 确保 ICNS 文件包含所有必需的尺寸，重新构建应用。

## 相关资源

- [Electron 图标指南](https://www.electron.build/icons)
- [macOS 图标设计指南](https://developer.apple.com/design/human-interface-guidelines/macos/icons-and-images/app-icon/)
- [Windows 图标设计指南](https://docs.microsoft.com/en-us/windows/apps/design/style/iconography/)
- [在线图标生成工具](https://icon.kitchen/)
# Diary-X 应用打包指南

本文档详细介绍如何将 Diary-X 打包为 Windows 和 macOS 平台的可执行应用程序。

## 📋 目录

- [前置要求](#前置要求)
- [快速开始](#快速开始)
- [详细步骤](#详细步骤)
- [平台特定说明](#平台特定说明)
- [常见问题](#常见问题)
- [高级配置](#高级配置)

## 前置要求

### 系统要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **操作系统**:
  - Windows 10/11（用于打包 Windows 应用）
  - macOS 10.15+（用于打包 macOS 应用）
  - Linux（可选，用于打包 Linux 应用）

### 依赖安装

确保已安装所有项目依赖：

```bash
npm install
```

### 准备图标文件

在开始打包前，您需要准备应用图标：

1. **查看图标准备指南**: [`resources/README.md`](../resources/README.md)
2. **所需文件**:
   - Windows: `resources/icon.ico`
   - macOS: `resources/icon.icns`
   - Linux: `resources/icons/` 目录下的多个 PNG 文件

**临时方案**: 如果暂时没有图标，可以先不放置图标文件，electron-builder 会使用默认图标。

## 快速开始

### 打包所有平台（在当前平台上可打包的）

```bash
npm run dist
```

### 打包特定平台

```bash
# 仅打包 Windows (x64 和 arm64)
npm run build:win

# 仅打包 macOS (x64 和 Apple Silicon)
npm run build:mac

# 仅打包 Linux
npm run build:linux

# 打包所有平台（需要在对应平台上执行）
npm run build:all
```

## 详细步骤

### 步骤 1: 准备工作

1. **清理之前的构建**:
```bash
# 删除之前的构建产物
rm -rf dist out
```

2. **更新版本号**（可选）:
编辑 [`package.json`](../package.json)，更新 `version` 字段：
```json
{
  "version": "1.0.0"
}
```

3. **检查配置**:
确认 [`package.json`](../package.json) 中的 `build` 配置正确：
- `appId`: 应用唯一标识符
- `productName`: 应用显示名称
- `author`: 作者信息
- `homepage`: 项目主页

### 步骤 2: 构建应用代码

```bash
npm run build
```

这将：
- 编译 TypeScript 代码
- 打包渲染进程代码
- 生成所有必要的输出文件到 `out/` 目录

### 步骤 3: 打包应用

#### Windows 平台

```bash
npm run build:win
```

**输出文件** (位于 `dist/` 目录):
- `Diary-X-1.0.0-x64-setup.exe` - 64位安装程序
- `Diary-X-1.0.0-arm64-setup.exe` - ARM64安装程序

**文件大小**: 约 80-150 MB（取决于依赖）

#### macOS 平台

```bash
npm run build:mac
```

**输出文件** (位于 `dist/` 目录):
- `Diary-X-1.0.0-x64.dmg` - Intel Mac 安装镜像
- `Diary-X-1.0.0-arm64.dmg` - Apple Silicon 安装镜像
- `Diary-X-1.0.0-x64.zip` - Intel Mac ZIP包
- `Diary-X-1.0.0-arm64.zip` - Apple Silicon ZIP包

**文件大小**: 约 100-180 MB

#### Linux 平台

```bash
npm run build:linux
```

**输出文件** (位于 `dist/` 目录):
- `Diary-X-1.0.0-x64.AppImage` - AppImage 格式
- `Diary-X-1.0.0-amd64.deb` - Debian/Ubuntu 包
- `Diary-X-1.0.0-x86_64.rpm` - RedHat/Fedora 包

### 步骤 4: 测试打包结果

#### Windows
1. 运行安装程序
2. 安装到测试目录
3. 启动应用验证功能

#### macOS
1. 打开 DMG 文件
2. 将应用拖到 Applications
3. 右键点击 → "打开"（首次运行）

#### Linux
```bash
# AppImage
chmod +x Diary-X-1.0.0-x64.AppImage
./Diary-X-1.0.0-x64.AppImage

# Debian/Ubuntu
sudo dpkg -i Diary-X-1.0.0-amd64.deb

# RedHat/Fedora
sudo rpm -i Diary-X-1.0.0-x86_64.rpm
```

## 平台特定说明

### Windows 打包

#### 在 Windows 上打包

1. **系统要求**:
   - Windows 10/11
   - PowerShell 或 Command Prompt

2. **执行打包**:
```cmd
npm run build:win
```

3. **NSIS 安装程序特性**:
   - 支持自定义安装目录
   - 创建桌面快捷方式
   - 创建开始菜单快捷方式
   - 支持静默安装: `/S` 参数

#### 在非 Windows 平台上打包 Windows 应用

可以在 macOS 或 Linux 上打包 Windows 应用：

```bash
# 需要安装 wine (macOS)
brew install wine

# 然后执行打包
npm run build:win
```

**注意**: 跨平台打包可能遇到问题，建议在目标平台上打包。

### macOS 打包

#### 在 macOS 上打包

1. **系统要求**:
   - macOS 10.15+
   - Xcode Command Line Tools

2. **执行打包**:
```bash
npm run build:mac
```

3. **架构支持**:
   - x64: Intel Mac
   - arm64: Apple Silicon (M1/M2/M3)

#### 代码签名（可选但推荐）

如果您有 Apple Developer 账号，可以配置代码签名：

1. **获取证书**:
   - Developer ID Application 证书

2. **配置环境变量**:
```bash
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your-password
export APPLE_ID=your-apple-id@example.com
export APPLE_ID_PASSWORD=app-specific-password
```

3. **更新 package.json**:
```json
{
  "build": {
    "mac": {
      "identity": "Developer ID Application: Your Name (TEAM_ID)",
      "hardenedRuntime": true,
      "notarize": {
        "teamId": "TEAM_ID"
      }
    }
  }
}
```

#### 在非 macOS 平台上打包

**不支持**: 无法在 Windows 或 Linux 上打包 macOS 应用。

### Linux 打包

可以在任何平台上打包 Linux 应用：

```bash
npm run build:linux
```

**输出格式**:
- AppImage: 通用格式，无需安装
- deb: Debian/Ubuntu 系列
- rpm: RedHat/Fedora 系列

## 常见问题

### 1. better-sqlite3 编译问题

**问题**: 打包时 better-sqlite3 原生模块出错

**解决方案**:
```bash
# 重新构建原生模块
npm run postinstall

# 或者手动重建
./node_modules/.bin/electron-rebuild
```

**配置检查**: 确保 [`package.json`](../package.json) 中包含：
```json
{
  "build": {
    "asarUnpack": [
      "node_modules/better-sqlite3/**/*"
    ]
  }
}
```

### 2. 图标不显示

**问题**: 打包后应用图标显示为默认图标

**解决方案**:
1. 检查图标文件路径是否正确
2. 确认图标文件格式符合要求
3. 清除图标缓存（Windows）:
```cmd
ie4uinit.exe -show
```
4. 重新构建应用

### 3. 文件体积过大

**问题**: 打包后文件超过 200MB

**解决方案**:
1. 检查是否包含了不必要的文件
2. 优化 `build.files` 配置：
```json
{
  "build": {
    "files": [
      "out/**/*",
      "!out/**/*.map"
    ]
  }
}
```
3. 使用 `asar` 压缩（默认启用）

### 4. macOS 无法打开应用

**问题**: "应用已损坏，无法打开"

**解决方案**:
```bash
# 移除隔离属性
xattr -cr /Applications/Diary-X.app
```

或者配置代码签名和公证。

### 5. Windows Defender 误报

**问题**: 安装程序被 Windows Defender 标记为病毒

**解决方案**:
1. 为应用程序签名（需要 Code Signing 证书）
2. 提交误报给 Microsoft
3. 告知用户这是误报

### 6. 跨平台打包限制

**限制说明**:
- ✅ 在任何平台都可以打包 Linux 应用
- ✅ 在 macOS/Linux 上可以打包 Windows 应用（需要 wine）
- ❌ 只能在 macOS 上打包 macOS 应用

## 高级配置

### 自定义安装程序

#### Windows NSIS 自定义

编辑 [`package.json`](../package.json):
```json
{
  "build": {
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "installerIcon": "resources/installer.ico",
      "uninstallerIcon": "resources/uninstaller.ico",
      "installerHeader": "resources/installerHeader.bmp",
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "Diary-X",
      "license": "LICENSE"
    }
  }
}
```

#### macOS DMG 自定义

```json
{
  "build": {
    "dmg": {
      "background": "resources/dmg-background.png",
      "contents": [
        {
          "x": 130,
          "y": 220
        },
        {
          "x": 410,
          "y": 220,
          "type": "link",
          "path": "/Applications"
        }
      ],
      "window": {
        "width": 540,
        "height": 380
      }
    }
  }
}
```

### 自动更新配置

使用 electron-updater 实现自动更新：

1. **安装依赖**:
```bash
npm install electron-updater
```

2. **配置发布服务器**:
```json
{
  "build": {
    "publish": [
      {
        "provider": "github",
        "owner": "your-username",
        "repo": "diary-x"
      }
    ]
  }
}
```

3. **主进程代码**:
```typescript
import { autoUpdater } from 'electron-updater'

autoUpdater.checkForUpdatesAndNotify()
```

### 多语言安装程序

```json
{
  "build": {
    "nsis": {
      "language": "2052",
      "installerLanguages": ["en_US", "zh_CN"]
    }
  }
}
```

### 代码签名证书

#### Windows

1. 获取 Code Signing 证书
2. 配置环境变量:
```cmd
set CSC_LINK=C:\path\to\certificate.pfx
set CSC_KEY_PASSWORD=your-password
```

#### macOS

1. 获取 Developer ID 证书
2. 配置环境变量:
```bash
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your-password
```

## 发布流程

### 1. 版本发布检查清单

- [ ] 更新版本号
- [ ] 更新 CHANGELOG
- [ ] 测试所有功能
- [ ] 准备发布说明
- [ ] 创建 Git 标签

### 2. 执行发布

```bash
# 1. 更新版本
npm version patch  # 或 minor, major

# 2. 打包所有平台
npm run build:all

# 3. 创建 Git 标签
git tag v1.0.0
git push origin v1.0.0

# 4. 上传到 GitHub Releases
# 手动上传 dist/ 目录中的文件
```

### 3. 发布到分发平台

- **GitHub Releases**: 手动上传或使用 CI/CD
- **Microsoft Store**: 需要开发者账号
- **Mac App Store**: 需要 Apple Developer 账号

## 持续集成 (CI/CD)

### GitHub Actions 示例

创建 `.github/workflows/build.yml`:

```yaml
name: Build

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest, windows-latest]

    runs-on: ${{ matrix.os }}

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Package
        run: npm run dist
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}
          path: dist/*
```

## 性能优化

### 减小打包体积

1. **排除不必要的文件**:
```json
{
  "build": {
    "files": [
      "out/**/*",
      "resources/**/*",
      "!**/*.map",
      "!**/*.ts"
    ]
  }
}
```

2. **优化依赖**:
```bash
# 检查依赖大小
npx npm-bundle-size

# 移除未使用的依赖
npm prune --production
```

### 加快构建速度

1. **使用构建缓存**
2. **并行构建**: electron-builder 默认启用
3. **增量构建**: 仅在文件变更时重新构建

## 故障排查

### 查看详细日志

```bash
# 启用调试模式
DEBUG=electron-builder npm run build:win
```

### 验证打包配置

```bash
# 显示配置但不执行打包
npx electron-builder --config.mac.target=dmg --dir
```

### 清理缓存

```bash
# 清理 electron-builder 缓存
rm -rf ~/Library/Caches/electron-builder
rm -rf ~/.cache/electron-builder

# 清理项目构建产物
rm -rf dist out node_modules
npm install
```

## 参考资源

- [Electron Builder 文档](https://www.electron.build/)
- [Electron 文档](https://www.electronjs.org/docs)
- [代码签名指南](https://www.electron.build/code-signing)
- [自动更新指南](https://www.electron.build/auto-update)

## 支持与反馈

如遇到问题：
1. 查看本文档的常见问题部分
2. 搜索 GitHub Issues
3. 提交新的 Issue

---

**最后更新**: 2026-01-04
**适用版本**: Diary-X v1.0.0
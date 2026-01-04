# 打包配置说明文档

本文档详细说明了 Diary-X 项目中所有与打包相关的配置。

## 📁 配置文件位置

| 文件 | 用途 | 说明 |
|------|------|------|
| [`package.json`](../package.json) | 主配置文件 | 包含打包脚本、应用信息和 electron-builder 配置 |
| [`build/entitlements.mac.plist`](../build/entitlements.mac.plist) | macOS 权限 | macOS 应用的权限配置 |
| [`resources/`](../resources/) | 资源文件夹 | 存放应用图标和其他资源 |
| [`.gitignore`](../.gitignore) | Git 忽略 | 配置忽略构建产物 |

## 🔧 package.json 配置详解

### 应用基本信息

```json
{
  "name": "diary-x",
  "version": "1.0.0",
  "description": "A markdown diary app with topic tagging",
  "author": "Diary-X Team",
  "homepage": "https://github.com/yourusername/diary-x",
  "license": "MIT"
}
```

**配置说明**：
- `name`: 应用的包名，用于内部标识
- `version`: 版本号，影响打包文件名
- `productName`: 显示给用户的应用名称（在 build 配置中）
- `author`: 开发者/团队名称
- `homepage`: 项目主页，用于帮助菜单等
- `license`: 许可证类型

### 打包脚本

```json
{
  "scripts": {
    "build:win": "npm run build && electron-builder --win --x64",
    "build:mac": "npm run build && electron-builder --mac --x64 --arm64",
    "build:linux": "npm run build && electron-builder --linux",
    "build:all": "npm run build && electron-builder --win --mac --linux",
    "dist": "npm run build && electron-builder"
  }
}
```

**脚本说明**：
- `build:win`: 打包 Windows 应用（x64 架构）
- `build:mac`: 打包 macOS 应用（Intel 和 Apple Silicon）
- `build:linux`: 打包 Linux 应用
- `build:all`: 打包所有平台（需在各平台上执行）
- `dist`: 快速打包当前平台

### electron-builder 配置

#### 基础配置

```json
{
  "build": {
    "appId": "com.diaryx.app",
    "productName": "Diary-X",
    "directories": {
      "output": "dist",
      "buildResources": "resources"
    }
  }
}
```

**字段说明**：
- `appId`: 应用的唯一标识符（反向域名格式）
- `productName`: 应用显示名称
- `directories.output`: 打包输出目录
- `directories.buildResources`: 资源文件目录

#### 文件包含配置

```json
{
  "build": {
    "files": [
      "out/**/*",
      "resources/**/*"
    ],
    "asarUnpack": [
      "node_modules/better-sqlite3/**/*"
    ]
  }
}
```

**说明**：
- `files`: 要打包的文件（支持 glob 模式）
- `asarUnpack`: 不打包到 asar 的文件（better-sqlite3 需要原生访问）

#### Windows 配置

```json
{
  "build": {
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64", "arm64"]
        }
      ],
      "icon": "resources/icon.ico",
      "artifactName": "${productName}-${version}-${arch}-setup.${ext}"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "Diary-X"
    }
  }
}
```

**字段说明**：
- `win.target`: 目标格式（NSIS 安装程序）
- `win.arch`: 支持的架构（x64, arm64）
- `win.icon`: Windows 图标文件路径
- `win.artifactName`: 输出文件名格式
- `nsis.oneClick`: 是否一键安装（false = 允许自定义）
- `nsis.allowToChangeInstallationDirectory`: 允许用户选择安装位置
- `nsis.createDesktopShortcut`: 创建桌面快捷方式
- `nsis.createStartMenuShortcut`: 创建开始菜单项

#### macOS 配置

```json
{
  "build": {
    "mac": {
      "target": [
        {
          "target": "dmg",
          "arch": ["x64", "arm64"]
        },
        {
          "target": "zip",
          "arch": ["x64", "arm64"]
        }
      ],
      "icon": "resources/icon.icns",
      "category": "public.app-category.productivity",
      "artifactName": "${productName}-${version}-${arch}.${ext}",
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "build/entitlements.mac.plist",
      "entitlementsInherit": "build/entitlements.mac.plist"
    },
    "dmg": {
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
      "title": "${productName} ${version}",
      "window": {
        "width": 540,
        "height": 380
      }
    }
  }
}
```

**字段说明**：
- `mac.target`: 目标格式（DMG 和 ZIP）
- `mac.arch`: 支持的架构（x64 = Intel, arm64 = Apple Silicon）
- `mac.icon`: macOS 图标文件路径
- `mac.category`: App Store 分类
- `mac.hardenedRuntime`: 启用加固运行时（安全特性）
- `mac.gatekeeperAssess`: Gatekeeper 评估
- `mac.entitlements`: 权限配置文件
- `dmg.contents`: DMG 窗口内容布局
- `dmg.window`: DMG 窗口尺寸

#### Linux 配置

```json
{
  "build": {
    "linux": {
      "target": ["AppImage", "deb", "rpm"],
      "icon": "resources/icons",
      "category": "Office",
      "artifactName": "${productName}-${version}-${arch}.${ext}"
    }
  }
}
```

**字段说明**：
- `linux.target`: 目标格式（AppImage, deb, rpm）
- `linux.icon`: 图标目录（包含多个尺寸的 PNG）
- `linux.category`: 应用分类
- `linux.artifactName`: 输出文件名格式

## 🍎 macOS Entitlements 配置

文件：[`build/entitlements.mac.plist`](../build/entitlements.mac.plist)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>com.apple.security.cs.allow-jit</key>
	<true/>
	<key>com.apple.security.cs.allow-unsigned-executable-memory</key>
	<true/>
	<key>com.apple.security.cs.allow-dyld-environment-variables</key>
	<true/>
	<key>com.apple.security.cs.disable-library-validation</key>
	<true/>
</dict>
</plist>
```

**权限说明**：
- `allow-jit`: 允许 JIT 编译（V8 引擎需要）
- `allow-unsigned-executable-memory`: 允许未签名的可执行内存
- `allow-dyld-environment-variables`: 允许动态链接器环境变量
- `disable-library-validation`: 禁用库验证（better-sqlite3 需要）

这些权限对于 Electron 应用正常运行是必需的。

## 🎨 图标文件要求

### 文件位置和命名

```
resources/
├── icon.png          # 源图标（1024x1024）
├── icon.ico          # Windows 图标
├── icon.icns         # macOS 图标
└── icons/            # Linux 图标（多尺寸）
    ├── 16x16.png
    ├── 32x32.png
    ├── 64x64.png
    ├── 128x128.png
    ├── 256x256.png
    └── 512x512.png
```

### 图标规格

| 平台 | 格式 | 尺寸要求 | 文件大小建议 |
|------|------|----------|--------------|
| Windows | ICO | 16-256px (多尺寸) | < 1MB |
| macOS | ICNS | 16-1024px (多尺寸) | < 2MB |
| Linux | PNG | 16-512px (各尺寸单独文件) | 每个 < 100KB |

详细的图标准备指南：[`resources/README.md`](../resources/README.md)

## 🚫 .gitignore 配置

```gitignore
# Build artifacts
dist/
build/
!build/entitlements.mac.plist

# Electron-specific
dist-electron/
out/
release/
```

**说明**：
- `dist/`: 打包输出目录（不提交）
- `build/`: 构建目录（除了 entitlements.mac.plist）
- `out/`: 编译输出（不提交）
- `!build/entitlements.mac.plist`: 保留 macOS 权限配置

## 🔑 环境变量配置

### 代码签名（可选）

#### Windows

```bash
# 设置证书路径和密码
set CSC_LINK=C:\path\to\certificate.pfx
set CSC_KEY_PASSWORD=your-password
```

#### macOS

```bash
# 设置证书
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your-password

# Apple ID（用于公证）
export APPLE_ID=your-apple-id@example.com
export APPLE_ID_PASSWORD=app-specific-password
```

### 调试模式

```bash
# 启用详细日志
DEBUG=electron-builder

# 查看配置但不执行
electron-builder --help
```

## 📊 构建产物说明

### 文件大小预估

| 平台 | 安装包大小 | 安装后大小 |
|------|-----------|-----------|
| Windows (x64) | 80-150 MB | 200-300 MB |
| Windows (arm64) | 80-150 MB | 200-300 MB |
| macOS (x64) | 100-180 MB | 250-350 MB |
| macOS (arm64) | 100-180 MB | 250-350 MB |
| Linux (AppImage) | 90-160 MB | 直接运行 |

### 文件命名规则

根据 `artifactName` 配置：

```
${productName}-${version}-${arch}-setup.${ext}
```

示例：
- `Diary-X-1.0.0-x64-setup.exe`
- `Diary-X-1.0.0-arm64.dmg`
- `Diary-X-1.0.0-x64.AppImage`

## 🛠️ 修改配置的步骤

### 1. 修改应用名称

编辑 [`package.json`](../package.json)：
```json
{
  "name": "my-diary",
  "build": {
    "productName": "我的日记"
  }
}
```

### 2. 修改应用 ID

编辑 [`package.json`](../package.json)：
```json
{
  "build": {
    "appId": "com.yourcompany.yourdiary"
  }
}
```

### 3. 修改输出目录

编辑 [`package.json`](../package.json)：
```json
{
  "build": {
    "directories": {
      "output": "release"
    }
  }
}
```

### 4. 添加文件关联

编辑 [`package.json`](../package.json)：
```json
{
  "build": {
    "fileAssociations": [
      {
        "ext": "diary",
        "name": "Diary File",
        "role": "Editor"
      }
    ]
  }
}
```

### 5. 修改安装程序行为

编辑 [`package.json`](../package.json)：
```json
{
  "build": {
    "nsis": {
      "oneClick": true,
      "perMachine": false,
      "allowElevation": true,
      "runAfterFinish": true
    }
  }
}
```

## 📝 配置验证

### 检查配置语法

```bash
# 验证 package.json
npm run build -- --help

# 显示实际配置
npx electron-builder build --help
```

### 测试打包（不生成文件）

```bash
# 仅验证配置，不实际打包
npx electron-builder --dir
```

## 🔄 版本更新流程

1. **更新版本号**：
```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

2. **更新 CHANGELOG**：
编辑 `CHANGELOG.md`，记录变更

3. **执行打包**：
```bash
npm run build:all
```

4. **创建 Git 标签**：
```bash
git tag v1.0.1
git push origin v1.0.1
```

## 📚 参考文档

- [Electron Builder 官方文档](https://www.electron.build/)
- [NSIS 配置参考](https://www.electron.build/configuration/nsis)
- [macOS 配置参考](https://www.electron.build/configuration/mac)
- [代码签名指南](https://www.electron.build/code-signing)

## 🆘 故障排查

### 配置文件语法错误

**症状**：打包失败，提示配置错误

**解决**：
1. 使用 JSON 验证器检查 `package.json`
2. 确保没有多余的逗号
3. 确保引号匹配

### 图标路径错误

**症状**：打包成功但显示默认图标

**解决**：
1. 检查图标文件是否存在
2. 确认路径相对于项目根目录
3. 检查文件名大小写

### 原生模块问题

**症状**：better-sqlite3 无法加载

**解决**：
1. 确保 `asarUnpack` 配置正确
2. 重新构建原生模块：`npm rebuild`
3. 使用 electron-rebuild：`./node_modules/.bin/electron-rebuild`

---

**最后更新**：2026-01-04
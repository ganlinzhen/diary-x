# 快速开始打包指南

这是一个快速指南，帮助您在 10 分钟内完成 Diary-X 的第一次打包。

## 📋 前置检查

- ✅ 已安装 Node.js >= 18.0.0
- ✅ 已安装 npm >= 9.0.0
- ✅ 已克隆项目并安装依赖

如果还没有安装依赖：
```bash
npm install
```

## 🚀 三步完成打包

### 步骤 1: 构建应用代码

```bash
npm run build
```

**预期输出**：在 `out/` 目录生成编译后的代码

**所需时间**：约 30-60 秒

### 步骤 2: 执行打包（选择你的平台）

#### Windows 用户

```bash
npm run build:win
```

#### macOS 用户

```bash
npm run build:mac
```

#### Linux 用户

```bash
npm run build:linux
```

**所需时间**：约 2-5 分钟（首次打包会下载 Electron 二进制文件）

### 步骤 3: 查找打包结果

打包完成后，在 `dist/` 目录中找到可执行文件：

```bash
# 查看打包结果
ls -lh dist/

# Windows
# Diary-X-1.0.0-x64-setup.exe

# macOS
# Diary-X-1.0.0-x64.dmg
# Diary-X-1.0.0-arm64.dmg

# Linux
# Diary-X-1.0.0-x64.AppImage
```

## ✅ 测试打包结果

### Windows
双击 `Diary-X-1.0.0-x64-setup.exe`，按提示安装并运行

### macOS
双击 `.dmg` 文件，将应用拖到 Applications 文件夹，然后运行

### Linux
```bash
chmod +x Diary-X-1.0.0-x64.AppImage
./Diary-X-1.0.0-x64.AppImage
```

## 🎯 一键打包（推荐）

如果您想更快，可以使用一键命令：

```bash
npm run dist
```

这个命令会：
1. 自动构建代码
2. 打包当前平台的应用
3. 生成可分发的安装包

## ⚠️ 常见问题

### 1. 没有应用图标？

**不用担心！** 即使没有准备图标文件，应用也能正常打包和运行，只是会使用默认的 Electron 图标。

**要添加自定义图标**：
1. 查看 [`resources/README.md`](../resources/README.md)
2. 准备图标文件放到 `resources/` 目录
3. 重新执行打包命令

### 2. better-sqlite3 编译错误？

```bash
# 重新构建原生模块
npm rebuild better-sqlite3

# 或使用 electron-rebuild
./node_modules/.bin/electron-rebuild
```

### 3. 打包很慢？

**首次打包会比较慢**（2-5分钟），因为需要下载 Electron 二进制文件。后续打包会快很多（30秒-2分钟）。

### 4. 磁盘空间不足？

打包过程需要：
- 构建产物：约 50-100 MB
- 最终安装包：约 100-200 MB
- 缓存文件：约 200-300 MB

**建议预留至少 500 MB 空间**

### 5. Windows Defender 报警？

这是常见的误报，因为应用没有代码签名。解决方案：
- 添加到白名单
- 或者购买代码签名证书（用于正式发布）

## 🎨 自定义打包

### 修改应用名称

编辑 [`package.json`](../package.json)：
```json
{
  "name": "diary-x",
  "productName": "我的日记应用",
  "version": "1.0.0"
}
```

### 修改窗口尺寸

编辑 [`src/main/index.ts`](../src/main/index.ts)：
```typescript
mainWindow = new BrowserWindow({
  width: 1400,  // 修改宽度
  height: 900,  // 修改高度
  // ...
})
```

### 修改安装程序设置

编辑 [`package.json`](../package.json) 的 `build.nsis` 部分：
```json
{
  "build": {
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true
    }
  }
}
```

## 📚 下一步

- 🎨 [准备应用图标](../resources/README.md)
- 📖 [完整打包指南](BUILD_GUIDE.md)
- 🔧 [配置代码签名](BUILD_GUIDE.md#代码签名证书)
- 🚀 [设置自动更新](BUILD_GUIDE.md#自动更新配置)

## 🆘 需要帮助？

如果遇到问题：
1. 查看 [完整打包指南](BUILD_GUIDE.md) 的"常见问题"部分
2. 检查 [Electron Builder 文档](https://www.electron.build/)
3. 在 GitHub 上提交 Issue

---

**恭喜！** 🎉 您已经成功完成了第一次打包！
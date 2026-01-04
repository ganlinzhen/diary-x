# Diary-X

<div align="center">

一个功能强大的 Markdown 日记应用，支持主题标签、计划管理和纪念日提醒。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Electron](https://img.shields.io/badge/Electron-39.2.7-47848F?logo=electron)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)

</div>

## ✨ 特性

- 📝 **Markdown 编辑器**：支持实时预览、分屏模式，让你专注于写作
- 🏷️ **主题标签**：为日记内容片段添加主题标签，便于分类和检索
- 📋 **计划管理**：创建和追踪个人计划，关联日记内容
- 🎉 **纪念日提醒**：记录重要日期，支持年度重复提醒
- 🗂️ **片段管理**：将日记内容分段管理，支持多标签关联
- 💾 **本地存储**：使用 SQLite 数据库，数据完全本地化，保护隐私
- 🎨 **现代 UI**：基于 Tailwind CSS 和 Radix UI，界面简洁美观
- 🚀 **高性能**：使用 Electron + React 构建，快速响应

## 🛠️ 技术栈

### 前端
- **框架**: React 19.2.3
- **路由**: React Router DOM 6.30.2
- **状态管理**: Zustand 5.0.9
- **UI 组件**: Radix UI
- **样式**: Tailwind CSS 3.4.19
- **Markdown**: React Markdown + Remark GFM
- **图标**: Lucide React

### 后端
- **运行时**: Electron 39.2.7
- **数据库**: Better-SQLite3 11.10.0
- **存储**: Electron Store 8.2.0
- **工具**: Electron Toolkit Utils

### 开发工具
- **构建工具**: Electron Vite 3.1.0 + Vite 6.4.1
- **语言**: TypeScript 5.9.3
- **代码质量**: ESLint + Prettier
- **打包工具**: Electron Builder 26.0.12

## 📦 项目结构

```
diary-x/
├── src/
│   ├── main/                 # 主进程代码
│   │   ├── index.ts         # 主进程入口
│   │   ├── db/              # 数据库相关
│   │   │   ├── index.ts     # 数据库初始化
│   │   │   ├── dao/         # 数据访问对象
│   │   │   ├── models/      # 数据模型
│   │   │   └── migrations/  # 数据库迁移
│   │   ├── ipc/             # IPC 处理器
│   │   ├── services/        # 业务服务
│   │   └── utils/           # 工具函数
│   ├── preload/             # 预加载脚本
│   │   └── index.ts
│   └── renderer/            # 渲染进程代码
│       ├── index.html
│       └── src/
│           ├── App.tsx      # 应用根组件
│           ├── main.tsx     # 渲染进程入口
│           ├── api/         # API 封装
│           ├── components/  # React 组件
│           │   ├── anniversary/  # 纪念日组件
│           │   ├── diary/        # 日记组件
│           │   ├── editor/       # 编辑器组件
│           │   ├── layout/       # 布局组件
│           │   ├── plan/         # 计划组件
│           │   ├── topic/        # 主题组件
│           │   └── ui/           # 通用 UI 组件
│           ├── pages/       # 页面组件
│           ├── router/      # 路由配置
│           ├── stores/      # Zustand 状态管理
│           ├── types/       # TypeScript 类型定义
│           ├── styles/      # 全局样式
│           └── utils/       # 工具函数
├── resources/               # 资源文件
├── electron.vite.config.ts  # Electron Vite 配置
├── tailwind.config.js       # Tailwind CSS 配置
├── tsconfig.json           # TypeScript 配置
└── package.json            # 项目依赖配置
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建应用

```bash
# 构建项目
npm run build

# 预览构建结果
npm run preview
```

### 启动应用

```bash
npm start
```

## 📦 应用打包

### 打包前准备

1. **准备应用图标**（推荐）
   - 查看 [`resources/README.md`](resources/README.md) 了解图标准备指南
   - Windows: 需要 `resources/icon.ico`
   - macOS: 需要 `resources/icon.icns`
   - 如果暂时没有图标，可以先使用默认图标

2. **更新应用信息**（可选）
   - 编辑 [`package.json`](package.json) 中的 `author`、`homepage` 等字段

### 打包命令

```bash
# 打包 Windows 应用（生成 .exe 安装程序）
npm run build:win

# 打包 macOS 应用（生成 .dmg 和 .zip）
npm run build:mac

# 打包 Linux 应用（生成 .AppImage、.deb、.rpm）
npm run build:linux

# 打包所有平台（需要在对应平台上执行）
npm run build:all

# 快速打包当前平台
npm run dist
```

### 打包输出

打包后的文件将生成在 `dist/` 目录：

**Windows**:
- `Diary-X-1.0.0-x64-setup.exe` - 64位安装程序
- `Diary-X-1.0.0-arm64-setup.exe` - ARM64安装程序

**macOS**:
- `Diary-X-1.0.0-x64.dmg` - Intel Mac 安装镜像
- `Diary-X-1.0.0-arm64.dmg` - Apple Silicon 安装镜像
- `Diary-X-1.0.0-x64.zip` - Intel Mac ZIP包
- `Diary-X-1.0.0-arm64.zip` - Apple Silicon ZIP包

**Linux**:
- `Diary-X-1.0.0-x64.AppImage` - AppImage 格式
- `Diary-X-1.0.0-amd64.deb` - Debian/Ubuntu 包
- `Diary-X-1.0.0-x86_64.rpm` - RedHat/Fedora 包

### 详细打包指南

查看完整的打包指南，包括图标准备、代码签名、常见问题等：

📚 **[应用打包完整指南](docs/BUILD_GUIDE.md)**

## 📖 功能说明

### 日记编辑

- 支持 Markdown 语法，包括 GFM（GitHub Flavored Markdown）扩展
- 三种编辑模式：纯编辑、纯预览、分屏模式
- 自动保存功能
- 按日期组织日记内容

### 片段管理

- 将日记内容分割为多个片段
- 每个片段可以关联多个主题标签
- 每个片段可以关联多个计划
- 支持片段的创建、编辑和删除

### 主题标签

- 创建自定义主题，支持颜色和图标
- 为日记片段添加主题标签
- 按主题查看相关的所有日记片段
- 统计每个主题下的片段数量

### 计划管理

- 创建个人计划，设置起止日期
- 为计划添加待办事项（Todo）
- 将日记片段关联到计划
- 追踪计划进度和完成情况

### 纪念日管理

- 记录重要的纪念日
- 支持按人物分类
- 可设置年度重复提醒
- 自定义颜色和图标
- 计算距离纪念日的天数

## 🎨 界面预览

应用包含以下主要页面：

- 📊 **仪表板**：总览日记、主题和计划的统计信息
- 📝 **日记编辑**：编写和管理日记内容
- 🏷️ **主题列表**：查看和管理所有主题标签
- 📋 **计划列表**：查看和管理个人计划
- 🎉 **纪念日列表**：查看和管理纪念日提醒

## 💾 数据存储

- 使用 SQLite 数据库存储所有数据
- 数据库文件位置：`{userData}/diary.db`
- 支持自动迁移和版本管理
- 启用 WAL 模式以提高性能
- 启用外键约束保证数据完整性

## 🔧 配置说明

### Electron 配置

应用窗口默认尺寸：1200 x 800

安全配置：
- Context Isolation: 启用
- Node Integration: 禁用
- Sandbox: 禁用（用于 better-sqlite3）

### 构建配置

使用 Electron Builder 进行应用打包，支持：
- macOS
- Windows
- Linux

## 📝 开发指南

### 添加新功能

1. 在 [`src/main/db/dao/`](src/main/db/dao/) 中创建相应的 DAO
2. 在 [`src/main/ipc/`](src/main/ipc/) 中添加 IPC 处理器
3. 在 [`src/renderer/src/api/`](src/renderer/src/api/) 中封装 API 调用
4. 在 [`src/renderer/src/stores/`](src/renderer/src/stores/) 中添加状态管理
5. 在 [`src/renderer/src/components/`](src/renderer/src/components/) 中创建 UI 组件
6. 在 [`src/renderer/src/pages/`](src/renderer/src/pages/) 中添加页面组件

### 数据库迁移

在 [`src/main/db/migrations/`](src/main/db/migrations/) 中添加迁移文件，遵循版本号命名规则。

### 代码风格

项目使用 TypeScript 严格模式，建议遵循以下规范：
- 使用函数式组件和 Hooks
- 明确的类型定义
- 组件和函数的适当注释
- 遵循 React 和 Electron 最佳实践

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 🙏 致谢

感谢以下开源项目：

- [Electron](https://www.electronjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Better SQLite3](https://github.com/WiseLibs/better-sqlite3)
- [Zustand](https://github.com/pmndrs/zustand)

---

<div align="center">
Made with ❤️ by Diary-X Team
</div>
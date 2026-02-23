# StudyWeb 学习平台

StudyWeb 是一个交互式的编程学习平台，专注于 Python 和 PyTorch 的教学。它集成了在线代码执行、终端模拟以及 LLM（大语言模型）辅助对话功能，为学习者提供沉浸式的编程学习体验。

## 项目特点

- **交互式课程**：内置 Python 和 PyTorch 的系列课程，涵盖从入门到进阶的内容。
- **在线代码运行**：支持直接在浏览器中编写并运行 Python 代码。
- **LLM 辅助学习**：集成大语言模型，随时解答学习过程中的疑问。
- **实时终端**：提供模拟终端，查看代码输出。
- **一键启动**：提供 Windows 批处理脚本，轻松配置环境并启动。

## 技术栈

- **前端**：Vue 3, Vite, Tailwind CSS, Lucide-Vue-Next
- **后端**：Node.js, Express
- **语言支持**：Python (需本地安装 Python 环境)

## 项目结构

```
studyweb/
├── client/              # 前端 Vue 项目
├── server/              # 后端 Node.js 项目
├── python_lessons/      # Python 课程练习文件
├── pytorch_lessons/     # PyTorch 课程练习文件
└── 启动项目.bat         # Windows 一键启动脚本
```

## 快速开始

### 环境依赖

- [Node.js](https://nodejs.org/) (建议 v16+)
- [Python 3](https://www.python.org/) (用于执行课程代码)

### 启动步骤

1. **直接启动（推荐受限 Windows 用户）**：
   - 双击根目录下的 `启动项目.bat`。脚本会自动检查 Node.js 环境，安装依赖并同时启动前端和后端服务。

2. **手动启动**：
   - **后端**：
     ```bash
     cd server
     npm install
     npm start
     ```
   - **前端**：
     ```bash
     cd client
     npm install
     npm run dev
     ```

## 许可协议

[MIT License](LICENSE)

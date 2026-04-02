# ✅ TodoList — Full-Stack 待办事项应用

一个功能完备的全栈待办事项管理应用，采用 **Spring Boot + React** 前后端分离架构，提供接近商业级 To-Do 应用的核心体验。

> [在线效果截图见下方 Screenshots 章节](#screenshots)

---

## ✨ 功能特性

| 模块 | 能力 |
|------|------|
| **任务 CRUD** | 创建、编辑、完成、删除任务 |
| **优先级** | 高 / 中 / 低 三级标记，颜色区分，自动排序 |
| **截止日期** | 日期选择器设置 deadline，过期自动红色高亮 |
| **"我的一天"** | 今日聚焦视图，手动标记或自动包含当日到期任务 |
| **分类清单** | 创建 / 删除自定义清单，任务归属不同清单 |
| **子任务 (Subtask)** | 每个任务下嵌套可勾选步骤，进度显示 (e.g. 2/5) |
| **备注** | 每个任务可添加文字补充描述 |
| **全局搜索** | 模糊匹配任务标题与备注，300ms 防抖实时过滤 |
| **智能排序** | 未完成优先 → 截止日期由近到远 → 优先级由高到低 |

## 📸 Screenshots (效果截图)

*(提示：建议在这里拖拽上传 2-3 张展示极光拟态外观、以及任务折叠面板全貌的截图，以让面试官直观感受到前端开发实力)*

|<img src="" alt="Main Dashboard Placeholder" width="400"/>|<img src="" alt="Task Detail Placeholder" width="400"/>|
|---|---|
| **主应用面板** - 玻璃拟态设计 | **任务详情与筛选** - 分类清单与右侧边栏状态 |

## 🏗️ 技术架构

```
┌──────────────────────────────────────────┐
│               Frontend                   │
│  React 19 + Vite 8 + Vanilla CSS         │
│  Glassmorphism Dark Theme                │
│  GPU-accelerated Background Animations   │
└──────────────┬───────────────────────────┘
               │  RESTful API (JSON)
               │  Vite Proxy → localhost:8080
┌──────────────▼───────────────────────────┐
│               Backend                    │
│  Spring Boot 4.x + Spring Data JPA       │
│  H2 In-Memory Database                  │
│  Partial Update (Map-based PATCH logic)  │
└──────────────────────────────────────────┘
```

### 技术栈

| 层 | 技术 | 版本 |
|----|------|------|
| **Frontend** | React | 19.x |
| | Vite | 8.x |
| | CSS (Glassmorphism) | — |
| **Backend** | Spring Boot | 4.x |
| | Spring Data JPA | — |
| | H2 (Embedded DB) | — |
| **Language** | Java | 17 |
| | JavaScript (ES Module) | — |

## 📁 项目结构

```
.
├── backend/                          # Spring Boot 后端
│   └── src/main/java/com/example/todo/
│       ├── TodoApplication.java      # 启动类
│       ├── controller/
│       │   ├── TodoController.java   # 任务 REST API
│       │   ├── TodoListController.java  # 清单 REST API
│       │   └── SubTaskController.java   # 子任务 REST API
│       ├── model/
│       │   ├── Todo.java             # 任务实体 (含 priority, dueDate, myDay, note)
│       │   ├── TodoList.java         # 清单实体
│       │   ├── SubTask.java          # 子任务实体
│       │   └── Priority.java         # 优先级枚举 (HIGH / MEDIUM / LOW / NONE)
│       └── repository/               # Spring Data JPA Repositories
│
├── frontend/                         # React + Vite 前端
│   └── src/
│       ├── App.jsx                   # 主应用：状态管理、智能排序、视图路由
│       ├── api/todoApi.js            # API 封装层 (fetch-based)
│       ├── components/
│       │   ├── Sidebar.jsx           # 侧边栏：导航、搜索、清单管理
│       │   ├── AddTodo.jsx           # 新建任务：优先级选择 + 日期选择
│       │   ├── TodoItem.jsx          # 任务卡片：展开详情、子任务、优先级修改
│       │   └── TodoList.jsx          # 任务列表容器
│       ├── index.css                 # 全局样式：Glassmorphism 暗色主题
│       └── main.jsx                  # React 入口
│
└── README.md
```

## 🚀 快速启动

### 环境要求

- **Java** 17+
- **Node.js** 18+
- **Maven** 3.9+（项目内置 Maven Wrapper，无需全局安装）

### 1. 启动后端

```bash
cd backend
./mvnw spring-boot:run        # Linux / macOS
.\mvnw spring-boot:run        # Windows PowerShell
```

后端默认运行在 `http://localhost:8080`

### 2. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端默认运行在 `http://localhost:5173`，Vite 已配置代理转发 `/api/*` 至后端。

### 3. 打开浏览器

访问 [http://localhost:5173](http://localhost:5173) 即可使用。

## 🔌 API 接口一览

### Todos

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/todos` | 获取所有任务（可选 `?listId=` 过滤） |
| `GET` | `/api/todos/my-day` | 获取"我的一天"任务 |
| `GET` | `/api/todos/search?q=` | 模糊搜索任务 |
| `POST` | `/api/todos` | 创建任务 |
| `PUT` | `/api/todos/{id}` | 部分更新任务（Map-based Partial Update） |
| `DELETE` | `/api/todos/{id}` | 删除任务 |

### Lists

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/lists` | 获取所有清单 |
| `POST` | `/api/lists` | 创建清单 |
| `PUT` | `/api/lists/{id}` | 更新清单名称 |
| `DELETE` | `/api/lists/{id}` | 删除清单（任务回退到收件箱） |

### SubTasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/todos/{id}/subtasks` | 获取子任务列表 |
| `POST` | `/api/todos/{id}/subtasks` | 添加子任务 |
| `PUT` | `/api/todos/{id}/subtasks/{subId}` | 更新子任务 |
| `DELETE` | `/api/todos/{id}/subtasks/{subId}` | 删除子任务 |

## 🧪 测试

```bash
cd backend
./mvnw test -Dtest=EnhancementApiTests
```

集成测试覆盖：任务 CRUD、优先级过滤、截止日期排序、子任务级联删除、"我的一天"视图。

## 🎨 设计亮点

- **Glassmorphism 暗色主题**：半透明毛玻璃质感，GPU 加速的渐变光晕动画背景
- **Partial Update 机制**：后端采用 `Map<String, Object>` 接收更新请求，仅修改客户端显式传入的字段，避免字段覆盖 Bug
- **智能多维排序**：未完成 → 截止日期 → 优先级，自动将已完成任务沉底
- **防抖搜索**：300ms debounce 减少无效请求
- **乐观更新 (Optimistic UI)**：前端先更新状态再发请求，失败时自动回滚，提升交互流畅度
- **中文本地化**：全界面中文，日期格式 `zh-CN`


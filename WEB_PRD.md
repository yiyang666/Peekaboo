<!--
 * @Author: ethan.young Ethan.Yang2@lingyiitech.com
 * @Date: 2026-03-24 10:58:27
 * @LastEditors: ethan.young Ethan.Yang2@lingyiitech.com
 * @LastEditTime: 2026-03-24 10:58:30
 * @FilePath: /login/PRD.md
 * @Description: 
-->
# 🧑‍💻 项目代号：Peekaboo Login

## 1. 项目概览 (Project Overview)

你要作为一个高级前端工程师，帮我实现一个具有高级微交互动画的 Web 登录页面。  
整体布局：经典的左右分栏（Split-Screen）设计。

### 1.1 左侧（视觉交互区）

- 深灰色背景
- 包含四个形态各异的几何卡通小人（SVG 绘制）。
- 这些小人会根据右侧表单交互状态做出不同的动作反应，是整个页面的“灵魂”。

### 1.2 右侧（表单操作区）

- 纯白背景
- 极简风格的现代登录表单
  - 包含邮箱、密码、记住我、第三方登录等标准组件。

## 2. 核心交互需求 (Core Interactions)

左侧卡通小人的行为由一个状态机（State Machine）控制，共有 4 种核心状态：

### 2.1 状态 A：默认跟随追踪 (Idle / Mouse Tracking)

- **触发条件**：页面加载完成，且输入框未获得焦点。
- **动画表现**：  
  小人的眼珠（Pupils）会实时计算与鼠标指针的相对角度和距离，使用 Math.atan2 实现眼珠在眼眶内的限制移动，表现出“盯着鼠标看”的效果。

### 2.2 状态 B：输入账号时的“探头” (Email Focus)

- **触发条件**：Email 输入框获得焦点（onFocus）。
- **动画表现**：  
  打断鼠标跟随逻辑。小人的身体或脖子在 Y 轴上产生向上的位移（伸长脖子），眼珠统一看向右侧 Email 输入框的固定坐标区域。

### 2.3 状态 C：输入密码时的“偷瞄” (Password Focus)

- **触发条件**：Password 输入框获得焦点。
- **动画表现**：  
  小人身体微微向下或向右倾斜，眼睛看向右下方 Password 输入框的位置，表现出“好奇偷看你输入密码”的拟人态。

### 2.4 状态 D：密码可见时的“非礼勿视” (Show Password Active)

- **触发条件**：用户点击密码框右侧的“眼睛/闭眼”图标，切换为明文显示。
- **动画表现**：  
  触发强烈转场动画。所有小人通过 `transform: scaleX(-1)` 或切换内部 SVG 路径，表现为“背过身去”或“闭上眼睛看向左侧”。在此期间，完全屏蔽眼珠的鼠标跟随功能。恢复为密文后，小人转回正面。

## 3. 技术栈建议 (Tech Stack)

### 3.1 前端框架

- React（搭配 TypeScript 保证状态管理的严谨性）。

### 3.2 样式方案

- Tailwind CSS（用于快速构建左右分栏布局和右侧表单样式）。

### 3.3 图形与动画

- **SVG**：用于绘制左侧的小人（保证矢量缩放不失真，且方便单独操作眼珠、身体的 DOM 节点）。
- **动画库**：
  - Framer Motion 或 GSAP：处理复杂的平滑过渡（如伸长脖子、转身的弹性动画 Spring 效果）。
  - 如果不使用重型库，也可采用原生的 requestAnimationFrame + CSS Transitions 实现。
# 阳光花园社区应用

本项目是一个为"阳光花园"小区设计的在线社区应用，旨在方便业主查看社区公告、参与社区事件，促进邻里沟通与互助。该应用提供了一套完整的社区信息管理解决方案，支持业主、业委会和物业等多种角色的协同工作。

## 🌟 核心功能

### 事件管理
- **社区事件发布**：业主、业委会成员和物业可以发布各类社区事件。
- **事件详情展示**：详细展示事件内容、图片、附件等信息。
- **事件时间线**：记录事件的进展和更新，形成完整的时间线。
- **AI智能概要**：利用AI技术自动生成事件概要，提高信息获取效率。

### 用户角色与权限
- **业主**：可以查看社区事件、提出建议、报修等。
- **业委会成员**：拥有更多管理权限，如发布公告、发起征询意见、处理支出申请等。
- **物业**：负责处理报修、发布物业通知等。

### 互动功能
- **轻互动**：支持点赞、点踩、跟进等简单的互动操作。
- **消息通知**：系统消息和互动消息通知，确保用户及时了解社区动态。

### 数据可视化
- **财务公开**：展示小区财务收支情况，增强透明度。
- **统计报表**：提供各类统计数据和报表，辅助决策。

## 🚀 技术栈

- **前端框架**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **路由**: [React Router](https://reactrouter.com/)
- **状态管理**: [Zustand](https://zustand-demo.pmnd.rs/)
- **UI 库**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + [Lucide React](https://lucide.dev/guide/packages/lucide-react) (图标)
- **后端服务**: [Supabase](https://supabase.com/)
- **AI服务**: [硅基流动](https://siliconflow.cn/) (DeepSeek-V3)

## 📦 快速开始

1. **安装依赖**

   ```bash
   npm install
   # 或者使用 pnpm
   # pnpm install
   ```

2. **配置环境变量**

   复制 `.env.example` 文件并重命名为 `.env`，然后根据需要配置环境变量。

3. **运行开发环境**

   ```bash
   npm run dev
   ```

   项目将在本地启动，您可以通过浏览器访问 `http://localhost:5173` 查看。

## 📚 文档导航

为了更好地理解和使用本项目，我们提供了详细的文档：

- [系统架构](./docs/architecture.md) - 项目整体架构和模块划分
- [核心功能](./docs/features.md) - 详细功能说明和使用指南
- [数据库设计](./docs/database-design.md) - 数据库表结构和关系
- [用户角色](./docs/user-roles.md) - 用户角色和权限说明
- [AI功能](./docs/ai-features.md) - AI功能集成和使用
- [开发指南](./docs/development.md) - 开发环境设置和代码规范
- [部署指南](./docs/deployment.md) - 项目部署说明
- [测试指南](./docs/testing.md) - 测试策略和运行方法
- [贡献指南](./docs/contributing.md) - 如何为项目做贡献
- [代码质量](./docs/code-quality.md) - 代码质量改进建议
- [Supabase集成](./docs/README-supabase.md) - Supabase集成详细指南
- [线框图设计](./docs/wireframes/README.md) - 页面线框图和设计规范

## 🤝 贡献

我们欢迎任何形式的贡献！请阅读 [贡献指南](./docs/contributing.md) 了解如何参与项目开发。

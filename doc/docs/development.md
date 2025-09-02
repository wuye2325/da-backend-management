# 开发指南

## 概述

本指南旨在帮助开发者快速上手阳光花园社区应用的开发工作。文档涵盖了开发环境设置、代码规范、分支策略、构建和部署等方面的内容。

## 开发环境设置

### 系统要求

- **操作系统**: Windows 10/11, macOS 10.15+, Ubuntu 20.04+
- **Node.js**: v16.x 或更高版本
- **npm**: v8.x 或更高版本 (推荐使用pnpm)
- **代码编辑器**: 推荐使用 VS Code
- **Git**: 最新版本

### 安装依赖

1. 克隆项目仓库:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. 安装项目依赖:
   ```bash
   npm install
   # 或者使用 pnpm (推荐)
   # pnpm install
   ```

### 环境变量配置

项目根目录下应包含一个 `.env.example` 文件，其中定义了所有必要的环境变量。如果该文件不存在，可以手动创建，内容如下：

```env
# Supabase配置
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI服务配置
VITE_AI_API_KEY=your_ai_service_api_key

# 其他配置
VITE_APP_NAME=阳光花园社区应用
```

1. 复制 `.env.example` 文件并重命名为 `.env`:
   ```bash
   cp .env.example .env
   ```

2. 根据需要配置环境变量:
   - `VITE_SUPABASE_URL`: Supabase项目URL
   - `VITE_SUPABASE_ANON_KEY`: Supabase匿名密钥
   - `VITE_AI_API_KEY`: AI服务API密钥

### 启动开发服务器

```bash
npm run dev
# 或者使用 pnpm
# pnpm run dev
```

项目将在本地启动，您可以通过浏览器访问 `http://localhost:5173` 查看。

## 代码规范

### 编程语言和框架

- **TypeScript**: 项目使用TypeScript进行类型检查，所有代码都应使用TypeScript编写。
- **React**: 使用React构建用户界面，遵循React最佳实践。
- **Tailwind CSS**: 使用Tailwind CSS进行样式设计，遵循其原子化CSS理念。
- **shadcn/ui**: 基于Tailwind CSS和Radix UI构建的可复用组件库。

### 代码风格

- **命名规范**: 
  - 文件名使用kebab-case (例如: `event-detail.tsx`)
  - 组件名使用PascalCase (例如: `EventDetail`)
  - 变量和函数名使用camelCase (例如: `getUserInfo`)
  - 常量使用UPPER_SNAKE_CASE (例如: `MAX_RETRY_COUNT`)

- **组件设计**:
  - 优先使用函数组件和Hooks
  - 组件应保持单一职责
  - 合理使用props进行组件间通信
  - 复杂组件应拆分为更小的子组件

- **状态管理**:
  - 使用Zustand进行全局状态管理
  - 组件内部状态使用useState和useReducer
  - 避免不必要的状态更新

### 代码质量

- **类型检查**: 所有TypeScript代码都应通过类型检查，避免使用`any`类型。
- **代码注释**: 复杂逻辑应添加注释说明，公共API应添加JSDoc注释。
- **错误处理**: 合理处理异步操作和可能的错误情况。
- **性能优化**: 注意避免不必要的重渲染，合理使用React.memo、useMemo和useCallback。

## 分支策略

项目采用Git进行版本控制，遵循以下分支策略：

### 主要分支

- **main**: 主分支，包含稳定的生产代码。
- **develop**: 开发分支，包含最新的开发代码。
- **feature/**: 功能分支，用于开发新功能。
- **hotfix/**: 热修复分支，用于紧急修复生产环境问题。
- **release/**: 发布分支，用于准备新版本发布。

### 工作流程

1. **功能开发**:
   - 从`develop`分支创建`feature/`分支
   - 在`feature/`分支上进行功能开发
   - 开发完成后，提交Pull Request到`develop`分支
   - 代码审查通过后，合并到`develop`分支

2. **版本发布**:
   - 从`develop`分支创建`release/`分支
   - 在`release/`分支上进行发布前的测试和修复
   - 测试通过后，合并到`main`分支
   - 从`main`分支创建版本标签
   - 将`main`分支的更改合并回`develop`分支

3. **紧急修复**:
   - 从`main`分支创建`hotfix/`分支
   - 在`hotfix/`分支上进行紧急修复
   - 修复完成后，提交Pull Request到`main`分支
   - 代码审查通过后，合并到`main`分支
   - 从`main`分支创建版本标签
   - 将`hotfix/`分支的更改合并到`develop`分支

## 构建和部署

### 构建项目

```bash
npm run build
# 或者使用 pnpm
# pnpm run build
```

构建后的文件将位于`dist`目录中。

### 部署到生产环境

1. 确保所有代码已合并到`main`分支。
2. 在`main`分支上执行构建命令。
3. 将`dist`目录中的文件部署到Web服务器或CDN。

### 环境配置

不同环境应使用不同的环境变量配置：
- **开发环境**: `.env.development`
- **测试环境**: `.env.test`
- **生产环境**: `.env.production`

## 调试和测试

### 调试工具

- **浏览器开发者工具**: 用于调试前端代码和查看网络请求。
- **React Developer Tools**: 用于检查React组件树和状态。
- **Redux DevTools**: 用于调试Zustand状态。

### 日志记录

- 使用`console.log`进行临时调试，但不应提交到代码库。
- 使用专业的日志库进行生产环境的日志记录。

### 测试策略

- **单元测试**: 使用Jest和React Testing Library进行组件和函数的单元测试。
- **集成测试**: 测试组件间的交互和集成。
- **端到端测试**: 使用Cypress进行端到端测试，模拟用户操作。

### 运行测试

```bash
# 运行所有测试
npm run test
# 或者使用 pnpm
# pnpm run test

# 运行测试并监听文件变化
npm run test:watch
# 或者使用 pnpm
# pnpm run test:watch
```

## 贡献流程

1. Fork项目仓库
2. 创建功能分支
3. 提交代码更改
4. 编写测试用例
5. 确保所有测试通过
6. 提交Pull Request
7. 等待代码审查和合并

## 常见问题

### 依赖安装失败

如果遇到依赖安装失败的问题，可以尝试以下解决方案：
1. 清除npm缓存: `npm cache clean --force`
2. 删除`node_modules`目录和`package-lock.json`文件，重新安装依赖
3. 使用pnpm替代npm

### 开发服务器启动失败

如果开发服务器启动失败，可以检查以下几点：
1. 端口是否被占用
2. 环境变量是否配置正确
3. 依赖是否安装完整

### 构建失败

如果构建失败，可以检查以下几点：
1. TypeScript类型错误
2. 代码中是否存在语法错误
3. 环境变量是否配置正确
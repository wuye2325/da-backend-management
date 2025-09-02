# Supabase 配置获取指南

这个文档将详细指导你如何获取 Supabase 的配置信息，即使你没有后端经验也能轻松完成。

## 第一步：注册和创建 Supabase 项目

### 1.1 注册 Supabase 账号
1. 打开浏览器，访问 [https://supabase.com](https://supabase.com)
2. 点击右上角的 "Start your project" 或 "Sign up" 按钮
3. 你可以选择用 GitHub 账号登录，或者用邮箱注册
4. 如果用邮箱注册，填写邮箱和密码，然后验证邮箱

### 1.2 创建新项目
1. 登录后，你会看到项目列表页面
2. 点击 "New project" 按钮
3. 选择一个组织（如果是第一次使用，会自动创建一个）
4. 填写项目信息：
   - **Name**: 给你的项目起个名字，比如 "community-system"
   - **Database Password**: 设置一个强密码（记住这个密码，后面会用到）
   - **Region**: 选择离你最近的区域，建议选择 "Singapore (Southeast Asia)"
5. 点击 "Create new project" 按钮
6. 等待 1-2 分钟，项目创建完成

## 第二步：获取配置信息

### 2.1 获取项目 URL 和 API Keys
1. 项目创建完成后，点击进入你的项目
2. 在左侧菜单中找到 "Settings"（设置）
3. 点击 "Settings" 下的 "API"
4. 在这个页面你会看到：

#### Project URL（项目地址）
- 在页面顶部，你会看到 "Project URL"
- 复制这个 URL，它看起来像：`https://your-project-id.supabase.co`
- 这个就是 `VITE_SUPABASE_URL`

#### Project API keys（项目 API 密钥）
在 "Project API keys" 部分，你会看到两个密钥：

**anon public（匿名公钥）**
- 这个密钥是公开的，可以在前端代码中使用
- 复制这个密钥，它很长，以 "eyJ" 开头
- 这个就是 `VITE_SUPABASE_ANON_KEY`

**service_role（服务角色密钥）**
- 这个密钥非常重要，拥有完全的数据库访问权限
- ⚠️ **重要**：这个密钥绝对不能在前端代码中使用，也不能提交到 git
- 复制这个密钥，同样很长，以 "eyJ" 开头
- 这个就是 `SUPABASE_SERVICE_ROLE_KEY`

### 2.2 获取数据库连接字符串（可选）
1. 在左侧菜单中点击 "Settings" 下的 "Database"
2. 找到 "Connection string" 部分
3. 选择 "URI" 标签
4. 复制显示的连接字符串
5. 将其中的 `[YOUR-PASSWORD]` 替换为你在创建项目时设置的数据库密码
6. 这个就是 `DATABASE_URL`

### 2.3 获取 JWT 密钥（可选）
1. 还是在 "Settings" -> "API" 页面
2. 向下滚动找到 "JWT Settings" 部分
3. 复制 "JWT Secret" 的值
4. 这个就是 `SUPABASE_JWT_SECRET`

## 第三步：配置环境变量

### 3.1 创建 .env 文件
1. 在项目根目录下，复制 `.env.example` 文件
2. 将复制的文件重命名为 `.env`
3. 用文本编辑器打开 `.env` 文件

### 3.2 填入配置信息
将你刚才获取的信息填入对应的位置：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-id.supabase.co:5432/postgres
SUPABASE_JWT_SECRET=your-jwt-secret-here
```

### 3.3 保存文件
保存 `.env` 文件，确保：
- 文件名就是 `.env`（没有其他后缀）
- 文件在项目根目录下
- 所有的值都已经正确填入

## 第四步：验证配置

### 4.1 检查 .gitignore
确保你的 `.gitignore` 文件中包含了 `.env`，这样就不会意外提交敏感信息到 git。

### 4.2 重启开发服务器
如果你的开发服务器正在运行，需要重启它来加载新的环境变量：
1. 在终端中按 `Ctrl + C` 停止服务器
2. 运行 `npm run dev` 重新启动

## 常见问题

### Q: 我找不到 Settings 菜单
A: 确保你已经进入了具体的项目页面，而不是项目列表页面。项目名称应该显示在页面顶部。

### Q: API 密钥看起来不对
A: Supabase 的 API 密钥都是 JWT 格式，以 "eyJ" 开头，非常长（通常几百个字符）。如果你的密钥不是这样的，请重新检查。

### Q: 数据库密码忘记了
A: 可以在 "Settings" -> "Database" 页面重置数据库密码。

### Q: 项目创建失败
A: 可能是网络问题或者项目名称重复，尝试换个项目名称或者稍后再试。

## 安全提醒

1. **永远不要**将 `service_role` 密钥暴露在前端代码中
2. **永远不要**将 `.env` 文件提交到 git
3. 如果意外泄露了密钥，立即在 Supabase 控制台重新生成
4. 定期检查你的 Supabase 项目使用情况，确保没有异常访问

完成以上步骤后，你的项目就可以连接到 Supabase 了！
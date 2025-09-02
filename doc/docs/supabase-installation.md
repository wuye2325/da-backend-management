# Supabase 依赖包安装指南

在配置 Supabase 之前，你需要先安装必要的依赖包。

## 安装步骤

### 1. 安装 Supabase JavaScript 客户端

在项目根目录下打开终端，运行以下命令：

```bash
npm install @supabase/supabase-js
```

这个包是 Supabase 的官方 JavaScript 客户端，提供了：
- 数据库操作（增删改查）
- 用户认证功能
- 实时订阅功能
- 文件存储功能

### 2. 安装类型定义（可选但推荐）

如果你使用 TypeScript（我们的项目使用 TypeScript），建议安装类型定义：

```bash
npm install --save-dev @types/node
```

这个包已经在项目中安装了，所以你不需要再次安装。

### 3. 验证安装

安装完成后，你可以检查 `package.json` 文件，应该能看到新增的依赖：

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x.x",
    // ... 其他依赖
  }
}
```

## 创建 Supabase 客户端

安装完依赖后，你需要创建一个 Supabase 客户端配置文件。

### 创建配置文件

在 `src/lib/` 目录下创建 `supabase.ts` 文件：

```typescript
import { createClient } from '@supabase/supabase-js'

// 从环境变量中获取配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 检查环境变量是否存在
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  )
}

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 导出类型（用于 TypeScript）
export type { User } from '@supabase/supabase-js'
```

### 使用说明

创建好配置文件后，你就可以在项目的任何地方导入和使用 Supabase 客户端：

```typescript
import { supabase } from '@/lib/supabase'

// 示例：获取数据
const { data, error } = await supabase
  .from('your_table')
  .select('*')

// 示例：用户认证
const { user } = await supabase.auth.getUser()
```

## 下一步

1. 完成 [Supabase 配置获取指南](./supabase-setup-guide.md)
2. 配置好 `.env` 文件
3. 重启开发服务器
4. 开始使用 Supabase 功能

## 常见问题

### Q: 安装失败怎么办？
A: 尝试以下解决方案：
1. 确保网络连接正常
2. 清除 npm 缓存：`npm cache clean --force`
3. 删除 `node_modules` 和 `package-lock.json`，然后重新安装：`npm install`

### Q: 版本冲突怎么办？
A: Supabase 客户端与 React 18 兼容良好。如果遇到版本冲突，可以尝试：
1. 更新到最新版本：`npm update @supabase/supabase-js`
2. 查看官方文档的兼容性说明

### Q: 如何更新 Supabase 客户端？
A: 运行 `npm update @supabase/supabase-js` 来更新到最新版本。
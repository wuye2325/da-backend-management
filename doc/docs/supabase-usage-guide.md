# Supabase 使用指南

这个文档将教你如何在项目中使用 Supabase 进行数据库操作、用户认证等功能。

## 前置条件

在开始使用之前，请确保你已经完成：

1. ✅ [安装 Supabase 依赖包](./supabase-installation.md)
2. ✅ [获取 Supabase 配置信息](./supabase-setup-guide.md)
3. ✅ 配置好 `.env` 文件
4. ✅ 重启开发服务器

## 基本使用方法

### 1. 导入 Supabase 客户端

在任何需要使用 Supabase 的文件中，首先导入客户端：

```typescript
import { supabase } from '@/lib/supabase'
```

### 2. 数据库操作

#### 查询数据
```typescript
// 获取所有数据
const { data, error } = await supabase
  .from('events') // 表名
  .select('*')    // 选择所有字段

// 带条件查询
const { data, error } = await supabase
  .from('events')
  .select('id, title, description')
  .eq('status', 'active')        // 等于条件
  .gt('created_at', '2024-01-01') // 大于条件
  .order('created_at', { ascending: false }) // 排序
  .limit(10)                     // 限制数量
```

#### 插入数据
```typescript
const { data, error } = await supabase
  .from('events')
  .insert({
    title: '新活动',
    description: '活动描述',
    status: 'active'
  })
  .select() // 返回插入的数据
```

#### 更新数据
```typescript
const { data, error } = await supabase
  .from('events')
  .update({ status: 'completed' })
  .eq('id', eventId)
  .select()
```

#### 删除数据
```typescript
const { error } = await supabase
  .from('events')
  .delete()
  .eq('id', eventId)
```

### 3. 用户认证

#### 用户注册
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})
```

#### 用户登录
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

#### 获取当前用户
```typescript
const { data: { user } } = await supabase.auth.getUser()
```

#### 用户登出
```typescript
const { error } = await supabase.auth.signOut()
```

### 4. 实时订阅

```typescript
// 订阅表的变化
const subscription = supabase
  .channel('events-channel')
  .on(
    'postgres_changes',
    {
      event: '*', // 监听所有事件（INSERT, UPDATE, DELETE）
      schema: 'public',
      table: 'events'
    },
    (payload) => {
      console.log('数据变化:', payload)
      // 处理数据变化
    }
  )
  .subscribe()

// 取消订阅
subscription.unsubscribe()
```

## 在 React 组件中使用

### 示例：事件列表组件

```typescript
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Event {
  id: string
  title: string
  description: string
  created_at: string
}

export function EventList() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取事件列表
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setEvents(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // 添加新事件
  const addEvent = async (title: string, description: string) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({ title, description })
        .select()
        .single()

      if (error) throw error
      setEvents(prev => [data, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : '添加失败')
    }
  }

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error}</div>

  return (
    <div>
      <h2>事件列表</h2>
      {events.map(event => (
        <div key={event.id} className="border p-4 mb-2">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <small>{new Date(event.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  )
}
```

### 示例：用户认证 Hook

```typescript
import { useState, useEffect } from 'react'
import { supabase, type User } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取当前用户
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut
  }
}
```

## 错误处理

### 常见错误类型

```typescript
const { data, error } = await supabase
  .from('events')
  .select('*')

if (error) {
  console.error('Supabase 错误:', error)
  
  // 根据错误类型处理
  switch (error.code) {
    case 'PGRST116':
      console.log('表不存在')
      break
    case '42501':
      console.log('权限不足')
      break
    default:
      console.log('未知错误:', error.message)
  }
}
```

### 网络错误处理

```typescript
try {
  const { data, error } = await supabase
    .from('events')
    .select('*')
  
  if (error) throw error
  return data
} catch (err) {
  if (err instanceof Error) {
    if (err.message.includes('fetch')) {
      console.log('网络连接错误')
    } else {
      console.log('其他错误:', err.message)
    }
  }
}
```

## 性能优化建议

### 1. 使用 select 指定字段
```typescript
// ❌ 不好：获取所有字段
const { data } = await supabase.from('events').select('*')

// ✅ 好：只获取需要的字段
const { data } = await supabase
  .from('events')
  .select('id, title, created_at')
```

### 2. 使用分页
```typescript
const { data } = await supabase
  .from('events')
  .select('*')
  .range(0, 9) // 获取前 10 条记录
```

### 3. 使用索引字段进行查询
```typescript
// 确保 user_id 字段有索引
const { data } = await supabase
  .from('events')
  .select('*')
  .eq('user_id', userId)
```

## 调试技巧

### 1. 启用详细日志
```typescript
// 在开发环境中启用
if (import.meta.env.DEV) {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth event:', event, session)
  })
}
```

### 2. 检查 RLS 策略
如果查询返回空结果，可能是行级安全策略（RLS）的问题。在 Supabase 控制台检查表的 RLS 设置。

### 3. 使用浏览器开发者工具
在网络标签页中查看 Supabase API 请求和响应，帮助调试问题。

## 下一步

1. 在 Supabase 控制台创建你的数据表
2. 设置行级安全策略（RLS）
3. 在项目中集成用户认证
4. 实现数据的增删改查功能
5. 添加实时功能（如果需要）

## 有用的链接

- [Supabase 官方文档](https://supabase.com/docs)
- [JavaScript 客户端文档](https://supabase.com/docs/reference/javascript)
- [SQL 编辑器使用指南](https://supabase.com/docs/guides/database/overview)
# Supabase 邮箱验证和密码重置配置指南

本指南将帮助您正确配置 Supabase 的邮箱验证和密码重置功能，解决注册后邮箱激活链接无法正常工作的问题。

## 问题描述

用户注册后收到的激活邮件链接指向 `localhost:3000`，并返回 `access_denied` 和 `otp_expired` 错误，无法正常完成邮箱验证。同时需要配置密码重置功能。

## 解决方案

### 1. Supabase 后台设置

#### 1.1 登录 Supabase 控制台
1. 访问 [https://supabase.com](https://supabase.com)
2. 登录您的账户
3. 选择您的项目

#### 1.2 配置认证设置
1. 在左侧菜单中点击 **Authentication**
2. 点击 **Settings** 标签页
3. 在 **General** 部分进行以下配置：

**Site URL 设置：**
```
https://dajiasolo.intu.cn
```

**Redirect URLs 设置：**
```
https://dajiasolo.intu.cn/auth/callback
http://localhost:3000/auth/callback
https://dajiasolo.intu.cn/reset-password
http://localhost:3000/reset-password
```

#### 1.3 确认邮箱验证设置
1. 在 **Authentication** > **Settings** 中
2. 确保 **Enable email confirmations** 已开启
3. 确保 **Enable password reset** 已开启

### 2. 代码更改

#### 2.1 创建邮箱验证回调页面
已创建 `src/pages/AuthCallback.tsx` 来处理邮箱验证回调。

#### 2.2 创建密码重置页面
已创建以下页面：
- `src/pages/ForgotPassword.tsx` - 忘记密码页面
- `src/pages/ResetPassword.tsx` - 密码重置页面

#### 2.3 更新路由配置
在 `src/App.tsx` 中添加了新的路由：
- `/auth/callback` - 邮箱验证回调
- `/forgot-password` - 忘记密码
- `/reset-password` - 密码重置

#### 2.4 更新注册重定向
在 `src/lib/auth.ts` 的 `signUp` 方法中添加了 `emailRedirectTo` 配置。

### 3. 测试流程

#### 3.1 邮箱验证测试
1. 注册新用户
2. 检查邮箱收到验证邮件
3. 点击邮件中的验证链接
4. 应该跳转到 `/auth/callback` 页面并显示验证成功

#### 3.2 密码重置测试
1. 在登录页面点击"忘记密码？"
2. 输入邮箱地址
3. 检查邮箱收到重置邮件
4. 点击邮件中的重置链接
5. 应该跳转到 `/reset-password` 页面
6. 输入新密码并提交
7. 重置成功后跳转到登录页面

### 4. 常见问题

#### 4.1 邮件链接仍然指向 localhost
- 确保 Supabase 后台的 Site URL 设置正确
- 清除浏览器缓存后重试

#### 4.2 验证链接过期
- 邮件链接有时效性，请及时点击
- 如果过期，可以重新注册或重新发送重置邮件

#### 4.3 邮件未收到
- 检查垃圾邮件文件夹
- 确认邮箱地址输入正确
- 检查 Supabase 项目的邮件配置

### 5. 生产环境配置

#### 5.1 域名配置
确保以下 URL 都配置正确：
- Site URL: `https://dajiasolo.intu.cn`
- Redirect URLs 包含：
  - `https://dajiasolo.intu.cn/auth/callback`
  - `https://dajiasolo.intu.cn/reset-password`

#### 5.2 本地开发支持
如果需要同时支持本地开发，在 Redirect URLs 中添加：
- `http://localhost:3000/auth/callback`
- `http://localhost:3000/reset-password`

### 6. 安全考虑

1. **重定向 URL 验证**：只添加信任的域名到 Redirect URLs
2. **邮件模板**：可以在 Supabase 后台自定义邮件模板
3. **令牌过期时间**：可以在 Supabase 后台调整令牌有效期

### 7. 技术原理

#### 7.1 邮箱验证流程
1. 用户注册时，Supabase 发送验证邮件
2. 邮件包含带有令牌的链接
3. 用户点击链接，跳转到 `/auth/callback`
4. 页面解析 URL 参数中的令牌
5. 使用令牌设置用户会话
6. 验证成功后跳转到主页

#### 7.2 密码重置流程
1. 用户在忘记密码页面输入邮箱
2. Supabase 发送重置邮件
3. 邮件包含带有令牌的重置链接
4. 用户点击链接，跳转到 `/reset-password`
5. 页面验证令牌有效性
6. 用户输入新密码
7. 使用 Supabase API 更新密码
8. 重置成功后跳转到登录页面

## 完成后的功能

✅ 邮箱验证功能  
✅ 密码重置功能  
✅ 忘记密码功能  
✅ 本地开发和生产环境支持  
✅ 错误处理和用户提示  
✅ 响应式 UI 设计
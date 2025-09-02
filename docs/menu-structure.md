# 大家共治后台管理系统 - 菜单结构文档

## 系统概述
本文档记录了大家共治后台管理系统的完整菜单结构，包括主菜单、子菜单、页面路径和功能说明。

## 菜单结构总览

```
大家共治后台管理系统
├── 首页
├── 授权中心
│   ├── 小区管理
│   └── 授权等级管理
├── 模板配置
│   └── 流程模板
├── AI服务管理
│   ├── 提示词管理
│   └── API配置管理
└── 系统管理
    ├── 角色权限管理
    ├── 用户账号管理
    ├── 部门管理
    ├── 数据字典
    ├── 系统日志管理
    ├── 系统配置
    └── 下载中心
```

## 详细菜单配置

### 1. 首页 (Home)
- **菜单标题**: 首页
- **图标**: `fas fa-home`
- **页面文件**: `index.html`
- **菜单类型**: 单级菜单
- **功能描述**: 系统主页，显示关键指标和数据概览

### 2. 授权中心 (Auth Center)
- **菜单标题**: 授权中心
- **图标**: `fas fa-key`
- **菜单类型**: 多级菜单
- **功能描述**: 管理小区授权和权限等级相关功能

#### 2.1 小区管理 (Community Management)
- **菜单标题**: 小区管理
- **图标**: `fas fa-building`
- **页面文件**: `community-management.html`
- **功能描述**: 
  - 小区信息管理
  - 小区授权配置
  - 小区状态监控
  - 小区数据统计

#### 2.2 授权等级管理 (Authorization Levels)
- **菜单标题**: 授权等级管理
- **图标**: `fas fa-layer-group`
- **页面文件**: `authorization-levels.html`
- **功能描述**:
  - 创建和管理授权等级
  - 配置等级权限
  - 等级分配管理
  - 权限模板设置

### 3. 模板配置 (Template Config)
- **菜单标题**: 模板配置
- **图标**: `fas fa-file-alt`
- **菜单类型**: 多级菜单
- **功能描述**: 管理系统中使用的各种模板

#### 3.1 流程模板 (Process Template)
- **菜单标题**: 流程模板
- **图标**: `fas fa-project-diagram`
- **页面文件**: `template-config.html`
- **功能描述**:
  - 创建审批流程模板
  - 配置流程步骤
  - 设置审批人和抄送人
  - 流程模板管理

### 4. AI服务管理 (AI Center)
- **菜单标题**: AI服务管理
- **图标**: `fas fa-robot`
- **菜单类型**: 多级菜单
- **功能描述**: 管理AI相关功能和配置

#### 4.1 提示词管理 (AI Prompt Management)
- **菜单标题**: 提示词管理
- **图标**: `fas fa-comment-dots`
- **页面文件**: `ai-prompt-management.html`
- **功能描述**:
  - AI提示词创建和编辑
  - 提示词分类管理
  - 提示词版本控制
  - 使用统计分析

#### 4.2 API配置管理 (API Configuration)
- **菜单标题**: API配置管理
- **图标**: `fas fa-cogs`
- **页面文件**: `api-configuration.html`
- **功能描述**:
  - API接口配置
  - 服务端点管理
  - API密钥管理
  - 调用监控和日志

### 5. 系统管理 (System Center)
- **菜单标题**: 系统管理
- **图标**: `fas fa-cogs`
- **菜单类型**: 多级菜单
- **功能描述**: 系统核心管理功能

#### 5.1 角色权限管理 (Role Permission Management)
- **菜单标题**: 角色权限管理
- **图标**: `fas fa-shield-alt`
- **页面文件**: `role-permission-management.html`
- **功能描述**:
  - 角色创建和编辑
  - 权限配置（支持总后台、PC中台、小程序三端）
  - 用户角色分配
  - 权限继承和级联管理

#### 5.2 用户账号管理 (User Management)
- **菜单标题**: 用户账号管理
- **图标**: `fas fa-users`
- **页面文件**: `user-management.html`
- **功能描述**:
  - 用户账号CRUD操作
  - 用户状态管理
  - 密码重置
  - 用户权限查看

#### 5.3 部门管理 (Department Management)
- **菜单标题**: 部门管理
- **图标**: `fas fa-sitemap`
- **页面文件**: `department-management.html`
- **功能描述**:
  - 部门层级结构管理
  - 部门人员配置
  - 部门权限设置
  - 组织架构维护

#### 5.4 数据字典 (Data Dictionary)
- **菜单标题**: 数据字典
- **图标**: `fas fa-book`
- **页面文件**: `data-dictionary.html`
- **功能描述**:
  - 系统字典项管理
  - 下拉选项配置
  - 数据标准化设置
  - 字典项版本控制

#### 5.5 系统日志管理 (System Logs)
- **菜单标题**: 系统日志管理
- **图标**: `fas fa-cog`
- **页面文件**: `system-logs.html`
- **功能描述**:
  - 系统操作日志查看
  - 错误日志分析
  - 用户行为追踪
  - 日志导出和备份

#### 5.6 系统配置 (System Settings)
- **菜单标题**: 系统配置
- **图标**: `fas fa-sliders-h`
- **页面文件**: `system-config.html`
- **功能描述**:
  - 系统参数配置
  - 功能模块开关
  - 业务规则设置
  - 系统性能优化

#### 5.7 下载中心 (Download Center)
- **菜单标题**: 下载中心
- **图标**: `fas fa-download`
- **页面文件**: `download-center.html`
- **功能描述**:
  - 文件下载管理
  - 下载历史记录
  - 文件生成状态
  - 批量下载功能

## 菜单配置代码结构

### JavaScript配置对象
```javascript
const menuConfig = {
    home: {
        title: '首页',
        icon: 'fas fa-home',
        href: 'index.html',
        type: 'single'
    },
    authCenter: {
        title: '授权中心',
        icon: 'fas fa-key',
        type: 'group',
        children: {
            community: {
                title: '小区管理',
                icon: 'fas fa-building',
                href: 'community-management.html'
            },
            authLevel: {
                title: '授权等级管理',
                icon: 'fas fa-layer-group',
                href: 'authorization-levels.html'
            }
        }
    },
    templateConfig: {
        title: '模板配置',
        icon: 'fas fa-file-alt',
        type: 'group',
        children: {
            processTemplate: {
                title: '流程模板',
                icon: 'fas fa-project-diagram',
                href: 'template-config.html'
            }
        }
    },
    aiCenter: {
        title: 'AI服务管理',
        icon: 'fas fa-robot',
        type: 'group',
        children: {
            aiPrompt: {
                title: '提示词管理',
                icon: 'fas fa-comment-dots',
                href: 'ai-prompt-management.html'
            },
            apiConfig: {
                title: 'API配置管理',
                icon: 'fas fa-cogs',
                href: 'api-configuration.html'
            }
        }
    },
    systemCenter: {
        title: '系统管理',
        icon: 'fas fa-cogs',
        type: 'group',
        children: {
            rolePermission: {
                title: '角色权限管理',
                icon: 'fas fa-shield-alt',
                href: 'role-permission-management.html'
            },
            user: {
                title: '用户账号管理',
                icon: 'fas fa-users',
                href: 'user-management.html'
            },
            departmentManagement: {
                title: '部门管理',
                icon: 'fas fa-sitemap',
                href: 'department-management.html'
            },
            dataDictionary: {
                title: '数据字典',
                icon: 'fas fa-book',
                href: 'data-dictionary.html'
            },
            systemConfig: {
                title: '系统日志管理',
                icon: 'fas fa-cog',
                href: 'system-logs.html'
            },
            systemSettings: {
                title: '系统配置',
                icon: 'fas fa-sliders-h',
                href: 'system-config.html'
            },
            downloadCenter: {
                title: '下载中心',
                icon: 'fas fa-download',
                href: 'download-center.html'
            }
        }
    }
};
```

## 菜单特性说明

### 1. 菜单类型
- **single**: 单级菜单，直接跳转到对应页面
- **group**: 多级菜单，包含子菜单项

### 2. 菜单状态
- **激活状态**: 当前页面对应的菜单项高亮显示
- **展开状态**: 包含当前页面的菜单组自动展开
- **悬浮状态**: 折叠模式下鼠标悬浮显示子菜单

### 3. 响应式设计
- **展开模式**: 宽度256px，显示完整菜单文字和图标
- **折叠模式**: 宽度80px，只显示图标和首字符
- **移动端**: 自动适配移动设备屏幕

### 4. 交互功能
- 菜单组展开/收起
- 当前页面自动高亮
- 点击子菜单后自动收起其他菜单组
- 侧边栏折叠/展开切换

## 页面文件列表

| 页面文件 | 菜单名称 | 功能说明 |
|---------|---------|---------|
| index.html | 首页 | 系统主页和数据概览 |
| community-management.html | 小区管理 | 小区信息和授权管理 |
| authorization-levels.html | 授权等级管理 | 权限等级配置 |
| template-config.html | 流程模板 | 审批流程模板管理 |
| ai-prompt-management.html | 提示词管理 | AI提示词管理 |
| api-configuration.html | API配置管理 | API接口配置 |
| role-permission-management.html | 角色权限管理 | 角色和权限管理 |
| user-management.html | 用户账号管理 | 用户账号管理 |
| department-management.html | 部门管理 | 部门组织管理 |
| data-dictionary.html | 数据字典 | 系统字典管理 |
| system-logs.html | 系统日志管理 | 系统日志查看 |
| system-config.html | 系统配置 | 系统参数配置 |
| download-center.html | 下载中心 | 文件下载管理 |

## 菜单维护说明

### 添加新菜单项
1. 在 `js/layout.js` 中的 `menuConfig` 对象添加配置
2. 创建对应的HTML页面文件
3. 确保页面文件正确引入layout组件

### 修改菜单结构
1. 直接修改 `menuConfig` 对象的配置
2. 调整菜单的层级关系和显示文字
3. 更新图标和页面链接

### 菜单权限控制
- 可以在菜单渲染时根据用户权限动态显示/隐藏菜单项
- 支持按角色配置可访问的菜单范围
- 结合角色权限管理功能实现精细化菜单控制

## 更新日志

### 2024-12-26
- 完成菜单结构文档化
- 记录所有当前菜单项和子菜单
- 添加菜单配置代码示例
- 完善菜单维护说明

---

*文档版本: 1.0*  
*最后更新: 2024-12-26*  
*维护人员: 系统管理员*
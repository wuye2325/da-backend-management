# 导航组件设计规范

## 📱 组件概述

导航组件是用户在应用中进行页面跳转和功能访问的核心组件，包括顶部导航和底部导航两个主要部分。

### 🎯 设计目标
- 提供清晰的页面导航结构
- 保持一致的用户体验
- 适配不同屏幕尺寸
- 支持角色相关的功能展示

## 🧩 组件详细设计

### 1. 顶部导航栏 (TopNavigation)

#### 1.1 基础结构
```
┌─────────────────────────────────────┐
│ [左侧] 页面标题/小区名称      [右侧] │
└─────────────────────────────────────┘
```

#### 1.2 不同页面的顶部导航设计

**首页导航**
```
┌─────────────────────────────────────┐
│ 🏠 阳光花园小区 - 发现        🔔(3) │
└─────────────────────────────────────┘
```
- 左侧：小区图标 + 小区名称 + 页面标题
- 右侧：消息通知按钮（显示未读数量）

**参与页导航**
```
┌─────────────────────────────────────┐
│ 🏠 阳光花园小区 - 参与        ❓    │
└─────────────────────────────────────┘
```
- 左侧：小区图标 + 小区名称 + 页面标题
- 右侧：帮助按钮（功能说明）

**个人中心导航**
```
┌─────────────────────────────────────┐
│ 👤 个人中心                  ⚙️    │
└─────────────────────────────────────┘
```
- 左侧：用户图标 + 页面标题
- 右侧：设置按钮

**详情页导航**
```
┌─────────────────────────────────────┐
│ ← 36梯停车棚改造项目           ⋯    │
└─────────────────────────────────────┘
```
- 左侧：返回按钮 + 事件标题（截断显示）
- 右侧：更多操作菜单

**搜索页导航**
```
┌─────────────────────────────────────┐
│ ← 🔍 [搜索事件、公告...]       ✕    │
└─────────────────────────────────────┘
```
- 左侧：返回按钮 + 搜索框
- 右侧：取消按钮

**消息页导航**
```
┌─────────────────────────────────────┐
│ ← 消息通知                   🗑️    │
└─────────────────────────────────────┘
```
- 左侧：返回按钮 + 页面标题
- 右侧：清空按钮

#### 1.3 技术实现

**组件接口设计**
```typescript
interface TopNavigationProps {
  // 导航类型
  type: 'home' | 'participate' | 'profile' | 'detail' | 'search' | 'messages';
  // 页面标题
  title?: string;
  // 是否显示返回按钮
  showBack?: boolean;
  // 返回按钮点击事件
  onBack?: () => void;
  // 右侧操作按钮配置
  rightActions?: {
    type: 'notification' | 'help' | 'settings' | 'more' | 'cancel' | 'delete';
    count?: number; // 通知数量
    onClick: () => void;
  }[];
  // 自定义样式
  className?: string;
}
```

**使用示例**
```tsx
// 首页导航
<TopNavigation 
  type="home"
  title="阳光花园小区 - 发现"
  rightActions={[
    {
      type: 'notification',
      count: 3,
      onClick: () => navigate('/messages')
    }
  ]}
/>

// 详情页导航
<TopNavigation 
  type="detail"
  title="36梯停车棚改造项目"
  showBack={true}
  onBack={() => navigate(-1)}
  rightActions={[
    {
      type: 'more',
      onClick: () => setShowMoreMenu(true)
    }
  ]}
/>
```

### 2. 底部导航栏 (BottomNavigation)

#### 2.1 新的导航结构
```
┌─────────────────────────────────────┐
│ [发现]    [参与]    [我的]          │
│  🏠       📋       👤              │
│ 首页      首页    个人中心         │
└─────────────────────────────────────┘
```

#### 2.2 导航项目设计

**发现 (首页)**
```
┌─────────┐
│   🏠    │
│  发现   │
│ (激活)  │
└─────────┘
```
- 图标：🏠 (房屋)
- 标题：发现
- 路由：`/`
- 功能：浏览小区事件和公告

**参与 (首页)**
```
┌─────────┐
│   📋    │
│  参与   │
│ (普通)  │
└─────────┘
```
- 图标：📋 (剪贴板)
- 标题：参与
- 路由：`/participate`
- 功能：业委会首页和流程管理

**我的 (个人中心)**
```
┌─────────┐
│   👤    │
│  我的   │
│ (普通)  │
└─────────┘
```
- 图标：👤 (用户)
- 标题：我的
- 路由：`/profile`
- 功能：个人信息和设置

#### 2.3 状态设计

**激活状态**
- 图标颜色：主题蓝 (#1890ff)
- 文字颜色：主题蓝 (#1890ff)
- 文字粗细：粗体
- 背景：可选的激活背景色

**普通状态**
- 图标颜色：中灰 (#8c8c8c)
- 文字颜色：中灰 (#8c8c8c)
- 文字粗细：常规
- 背景：透明

**悬停状态 (桌面端)**
- 图标颜色：深灰 (#595959)
- 文字颜色：深灰 (#595959)
- 背景：浅灰背景

#### 2.4 技术实现

**组件接口设计**
```typescript
interface BottomNavigationProps {
  // 当前激活的导航项
  activeTab: 'home' | 'participate' | 'profile';
  // 导航项点击事件
  onTabChange: (tab: string) => void;
  // 是否显示角色标识
  showRoleBadge?: boolean;
  // 自定义样式
  className?: string;
}

// 导航项配置
interface NavigationItem {
  key: string;
  icon: string;
  label: string;
  route: string;
  badge?: {
    count?: number;
    dot?: boolean;
  };
}
```

**导航项配置**
```typescript
const navigationItems: NavigationItem[] = [
  {
    key: 'home',
    icon: '🏠',
    label: '发现',
    route: '/'
  },
  {
    key: 'participate',
    icon: '📋',
    label: '参与',
    route: '/participate',
    badge: {
      count: 3 // 待办数量
    }
  },
  {
    key: 'profile',
    icon: '👤',
    label: '我的',
    route: '/profile'
  }
];
```

**使用示例**
```tsx
<BottomNavigation 
  activeTab={currentTab}
  onTabChange={(tab) => {
    setCurrentTab(tab);
    navigate(getRouteByTab(tab));
  }}
  showRoleBadge={true}
/>
```

### 3. 导航状态管理

#### 3.1 路由状态同步
```typescript
// 根据当前路由确定激活的导航项
const getActiveTabFromRoute = (pathname: string): string => {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/participate')) return 'participate';
  if (pathname.startsWith('/profile')) return 'profile';
  return 'home'; // 默认
};

// 根据导航项获取对应路由
const getRouteByTab = (tab: string): string => {
  const routes = {
    home: '/',
    participate: '/participate',
    profile: '/profile'
  };
  return routes[tab] || '/';
};
```

#### 3.2 角色相关的导航控制
```typescript
// 根据用户角色显示不同的导航项
const getNavigationItemsByRole = (userRole: string) => {
  const baseItems = [
    { key: 'home', icon: '🏠', label: '发现', route: '/' }
  ];
  
  if (userRole === 'committee') {
    baseItems.push({
      key: 'participate',
      icon: '📋',
      label: '参与',
      route: '/participate'
    });
  }
  
  baseItems.push({
    key: 'profile',
    icon: '👤',
    label: '我的',
    route: '/profile'
  });
  
  return baseItems;
};
```

## 📐 布局规范

### 顶部导航规范
- **高度**：44px (iOS标准) / 48px (Android标准)
- **内边距**：左右16px，上下8px
- **标题字体**：18px，粗体
- **按钮尺寸**：32px × 32px
- **图标尺寸**：20px × 20px

### 底部导航规范
- **高度**：60px + 安全区域
- **内边距**：上下8px
- **图标尺寸**：24px × 24px
- **文字字体**：12px
- **项目间距**：等分布局
- **最小点击区域**：44px × 44px

### 颜色规范
- **主题色**：#1890ff (蓝色)
- **激活色**：#1890ff (蓝色)
- **普通色**：#8c8c8c (中灰)
- **悬停色**：#595959 (深灰)
- **背景色**：#ffffff (白色)
- **边框色**：#e8e8e8 (浅灰)

## 🔄 交互设计

### 导航切换动画
- **页面切换**：滑动动画 (300ms)
- **标签切换**：颜色渐变 (200ms)
- **图标变化**：缩放动画 (150ms)

### 反馈效果
- **点击反馈**：轻微缩放 (scale: 0.95)
- **加载状态**：显示加载指示器
- **错误状态**：红色边框提示

### 手势支持
- **左右滑动**：在主要页面间切换
- **长按**：显示快捷操作菜单
- **双击**：返回页面顶部

## 📱 响应式设计

### 移动端 (< 768px)
- 使用标准的移动端导航布局
- 底部导航固定在屏幕底部
- 考虑安全区域适配

### 平板端 (768px - 1024px)
- 可选的侧边导航布局
- 顶部导航可显示更多信息
- 支持横屏模式优化

### 桌面端 (> 1024px)
- 侧边导航栏 (可选)
- 鼠标悬停效果
- 键盘快捷键支持
- 面包屑导航 (可选)

## 🎨 视觉效果

### 动画效果
- **页面进入**：从右侧滑入
- **页面退出**：向右侧滑出
- **标签切换**：平滑的颜色过渡
- **徽章动画**：数字跳动效果

### 状态指示
- **加载状态**：顶部进度条
- **网络状态**：连接状态指示
- **同步状态**：数据同步指示器

## 🔧 技术实现要点

### 组件文件结构
```
src/components/
├── TopNavigation.tsx
├── BottomNavigation.tsx
├── NavigationItem.tsx
└── navigation/
    ├── types.ts
    ├── constants.ts
    └── utils.ts
```

### 性能优化
- **组件缓存**：避免不必要的重渲染
- **图标优化**：使用SVG图标或图标字体
- **动画优化**：使用CSS3硬件加速
- **懒加载**：非关键导航项延迟加载

### 可访问性
- **语义化标签**：使用正确的HTML标签
- **键盘导航**：支持Tab键导航
- **屏幕阅读器**：提供合适的aria标签
- **对比度**：确保足够的颜色对比度

---

*此设计文档将在开发过程中持续更新和完善*
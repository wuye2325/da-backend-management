# 新 BottomNavigation 组件设计

## 组件结构

新的 BottomNavigation 组件将使用 antd-mobile 的 TabBar 组件，包含三个导航项：

1. 首页 (发现)
2. 参与
3. 我的

## 组件实现方案

### 1. 导入依赖

```tsx
import React, { useState } from 'react';
import { TabBar } from 'antd-mobile';
import { useLocation, useNavigate } from 'react-router-dom';
```

### 2. 自定义图标组件

使用之前设计的 SVG 图标组件：

```tsx
import { HomeIcon, PortfolioIcon, ProfileIcon } from './CustomIcons';
```

### 3. 组件实现

```tsx
const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 根据当前路径确定激活的 Tab
  const getActiveKey = () => {
    if (location.pathname === '/') {
      return 'home';
    } else if (location.pathname.startsWith('/participate')) {
      return 'participate';
    } else if (location.pathname.startsWith('/profile')) {
      return 'profile';
    }
    return 'home'; // 默认激活首页
  };
  
  const [activeKey, setActiveKey] = useState(getActiveKey());
  
  // 监听路由变化，更新激活的 Tab
  React.useEffect(() => {
    setActiveKey(getActiveKey());
  }, [location]);
  
  // 处理 Tab 切换
  const handleTabChange = (key: string) => {
    setActiveKey(key);
    switch (key) {
      case 'home':
        navigate('/');
        break;
      case 'participate':
        navigate('/participate');
        break;
      case 'profile':
        navigate('/profile');
        break;
      default:
        navigate('/');
    }
  };
  
  return (
    <TabBar activeKey={activeKey} onChange={handleTabChange}>
      <TabBar.Item 
        key="home" 
        title="发现" 
        icon={<HomeIcon active={activeKey === 'home'} />} 
      />
      <TabBar.Item 
        key="participate" 
        title="参与" 
        icon={<PortfolioIcon active={activeKey === 'participate'} />} 
      />
      <TabBar.Item 
        key="profile" 
        title="我的" 
        icon={<ProfileIcon active={activeKey === 'profile'} />} 
      />
    </TabBar>
  );
};

export default BottomNavigation;
```

## 样式调整

由于 antd-mobile 的 TabBar 已经有默认样式，我们只需要确保它固定在页面底部：

```css
/* 在全局样式或组件样式中添加 */
.am-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
```

## 与现有组件的集成

新组件将替换原有的复杂样式，提供更简洁的导航体验。组件将：

1. 使用 antd-mobile 的主题系统，自动适配浅色/深色主题
2. 通过 React Router 实现页面导航
3. 保持与原有路由配置的兼容性

## 路由配置检查

需要确保以下路由路径存在：
- `/` (首页)
- `/participate` (参与页面)
- `/profile` (个人页面)

## 移除旧组件样式

在替换组件后，需要移除旧的复杂样式代码，包括：
- 毛玻璃效果相关样式
- 渐变背景相关样式
- 复杂的图标动画效果
- 自定义的导航项结构
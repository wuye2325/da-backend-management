# BottomNavigation 重新设计实现计划

## 概述

本文档详细描述了如何将现有的复杂 BottomNavigation 组件替换为基于 antd-mobile TabBar 的简化版本，并使用自定义 SVG 图标。

## 实现步骤

### 1. 创建自定义 SVG 图标组件

文件路径: `src/components/icons/CustomIcons.tsx`

实现三个图标组件:
- HomeIcon (首页图标)
- PortfolioIcon (参与图标)
- ProfileIcon (我的图标)

每个图标组件支持激活和非激活状态，并能适配主题颜色。

### 2. 重新实现 BottomNavigation 组件

文件路径: `src/components/BottomNavigation.tsx`

使用 antd-mobile 的 TabBar 组件替换原有实现:
- 使用自定义 SVG 图标
- 简化样式，移除毛玻璃效果和复杂动画
- 保持路由导航功能

### 3. 集成和测试

- 确保新组件在所有页面中正确显示
- 验证导航功能正常工作
- 检查主题适配效果

## 文件结构

```
src/
├── components/
│   ├── BottomNavigation.tsx (修改)
│   └── icons/
│       └── CustomIcons.tsx (新增)
```

## 组件详细设计

### CustomIcons.tsx

```tsx
import React from 'react';

// HomeIcon 组件
export const HomeIcon: React.FC<{ active: boolean }> = ({ active }) => {
  // SVG 实现
};

// PortfolioIcon 组件
export const PortfolioIcon: React.FC<{ active: boolean }> = ({ active }) => {
  // SVG 实现
};

// ProfileIcon 组件
export const ProfileIcon: React.FC<{ active: boolean }> = ({ active }) => {
  // SVG 实现
};
```

### BottomNavigation.tsx

```tsx
import React from 'react';
import { TabBar } from 'antd-mobile';
import { useLocation, useNavigate } from 'react-router-dom';
import { HomeIcon, PortfolioIcon, ProfileIcon } from './icons/CustomIcons';

const BottomNavigation: React.FC = () => {
  // 实现逻辑
};

export default BottomNavigation;
```

## 样式调整

移除以下旧样式类:
- 毛玻璃背景相关样式
- 渐变背景相关样式
- 图标动画效果相关样式
- 自定义按钮样式

## 测试计划

1. 首页导航测试
   - 点击"发现" Tab 应该导航到 "/"
   - 激活状态图标应正确显示

2. 参与页面导航测试
   - 点击"参与" Tab 应该导航到 "/participate"
   - 激活状态图标应正确显示

3. 个人页面导航测试
   - 点击"我的" Tab 应该导航到 "/profile"
   - 激活状态图标应正确显示

4. 主题适配测试
   - 在浅色主题下图标应正确显示
   - 在深色主题下图标应正确显示

5. 响应式测试
   - 在不同屏幕尺寸下组件应正常显示
   - 组件应固定在页面底部

## 风险和缓解措施

### 风险 1: 图标显示不正确
缓解措施: 
- 仔细检查 SVG 路径数据
- 确保颜色值正确应用

### 风险 2: 路由导航不工作
缓解措施:
- 验证路由配置
- 检查 useNavigate hook 使用

### 风险 3: 主题适配问题
缓解措施:
- 使用 antd-mobile 主题变量
- 测试不同主题下的显示效果
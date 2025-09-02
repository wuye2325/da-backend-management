# Ant Design Mobile 验证文档

## 项目依赖验证

项目已安装 `antd-mobile` 版本 5.39.0。

## TabBar 组件使用说明

根据 antd-mobile 官方文档，TabBar 组件的基本用法如下：

```jsx
import { TabBar } from 'antd-mobile'
import { AppOutline, MessageOutline, UserOutline } from 'antd-mobile-icons'

export default () => {
  const [activeKey, setActiveKey] = useState('home')
  
  return (
    <TabBar activeKey={activeKey} onChange={setActiveKey}>
      <TabBar.Item key='home' title='首页' icon={<AppOutline />} />
      <TabBar.Item key='todo' title='待办' icon={<MessageOutline />} />
      <TabBar.Item key='user' title='我的' icon={<UserOutline />} />
    </TabBar>
  )
}
```

## 自定义图标使用说明

TabBar 组件支持使用自定义图标，可以通过 `icon` 属性传入 React 组件。

对于激活状态和非激活状态的不同图标，可以通过判断 `active` 属性来实现：

```jsx
const HomeIcon = (props: { active: boolean }) => {
  if (props.active) {
    return <HomeFilledIcon />
  }
  return <HomeOutlineIcon />
}

// 在 TabBar.Item 中使用
<TabBar.Item key='home' title='首页' icon={active => <HomeIcon active={active} />} />
```

## 实现计划

1. 创建自定义 SVG 图标组件
2. 使用 antd-mobile 的 TabBar 重新实现 BottomNavigation 组件
3. 确保路由导航功能正常工作
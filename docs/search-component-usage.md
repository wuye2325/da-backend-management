# 搜索组件使用说明

## 概述

`SearchComponent` 是一个可复用的搜索组件，包含搜索输入框、搜索按钮和重置按钮。组件采用现代化的UI设计，支持自定义配置和事件处理。

## 文件位置

- 组件文件：`js/search-component.js`
- 使用示例：`community-management.html`

## 基本用法

### 1. 引入组件文件

```html
<script src="js/search-component.js"></script>
```

### 2. 准备HTML容器

```html
<div id="my-search-container"></div>
```

### 3. 初始化组件

```javascript
// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    const searchComponent = new SearchComponent({
        containerId: 'my-search-container',
        placeholder: '请输入搜索关键词',
        onSearch: function(searchValue) {
            console.log('搜索:', searchValue);
            // 添加你的搜索逻辑
        },
        onReset: function() {
            console.log('重置搜索');
            // 添加你的重置逻辑
        }
    });
});
```

## 配置选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `containerId` | string | 必填 | 容器元素的ID |
| `placeholder` | string | '请输入搜索关键词' | 输入框占位符文本 |
| `onSearch` | function | 默认函数 | 搜索回调函数，参数为搜索值 |
| `onReset` | function | 默认函数 | 重置回调函数 |
| `label` | string | '搜索' | 标签文本 |
| `showLabel` | boolean | true | 是否显示标签 |

## 方法说明

### getValue()
获取当前搜索输入框的值

```javascript
const currentValue = searchComponent.getValue();
```

### setValue(value)
设置搜索输入框的值

```javascript
searchComponent.setValue('新的搜索值');
```

### clear()
清空搜索输入框

```javascript
searchComponent.clear();
```

### focus()
聚焦到搜索输入框

```javascript
searchComponent.focus();
```

### destroy()
销毁组件，清理DOM和事件

```javascript
searchComponent.destroy();
```

## 使用示例

### 示例1：基础用法

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="js/search-component.js"></script>
</head>
<body>
    <div class="p-4">
        <div id="basic-search"></div>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            new SearchComponent({
                containerId: 'basic-search',
                placeholder: '搜索用户...',
                onSearch: function(value) {
                    alert('搜索: ' + value);
                },
                onReset: function() {
                    alert('已重置');
                }
            });
        });
    </script>
</body>
</html>
```

### 示例2：不显示标签

```javascript
new SearchComponent({
    containerId: 'no-label-search',
    placeholder: '输入关键词...',
    showLabel: false,
    onSearch: function(value) {
        // 搜索逻辑
    }
});
```

### 示例3：自定义标签

```javascript
new SearchComponent({
    containerId: 'custom-label-search',
    placeholder: '搜索产品...',
    label: '产品搜索',
    onSearch: function(value) {
        // 产品搜索逻辑
    }
});
```

### 示例4：与表格数据联动

```javascript
let tableData = [
    { name: '张三', email: 'zhang@example.com' },
    { name: '李四', email: 'li@example.com' }
];

let filteredData = [...tableData];

new SearchComponent({
    containerId: 'table-search',
    placeholder: '搜索姓名或邮箱...',
    onSearch: function(value) {
        if (value) {
            filteredData = tableData.filter(item => 
                item.name.includes(value) || item.email.includes(value)
            );
        } else {
            filteredData = [...tableData];
        }
        renderTable(filteredData);
    },
    onReset: function() {
        filteredData = [...tableData];
        renderTable(filteredData);
    }
});

function renderTable(data) {
    // 渲染表格逻辑
    console.log('渲染表格:', data);
}
```

## 样式说明

组件使用 Tailwind CSS 进行样式设计，包含以下特性：

- 响应式设计
- 现代化的圆角边框
- 悬停和聚焦状态效果
- 无缝连接的搜索框和按钮
- 一致的颜色主题（blue色系）

## 依赖要求

- Tailwind CSS（用于样式）
- Font Awesome（用于图标）
- 现代浏览器（支持ES6+）

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 注意事项

1. 确保在组件初始化前，DOM已经加载完成
2. 容器元素必须存在，否则组件初始化会失败
3. 组件会自动处理回车键搜索功能
4. 如需在单页应用中使用，记得在页面切换时调用 `destroy()` 方法
5. 组件支持多种模块系统（CommonJS、AMD、全局变量）

## 更新日志

### v1.0.0
- 初始版本发布
- 支持基础搜索和重置功能
- 提供完整的API接口
- 支持自定义配置选项
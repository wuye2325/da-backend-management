/**
 * 批量更新工具 - 用于将现有页面转换为组件化结构
 * 这个脚本可以帮助快速更新多个页面，移除重复的侧边栏和导航代码
 */

// 需要更新的页面列表
const pagesToUpdate = [
    'community.html',
    'role-permission.html', 
    'config.html',
    'logs.html',
    'ai-management.html',
    'auth-level.html',
    'template-process.html',
    'template-survey.html',
    'user.html'
];

// 页面配置映射 - 定义每个页面的标题和面包屑
const pageConfigs = {
    'community.html': {
        title: '小区管理',
        breadcrumbs: ['授权中心页面', '小区管理']
    },
    'auth-level.html': {
        title: '授权等级管理',
        breadcrumbs: ['授权中心页面', '授权等级管理']
    },
    'template-process.html': {
        title: '流程模板管理',
        breadcrumbs: ['模板管理页面', '流程模板管理']
    },
    'template-survey.html': {
        title: '问卷模板管理',
        breadcrumbs: ['模板管理页面', '问卷模板管理']
    },
    'ai-management.html': {
        title: '提示词管理',
        breadcrumbs: ['AI服务管理页面', '提示词管理']
    },
    'config.html': {
        title: 'API配置管理',
        breadcrumbs: ['AI服务管理页面', 'API配置管理']
    },
    'role-permission.html': {
        title: '角色权限管理',
        breadcrumbs: ['系统管理页面', '角色权限管理']
    },
    'user.html': {
        title: '用户账号管理',
        breadcrumbs: ['系统管理页面', '用户账号管理']
    },
    'logs.html': {
        title: '系统配置管理',
        breadcrumbs: ['系统管理页面', '系统配置管理']
    }
};

/**
 * 生成更新后的HTML头部
 */
function generateUpdatedHead(originalTitle) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${originalTitle}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="components/sidebar.js"></script>
    <script src="components/top-navigation.js"></script>
    <script src="components/layout.js"></script>
</head>
<body class="bg-gray-100">
    <!-- 侧边栏容器 -->
    <div id="sidebar-container"></div>

    <!-- 主内容区域 -->
    <div id="main-content" class="ml-64 transition-all duration-300">
        <!-- 顶部导航栏容器 -->
        <div id="top-navigation-container"></div>`;
}

/**
 * 生成更新后的JavaScript初始化代码
 */
function generateUpdatedScript(pageConfig) {
    return `    <script>
        // 初始化页面
        document.addEventListener('DOMContentLoaded', function() {
            initPage('${pageConfig.title}', ${JSON.stringify(pageConfig.breadcrumbs)});
        });

        // 页面特定的功能可以在这里添加
    </script>`;
}

console.log('批量更新工具已准备就绪');
console.log('需要更新的页面:', pagesToUpdate);
console.log('页面配置:', pageConfigs);
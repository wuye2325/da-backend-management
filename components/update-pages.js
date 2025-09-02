// 批量更新页面脚本
const fs = require('fs');
const path = require('path');

// 需要更新的页面配置
const pageConfigs = {
    'community.html': {
        title: '小区管理',
        breadcrumbs: ['首页', '授权中心页面', '小区管理']
    },
    'auth-level.html': {
        title: '授权等级管理',
        breadcrumbs: ['首页', '授权中心页面', '授权等级管理']
    },
    'process-template.html': {
        title: '流程模板管理',
        breadcrumbs: ['首页', '模板管理页面', '流程模板管理']
    },
    'survey-template.html': {
        title: '问卷模板管理',
        breadcrumbs: ['首页', '模板管理页面', '问卷模板管理']
    },
    'ai-management.html': {
        title: '提示词管理',
        breadcrumbs: ['首页', 'AI服务管理页面', '提示词管理']
    },
    'config.html': {
        title: 'API配置管理',
        breadcrumbs: ['首页', 'AI服务管理页面', 'API配置管理']
    },
    'role-permission.html': {
        title: '角色权限管理',
        breadcrumbs: ['首页', '系统管理页面', '角色权限管理']
    },
    'user.html': {
        title: '用户账号管理',
        breadcrumbs: ['首页', '系统管理页面', '用户账号管理']
    },
    'logs.html': {
        title: '系统配置管理',
        breadcrumbs: ['首页', '系统管理页面', '系统配置管理']
    }
};

// 生成新的head部分
function generateHead(title) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - 大家共治后台管理系统</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <script src="components/sidebar.js"></script>
    <script src="components/top-navigation.js"></script>
    <script src="components/layout.js"></script>
</head>
<body class="bg-gray-100">
    <!-- 侧边栏容器 -->
    <div id="sidebar-container"></div>
    
    <!-- 顶部导航容器 -->
    <div id="top-navigation-container"></div>
    
    <!-- 主内容区域 -->
    <div id="main-content" class="ml-64 transition-all duration-300">`;
}

// 生成新的JavaScript初始化代码
function generateJavaScript(title, breadcrumbs) {
    return `    <script>
        // 初始化页面
        document.addEventListener('DOMContentLoaded', function() {
            initPage('${title}', ${JSON.stringify(breadcrumbs)});
        });
    </script>`;
}

// 处理单个文件
function processFile(filename) {
    const config = pageConfigs[filename];
    if (!config) return;

    const filePath = path.join(__dirname, '..', filename);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 查找并替换head部分（从<!DOCTYPE到<body>开始）
        const headRegex = /<!DOCTYPE html>[\s\S]*?<body[^>]*>/;
        const newHead = generateHead(config.title);
        content = content.replace(headRegex, newHead);
        
        // 查找并替换侧边栏部分
        const sidebarRegex = /<div id="sidebar"[\s\S]*?<\/div>\s*(?=<!--.*?Main Content|<div class="ml-64")/;
        content = content.replace(sidebarRegex, '');
        
        // 查找并替换顶部导航部分
        const headerRegex = /<header[\s\S]*?<\/header>/;
        content = content.replace(headerRegex, '');
        
        // 查找并替换JavaScript部分
        const jsRegex = /<script>[\s\S]*?<\/script>(?=\s*<\/body>)/;
        const newJS = generateJavaScript(config.title, config.breadcrumbs);
        content = content.replace(jsRegex, newJS);
        
        // 写回文件
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`已更新: ${filename}`);
        
    } catch (error) {
        console.error(`更新 ${filename} 时出错:`, error.message);
    }
}

// 批量处理所有文件
function updateAllPages() {
    console.log('开始批量更新页面...');
    
    Object.keys(pageConfigs).forEach(filename => {
        processFile(filename);
    });
    
    console.log('批量更新完成！');
}

// 如果直接运行此脚本
if (require.main === module) {
    updateAllPages();
}

module.exports = { updateAllPages, processFile };
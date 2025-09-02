/**
 * 布局组件
 * 整合侧边栏和顶部导航，提供统一的页面布局
 */

// 页面初始化函数
function initPage(currentPage = '') {
    // 在最开始就预设布局样式，避免后续重新布局
    presetLayoutStyles();
    
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            loadComponents(currentPage);
        });
    } else {
        loadComponents(currentPage);
    }
}

// 加载组件
function loadComponents(currentPage) {
    // 为body添加布局初始化标记
    document.body.classList.add('layout-initialized');
    
    // 不再为主内容区域添加加载动画类，让内容直接显示
    
    // 初始化侧边栏
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer && typeof createSidebar === 'function') {
        const sidebar = createSidebar(currentPage);
        sidebarContainer.innerHTML = sidebar.render();
    }

    // 初始化顶部导航
    const topNavContainer = document.getElementById('top-navigation-container');
    if (topNavContainer) {
        // 使用layout.js中的renderTopNavigation函数
        topNavContainer.innerHTML = renderTopNavigation();
        
        // 添加固定导航栏的CSS类
        const header = topNavContainer.querySelector('header');
        if (header) {
            header.classList.add('top-navigation-fixed');
        }
    }

    // 初始化全局页签系统
    if (typeof initGlobalTabSystem === 'function') {
        initGlobalTabSystem();
    }

    // 设置页面样式
    addLayoutStyles();
    
    // 绑定用户下拉菜单事件
    bindUserDropdownEvents();
    
    // 初始化侧边栏状态监听
    initSidebarStateListener();
    
    // 不再启动动画，内容直接显示
}

// 绑定用户下拉菜单事件
function bindUserDropdownEvents() {
    const userMenuButton = document.getElementById('userMenuButton');
    const userDropdownMenu = document.getElementById('userDropdownMenu');
    
    if (userMenuButton && userDropdownMenu) {
        // 点击用户菜单按钮切换下拉菜单显示状态
        userMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdownMenu.classList.toggle('hidden');
        });
        
        // 点击页面其他地方关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!userMenuButton.contains(e.target) && !userDropdownMenu.contains(e.target)) {
                userDropdownMenu.classList.add('hidden');
            }
        });
    }
}

// 切换子菜单展开/收起
function toggleSubmenu(menuId) {
    const menu = document.getElementById(`${menuId}-menu`);
    const icon = document.getElementById(`${menuId}-icon`);
    
    if (menu && icon) {
        const isCurrentlyHidden = menu.classList.contains('hidden');
        
        if (isCurrentlyHidden) {
            // 先收起所有其他菜单
            collapseAllMenus();
            // 再展开当前菜单
            menu.classList.remove('hidden');
            icon.style.transform = 'rotate(90deg)';
        } else {
            // 收起当前菜单
            menu.classList.add('hidden');
            icon.style.transform = 'rotate(0deg)';
        }
    }
}

// 收起所有菜单
function collapseAllMenus() {
    const menuConfig = {
        basicData: '基本资料管理',
        publishManagement: '内容发布',
        processManagement: '流程发起',
        systemManagement: '系统管理'
    };
    
    Object.keys(menuConfig).forEach(key => {
        const menu = document.getElementById(`${key}-menu`);
        const icon = document.getElementById(`${key}-icon`);
        
        if (menu && icon) {
            menu.classList.add('hidden');
            icon.style.transform = 'rotate(0deg)';
        }
    });
}

// 将toggleSubmenu函数暴露到全局作用域
window.toggleSubmenu = toggleSubmenu;

// 获取当前页面名称
function getCurrentPageFromUrl() {
    const currentPath = window.location.pathname;
    const fileName = currentPath.split('/').pop() || 'workspace-refactored.html';
    return fileName.replace('.html', '');
}

// 绑定悬浮事件
function bindHoverEvents() {
    const menuItems = document.querySelectorAll('.sidebar-menu-item');
    
    menuItems.forEach(item => {
        const submenu = item.querySelector('.submenu-data');
        if (submenu) {
            item.addEventListener('mouseenter', function(e) {
                showSubmenuTooltip(e.currentTarget, submenu.innerHTML);
            });
            
            item.addEventListener('mouseleave', function() {
                hideSubmenuTooltip();
            });
        }
    });
}

// 显示子菜单浮窗
function showSubmenuTooltip(element, submenuHtml) {
    // 移除现有的浮窗
    hideSubmenuTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.id = 'submenu-tooltip';
    tooltip.className = 'fixed bg-white shadow-lg rounded-lg border border-gray-200 z-50 py-2 min-w-48';
    tooltip.innerHTML = submenuHtml;
    
    document.body.appendChild(tooltip);
    
    // 计算位置
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left = rect.right + 8;
    let top = rect.top;
    
    // 确保浮窗不超出屏幕
    if (left + tooltipRect.width > window.innerWidth) {
        left = rect.left - tooltipRect.width - 8;
    }
    
    if (top + tooltipRect.height > window.innerHeight) {
        top = window.innerHeight - tooltipRect.height - 8;
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

// 隐藏子菜单浮窗
function hideSubmenuTooltip() {
    const tooltip = document.getElementById('submenu-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// 预设布局样式（在页面加载最开始就应用）
function presetLayoutStyles() {
    if (document.getElementById('preset-layout-styles')) return;

    const presetStyles = `
        <style id="preset-layout-styles">
            /* 全局布局样式 - 在页面加载最开始就应用，优先级最高 */
            body {
                margin: 0;
                padding: 0;
                overflow: hidden;
            }
            
            /* 预设主内容区域的布局，避免后续突变，优先级高于Tailwind */
            .flex.h-screen > div:last-child,
            .flex-1.flex.flex-col,
            .layout-main-content {
                margin-left: 256px !important; /* 使用!important确保优先级高于Tailwind */
                padding-top: 80px !important; /* 预设顶部导航栏高度 */
                transition: margin-left 0.3s ease;
            }
            
            /* 主内容区域的滚动设置，不设置固定高度，让flex-1自然工作 */
            #main-content {
                /* 只设置overflow，不设置height，让flex-1类控制高度 */
                /* overflow-y: auto; 这个交给HTML中的overflow-y-auto类处理 */
            }
            
            /* 页面内容默认可见，不隐藏 */
            .page-loading {
                opacity: 1 !important;
            }
            
            /* 移动端响应式 */
            @media (max-width: 768px) {
                .flex.h-screen > div:last-child,
                .flex-1.flex.flex-col,
                .layout-main-content {
                    margin-left: 0 !important;
                    padding-top: 60px !important;
                }
                
                /* 移动端也不设置固定高度，让flex-1自然工作 */
                #main-content {
                    /* height: calc(100vh - 60px) !important; 移除固定高度 */
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', presetStyles);
}

// 立即执行预设布局样式，不等待DOM加载完成
if (document.readyState === 'loading') {
    // 如果文档还在加载中，立即应用样式
    presetLayoutStyles();
} else {
    // 如果文档已经加载完成，也要应用样式
    presetLayoutStyles();
}

// 添加布局样式
function addLayoutStyles() {
    if (document.getElementById('layout-styles')) return;

    const styles = `
        <style id="layout-styles">
            .sidebar-transition {
                transition: all 0.3s ease;
            }
            
            /* body级别布局标记 */
            body.layout-initialized {
                /* 基本布局已在presetLayoutStyles中设置 */
            }
            
            body.layout-initialized .flex.h-screen {
                height: 100vh;
            }
            
            /* 侧边栏折叠时主内容区域的边距 */
            .sidebar-collapsed + .layout-main-content,
            .sidebar-collapsed ~ * .flex-1.flex.flex-col,
            .sidebar-collapsed ~ .flex.h-screen > div:last-child {
                margin-left: 80px; /* 侧边栏折叠时的宽度 */
            }
            
            /* 顶部导航栏样式 */
            .top-navigation-fixed {
                position: fixed;
                top: 0;
                right: 0;
                z-index: 30;
                background: white;
                left: 256px;
                transition: left 0.3s ease;
            }
            
            /* 侧边栏折叠时顶部导航栏的位置 */
            .sidebar-collapsed ~ * .top-navigation-fixed {
                left: 80px;
            }
            
            /* 侧边栏折叠状态样式 */
            .sidebar-collapsed {
                width: 80px !important;
                min-width: 80px !important;
                max-width: 80px !important;
            }
            
            .sidebar-collapsed .sidebar-menu-item {
                position: relative;
            }
            
            /* 浮窗菜单样式 */
            #submenu-tooltip {
                animation: fadeIn 0.2s ease-in-out;
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateX(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            /* 响应式设计 */
            @media (max-width: 768px) {
                .top-navigation-fixed {
                    left: 0 !important; /* 移动端顶部导航栏占满屏幕 */
                }
                
                /* 移动端侧边栏默认隐藏 */
                .sidebar-container {
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                }
                
                .sidebar-container.mobile-open {
                    transform: translateX(0);
                }
                
                /* 移动端不显示折叠状态 */
                .sidebar-collapsed {
                    width: 256px !important;
                }
            }
            
            /* 滚动条样式 */
            .overflow-y-auto::-webkit-scrollbar {
                width: 6px;
            }
            
            .overflow-y-auto::-webkit-scrollbar-track {
                background: #f8f9fa;
                border-radius: 3px;
            }
            
            .overflow-y-auto::-webkit-scrollbar-thumb {
                background: #dee2e6;
                border-radius: 3px;
                transition: background-color 0.2s ease;
            }
            
            .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                background: #adb5bd;
            }
            
            /* 为侧边栏导航区域添加特定样式 */
            .sidebar-nav::-webkit-scrollbar {
                width: 4px;
            }
            
            .sidebar-nav::-webkit-scrollbar-track {
                background: transparent;
            }
            
            .sidebar-nav::-webkit-scrollbar-thumb {
                background: rgba(156, 163, 175, 0.5);
                border-radius: 2px;
            }
            
            .sidebar-nav::-webkit-scrollbar-thumb:hover {
                background: rgba(107, 114, 128, 0.7);
            }
            
            /* 验证样式：内容直接可见 */
            .content-item {
                opacity: 1;
            }
            
            .content-item.animate-in {
                opacity: 1;
            }
            
            /* 骨架屏加载效果 */
            .skeleton-loader {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: skeleton-loading 1.5s infinite;
            }
            
            @keyframes skeleton-loading {
                0% {
                    background-position: 200% 0;
                }
                100% {
                    background-position: -200% 0;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// 侧边栏渲染函数
function renderSidebar(currentPage = '') {
    const isCollapsed = document.getElementById('sidebar-container')?.classList.contains('sidebar-collapsed');
    
    const menuConfig = {
        home: {
            title: '首页',
            icon: 'fas fa-home',
            href: 'home-dashboard.html',
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
                propertyManagement: {
                    title: '物业公司管理',
                    icon: 'fas fa-building',
                    href: 'property-management.html'
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

    // 检查菜单项是否激活
    function isActiveMenuItem(href) {
        if (!href) return false;
        const currentPath = window.location.pathname;
        const fileName = currentPath.split('/').pop() || 'home-dashboard.html';
        return fileName === href || currentPage === href.replace('.html', '');
    }

    // 渲染单个菜单项
    function renderSingleMenuItem(key, config) {
        const isActive = isActiveMenuItem(config.href);
        
        if (isCollapsed) {
            // 折叠状态：只显示文字
            const activeClass = isActive ? 'text-[#165DFF] bg-blue-50' : 'text-gray-700 hover:bg-gray-100';
            return `
                <div class="sidebar-menu-item flex items-center justify-center w-12 h-12 ${activeClass} rounded-lg mb-2 mx-auto cursor-pointer" title="${config.title}" onclick="closeAllMenuGroups(); handleMenuClick('${config.href}', '${config.title}'); return false;">
                    <span class="text-xs">${config.title.charAt(0)}</span>
                </div>
            `;
        } else {
            // 展开状态：只显示文字
            const activeClass = isActive ? 'text-[#165DFF] bg-blue-50' : 'text-gray-700 hover:bg-gray-100';
            return `
                <div class="flex items-center px-4 py-3 ${activeClass} rounded-lg mb-2 cursor-pointer" onclick="closeAllMenuGroups(); handleMenuClick('${config.href}', '${config.title}'); return false;">
                    <span>${config.title}</span>
                </div>
            `;
        }
    }

    // 渲染子菜单项
    function renderChildMenuItems(children, groupId = null) {
        let html = '';
        
        Object.entries(children).forEach(([key, config]) => {
            const isActive = isActiveMenuItem(config.href);
            const activeClass = isActive ? 'text-[#165DFF] bg-blue-50' : 'text-gray-600 hover:bg-gray-100';
            
            // 使用handleMenuClick函数调用页签系统
            html += `
                <div class="flex items-center px-4 py-2 ${activeClass} rounded-lg mb-1 cursor-pointer" onclick="handleMenuClick('${config.href}', '${config.title}'); return false;">
                    <span class="text-sm">${config.title}</span>
                </div>
            `;
        });

        return html;
    }

    // 检查菜单组是否包含当前页面
    function isGroupContainsCurrentPage(children, currentPage) {
        if (!currentPage) return false;
        return Object.values(children).some(child => {
            if (child.href) {
                const pageName = child.href.replace('.html', '');
                return currentPage === pageName || currentPage.includes(pageName);
            }
            return false;
        });
    }

    // 检查分组是否有活动的子项
    function hasActiveChild(children) {
        return Object.values(children).some(child => isActiveMenuItem(child.href));
    }

    // 渲染分组菜单项
    function renderGroupMenuItem(key, config) {
        if (isCollapsed) {
            // 折叠状态：只显示文字，子菜单数据存储在隐藏元素中
            const submenuHtml = renderChildMenuItems(config.children);
            return `
                <div class="sidebar-menu-item flex items-center justify-center w-12 h-12 text-gray-700 hover:bg-gray-100 rounded-lg mb-2 mx-auto cursor-pointer" title="${config.title}">
                    <span class="text-xs">${config.title.charAt(0)}</span>
                    <div class="submenu-data hidden">${submenuHtml}</div>
                </div>
            `;
        } else {
            // 展开状态：显示完整的分组菜单
            const groupId = `group-${key}`;
            const isCurrentGroup = isGroupContainsCurrentPage(config.children, currentPage);
            const displayStyle = isCurrentGroup ? 'display: block;' : 'display: none;';
            const iconClass = isCurrentGroup ? 'fa-chevron-down' : 'fa-chevron-right';
            
            return `
                <div class="mb-4">
                    <div class="flex items-center px-4 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onclick="toggleSubmenuGroup('${groupId}')">
                        <span>${config.title}</span>
                        <i class="fas ${iconClass} ml-auto transition-transform duration-200" id="${groupId}-icon"></i>
                    </div>
                    <div class="ml-6" id="${groupId}" style="${displayStyle}">
                        ${renderChildMenuItems(config.children, groupId)}
                    </div>
                </div>
            `;
        }
    }

    // 渲染菜单项
    function renderMenuItems() {
        let html = '';
        
        Object.entries(menuConfig).forEach(([key, config]) => {
            if (config.type === 'single') {
                html += renderSingleMenuItem(key, config);
            } else if (config.type === 'group') {
                html += renderGroupMenuItem(key, config);
            }
        });

        return html;
    }

    // 渲染logo区域
    function renderLogo() {
        if (isCollapsed) {
            return `
                <div class="p-4 flex justify-center">
                    <div class="text-center">
                        <img src="Logomark-1.png" alt="大家共治Logo" class="w-8 h-8 mx-auto mb-1 object-contain">
                        <div class="text-xs text-gray-500">后台管理系统</div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="p-6">
                    <div class="flex items-center">
                        <img src="Logomark-1.png" alt="大家共治Logo" class="w-10 h-10 mr-3 object-contain">
                        <div>
                            <h1 class="text-xl font-bold text-gray-800">大家共治</h1>
                            <p class="text-sm text-gray-500">后台管理系统</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';
    
    return `
        <div class="${sidebarWidth} bg-white shadow-lg min-h-screen transition-all duration-300 flex flex-col fixed left-0 top-0 z-40">
            ${renderLogo()}
            <nav class="flex-1 overflow-y-auto sidebar-nav">
                <div class="px-4 pb-4">
                    ${renderMenuItems()}
                </div>
            </nav>
        </div>
    `;
}

/**
 * 获取页面信息映射表
 * @param {string} pageUrl - 页面URL
 * @returns {Object} 页面信息对象
 */
function getPageInfo(pageUrl) {
    // 页面映射表，基于menuConfig结构
    const pageMap = {
        // 首页
        'workspace-refactored.html': { title: '首页', category: null, categoryTitle: null },
        'home-dashboard.html': { title: '首页', category: null, categoryTitle: null },
        
        // 基本资料管理
        'resident-management.html': { title: '业主管理', category: 'basicData', categoryTitle: '基本资料管理' },
        'community-overview.html': { title: '小区事务概览管理', category: 'basicData', categoryTitle: '基本资料管理' },
        
        // 内容发布
        'notification-management-refactored.html': { title: '通知管理', category: 'publishManagement', categoryTitle: '内容发布' },
        'announcement-management-refactored.html': { title: '公告管理', category: 'publishManagement', categoryTitle: '内容发布' },
        'event-management.html': { title: '事件管理', category: 'publishManagement', categoryTitle: '内容发布' },
        'activity-management-refactored.html': { title: '动态管理', category: 'publishManagement', categoryTitle: '内容发布' },
        
        // 流程发起
        'process-config.html': { title: '新建流程', category: 'templateManagement', categoryTitle: '模板管理', parentTitle: '流程模板配置', parentHref: 'template-config.html' },
        'process-list.html': { title: '发起流程', category: 'processManagement', categoryTitle: '流程发起' },
        'suggestion-management.html': { title: '小区建议管理', category: 'processManagement', categoryTitle: '流程发起' },
        'survey-config.html': { title: '调查配置', category: 'processManagement', categoryTitle: '流程发起' },
        'survey-management.html': { title: '问卷管理', category: 'processManagement', categoryTitle: '流程发起' },
        'survey-publish.html': { title: '问卷发布', category: 'processManagement', categoryTitle: '流程发起', parentTitle: '问卷管理', parentHref: 'survey-management.html' },
        
        // 授权中心
        'authorization-levels.html': { title: '授权等级管理', category: 'authorizationCenter', categoryTitle: '授权中心' },
        'community-management.html': { title: '小区管理', category: 'authorizationCenter', categoryTitle: '授权中心' },
        
        // 模板管理
        'template-config.html': { title: '流程模板配置', category: 'templateManagement', categoryTitle: '模板管理' },
        'process-template.html': { title: '流程模板管理', category: 'templateManagement', categoryTitle: '模板管理' },
        'survey-template.html': { title: '问卷模板管理', category: 'templateManagement', categoryTitle: '模板管理' },
        
        // AI服务管理
        'ai-prompt-management.html': { title: 'AI提示词管理', category: 'aiServiceManagement', categoryTitle: 'AI服务管理' },
        'api-configuration.html': { title: 'API接口配置', category: 'aiServiceManagement', categoryTitle: 'AI服务管理' },
        
        // 系统管理
        'role-permission-management.html': { title: '角色权限管理', category: 'systemManagement', categoryTitle: '系统管理' },
        'user-management.html': { title: '用户管理', category: 'systemManagement', categoryTitle: '系统管理' },
        'department-management.html': { title: '部门管理', category: 'systemManagement', categoryTitle: '系统管理' },
        'property-management.html': { title: '物业公司管理', category: 'systemManagement', categoryTitle: '系统管理' },
        'system-logs.html': { title: '系统日志', category: 'systemManagement', categoryTitle: '系统管理' },
        'download-center.html': { title: '下载中心', category: 'systemManagement', categoryTitle: '系统管理' },
        'system-config.html': { title: '系统配置', category: 'systemManagement', categoryTitle: '系统管理' },
        'data-dictionary.html': { title: '数据字典', category: 'systemManagement', categoryTitle: '系统管理' },
        'test-data.html': { title: '测试数据', category: 'systemManagement', categoryTitle: '系统管理' },
        
        // 编辑页面 - 添加正确的父级页面关系
        'announcement-edit.html': { title: '编辑公告', category: 'publishManagement', categoryTitle: '内容发布', parentTitle: '公告管理', parentHref: 'announcement-management-refactored.html' },
        'event-edit.html': { title: '编辑事件', category: 'publishManagement', categoryTitle: '内容发布', parentTitle: '事件管理', parentHref: 'event-management.html' },
        'suggestion-edit.html': { title: '编辑建议', category: 'processManagement', categoryTitle: '流程发起', parentTitle: '小区建议管理', parentHref: 'suggestion-management.html' },
        'user-edit.html': { title: '编辑用户', category: 'systemManagement', categoryTitle: '系统管理', parentTitle: '用户账号管理', parentHref: 'account-management.html' },
        
        // 新增页面 - 添加创建页面的层级关系
        'announcement-create.html': { title: '新建公告', category: 'publishManagement', categoryTitle: '内容发布', parentTitle: '公告管理', parentHref: 'announcement-management-refactored.html' },
        'event-create.html': { title: '新建事件', category: 'publishManagement', categoryTitle: '内容发布', parentTitle: '事件管理', parentHref: 'event-management.html' },
        'user-create.html': { title: '新建用户', category: 'systemManagement', categoryTitle: '系统管理', parentTitle: '用户账号管理', parentHref: 'account-management.html' },
        
        // 登录页面
        'login.html': { title: '登录', category: null, categoryTitle: null }
    };
    
    return pageMap[pageUrl] || { title: '未知页面', category: null, categoryTitle: null };
}

/**
 * 生成面包屑导航数组
 * @returns {Array} 面包屑导航数组
 */
function getPageBreadcrumb() {
    const currentPath = window.location.pathname;
    const fileName = currentPath.split('/').pop() || 'workspace.html';
    const pageInfo = getPageInfo(fileName);
    
    const breadcrumb = [];
    
    // 如果是首页页面，只显示首页
    if (fileName === 'workspace-refactored.html' || fileName === 'home-dashboard.html') {
        breadcrumb.push({
            title: '首页',
            href: null, // 当前页面不需要链接
            isActive: true,
            icon: 'fas fa-home' // 添加首页图标
        });
    } else {
        // 对于其他页面，首先添加首页作为第一级
        breadcrumb.push({
            title: '首页',
            href: 'home-dashboard.html', // 可点击返回首页
            isActive: false,
            icon: 'fas fa-home' // 添加首页图标
        });
        
        // 添加分类（如果存在）
        if (pageInfo.categoryTitle) {
            breadcrumb.push({
                title: pageInfo.categoryTitle,
                href: null, // 分类没有直接链接
                isActive: false
            });
        }
        
        // 添加父级页面（如果存在）
        if (pageInfo.parentTitle) {
            breadcrumb.push({
                title: pageInfo.parentTitle,
                href: pageInfo.parentHref || null, // 直接使用配置的parentHref
                isActive: false
            });
        }
        
        // 添加当前页面
        let currentPageTitle = pageInfo.title;
        
        // 对于process-config.html页面，根据URL参数动态设置标题
        if (fileName === 'process-config.html') {
            const urlParams = new URLSearchParams(window.location.search);
            const mode = urlParams.get('mode');
            
            if (mode === 'create') {
                currentPageTitle = '新建流程';
            } else if (mode === 'edit') {
                currentPageTitle = '编辑流程';
            } else {
                // 默认显示新建流程
                currentPageTitle = '新建流程';
            }
        }
        
        breadcrumb.push({
            title: currentPageTitle,
            href: null, // 当前页面不需要链接
            isActive: true
        });
    }
    
    return breadcrumb;
}

// 顶部导航渲染函数
function renderTopNavigation() {
    const breadcrumb = getPageBreadcrumb();
    
    // 生成面包屑HTML
    const breadcrumbHtml = breadcrumb.map((item, index) => {
        const isLast = index === breadcrumb.length - 1;
        
        // 生成标题内容，包含图标（如果有）
        const titleContent = item.icon ? 
            `<i class="${item.icon} mr-1"></i>${item.title}` : 
            item.title;
        
        if (item.href && !item.isActive) {
            // 可点击的链接
            return `<li><a href="${item.href}" class="text-blue-600 hover:text-blue-800 flex items-center">${titleContent}</a></li>`;
        } else {
            // 当前页面或分类（不可点击）
            const textClass = isLast ? 'text-gray-700 font-medium' : 'text-gray-600';
            return `<li class="${textClass} flex items-center">${titleContent}</li>`;
        }
    }).join('<li class="text-gray-500">/</li>');
    
    return `
        <header class="bg-white fixed top-0 right-0 z-30" style="left: 256px; transition: left 0.3s ease;">
            <div class="flex items-center justify-between px-6 py-4">
                <div class="flex items-center">
                    <nav class="text-sm">
                        <ol class="flex items-center space-x-2">
                            ${breadcrumbHtml}
                        </ol>
                    </nav>
                </div>

                <div class="flex items-center space-x-4">
                    <div class="relative">
                        <!-- 用户头像和名称按钮 -->
                        <button id="userMenuButton" class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
                                 alt="Avatar" class="w-8 h-8 rounded-full">
                            <span class="text-sm text-gray-700">管理员</span>
                            <i class="fas fa-chevron-down text-xs text-gray-500 ml-1"></i>
                        </button>
                        
                        <!-- 下拉菜单 -->
                        <div id="userDropdownMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 hidden">
                            <a href="#" onclick="changePassword()" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                <i class="fas fa-key text-gray-400 mr-3"></i>
                                修改密码
                            </a>
                            <hr class="my-1 border-gray-100">
                            <a href="#" onclick="logout()" class="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200">
                                <i class="fas fa-sign-out-alt text-red-400 mr-3"></i>
                                退出登录
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    `;
}

// 通知功能
function showNotifications() {
    alert('暂无新通知');
}

/**
 * 创建密码修改弹窗
 */
function createChangePasswordModal() {
    // 检查是否已存在弹窗，避免重复创建
    if (document.getElementById('changePasswordModal')) {
        return;
    }
    
    const modalHtml = `
        <div id="changePasswordModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 hidden">
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div class="mt-3">
                    <!-- 弹窗标题 -->
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-medium text-gray-900">修改密码</h3>
                        <button type="button" onclick="closeChangePasswordModal()" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <!-- 密码修改表单 -->
                    <form id="changePasswordForm" class="space-y-4">
                        <!-- 当前密码 -->
                        <div>
                            <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
                            <div class="relative">
                                <input type="password" id="currentPassword" name="currentPassword" required
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                       placeholder="请输入当前密码">
                                <button type="button" onclick="togglePasswordVisibility('currentPassword')" 
                                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- 新密码 -->
                        <div>
                            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
                            <div class="relative">
                                <input type="password" id="newPassword" name="newPassword" required
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                       placeholder="请输入新密码（至少6位）">
                                <button type="button" onclick="togglePasswordVisibility('newPassword')" 
                                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- 确认新密码 -->
                        <div>
                            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
                            <div class="relative">
                                <input type="password" id="confirmPassword" name="confirmPassword" required
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                       placeholder="请再次输入新密码">
                                <button type="button" onclick="togglePasswordVisibility('confirmPassword')" 
                                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- 按钮组 -->
                        <div class="flex justify-end space-x-3 pt-4">
                            <button type="button" onclick="closeChangePasswordModal()" 
                                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                取消
                            </button>
                            <button type="submit" 
                                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                确认修改
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // 将弹窗添加到页面
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // 绑定表单提交事件
    document.getElementById('changePasswordForm').addEventListener('submit', handlePasswordChange);
}

/**
 * 显示密码修改弹窗
 */
function showChangePasswordModal() {
    createChangePasswordModal();
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
        modal.classList.remove('hidden');
        // 聚焦到第一个输入框
        setTimeout(() => {
            document.getElementById('currentPassword').focus();
        }, 100);
    }
}

/**
 * 关闭密码修改弹窗
 */
function closeChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
        modal.classList.add('hidden');
        // 清空表单
        document.getElementById('changePasswordForm').reset();
    }
}

/**
 * 切换密码显示/隐藏
 * @param {string} inputId - 输入框ID
 */
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

/**
 * 处理密码修改表单提交
 * @param {Event} e - 表单提交事件
 */
function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // 表单验证
    if (!currentPassword) {
        showPasswordMessage('请输入当前密码', 'error');
        document.getElementById('currentPassword').focus();
        return;
    }
    
    if (!newPassword) {
        showPasswordMessage('请输入新密码', 'error');
        document.getElementById('newPassword').focus();
        return;
    }
    
    if (newPassword.length < 6) {
        showPasswordMessage('新密码长度不能少于6位', 'error');
        document.getElementById('newPassword').focus();
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showPasswordMessage('两次输入的新密码不一致', 'error');
        document.getElementById('confirmPassword').focus();
        return;
    }
    
    if (currentPassword === newPassword) {
        showPasswordMessage('新密码不能与当前密码相同', 'error');
        document.getElementById('newPassword').focus();
        return;
    }
    
    // 显示加载状态
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>修改中..';
    submitBtn.disabled = true;
    
    // 模拟密码修改请求
    setTimeout(() => {
        // 简单验证当前密码（实际项目中应该调用后端API）
        if (currentPassword === '123456') {
            showPasswordMessage('密码修改成功！', 'success');
            setTimeout(() => {
                closeChangePasswordModal();
            }, 1500);
        } else {
            showPasswordMessage('当前密码错误，请重试', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            document.getElementById('currentPassword').value = '';
            document.getElementById('currentPassword').focus();
        }
    }, 1500);
}

/**
 * 显示密码修改消息提示
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 (success, error, info)
 */
function showPasswordMessage(message, type = 'info') {
    // 移除已存在的消息
    const existingMessage = document.querySelector('.password-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const iconMap = {
        success: 'fa-check-circle text-green-500',
        error: 'fa-exclamation-circle text-red-500',
        info: 'fa-info-circle text-blue-500'
    };
    
    const bgColorMap = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200'
    };
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `password-message fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-md border ${bgColorMap[type]} z-50 flex items-center space-x-2 transition-all duration-300`;
    messageDiv.innerHTML = `
        <i class="fas ${iconMap[type]}"></i>
        <span class="text-sm font-medium text-gray-700">${message}</span>
    `;
    
    document.body.appendChild(messageDiv);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translate(-50%, -100%)';
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }
    }, 3000);
}

// 修改密码功能
function changePassword() {
    // 关闭下拉菜单
    const userDropdownMenu = document.getElementById('userDropdownMenu');
    if (userDropdownMenu) {
        userDropdownMenu.classList.add('hidden');
    }
    
    // 显示密码修改弹窗
    showChangePasswordModal();
}

// 将函数暴露到全局作用域
window.showChangePasswordModal = showChangePasswordModal;
window.closeChangePasswordModal = closeChangePasswordModal;
window.togglePasswordVisibility = togglePasswordVisibility;

/**
 * 初始化页面加载动画（已停用，直接显示内容）
 */
function initPageLoadAnimation() {
    // 主内容区域直接显示，不使用动画
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        // 直接移除loading类，添加loaded类
        mainContent.classList.remove('page-loading');
        mainContent.classList.add('page-loaded');
        
        // 不再使用任何动画，内容直接显示
    }
}

/**
 * 逐步动画化内容项（简化版）
 */
function animateContentItems() {
    // 这个函数现在由initPageLoadAnimation处理，保留为兼容性
    // 不再做复杂的逐项动画处理
}

/**
 * 为新添加的内容添加动画
 * @param {Element} element - 要动画化的元素
 */
function addContentAnimation(element) {
    if (element && !element.classList.contains('content-item')) {
        element.classList.add('content-item');
        // 稍微延迟以确保样式应用
        setTimeout(() => {
            element.classList.add('animate-in');
        }, 50);
    }
}

// 将函数暴露到全局作用域
window.addContentAnimation = addContentAnimation;
function initSidebarStateListener() {
    // 监听侧边栏宽度变化
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    updateTopNavigationPosition();
                }
            });
        });
        
        observer.observe(sidebarContainer, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
    }
    
    // 初始设置顶部导航栏位置
    updateTopNavigationPosition();
}

/**
 * 更新顶部导航栏位置
 */
function updateTopNavigationPosition() {
    const sidebarContainer = document.getElementById('sidebar-container');
    const header = document.querySelector('.top-navigation-fixed');
    
    if (header && sidebarContainer) {
        const isCollapsed = sidebarContainer.classList.contains('sidebar-collapsed');
        if (window.innerWidth > 768) { // 只在桌面端应用
            header.style.left = isCollapsed ? '80px' : '256px';
        } else {
            header.style.left = '0px';
        }
    }
}

// 登出功能
function logout() {
    // 关闭下拉菜单
    const userDropdownMenu = document.getElementById('userDropdownMenu');
    if (userDropdownMenu) {
        userDropdownMenu.classList.add('hidden');
    }
    
    if (confirm('确定要退出登录吗？')) {
        window.location.href = 'login.html';
    }
}

/**
 * 处理菜单点击事件
 * 如果在dashboard-all.html页面，则使用页签功能
 * 否则进行页面跳转
 * @param {string} pageUrl - 页面URL
 * @param {string} title - 页面标题
 */
function handleMenuClick(pageUrl, title) {
    // 使用全局页签系统
    if (typeof window.openPageTab === 'function') {
        // 调用全局页签系统打开页签
        window.openPageTab(pageUrl, title);
    } else {
        // 如果页签系统未加载，进行页面跳转
        window.location.href = pageUrl;
    }
}

// 将函数暴露到全局作用域
window.handleMenuClick = handleMenuClick;

// 切换子菜单组的显示/隐藏
function toggleSubmenuGroup(groupId) {
    const submenu = document.getElementById(groupId);
    const icon = document.getElementById(groupId + '-icon');
    
    if (submenu && icon) {
        const isCurrentlyHidden = submenu.style.display === 'none' || submenu.style.display === '';
        
        if (isCurrentlyHidden) {
            // 先收起所有其他子菜单
            closeAllSubmenus(groupId);
            
            // 然后展开当前子菜单
            submenu.style.display = 'block';
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-down');
        } else {
            // 收起当前子菜单
            submenu.style.display = 'none';
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-right');
        }
    }
}

/**
 * 收起所有子菜单，除了指定的菜单ID
 * @param {string} exceptId - 要排除的菜单ID
 */
function closeAllSubmenus(exceptId = null) {
    // 获取所有子菜单组
    const allSubmenus = document.querySelectorAll('[id^="group-"]');
    
    allSubmenus.forEach(submenu => {
        if (exceptId && submenu.id === exceptId) {
            return; // 跳过指定的菜单
        }
        
        const icon = document.getElementById(submenu.id + '-icon');
        if (submenu && icon) {
            submenu.style.display = 'none';
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-right');
        }
    });
}

/**
 * 当点击子菜单项时，收起所有其他的菜单组
 * @param {string} currentGroupId - 当前子菜单所属的菜单组ID
 */
function collapseParentMenu(currentGroupId) {
    // 收起所有其他的菜单组，保持当前菜单组展开
    closeAllSubmenus(currentGroupId);
}

/**
 * 收起所有菜单组（当点击一级菜单项时调用）
 */
function closeAllMenuGroups() {
    // 获取所有子菜单组
    const allSubmenus = document.querySelectorAll('[id^="group-"]');
    
    allSubmenus.forEach(submenu => {
        const icon = document.getElementById(submenu.id + '-icon');
        if (submenu && icon) {
            submenu.style.display = 'none';
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-right');
        }
    });
}

// 将函数暴露到全局作用域
window.toggleSubmenuGroup = toggleSubmenuGroup;
window.collapseParentMenu = collapseParentMenu;
window.closeAllMenuGroups = closeAllMenuGroups;

// 重新定义组件类以兼容现有代码
function createSidebar(currentPage) {
    return {
        render: () => renderSidebar(currentPage)
    };
}

function createTopNavigation() {
    return {
        render: () => renderTopNavigation()
    };
}

// 导出供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initPage, createSidebar, createTopNavigation };
}
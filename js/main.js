/**
 * 主框架JavaScript文件
 * 负责页面导航、侧边栏控制、用户交互等核心功能
 */

// 全局状态管理
const AppState = {
    currentPage: null,
    sidebarCollapsed: false,
    userMenuOpen: false
};

// 页面路由配置
const pageRoutes = {
    'home-dashboard': {
        title: '首页仪表板',
        path: 'index.html'
    },
    'community-management': {
        title: '小区管理',
        path: 'community-management.html'
    },
    'authorization-levels': {
        title: '授权等级管理',
        path: 'authorization-levels.html'
    },
    'process-template': {
        title: '流程模板管理',
        path: 'process-template.html'
    },
    'survey-template': {
        title: '问卷模板管理',
        path: 'survey-template.html'
    },
    'ai-prompt-management': {
        title: '提示词管理',
        path: 'ai-prompt-management.html'
    },
    'api-configuration': {
        title: 'API配置管理',
        path: 'api-configuration.html'
    },
    'role-permission-management': {
        title: '角色权限管理',
        path: 'role-permission-management.html'
    },
    'user-management': {
        title: '用户账号管理',
        path: 'user-management.html'
    },
    'system-logs': {
        title: '系统日志',
        path: 'system-logs.html'
    }
};

// DOM元素引用
const Elements = {
    sidebar: null,
    mainContent: null,
    pageContent: null,
    welcomePage: null,
    userMenu: null,
    loadingOverlay: null,

    currentPageTitle: null
};

/**
 * 初始化应用
 */
function initApp() {
    // 获取DOM元素引用
    Elements.sidebar = document.getElementById('sidebar');
    Elements.mainContent = document.getElementById('main-content');
    Elements.pageContent = document.getElementById('page-content');
    Elements.welcomePage = document.getElementById('welcome-page');
    Elements.userMenu = document.getElementById('user-menu');
    Elements.loadingOverlay = document.getElementById('loading-overlay');

    Elements.currentPageTitle = document.getElementById('current-page-title');
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始化页面状态
    showWelcomePage();
    
    console.log('大家共治后台管理系统初始化完成');
}

/**
 * 绑定事件监听器
 */
function bindEventListeners() {
    // 点击页面其他地方关闭用户菜单
    document.addEventListener('click', function(event) {
        if (!event.target.closest('#user-menu') && !event.target.closest('button[onclick="toggleUserMenu()"]')) {
            closeUserMenu();
        }
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', function(event) {
        // Ctrl + B 切换侧边栏
        if (event.ctrlKey && event.key === 'b') {
            event.preventDefault();
            toggleSidebar();
        }
    });
}

/**
 * 切换侧边栏显示/隐藏
 */
function toggleSidebar() {
    AppState.sidebarCollapsed = !AppState.sidebarCollapsed;
    
    if (Elements.sidebar) {
        if (AppState.sidebarCollapsed) {
            Elements.sidebar.classList.add('-translate-x-full');
            Elements.sidebar.classList.add('md:translate-x-0');
            Elements.sidebar.classList.add('md:w-16');
        } else {
            Elements.sidebar.classList.remove('-translate-x-full');
            Elements.sidebar.classList.remove('md:translate-x-0');
            Elements.sidebar.classList.remove('md:w-16');
        }
    }
}

/**
 * 切换子菜单显示/隐藏
 * @param {string} submenuId - 子菜单ID
 */
function toggleSubmenu(submenuId) {
    const submenu = document.getElementById(submenuId);
    const icon = document.getElementById(submenuId + '-icon');
    
    if (!submenu || !icon) {
        console.error('子菜单元素未找到:', submenuId);
        return;
    }
    
    const isOpen = submenu.classList.contains('open');
    
    // 关闭所有其他子菜单
    closeAllSubmenus();
    
    if (!isOpen) {
        // 打开当前子菜单
        submenu.classList.add('open');
        icon.classList.add('rotate-180');
    }
}

/**
 * 关闭所有子菜单
 */
function closeAllSubmenus() {
    const submenus = document.querySelectorAll('.submenu');
    const icons = document.querySelectorAll('[id$="-submenu-icon"]');
    
    submenus.forEach(submenu => {
        submenu.classList.remove('open');
    });
    
    icons.forEach(icon => {
        icon.classList.remove('rotate-180');
    });
}

/**
 * 切换用户菜单显示/隐藏
 */
function toggleUserMenu() {
    AppState.userMenuOpen = !AppState.userMenuOpen;
    
    if (Elements.userMenu) {
        if (AppState.userMenuOpen) {
            Elements.userMenu.classList.remove('hidden');
        } else {
            Elements.userMenu.classList.add('hidden');
        }
    }
}

/**
 * 关闭用户菜单
 */
function closeUserMenu() {
    AppState.userMenuOpen = false;
    if (Elements.userMenu) {
        Elements.userMenu.classList.add('hidden');
    }
}

/**
 * 显示加载中状态
 */
function showLoading() {
    if (Elements.loadingOverlay) {
        Elements.loadingOverlay.classList.remove('hidden');
    }
}

/**
 * 隐藏加载中状态
 */
function hideLoading() {
    if (Elements.loadingOverlay) {
        Elements.loadingOverlay.classList.add('hidden');
    }
}

/**
 * 显示欢迎页面
 */
function showWelcomePage() {
    if (Elements.welcomePage) {
        Elements.welcomePage.classList.remove('hidden');
    }
    if (Elements.pageContent) {
        Elements.pageContent.classList.add('hidden');
    }
    if (Elements.breadcrumbCurrent) {
        Elements.breadcrumbCurrent.classList.add('hidden');
    }
    
    // 清除菜单项的激活状态
    clearActiveMenuItems();
    
    AppState.currentPage = null;
}

/**
 * 加载页面内容
 * @param {string} pageUrl - 页面URL
 * @param {string} pageTitle - 页面标题
 */
async function loadPage(pageUrl, pageTitle) {
    try {
        showLoading();
        
        // 检查页面文件是否存在
        const response = await fetch(pageUrl);
        
        if (!response.ok) {
            // 如果页面不存在，显示开发中提示
            showDevelopmentPage(pageTitle);
            return;
        }
        
        const content = await response.text();
        
        // 更新页面内容
        if (Elements.pageContent) {
            Elements.pageContent.innerHTML = content;
        }
        
        // 切换显示状态
        if (Elements.welcomePage) {
            Elements.welcomePage.classList.add('hidden');
        }
        if (Elements.pageContent) {
            Elements.pageContent.classList.remove('hidden');
        }
        

        
        // 更新菜单激活状态
        updateActiveMenuItem(pageUrl);
        
        // 更新当前页面状态
        AppState.currentPage = {
            url: pageUrl,
            title: pageTitle
        };
        
        // 执行页面特定的初始化脚本
        executePageScript(pageUrl);
        
        console.log('页面加载成功:', pageTitle);
        
    } catch (error) {
        console.error('页面加载失败:', error);
        showErrorPage(pageTitle, error.message);
    } finally {
        hideLoading();
    }
}

/**
 * 显示开发中页面
 * @param {string} pageTitle - 页面标题
 */
function showDevelopmentPage(pageTitle) {
    const developmentContent = `
        <div class="flex items-center justify-center h-96">
            <div class="text-center">
                <div class="w-24 h-24 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-tools text-yellow-600 text-3xl"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">${pageTitle}</h2>
                <p class="text-gray-600 mb-6">此功能正在开发中，敬请期待...</p>
                <button onclick="showWelcomePage()" 
                        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <i class="fas fa-arrow-left mr-2"></i>返回首页
                </button>
            </div>
        </div>
    `;
    
    Elements.pageContent.innerHTML = developmentContent;
    Elements.welcomePage.classList.add('hidden');
    Elements.pageContent.classList.remove('hidden');
    

}

/**
 * 显示错误页面
 * @param {string} pageTitle - 页面标题
 * @param {string} errorMessage - 错误信息
 */
function showErrorPage(pageTitle, errorMessage) {
    const errorContent = `
        <div class="flex items-center justify-center h-96">
            <div class="text-center">
                <div class="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-exclamation-triangle text-red-600 text-3xl"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">页面加载失败</h2>
                <p class="text-gray-600 mb-2">${pageTitle}</p>
                <p class="text-sm text-red-600 mb-6">${errorMessage}</p>
                <div class="space-x-4">
                    <button onclick="location.reload()" 
                            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <i class="fas fa-redo mr-2"></i>重新加载
                    </button>
                    <button onclick="showWelcomePage()" 
                            class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                        <i class="fas fa-home mr-2"></i>返回首页
                    </button>
                </div>
            </div>
        </div>
    `;
    
    Elements.pageContent.innerHTML = errorContent;
    Elements.welcomePage.classList.add('hidden');
    Elements.pageContent.classList.remove('hidden');
    

}



/**
 * 更新菜单激活状态
 * @param {string} pageUrl - 页面URL
 */
function updateActiveMenuItem(pageUrl) {
    // 清除所有激活状态
    clearActiveMenuItems();
    
    // 查找对应的菜单项并设置激活状态
    const menuItems = document.querySelectorAll('a[onclick*="loadPage"]');
    menuItems.forEach(item => {
        const onclick = item.getAttribute('onclick');
        if (onclick && onclick.includes(pageUrl)) {
            item.classList.add('text-blue-600', 'bg-blue-50');
            
            // 注释掉自动展开菜单的功能，避免与新的菜单交互逻辑冲突
            // 确保父级子菜单是展开的
            // const submenu = item.closest('.submenu');
            // if (submenu) {
            //     submenu.classList.add('open');
            //     const submenuId = submenu.id;
            //     const icon = document.getElementById(submenuId + '-icon');
            //     if (icon) {
            //         icon.classList.add('rotate-180');
            //     }
            // }
        }
    });
}

/**
 * 清除所有菜单项的激活状态
 */
function clearActiveMenuItems() {
    const menuItems = document.querySelectorAll('a[onclick*="loadPage"]');
    menuItems.forEach(item => {
        item.classList.remove('text-blue-600', 'bg-blue-50');
    });
}

/**
 * 执行页面特定的初始化脚本
 * @param {string} pageUrl - 页面URL
 */
function executePageScript(pageUrl) {
    // 根据页面URL执行相应的初始化脚本
    const pageName = pageUrl.split('/').pop().replace('.html', '');
    
    // 检查是否有对应的页面初始化函数
    const initFunctionName = `init${toPascalCase(pageName)}`;
    
    if (typeof window[initFunctionName] === 'function') {
        try {
            window[initFunctionName]();
            console.log('页面初始化脚本执行成功:', initFunctionName);
        } catch (error) {
            console.error('页面初始化脚本执行失败:', error);
        }
    }
}

/**
 * 将字符串转换为PascalCase格式
 * @param {string} str - 输入字符串
 * @returns {string} PascalCase格式的字符串
 */
function toPascalCase(str) {
    return str.replace(/(^|-)([a-z])/g, (match, p1, p2) => p2.toUpperCase());
}

/**
 * 显示通知消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 (success, error, warning, info)
 * @param {number} duration - 显示时长(毫秒)
 */
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
    
    // 根据类型设置样式
    const typeStyles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white'
    };
    
    notification.className += ` ${typeStyles[type] || typeStyles.info}`;
    
    // 设置图标
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="${icons[type] || icons.info} mr-2"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // 自动隐藏
    if (duration > 0) {
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, duration);
    }
}

/**
 * 确认对话框
 * @param {string} message - 确认消息
 * @param {Function} onConfirm - 确认回调函数
 * @param {Function} onCancel - 取消回调函数
 */
function showConfirm(message, onConfirm, onCancel) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    overlay.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md mx-4">
            <div class="flex items-center mb-4">
                <i class="fas fa-question-circle text-yellow-500 text-xl mr-3"></i>
                <h3 class="text-lg font-semibold text-gray-900">确认操作</h3>
            </div>
            <p class="text-gray-600 mb-6">${message}</p>
            <div class="flex justify-end space-x-3">
                <button id="cancel-btn" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                    取消
                </button>
                <button id="confirm-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    确认
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // 绑定事件
    overlay.querySelector('#confirm-btn').onclick = () => {
        overlay.remove();
        if (onConfirm) onConfirm();
    };
    
    overlay.querySelector('#cancel-btn').onclick = () => {
        overlay.remove();
        if (onCancel) onCancel();
    };
    
    // 点击遮罩关闭
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.remove();
            if (onCancel) onCancel();
        }
    };
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 导出全局函数供HTML调用
window.toggleSidebar = toggleSidebar;
window.toggleSubmenu = toggleSubmenu;
window.toggleUserMenu = toggleUserMenu;
window.loadPage = loadPage;
window.showWelcomePage = showWelcomePage;
window.showNotification = showNotification;
window.showConfirm = showConfirm;
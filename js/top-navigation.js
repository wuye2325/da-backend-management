/**
 * 顶部导航栏组件
 * 用于大家共治后台管理系统的顶部导航
 */

class TopNavigation {
    constructor(breadcrumbs = []) {
        this.breadcrumbs = breadcrumbs;
        this.init();
    }

    // 初始化顶部导航
    init() {
        this.render();
        this.bindEvents();
    }

    // 渲染顶部导航HTML
    render() {
        const topNavHTML = `
            <header class="bg-white shadow-sm border-b border-gray-200">
                <div class="flex items-center justify-between px-6 py-4">
                    <div class="flex items-center">
                        <button id="sidebarToggle" class="text-gray-500 hover:text-gray-700 mr-4">
                            <i class="fas fa-bars"></i>
                        </button>
                        <nav class="text-sm">
                            <ol class="flex items-center space-x-2">
                                ${this.renderBreadcrumbs()}
                            </ol>
                        </nav>
                    </div>

                    <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-2">
                            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
                                 alt="Avatar" class="w-8 h-8 rounded-full">
                            <span class="text-sm text-gray-700" id="userDisplay">管理员</span>
                            <button onclick="window.topNavInstance.logout()" class="text-gray-500 hover:text-gray-700">
                                <i class="fas fa-sign-out-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        `;

        return topNavHTML;
    }

    // 渲染面包屑导航
    renderBreadcrumbs() {
        if (!this.breadcrumbs || this.breadcrumbs.length === 0) {
            return `
                <li><a href="dashboard.html" class="text-blue-600 hover:text-blue-800">首页</a></li>
                <li class="text-gray-500">/</li>
                <li class="text-gray-700">仪表板</li>
            `;
        }

        let html = '';
        this.breadcrumbs.forEach((item, index) => {
            if (index > 0) {
                html += '<li class="text-gray-500">/</li>';
            }
            
            if (item.href && index < this.breadcrumbs.length - 1) {
                html += `<li><a href="${item.href}" class="text-blue-600 hover:text-blue-800">${item.title}</a></li>`;
            } else {
                html += `<li class="text-gray-700">${item.title}</li>`;
            }
        });

        return html;
    }

    // 更新面包屑导航
    updateBreadcrumbs(breadcrumbs) {
        this.breadcrumbs = breadcrumbs;
        const breadcrumbContainer = document.querySelector('header nav ol');
        if (breadcrumbContainer) {
            breadcrumbContainer.innerHTML = this.renderBreadcrumbs();
        }
    }

    // 绑定事件
    bindEvents() {
        // 这里可以添加其他顶部导航相关的事件绑定
    }

    // 显示通知
    showNotifications() {
        // 这里可以实现通知功能
        alert('暂无新通知');
    }

    // 登出功能
    logout() {
        if (confirm('确定要退出登录吗？')) {
            window.location.href = 'login.html';
        }
    }

    // 更新用户显示名称
    updateUserDisplay(userName) {
        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) {
            userDisplay.textContent = userName;
        }
    }
}

// 初始化顶部导航的函数
function initTopNavigation(breadcrumbs = []) {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.topNavInstance = new TopNavigation(breadcrumbs);
        });
    } else {
        window.topNavInstance = new TopNavigation(breadcrumbs);
    }
}

// 导出供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TopNavigation, initTopNavigation };
}
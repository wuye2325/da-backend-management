/**
 * 全局页签系统组件
 * 用于管理多页面页签切换功能
 * 支持真实页面跳转和状态持久化
 */

/**
 * 页签状态管理器
 * 负责页签状态的保存和恢复
 */
class TabStateManager {
    constructor() {
        this.storageKey = 'globalTabSystemState';
    }

    /**
     * 保存页签状态到sessionStorage
     * @param {Object} state - 页签状态对象
     */
    saveState(state) {
        try {
            sessionStorage.setItem(this.storageKey, JSON.stringify(state));
        } catch (error) {
            console.error('保存页签状态失败:', error);
        }
    }

    /**
     * 从sessionStorage恢复页签状态
     * @returns {Object|null} 页签状态对象
     */
    loadState() {
        try {
            const stateStr = sessionStorage.getItem(this.storageKey);
            return stateStr ? JSON.parse(stateStr) : null;
        } catch (error) {
            console.error('加载页签状态失败:', error);
            return null;
        }
    }

    /**
     * 清除页签状态
     */
    clearState() {
        try {
            sessionStorage.removeItem(this.storageKey);
        } catch (error) {
            console.error('清除页签状态失败:', error);
        }
    }

    /**
     * 获取当前页面的URL
     * @returns {string} 当前页面URL
     */
    getCurrentPageUrl() {
        return window.location.pathname.split('/').pop() || 'workspace.html';
    }
}

class TabSystem {
    constructor() {
        this.tabs = new Map(); // 存储页签信息
        this.activeTabId = null; // 当前激活的页签ID
        this.tabContainer = null; // 页签容器元素
        this.stateManager = new TabStateManager(); // 状态管理器
        this.init();
    }

    /**
     * 初始化页签系统
     */
    init() {
        this.createTabContainer();
        this.bindEvents();
        this.restoreTabState();
    }

    /**
     * 恢复页签状态
     */
    restoreTabState() {
        const savedState = this.stateManager.loadState();
        const currentPageUrl = this.stateManager.getCurrentPageUrl();
        
        if (savedState && savedState.tabs && savedState.tabs.length > 0) {
            // 恢复页签数据
            savedState.tabs.forEach(tabData => {
                this.tabs.set(tabData.id, {
                    id: tabData.id,
                    url: tabData.url,
                    title: tabData.title,
                    loaded: false,
                    content: null
                });
                // 渲染每个页签
                this.renderTab(this.tabs.get(tabData.id));
            });
            
            // 显示页签系统
            this.showTabSystem();
            
            // 激活当前页面对应的页签
            const currentTabId = this.generateTabId(currentPageUrl);
            
            if (this.tabs.has(currentTabId)) {
                this.activateTab(currentTabId, true); // 跳过导航
            } else if (savedState.activeTabId && this.tabs.has(savedState.activeTabId)) {
                this.activateTab(savedState.activeTabId, true); // 跳过导航
            }
        } else {
            // 如果没有保存的状态，为当前页面创建默认页签
            this.createDefaultTab(currentPageUrl);
        }
    }
    
    /**
     * 为当前页面创建默认页签
     * @param {string} currentPageUrl - 当前页面URL
     */
    createDefaultTab(currentPageUrl) {
        // 获取页面标题
        const pageTitle = this.getPageTitle(currentPageUrl);
        
        if (pageTitle) {
            // 添加当前页面的页签
            this.addTab(currentPageUrl, pageTitle);
        }
    }
    
    /**
     * 根据页面URL获取页面标题
     * @param {string} pageUrl - 页面URL
     * @returns {string} 页面标题
     */
    getPageTitle(pageUrl) {
        const pageTitleMap = {
            // 首页
            'home-dashboard.html': '首页',
            
            // 授权中心
            'community-management.html': '小区管理',
            'authorization-levels.html': '授权等级管理',
            
            // 模板配置
            'template-config.html': '流程模板',
            
            // AI服务管理
            'ai-prompt-management.html': '提示词管理',
            'api-configuration.html': 'API配置管理',
            
            // 系统管理
            'role-permission-management.html': '角色权限管理',
            'user-management.html': '用户账号管理',
            'department-management.html': '部门管理',
            'data-dictionary.html': '数据字典',
            'system-logs.html': '系统日志管理',
            
            // 向后兼容的旧页面
            'process-config.html': '流程配置',
            'workspace-refactored.html': '首页',
            'resident-management.html': '业主管理',
            'community-overview.html': 'AI内容管理',
            'notification-management-refactored.html': '通知管理',
            'announcement-management-refactored.html': '公告管理',
            'event-management.html': '事件管理',
            'activity-management-refactored.html': '动态管理',
            'account-management.html': '用户账号管理',
            'password-recovery-management.html': '密码找回管理',
            'download-center.html': '下载中心',
            'system-config.html': '系统配置'
        };
        
        // 从URL中提取文件名
        const fileName = pageUrl.split('/').pop();
        return pageTitleMap[fileName] || fileName.replace('.html', '');
    }

    /**
     * 创建页签容器
     */
    createTabContainer() {
        // 查找顶部导航容器
        const topNavContainer = document.getElementById('top-navigation-container');
        if (!topNavContainer) {
            console.error('未找到top-navigation-container元素');
            return;
        }

        // 创建页签容器HTML
        const tabSystemHTML = `
            <div id="global-tab-system" class="bg-white border-b border-gray-200" style="display: none;">
                <div class="px-6">
                    <div class="flex items-center justify-between">
                        <nav class="-mb-px flex space-x-1 flex-1" id="global-tabs-nav">
                            <!-- 页签将动态插入到这里 -->
                        </nav>
                        <div class="flex items-center space-x-1 ml-4" id="tab-actions" style="display: none;">
                            <button class="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow" 
                                    onclick="window.globalTabSystem.closeOtherTabs(window.globalTabSystem.getActiveTabId())" 
                                    title="关闭其它页签">
                                <i class="fas fa-times-circle mr-1"></i>关闭其它
                            </button>
                            <button class="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md border border-gray-200 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow" 
                                    onclick="window.globalTabSystem.closeAllTabs()" 
                                    title="关闭全部页签">
                                <i class="fas fa-trash-alt mr-1"></i>关闭全部
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 右键菜单 -->
            <div id="tab-context-menu" class="fixed bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 hidden">
                <button class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100" data-action="close-others">
                    关闭其它
                </button>
                <button class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100" data-action="close-all">
                    关闭全部
                </button>
            </div>
        `;

        // 在顶部导航后插入页签系统
        topNavContainer.insertAdjacentHTML('afterend', tabSystemHTML);
        
        // 获取容器引用
        this.tabContainer = document.getElementById('global-tabs-nav');
        this.systemContainer = document.getElementById('global-tab-system');
        this.contextMenu = document.getElementById('tab-context-menu');
        
        // 绑定右键菜单点击事件
        this.contextMenu.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action) {
                e.stopPropagation();
                this.handleContextMenuAction(action);
                this.hideContextMenu();
            }
        });
    }

    /**
     * 添加新页签
     * @param {string} pageUrl - 页面URL
     * @param {string} title - 页签标题
     */
    addTab(pageUrl, title) {
        // 生成页签ID
        const tabId = this.generateTabId(pageUrl);
        
        // 如果页签已存在，直接激活
        if (this.tabs.has(tabId)) {
            this.activateTab(tabId);
            return;
        }

        // 创建页签数据
        const tabData = {
            id: tabId,
            url: pageUrl,
            title: title,
            loaded: false,
            content: null
        };

        // 添加到页签集合
        this.tabs.set(tabId, tabData);

        // 渲染页签
        this.renderTab(tabData);

        // 激活新页签
        this.activateTab(tabId);

        // 显示页签系统
        this.showTabSystem();
        
        // 更新操作按钮状态
        this.updateTabActions();
    }

    /**
     * 生成页签ID
     * @param {string} pageUrl - 页面URL
     * @returns {string} 页签ID
     */
    generateTabId(pageUrl) {
        // 从URL中提取文件名作为ID
        const fileName = pageUrl.split('/').pop().replace('.html', '');
        return `tab-${fileName}`;
    }

    /**
     * 渲染单个页签
     * @param {Object} tabData - 页签数据
     */
    renderTab(tabData) {
        const tabHTML = `
            <div class="tab-item flex items-center px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm cursor-pointer transition-colors max-w-48" 
                 data-tab-id="${tabData.id}" 
                 onclick="window.globalTabSystem.activateTab('${tabData.id}')">
                <span class="truncate flex-1 min-w-0">${tabData.title}</span>
                <button class="ml-2 text-gray-400 hover:text-red-500 close-tab flex-shrink-0" 
                        onclick="event.stopPropagation(); window.globalTabSystem.closeTab('${tabData.id}')" 
                        title="关闭页签">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
        `;

        this.tabContainer.insertAdjacentHTML('beforeend', tabHTML);
    }

    /**
     * 激活指定页签
     * @param {string} tabId - 页签ID
     * @param {boolean} skipNavigation - 是否跳过页面导航（用于状态恢复）
     */
    activateTab(tabId, skipNavigation = false) {
        if (!this.tabs.has(tabId)) {
            console.error(`页签 ${tabId} 不存在`);
            return;
        }

        const tabData = this.tabs.get(tabId);
        const currentPageUrl = this.stateManager.getCurrentPageUrl();
        
        // 如果不是当前页面且不跳过导航，则进行页面跳转
        if (!skipNavigation && tabData.url !== currentPageUrl) {
            // 保存当前状态
            this.saveCurrentState(tabId);
            
            // 显示跳转提示
            this.showNavigationHint();
            
            // 延迟跳转，让用户看到提示
            setTimeout(() => {
                window.location.href = tabData.url;
            }, 200);
            return;
        }

        // 取消所有页签的激活状态
        this.tabContainer.querySelectorAll('.tab-item').forEach(tab => {
            tab.classList.remove('border-blue-500', 'text-blue-600', 'bg-blue-50');
            tab.classList.add('border-transparent', 'text-gray-500');
        });

        // 激活当前页签
        const currentTab = this.tabContainer.querySelector(`[data-tab-id="${tabId}"]`);
        if (currentTab) {
            currentTab.classList.remove('border-transparent', 'text-gray-500');
            currentTab.classList.add('border-blue-500', 'text-blue-600', 'bg-blue-50');
        }

        // 设置当前激活页签
        this.activeTabId = tabId;
        
        // 保存状态（不跳转时也要保存状态）
        if (!skipNavigation) {
            this.saveCurrentState(tabId);
        }
    }

    /**
     * 保存当前页签状态
     * @param {string} activeTabId - 当前激活的页签ID
     */
    saveCurrentState(activeTabId) {
        const state = {
            tabs: Array.from(this.tabs.values()).map(tab => ({
                id: tab.id,
                url: tab.url,
                title: tab.title
            })),
            activeTabId: activeTabId,
            timestamp: Date.now()
        };
        
        this.stateManager.saveState(state);
    }

    /**
     * 显示页面跳转提示
     */
    showNavigationHint() {
        // 创建提示元素
        const hint = document.createElement('div');
        hint.id = 'navigation-hint';
        hint.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center';
        hint.innerHTML = `
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            <span>正在跳转页面...</span>
        `;
        
        document.body.appendChild(hint);
        
        // 3秒后自动移除（防止跳转失败时提示一直存在）
        setTimeout(() => {
            const existingHint = document.getElementById('navigation-hint');
            if (existingHint) {
                existingHint.remove();
            }
        }, 3000);
    }



    /**
     * 关闭页签
     * @param {string} tabId - 页签ID
     */
    closeTab(tabId) {
        if (!this.tabs.has(tabId)) return;

        // 移除页签元素
        const tabElement = this.tabContainer.querySelector(`[data-tab-id="${tabId}"]`);
        if (tabElement) {
            tabElement.remove();
        }

        // 从集合中移除
        this.tabs.delete(tabId);

        // 如果关闭的是当前激活页签
        if (this.activeTabId === tabId) {
            // 激活其他页签或隐藏页签系统
            const remainingTabs = Array.from(this.tabs.keys());
            if (remainingTabs.length > 0) {
                // 激活最后一个页签
                const nextTabId = remainingTabs[remainingTabs.length - 1];
                this.activateTab(nextTabId);
            } else {
                // 没有其他页签了，清除状态并隐藏页签系统
                this.stateManager.clearState();
                this.hideTabSystem();
            }
        } else {
            // 不是当前激活页签，只需要保存状态
            this.saveCurrentState(this.activeTabId);
        }
        
        // 更新操作按钮状态
        this.updateTabActions();
    }



    /**
     * 显示页签系统
     */
    showTabSystem() {
        if (this.systemContainer) {
            this.systemContainer.style.display = 'block';
        }
        this.updateTabActions();
    }

    /**
     * 隐藏页签系统
     */
    hideTabSystem() {
        if (this.systemContainer) {
            this.systemContainer.style.display = 'none';
        }
        // 清空内容容器
        if (this.contentContainer) {
            this.contentContainer.innerHTML = '';
        }
        this.activeTabId = null;
        this.updateTabActions();
    }

    /**
     * 更新页签操作按钮的显示状态
     */
    updateTabActions() {
        const tabActions = document.getElementById('tab-actions');
        if (tabActions) {
            // 当有页签时显示操作按钮，没有页签时隐藏
            if (this.tabs.size > 0 && this.systemContainer && this.systemContainer.style.display !== 'none') {
                tabActions.style.display = 'flex';
            } else {
                tabActions.style.display = 'none';
            }
        }
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 绑定页签点击事件（事件委托）
        this.tabContainer.addEventListener('click', (e) => {
            const tabItem = e.target.closest('.tab-item');
            const closeBtn = e.target.closest('.close-tab');
            
            if (closeBtn && tabItem) {
                // 点击关闭按钮
                e.preventDefault();
                e.stopPropagation();
                const tabId = tabItem.dataset.tabId;
                this.closeTab(tabId);
            } else if (tabItem) {
                // 点击页签
                const tabId = tabItem.dataset.tabId;
                this.activateTab(tabId);
            }
        });
        
        // 绑定页签右键菜单事件
        this.tabContainer.addEventListener('contextmenu', (e) => {
            const tabItem = e.target.closest('.tab-item');
            if (tabItem) {
                e.preventDefault();
                const tabId = tabItem.dataset.tabId;
                this.showContextMenu(e, tabId);
            }
        });
        
        // 点击其他地方隐藏右键菜单
        document.addEventListener('click', () => {
            this.hideContextMenu();
        });
        
        // 监听页面卸载事件，清理资源
        window.addEventListener('beforeunload', () => {
            this.tabs.clear();
        });
    }

    /**
     * 显示右键菜单
     * @param {Event} event - 右键点击事件
     * @param {string} tabId - 页签ID
     */
    showContextMenu(event, tabId) {
        this.contextMenuTabId = tabId;
        
        // 设置菜单位置
        this.contextMenu.style.left = event.pageX + 'px';
        this.contextMenu.style.top = event.pageY + 'px';
        
        // 显示菜单
        this.contextMenu.classList.remove('hidden');
        
        // 确保菜单在视窗内
        const rect = this.contextMenu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        if (rect.right > viewportWidth) {
            this.contextMenu.style.left = (event.pageX - rect.width) + 'px';
        }
        
        if (rect.bottom > viewportHeight) {
            this.contextMenu.style.top = (event.pageY - rect.height) + 'px';
        }
    }

    /**
     * 隐藏右键菜单
     */
    hideContextMenu() {
        if (this.contextMenu) {
            this.contextMenu.classList.add('hidden');
        }
        this.contextMenuTabId = null;
    }

    /**
     * 处理右键菜单操作
     * @param {string} action - 操作类型
     */
    handleContextMenuAction(action) {
        switch (action) {
            case 'close-others':
                this.closeOtherTabs(this.contextMenuTabId);
                break;
            case 'close-all':
                this.closeAllTabs();
                break;
        }
    }

    /**
     * 关闭其它页签
     * @param {string} keepTabId - 保留的页签ID
     */
    closeOtherTabs(keepTabId) {
        const tabsToClose = Array.from(this.tabs.keys()).filter(id => id !== keepTabId);
        
        tabsToClose.forEach(tabId => {
            // 移除页签元素
            const tabElement = this.tabContainer.querySelector(`[data-tab-id="${tabId}"]`);
            if (tabElement) {
                tabElement.remove();
            }
            // 从集合中移除
            this.tabs.delete(tabId);
        });
        
        // 激活保留的页签
        this.activateTab(keepTabId);
        
        // 更新操作按钮状态
        this.updateTabActions();
    }

    /**
      * 关闭全部页签
      */
     closeAllTabs() {
         // 清除所有页签元素
         this.tabContainer.innerHTML = '';
         
         // 清空页签集合
         this.tabs.clear();
         
         // 清除状态
         this.stateManager.clearState();
         
         // 跳转到首页页面
         const workspaceUrl = 'home-dashboard.html';
         if (window.location.pathname.split('/').pop() !== workspaceUrl) {
             // 如果当前不在首页页面，则跳转
             window.location.href = workspaceUrl;
         } else {
             // 如果已经在首页页面，隐藏页签系统并重新创建默认页签
             this.hideTabSystem();
             // 延迟一下重新创建默认页签，确保页面状态正确
             setTimeout(() => {
                 this.createDefaultTab(workspaceUrl);
             }, 100);
         }
         
         // 更新操作按钮状态
         this.updateTabActions();
     }

    /**
     * 获取当前激活的页签ID
     * @returns {string|null} 当前激活的页签ID
     */
    getActiveTabId() {
        return this.activeTabId;
    }

    /**
     * 获取所有页签信息
     * @returns {Map} 页签信息集合
     */
    getAllTabs() {
        return new Map(this.tabs);
    }
}

// 全局页签系统实例
let globalTabSystem = null;

/**
 * 初始化全局页签系统
 */
function initGlobalTabSystem() {
    if (!globalTabSystem) {
        globalTabSystem = new TabSystem();
        window.globalTabSystem = globalTabSystem;
    }
    return globalTabSystem;
}

/**
 * 打开页面页签（供菜单点击调用）
 * @param {string} pageUrl - 页面URL
 * @param {string} title - 页签标题
 */
function openPageTab(pageUrl, title) {
    if (!globalTabSystem) {
        initGlobalTabSystem();
    }
        // 先保存当前状态
        if (window.globalTabSystem.activeTabId) {
            window.globalTabSystem.saveCurrentState();
        }
        // 添加并激活新页签
        window.globalTabSystem.addTab(pageUrl, title);
}

// 导出函数到全局作用域
window.initGlobalTabSystem = initGlobalTabSystem;
window.openPageTab = openPageTab;

// 模块导出（如果支持）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TabSystem, initGlobalTabSystem, openPageTab };
}
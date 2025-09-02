/**
 * Tab组件 - 可复用的标签页组件
 * 使用方法：
 * 1. 在HTML中创建tab容器和内容区域
 * 2. 初始化：const tabComponent = new TabComponent('tab-container-id', tabs配置)
 * 3. 调用：tabComponent.init()
 */

class TabComponent {
    constructor(containerId, config = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.tabs = config.tabs || [];
        this.defaultTab = config.defaultTab || (this.tabs.length > 0 ? this.tabs[0].id : null);
        this.onTabChange = config.onTabChange || null;
        
        if (!this.container) {
            console.error(`Tab容器 ${containerId} 未找到`);
            return;
        }
    }
    
    /**
     * 初始化tab组件
     */
    init() {
        this.render();
        this.bindEvents();
        if (this.defaultTab) {
            this.switchTab(this.defaultTab);
        }
    }
    
    /**
     * 渲染tab导航和内容区域
     */
    render() {
        const tabNavHtml = this.renderTabNavigation();
        const tabContentHtml = this.renderTabContent();
        
        this.container.innerHTML = `
            <div class="tab-component">
                ${tabNavHtml}
                ${tabContentHtml}
            </div>
        `;
    }
    
    /**
     * 渲染tab导航栏
     */
    renderTabNavigation() {
        const tabButtons = this.tabs.map(tab => `
            <button 
                id="tab-btn-${tab.id}" 
                data-tab="${tab.id}"
                class="tab-button py-2 px-4 font-medium text-sm transition-all duration-200 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                ${tab.title}
            </button>
        `).join('');
        
        return `
            <div class="mb-6">
                <nav class="flex space-x-6 border-b border-gray-200">
                    ${tabButtons}
                </nav>
            </div>
        `;
    }
    
    /**
     * 渲染tab内容区域
     */
    renderTabContent() {
        const tabContents = this.tabs.map(tab => `
            <div id="tab-content-${tab.id}" class="tab-content hidden">
                ${tab.content || ''}
            </div>
        `).join('');
        
        return `
            <div class="tab-content-container">
                ${tabContents}
            </div>
        `;
    }
    
    /**
     * 绑定事件监听器
     */
    bindEvents() {
        const tabButtons = this.container.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    }
    
    /**
     * 切换tab
     * @param {string} tabId - tab的ID
     */
    switchTab(tabId) {
        // 重置所有tab按钮样式
        const tabButtons = this.container.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.classList.remove('border-blue-500', 'text-blue-600');
            button.classList.add('border-transparent', 'text-gray-500');
        });
        
        // 隐藏所有tab内容
        const tabContents = this.container.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.add('hidden');
        });
        
        // 激活当前选中的tab按钮
        const activeButton = this.container.querySelector(`[data-tab="${tabId}"]`);
        if (activeButton) {
            activeButton.classList.remove('border-transparent', 'text-gray-500');
            activeButton.classList.add('border-blue-500', 'text-blue-600');
        }
        
        // 显示对应的tab内容
        const activeContent = this.container.querySelector(`#tab-content-${tabId}`);
        if (activeContent) {
            activeContent.classList.remove('hidden');
        }
        
        // 触发回调函数
        if (this.onTabChange && typeof this.onTabChange === 'function') {
            this.onTabChange(tabId, this.getTabById(tabId));
        }
        
        console.log(`切换到${tabId}标签页`);
    }
    
    /**
     * 根据ID获取tab配置
     * @param {string} tabId - tab的ID
     * @returns {object} tab配置对象
     */
    getTabById(tabId) {
        return this.tabs.find(tab => tab.id === tabId);
    }
    
    /**
     * 添加新的tab
     * @param {object} tabConfig - tab配置
     */
    addTab(tabConfig) {
        this.tabs.push(tabConfig);
        this.render();
        this.bindEvents();
    }
    
    /**
     * 移除tab
     * @param {string} tabId - tab的ID
     */
    removeTab(tabId) {
        this.tabs = this.tabs.filter(tab => tab.id !== tabId);
        this.render();
        this.bindEvents();
    }
    
    /**
     * 更新tab内容
     * @param {string} tabId - tab的ID
     * @param {string} content - 新的内容HTML
     */
    updateTabContent(tabId, content) {
        const tab = this.getTabById(tabId);
        if (tab) {
            tab.content = content;
            const contentElement = this.container.querySelector(`#tab-content-${tabId}`);
            if (contentElement) {
                contentElement.innerHTML = content;
            }
        }
    }
    
    /**
     * 获取当前激活的tab ID
     * @returns {string} 当前激活的tab ID
     */
    getActiveTab() {
        const activeButton = this.container.querySelector('.tab-button.border-blue-500');
        return activeButton ? activeButton.getAttribute('data-tab') : null;
    }
    
    /**
     * 销毁组件
     */
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// 导出组件（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TabComponent;
}

// 全局注册（如果直接在浏览器中使用）
if (typeof window !== 'undefined') {
    window.TabComponent = TabComponent;
}
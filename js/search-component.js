/**
 * 搜索组件 - 可复用的搜索输入框和按钮组合
 * 作者：AI助手
 * 创建时间：2024
 */

class SearchComponent {
    /**
     * 构造函数
     * @param {Object} options 配置选项
     * @param {string|HTMLElement} options.containerId 容器元素ID或容器元素对象
     * @param {HTMLElement} options.container 容器元素对象（可选，优先级高于containerId）
     * @param {string} options.placeholder 输入框占位符文本
     * @param {Function} options.onSearch 搜索回调函数
     * @param {Function} options.onReset 重置回调函数
     * @param {string} options.label 标签文本，默认为'搜索'
     * @param {boolean} options.showLabel 是否显示标签，默认true
     */
    constructor(options = {}) {
        this.containerId = options.containerId;
        this.container = options.container || null;
        this.placeholder = options.placeholder || '请输入搜索关键词';
        this.onSearch = options.onSearch || this.defaultSearch;
        this.onReset = options.onReset || this.defaultReset;
        this.label = options.label || '搜索';
        this.showLabel = options.showLabel !== false;
        
        this.searchInput = null;
        this.searchButton = null;
        this.resetButton = null;
        
        this.init();
    }
    
    /**
     * 初始化组件
     */
    init() {
        // 如果直接传递了container对象，优先使用
        if (!this.container) {
            if (!this.containerId) {
                console.error('SearchComponent: containerId or container is required');
                return;
            }
            
            this.container = document.getElementById(this.containerId);
            if (!this.container) {
                console.error(`SearchComponent: Container with id '${this.containerId}' not found`);
                return;
            }
        }
        
        this.render();
        this.bindEvents();
    }
    
    /**
     * 渲染组件HTML
     */
    render() {
        const labelHtml = this.showLabel ? 
            `<label class="block text-sm font-medium text-gray-700 mb-2">${this.label}</label>` : '';
        
        this.container.innerHTML = `
            <div class="flex items-end gap-2">
                <div class="flex-1">
                    ${labelHtml}
                    <div class="flex">
                        <input type="text" 
                               id="${this.containerId}_input"
                               placeholder="${this.placeholder}" 
                               class="flex-1 px-3 h-10 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <button id="${this.containerId}_search"
                                class="px-4 h-10 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors border border-blue-600">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
                <div class="flex items-end">
                    <button id="${this.containerId}_reset"
                            class="px-4 h-10 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center whitespace-nowrap">
                        <i class="fas fa-undo mr-1"></i>重置
                    </button>
                </div>
            </div>
        `;
        
        // 获取元素引用
        this.searchInput = document.getElementById(`${this.containerId}_input`);
        this.searchButton = document.getElementById(`${this.containerId}_search`);
        this.resetButton = document.getElementById(`${this.containerId}_reset`);
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        if (!this.searchInput || !this.searchButton || !this.resetButton) {
            console.error('SearchComponent: Failed to bind events - elements not found');
            return;
        }
        
        // 搜索按钮点击事件
        this.searchButton.addEventListener('click', () => {
            this.handleSearch();
        });
        
        // 输入框回车事件
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
        
        // 重置按钮点击事件
        this.resetButton.addEventListener('click', () => {
            this.handleReset();
        });
    }
    
    /**
     * 处理搜索
     */
    handleSearch() {
        const searchValue = this.searchInput.value.trim();
        this.onSearch(searchValue);
    }
    
    /**
     * 处理重置
     */
    handleReset() {
        this.searchInput.value = '';
        this.onReset();
    }
    
    /**
     * 获取搜索值
     * @returns {string} 当前搜索输入框的值
     */
    getValue() {
        return this.searchInput ? this.searchInput.value.trim() : '';
    }
    
    /**
     * 设置搜索值
     * @param {string} value 要设置的值
     */
    setValue(value) {
        if (this.searchInput) {
            this.searchInput.value = value || '';
        }
    }
    
    /**
     * 清空搜索框
     */
    clear() {
        this.setValue('');
    }
    
    /**
     * 聚焦到搜索框
     */
    focus() {
        if (this.searchInput) {
            this.searchInput.focus();
        }
    }
    
    /**
     * 默认搜索处理函数
     * @param {string} searchValue 搜索值
     */
    defaultSearch(searchValue) {
        console.log('SearchComponent: 搜索关键词:', searchValue);
    }
    
    /**
     * 默认重置处理函数
     */
    defaultReset() {
        console.log('SearchComponent: 重置搜索');
    }
    
    /**
     * 销毁组件
     */
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.container = null;
        this.searchInput = null;
        this.searchButton = null;
        this.resetButton = null;
    }
}

// 导出组件（支持多种模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchComponent;
} else if (typeof define === 'function' && define.amd) {
    define([], function() {
        return SearchComponent;
    });
} else {
    window.SearchComponent = SearchComponent;
}

// ES6模块导出（仅在模块环境中）
if (typeof exports !== 'undefined') {
    exports.SearchComponent = SearchComponent;
}

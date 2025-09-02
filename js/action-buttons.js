/**
 * 操作按钮组件 - 可复用的操作按钮组合
 * 作者：AI助手
 * 创建时间：2024
 */

class ActionButtons {
    /**
     * 构造函数
     * @param {Object} options 配置选项
     * @param {string} options.containerId 容器元素ID
     * @param {HTMLElement} options.container 容器元素对象（可选，优先级高于containerId）
     * @param {Object} options.callbacks 回调函数对象
     * @param {Function} options.callbacks.onAdd 新增回调
     * @param {Function} options.callbacks.onImport 导入回调
     * @param {Function} options.callbacks.onDownload 下载回调
     * @param {Function} options.callbacks.onExport 导出回调
     * @param {Object} options.buttonTexts 按钮文本配置
     * @param {string} options.buttonTexts.add 新增按钮文本
     * @param {string} options.buttonTexts.import 导入按钮文本
     * @param {string} options.buttonTexts.download 下载按钮文本
     * @param {string} options.buttonTexts.export 导出按钮文本
     * @param {Array} options.buttons 自定义按钮配置数组
     */
    constructor(options = {}) {
        this.containerId = options.containerId;
        this.container = options.container || null;
        this.callbacks = options.callbacks || {};
        this.buttonTexts = {
            add: '新增',
            import: '导入',
            download: '下载模板',
            export: '导出',
            ...options.buttonTexts
        };
        this.buttons = options.buttons || [
            { key: 'add', type: 'primary', icon: 'fas fa-plus' },
            { key: 'import', type: 'secondary', icon: 'fas fa-upload' },
            { key: 'download', type: 'secondary', icon: 'fas fa-download' },
            { key: 'export', type: 'secondary', icon: 'fas fa-file-export' }
        ];
        
        this.buttonElements = {};
        
        this.init();
    }

    /**
     * 初始化组件
     */
    init() {
        // 如果直接传递了container对象，优先使用
        if (!this.container) {
            if (!this.containerId) {
                console.error('ActionButtons: containerId or container is required');
                return;
            }
            
            this.container = document.getElementById(this.containerId);
            if (!this.container) {
                console.error(`ActionButtons: Container with id '${this.containerId}' not found`);
                return;
            }
        }

        this.render();
        this.bindEvents();
    }

    /**
     * 渲染按钮组件
     */
    render() {
        if (!this.container) return;

        let html = '<div class="flex flex-wrap gap-3">';
        
        this.buttons.forEach(button => {
            const buttonText = this.buttonTexts[button.key] || button.key;
            const buttonClass = this.getButtonClass(button.type);
            const iconClass = button.icon || '';
            
            html += `
                <button type="button" 
                        id="${this.containerId}_${button.key}" 
                        class="${buttonClass}">
                    ${iconClass ? `<i class="${iconClass} mr-2"></i>` : ''}
                    ${buttonText}
                </button>
            `;
        });
        
        html += '</div>';
        this.container.innerHTML = html;
        
        // 获取按钮元素引用
        this.buttons.forEach(button => {
            this.buttonElements[button.key] = document.getElementById(`${this.containerId}_${button.key}`);
        });
    }

    /**
     * 获取按钮样式类
     * @param {string} type 按钮类型
     * @returns {string} CSS类名
     */
    getButtonClass(type) {
        const baseClass = 'inline-flex items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
        
        switch (type) {
            case 'primary':
                return `${baseClass} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
            case 'secondary':
                return `${baseClass} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500`;
            case 'success':
                return `${baseClass} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`;
            case 'warning':
                return `${baseClass} bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500`;
            case 'danger':
                return `${baseClass} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;
            default:
                return `${baseClass} bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500`;
        }
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        this.buttons.forEach(button => {
            const buttonElement = this.buttonElements[button.key];
            const callback = this.callbacks[`on${this.capitalize(button.key)}`];
            
            if (buttonElement && callback && typeof callback === 'function') {
                buttonElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    callback();
                });
            }
        });
    }

    /**
     * 首字母大写
     * @param {string} str 字符串
     * @returns {string} 首字母大写的字符串
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * 设置按钮停用状态
     * @param {string} buttonKey 按钮键名
     * @param {boolean} disabled 是否停用
     */
    setButtonDisabled(buttonKey, disabled) {
        const button = this.buttonElements[buttonKey];
        if (button) {
            button.disabled = disabled;
            if (disabled) {
                button.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                button.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    }

    /**
     * 显示/隐藏按钮
     * @param {string} buttonKey 按钮键名
     * @param {boolean} visible 是否显示
     */
    setButtonVisible(buttonKey, visible) {
        const button = this.buttonElements[buttonKey];
        if (button) {
            button.style.display = visible ? 'inline-flex' : 'none';
        }
    }

    /**
     * 更新按钮文本
     * @param {string} buttonKey 按钮键名
     * @param {string} text 新文本
     */
    setButtonText(buttonKey, text) {
        const button = this.buttonElements[buttonKey];
        if (button) {
            const icon = button.querySelector('i');
            const iconHtml = icon ? icon.outerHTML + ' ' : '';
            button.innerHTML = iconHtml + text;
        }
    }

    /**
     * 销毁组件
     */
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.buttonElements = {};
    }

    /**
     * 默认回调函数
     */
    defaultCallback(action) {
        console.log(`ActionButtons: ${action} button clicked, but no callback provided`);
    }
}

// 导出组件
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ActionButtons;
}

// ES6模块导出（仅在模块环境中）
if (typeof exports !== 'undefined') {
    exports.ActionButtons = ActionButtons;
}

// 全局导出
if (typeof window !== 'undefined') {
    window.ActionButtons = ActionButtons;
}
/**
 * 状态滑块开关组件
 * 提供可复用的Toggle Switch功能
 * 
 * @author AI Assistant
 * @version 1.0.0
 */

class ToggleSwitch {
    /**
     * 构造函数
     * @param {Object} options 配置选项
     * @param {string} options.containerId 容器ID
     * @param {string} options.id 开关唯一标识
     * @param {boolean} options.checked 初始状态（默认false）
     * @param {Function} options.onChange 状态改变回调函数
     * @param {boolean} options.disabled 是否停用（默认false）
     * @param {string} options.size 尺寸大小（'sm'|'md'|'lg'，默认'md'）
     */
    constructor(options = {}) {
        this.containerId = options.containerId;
        this.id = options.id || 'toggle-' + Date.now();
        this.checked = options.checked || false;
        this.onChange = options.onChange || function() {};
        this.disabled = options.disabled || false;
        this.size = options.size || 'md';
        
        // 尺寸配置
        this.sizeConfig = {
            'sm': {
                width: 'w-8',
                height: 'h-4',
                dot: 'h-3 w-3',
                dotPosition: 'after:top-[2px] after:left-[2px]',
                dotTranslate: 'peer-checked:after:translate-x-4'
            },
            'md': {
                width: 'w-11',
                height: 'h-6',
                dot: 'h-5 w-5',
                dotPosition: 'after:top-[2px] after:left-[2px]',
                dotTranslate: 'peer-checked:after:translate-x-5'
            },
            'lg': {
                width: 'w-14',
                height: 'h-7',
                dot: 'h-6 w-6',
                dotPosition: 'after:top-[2px] after:left-[2px]',
                dotTranslate: 'peer-checked:after:translate-x-7'
            }
        };
        
        this.init();
    }
    
    /**
     * 初始化组件
     */
    init() {
        if (!this.containerId) {
            console.error('ToggleSwitch: containerId is required');
            return;
        }
        
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`ToggleSwitch: Container with id '${this.containerId}' not found`);
            return;
        }
        
        container.innerHTML = this.render();
        this.bindEvents();
    }
    
    /**
     * 渲染组件HTML
     * @returns {string} HTML字符串
     */
    render() {
        const config = this.sizeConfig[this.size];
        const disabledClass = this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
        const checkedAttr = this.checked ? 'checked' : '';
        
        // 使用内联样式确保宽度正确显示
        const sizeStyles = {
            'sm': { width: '32px', height: '16px', dotSize: '12px' },
            'md': { width: '44px', height: '24px', dotSize: '20px' },
            'lg': { width: '56px', height: '28px', dotSize: '24px' }
        };
        
        const currentSize = sizeStyles[this.size];
        
        return `
            <label class="relative inline-flex items-center ${disabledClass}" style="min-width: ${currentSize.width}; margin: 0; padding: 0;">
                <input 
                    type="checkbox" 
                    id="${this.id}"
                    class="sr-only" 
                    ${checkedAttr}
                    ${this.disabled ? 'disabled' : ''}
                >
                <div style="width: ${currentSize.width}; height: ${currentSize.height}; min-width: ${currentSize.width}; margin: 0; background-color: ${this.checked ? '#2563eb' : '#e5e7eb'}; border-radius: 9999px; position: relative; transition: background-color 0.2s ease-in-out;">
                    <span style="width: ${currentSize.dotSize}; height: ${currentSize.dotSize}; top: 2px; left: 2px; position: absolute; background-color: white; border: 1px solid #d1d5db; border-radius: 9999px; transition: transform 0.2s ease-in-out; transform: translateX(${this.checked ? 'calc(' + currentSize.width + ' - ' + currentSize.dotSize + ' - 4px)' : '0'});"></span>
                </div>
            </label>
        `;
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        const checkbox = document.getElementById(this.id);
        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                this.checked = e.target.checked;
                
                // 重新渲染以更新视觉状态
                this.updateDisplay();
                
                this.onChange(this.checked, this.id, e);
            });
        }
    }
    
    /**
     * 更新显示
     */
    updateDisplay() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = this.render();
            this.bindEvents();
        }
    }
    
    /**
     * 获取当前状态
     * @returns {boolean} 当前选中状态
     */
    getValue() {
        return this.checked;
    }
    
    /**
     * 设置状态
     * @param {boolean} checked 要设置的状态
     * @param {boolean} triggerChange 是否触发change事件（默认true）
     */
    setValue(checked, triggerChange = true) {
        this.checked = checked;
        
        const checkbox = document.getElementById(this.id);
        if (checkbox) {
            checkbox.checked = checked;
        }
        
        if (triggerChange) {
            if (checkbox) {
                checkbox.dispatchEvent(new Event('change'));
            }
        }
    }
    
    /**
     * 启用组件
     */
    enable() {
        this.disabled = false;
        const container = document.getElementById(this.containerId);
        if (container) {
            const label = container.querySelector('label');
            const checkbox = container.querySelector('input');
            if (label) {
                label.classList.remove('opacity-50', 'cursor-not-allowed');
                label.classList.add('cursor-pointer');
            }
            if (checkbox) {
                checkbox.disabled = false;
            }
        }
    }
    
    /**
     * 停用组件
     */
    disable() {
        this.disabled = true;
        const container = document.getElementById(this.containerId);
        if (container) {
            const label = container.querySelector('label');
            const checkbox = container.querySelector('input');
            if (label) {
                label.classList.add('opacity-50', 'cursor-not-allowed');
                label.classList.remove('cursor-pointer');
            }
            if (checkbox) {
                checkbox.disabled = true;
            }
        }
    }
    
    /**
     * 销毁组件
     */
    destroy() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = '';
        }
    }
    
    /**
     * 静态方法：创建多个开关实例
     * @param {Array} configs 配置数组
     * @returns {Array} ToggleSwitch实例数组
     */
    static createMultiple(configs) {
        return configs.map(config => new ToggleSwitch(config));
    }
    
    /**
     * 静态方法：批量设置状态
     * @param {Array} switches ToggleSwitch实例数组
     * @param {boolean} checked 要设置的状态
     */
    static setBatchValue(switches, checked) {
        switches.forEach(toggle => {
            if (toggle instanceof ToggleSwitch) {
                toggle.setValue(checked);
            }
        });
    }
}

// 如果在浏览器环境中，将组件添加到全局对象
if (typeof window !== 'undefined') {
    window.ToggleSwitch = ToggleSwitch;
}

// 如果在Node.js环境中，导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToggleSwitch;
}
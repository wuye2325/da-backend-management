/**
 * Modal 通用模态框组件
 * 支持自定义内容、大小、位置等功能
 */

class Modal {
    /**
     * 构造函数
     * @param {Object} options - 配置选项
     * @param {string} options.id - 模态框ID
     * @param {string} options.title - 标题
     * @param {string} options.content - 内容HTML
     * @param {string} options.size - 大小 'sm'|'md'|'lg'|'xl'|'full'
     * @param {boolean} options.closable - 是否可关闭
     * @param {boolean} options.maskClosable - 点击遮罩是否关闭
     * @param {Array} options.buttons - 按钮配置
     * @param {Function} options.onOpen - 打开回调
     * @param {Function} options.onClose - 关闭回调
     */
    constructor(options = {}) {
        this.id = options.id || `modal-${Date.now()}`;
        this.title = options.title || '';
        this.content = options.content || '';
        this.size = options.size || 'md';
        this.closable = options.closable !== false;
        this.maskClosable = options.maskClosable !== false;
        this.buttons = options.buttons || [];
        this.onOpen = options.onOpen;
        this.onClose = options.onClose;
        
        this.isVisible = false;
        this.element = null;
        
        this.init();
    }
    
    /**
     * 初始化模态框
     */
    init() {
        this.createElement();
        this.bindEvents();
    }
    
    /**
     * 创建模态框元素
     */
    createElement() {
        // 如果已存在则先移除
        const existing = document.getElementById(this.id);
        if (existing) {
            existing.remove();
        }
        
        const modalHtml = `
            <div id="${this.id}" class="modal-overlay hidden" role="dialog" aria-modal="true" aria-labelledby="${this.id}-title">
                <div class="modal-backdrop" aria-hidden="true"></div>
                <div class="modal-container">
                    <div class="modal-content modal-${this.size}">
                        ${this.renderHeader()}
                        ${this.renderBody()}
                        ${this.renderFooter()}
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.element = document.getElementById(this.id);
    }
    
    /**
     * 渲染头部
     */
    renderHeader() {
        if (!this.title && !this.closable) {
            return '';
        }
        
        return `
            <div class="modal-header">
                ${this.title ? `<h3 id="${this.id}-title" class="modal-title">${this.title}</h3>` : ''}
                ${this.closable ? `
                    <button type="button" 
                            class="modal-close" 
                            onclick="${this.id}Instance.close()"
                            aria-label="关闭">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </div>
        `;
    }
    
    /**
     * 渲染主体
     */
    renderBody() {
        return `
            <div class="modal-body">
                ${this.content}
            </div>
        `;
    }
    
    /**
     * 渲染底部
     */
    renderFooter() {
        if (!this.buttons || this.buttons.length === 0) {
            return '';
        }
        
        const buttonsHtml = this.buttons.map((button, index) => {
            const btnClass = this.getButtonClass(button.type || 'default');
            const disabled = button.disabled ? 'disabled' : '';
            const loading = button.loading ? 'loading' : '';
            
            return `
                <button type="button" 
                        class="${btnClass} ${disabled} ${loading}" 
                        onclick="${this.id}Instance.handleButtonClick(${index})"
                        ${button.disabled ? 'disabled' : ''}>
                    ${button.loading ? '<i class="fas fa-spinner fa-spin mr-2"></i>' : ''}
                    ${button.icon ? `<i class="${button.icon} mr-2"></i>` : ''}
                    ${button.text}
                </button>
            `;
        }).join('');
        
        return `
            <div class="modal-footer">
                ${buttonsHtml}
            </div>
        `;
    }
    
    /**
     * 获取按钮样式类
     */
    getButtonClass(type) {
        const baseClass = 'btn';
        
        switch (type) {
            case 'primary':
                return `${baseClass} btn-primary`;
            case 'success':
                return `${baseClass} btn-success`;
            case 'danger':
                return `${baseClass} btn-danger`;
            case 'warning':
                return `${baseClass} btn-warning`;
            case 'outline':
                return `${baseClass} btn-outline`;
            default:
                return `${baseClass} btn-secondary`;
        }
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 将实例绑定到全局
        window[`${this.id}Instance`] = this;
        
        if (!this.element) return;
        
        // 遮罩点击事件
        if (this.maskClosable) {
            const backdrop = this.element.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.addEventListener('click', () => {
                    this.close();
                });
            }
        }
        
        // ESC键关闭
        if (this.closable) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isVisible) {
                    this.close();
                }
            });
        }
        
        // 阻止模态框内容区域的点击事件冒泡
        const modalContent = this.element.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }
    
    /**
     * 显示模态框
     */
    show() {
        if (this.isVisible) return;
        
        this.isVisible = true;
        
        // 添加body类，防止背景滚动
        document.body.classList.add('modal-open');
        
        // 显示模态框
        this.element.classList.remove('hidden');
        
        // 添加动画
        requestAnimationFrame(() => {
            this.element.classList.add('modal-show');
        });
        
        // 聚焦到模态框
        this.element.focus();
        
        // 触发打开回调
        if (this.onOpen) {
            this.onOpen();
        }
        
        return this;
    }
    
    /**
     * 隐藏模态框
     */
    hide() {
        if (!this.isVisible) return;
        
        this.isVisible = false;
        
        // 移除动画类
        this.element.classList.remove('modal-show');
        
        // 延迟隐藏，等待动画完成
        setTimeout(() => {
            this.element.classList.add('hidden');
            
            // 移除body类
            if (!document.querySelector('.modal-overlay:not(.hidden)')) {
                document.body.classList.remove('modal-open');
            }
        }, 300);
        
        // 触发关闭回调
        if (this.onClose) {
            this.onClose();
        }
        
        return this;
    }
    
    /**
     * 关闭模态框（别名）
     */
    close() {
        return this.hide();
    }
    
    /**
     * 处理按钮点击事件
     */
    handleButtonClick(index) {
        const button = this.buttons[index];
        if (!button || button.disabled) return;
        
        // 执行按钮回调
        if (button.onClick) {
            const result = button.onClick(this);
            
            // 如果回调返回Promise，处理loading状态
            if (result && typeof result.then === 'function') {
                this.setButtonLoading(index, true);
                
                result.finally(() => {
                    this.setButtonLoading(index, false);
                });
            }
        }
        
        // 如果按钮配置了自动关闭
        if (button.autoClose !== false) {
            this.close();
        }
    }
    
    /**
     * 设置按钮加载状态
     */
    setButtonLoading(index, loading) {
        const button = this.buttons[index];
        if (!button) return;
        
        button.loading = loading;
        
        // 重新渲染底部
        const footer = this.element.querySelector('.modal-footer');
        if (footer) {
            footer.innerHTML = this.renderFooter().match(/<div class="modal-footer">(.*?)<\/div>/s)[1];
        }
    }
    
    /**
     * 设置按钮停用状态
     */
    setButtonDisabled(index, disabled) {
        const button = this.buttons[index];
        if (!button) return;
        
        button.disabled = disabled;
        
        // 重新渲染底部
        const footer = this.element.querySelector('.modal-footer');
        if (footer) {
            footer.innerHTML = this.renderFooter().match(/<div class="modal-footer">(.*?)<\/div>/s)[1];
        }
    }
    
    /**
     * 更新标题
     */
    setTitle(title) {
        this.title = title;
        
        const titleElement = this.element.querySelector('.modal-title');
        if (titleElement) {
            titleElement.textContent = title;
        }
        
        return this;
    }
    
    /**
     * 更新内容
     */
    setContent(content) {
        this.content = content;
        
        const bodyElement = this.element.querySelector('.modal-body');
        if (bodyElement) {
            bodyElement.innerHTML = content;
        }
        
        return this;
    }
    
    /**
     * 更新按钮
     */
    setButtons(buttons) {
        this.buttons = buttons || [];
        
        const footer = this.element.querySelector('.modal-footer');
        if (footer) {
            if (this.buttons.length === 0) {
                footer.remove();
            } else {
                footer.innerHTML = this.renderFooter().match(/<div class="modal-footer">(.*?)<\/div>/s)[1];
            }
        } else if (this.buttons.length > 0) {
            // 如果之前没有footer，现在需要添加
            const modalContent = this.element.querySelector('.modal-content');
            modalContent.insertAdjacentHTML('beforeend', this.renderFooter());
        }
        
        return this;
    }
    
    /**
     * 获取模态框元素
     */
    getElement() {
        return this.element;
    }
    
    /**
     * 检查是否可见
     */
    isOpen() {
        return this.isVisible;
    }
    
    /**
     * 销毁模态框
     */
    destroy() {
        // 先隐藏
        this.hide();
        
        // 延迟销毁，等待动画完成
        setTimeout(() => {
            if (this.element) {
                this.element.remove();
            }
            
            // 清理全局引用
            if (window[`${this.id}Instance`]) {
                delete window[`${this.id}Instance`];
            }
        }, 300);
    }
    
    /**
     * 静态方法：创建确认对话框
     */
    static confirm(options = {}) {
        const modal = new Modal({
            id: `confirm-${Date.now()}`,
            title: options.title || '确认',
            content: options.content || '确定要执行此操作吗？',
            size: options.size || 'sm',
            closable: options.closable !== false,
            maskClosable: options.maskClosable !== false,
            buttons: [
                {
                    text: options.cancelText || '取消',
                    type: 'outline',
                    onClick: () => {
                        if (options.onCancel) {
                            options.onCancel();
                        }
                    }
                },
                {
                    text: options.okText || '确定',
                    type: options.okType || 'primary',
                    onClick: () => {
                        if (options.onOk) {
                            return options.onOk();
                        }
                    }
                }
            ]
        });
        
        modal.show();
        return modal;
    }
    
    /**
     * 静态方法：创建警告对话框
     */
    static alert(options = {}) {
        const modal = new Modal({
            id: `alert-${Date.now()}`,
            title: options.title || '提示',
            content: options.content || '',
            size: options.size || 'sm',
            closable: options.closable !== false,
            maskClosable: options.maskClosable !== false,
            buttons: [
                {
                    text: options.okText || '确定',
                    type: options.okType || 'primary',
                    onClick: () => {
                        if (options.onOk) {
                            options.onOk();
                        }
                    }
                }
            ]
        });
        
        modal.show();
        return modal;
    }
    
    /**
     * 静态方法：创建信息对话框
     */
    static info(content, title = '信息') {
        return Modal.alert({
            title,
            content,
            okType: 'primary'
        });
    }
    
    /**
     * 静态方法：创建成功对话框
     */
    static success(content, title = '成功') {
        return Modal.alert({
            title,
            content: `<div class="flex items-center"><i class="fas fa-check-circle text-green-500 text-xl mr-3"></i><span>${content}</span></div>`,
            okType: 'success'
        });
    }
    
    /**
     * 静态方法：创建错误对话框
     */
    static error(content, title = '错误') {
        return Modal.alert({
            title,
            content: `<div class="flex items-center"><i class="fas fa-exclamation-circle text-red-500 text-xl mr-3"></i><span>${content}</span></div>`,
            okType: 'danger'
        });
    }
    
    /**
     * 静态方法：创建警告对话框
     */
    static warning(content, title = '警告') {
        return Modal.alert({
            title,
            content: `<div class="flex items-center"><i class="fas fa-exclamation-triangle text-yellow-500 text-xl mr-3"></i><span>${content}</span></div>`,
            okType: 'warning'
        });
    }
}

// 导出组件
window.Modal = Modal;
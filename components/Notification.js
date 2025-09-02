/**
 * Notification 通知组件
 * 支持多种类型的通知消息显示
 */

class Notification {
    /**
     * 构造函数
     * @param {Object} options - 配置选项
     * @param {string} options.type - 通知类型 'info'|'success'|'warning'|'error'
     * @param {string} options.title - 标题
     * @param {string} options.message - 消息内容
     * @param {number} options.duration - 显示时长(毫秒)，0表示不自动关闭
     * @param {boolean} options.closable - 是否可关闭
     * @param {string} options.position - 显示位置
     * @param {Function} options.onClose - 关闭回调
     */
    constructor(options = {}) {
        this.id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.type = options.type || 'info';
        this.title = options.title || '';
        this.message = options.message || '';
        this.duration = options.duration !== undefined ? options.duration : 4500;
        this.closable = options.closable !== false;
        this.position = options.position || 'top-right';
        this.onClose = options.onClose;
        
        this.element = null;
        this.timer = null;
        
        this.init();
    }
    
    /**
     * 初始化通知
     */
    init() {
        this.createElement();
        this.show();
        
        if (this.duration > 0) {
            this.startTimer();
        }
    }
    
    /**
     * 创建通知元素
     */
    createElement() {
        const container = this.getContainer();
        
        const iconClass = this.getIconClass();
        const typeClass = this.getTypeClass();
        
        const notificationHtml = `
            <div id="${this.id}" 
                 class="notification ${typeClass}" 
                 role="alert" 
                 aria-live="polite">
                <div class="notification-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="notification-content">
                    ${this.title ? `<div class="notification-title">${this.escapeHtml(this.title)}</div>` : ''}
                    ${this.message ? `<div class="notification-message">${this.escapeHtml(this.message)}</div>` : ''}
                </div>
                ${this.closable ? `
                    <button type="button" 
                            class="notification-close" 
                            onclick="${this.id}Instance.close()"
                            aria-label="关闭通知">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
                ${this.duration > 0 ? `<div class="notification-progress"></div>` : ''}
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', notificationHtml);
        this.element = document.getElementById(this.id);
        
        // 绑定实例到全局
        window[`${this.id}Instance`] = this;
    }
    
    /**
     * 获取或创建容器
     */
    getContainer() {
        const containerId = `notification-container-${this.position}`;
        let container = document.getElementById(containerId);
        
        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            container.className = `notification-container notification-${this.position}`;
            document.body.appendChild(container);
        }
        
        return container;
    }
    
    /**
     * 获取图标类
     */
    getIconClass() {
        switch (this.type) {
            case 'success':
                return 'fas fa-check-circle';
            case 'warning':
                return 'fas fa-exclamation-triangle';
            case 'error':
                return 'fas fa-exclamation-circle';
            case 'info':
            default:
                return 'fas fa-info-circle';
        }
    }
    
    /**
     * 获取类型样式类
     */
    getTypeClass() {
        return `notification-${this.type}`;
    }
    
    /**
     * 显示通知
     */
    show() {
        if (!this.element) return;
        
        // 添加显示动画
        requestAnimationFrame(() => {
            this.element.classList.add('notification-show');
        });
        
        return this;
    }
    
    /**
     * 隐藏通知
     */
    hide() {
        if (!this.element) return;
        
        // 停止计时器
        this.stopTimer();
        
        // 添加隐藏动画
        this.element.classList.add('notification-hide');
        
        // 延迟移除元素
        setTimeout(() => {
            this.destroy();
        }, 300);
        
        return this;
    }
    
    /**
     * 关闭通知
     */
    close() {
        // 触发关闭回调
        if (this.onClose) {
            this.onClose(this);
        }
        
        this.hide();
    }
    
    /**
     * 开始计时器
     */
    startTimer() {
        if (this.duration <= 0) return;
        
        // 更新进度条
        const progressBar = this.element?.querySelector('.notification-progress');
        if (progressBar) {
            progressBar.style.animationDuration = `${this.duration}ms`;
            progressBar.classList.add('notification-progress-active');
        }
        
        this.timer = setTimeout(() => {
            this.close();
        }, this.duration);
    }
    
    /**
     * 停止计时器
     */
    stopTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        
        const progressBar = this.element?.querySelector('.notification-progress');
        if (progressBar) {
            progressBar.classList.remove('notification-progress-active');
        }
    }
    
    /**
     * 暂停自动关闭
     */
    pause() {
        this.stopTimer();
        
        const progressBar = this.element?.querySelector('.notification-progress');
        if (progressBar) {
            progressBar.style.animationPlayState = 'paused';
        }
    }
    
    /**
     * 恢复自动关闭
     */
    resume() {
        if (this.duration > 0) {
            this.startTimer();
        }
        
        const progressBar = this.element?.querySelector('.notification-progress');
        if (progressBar) {
            progressBar.style.animationPlayState = 'running';
        }
    }
    
    /**
     * 更新内容
     */
    update(options = {}) {
        if (options.title !== undefined) {
            this.title = options.title;
            const titleElement = this.element?.querySelector('.notification-title');
            if (titleElement) {
                titleElement.textContent = this.title;
            }
        }
        
        if (options.message !== undefined) {
            this.message = options.message;
            const messageElement = this.element?.querySelector('.notification-message');
            if (messageElement) {
                messageElement.textContent = this.message;
            }
        }
        
        if (options.type !== undefined) {
            // 更新类型
            const oldTypeClass = this.getTypeClass();
            this.type = options.type;
            const newTypeClass = this.getTypeClass();
            
            if (this.element) {
                this.element.classList.remove(oldTypeClass);
                this.element.classList.add(newTypeClass);
                
                // 更新图标
                const iconElement = this.element.querySelector('.notification-icon i');
                if (iconElement) {
                    iconElement.className = this.getIconClass();
                }
            }
        }
        
        return this;
    }
    
    /**
     * HTML转义
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * 销毁通知
     */
    destroy() {
        this.stopTimer();
        
        if (this.element) {
            this.element.remove();
        }
        
        // 清理全局引用
        if (window[`${this.id}Instance`]) {
            delete window[`${this.id}Instance`];
        }
        
        // 如果容器为空，移除容器
        const container = this.element?.parentElement;
        if (container && container.children.length === 0) {
            container.remove();
        }
    }
    
    /**
     * 静态方法：显示信息通知
     */
    static info(message, title, options = {}) {
        return new Notification({
            type: 'info',
            title,
            message,
            ...options
        });
    }
    
    /**
     * 静态方法：显示成功通知
     */
    static success(message, title, options = {}) {
        return new Notification({
            type: 'success',
            title,
            message,
            ...options
        });
    }
    
    /**
     * 静态方法：显示警告通知
     */
    static warning(message, title, options = {}) {
        return new Notification({
            type: 'warning',
            title,
            message,
            ...options
        });
    }
    
    /**
     * 静态方法：显示错误通知
     */
    static error(message, title, options = {}) {
        return new Notification({
            type: 'error',
            title,
            message,
            duration: 0, // 错误通知默认不自动关闭
            ...options
        });
    }
    
    /**
     * 静态方法：关闭所有通知
     */
    static closeAll() {
        const containers = document.querySelectorAll('[id^="notification-container-"]');
        containers.forEach(container => {
            const notifications = container.querySelectorAll('.notification');
            notifications.forEach(notification => {
                const instance = window[`${notification.id}Instance`];
                if (instance) {
                    instance.close();
                }
            });
        });
    }
    
    /**
     * 静态方法：关闭指定类型的通知
     */
    static closeByType(type) {
        const notifications = document.querySelectorAll(`.notification-${type}`);
        notifications.forEach(notification => {
            const instance = window[`${notification.id}Instance`];
            if (instance) {
                instance.close();
            }
        });
    }
}

// 导出组件
window.Notification = Notification;

// 简化的全局方法
window.notify = {
    info: (message, title, options) => Notification.info(message, title, options),
    success: (message, title, options) => Notification.success(message, title, options),
    warning: (message, title, options) => Notification.warning(message, title, options),
    error: (message, title, options) => Notification.error(message, title, options),
    closeAll: () => Notification.closeAll(),
    closeByType: (type) => Notification.closeByType(type)
};
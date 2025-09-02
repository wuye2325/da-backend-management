/**
 * Form 通用表单组件
 * 支持表单验证、数据绑定、动态字段等功能
 */

class Form {
    /**
     * 构造函数
     * @param {Object} options - 配置选项
     * @param {string} options.containerId - 容器元素ID
     * @param {Array} options.fields - 字段配置
     * @param {Object} options.data - 初始数据
     * @param {Object} options.rules - 验证规则
     * @param {string} options.layout - 布局方式 'horizontal'|'vertical'|'inline'
     * @param {Function} options.onSubmit - 提交回调
     * @param {Function} options.onChange - 字段变化回调
     */
    constructor(options = {}) {
        this.containerId = options.containerId;
        this.fields = options.fields || [];
        this.data = options.data || {};
        this.rules = options.rules || {};
        this.layout = options.layout || 'vertical';
        this.onSubmit = options.onSubmit;
        this.onChange = options.onChange;
        
        // 表单状态
        this.errors = {};
        this.touched = {};
        this.isSubmitting = false;
        
        this.init();
    }
    
    /**
     * 初始化表单
     */
    init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error('Form: 容器元素未找到', this.containerId);
            return;
        }
        
        this.render();
        this.bindEvents();
    }
    
    /**
     * 渲染表单
     */
    render() {
        const formClass = this.getFormClass();
        const fieldsHtml = this.fields.map(field => this.renderField(field)).join('');
        
        const html = `
            <form class="${formClass}" id="${this.containerId}-form">
                ${fieldsHtml}
            </form>
        `;
        
        this.container.innerHTML = html;
    }
    
    /**
     * 获取表单样式类
     */
    getFormClass() {
        const baseClass = 'form';
        
        switch (this.layout) {
            case 'horizontal':
                return `${baseClass} form-horizontal`;
            case 'inline':
                return `${baseClass} form-inline`;
            default:
                return `${baseClass} form-vertical`;
        }
    }
    
    /**
     * 渲染字段
     */
    renderField(field) {
        if (!field.visible && field.visible !== undefined) {
            return '';
        }
        
        const fieldClass = this.getFieldClass(field);
        const labelHtml = this.renderLabel(field);
        const inputHtml = this.renderInput(field);
        const errorHtml = this.renderError(field.key);
        const helpHtml = this.renderHelp(field);
        
        return `
            <div class="${fieldClass}" data-field="${field.key}">
                ${labelHtml}
                <div class="form-control-wrapper">
                    ${inputHtml}
                    ${errorHtml}
                    ${helpHtml}
                </div>
            </div>
        `;
    }
    
    /**
     * 获取字段样式类
     */
    getFieldClass(field) {
        let classes = ['form-group'];
        
        if (field.required) {
            classes.push('required');
        }
        
        if (this.errors[field.key]) {
            classes.push('has-error');
        }
        
        if (field.className) {
            classes.push(field.className);
        }
        
        return classes.join(' ');
    }
    
    /**
     * 渲染标签
     */
    renderLabel(field) {
        if (!field.label) {
            return '';
        }
        
        const required = field.required ? '<span class="text-red-500 ml-1">*</span>' : '';
        
        return `
            <label class="form-label" for="${this.containerId}-${field.key}">
                ${field.label}${required}
            </label>
        `;
    }
    
    /**
     * 渲染输入控件
     */
    renderInput(field) {
        const inputId = `${this.containerId}-${field.key}`;
        const value = this.data[field.key] || field.defaultValue || '';
        const disabled = field.disabled ? 'disabled' : '';
        const readonly = field.readonly ? 'readonly' : '';
        const placeholder = field.placeholder || '';
        
        switch (field.type) {
            case 'text':
            case 'email':
            case 'password':
            case 'number':
            case 'tel':
            case 'url':
                return `
                    <input type="${field.type}" 
                           id="${inputId}"
                           name="${field.key}"
                           class="form-input"
                           value="${this.escapeHtml(value)}"
                           placeholder="${placeholder}"
                           ${disabled}
                           ${readonly}
                           ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}
                           ${field.min !== undefined ? `min="${field.min}"` : ''}
                           ${field.max !== undefined ? `max="${field.max}"` : ''}
                           ${field.step ? `step="${field.step}"` : ''}>
                `;
                
            case 'textarea':
                return `
                    <textarea id="${inputId}"
                              name="${field.key}"
                              class="form-textarea"
                              placeholder="${placeholder}"
                              ${disabled}
                              ${readonly}
                              ${field.rows ? `rows="${field.rows}"` : 'rows="3"'}
                              ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}>${this.escapeHtml(value)}</textarea>
                `;
                
            case 'select':
                const options = (field.options || []).map(option => {
                    const selected = String(value) === String(option.value) ? 'selected' : '';
                    return `<option value="${this.escapeHtml(option.value)}" ${selected}>${this.escapeHtml(option.label)}</option>`;
                }).join('');
                
                return `
                    <select id="${inputId}"
                            name="${field.key}"
                            class="form-select"
                            ${disabled}>
                        ${placeholder ? `<option value="">${placeholder}</option>` : ''}
                        ${options}
                    </select>
                `;
                
            case 'radio':
                return (field.options || []).map(option => {
                    const checked = String(value) === String(option.value) ? 'checked' : '';
                    const optionId = `${inputId}-${option.value}`;
                    
                    return `
                        <label class="form-radio">
                            <input type="radio" 
                                   id="${optionId}"
                                   name="${field.key}"
                                   value="${this.escapeHtml(option.value)}"
                                   ${checked}
                                   ${disabled}>
                            <span class="radio-indicator"></span>
                            <span class="radio-label">${this.escapeHtml(option.label)}</span>
                        </label>
                    `;
                }).join('');
                
            case 'checkbox':
                if (field.options) {
                    // 多选框组
                    const values = Array.isArray(value) ? value : [];
                    
                    return (field.options || []).map(option => {
                        const checked = values.includes(option.value) ? 'checked' : '';
                        const optionId = `${inputId}-${option.value}`;
                        
                        return `
                            <label class="form-checkbox">
                                <input type="checkbox" 
                                       id="${optionId}"
                                       name="${field.key}"
                                       value="${this.escapeHtml(option.value)}"
                                       ${checked}
                                       ${disabled}>
                                <span class="checkbox-indicator"></span>
                                <span class="checkbox-label">${this.escapeHtml(option.label)}</span>
                            </label>
                        `;
                    }).join('');
                } else {
                    // 单个复选框
                    const checked = value ? 'checked' : '';
                    
                    return `
                        <label class="form-checkbox">
                            <input type="checkbox" 
                                   id="${inputId}"
                                   name="${field.key}"
                                   value="1"
                                   ${checked}
                                   ${disabled}>
                            <span class="checkbox-indicator"></span>
                            <span class="checkbox-label">${field.checkboxLabel || ''}</span>
                        </label>
                    `;
                }
                
            case 'date':
            case 'datetime-local':
            case 'time':
                return `
                    <input type="${field.type}" 
                           id="${inputId}"
                           name="${field.key}"
                           class="form-input"
                           value="${this.escapeHtml(value)}"
                           ${disabled}
                           ${readonly}
                           ${field.min ? `min="${field.min}"` : ''}
                           ${field.max ? `max="${field.max}"` : ''}>
                `;
                
            case 'file':
                return `
                    <input type="file" 
                           id="${inputId}"
                           name="${field.key}"
                           class="form-file"
                           ${disabled}
                           ${field.accept ? `accept="${field.accept}"` : ''}
                           ${field.multiple ? 'multiple' : ''}>
                `;
                
            case 'hidden':
                return `
                    <input type="hidden" 
                           id="${inputId}"
                           name="${field.key}"
                           value="${this.escapeHtml(value)}">
                `;
                
            case 'custom':
                return field.render ? field.render(value, field, this) : '';
                
            default:
                return `
                    <input type="text" 
                           id="${inputId}"
                           name="${field.key}"
                           class="form-input"
                           value="${this.escapeHtml(value)}"
                           placeholder="${placeholder}"
                           ${disabled}
                           ${readonly}>
                `;
        }
    }
    
    /**
     * 渲染错误信息
     */
    renderError(fieldKey) {
        const error = this.errors[fieldKey];
        if (!error) {
            return '';
        }
        
        return `
            <div class="form-error">
                <i class="fas fa-exclamation-circle mr-1"></i>
                ${error}
            </div>
        `;
    }
    
    /**
     * 渲染帮助信息
     */
    renderHelp(field) {
        if (!field.help) {
            return '';
        }
        
        return `
            <div class="form-help">
                <i class="fas fa-info-circle mr-1"></i>
                ${field.help}
            </div>
        `;
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        if (!this.container) return;
        
        const form = this.container.querySelector('form');
        if (!form) return;
        
        // 表单提交事件
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // 字段变化事件
        form.addEventListener('input', (e) => {
            this.handleFieldChange(e);
        });
        
        form.addEventListener('change', (e) => {
            this.handleFieldChange(e);
        });
        
        // 字段失焦事件
        form.addEventListener('blur', (e) => {
            this.handleFieldBlur(e);
        }, true);
    }
    
    /**
     * 处理字段变化
     */
    handleFieldChange(e) {
        const field = e.target;
        const fieldKey = field.name;
        
        if (!fieldKey) return;
        
        let value = this.getFieldValue(field);
        
        // 更新数据
        this.data[fieldKey] = value;
        
        // 清除错误
        if (this.errors[fieldKey]) {
            this.clearFieldError(fieldKey);
        }
        
        // 触发变化回调
        if (this.onChange) {
            this.onChange(fieldKey, value, this.data);
        }
    }
    
    /**
     * 处理字段失焦
     */
    handleFieldBlur(e) {
        const field = e.target;
        const fieldKey = field.name;
        
        if (!fieldKey) return;
        
        // 标记为已触摸
        this.touched[fieldKey] = true;
        
        // 验证字段
        this.validateField(fieldKey);
    }
    
    /**
     * 获取字段值
     */
    getFieldValue(field) {
        switch (field.type) {
            case 'checkbox':
                if (field.hasAttribute('value') && field.value !== '1') {
                    // 多选框组
                    const checkboxes = this.container.querySelectorAll(`input[name="${field.name}"]:checked`);
                    return Array.from(checkboxes).map(cb => cb.value);
                } else {
                    // 单个复选框
                    return field.checked;
                }
                
            case 'radio':
                const radioChecked = this.container.querySelector(`input[name="${field.name}"]:checked`);
                return radioChecked ? radioChecked.value : '';
                
            case 'number':
                return field.value ? Number(field.value) : '';
                
            case 'file':
                return field.files;
                
            default:
                return field.value;
        }
    }
    
    /**
     * 处理表单提交
     */
    async handleSubmit() {
        if (this.isSubmitting) return;
        
        // 验证所有字段
        const isValid = this.validate();
        
        if (!isValid) {
            this.focusFirstError();
            return;
        }
        
        this.isSubmitting = true;
        
        try {
            if (this.onSubmit) {
                await this.onSubmit(this.data, this);
            }
        } catch (error) {
            console.error('表单提交错误:', error);
        } finally {
            this.isSubmitting = false;
        }
    }
    
    /**
     * 验证表单
     */
    validate() {
        this.errors = {};
        
        this.fields.forEach(field => {
            this.validateField(field.key);
        });
        
        return Object.keys(this.errors).length === 0;
    }
    
    /**
     * 验证单个字段
     */
    validateField(fieldKey) {
        const field = this.fields.find(f => f.key === fieldKey);
        if (!field) return true;
        
        const value = this.data[fieldKey];
        const rules = this.rules[fieldKey] || field.rules || [];
        
        // 清除之前的错误
        delete this.errors[fieldKey];
        
        for (const rule of rules) {
            const error = this.validateRule(value, rule, field);
            if (error) {
                this.setFieldError(fieldKey, error);
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * 验证单个规则
     */
    validateRule(value, rule, field) {
        if (typeof rule === 'function') {
            return rule(value, field, this.data);
        }
        
        if (typeof rule === 'object') {
            switch (rule.type) {
                case 'required':
                    if (this.isEmpty(value)) {
                        return rule.message || `${field.label || field.key}不能为空`;
                    }
                    break;
                    
                case 'minLength':
                    if (value && String(value).length < rule.value) {
                        return rule.message || `${field.label || field.key}长度不能少于${rule.value}个字符`;
                    }
                    break;
                    
                case 'maxLength':
                    if (value && String(value).length > rule.value) {
                        return rule.message || `${field.label || field.key}长度不能超过${rule.value}个字符`;
                    }
                    break;
                    
                case 'min':
                    if (value !== '' && Number(value) < rule.value) {
                        return rule.message || `${field.label || field.key}不能小于${rule.value}`;
                    }
                    break;
                    
                case 'max':
                    if (value !== '' && Number(value) > rule.value) {
                        return rule.message || `${field.label || field.key}不能大于${rule.value}`;
                    }
                    break;
                    
                case 'pattern':
                    if (value && !rule.value.test(value)) {
                        return rule.message || `${field.label || field.key}格式不正确`;
                    }
                    break;
                    
                case 'email':
                    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        return rule.message || '请输入有效的邮箱地址';
                    }
                    break;
                    
                case 'phone':
                    if (value && !/^1[3-9]\d{9}$/.test(value)) {
                        return rule.message || '请输入有效的手机号码';
                    }
                    break;
                    
                case 'custom':
                    if (rule.validator) {
                        return rule.validator(value, field, this.data);
                    }
                    break;
            }
        }
        
        return null;
    }
    
    /**
     * 检查值是否为空
     */
    isEmpty(value) {
        if (value === null || value === undefined || value === '') {
            return true;
        }
        
        if (Array.isArray(value)) {
            return value.length === 0;
        }
        
        return false;
    }
    
    /**
     * 设置字段错误
     */
    setFieldError(fieldKey, error) {
        this.errors[fieldKey] = error;
        
        // 更新UI
        const fieldGroup = this.container.querySelector(`[data-field="${fieldKey}"]`);
        if (fieldGroup) {
            fieldGroup.classList.add('has-error');
            
            const errorElement = fieldGroup.querySelector('.form-error');
            if (errorElement) {
                errorElement.innerHTML = `<i class="fas fa-exclamation-circle mr-1"></i>${error}`;
            } else {
                const wrapper = fieldGroup.querySelector('.form-control-wrapper');
                if (wrapper) {
                    wrapper.insertAdjacentHTML('beforeend', this.renderError(fieldKey));
                }
            }
        }
    }
    
    /**
     * 清除字段错误
     */
    clearFieldError(fieldKey) {
        delete this.errors[fieldKey];
        
        // 更新UI
        const fieldGroup = this.container.querySelector(`[data-field="${fieldKey}"]`);
        if (fieldGroup) {
            fieldGroup.classList.remove('has-error');
            
            const errorElement = fieldGroup.querySelector('.form-error');
            if (errorElement) {
                errorElement.remove();
            }
        }
    }
    
    /**
     * 聚焦到第一个错误字段
     */
    focusFirstError() {
        const firstErrorField = Object.keys(this.errors)[0];
        if (firstErrorField) {
            const input = this.container.querySelector(`[name="${firstErrorField}"]`);
            if (input) {
                input.focus();
            }
        }
    }
    
    /**
     * 设置字段值
     */
    setFieldValue(fieldKey, value) {
        this.data[fieldKey] = value;
        
        const input = this.container.querySelector(`[name="${fieldKey}"]`);
        if (input) {
            switch (input.type) {
                case 'checkbox':
                    if (input.hasAttribute('value') && input.value !== '1') {
                        // 多选框组
                        const checkboxes = this.container.querySelectorAll(`input[name="${fieldKey}"]`);
                        checkboxes.forEach(cb => {
                            cb.checked = Array.isArray(value) && value.includes(cb.value);
                        });
                    } else {
                        // 单个复选框
                        input.checked = Boolean(value);
                    }
                    break;
                    
                case 'radio':
                    const radios = this.container.querySelectorAll(`input[name="${fieldKey}"]`);
                    radios.forEach(radio => {
                        radio.checked = radio.value === String(value);
                    });
                    break;
                    
                default:
                    input.value = value || '';
                    break;
            }
        }
    }
    
    /**
     * 获取字段值
     */
    getFieldValue(fieldKey) {
        return this.data[fieldKey];
    }
    
    /**
     * 设置表单数据
     */
    setData(data) {
        this.data = { ...data };
        
        // 更新所有字段值
        Object.keys(data).forEach(key => {
            this.setFieldValue(key, data[key]);
        });
    }
    
    /**
     * 获取表单数据
     */
    getData() {
        return { ...this.data };
    }
    
    /**
     * 重置表单
     */
    reset() {
        this.data = {};
        this.errors = {};
        this.touched = {};
        
        const form = this.container.querySelector('form');
        if (form) {
            form.reset();
        }
        
        // 清除所有错误状态
        const errorGroups = this.container.querySelectorAll('.has-error');
        errorGroups.forEach(group => {
            group.classList.remove('has-error');
        });
        
        const errorElements = this.container.querySelectorAll('.form-error');
        errorElements.forEach(element => {
            element.remove();
        });
    }
    
    /**
     * 设置字段可见性
     */
    setFieldVisible(fieldKey, visible) {
        const fieldGroup = this.container.querySelector(`[data-field="${fieldKey}"]`);
        if (fieldGroup) {
            if (visible) {
                fieldGroup.style.display = '';
            } else {
                fieldGroup.style.display = 'none';
            }
        }
    }
    
    /**
     * 设置字段停用状态
     */
    setFieldDisabled(fieldKey, disabled) {
        const inputs = this.container.querySelectorAll(`[name="${fieldKey}"]`);
        inputs.forEach(input => {
            input.disabled = disabled;
        });
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
     * 销毁表单
     */
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// 导出组件
window.Form = Form;
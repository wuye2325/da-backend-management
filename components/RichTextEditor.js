/**
 * 富文本编辑器组件
 * 基于contenteditable实现的轻量级富文本编辑器
 */
class RichTextEditor {
    /**
     * 构造函数
     * @param {string} containerId - 容器元素ID
     * @param {Object} options - 配置选项
     */
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        
        if (!this.container) {
            throw new Error(`容器元素 #${containerId} 未找到`);
        }
        
        // 默认配置
        this.options = {
            height: '200px',
            placeholder: '请输入内容...',
            toolbar: ['bold', 'italic', 'underline', 'strikethrough', '|', 'h1', 'h2', 'h3', '|', 'ul', 'ol', '|', 'link', 'image'],
            onChange: null,
            ...options
        };
        
        this.init();
    }
    
    /**
     * 初始化编辑器
     */
    init() {
        this.render();
        this.bindEvents();
    }
    
    /**
     * 渲染编辑器HTML
     */
    render() {
        this.container.innerHTML = `
            <div class="rich-text-editor border border-gray-300 rounded-lg overflow-hidden">
                <!-- 工具栏 -->
                <div class="toolbar bg-gray-50 border-b border-gray-300 p-2 flex items-center space-x-1" id="${this.containerId}_toolbar">
                    ${this.renderToolbar()}
                </div>
                
                <!-- 编辑区域 -->
                <div class="editor-content" 
                     id="${this.containerId}_editor" 
                     contenteditable="true" 
                     style="min-height: ${this.options.height}; padding: 12px; outline: none; line-height: 1.6;"
                     data-placeholder="${this.options.placeholder}">
                </div>
            </div>
            
            <!-- 样式 -->
            <style>
                .rich-text-editor .editor-content:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                }
                
                .rich-text-editor .toolbar button {
                    padding: 6px 8px;
                    border: 1px solid transparent;
                    border-radius: 4px;
                    background: none;
                    color: #374151;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s;
                }
                
                .rich-text-editor .toolbar button:hover {
                    background-color: #e5e7eb;
                    border-color: #d1d5db;
                }
                
                .rich-text-editor .toolbar button.active {
                    background-color: #3b82f6;
                    color: white;
                    border-color: #2563eb;
                }
                
                .rich-text-editor .toolbar .separator {
                    width: 1px;
                    height: 20px;
                    background-color: #d1d5db;
                    margin: 0 4px;
                }
                
                .rich-text-editor .editor-content h1 {
                    font-size: 2em;
                    font-weight: bold;
                    margin: 0.67em 0;
                }
                
                .rich-text-editor .editor-content h2 {
                    font-size: 1.5em;
                    font-weight: bold;
                    margin: 0.75em 0;
                }
                
                .rich-text-editor .editor-content h3 {
                    font-size: 1.17em;
                    font-weight: bold;
                    margin: 0.83em 0;
                }
                
                .rich-text-editor .editor-content ul, 
                .rich-text-editor .editor-content ol {
                    margin: 1em 0;
                    padding-left: 2em;
                }
                
                .rich-text-editor .editor-content a {
                    color: #3b82f6;
                    text-decoration: underline;
                }
                
                .rich-text-editor .editor-content img {
                    max-width: 100%;
                    height: auto;
                }
            </style>
        `;
    }
    
    /**
     * 渲染工具栏
     * @returns {string} 工具栏HTML
     */
    renderToolbar() {
        const toolbarItems = {
            'bold': '<i class="fas fa-bold"></i>',
            'italic': '<i class="fas fa-italic"></i>',
            'underline': '<i class="fas fa-underline"></i>',
            'strikethrough': '<i class="fas fa-strikethrough"></i>',
            'h1': 'H1',
            'h2': 'H2',
            'h3': 'H3',
            'ul': '<i class="fas fa-list-ul"></i>',
            'ol': '<i class="fas fa-list-ol"></i>',
            'link': '<i class="fas fa-link"></i>',
            'image': '<i class="fas fa-image"></i>'
        };
        
        return this.options.toolbar.map(item => {
            if (item === '|') {
                return '<div class="separator"></div>';
            }
            
            return `<button type="button" data-command="${item}" title="${this.getToolTip(item)}">
                ${toolbarItems[item] || item}
            </button>`;
        }).join('');
    }
    
    /**
     * 获取工具提示
     * @param {string} command - 命令
     * @returns {string} 提示文本
     */
    getToolTip(command) {
        const tips = {
            'bold': '粗体',
            'italic': '斜体',
            'underline': '下划线',
            'strikethrough': '删除线',
            'h1': '标题1',
            'h2': '标题2',
            'h3': '标题3',
            'ul': '无序列表',
            'ol': '有序列表',
            'link': '插入链接',
            'image': '插入图片'
        };
        
        return tips[command] || command;
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        const toolbar = document.getElementById(`${this.containerId}_toolbar`);
        const editor = document.getElementById(`${this.containerId}_editor`);
        
        // 工具栏按钮点击事件
        toolbar.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
                const command = button.getAttribute('data-command');
                
                if (command) {
                    e.preventDefault();
                    this.executeCommand(command);
                    editor.focus();
                }
            }
        });
        
        // 编辑器内容变化事件
        editor.addEventListener('input', () => {
            this.updateToolbarState();
            this.triggerChange();
        });
        
        // 选择变化事件
        editor.addEventListener('selectionchange', () => {
            this.updateToolbarState();
        });
        
        // 键盘事件
        editor.addEventListener('keydown', (e) => {
            // Ctrl+B = 粗体
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                this.executeCommand('bold');
            }
            // Ctrl+I = 斜体
            else if (e.ctrlKey && e.key === 'i') {
                e.preventDefault();
                this.executeCommand('italic');
            }
            // Ctrl+U = 下划线
            else if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                this.executeCommand('underline');
            }
        });
        
        // 粘贴事件 - 清理格式
        editor.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        });
    }
    
    /**
     * 执行编辑命令
     * @param {string} command - 命令名称
     */
    executeCommand(command) {
        const editor = document.getElementById(`${this.containerId}_editor`);
        
        switch (command) {
            case 'bold':
                document.execCommand('bold');
                break;
            case 'italic':
                document.execCommand('italic');
                break;
            case 'underline':
                document.execCommand('underline');
                break;
            case 'strikethrough':
                document.execCommand('strikeThrough');
                break;
            case 'h1':
            case 'h2':
            case 'h3':
                document.execCommand('formatBlock', false, command.toUpperCase());
                break;
            case 'ul':
                document.execCommand('insertUnorderedList');
                break;
            case 'ol':
                document.execCommand('insertOrderedList');
                break;
            case 'link':
                this.insertLink();
                break;
            case 'image':
                this.insertImage();
                break;
        }
        
        this.updateToolbarState();
        this.triggerChange();
    }
    
    /**
     * 插入链接
     */
    insertLink() {
        const url = prompt('请输入链接地址:');
        if (url) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const selectedText = range.toString();
                
                if (selectedText) {
                    document.execCommand('createLink', false, url);
                } else {
                    const linkText = prompt('请输入链接文本:', url);
                    if (linkText) {
                        const link = document.createElement('a');
                        link.href = url;
                        link.textContent = linkText;
                        range.insertNode(link);
                        range.collapse(false);
                    }
                }
            }
        }
    }
    
    /**
     * 插入图片
     */
    insertImage() {
        const url = prompt('请输入图片地址:');
        if (url) {
            document.execCommand('insertImage', false, url);
        }
    }
    
    /**
     * 更新工具栏状态
     */
    updateToolbarState() {
        const toolbar = document.getElementById(`${this.containerId}_toolbar`);
        const buttons = toolbar.querySelectorAll('button[data-command]');
        
        buttons.forEach(button => {
            const command = button.getAttribute('data-command');
            let isActive = false;
            
            switch (command) {
                case 'bold':
                    isActive = document.queryCommandState('bold');
                    break;
                case 'italic':
                    isActive = document.queryCommandState('italic');
                    break;
                case 'underline':
                    isActive = document.queryCommandState('underline');
                    break;
                case 'strikethrough':
                    isActive = document.queryCommandState('strikeThrough');
                    break;
                case 'ul':
                    isActive = document.queryCommandState('insertUnorderedList');
                    break;
                case 'ol':
                    isActive = document.queryCommandState('insertOrderedList');
                    break;
            }
            
            button.classList.toggle('active', isActive);
        });
    }
    
    /**
     * 触发变化事件
     */
    triggerChange() {
        if (typeof this.options.onChange === 'function') {
            this.options.onChange(this.getContent());
        }
    }
    
    /**
     * 获取编辑器内容
     * @returns {string} HTML内容
     */
    getContent() {
        const editor = document.getElementById(`${this.containerId}_editor`);
        return editor ? editor.innerHTML : '';
    }
    
    /**
     * 设置编辑器内容
     * @param {string} content - HTML内容
     */
    setContent(content) {
        const editor = document.getElementById(`${this.containerId}_editor`);
        if (editor) {
            editor.innerHTML = content || '';
        }
    }
    
    /**
     * 获取纯文本内容
     * @returns {string} 纯文本内容
     */
    getText() {
        const editor = document.getElementById(`${this.containerId}_editor`);
        return editor ? editor.textContent || editor.innerText : '';
    }
    
    /**
     * 清空内容
     */
    clear() {
        this.setContent('');
        this.triggerChange();
    }
    
    /**
     * 聚焦编辑器
     */
    focus() {
        const editor = document.getElementById(`${this.containerId}_editor`);
        if (editor) {
            editor.focus();
        }
    }
    
    /**
     * 销毁编辑器
     */
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// 导出组件
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RichTextEditor;
}
/**
 * 富文本编辑器组件 (UMD版本)
 * 基于 Quill.js 的富文本编辑功能
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.RichTextEditor = {}));
})(this, (function (exports) {
    'use strict';

    let quill = null;

    /**
     * 初始化富文本编辑器
     * @param {string} containerId - 容器ID，默认为'notification-content'
     */
    function initRichTextEditor(containerId = 'notification-content') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Rich text editor container "${containerId}" not found`);
            return;
        }
        
        // 初始化 Quill 编辑器
        quill = new Quill(container, {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'align': [] }],
                    ['link', 'image'],
                    ['clean']
                ]
            }
        });
        
        // 添加AI润色按钮
        addAiPolishButton();
        
        // 设置初始内容，包含标题占位符、分隔线和正文占位符
        setInitialContent();
        
        // 监听数据加载事件
        document.addEventListener('notificationDataLoaded', handleDataLoaded);
        
        console.log('Rich text editor initialized');
    }

    /**
     * 添加AI润色按钮
     */
    function addAiPolishButton() {
        if (!quill) return;
        
        const toolbar = quill.container.previousElementSibling;
        if (!toolbar) return;
        
        // 创建AI润色按钮
        const aiButton = document.createElement('button');
        aiButton.type = 'button';
        aiButton.className = 'ql-ai-polish bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs min-w-20 hover:bg-blue-200 transition-colors';
        aiButton.innerHTML = '<i class="fas fa-magic mr-1"></i>AI润色';
        aiButton.title = 'AI润色';
        
        // 添加点击事件
        aiButton.addEventListener('click', handleAiPolish);
        
        // 插入到工具栏
        const firstGroup = toolbar.querySelector('.ql-formats');
        if (firstGroup) {
            firstGroup.appendChild(aiButton);
        }
    }

    /**
     * 设置初始内容
     */
    function setInitialContent() {
        if (!quill) return;
        
        // 设置初始内容，包含标题占位符、分隔线和正文占位符
        quill.root.innerHTML = [
            '<p class="title-placeholder">请输入标题</p>',
            '<p class="title-separator">----------------------------------------</p>',
            '<p class="content-placeholder">请输入正文</p>'
        ].join('');
    }

    /**
     * 处理AI润色
     */
    function handleAiPolish() {
        if (!quill) return;
        
        const selection = quill.getSelection();
        let textToPolish = '';
        
        if (selection && selection.length > 0) {
            // 润色选中文本
            textToPolish = quill.getText(selection.index, selection.length);
        } else {
            // 润色全部内容
            textToPolish = quill.getText();
        }
        
        if (!textToPolish.trim()) {
            alert('请输入要润色的内容');
            return;
        }
        
        // 模拟AI润色（实际应该调用AI API）
        const polishedText = simulateAiPolish(textToPolish);
        
        if (selection && selection.length > 0) {
            quill.deleteText(selection.index, selection.length);
            quill.insertText(selection.index, polishedText);
            quill.setSelection(selection.index, polishedText.length);
        } else {
            quill.setText(polishedText);
        }
        
        // 显示提示
        showPolishToast();
    }

    /**
     * 模拟AI润色
     */
    function simulateAiPolish(text) {
        // 简单的文本优化示例
        return text
            .replace(/。/g, '。\n')
            .replace(/！/g, '！\n')
            .replace(/？/g, '？\n')
            .replace(/\n\n+/g, '\n')
            .trim();
    }

    /**
     * 显示润色提示
     */
    function showPolishToast() {
        // 创建提示元素
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity';
        toast.innerHTML = '<i class="fas fa-check mr-2"></i>AI润色完成';
        
        document.body.appendChild(toast);
        
        // 3秒后移除
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    /**
     * 处理数据加载
     */
    function handleDataLoaded(event) {
        const data = event.detail;
        if (quill) {
            // 设置编辑器内容，包含标题、分隔线和正文
            if (data.title || data.content) {
                const titleHtml = data.title ? `<p>${data.title}</p>` : '<p class="title-placeholder">请输入公告标题</p>';
                const contentHtml = data.content || '<p class="content-placeholder">请输入公告正文</p>';
                quill.root.innerHTML = [
                    titleHtml,
                    '<p class="title-separator">----------------------------------------</p>',
                    contentHtml
                ].join('');
            }
        }
    }

    /**
     * 获取编辑器内容
     */
    function getEditorContent() {
        if (!quill) return { title: '', content: '' };
        
        // 从富文本编辑器中提取标题和正文
        let title = '';
        let content = '';
        
        if (quill) {
            const editorContent = quill.root.innerHTML;
            
            // 移除标题placeholder、分隔线和正文placeholder
            const cleanedContent = editorContent
                .replace(/<p class="title-placeholder">.*?<\/p>/g, '')
                .replace(/<p class="title-separator">.*?<\/p>/g, '')
                .replace(/<p class="content-placeholder">.*?<\/p>/g, '')
                .trim();
            
            // 提取标题和正文
            // 标题是第一个<p>标签中的内容
            const titleMatch = cleanedContent.match(/<p>(.*?)<\/p>/);
            if (titleMatch) {
                title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
                // 移除第一个<p>标签作为标题
                content = cleanedContent.replace(/<p>.*?<\/p>/, '').replace(/^<p>\s*<\/p>/, '').trim();
            } else {
                content = cleanedContent;
            }
        }
        
        return {
            title,
            content: content === '<p><br></p>' ? '' : content
        };
    }

    /**
     * 设置编辑器内容
     */
    function setEditorContent(title, content) {
        if (!quill) return;
        
        // 设置富文本内容，包含标题、分隔线和正文
        const titleHtml = title ? `<p>${title}</p>` : '<p class="title-placeholder">请输入公告标题</p>';
        const contentHtml = content || '<p class="content-placeholder">请输入公告正文</p>';
        
        quill.root.innerHTML = [
            titleHtml,
            '<p class="title-separator">----------------------------------------</p>',
            contentHtml
        ].join('');
    }

    /**
     * 验证编辑器内容
     */
    function validateEditorContent() {
        const { title, content } = getEditorContent();
        
        if (!title.trim()) {
            alert('请输入公告标题');
            return false;
        }
        
        if (!content.trim()) {
            alert('请输入公告内容');
            return false;
        }
        
        return true;
    }

    /**
     * 获取 Quill 实例
     */
    function getQuillInstance() {
        return quill;
    }

    // 导出函数
    exports.initRichTextEditor = initRichTextEditor;
    exports.getEditorContent = getEditorContent;
    exports.setEditorContent = setEditorContent;
    exports.validateEditorContent = validateEditorContent;
    exports.getQuillInstance = getQuillInstance;
}));
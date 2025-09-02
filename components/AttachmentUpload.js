/**
 * 附件上传组件
 * 支持多文件上传、文件类型限制、大小限制等功能
 */
class AttachmentUpload {
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
            maxFileSize: 10 * 1024 * 1024, // 10MB
            maxFiles: 5,
            allowedTypes: [ '.pdf', '.doc', '.docx', '.xls', '.xlsx', '. '],
            onChange: null,
            ...options
        };
        
        this.files = [];
        this.init();
    }
    
    /**
     * 初始化组件
     */
    init() {
        this.render();
        this.bindEvents();
    }
    
    /**
     * 渲染组件HTML
     */
    render() {
        this.container.innerHTML = `
            <div class="attachment-upload">
                <!-- 上传区域 -->
                <div class="upload-area border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer" id="${this.containerId}_uploadArea">
                    <div class="upload-icon mb-3">
                        <i class="fas fa-cloud-upload-alt text-3xl text-gray-400"></i>
                    </div>
                    <div class="upload-text">
                        <p class="text-gray-600 mb-2">点击上传文件或拖拽文件到此处</p>
                        <p class="text-sm text-gray-500">支持格式：${this.getFileTypesText()}</p>
                        <p class="text-sm text-gray-500">单个文件最大 ${this.formatFileSize(this.options.maxFileSize)}，最多 ${this.options.maxFiles} 个文件</p>
                    </div>
                    <input type="file" id="${this.containerId}_fileInput" class="hidden" multiple accept="${this.options.allowedTypes.join(',')}">
                </div>
                
                <!-- 文件列表 -->
                <div class="file-list mt-4" id="${this.containerId}_fileList"></div>
            </div>
        `;
        
        this.updateFileList();
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        const uploadArea = document.getElementById(`${this.containerId}_uploadArea`);
        const fileInput = document.getElementById(`${this.containerId}_fileInput`);
        
        // 点击上传区域
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        // 文件选择
        fileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files);
        });
        
        // 拖拽上传
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('border-blue-400', 'bg-blue-50');
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-blue-400', 'bg-blue-50');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-blue-400', 'bg-blue-50');
            this.handleFileSelect(e.dataTransfer.files);
        });
    }
    
    /**
     * 处理文件选择
     * @param {FileList} fileList - 选择的文件列表
     */
    handleFileSelect(fileList) {
        const files = Array.from(fileList);
        
        for (const file of files) {
            // 检查文件数量限制
            if (this.files.length >= this.options.maxFiles) {
                alert(`最多只能上传 ${this.options.maxFiles} 个文件`);
                break;
            }
            
            // 检查文件大小
            if (file.size > this.options.maxFileSize) {
                alert(`文件 "${file.name}" 超过大小限制 ${this.formatFileSize(this.options.maxFileSize)}`);
                continue;
            }
            
            // 检查文件类型
            if (!this.isValidFileType(file)) {
                alert(`文件 "${file.name}" 类型不支持`);
                continue;
            }
            
            // 检查重复文件
            if (this.files.some(f => f.name === file.name && f.size === file.size)) {
                alert(`文件 "${file.name}" 已存在`);
                continue;
            }
            
            // 添加文件
            this.files.push({
                id: Date.now() + Math.random(),
                name: file.name,
                size: file.size,
                type: file.type,
                file: file,
                uploadTime: new Date()
            });
        }
        
        this.updateFileList();
        this.triggerChange();
    }
    
    /**
     * 检查文件类型是否有效
     * @param {File} file - 文件对象
     * @returns {boolean} 是否有效
     */
    isValidFileType(file) {
        return this.options.allowedTypes.some(type => {
            if (type.includes('*')) {
                // 处理通配符类型，如 image/*
                const baseType = type.split('/')[0];
                return file.type.startsWith(baseType + '/');
            } else {
                // 处理具体扩展名，如 .pdf
                return file.name.toLowerCase().endsWith(type.toLowerCase());
            }
        });
    }
    
    /**
     * 更新文件列表显示
     */
    updateFileList() {
        const fileListContainer = document.getElementById(`${this.containerId}_fileList`);
        
        if (this.files.length === 0) {
            fileListContainer.innerHTML = '';
            return;
        }
        
        const fileListHtml = this.files.map(file => `
            <div class="file-item flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2" data-file-id="${file.id}">
                <div class="file-info flex items-center flex-1">
                    <div class="file-icon mr-3">
                        <i class="${this.getFileIcon(file.type)} text-lg text-gray-600"></i>
                    </div>
                    <div class="file-details flex-1">
                        <div class="file-name text-sm font-medium text-gray-900 truncate">${file.name}</div>
                        <div class="file-meta text-xs text-gray-500">
                            ${this.formatFileSize(file.size)} • ${this.formatDate(file.uploadTime)}
                        </div>
                    </div>
                </div>
                <div class="file-actions">
                    <button type="button" class="text-red-600 hover:text-red-800 p-1" onclick="window.attachmentUpload_${this.containerId}.removeFile('${file.id}')">
                        <i class="fas fa-trash text-sm"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        fileListContainer.innerHTML = fileListHtml;
    }
    
    /**
     * 移除文件
     * @param {string} fileId - 文件ID
     */
    removeFile(fileId) {
        this.files = this.files.filter(file => file.id !== fileId);
        this.updateFileList();
        this.triggerChange();
    }
    
    /**
     * 获取文件图标
     * @param {string} fileType - 文件类型
     * @returns {string} 图标类名
     */
    getFileIcon(fileType) {
        if (fileType.startsWith('image/')) {
            return 'fas fa-image';
        } else if (fileType === 'application/pdf') {
            return 'fas fa-file-pdf';
        } else if (fileType.includes('word') || fileType.includes('document')) {
            return 'fas fa-file-word';
        } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
            return 'fas fa-file-excel';
        } else if (fileType.startsWith('text/')) {
            return 'fas fa-file-alt';
        } else {
            return 'fas fa-file';
        }
    }
    
    /**
     * 格式化文件大小
     * @param {number} bytes - 字节数
     * @returns {string} 格式化后的大小
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /**
     * 格式化日期
     * @param {Date} date - 日期对象
     * @returns {string} 格式化后的日期
     */
    formatDate(date) {
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    /**
     * 获取支持的文件类型文本
     * @returns {string} 文件类型描述
     */
    getFileTypesText() {
        const typeMap = {
            'image/*': '图片',
            '.pdf': 'PDF',
            '.doc': 'DOC',
            '.docx': 'DOCX',
            '.xls': 'XLS',
            '.xlsx': 'XLSX',
            '.txt': '文本'
        };
        
        return this.options.allowedTypes.map(type => typeMap[type] || type).join('、');
    }
    
    /**
     * 触发变化事件
     */
    triggerChange() {
        if (typeof this.options.onChange === 'function') {
            this.options.onChange(this.files);
        }
    }
    
    /**
     * 获取文件列表
     * @returns {Array} 文件列表
     */
    getFiles() {
        return this.files;
    }
    
    /**
     * 设置文件列表
     * @param {Array} files - 文件列表
     */
    setFiles(files) {
        this.files = files || [];
        this.updateFileList();
    }
    
    /**
     * 清空文件列表
     */
    clearFiles() {
        this.files = [];
        this.updateFileList();
        this.triggerChange();
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

// 导出组件
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AttachmentUpload;
}
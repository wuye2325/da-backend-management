/**
 * 新增等级弹窗组件
 * 提供完整的等级创建功能，包括功能配置
 */
class AddLevelModal {
    constructor(options = {}) {
        this.options = {
            container: options.container || document.body,
            permissionsData: options.permissionsData || {},
            hidePlatforms: options.hidePlatforms || [], // 需要隐藏的平台列表
            onSave: options.onSave || null,
            onCancel: options.onCancel || null,
            ...options
        };
        
        // 组件状态管理
        this.state = {
            currentPlatform: 'admin',
            selectedModule: null,
            selectedFunction: null,
            selectedPermissions: new Set()
        };
        
        this.modalElement = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    /**
     * 初始化组件
     */
    init() {
        if (this.isInitialized) return;
        
        this.render();
        this.bindEvents();
        this.isInitialized = true;
    }
    
    /**
     * 渲染组件HTML
     */
    render() {
        const modalHTML = `
            <!-- 新增等级弹窗 -->
            <div id="addLevelModal" class="modal" style="display: none;">
                <div class="modal-content bg-white rounded-lg shadow-xl w-full max-w-6xl modal-dialog" style="width: 80%; max-width: 1000px;">
                    <div class="p-6 border-b border-gray-200">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-gray-900">新增等级</h3>
                            <button class="close-btn text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    
                    <form class="add-level-form p-6">
                        <!-- 等级基本信息 -->
                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">等级名称 <span class="text-red-500">*</span></label>
                                <input type="text" class="level-name w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入等级名称" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">等级描述</label>
                                <input type="text" class="level-description w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入等级描述">
                            </div>
                        </div>
                        
                        <!-- 权限配置区域 -->
                        <div class="permission-section mb-6">
                            <h4 class="text-base font-medium text-gray-900 mb-4">权限配置</h4>
                            
                            <div class="permission-cascade">
                                <!-- 端选择 -->
                                <div class="cascade-level mb-6">
                                    <h5 class="text-sm font-medium text-gray-700 mb-3">选择端</h5>
                                    <div class="platform-tabs flex space-x-4 border-b">
                                        ${this.renderPlatformTabs()}
                                    </div>
                                </div>
                                
                                <!-- 级联权限选择区域 -->
                                <div class="cascade-container grid grid-cols-3 gap-6 mb-6">
                                    <!-- 模块选择 -->
                                    <div class="cascade-column">
                                        <div class="flex items-center justify-between mb-3">
                                            <h6 class="text-sm font-medium text-gray-700">模块</h6>
                                            <div class="flex items-center space-x-2">
                                                <button type="button" class="select-all-modules text-xs text-blue-600 hover:text-blue-800">全选</button>
                                                <button type="button" class="clear-all-modules text-xs text-gray-500 hover:text-gray-700">清空</button>
                                            </div>
                                        </div>
                                        <div class="module-list cascade-list border border-gray-300 rounded-lg p-3 h-64 overflow-y-auto"></div>
                                    </div>
                                    
                                    <!-- 功能选择 -->
                                    <div class="cascade-column">
                                        <div class="flex items-center justify-between mb-3">
                                            <h6 class="text-sm font-medium text-gray-700">功能</h6>
                                            <div class="flex items-center space-x-2">
                                                <button type="button" class="select-all-functions text-xs text-blue-600 hover:text-blue-800">全选</button>
                                                <button type="button" class="clear-all-functions text-xs text-gray-500 hover:text-gray-700">清空</button>
                                            </div>
                                        </div>
                                        <div class="function-list cascade-list border border-gray-300 rounded-lg p-3 h-64 overflow-y-auto"></div>
                                    </div>
                                    
                                    <!-- 按钮权限选择 -->
                                    <div class="cascade-column">
                                        <div class="flex items-center justify-between mb-3">
                                            <h6 class="text-sm font-medium text-gray-700">按钮权限</h6>
                                            <div class="flex items-center space-x-2">
                                                <button type="button" class="select-all-buttons text-xs text-blue-600 hover:text-blue-800">全选</button>
                                                <button type="button" class="clear-all-buttons text-xs text-gray-500 hover:text-gray-700">清空</button>
                                            </div>
                                        </div>
                                        <div class="button-list cascade-list border border-gray-300 rounded-lg p-3 h-64 overflow-y-auto"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <div class="flex justify-end space-x-3">
                            <button type="button" class="cancel-btn px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                取消
                            </button>
                            <button type="button" class="save-btn px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                保存等级
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // 将HTML插入到容器中
        this.options.container.insertAdjacentHTML('beforeend', modalHTML);
        this.modalElement = this.options.container.querySelector('#addLevelModal');
    }
    
    /**
     * 渲染平台标签
     */
    renderPlatformTabs() {
        const platforms = [
            { id: 'admin', name: '总后台' },
            { id: 'pc', name: 'PC中台' },
            { id: 'mobile', name: '小程序' }
        ];
        
        // 过滤需要隐藏的平台
        const visiblePlatforms = platforms.filter(platform => 
            !this.options.hidePlatforms.includes(platform.id)
        );
        
        // 如果当前选中的平台被隐藏了，则选中第一个可见的平台
        if (visiblePlatforms.length > 0 && this.options.hidePlatforms.includes(this.state.currentPlatform)) {
            this.state.currentPlatform = visiblePlatforms[0].id;
        }
        
        return visiblePlatforms.map((platform, index) => {
            const isActive = platform.id === this.state.currentPlatform;
            const activeClass = isActive ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700';
            return `<button type="button" class="tab-btn px-4 py-2 ${activeClass}" data-platform="${platform.id}">${platform.name}</button>`;
        }).join('');
    }
    
    /**
     * 绑定事件监听器
     */
    bindEvents() {
        if (!this.modalElement) return;
        
        // 关闭按钮事件
        this.modalElement.querySelector('.close-btn').addEventListener('click', () => this.hide());
        this.modalElement.querySelector('.cancel-btn').addEventListener('click', () => this.hide());
        
        // 保存按钮事件
        this.modalElement.querySelector('.save-btn').addEventListener('click', () => this.saveLevel());
        
        // 平台切换事件
        this.modalElement.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchPlatform(e.target.dataset.platform));
        });
        
        // 全选/清空按钮事件
        this.modalElement.querySelector('.select-all-modules').addEventListener('click', () => this.selectAllModules());
        this.modalElement.querySelector('.clear-all-modules').addEventListener('click', () => this.clearAllModules());
        
        this.modalElement.querySelector('.select-all-functions').addEventListener('click', () => this.selectAllFunctions());
        this.modalElement.querySelector('.clear-all-functions').addEventListener('click', () => this.clearAllFunctions());
        
        this.modalElement.querySelector('.select-all-buttons').addEventListener('click', () => this.selectAllButtons());
        this.modalElement.querySelector('.clear-all-buttons').addEventListener('click', () => this.clearAllButtons());
        
        // 点击模态框外部关闭
        this.modalElement.addEventListener('click', (e) => {
            if (e.target === this.modalElement) {
                this.hide();
            }
        });
    }
    
    /**
     * 显示弹窗
     */
    show() {
        if (!this.modalElement) return;
        
        this.modalElement.style.display = 'flex';
        this.modalElement.classList.add('show');
        this.resetForm();
        this.loadModuleList();
        this.loadFunctionList();
        this.loadButtonList();
    }
    
    /**
     * 隐藏弹窗
     */
    hide() {
        if (!this.modalElement) return;
        
        this.modalElement.classList.remove('show');
        // 延迟隐藏，等待动画完成
        setTimeout(() => {
            this.modalElement.style.display = 'none';
        }, 300);
        
        if (this.options.onCancel) {
            this.options.onCancel();
        }
    }
    
    /**
     * 重置表单
     */
    resetForm() {
        // 选择默认平台（如果总后台被隐藏，则选择第一个可见的平台）
        let defaultPlatform = 'admin';
        if (this.options.hidePlatforms.includes('admin')) {
            const platforms = ['pc', 'mobile'];
            defaultPlatform = platforms.find(p => !this.options.hidePlatforms.includes(p)) || 'pc';
        }
        
        this.state = {
            currentPlatform: defaultPlatform,
            selectedModule: null,
            selectedFunction: null,
            selectedPermissions: new Set()
        };
        
        // 清空表单输入
        this.modalElement.querySelector('.level-name').value = '';
        this.modalElement.querySelector('.level-description').value = '';
        
        // 重置平台选择
        this.switchPlatform(defaultPlatform);
    }
    
    /**
     * 切换平台
     */
    switchPlatform(platform) {
        this.state.currentPlatform = platform;
        this.state.selectedModule = null;
        this.state.selectedFunction = null;
        
        // 更新平台标签样式
        this.modalElement.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.dataset.platform === platform) {
                btn.className = 'tab-btn px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium';
            } else {
                btn.className = 'tab-btn px-4 py-2 text-gray-500 hover:text-gray-700';
            }
        });
        
        this.loadModuleList();
        this.loadFunctionList();
        this.loadButtonList();
    }
    
    /**
     * 加载模块列表
     */
    loadModuleList() {
        const moduleListEl = this.modalElement.querySelector('.module-list');
        const platformData = this.options.permissionsData[this.state.currentPlatform];
        
        if (!platformData) {
            moduleListEl.innerHTML = '<div class="text-gray-500 text-center py-4">暂无数据</div>';
            return;
        }
        
        let html = '';
        platformData.forEach(module => {
            const isSelected = this.isModuleSelected(module.id);
            const isPartialSelected = this.isModulePartialSelected(module.id);
            
            html += `
                <div class="cascade-item flex items-center p-2 hover:bg-gray-50 cursor-pointer" data-id="${module.id}">
                    <input type="checkbox" ${isSelected ? 'checked' : ''} ${isPartialSelected ? 'class="partial"' : ''} class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                    <span class="text-sm text-gray-700">${module.name}</span>
                </div>
            `;
        });
        
        moduleListEl.innerHTML = html;
        
        // 绑定模块点击事件
        moduleListEl.querySelectorAll('.cascade-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                    this.selectModule(item.dataset.id);
                } else {
                    this.toggleModule(item.dataset.id);
                }
            });
        });
    }
    
    /**
     * 加载功能列表
     */
    loadFunctionList() {
        const functionListEl = this.modalElement.querySelector('.function-list');
        
        if (!this.state.selectedModule) {
            functionListEl.innerHTML = '<div class="text-gray-500 text-center py-4">请先选择模块</div>';
            return;
        }
        
        const platformData = this.options.permissionsData[this.state.currentPlatform];
        const module = platformData?.find(m => m.id === this.state.selectedModule);
        
        if (!module || !module.children) {
            functionListEl.innerHTML = '<div class="text-gray-500 text-center py-4">暂无功能</div>';
            return;
        }
        
        let html = '';
        module.children.forEach(func => {
            const isSelected = this.isFunctionSelected(func.id);
            const isPartialSelected = this.isFunctionPartialSelected(func.id);
            
            html += `
                <div class="cascade-item flex items-center p-2 hover:bg-gray-50 cursor-pointer" data-id="${func.id}">
                    <input type="checkbox" ${isSelected ? 'checked' : ''} ${isPartialSelected ? 'class="partial"' : ''} class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                    <span class="text-sm text-gray-700">${func.name}</span>
                </div>
            `;
        });
        
        functionListEl.innerHTML = html;
        
        // 绑定功能点击事件
        functionListEl.querySelectorAll('.cascade-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                    this.selectFunction(item.dataset.id);
                } else {
                    this.toggleFunction(item.dataset.id);
                }
            });
        });
    }
    
    /**
     * 加载按钮权限列表
     */
    loadButtonList() {
        const buttonListEl = this.modalElement.querySelector('.button-list');
        
        if (!this.state.selectedModule || !this.state.selectedFunction) {
            buttonListEl.innerHTML = '<div class="text-gray-500 text-center py-4">请先选择模块和功能</div>';
            return;
        }
        
        const platformData = this.options.permissionsData[this.state.currentPlatform];
        const module = platformData?.find(m => m.id === this.state.selectedModule);
        const func = module?.children?.find(f => f.id === this.state.selectedFunction);
        
        if (!func || !func.children) {
            buttonListEl.innerHTML = '<div class="text-gray-500 text-center py-4">暂无按钮权限</div>';
            return;
        }
        
        let html = '';
        func.children.forEach(button => {
            const isSelected = this.state.selectedPermissions.has(button.id);
            
            html += `
                <div class="cascade-item flex items-center p-2 hover:bg-gray-50 cursor-pointer" data-id="${button.id}">
                    <input type="checkbox" ${isSelected ? 'checked' : ''} class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                    <span class="text-sm text-gray-700">${button.name}</span>
                </div>
            `;
        });
        
        buttonListEl.innerHTML = html;
        
        // 绑定按钮权限点击事件
        buttonListEl.querySelectorAll('.cascade-item').forEach(item => {
            item.addEventListener('click', () => {
                this.togglePermission(item.dataset.id);
            });
        });
    }
    
    /**
     * 选择模块
     */
    selectModule(moduleId) {
        this.state.selectedModule = moduleId;
        this.state.selectedFunction = null;
        this.loadFunctionList();
        this.loadButtonList();
    }
    
    /**
     * 选择功能
     */
    selectFunction(functionId) {
        this.state.selectedFunction = functionId;
        this.loadButtonList();
    }
    
    /**
     * 切换模块选择状态
     */
    toggleModule(moduleId) {
        const platformData = this.options.permissionsData[this.state.currentPlatform];
        const module = platformData?.find(m => m.id === moduleId);
        
        if (!module) return;
        
        const isSelected = this.isModuleSelected(moduleId);
        
        if (isSelected) {
            // 取消选择模块下的所有权限
            this.removeModulePermissions(moduleId);
        } else {
            // 选择模块下的所有权限
            this.addModulePermissions(moduleId);
        }
        
        this.loadModuleList();
        this.loadFunctionList();
        this.loadButtonList();
    }
    
    /**
     * 切换功能选择状态
     */
    toggleFunction(functionId) {
        const isSelected = this.isFunctionSelected(functionId);
        
        if (isSelected) {
            this.removeFunctionPermissions(functionId);
        } else {
            this.addFunctionPermissions(functionId);
        }
        
        this.loadModuleList();
        this.loadFunctionList();
        this.loadButtonList();
    }
    
    /**
     * 切换权限选择状态
     */
    togglePermission(permissionId) {
        if (this.state.selectedPermissions.has(permissionId)) {
            this.state.selectedPermissions.delete(permissionId);
        } else {
            this.state.selectedPermissions.add(permissionId);
        }
        
        this.loadModuleList();
        this.loadFunctionList();
        this.loadButtonList();
    }
    
    /**
     * 判断模块是否被选中
     */
    isModuleSelected(moduleId) {
        const platformData = this.options.permissionsData[this.state.currentPlatform];
        const module = platformData?.find(m => m.id === moduleId);
        
        if (!module) return false;
        
        return this.getAllModulePermissions(moduleId).every(permId => 
            this.state.selectedPermissions.has(permId)
        );
    }
    
    /**
     * 判断模块是否部分选中
     */
    isModulePartialSelected(moduleId) {
        const allPermissions = this.getAllModulePermissions(moduleId);
        const selectedCount = allPermissions.filter(permId => 
            this.state.selectedPermissions.has(permId)
        ).length;
        
        return selectedCount > 0 && selectedCount < allPermissions.length;
    }
    
    /**
     * 判断功能是否被选中
     */
    isFunctionSelected(functionId) {
        const allPermissions = this.getAllFunctionPermissions(functionId);
        return allPermissions.every(permId => 
            this.state.selectedPermissions.has(permId)
        );
    }
    
    /**
     * 判断功能是否部分选中
     */
    isFunctionPartialSelected(functionId) {
        const allPermissions = this.getAllFunctionPermissions(functionId);
        const selectedCount = allPermissions.filter(permId => 
            this.state.selectedPermissions.has(permId)
        ).length;
        
        return selectedCount > 0 && selectedCount < allPermissions.length;
    }
    
    /**
     * 获取模块下所有权限ID
     */
    getAllModulePermissions(moduleId) {
        const platformData = this.options.permissionsData[this.state.currentPlatform];
        const module = platformData?.find(m => m.id === moduleId);
        
        if (!module || !module.children) return [];
        
        const permissions = [];
        module.children.forEach(func => {
            if (func.children) {
                func.children.forEach(button => {
                    permissions.push(button.id);
                });
            }
        });
        
        return permissions;
    }
    
    /**
     * 获取功能下所有权限ID
     */
    getAllFunctionPermissions(functionId) {
        const platformData = this.options.permissionsData[this.state.currentPlatform];
        
        for (const module of platformData || []) {
            const func = module.children?.find(f => f.id === functionId);
            if (func && func.children) {
                return func.children.map(button => button.id);
            }
        }
        
        return [];
    }
    
    /**
     * 添加模块下所有权限
     */
    addModulePermissions(moduleId) {
        const permissions = this.getAllModulePermissions(moduleId);
        permissions.forEach(permId => {
            this.state.selectedPermissions.add(permId);
        });
    }
    
    /**
     * 移除模块下所有权限
     */
    removeModulePermissions(moduleId) {
        const permissions = this.getAllModulePermissions(moduleId);
        permissions.forEach(permId => {
            this.state.selectedPermissions.delete(permId);
        });
    }
    
    /**
     * 添加功能下所有权限
     */
    addFunctionPermissions(functionId) {
        const permissions = this.getAllFunctionPermissions(functionId);
        permissions.forEach(permId => {
            this.state.selectedPermissions.add(permId);
        });
    }
    
    /**
     * 移除功能下所有权限
     */
    removeFunctionPermissions(functionId) {
        const permissions = this.getAllFunctionPermissions(functionId);
        permissions.forEach(permId => {
            this.state.selectedPermissions.delete(permId);
        });
    }
    
    /**
     * 选择所有模块
     */
    selectAllModules() {
        const platformData = this.options.permissionsData[this.state.currentPlatform];
        
        if (!platformData) return;
        
        platformData.forEach(module => {
            this.addModulePermissions(module.id);
        });
        
        this.loadModuleList();
        this.loadFunctionList();
        this.loadButtonList();
    }
    
    /**
     * 清空所有模块选择
     */
    clearAllModules() {
        const platformData = this.options.permissionsData[this.state.currentPlatform];
        
        if (!platformData) return;
        
        platformData.forEach(module => {
            this.removeModulePermissions(module.id);
        });
        
        this.loadModuleList();
        this.loadFunctionList();
        this.loadButtonList();
    }
    
    /**
     * 选择所有功能
     */
    selectAllFunctions() {
        if (!this.state.selectedModule) return;
        
        const platformData = this.options.permissionsData[this.state.currentPlatform];
        const module = platformData?.find(m => m.id === this.state.selectedModule);
        
        if (!module || !module.children) return;
        
        module.children.forEach(func => {
            this.addFunctionPermissions(func.id);
        });
        
        this.loadModuleList();
        this.loadFunctionList();
        this.loadButtonList();
    }
    
    /**
     * 清空所有功能选择
     */
    clearAllFunctions() {
        if (!this.state.selectedModule) return;
        
        const platformData = this.options.permissionsData[this.state.currentPlatform];
        const module = platformData?.find(m => m.id === this.state.selectedModule);
        
        if (!module || !module.children) return;
        
        module.children.forEach(func => {
            this.removeFunctionPermissions(func.id);
        });
        
        this.loadModuleList();
        this.loadFunctionList();
        this.loadButtonList();
    }
    
    /**
     * 选择所有按钮权限
     */
    selectAllButtons() {
        if (!this.state.selectedModule || !this.state.selectedFunction) return;
        
        const permissions = this.getAllFunctionPermissions(this.state.selectedFunction);
        permissions.forEach(permId => {
            this.state.selectedPermissions.add(permId);
        });
        
        this.loadModuleList();
        this.loadFunctionList();
        this.loadButtonList();
    }
    
    /**
     * 清空所有按钮权限选择
     */
    clearAllButtons() {
        if (!this.state.selectedModule || !this.state.selectedFunction) return;
        
        const permissions = this.getAllFunctionPermissions(this.state.selectedFunction);
        permissions.forEach(permId => {
            this.state.selectedPermissions.delete(permId);
        });
        
        this.loadModuleList();
        this.loadFunctionList();
        this.loadButtonList();
    }
    
    /**
     * 保存等级
     */
    saveLevel() {
        const form = this.modalElement.querySelector('.add-level-form');
        
        // 获取表单数据
        const levelData = {
            name: form.querySelector('.level-name').value.trim(),
            description: form.querySelector('.level-description').value.trim(),
            permissions: Array.from(this.state.selectedPermissions)
        };
        
        // 验证必填字段
        if (!levelData.name) {
            alert('请输入等级名称');
            return;
        }
        
        // 调用保存回调
        if (this.options.onSave) {
            this.options.onSave(levelData);
        }
        
        this.hide();
    }
    

    
    /**
     * 销毁组件
     */
    destroy() {
        if (this.modalElement) {
            this.modalElement.remove();
            this.modalElement = null;
        }
        this.isInitialized = false;
    }
    
    /**
     * 设置权限数据
     */
    setPermissionsData(permissionsData) {
        this.options.permissionsData = permissionsData;
        if (this.isInitialized) {
            this.loadModuleList();
            this.loadFunctionList();
            this.loadButtonList();
        }
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AddLevelModal;
} else if (typeof window !== 'undefined') {
    window.AddLevelModal = AddLevelModal;
}
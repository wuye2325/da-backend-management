/**
 * 数据字典管理页面JavaScript
 * 提供字典分类和词条的数据管理功能
 */

class DataDictionaryManager {
    constructor() {
        this.categories = [];
        this.items = [];
        this.currentCategoryId = null;
        this.currentEditingItemId = null;
        this.toggleSwitches = new Map(); // 存储滑动开关实例
        this.init();
    }

    /**
     * 初始化数据字典管理器
     */
    init() {
        this.initMockData();
        this.bindEvents();
        this.loadCategories();
    }

    /**
     * 初始化模拟数据
     */
    initMockData() {
        // 模拟字典分类数据
        this.categories = [
            {
                id: 1,
                name: '其它产权使用情况',
                code: 'other_property_usage',
                description: '其它产权使用情况分类',
                createTime: '2024-01-15 10:30:00',
                status: 'enabled'
            },
            {
                id: 2,
                name: '房屋产权使用情况',
                code: 'house_property_usage',
                description: '房屋产权使用情况分类',
                createTime: '2024-01-16 14:20:00',
                status: 'enabled'
            },
            {
                id: 3,
                name: '其它产权类型',
                code: 'other_property_type',
                description: '其它产权类型分类',
                createTime: '2024-01-17 09:15:00',
                status: 'enabled'
            },
            {
                id: 4,
                name: '房屋产权类型',
                code: 'house_property_type',
                description: '房屋产权类型分类',
                createTime: '2024-01-18 16:45:00',
                status: 'enabled'
            },
            {
                id: 5,
                name: '业委会成立情况',
                code: 'committee_status',
                description: '业委会成立情况分类',
                createTime: '2024-01-19 11:30:00',
                status: 'enabled'
            },
            {
                id: 6,
                name: '平台入驻情况',
                code: 'platform_status',
                description: '平台入驻情况分类',
                createTime: '2024-01-20 15:20:00',
                status: 'enabled'
            },
            {
                id: 7,
                name: '基础设施',
                code: 'infrastructure',
                description: '基础设施分类',
                createTime: '2024-01-21 10:00:00',
                status: 'enabled'
            }
        ];

        // 模拟词条数据
        this.items = [
            // 其它产权使用情况词条
            { id: 1, categoryId: 1, code: 'self_use', name: '自用', sort: 1, status: 'enabled', createTime: '2024-01-15 10:35:00' },
            { id: 2, categoryId: 1, code: 'rental', name: '租赁', sort: 2, status: 'enabled', createTime: '2024-01-15 10:36:00' },
            { id: 3, categoryId: 1, code: 'vacant', name: '空置', sort: 3, status: 'enabled', createTime: '2024-01-15 10:37:00' },
            
            // 房屋产权使用情况词条
            { id: 4, categoryId: 2, code: 'self_use', name: '自用', sort: 1, status: 'enabled', createTime: '2024-01-16 14:25:00' },
            { id: 5, categoryId: 2, code: 'rental', name: '租赁', sort: 2, status: 'enabled', createTime: '2024-01-16 14:26:00' },
            { id: 6, categoryId: 2, code: 'vacant', name: '空置', sort: 3, status: 'enabled', createTime: '2024-01-16 14:27:00' },
            
            // 其它产权类型词条
            { id: 7, categoryId: 3, code: 'parking', name: '车位', sort: 1, status: 'enabled', createTime: '2024-01-17 09:20:00' },
            { id: 8, categoryId: 3, code: 'shop', name: '商铺', sort: 2, status: 'enabled', createTime: '2024-01-17 09:21:00' },
            
            // 房屋产权类型词条
            { id: 9, categoryId: 4, code: 'residential', name: '住宅', sort: 1, status: 'enabled', createTime: '2024-01-18 16:50:00' },
            { id: 10, categoryId: 4, code: 'apartment', name: '公寓', sort: 2, status: 'enabled', createTime: '2024-01-18 16:51:00' },
            
            // 业委会成立情况词条
            { id: 11, categoryId: 5, code: 'established', name: '已成立', sort: 1, status: 'enabled', createTime: '2024-01-19 11:35:00' },
            { id: 12, categoryId: 5, code: 'pending', name: '待成立', sort: 2, status: 'enabled', createTime: '2024-01-19 11:36:00' },
            
            // 平台入驻情况词条
            { id: 13, categoryId: 6, code: 'settled', name: '已入驻', sort: 1, status: 'enabled', createTime: '2024-01-20 15:25:00' },
            { id: 14, categoryId: 6, code: 'pending', name: '待入驻', sort: 2, status: 'enabled', createTime: '2024-01-20 15:26:00' },
            
            // 基础设施词条
            { id: 15, categoryId: 7, code: 'water_supply', name: '供水', sort: 1, status: 'enabled', createTime: '2024-01-21 10:05:00' },
            { id: 16, categoryId: 7, code: 'power_supply', name: '供电', sort: 2, status: 'enabled', createTime: '2024-01-21 10:06:00' },
            { id: 17, categoryId: 7, code: 'gas_supply', name: '供气', sort: 3, status: 'enabled', createTime: '2024-01-21 10:07:00' },
            { id: 18, categoryId: 7, code: 'heating', name: '供暖', sort: 4, status: 'enabled', createTime: '2024-01-21 10:08:00' },
            { id: 19, categoryId: 7, code: 'broadband', name: '宽带', sort: 5, status: 'enabled', createTime: '2024-01-21 10:09:00' },
            { id: 20, categoryId: 7, code: 'fresh_air', name: '新风', sort: 6, status: 'enabled', createTime: '2024-01-21 10:10:00' },
            { id: 21, categoryId: 7, code: 'hot_water', name: '热水', sort: 7, status: 'enabled', createTime: '2024-01-21 10:11:00' }
        ];
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 分类搜索
        const searchCategory = document.getElementById('searchCategory');
        if (searchCategory) {
            searchCategory.addEventListener('input', (e) => {
                this.searchCategories(e.target.value);
            });
        }

        // 词条搜索
        const searchItem = document.getElementById('searchItem');
        if (searchItem) {
            searchItem.addEventListener('input', (e) => {
                this.searchItems(e.target.value);
            });
        }

        // 新增词条按钮
        const addItemBtn = document.getElementById('addItemBtn');
        if (addItemBtn) {
            addItemBtn.addEventListener('click', () => {
                this.showAddItemModal();
            });
        }

        // 模态框相关事件
        const itemModal = document.getElementById('itemModal');
        const cancelItemBtn = document.getElementById('cancelItemBtn');
        const itemForm = document.getElementById('itemForm');
        
        if (cancelItemBtn) {
            cancelItemBtn.addEventListener('click', () => {
                this.hideItemModal();
            });
        }
        
        if (itemForm) {
            itemForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveItem();
            });
        }
        
        // 点击模态框背景关闭
        if (itemModal) {
            itemModal.addEventListener('click', (e) => {
                if (e.target === itemModal) {
                    this.hideItemModal();
                }
            });
        }
    }

    /**
     * 加载字典分类列表
     */
    loadCategories() {
        const categoryList = document.getElementById('categoryList');
        if (!categoryList) return;

        categoryList.innerHTML = '';
        
        this.categories.forEach(category => {
            const li = document.createElement('li');
            li.className = 'cursor-pointer hover:bg-gray-50 transition-colors duration-200';
            li.innerHTML = `
                <div class="p-4 flex items-center justify-between" data-category-id="${category.id}">
                    <span class="text-sm font-medium text-gray-900">${category.name}</span>
                    <i class="fas fa-chevron-right text-gray-400"></i>
                </div>
            `;

            // 添加点击事件
            li.addEventListener('click', () => {
                this.selectCategory(category.id);
            });

            categoryList.appendChild(li);
        });
    }

    /**
     * 选择字典分类
     * @param {number} categoryId - 分类ID
     */
    selectCategory(categoryId) {
        this.currentCategoryId = categoryId;
        const category = this.categories.find(c => c.id === categoryId);
        
        // 更新选中状态
        document.querySelectorAll('#categoryList li').forEach(li => {
            li.classList.remove('bg-blue-50', 'border-l-4', 'border-blue-500');
        });
        
        const selectedLi = document.querySelector(`[data-category-id="${categoryId}"]`).closest('li');
        selectedLi.classList.add('bg-blue-50', 'border-l-4', 'border-blue-500');
        
        // 更新当前分类名称
        const currentCategoryName = document.getElementById('currentCategoryName');
        if (currentCategoryName && category) {
            currentCategoryName.textContent = `当前分类：${category.name}`;
        }
        
        // 启用新增词条按钮
        const addItemBtn = document.getElementById('addItemBtn');
        if (addItemBtn) {
            addItemBtn.disabled = false;
        }
        
        // 加载词条列表
        this.loadItems();
    }

    /**
     * 加载词条列表
     */
    loadItems() {
        const itemTable = document.getElementById('itemTable');
        if (!itemTable) return;
        
        const tbody = itemTable.querySelector('tbody');
        if (!tbody) return;
        
        // 清理之前的滑动开关实例
        this.toggleSwitches.forEach(toggle => {
            if (toggle && typeof toggle.destroy === 'function') {
                toggle.destroy();
            }
        });
        this.toggleSwitches.clear();
        
        // 获取当前分类的词条
        const categoryItems = this.items.filter(item => item.categoryId === this.currentCategoryId);
        
        if (categoryItems.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                        <div class="flex flex-col items-center">
                            <i class="fas fa-list text-4xl text-gray-300 mb-2"></i>
                            <p>暂无词条数据</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        // 按排序号排序
        categoryItems.sort((a, b) => a.sort - b.sort);
        
        tbody.innerHTML = '';
        categoryItems.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50';
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.code}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.sort}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div id="toggle-${item.id}" class="flex items-center">
                        <!-- 滑动开关将在这里动态生成 -->
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-2">
                        <button class="text-gray-600 hover:text-gray-900" onclick="dataDictionary.moveItemUp(${item.id})" title="上移">
                            <i class="fas fa-chevron-up"></i>
                        </button>
                        <button class="text-gray-600 hover:text-gray-900" onclick="dataDictionary.moveItemDown(${item.id})" title="下移">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <button class="text-blue-600 hover:text-blue-900" onclick="dataDictionary.editItem(${item.id})" title="编辑">
                            编辑
                        </button>
                        <button class="text-red-600 hover:text-red-900" onclick="dataDictionary.deleteItem(${item.id})" title="删除">
                            删除
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
            
            // 创建滑动开关
            setTimeout(() => {
                const toggleSwitch = new ToggleSwitch({
                    containerId: `toggle-${item.id}`,
                    id: `status-switch-${item.id}`,
                    checked: item.status === 'enabled',
                    size: 'sm',
                    onChange: (checked, switchId) => {
                        this.toggleItemStatus(item.id, checked);
                    }
                });
                this.toggleSwitches.set(item.id, toggleSwitch);
            }, 0);
        });
    }

    /**
     * 切换词条状态
     * @param {number} itemId - 词条ID
     * @param {boolean} enabled - 是否启用
     */
    toggleItemStatus(itemId, enabled) {
        const item = this.items.find(i => i.id === itemId);
        if (!item) return;
        
        item.status = enabled ? 'enabled' : 'disabled';
        item.updateTime = new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).replace(/\//g, '-');
        
        this.showNotification(
            `词条"${item.name}"已${enabled ? '启用' : '停用'}！`, 
            'success'
        );
    }

    /**
     * 搜索字典分类
     * @param {string} keyword - 搜索关键词
     */
    searchCategories(keyword) {
        const categoryList = document.getElementById('categoryList');
        if (!categoryList) return;
        
        const filteredCategories = keyword.trim() === '' 
            ? this.categories 
            : this.categories.filter(category => 
                category.name.toLowerCase().includes(keyword.toLowerCase()) ||
                category.code.toLowerCase().includes(keyword.toLowerCase()) ||
                category.description.toLowerCase().includes(keyword.toLowerCase())
            );
        
        categoryList.innerHTML = '';
        
        filteredCategories.forEach(category => {
            const li = document.createElement('li');
            li.className = 'cursor-pointer hover:bg-gray-50 transition-colors duration-200';
            li.innerHTML = `
                <div class="p-4 flex items-center justify-between" data-category-id="${category.id}">
                    <span class="text-sm font-medium text-gray-900">${category.name}</span>
                    <i class="fas fa-chevron-right text-gray-400"></i>
                </div>
            `;

            li.addEventListener('click', () => {
                this.selectCategory(category.id);
            });

            categoryList.appendChild(li);
        });
    }

    /**
     * 搜索词条
     * @param {string} keyword - 搜索关键词
     */
    searchItems(keyword) {
        if (!this.currentCategoryId) return;
        
        const itemTable = document.getElementById('itemTable');
        if (!itemTable) return;
        
        const tbody = itemTable.querySelector('tbody');
        if (!tbody) return;
        
        let categoryItems = this.items.filter(item => item.categoryId === this.currentCategoryId);
        
        if (keyword.trim() !== '') {
            categoryItems = categoryItems.filter(item => 
                item.name.toLowerCase().includes(keyword.toLowerCase()) ||
                item.code.toLowerCase().includes(keyword.toLowerCase())
            );
        }
        
        if (categoryItems.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                        <div class="flex flex-col items-center">
                            <i class="fas fa-search text-4xl text-gray-300 mb-2"></i>
                            <p>${keyword.trim() === '' ? '暂无词条数据' : '未找到匹配的词条'}</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        categoryItems.sort((a, b) => a.sort - b.sort);
        
        tbody.innerHTML = '';
        categoryItems.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50';
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.code}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.sort}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === '正常' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }">
                        ${item.status === '正常' ? '正常' : '停用'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-2">
                        <button class="text-gray-600 hover:text-gray-900" onclick="dataDictionary.moveItemUp(${item.id})" title="上移">
                            <i class="fas fa-chevron-up"></i>
                        </button>
                        <button class="text-gray-600 hover:text-gray-900" onclick="dataDictionary.moveItemDown(${item.id})" title="下移">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <button class="text-blue-600 hover:text-blue-900" onclick="dataDictionary.editItem(${item.id})" title="编辑">
                            编辑
                        </button>
                        <button class="text-red-600 hover:text-red-900" onclick="dataDictionary.deleteItem(${item.id})" title="删除">
                            删除
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    /**
     * 显示新增词条模态框
     */
    showAddItemModal() {
        if (!this.currentCategoryId) {
            this.showNotification('请先选择字典分类', 'warning');
            return;
        }
        
        const modal = document.getElementById('itemModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('itemForm');
        
        modalTitle.textContent = '新增词条';
        form.reset();
        
        this.currentEditingItemId = null;
        modal.classList.remove('hidden');
    }

    /**
     * 上移词条
     * @param {number} itemId - 词条ID
     */
    moveItemUp(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item || !this.currentCategoryId) return;
        
        // 获取当前分类的所有词条，按排序号排序
        const categoryItems = this.items
            .filter(i => i.categoryId === this.currentCategoryId)
            .sort((a, b) => a.sort - b.sort);
        
        const currentIndex = categoryItems.findIndex(i => i.id === itemId);
        
        // 如果已经是第一个，无法上移
        if (currentIndex <= 0) {
            this.showNotification('已经是第一个词条，无法上移', 'warning');
            return;
        }
        
        // 交换排序号
        const prevItem = categoryItems[currentIndex - 1];
        const tempSort = item.sort;
        item.sort = prevItem.sort;
        prevItem.sort = tempSort;
        
        // 重新加载列表
        this.loadItems();
        this.showNotification(`词条"${item.name}"上移成功`, 'success');
    }

    /**
     * 下移词条
     * @param {number} itemId - 词条ID
     */
    moveItemDown(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item || !this.currentCategoryId) return;
        
        // 获取当前分类的所有词条，按排序号排序
        const categoryItems = this.items
            .filter(i => i.categoryId === this.currentCategoryId)
            .sort((a, b) => a.sort - b.sort);
        
        const currentIndex = categoryItems.findIndex(i => i.id === itemId);
        
        // 如果已经是最后一个，无法下移
        if (currentIndex >= categoryItems.length - 1) {
            this.showNotification('已经是最后一个词条，无法下移', 'warning');
            return;
        }
        
        // 交换排序号
        const nextItem = categoryItems[currentIndex + 1];
        const tempSort = item.sort;
        item.sort = nextItem.sort;
        nextItem.sort = tempSort;
        
        // 重新加载列表
        this.loadItems();
        this.showNotification(`词条"${item.name}"下移成功`, 'success');
    }

    /**
     * 编辑词条
     * @param {number} itemId - 词条ID
     */
    editItem(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item) {
            this.showNotification('词条不存在', 'error');
            return;
        }

        const modal = document.getElementById('itemModal');
        const modalTitle = document.getElementById('modalTitle');
        
        modalTitle.textContent = '编辑词条';
        
        // 填充表单数据
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemStatus').value = item.status;
        
        this.currentEditingItemId = itemId;
        modal.classList.remove('hidden');
    }

    /**
     * 删除词条
     * @param {number} itemId - 词条ID
     */
    deleteItem(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item) return;
        
        if (confirm(`确定要删除词条"${item.name}"吗？`)) {
            // 从数组中移除
            this.items = this.items.filter(i => i.id !== itemId);
            // 重新加载当前分类的词条
            this.loadItems();
            this.showNotification('词条删除成功', 'success');
        }
    }

    /**
     * 显示通知消息
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型：success, error, warning, info
     */
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notificationMessage');
        const notificationIcon = document.getElementById('notificationIcon');
        
        if (!notification || !notificationMessage || !notificationIcon) return;
        
        // 设置图标和颜色
        const iconMap = {
            success: '<i class="fas fa-check-circle text-green-500"></i>',
            error: '<i class="fas fa-exclamation-circle text-red-500"></i>',
            warning: '<i class="fas fa-exclamation-triangle text-yellow-500"></i>',
            info: '<i class="fas fa-info-circle text-blue-500"></i>'
        };
        
        notificationIcon.innerHTML = iconMap[type] || iconMap.info;
        notificationMessage.textContent = message;
        
        // 显示通知
        notification.classList.remove('hidden');
        
        // 3秒后自动隐藏
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
        
        // 绑定关闭按钮事件
        const closeBtn = document.getElementById('closeNotification');
        if (closeBtn) {
            closeBtn.onclick = () => {
                notification.classList.add('hidden');
            };
        }
    }

    /**
     * 隐藏词条模态框
     */
    hideItemModal() {
        const modal = document.getElementById('itemModal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.currentEditingItemId = null;
    }

    /**
     * 保存词条
     */
    saveItem() {
        const form = document.getElementById('itemForm');
        if (!form) return;
        
        const formData = new FormData(form);
        const itemData = {
            name: formData.get('name'),
            status: formData.get('status')
        };
        
        // 验证表单数据
        if (!itemData.name) {
            this.showNotification('请填写词条名称', 'warning');
            return;
        }
        
        // 检查名称是否重复（排除当前编辑的词条）
        const existingItem = this.items.find(item => 
            item.name === itemData.name && 
            item.categoryId === this.currentCategoryId &&
            item.id !== this.currentEditingItemId
        );
        
        if (existingItem) {
            this.showNotification('词条名称已存在', 'warning');
            return;
        }
        
        if (this.currentEditingItemId) {
            // 编辑模式
            const item = this.items.find(i => i.id === this.currentEditingItemId);
            if (item) {
                item.name = itemData.name;
                item.status = itemData.status;
                this.showNotification('词条更新成功', 'success');
            }
        } else {
            // 新增模式
            // 自动生成编码（基于分类ID和序号）
            const currentItems = this.items.filter(item => item.categoryId === this.currentCategoryId);
            const nextSort = currentItems.length + 1;
            const autoCode = `${this.currentCategoryId.toString().padStart(2, '0')}_${nextSort.toString().padStart(3, '0')}`;
            
            const newItem = {
                id: Math.max(...this.items.map(i => i.id), 0) + 1,
                categoryId: this.currentCategoryId,
                code: autoCode,
                name: itemData.name,
                sort: nextSort,
                status: itemData.status,
                createTime: new Date().toLocaleString('zh-CN')
            };
            
            this.items.push(newItem);
            this.showNotification('词条添加成功', 'success');
        }
        
        // 重新加载词条列表
        this.loadItems();
        
        // 隐藏模态框
        this.hideItemModal();
    }
}

// 创建全局实例
let dataDictionary;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    dataDictionary = new DataDictionaryManager();
});
/**
 * 物业公司管理页面逻辑
 * 作者：AI助手
 * 创建时间：2024
 */

// 全局变量
let mockData = []; // 物业公司数据
let filteredData = []; // 筛选后的数据
let currentPage = 1; // 当前页码
let pageSize = 10; // 每页显示数量
let editingId = null; // 正在编辑的ID
let modalToggleSwitch = null; // 弹窗中的状态开关
let searchComponent = null; // 搜索组件实例

/**
 * 页面初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    generateMockData();
    initSearchComponent();
    initEventListeners();
    applyFilters();
});

/**
 * 生成模拟数据
 */
function generateMockData() {
    const propertyCompanies = [
        '万科物业管理有限公司',
        '碧桂园物业服务有限公司',
        '保利物业管理有限公司',
        '绿城物业服务集团有限公司',
        '龙湖物业服务集团有限公司',
        '招商积余物业管理股份有限公司',
        '金科物业服务集团有限公司',
        '雅生活服务股份有限公司',
        '中海物业管理有限公司',
        '华润物业管理有限公司',
        '融创物业服务集团有限公司',
        '新城物业服务股份有限公司',
        '世茂物业服务有限公司',
        '远洋亿家物业服务股份有限公司',
        '蓝光嘉宝服务集团股份有限公司'
    ];

    mockData = propertyCompanies.map((name, index) => ({
        id: index + 1,
        name: name,
        status: Math.random() > 0.3 ? 'enabled' : 'disabled',
        createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        updateTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));

    filteredData = [...mockData];
}

/**
 * 初始化搜索组件
 */
function initSearchComponent() {
    searchComponent = new SearchComponent({
        containerId: 'property-search-container',
        placeholder: '请输入物业公司名称',
        label: '搜索',
        onSearch: function(searchValue) {
            applyFilters();
        },
        onReset: function() {
            resetFilters();
        }
    });
}

/**
 * 初始化事件监听器
 */
function initEventListeners() {
    // 状态筛选事件
    document.getElementById('status-filter').addEventListener('change', applyFilters);

    // 表单提交事件
    document.getElementById('property-form').addEventListener('submit', handleFormSubmit);
}

/**
 * 防抖函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 应用筛选条件
 */
function applyFilters() {
    const nameFilter = searchComponent ? searchComponent.getValue().toLowerCase() : '';
    const statusFilter = document.getElementById('status-filter').value;

    filteredData = mockData.filter(item => {
        const nameMatch = !nameFilter || item.name.toLowerCase().includes(nameFilter);
        const statusMatch = !statusFilter || item.status === statusFilter;
        
        return nameMatch && statusMatch;
    });

    currentPage = 1; // 重置到第一页
    renderPropertyList();
    updatePagination();
}

/**
 * 重置筛选条件
 */
function resetFilters() {
    if (searchComponent) {
        searchComponent.clear();
    }
    document.getElementById('status-filter').value = '';
    
    filteredData = [...mockData];
    currentPage = 1;
    renderPropertyList();
    updatePagination();
}

/**
 * 渲染物业公司列表
 */
function renderPropertyList() {
    const propertyListContainer = document.getElementById('property-list');
    const emptyState = document.getElementById('empty-state');
    
    if (!propertyListContainer) return;

    // 计算分页数据
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = filteredData.slice(startIndex, endIndex);

    // 清空现有内容
    propertyListContainer.innerHTML = '';

    if (pageData.length === 0) {
        // 显示空状态
        emptyState?.classList.remove('hidden');
        return;
    }

    // 隐藏空状态
    emptyState?.classList.add('hidden');

    // 渲染数据行
    pageData.forEach((item, index) => {
        const row = createPropertyRow(item, startIndex + index + 1);
        propertyListContainer.appendChild(row);
    });
}

/**
 * 创建物业公司行元素
 */
function createPropertyRow(item, sequenceNumber) {
    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-50';
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sequenceNumber}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            ${item.name}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div id="toggle-container-${item.id}"></div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            ${createActionButtons(item)}
        </td>
    `;
    
    // 创建状态切换开关
    setTimeout(() => {
        const toggleSwitch = new ToggleSwitch({
            containerId: `toggle-container-${item.id}`,
            id: `status-toggle-${item.id}`,
            checked: item.status === 'enabled',
            size: 'sm',
            onChange: (checked, id, event) => {
                const newStatus = checked ? 'enabled' : 'disabled';
                const action = checked ? '启用' : '停用';
                
                // 更新数据
                const property = mockData.find(p => p.id === item.id);
                if (property) {
                    property.status = newStatus;
                    property.updateTime = new Date().toISOString().split('T')[0];
                    showSuccessMessage(`物业公司已${action}`);
                }
            }
        });
    }, 0);
    
    return row;
}

/**
 * 创建操作按钮
 */
function createActionButtons(item) {
    return `
        <div class="flex space-x-2">
            <button onclick="editProperty(${item.id})" 
                    class="text-blue-600 hover:text-blue-900 transition-colors px-2 py-1" title="编辑">
                编辑
            </button>
            <button onclick="deleteProperty(${item.id})" 
                    class="text-red-600 hover:text-red-900 transition-colors px-2 py-1" title="删除">
                删除
            </button>
        </div>
    `;
}

/**
 * 更新分页组件
 */
function updatePagination() {
    const totalCount = filteredData.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, totalCount);

    // 更新统计信息
    document.getElementById('start-index').textContent = totalCount > 0 ? startIndex : 0;
    document.getElementById('end-index').textContent = endIndex;
    document.getElementById('total-count').textContent = totalCount;

    // 生成分页按钮
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) return;

    let paginationHtml = '';

    // 上一页按钮
    if (currentPage > 1) {
        paginationHtml += `
            <button onclick="previousPage()" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
    }

    // 页码按钮
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage;
        const buttonClass = isActive 
            ? 'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600'
            : 'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50';
            
        paginationHtml += `
            <button onclick="goToPage(${i})" class="${buttonClass}">
                ${i}
            </button>
        `;
    }

    // 下一页按钮
    if (currentPage < totalPages) {
        paginationHtml += `
            <button onclick="nextPage()" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }

    paginationContainer.innerHTML = paginationHtml;
}

/**
 * 分页功能
 */
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderPropertyList();
        updatePagination();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredData.length / pageSize);
    if (currentPage < totalPages) {
        currentPage++;
        renderPropertyList();
        updatePagination();
    }
}

function goToPage(page) {
    currentPage = page;
    renderPropertyList();
    updatePagination();
}

/**
 * 打开添加物业公司弹窗
 */
function openAddPropertyModal() {
    editingId = null;
    document.getElementById('modal-title').textContent = '添加物业公司';
    document.getElementById('property-name').value = '';
    
    // 创建或重置状态开关
    if (modalToggleSwitch) {
        modalToggleSwitch.destroy();
    }
    modalToggleSwitch = new ToggleSwitch({
        containerId: 'modal-toggle-container',
        id: 'modal-status-toggle',
        checked: true, // 默认启用
        size: 'sm'
    });
    
    document.getElementById('property-modal').classList.remove('hidden');
}

/**
 * 编辑物业公司
 */
function editProperty(id) {
    const property = mockData.find(item => item.id === id);
    if (!property) return;

    editingId = id;
    document.getElementById('modal-title').textContent = '编辑物业公司';
    document.getElementById('property-name').value = property.name;
    
    // 创建或重置状态开关
    if (modalToggleSwitch) {
        modalToggleSwitch.destroy();
    }
    modalToggleSwitch = new ToggleSwitch({
        containerId: 'modal-toggle-container',
        id: 'modal-status-toggle',
        checked: property.status === 'enabled',
        size: 'sm'
    });
    
    document.getElementById('property-modal').classList.remove('hidden');
}

/**
 * 关闭物业公司弹窗
 */
function closePropertyModal() {
    document.getElementById('property-modal').classList.add('hidden');
    editingId = null;
    
    // 清理弹窗中的状态开关
    if (modalToggleSwitch) {
        modalToggleSwitch.destroy();
        modalToggleSwitch = null;
    }
}

/**
 * 处理表单提交
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('property-name').value.trim();
    const status = modalToggleSwitch ? (modalToggleSwitch.getValue() ? 'enabled' : 'disabled') : 'enabled';

    if (!name) {
        alert('请输入物业公司名称');
        return;
    }

    if (editingId) {
        // 编辑模式
        const index = mockData.findIndex(item => item.id === editingId);
        if (index !== -1) {
            mockData[index] = {
                ...mockData[index],
                name: name,
                status: status,
                updateTime: new Date().toISOString().split('T')[0]
            };
        }
        showSuccessMessage('物业公司信息已更新');
    } else {
        // 新增模式
        const newId = Math.max(...mockData.map(item => item.id)) + 1;
        mockData.push({
            id: newId,
            name: name,
            status: status,
            createTime: new Date().toISOString().split('T')[0],
            updateTime: new Date().toISOString().split('T')[0]
        });
        showSuccessMessage('物业公司已添加');
    }

    closePropertyModal();
    applyFilters();
}

/**
 * 删除物业公司
 */
function deleteProperty(id) {
    const property = mockData.find(item => item.id === id);
    if (!property) return;

    // 存储要删除的ID，供确认删除使用
    window.pendingDeleteId = id;
    document.getElementById('delete-modal').classList.remove('hidden');
}

/**
 * 关闭删除确认弹窗
 */
function closeDeleteModal() {
    document.getElementById('delete-modal').classList.add('hidden');
    window.pendingDeleteId = null;
}

/**
 * 确认删除
 */
function confirmDelete() {
    if (window.pendingDeleteId) {
        const index = mockData.findIndex(item => item.id === window.pendingDeleteId);
        if (index !== -1) {
            mockData.splice(index, 1);
            showSuccessMessage('物业公司已删除');
            applyFilters();
        }
    }
    closeDeleteModal();
}

/**
 * 显示成功消息
 */
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle mr-2"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}
/**
 * 提示词管理页面主要功能模块
 * 负责初始化搜索组件、操作按钮和表格交互
 */

// 组件将通过全局对象访问
// SearchComponent 和 ActionButtons 通过 window 对象提供

// 全局变量
let searchComponent = null;
let actionButtons = null;
let tabComponent = null;
let currentPrompts = [];
let filteredPrompts = [];
let currentPage = 1;
const itemsPerPage = 10;
let currentLocationFilter = ''; // 当前选中的应用位置标签页

// 模拟提示词数据
const mockPrompts = [
    {
        id: 1,
        name: '社区事务处理助手',
        applicationLocation: '小区事务概览',
        applicationRole: '业委会',
        content: '您好，我是社区事务处理助手，专门协助处理各类社区事务...',
        description: '协助业委会处理日常社区事务，提供专业建议',
        status: '启用',
        createTime: '2024-01-15 10:30:00',
        version: 'v3',
        isLatest: true,
        hasHistory: true,
        historyVersions: [
            {
                version: 'v2',
                content: '您好，我是社区事务处理助手，协助处理社区事务...',
                description: '协助业委会处理社区事务',
                createTime: '2024-01-10 09:20:00',
                status: '停用'
            },
            {
                version: 'v1',
                content: '社区事务处理助手，处理基础事务...',
                description: '基础社区事务处理',
                createTime: '2024-01-05 14:15:00',
                status: '停用'
            }
        ]
    },
    {
        id: 2,
        name: '物业服务咨询',
        applicationLocation: 'AI速览',
        applicationRole: '物业',
        content: '我是物业服务咨询助手，可以帮助您了解各项物业服务...',
        description: '为业主提供物业服务相关咨询和解答',
        status: '启用',
        createTime: '2024-01-16 14:20:00',
        version: 'v2',
        isLatest: true,
        hasHistory: true,
        historyVersions: [
            {
                version: 'v1',
                content: '物业服务咨询助手，提供基础咨询...',
                description: '基础物业服务咨询',
                createTime: '2024-01-12 10:30:00',
                status: '停用'
            }
        ]
    },
    {
        id: 3,
        name: '业主权益保护',
        applicationLocation: '小区事务概览',
        applicationRole: '业主',
        content: '作为业主权益保护助手，我将为您提供相关法律咨询...',
        description: '帮助业主了解和维护自身合法权益',
        status: '停用',
        createTime: '2024-01-17 09:15:00',
        version: 'v1',
        isLatest: true,
        hasHistory: false,
        historyVersions: []
    },
    {
        id: 4,
        name: '公告通知润色助手',
        applicationLocation: 'AI润色',
        applicationRole: '业委会',
        aiCategory: '公告通知',
        content: '我是专门用于润色公告通知的AI助手，可以帮助您优化通知内容...',
        description: '专门用于润色和优化各类公告通知内容',
        status: '启用',
        createTime: '2024-01-18 11:30:00',
        version: 'v3',
        isLatest: true,
        hasHistory: true,
        historyVersions: [
            {
                version: 'v2',
                content: '公告通知润色助手，优化通知内容格式...',
                description: '润色公告通知内容',
                createTime: '2024-01-15 16:20:00',
                status: '停用'
            },
            {
                version: 'v1',
                content: '润色助手，处理公告通知...',
                description: '基础公告润色',
                createTime: '2024-01-12 11:10:00',
                status: '停用'
            }
        ]
    },
    {
        id: 5,
        name: '会议纪要整理助手',
        applicationLocation: 'AI润色',
        applicationRole: '业委会',
        aiCategory: '会议纪要',
        content: '我是会议纪要整理助手，可以帮助您规范化会议记录格式...',
        description: '协助整理和规范化会议纪要内容',
        status: '启用',
        createTime: '2024-01-19 16:45:00',
        version: 'v2',
        isLatest: true,
        hasHistory: true,
        historyVersions: [
            {
                version: 'v1',
                content: '会议纪要整理助手，整理会议记录...',
                description: '基础会议纪要整理',
                createTime: '2024-01-18 09:30:00',
                status: '停用'
            }
        ]
    },
];

/**
 * 初始化提示词管理功能
 */
function initPromptManagement() {
    console.log('=== 开始初始化提示词管理功能 ===');
    
    console.log('1. 初始化标签页组件...');
    initTabComponent();
    
    console.log('2. 初始化搜索组件...');
    initSearchComponent();
    
    console.log('3. 初始化操作按钮...');
    initActionButtons();
    
    console.log('4. 初始化提示词数据...');
    initPromptData();
    
    console.log('5. 渲染提示词表格...');
    renderPromptsTable();
    
    console.log('6. 初始化模态框事件...');
    initModalEvents();
    
    console.log('=== 提示词管理功能初始化完成 ===');
}

/**
 * 初始化标签页组件
 */
function initTabComponent() {
    const tabContainer = document.getElementById('prompt-tabs-container');
    if (!tabContainer) {
        console.error('标签页容器未找到');
        return;
    }

    // 配置标签页
    const tabConfig = {
        tabs: [
            {
                id: 'community-overview',
                title: '小区事务概览',
                content: ''
            },
            {
                id: 'ai-summary',
                title: 'AI速览',
                content: ''
            },
            {
                id: 'ai-polish',
                title: 'AI润色',
                content: ''
            }
        ],
        defaultTab: 'community-overview',
        onTabChange: handleTabChange
    };

    // 初始化标签页组件
    if (window.TabComponent) {
        tabComponent = new window.TabComponent('prompt-tabs-container', tabConfig);
        tabComponent.init();
        
        // 设置默认筛选条件
        currentLocationFilter = '小区事务概览';
    } else {
        console.error('TabComponent未找到，请确保tab-component.js已正确加载');
    }
}

/**
 * 处理标签页切换事件
 * @param {string} tabId - 标签页ID
 * @param {object} tabConfig - 标签页配置
 */
function handleTabChange(tabId, tabConfig) {
    // 根据标签页ID设置应用位置筛选条件
    const locationMap = {
        'community-overview': '小区事务概览',
        'ai-summary': 'AI速览',
        'ai-polish': 'AI润色'
    };
    
    currentLocationFilter = locationMap[tabId] || '';
    console.log(`切换到标签页: ${tabConfig.title}, 筛选条件: ${currentLocationFilter}`);
    
    // 控制分类列的显示/隐藏
    const categoryHeader = document.getElementById('category-header');
    if (categoryHeader) {
        if (tabId === 'ai-polish') {
            categoryHeader.classList.remove('hidden');
        } else {
            categoryHeader.classList.add('hidden');
        }
    }
    
    // 控制分类筛选下拉框的显示/隐藏
    const categoryFilterContainer = document.getElementById('category-filter-container');
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilterContainer && categoryFilter) {
        if (tabId === 'ai-polish') {
            categoryFilterContainer.classList.remove('hidden');
        } else {
            categoryFilterContainer.classList.add('hidden');
            categoryFilter.value = ''; // 切换到其他tab时清空分类筛选
        }
    }
    
    // 重新应用筛选
    applyFilters();
}

/**
 * 初始化搜索组件
 */
function initSearchComponent() {
    const searchContainer = document.getElementById('search-container');
    if (!searchContainer) return;

    if (window.SearchComponent) {
        searchComponent = new window.SearchComponent({
            container: searchContainer,
            placeholder: '请输入...',
            onSearch: handleSearch,
            onReset: handleSearchReset
        });
    }
    
    // 初始化下拉框筛选事件
    initFilterDropdowns();
}

/**
 * 初始化操作按钮组件
 */
function initActionButtons() {
    const buttonsContainer = document.getElementById('action-buttons-container');
    if (!buttonsContainer) {
        console.error('未找到操作按钮容器');
        return;
    }

    // 清空操作按钮容器，因为页面上方已有新增按钮
    buttonsContainer.innerHTML = '';
    console.log('操作按钮区域已清空');
}

/**
 * 初始化提示词数据
 */
function initPromptData() {
    currentPrompts = [...mockPrompts];
    filteredPrompts = [...currentPrompts];
    console.log('数据初始化完成:', {
        mockPrompts: mockPrompts.length,
        currentPrompts: currentPrompts.length,
        filteredPrompts: filteredPrompts.length
    });
}

/**
 * 初始化筛选下拉框事件
 */
function initFilterDropdowns() {
    const roleFilter = document.getElementById('role-filter');
    const categoryFilter = document.getElementById('category-filter');
    const titleFilter = document.getElementById('title-filter');
    const contentFilter = document.getElementById('content-filter');
    const startDateFilter = document.getElementById('start-date-filter');
    const endDateFilter = document.getElementById('end-date-filter');
    const statusFilter = document.getElementById('status-filter');
    
    if (roleFilter) {
        roleFilter.addEventListener('change', applyFilters);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    if (titleFilter) {
        titleFilter.addEventListener('input', applyFilters);
    }
    
    if (contentFilter) {
        contentFilter.addEventListener('input', applyFilters);
    }
    
    if (startDateFilter) {
        startDateFilter.addEventListener('change', applyFilters);
    }
    
    if (endDateFilter) {
        endDateFilter.addEventListener('change', applyFilters);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
}

/**
 * 应用所有筛选条件
 */
function applyFilters() {
    const searchTerm = searchComponent ? searchComponent.getValue().toLowerCase().trim() : '';
    const roleFilter = document.getElementById('role-filter')?.value || '';
    const categoryFilter = document.getElementById('category-filter')?.value || '';
    const titleFilter = document.getElementById('title-filter')?.value.toLowerCase().trim() || '';
    const contentFilter = document.getElementById('content-filter')?.value.toLowerCase().trim() || '';
    const startDateFilter = document.getElementById('start-date-filter')?.value || '';
    const endDateFilter = document.getElementById('end-date-filter')?.value || '';
    const statusFilter = document.getElementById('status-filter')?.value || '';
    
    filteredPrompts = currentPrompts.filter(prompt => {
        // 搜索关键词筛选
        const matchesSearch = !searchTerm || prompt.name.toLowerCase().includes(searchTerm);
        
        // 应用位置筛选（基于当前标签页）
        const matchesLocation = !currentLocationFilter || prompt.applicationLocation === currentLocationFilter;
         
        // 应用角色筛选
        const matchesRole = !roleFilter || prompt.applicationRole === roleFilter;
        
        // 分类筛选（只在AI润色tab页生效）
        const matchesCategory = !categoryFilter || !prompt.aiCategory || prompt.aiCategory === categoryFilter;
        
        // 提示词标题筛选
        const matchesTitle = !titleFilter || prompt.name.toLowerCase().includes(titleFilter);
        
        // 提示词内容筛选
        const matchesContent = !contentFilter || prompt.content.toLowerCase().includes(contentFilter);
        
        // 状态筛选
        const matchesStatus = !statusFilter || prompt.status === statusFilter;
        
        // 时间范围筛选
        let matchesDateRange = true;
        if (startDateFilter || endDateFilter) {
            // 将提示词创建时间转换为日期对象进行比较
            const promptDate = new Date(prompt.createTime);
            
            if (startDateFilter) {
                const startDate = new Date(startDateFilter);
                if (promptDate < startDate) {
                    matchesDateRange = false;
                }
            }
            
            if (endDateFilter) {
                const endDate = new Date(endDateFilter);
                // 将结束日期设置为当天的23:59:59
                endDate.setHours(23, 59, 59, 999);
                if (promptDate > endDate) {
                    matchesDateRange = false;
                }
            }
        }
        
        return matchesSearch && matchesLocation && matchesRole && matchesCategory && matchesTitle && matchesContent && matchesStatus && matchesDateRange;
    });
    
    currentPage = 1;
    renderPromptsTable();
}

/**
 * 处理搜索功能
 * @param {string} searchTerm - 搜索关键词
 */
function handleSearch(searchTerm) {
    applyFilters();
}

/**
 * 搜索重置处理函数
 */
function handleSearchReset() {
    // 重置角色筛选下拉框
    const roleFilter = document.getElementById('role-filter');
    const categoryFilter = document.getElementById('category-filter');
    const titleFilter = document.getElementById('title-filter');
    const contentFilter = document.getElementById('content-filter');
    const startDateFilter = document.getElementById('start-date-filter');
    const endDateFilter = document.getElementById('end-date-filter');
    const statusFilter = document.getElementById('status-filter');
    
    if (roleFilter) roleFilter.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (titleFilter) titleFilter.value = '';
    if (contentFilter) contentFilter.value = '';
    if (startDateFilter) startDateFilter.value = '';
    if (endDateFilter) endDateFilter.value = '';
    if (statusFilter) statusFilter.value = '';
    
    // 重新应用筛选（保持当前标签页的位置筛选）
    applyFilters();
}

/**
 * 渲染提示词表格
 */
function renderPromptsTable() {
    console.log('开始渲染表格...');
    const tableBody = document.getElementById('prompt-table-body');
    console.log('表格容器查找结果:', tableBody);
    
    if (!tableBody) {
        console.error('未找到表格容器 prompt-table-body');
        return;
    }

    // 计算分页数据
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredPrompts.slice(startIndex, endIndex);
    
    console.log('分页数据:', {
        currentPage,
        itemsPerPage,
        startIndex,
        endIndex,
        filteredPromptsLength: filteredPrompts.length,
        pageDataLength: pageData.length
    });

    // 清空表格
    tableBody.innerHTML = '';

    // 渲染数据行
    pageData.forEach((prompt, index) => {
        console.log(`渲染第${index + 1}行数据:`, prompt);
        const row = createPromptRow(prompt);
        tableBody.appendChild(row);
    });
    
    console.log('表格渲染完成，共渲染', pageData.length, '行数据');

    // 更新分页信息
    updatePagination();
    
    // 绑定悬停事件
    bindHoverEvents();
}

/**
 * 创建提示词表格行
 * @param {Object} prompt - 提示词数据
 * @returns {HTMLElement} 表格行元素
 */
function createPromptRow(prompt) {
    const row = document.createElement('tr');
    row.className = 'bg-white border-b hover:bg-gray-50';
    row.setAttribute('data-prompt-id', prompt.id);
    
    // 创建状态切换开关的容器ID
    const toggleId = `toggle-container-${prompt.id}`;
    
    // 提示词标题列内容：显示展开/收起按钮或占位符和标题
    const titleContent = prompt.hasHistory ? 
        `<div class="flex items-center space-x-2">
            <button onclick="toggleVersionHistory(${prompt.id})" 
                    class="text-gray-400 hover:text-gray-600 transition-colors" 
                    id="version-toggle-${prompt.id}"
                    title="展开/收起历史版本">
                <i class="fas fa-chevron-right text-xs"></i>
            </button>
            <span class="text-sm font-medium text-gray-900">${prompt.name}</span>
        </div>` : 
        `<div class="flex items-center space-x-2">
            <span class="w-3 inline-block"></span>
            <span class="text-sm font-medium text-gray-900">${prompt.name}</span>
        </div>`;
    
    // 提示词内容列：显示部分内容，悬停时显示全文
    const contentPreview = prompt.content.length > 20 ? prompt.content.substring(0, 20) + '...' : prompt.content;
    
    // 根据当前标签页决定是否显示分类列
    const isAiPolishTab = currentLocationFilter === 'AI润色';
    const categoryCell = isAiPolishTab ? 
        `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${prompt.aiCategory || '-'}
        </td>` : '';
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
            ${titleContent}
        </td>
        ${categoryCell}
        <td class="px-6 py-4 text-sm text-gray-500 prompt-content-cell" data-full-content="${prompt.content.replace(/"/g, '&quot;')}">
            ${contentPreview}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${prompt.applicationRole}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${prompt.createTime}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div id="${toggleId}"></div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
            <button onclick="editPrompt(${prompt.id})" 
                    class="text-blue-600 hover:text-blue-900 transition-colors">
                编辑
            </button>
            <button onclick="deletePrompt(${prompt.id})" 
                    class="text-red-600 hover:text-red-900 transition-colors">
                删除
            </button>
        </td>
    `;
    
    // 创建ToggleSwitch实例
    setTimeout(() => {
        const isEnabled = prompt.status === '启用';
        new ToggleSwitch({
            containerId: toggleId,
            id: `status-toggle-${prompt.id}`,
            checked: isEnabled,
            size: 'sm',
            onChange: (checked, toggleId, event) => {
                handleStatusToggle(prompt.id, checked);
            }
        });
    }, 0);
    
    return row;
}

/**
 * 处理状态切换
 * @param {number} promptId - 提示词ID
 * @param {boolean} enabled - 新的启用状态
 */
function handleStatusToggle(promptId, enabled) {
    console.log(`切换提示词 ${promptId} 状态为:`, enabled ? '启用' : '停用');
    
    // 更新数据中的状态
    const prompt = currentPrompts.find(p => p.id === promptId);
    if (prompt) {
        prompt.status = enabled ? '启用' : '停用';
        console.log(`提示词 "${prompt.name}" 状态已更新为: ${prompt.status}`);
        
        // 这里可以添加API调用来同步到服务器
        // updatePromptStatus(promptId, enabled);
    }
}

/**
 * 更新分页组件
 */
function updatePagination() {
    const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage);
    
    // 更新总记录数显示
    const totalCountElement = document.getElementById('total-count');
    if (totalCountElement) {
        totalCountElement.textContent = filteredPrompts.length;
    }
    
    // 更新分页信息显示
    const startItem = filteredPrompts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = Math.min(currentPage * itemsPerPage, filteredPrompts.length);
    
    // 查找分页信息段落并更新
    const paginationInfo = document.querySelector('.text-sm.text-gray-700');
    if (paginationInfo) {
        const spans = paginationInfo.querySelectorAll('span.font-medium');
        if (spans.length >= 3) {
            spans[0].textContent = startItem;
            spans[1].textContent = endItem;
            spans[2].textContent = filteredPrompts.length;
        }
    }
}

/**
 * 初始化模态框事件
 */
function initModalEvents() {
    // 分页按钮事件
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPromptsTable();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderPromptsTable();
            }
        });
    }
    
    // 提示词表单提交事件
    const promptForm = document.getElementById('prompt-form');
    if (promptForm) {
        promptForm.addEventListener('submit', handlePromptFormSubmit);
    }
    
    // 模态框关闭事件
    initModalCloseEvents();
}

/**
 * 切换AI润色分类字段的显示/隐藏
 */
function toggleCategoryField() {
    const locationSelect = document.getElementById('prompt-location');
    const categoryField = document.getElementById('ai-category-field');
    const categorySelect = document.getElementById('ai-category');
    
    if (locationSelect && categoryField && categorySelect) {
        if (locationSelect.value === 'AI润色') {
            categoryField.classList.remove('hidden');
            categorySelect.setAttribute('required', 'required');
        } else {
            categoryField.classList.add('hidden');
            categorySelect.removeAttribute('required');
            categorySelect.value = ''; // 清空选择
        }
    }
}

// 将函数暴露到全局作用域
window.toggleCategoryField = toggleCategoryField;

/**
 * 处理提示词表单提交
 * @param {Event} event - 表单提交事件
 */
function handlePromptFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // 获取表单数据
    const promptData = {
        name: document.getElementById('prompt-name').value.trim(),
        applicationLocation: document.getElementById('prompt-location').value,
        applicationRole: document.getElementById('prompt-role').value,
        content: document.getElementById('prompt-content').value.trim(),
        status: document.getElementById('prompt-active').checked ? '启用' : '停用'
    };
    
    // 如果选择了AI润色，添加分类信息
    if (promptData.applicationLocation === 'AI润色') {
        const aiCategory = document.getElementById('ai-category').value;
        if (!aiCategory) {
            alert('请选择AI润色分类');
            return;
        }
        promptData.aiCategory = aiCategory;
    }
    
    // 表单验证
    if (!promptData.name || !promptData.applicationLocation || !promptData.applicationRole || !promptData.content) {
        alert('请填写所有必填字段');
        return;
    }
    
    // 判断是新增还是编辑
    const editId = form.dataset.editId;
    
    if (editId) {
        // 编辑现有提示词
        updatePrompt(parseInt(editId), promptData);
    } else {
        // 新增提示词
        addNewPrompt(promptData);
    }
    
    // 关闭模态框
    closePromptModal();
    
    // 重新渲染表格
    renderPromptsTable();
}

/**
 * 新增提示词
 * @param {Object} promptData - 提示词数据
 */
function addNewPrompt(promptData) {
    const newId = Math.max(...currentPrompts.map(p => p.id)) + 1;
    const newPrompt = {
        id: newId,
        ...promptData,
        createTime: new Date().toLocaleString('zh-CN')
    };
    
    currentPrompts.unshift(newPrompt);
    filteredPrompts = [...currentPrompts];
    
    console.log('新增提示词成功:', newPrompt);
}

/**
 * 更新提示词
 * @param {number} id - 提示词ID
 * @param {Object} promptData - 更新的数据
 */
function updatePrompt(id, promptData) {
    const index = currentPrompts.findIndex(p => p.id === id);
    if (index !== -1) {
        currentPrompts[index] = {
            ...currentPrompts[index],
            ...promptData
        };
        filteredPrompts = [...currentPrompts];
        
        console.log('更新提示词成功:', currentPrompts[index]);
    }
}

/**
 * 关闭提示词模态框
 */
function closePromptModal() {
    const modal = document.getElementById('prompt-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}




/**
 * 关闭删除模态框
 */
function closeDeleteModal() {
    const modal = document.getElementById('delete-prompt-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

/**
 * 初始化模态框关闭事件
 */
function initModalCloseEvents() {
    // 提示词模态框关闭事件
    const promptModal = document.getElementById('prompt-modal');
    if (promptModal) {
        // 点击背景关闭
        promptModal.addEventListener('click', (e) => {
            if (e.target === promptModal) {
                closePromptModal();
            }
        });
    }
    
    // 测试模态框关闭
    const testModal = document.getElementById('test-modal');
    if (testModal) {
        testModal.addEventListener('click', (e) => {
            if (e.target === testModal) {
                closeTestModal();
            }
        });
    }
    
    // 删除模态框关闭
    const deleteModal = document.getElementById('delete-modal');
    if (deleteModal) {
        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) {
                closeDeleteModal();
            }
        });
    }
}

// 全局函数，供HTML调用
// 全局函数，供HTML调用
window.editPrompt = function(id) {
    const prompt = currentPrompts.find(p => p.id === id);
    if (prompt) {
        openPromptModal(prompt);
    }
};



window.deletePrompt = function(id) {
    const prompt = currentPrompts.find(p => p.id === id);
    if (prompt) {
        openDeleteModal(prompt);
    }
};

// 暴露全局函数
window.closePromptModal = closePromptModal;
window.closeDeleteModal = closeDeleteModal;

/**
 * 打开提示词编辑模态框
 * @param {Object} prompt - 提示词数据（编辑时传入，新增时为空）
 */
/**
 * 打开新增/编辑提示词模态框
 * @param {Object|null} prompt - 提示词数据，null表示新增
 */
function openPromptModal(prompt = null) {
    const modal = document.getElementById('prompt-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('prompt-form');
    
    if (!modal || !title || !form) return;
    
    // 设置标题
    title.textContent = prompt ? '编辑提示词' : '新增提示词';
    
    // 填充表单数据
    if (prompt) {
        document.getElementById('prompt-name').value = prompt.name;
        document.getElementById('prompt-location').value = prompt.applicationLocation;
        document.getElementById('prompt-role').value = prompt.applicationRole;
        document.getElementById('prompt-content').value = prompt.content;
        document.getElementById('prompt-active').checked = prompt.status === '启用';
        
        // 处理AI润色分类字段
        if (prompt.applicationLocation === 'AI润色' && prompt.aiCategory) {
            document.getElementById('ai-category').value = prompt.aiCategory;
        }
        
        // 存储当前编辑的提示词ID
        form.dataset.editId = prompt.id;
    } else {
        form.reset();
        // 默认启用新提示词
        document.getElementById('prompt-active').checked = true;
        // 清除编辑ID
        delete form.dataset.editId;
    }
    
    // 触发分类字段显示逻辑
    toggleCategoryField();
    
    // 显示模态框
    modal.classList.remove('hidden');
}



/**
 * 打开删除确认模态框
 * @param {Object} prompt - 提示词数据
 */
function openDeleteModal(prompt) {
    const modal = document.getElementById('delete-prompt-modal');
    const nameEl = document.getElementById('delete-prompt-name');
    
    if (!modal || !nameEl) return;
    
    nameEl.textContent = prompt.name;
    
    // 设置删除确认按钮事件
    const confirmBtn = document.getElementById('confirm-delete');
    if (confirmBtn) {
        confirmBtn.onclick = () => {
            handleDeletePrompt(prompt.id);
            closeModal('delete-prompt-modal');
        };
    }
    
    modal.classList.remove('hidden');
}





/**
 * 关闭模态框
 * @param {string} modalId - 模态框ID
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

/**
 * 处理导入功能
 */
function handleImport() {
    // 创建文件输入元素
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('导入文件:', file.name);
            // TODO: 实现文件导入逻辑
        }
    };
    input.click();
}

/**
 * 处理下载模板功能
 */
function handleDownloadTemplate() {
    const template = {
        name: '提示词名称',
        applicationLocation: '应用位置（小区事务概览/AI速览）',
        applicationRole: '应用角色（业委会/业主/物业）',
        content: '提示词内容',
        description: '提示词描述',
        status: '启用'
    };
    
    const dataStr = JSON.stringify([template], null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = '提示词导入模板.json';
    link.click();
}

/**
 * 处理导出功能
 */
function handleExport() {
    const dataStr = JSON.stringify(currentPrompts, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `提示词数据_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

/**
 * 处理删除提示词
 * @param {number} id - 提示词ID
 */
function handleDeletePrompt(id) {
    const index = currentPrompts.findIndex(p => p.id === id);
    if (index > -1) {
        currentPrompts.splice(index, 1);
        filteredPrompts = filteredPrompts.filter(p => p.id !== id);
        renderPromptsTable();
        console.log('删除提示词:', id);
    }
}

/**
 * 导入提示词
 */
function importPrompts() {
    console.log('导入提示词功能');
    // TODO: 实现导入功能
}

/**
 * 下载模板
 */
function downloadTemplate() {
    console.log('下载模板功能');
    // TODO: 实现下载模板功能
}

/**
 * 导出提示词
 */
function exportPrompts() {
    console.log('导出提示词功能');
    // TODO: 实现导出功能
}

/**
 * 切换版本历史显示/隐藏
 * @param {number} promptId - 提示词ID
 */
function toggleVersionHistory(promptId) {
    const prompt = mockPrompts.find(p => p.id === promptId);
    if (!prompt || !prompt.hasHistory) {
        return;
    }

    const toggleButton = document.getElementById(`version-toggle-${promptId}`);
    const icon = toggleButton.querySelector('i');
    const mainRow = document.querySelector(`tr[data-prompt-id="${promptId}"]`);
    
    // 检查是否已经展开
    const existingHistoryRows = document.querySelectorAll(`tr[data-history-for="${promptId}"]`);
    
    if (existingHistoryRows.length > 0) {
        // 收起历史版本
        existingHistoryRows.forEach(row => row.remove());
        icon.className = 'fas fa-chevron-right text-xs';
        toggleButton.title = '展开历史版本';
    } else {
        // 展开历史版本
        prompt.historyVersions.forEach((historyVersion, index) => {
            const historyRow = createHistoryVersionRow(prompt, historyVersion, index);
            mainRow.parentNode.insertBefore(historyRow, mainRow.nextSibling);
        });
        icon.className = 'fas fa-chevron-down text-xs';
        toggleButton.title = '收起历史版本';
    }
}

/**
 * 创建历史版本行
 * @param {Object} prompt - 主提示词数据
 * @param {Object} historyVersion - 历史版本数据
 * @param {number} index - 历史版本索引
 * @returns {HTMLElement} 历史版本行元素
 */
function createHistoryVersionRow(prompt, historyVersion, index) {
    const row = document.createElement('tr');
    row.className = 'bg-gray-50 border-b';
    row.setAttribute('data-history-for', prompt.id);
    row.setAttribute('data-history-index', index);
    
    // 创建状态切换开关的容器ID
    const historyToggleId = `history-toggle-container-${prompt.id}-${index}`;
    
    // 根据当前标签页决定是否显示分类列
    const isAiPolishTab = currentLocationFilter === 'AI润色';
    const categoryCell = isAiPolishTab ? 
        `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${prompt.aiCategory || '-'}
        </td>` : '';
    
    // 提示词内容列：显示部分内容，悬停时显示全文
    const contentPreview = historyVersion.content.length > 20 ? historyVersion.content.substring(0, 20) + '...' : historyVersion.content;
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            <div class="flex items-center space-x-2 ml-6">
                <span class="text-sm text-gray-600">${prompt.name}</span>
            </div>
        </td>
        ${categoryCell}
        <td class="px-6 py-4 text-sm text-gray-500 prompt-content-cell" data-full-content="${historyVersion.content.replace(/"/g, '&quot;')}">
            ${contentPreview}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${prompt.applicationRole}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${historyVersion.createTime}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div id="${historyToggleId}"></div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
            <button onclick="editHistoryVersion(${prompt.id}, ${index})" 
                    class="text-blue-600 hover:text-blue-900 transition-colors">
                编辑
            </button>
            <button onclick="deleteHistoryVersion(${prompt.id}, ${index})" 
                    class="text-red-600 hover:text-red-900 transition-colors">
                删除
            </button>
        </td>
    `;
    
    // 创建历史版本的ToggleSwitch实例
    setTimeout(() => {
        const isEnabled = historyVersion.status === '启用';
        new ToggleSwitch({
            containerId: historyToggleId,
            id: `history-status-toggle-${prompt.id}-${index}`,
            checked: isEnabled,
            size: 'sm',
            onChange: (checked, toggleId, event) => {
                handleHistoryStatusToggle(prompt.id, index, checked);
            }
        });
    }, 0);
    
    return row;
}

/**
 * 处理历史版本状态切换
 * @param {number} promptId - 提示词ID
 * @param {number} versionIndex - 版本索引
 * @param {boolean} enabled - 新的启用状态
 */
function handleHistoryStatusToggle(promptId, versionIndex, enabled) {
    console.log(`切换提示词 ${promptId} 历史版本 ${versionIndex} 状态为:`, enabled ? '启用' : '停用');
    
    // 更新数据中的状态
    const prompt = currentPrompts.find(p => p.id === promptId);
    if (prompt && prompt.historyVersions[versionIndex]) {
        prompt.historyVersions[versionIndex].status = enabled ? '启用' : '停用';
        console.log(`提示词 "${prompt.name}" 版本 ${prompt.historyVersions[versionIndex].version} 状态已更新为: ${prompt.historyVersions[versionIndex].status}`);
        
        // 这里可以添加API调用来同步到服务器
        // updateHistoryVersionStatus(promptId, versionIndex, enabled);
    }
}

/**
 * 编辑历史版本
 * @param {number} promptId - 提示词ID
 * @param {number} versionIndex - 版本索引
 */
function editHistoryVersion(promptId, versionIndex) {
    const prompt = mockPrompts.find(p => p.id === promptId);
    if (!prompt || !prompt.historyVersions[versionIndex]) {
        return;
    }
    
    const historyVersion = prompt.historyVersions[versionIndex];
    console.log(`编辑历史版本: 提示词ID ${promptId}, 版本 ${historyVersion.version}`);
    // TODO: 实现编辑历史版本功能
    alert(`编辑版本 ${historyVersion.version} 功能待实现`);
}

/**
 * 删除历史版本
 * @param {number} promptId - 提示词ID
 * @param {number} versionIndex - 版本索引
 */
function deleteHistoryVersion(promptId, versionIndex) {
    const prompt = mockPrompts.find(p => p.id === promptId);
    if (!prompt || !prompt.historyVersions[versionIndex]) {
        return;
    }
    
    const historyVersion = prompt.historyVersions[versionIndex];
    const confirmDelete = confirm(`确定要删除版本 ${historyVersion.version} 吗？\n\n此操作不可恢复。`);
    
    if (confirmDelete) {
        // 从历史版本数组中删除
        prompt.historyVersions.splice(versionIndex, 1);
        
        // 如果没有历史版本了，更新hasHistory标志
        if (prompt.historyVersions.length === 0) {
            prompt.hasHistory = false;
        }
        
        // 重新渲染表格
        renderPromptsTable();
        
        console.log(`已删除版本 ${historyVersion.version}`);
    }
}

/**
 * 生成新版本号
 * @param {string} currentVersion - 当前版本号 (如 "v1", "v2")
 * @returns {string} 新版本号 (如 "v2", "v3")
 */
function generateNewVersionNumber(currentVersion) {
    // 提取版本号中的数字部分
    const versionNum = parseInt(currentVersion.replace('v', '')) || 0;
    return 'v' + (versionNum + 1).toString();
}

/**
 * 绑定悬停事件
 */
function bindHoverEvents() {
    // 移除之前可能存在的tooltip
    const existingTooltip = document.getElementById('custom-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
    
    // 为所有内容单元格添加悬停事件
    const contentCells = document.querySelectorAll('.prompt-content-cell');
    contentCells.forEach(cell => {
        // 移除之前可能绑定的事件监听器
        const clone = cell.cloneNode(true);
        cell.parentNode.replaceChild(clone, cell);
        
        // 添加新的事件监听器
        clone.addEventListener('mouseenter', function(e) {
            const fullContent = this.getAttribute('data-full-content');
            if (fullContent && fullContent.length > 20) {
                showTooltip(e, fullContent);
            }
        });
        
        clone.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

/**
 * 显示tooltip
 * @param {Event} e - 鼠标事件
 * @param {string} content - 要显示的内容
 */
function showTooltip(e, content) {
    // 创建或获取tooltip元素
    let tooltip = document.getElementById('custom-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'custom-tooltip';
        tooltip.className = 'tooltip';
        document.body.appendChild(tooltip);
    }
    
    // 设置内容
    tooltip.textContent = content;
    
    // 显示tooltip
    tooltip.style.display = 'block';
    
    // 定位tooltip
    const rect = e.target.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    tooltip.style.top = (rect.bottom + scrollTop + 10) + 'px';
    tooltip.style.left = (rect.left + scrollLeft) + 'px';
    
    // 确保tooltip不会超出屏幕右侧
    const tooltipRect = tooltip.getBoundingClientRect();
    if (tooltipRect.right > window.innerWidth) {
        tooltip.style.left = (window.innerWidth - tooltipRect.width - 10) + 'px';
    }
}

/**
 * 隐藏tooltip
 */
function hideTooltip() {
    const tooltip = document.getElementById('custom-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// 将函数暴露到全局作用域
window.toggleVersionHistory = toggleVersionHistory;
window.handleHistoryStatusToggle = handleHistoryStatusToggle;
window.editHistoryVersion = editHistoryVersion;
window.deleteHistoryVersion = deleteHistoryVersion;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initPromptManagement();
    
    // 监听窗口点击事件，用于隐藏tooltip
    document.addEventListener('click', function(e) {
        const tooltip = document.getElementById('custom-tooltip');
        if (tooltip && tooltip.style.display !== 'none') {
            // 检查点击是否在tooltip或内容单元格上
            const isOnTooltip = tooltip.contains(e.target);
            const isOnContentCell = e.target.closest('.prompt-content-cell');
            
            if (!isOnTooltip && !isOnContentCell) {
                hideTooltip();
            }
        }
    });
});
/**
 * 下载中心页面逻辑
 * 实现文件筛选、列表展示和下载功能
 */

// 模拟数据
const mockData = [
    {
        id: 1,
        module: 'notification',
        moduleName: '通知管理',
        filename: '通知导出数据_20241201.xlsx',
        applyTime: '2024-12-01 09:30:00',
        applicant: '张三',
        generateTime: '2024-12-01 09:35:00',
        fileSize: '2.5MB',
        downloadUrl: '/downloads/notification_20241201.xlsx'
    },
    {
        id: 2,
        module: 'announcement',
        moduleName: '公告管理',
        filename: '公告统计报表_20241130.xlsx',
        applyTime: '2024-11-30 14:20:00',
        applicant: '李四',
        generateTime: '2024-11-30 14:25:00',
        fileSize: '1.8MB',
        downloadUrl: '/downloads/announcement_20241130.xlsx'
    },
    {
        id: 3,
        module: 'event',
        moduleName: '事件管理',
        filename: '事件处理记录_20241129.xlsx',
        applyTime: '2024-11-29 16:45:00',
        applicant: '王五',
        generateTime: '',
        fileSize: '',
        downloadUrl: ''
    },
    {
        id: 4,
        module: 'activity',
        moduleName: '动态管理',
        filename: '动态分析报告_20241128.xlsx',
        applyTime: '2024-11-28 11:15:00',
        applicant: '赵六',
        generateTime: '',
        fileSize: '',
        downloadUrl: ''
    },
    {
        id: 5,
        module: 'process',
        moduleName: '流程管理',
        filename: '流程审批数据_20241127.xlsx',
        applyTime: '2024-11-27 08:30:00',
        applicant: '孙七',
        generateTime: '2024-11-27 08:35:00',
        fileSize: '1.9MB',
        downloadUrl: '/downloads/process_20241127.xlsx'
    },
    {
        id: 6,
        module: 'system',
        moduleName: '系统管理',
        filename: '系统日志备份_20241126.xlsx',
        applyTime: '2024-11-26 20:00:00',
        applicant: '周八',
        generateTime: '2024-11-26 20:10:00',
        fileSize: '15.6MB',
        downloadUrl: '/downloads/system_20241126.xlsx'
    },
    {
        id: 7,
        module: 'notification',
        moduleName: '通知管理',
        filename: '通知模板导出数据_20241125.xlsx',
        applyTime: '2024-11-25 13:45:00',
        applicant: '吴九',
        generateTime: '2024-11-25 13:50:00',
        fileSize: '1.2MB',
        downloadUrl: '/downloads/notification_20241125.xlsx'
    },
    {
        id: 8,
        module: 'announcement',
        moduleName: '公告管理',
        filename: '公告内容备份_20241124.xlsx',
        applyTime: '2024-11-24 10:20:00',
        applicant: '郑十',
        generateTime: '2024-11-24 10:25:00',
        fileSize: '3.8MB',
        downloadUrl: '/downloads/announcement_20241124.xlsx'
    }
];

// 全局变量
let currentPage = 1;
const pageSize = 10;
let filteredData = [...mockData];
let currentDownloadData = null;
let searchComponent = null;

/**
 * 初始化下载中心页面
 */
function initDownloadCenter() {
    // 初始化搜索组件
    initSearchComponent();
    
    bindFilterEvents();
    bindPaginationEvents();
    bindDownloadEvents();
    renderFileList();
    updatePagination();
}

/**
 * 初始化搜索组件
 */
function initSearchComponent() {
    // 检查容器元素是否存在
    const container = document.getElementById('search-container');
    if (!container) {
        console.error('Search container not found. Element with id "search-container" does not exist.');
        return;
    }
    
    // 检查 SearchComponent 是否可用
    if (typeof window.SearchComponent === 'undefined') {
        console.error('SearchComponent not found. Please ensure search-component.js is loaded.');
        return;
    }
    
    console.log('Initializing SearchComponent...');
    
    // 创建搜索组件实例
    try {
        searchComponent = new window.SearchComponent({
            containerId: 'search-container',
            placeholder: '搜索文件名称或申请人',
            onSearch: (searchValue) => {
                console.log('Search triggered with value:', searchValue);
                applyFilters();
            },
            onReset: () => {
                console.log('Reset triggered');
                applyFilters();
            },
            label: '搜索',
            showLabel: true
        });
        console.log('SearchComponent initialized successfully');
    } catch (error) {
        console.error('Failed to initialize SearchComponent:', error);
    }
}

/**
 * 绑定筛选事件
 */
function bindFilterEvents() {
    const moduleFilter = document.getElementById('module-filter');
    const startDateFilter = document.getElementById('start-date-filter');
    const endDateFilter = document.getElementById('end-date-filter');
    
    // 下拉框变化时自动筛选
    if (moduleFilter) {
        moduleFilter.addEventListener('change', applyFilters);
    }
    
    // 时间范围筛选
    if (startDateFilter) {
        startDateFilter.addEventListener('change', applyFilters);
    }
    
    if (endDateFilter) {
        endDateFilter.addEventListener('change', applyFilters);
    }
}

/**
 * 应用筛选条件
 */
function applyFilters() {
    const moduleFilter = document.getElementById('module-filter')?.value || '';
    const startDateFilter = document.getElementById('start-date-filter')?.value || '';
    const endDateFilter = document.getElementById('end-date-filter')?.value || '';
    const searchValue = searchComponent ? searchComponent.getValue().toLowerCase() : '';
    
    filteredData = mockData.filter(item => {
        // 功能模块筛选 - 使用中文模块名称进行匹配
        const moduleMatch = !moduleFilter || item.moduleName === moduleFilter;
        
        // 申请时间范围筛选
        let dateMatch = true;
        if (startDateFilter || endDateFilter) {
            const applyDate = item.applyTime.split(' ')[0]; // 提取日期部分 (YYYY-MM-DD)
            
            if (startDateFilter && endDateFilter) {
                // 同时有开始和结束时间
                dateMatch = applyDate >= startDateFilter && applyDate <= endDateFilter;
            } else if (startDateFilter) {
                // 只有开始时间
                dateMatch = applyDate >= startDateFilter;
            } else if (endDateFilter) {
                // 只有结束时间
                dateMatch = applyDate <= endDateFilter;
            }
        }
        
        // 搜索筛选（文件名称或申请人）
        const searchMatch = !searchValue || 
            item.filename.toLowerCase().includes(searchValue) || 
            item.applicant.toLowerCase().includes(searchValue);
        
        return moduleMatch && dateMatch && searchMatch;
    });
    
    currentPage = 1; // 重置到第一页
    renderFileList();
    updatePagination();
}

/**
 * 重置筛选条件
 */
function resetFilters() {
    // 清空所有筛选条件
    const moduleFilter = document.getElementById('module-filter');
    const startDateFilter = document.getElementById('start-date-filter');
    const endDateFilter = document.getElementById('end-date-filter');
    
    if (moduleFilter) moduleFilter.value = '';
    if (startDateFilter) startDateFilter.value = '';
    if (endDateFilter) endDateFilter.value = '';
    
    // 清空搜索组件
    if (searchComponent) {
        searchComponent.setValue('');
    }
    
    // 重置数据
    filteredData = [...mockData];
    currentPage = 1;
    renderFileList();
    updatePagination();
}

/**
 * 渲染文件列表
 */
function renderFileList() {
    const fileListContainer = document.getElementById('file-list');
    const emptyState = document.getElementById('empty-state');
    
    if (!fileListContainer) return;
    
    // 计算分页数据
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    // 清空现有内容
    fileListContainer.innerHTML = '';
    
    if (pageData.length === 0) {
        // 显示空状态
        emptyState?.classList.remove('hidden');
        return;
    }
    
    // 隐藏空状态
    emptyState?.classList.add('hidden');
    
    // 渲染数据行
    pageData.forEach(item => {
        const row = createFileRow(item);
        fileListContainer.appendChild(row);
    });
}

/**
 * 创建文件行元素
 */
function createFileRow(item) {
    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-50';
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.moduleName}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <div class="flex items-center">
                <i class="fas fa-file-alt text-gray-400 mr-2"></i>
                ${item.filename}
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.applyTime}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.applicant}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.generateTime || '-'}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.fileSize || '-'}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            ${createActionButtons(item)}
        </td>
    `;
    
    return row;
}

/**
 * 创建操作按钮
 */
function createActionButtons(item) {
    // 检查文件是否生成成功（生成时间和文件大小不为空）
    const isGenerated = item.generateTime && item.fileSize;
    
    if (isGenerated) {
        // 生成成功，显示正常的下载按钮
        return `
            <button class="download-btn text-blue-600 hover:text-blue-900 transition-colors duration-200" 
                    data-id="${item.id}" data-filename="${item.filename}" data-url="${item.downloadUrl}">
                下载
            </button>
        `;
    } else {
        // 生成失败，显示置灰的按钮
        return `
            <button class="text-gray-400 cursor-not-allowed" disabled>
                下载
            </button>
        `;
    }
}

/**
 * 绑定分页事件
 */
function bindPaginationEvents() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    prevBtn?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderFileList();
            updatePagination();
        }
    });
    
    nextBtn?.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredData.length / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            renderFileList();
            updatePagination();
        }
    });
}

/**
 * 更新分页信息
 */
function updatePagination() {
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    
    // 更新分页文本
    const pageStart = document.getElementById('page-start');
    const pageEnd = document.getElementById('page-end');
    const pageTotal = document.getElementById('page-total');
    
    if (pageStart) pageStart.textContent = totalItems > 0 ? startItem : 0;
    if (pageEnd) pageEnd.textContent = endItem;
    if (pageTotal) pageTotal.textContent = totalItems;
    
    // 更新按钮状态
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage <= 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages;
    }
    
    // 更新页码按钮
    updatePageNumbers(totalPages);
}

/**
 * 更新页码按钮
 */
function updatePageNumbers(totalPages) {
    const pageNumbersContainer = document.getElementById('page-numbers');
    if (!pageNumbersContainer) return;
    
    pageNumbersContainer.innerHTML = '';
    
    // 显示页码范围
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // 调整起始页
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `px-3 py-1 text-sm border rounded ${
            i === currentPage 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
        }`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderFileList();
            updatePagination();
        });
        pageNumbersContainer.appendChild(pageBtn);
    }
}

/**
 * 绑定下载事件
 */
function bindDownloadEvents() {
    const modal = document.getElementById('download-modal');
    const cancelBtn = document.getElementById('cancel-download');
    const confirmBtn = document.getElementById('confirm-download');
    const filenameSpan = document.getElementById('download-filename');
    
    let currentDownloadData = null;
    
    // 使用事件委托处理下载按钮点击
    document.addEventListener('click', (e) => {
        if (e.target.closest('.download-btn')) {
            const btn = e.target.closest('.download-btn');
            const filename = btn.dataset.filename;
            const url = btn.dataset.url;
            const id = btn.dataset.id;
            
            currentDownloadData = { filename, url, id };
            
            if (filenameSpan) {
                filenameSpan.textContent = filename;
            }
            
            modal?.classList.remove('hidden');
        }
    });
    
    // 取消下载
    cancelBtn?.addEventListener('click', () => {
        modal?.classList.add('hidden');
        currentDownloadData = null;
    });
    
    // 确认下载
    confirmBtn?.addEventListener('click', () => {
        if (currentDownloadData) {
            performDownload(currentDownloadData);
            modal?.classList.add('hidden');
            currentDownloadData = null;
        }
    });
    
    // 点击模态框背景关闭
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            currentDownloadData = null;
        }
    });
}

/**
 * 执行下载
 */
function performDownload(downloadData) {
    // 模拟下载过程
    console.log('开始下载文件:', downloadData.filename);
    
    // 创建下载链接（实际项目中应该是真实的文件URL）
    const link = document.createElement('a');
    link.href = downloadData.url;
    link.download = downloadData.filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 显示下载成功提示
    showNotification('文件下载已开始', 'success');
}



/**
 * 显示通知消息
 */
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    const bgColor = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    }[type] || 'bg-blue-500';
    
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initDownloadCenter);

// 导出数据函数供其他模块使用
export { initDownloadCenter };
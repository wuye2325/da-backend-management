/**
 * DataTable 通用数据表格组件
 * 支持数据展示、排序、筛选、分页等功能
 */

class DataTable {
    /**
     * 构造函数
     * @param {Object} options - 配置选项
     * @param {string} options.containerId - 容器元素ID
     * @param {Array} options.columns - 列配置
     * @param {Array} options.data - 数据数组
     * @param {Object} options.pagination - 分页配置
     * @param {Object} options.filter - 筛选配置
     * @param {Function} options.onRowClick - 行点击回调
     * @param {Function} options.onSort - 排序回调
     */
    constructor(options) {
        this.containerId = options.containerId;
        this.columns = options.columns || [];
        this.originalData = options.data || [];
        this.filteredData = [...this.originalData];
        this.currentData = [];
        
        // 分页配置
        this.pagination = {
            enabled: true,
            pageSize: 10,
            currentPage: 1,
            pageSizes: [10, 20, 50, 100],
            showInfo: true,
            showSizeChanger: true,
            ...options.pagination
        };
        
        // 筛选配置
        this.filter = {
            enabled: true,
            fields: [],
            ...options.filter
        };
        
        // 排序状态
        this.sortState = {
            column: null,
            direction: null // 'asc' | 'desc'
        };
        
        // 回调函数
        this.onRowClick = options.onRowClick;
        this.onSort = options.onSort;
        this.onFilter = options.onFilter;
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化表格
     */
    init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error('DataTable: 容器元素未找到', this.containerId);
            return;
        }
        
        this.render();
        this.updateData();
    }
    
    /**
     * 渲染表格结构
     */
    render() {
        const html = `
            <div class="data-table">
                ${this.filter.enabled ? this.renderFilter() : ''}
                <div class="table-container">
                    <div class="table-wrapper">
                        <table class="table" id="${this.containerId}-table">
                            ${this.renderHeader()}
                            <tbody id="${this.containerId}-tbody">
                                <!-- 数据行将在这里动态生成 -->
                            </tbody>
                        </table>
                    </div>
                    <div id="${this.containerId}-empty" class="hidden text-center py-8 text-gray-500">
                        <i class="fas fa-inbox text-4xl mb-4 text-gray-300"></i>
                        <p>暂无数据</p>
                    </div>
                </div>
                ${this.pagination.enabled ? this.renderPagination() : ''}
            </div>
        `;
        
        this.container.innerHTML = html;
        this.bindEvents();
    }
    
    /**
     * 渲染筛选器
     */
    renderFilter() {
        if (!this.filter.fields || this.filter.fields.length === 0) {
            return '';
        }
        
        const filterFields = this.filter.fields.map(field => {
            switch (field.type) {
                case 'text':
                    return `
                        <div class="flex-1">
                            <label class="form-label">${field.label}</label>
                            <input type="text" 
                                   class="form-input" 
                                   placeholder="请输入${field.label}"
                                   data-filter-field="${field.key}"
                                   data-filter-type="text">
                        </div>
                    `;
                case 'select':
                    const options = field.options.map(opt => 
                        `<option value="${opt.value}">${opt.label}</option>`
                    ).join('');
                    return `
                        <div class="flex-1">
                            <label class="form-label">${field.label}</label>
                            <select class="form-select" 
                                    data-filter-field="${field.key}"
                                    data-filter-type="select">
                                <option value="">全部</option>
                                ${options}
                            </select>
                        </div>
                    `;
                case 'date':
                    return `
                        <div class="flex-1">
                            <label class="form-label">${field.label}</label>
                            <input type="date" 
                                   class="form-input"
                                   data-filter-field="${field.key}"
                                   data-filter-type="date">
                        </div>
                    `;
                default:
                    return '';
            }
        }).join('');
        
        return `
            <div class="bg-white p-4 rounded-lg shadow-sm mb-4">
                <div class="flex items-end gap-4 flex-wrap">
                    ${filterFields}
                    <div class="flex gap-2">
                        <button type="button" 
                                class="btn btn-primary"
                                onclick="${this.containerId}Instance.applyFilter()">
                            <i class="fas fa-search mr-2"></i>筛选
                        </button>
                        <button type="button" 
                                class="btn btn-outline"
                                onclick="${this.containerId}Instance.resetFilter()">
                            <i class="fas fa-undo mr-2"></i>重置
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * 渲染表头
     */
    renderHeader() {
        const headers = this.columns.map(column => {
            const sortable = column.sortable !== false;
            const sortIcon = this.getSortIcon(column.key);
            
            return `
                <th class="${sortable ? 'cursor-pointer hover:bg-gray-100' : ''}" 
                    ${sortable ? `onclick="${this.containerId}Instance.sort('${column.key}')"` : ''}>
                    <div class="flex items-center justify-between">
                        <span>${column.title}</span>
                        ${sortable ? `<i class="fas ${sortIcon} text-gray-400 ml-2"></i>` : ''}
                    </div>
                </th>
            `;
        }).join('');
        
        return `<thead><tr>${headers}</tr></thead>`;
    }
    
    /**
     * 渲染分页器
     */
    renderPagination() {
        return `
            <div class="flex items-center justify-between mt-4 p-4 bg-white rounded-lg shadow-sm">
                <div class="flex items-center gap-4">
                    ${this.pagination.showSizeChanger ? this.renderPageSizeSelector() : ''}
                    ${this.pagination.showInfo ? `<div id="${this.containerId}-info" class="text-sm text-gray-600"></div>` : ''}
                </div>
                <div id="${this.containerId}-pagination" class="pagination">
                    <!-- 分页按钮将在这里动态生成 -->
                </div>
            </div>
        `;
    }
    
    /**
     * 渲染页面大小选择器
     */
    renderPageSizeSelector() {
        const options = this.pagination.pageSizes.map(size => 
            `<option value="${size}" ${size === this.pagination.pageSize ? 'selected' : ''}>${size}条/页</option>`
        ).join('');
        
        return `
            <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">显示</span>
                <select class="form-select w-auto" 
                        onchange="${this.containerId}Instance.changePageSize(this.value)">
                    ${options}
                </select>
            </div>
        `;
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 将实例绑定到全局，供HTML事件调用
        window[`${this.containerId}Instance`] = this;
        
        // 筛选输入框事件
        if (this.filter.enabled) {
            const filterInputs = this.container.querySelectorAll('[data-filter-field]');
            filterInputs.forEach(input => {
                input.addEventListener('input', () => {
                    // 实时筛选（可选）
                    if (this.filter.realtime) {
                        this.applyFilter();
                    }
                });
                
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.applyFilter();
                    }
                });
            });
        }
    }
    
    /**
     * 更新数据
     */
    updateData() {
        this.applyPagination();
        this.renderTableBody();
        this.updatePagination();
        this.updateInfo();
    }
    
    /**
     * 渲染表格主体
     */
    renderTableBody() {
        const tbody = document.getElementById(`${this.containerId}-tbody`);
        const emptyDiv = document.getElementById(`${this.containerId}-empty`);
        
        if (this.currentData.length === 0) {
            tbody.innerHTML = '';
            emptyDiv.classList.remove('hidden');
            return;
        }
        
        emptyDiv.classList.add('hidden');
        
        const rows = this.currentData.map((row, index) => {
            const cells = this.columns.map(column => {
                let cellContent = this.getCellContent(row, column);
                return `<td>${cellContent}</td>`;
            }).join('');
            
            const clickHandler = this.onRowClick ? `onclick="${this.containerId}Instance.handleRowClick(${index})"` : '';
            const clickClass = this.onRowClick ? 'cursor-pointer hover:bg-blue-50' : '';
            
            return `<tr class="${clickClass}" ${clickHandler}>${cells}</tr>`;
        }).join('');
        
        tbody.innerHTML = rows;
    }
    
    /**
     * 获取单元格内容
     */
    getCellContent(row, column) {
        let value = this.getNestedValue(row, column.key);
        
        // 应用渲染函数
        if (column.render && typeof column.render === 'function') {
            return column.render(value, row);
        }
        
        // 默认格式化
        if (value === null || value === undefined) {
            return '-';
        }
        
        return String(value);
    }
    
    /**
     * 获取嵌套对象的值
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }
    
    /**
     * 排序
     */
    sort(columnKey) {
        if (this.sortState.column === columnKey) {
            // 切换排序方向
            if (this.sortState.direction === 'asc') {
                this.sortState.direction = 'desc';
            } else if (this.sortState.direction === 'desc') {
                this.sortState.direction = null;
                this.sortState.column = null;
            } else {
                this.sortState.direction = 'asc';
            }
        } else {
            // 新列排序
            this.sortState.column = columnKey;
            this.sortState.direction = 'asc';
        }
        
        this.applySorting();
        this.updateData();
        
        // 更新表头图标
        this.updateSortIcons();
        
        // 触发排序回调
        if (this.onSort) {
            this.onSort(this.sortState);
        }
    }
    
    /**
     * 应用排序
     */
    applySorting() {
        if (!this.sortState.column || !this.sortState.direction) {
            this.filteredData = [...this.originalData];
            return;
        }
        
        this.filteredData.sort((a, b) => {
            const aValue = this.getNestedValue(a, this.sortState.column);
            const bValue = this.getNestedValue(b, this.sortState.column);
            
            let result = 0;
            
            if (aValue === null || aValue === undefined) {
                result = 1;
            } else if (bValue === null || bValue === undefined) {
                result = -1;
            } else if (typeof aValue === 'string' && typeof bValue === 'string') {
                result = aValue.localeCompare(bValue);
            } else {
                result = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            }
            
            return this.sortState.direction === 'desc' ? -result : result;
        });
    }
    
    /**
     * 获取排序图标
     */
    getSortIcon(columnKey) {
        if (this.sortState.column !== columnKey) {
            return 'fa-sort';
        }
        
        switch (this.sortState.direction) {
            case 'asc':
                return 'fa-sort-up';
            case 'desc':
                return 'fa-sort-down';
            default:
                return 'fa-sort';
        }
    }
    
    /**
     * 更新排序图标
     */
    updateSortIcons() {
        const table = document.getElementById(`${this.containerId}-table`);
        const headers = table.querySelectorAll('th i[class*="fa-sort"]');
        
        headers.forEach((icon, index) => {
            const column = this.columns[index];
            if (column) {
                icon.className = `fas ${this.getSortIcon(column.key)} text-gray-400 ml-2`;
                
                if (this.sortState.column === column.key && this.sortState.direction) {
                    icon.classList.remove('text-gray-400');
                    icon.classList.add('text-blue-600');
                }
            }
        });
    }
    
    /**
     * 应用筛选
     */
    applyFilter() {
        const filterInputs = this.container.querySelectorAll('[data-filter-field]');
        const filters = {};
        
        filterInputs.forEach(input => {
            const field = input.dataset.filterField;
            const type = input.dataset.filterType;
            const value = input.value.trim();
            
            if (value) {
                filters[field] = { value, type };
            }
        });
        
        this.filteredData = this.originalData.filter(row => {
            return Object.keys(filters).every(field => {
                const filter = filters[field];
                const rowValue = this.getNestedValue(row, field);
                
                if (rowValue === null || rowValue === undefined) {
                    return false;
                }
                
                switch (filter.type) {
                    case 'text':
                        return String(rowValue).toLowerCase().includes(filter.value.toLowerCase());
                    case 'select':
                        return String(rowValue) === filter.value;
                    case 'date':
                        return String(rowValue).startsWith(filter.value);
                    default:
                        return true;
                }
            });
        });
        
        // 重置到第一页
        this.pagination.currentPage = 1;
        
        // 触发筛选回调
        if (this.onFilter) {
            this.onFilter(filters);
        }
        
        this.updateData();
    }
    
    /**
     * 重置筛选
     */
    resetFilter() {
        const filterInputs = this.container.querySelectorAll('[data-filter-field]');
        filterInputs.forEach(input => {
            input.value = '';
        });
        
        this.filteredData = [...this.originalData];
        this.pagination.currentPage = 1;
        this.updateData();
    }
    
    /**
     * 应用分页
     */
    applyPagination() {
        if (!this.pagination.enabled) {
            this.currentData = [...this.filteredData];
            return;
        }
        
        const startIndex = (this.pagination.currentPage - 1) * this.pagination.pageSize;
        const endIndex = startIndex + this.pagination.pageSize;
        this.currentData = this.filteredData.slice(startIndex, endIndex);
    }
    
    /**
     * 更新分页器
     */
    updatePagination() {
        if (!this.pagination.enabled) return;
        
        const paginationContainer = document.getElementById(`${this.containerId}-pagination`);
        if (!paginationContainer) return;
        
        const totalPages = Math.ceil(this.filteredData.length / this.pagination.pageSize);
        const currentPage = this.pagination.currentPage;
        
        let paginationHtml = '';
        
        // 上一页按钮
        paginationHtml += `
            <button class="pagination-item ${currentPage === 1 ? 'disabled' : ''}" 
                    onclick="${this.containerId}Instance.goToPage(${currentPage - 1})"
                    ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // 页码按钮
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += `
                <button class="pagination-item ${i === currentPage ? 'active' : ''}" 
                        onclick="${this.containerId}Instance.goToPage(${i})">
                    ${i}
                </button>
            `;
        }
        
        // 下一页按钮
        paginationHtml += `
            <button class="pagination-item ${currentPage === totalPages ? 'disabled' : ''}" 
                    onclick="${this.containerId}Instance.goToPage(${currentPage + 1})"
                    ${currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        paginationContainer.innerHTML = paginationHtml;
    }
    
    /**
     * 更新信息显示
     */
    updateInfo() {
        if (!this.pagination.showInfo) return;
        
        const infoElement = document.getElementById(`${this.containerId}-info`);
        if (!infoElement) return;
        
        const startIndex = (this.pagination.currentPage - 1) * this.pagination.pageSize + 1;
        const endIndex = Math.min(startIndex + this.pagination.pageSize - 1, this.filteredData.length);
        const total = this.filteredData.length;
        
        infoElement.textContent = `显示 ${startIndex}-${endIndex} 条，共 ${total} 条记录`;
    }
    
    /**
     * 跳转到指定页面
     */
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredData.length / this.pagination.pageSize);
        
        if (page < 1 || page > totalPages) {
            return;
        }
        
        this.pagination.currentPage = page;
        this.updateData();
    }
    
    /**
     * 改变页面大小
     */
    changePageSize(pageSize) {
        this.pagination.pageSize = parseInt(pageSize);
        this.pagination.currentPage = 1;
        this.updateData();
    }
    
    /**
     * 处理行点击事件
     */
    handleRowClick(index) {
        if (this.onRowClick) {
            const rowData = this.currentData[index];
            this.onRowClick(rowData, index);
        }
    }
    
    /**
     * 设置数据
     */
    setData(data) {
        this.originalData = data || [];
        this.filteredData = [...this.originalData];
        this.pagination.currentPage = 1;
        this.updateData();
    }
    
    /**
     * 获取当前数据
     */
    getData() {
        return this.originalData;
    }
    
    /**
     * 获取筛选后的数据
     */
    getFilteredData() {
        return this.filteredData;
    }
    
    /**
     * 刷新表格
     */
    refresh() {
        this.updateData();
    }
    
    /**
     * 销毁表格
     */
    destroy() {
        if (window[`${this.containerId}Instance`]) {
            delete window[`${this.containerId}Instance`];
        }
        
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// 导出组件
window.DataTable = DataTable;
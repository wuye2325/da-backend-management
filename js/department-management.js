/**
 * 部门管理功能模块
 * 负责部门的增删改查和人员分配
 */
class DepartmentManagement {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalRecords = 0;
        this.departments = [];
        this.filteredDepartments = [];
        this.currentEditId = null;
        this.currentDeleteId = null;
        this.currentAssignmentId = null;
        
        this.init();
    }

    /**
     * 加载部门列表
     */
    loadDepartments() {
        this.applyFilters();
        this.renderTable();
        this.renderPagination();
        this.loadManagerOptions();
    }

    /**
     * 应用筛选条件
     */
    applyFilters() {
        const searchTerm = this.currentSearchTerm ? this.currentSearchTerm.toLowerCase() : '';
        const statusFilter = document.getElementById('statusFilter').value;
        const startDateFilter = document.getElementById('startDateFilter') ? document.getElementById('startDateFilter').value : '';
        const endDateFilter = document.getElementById('endDateFilter') ? document.getElementById('endDateFilter').value : '';
        const departmentNameFilter = document.getElementById('departmentNameFilter') ? document.getElementById('departmentNameFilter').value.toLowerCase() : '';
        const managerFilter = document.getElementById('managerFilter') ? document.getElementById('managerFilter').value.toLowerCase() : '';
        const phoneFilter = document.getElementById('phoneFilter') ? document.getElementById('phoneFilter').value.toLowerCase() : '';
        const remarksFilter = document.getElementById('remarksFilter') ? document.getElementById('remarksFilter').value.toLowerCase() : '';

        this.filteredDepartments = this.departments.filter(dept => {
            // 搜索匹配
            const searchMatch = !searchTerm || 
                dept.name.toLowerCase().includes(searchTerm) ||
                (dept.manager && dept.manager.toLowerCase().includes(searchTerm));
            
            // 状态筛选
            const statusMatch = !statusFilter || dept.status === statusFilter;
            
            // 创建时间范围筛选
            let dateMatch = true;
            if (startDateFilter || endDateFilter) {
                const deptDate = dept.createTime.split(' ')[0]; // 提取日期部分 (YYYY-MM-DD)
                if (startDateFilter && endDateFilter) {
                    dateMatch = deptDate >= startDateFilter && deptDate <= endDateFilter;
                } else if (startDateFilter) {
                    dateMatch = deptDate >= startDateFilter;
                } else if (endDateFilter) {
                    dateMatch = deptDate <= endDateFilter;
                }
            }
            
            // 部门名称筛选
            const nameMatch = !departmentNameFilter || dept.name.toLowerCase().includes(departmentNameFilter);
            
            // 部门长筛选
            const managerMatch = !managerFilter || (dept.manager && dept.manager.toLowerCase().includes(managerFilter));
            
            // 联系电话筛选
            const phoneMatch = !phoneFilter || (dept.phone && dept.phone.toLowerCase().includes(phoneFilter));
            
            // 备注筛选
            const remarksMatch = !remarksFilter || (dept.remark && dept.remark.toLowerCase().includes(remarksFilter));
            
            return searchMatch && statusMatch && dateMatch && nameMatch && managerMatch && phoneMatch && remarksMatch;
        });

        this.totalRecords = this.filteredDepartments.length;
    }

    /**
     * 渲染表格
     */
    renderTable() {
        const tbody = document.getElementById('departmentTableBody');
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const pageData = this.filteredDepartments.slice(startIndex, endIndex);

        if (pageData.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                        <i class="fas fa-inbox text-4xl mb-4 block"></i>
                        <p>暂无部门数据</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = pageData.map(dept => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${dept.name}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${dept.manager}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${dept.phone}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${this.formatDateTime(dept.createTime)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${dept.remark || '-'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div id="toggle-${dept.id}"></div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                        <button onclick="departmentManager.editDepartment(${dept.id})" 
                                class="text-blue-600 hover:text-blue-900 transition-colors">
                            编辑
                        </button>
                        <button onclick="departmentManager.showAssignmentModal(${dept.id})" 
                                class="text-blue-600 hover:text-blue-900 transition-colors">
                            分配
                        </button>
                        <button onclick="departmentManager.deleteDepartment(${dept.id})" 
                                class="text-red-600 hover:text-red-900 transition-colors">
                            删除
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // 更新记录信息
        const startRecordEl = document.getElementById('startRecord');
        const endRecordEl = document.getElementById('endRecord');
        const totalRecordsEl = document.getElementById('totalRecords');
        
        if (startRecordEl) startRecordEl.textContent = startIndex + 1;
        if (endRecordEl) endRecordEl.textContent = Math.min(endIndex, this.totalRecords);
        if (totalRecordsEl) totalRecordsEl.textContent = this.totalRecords;
        
        // 为每个部门创建状态切换开关
        pageData.forEach(dept => {
            new ToggleSwitch({
                containerId: `toggle-${dept.id}`,
                id: `toggle-switch-${dept.id}`,
                checked: dept.status === 'enabled',
                size: 'sm',
                onChange: (checked) => {
                    this.toggleStatus(dept.id);
                }
            });
        });
    }

    /**
     * 更新分页状态（静态分页按钮）
     */
    renderPagination() {
        const totalPages = Math.ceil(this.totalRecords / this.pageSize);
        
        // 更新页码按钮状态
        const pageButtons = document.querySelectorAll('.page-btn');
        pageButtons.forEach((btn, index) => {
            const pageNum = index + 1;
            if (pageNum === this.currentPage) {
                btn.classList.remove('text-gray-700', 'border-gray-300', 'bg-white');
                btn.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
            } else {
                btn.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
                btn.classList.add('text-gray-700', 'border-gray-300', 'bg-white');
            }
            
            // 隐藏超出总页数的按钮
            if (pageNum > totalPages) {
                btn.style.display = 'none';
            } else {
                btn.style.display = 'inline-flex';
            }
        });
        
        // 更新上一页按钮状态
        const prevBtn = document.querySelector('.prev-btn');
        if (prevBtn) {
            if (this.currentPage === 1) {
                prevBtn.disabled = true;
                prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                prevBtn.disabled = false;
                prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
        
        // 更新下一页按钮状态
        const nextBtn = document.querySelector('.next-btn');
        if (nextBtn) {
            if (this.currentPage >= totalPages) {
                nextBtn.disabled = true;
                nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                nextBtn.disabled = false;
                nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    }

    /**
     * 跳转到指定页面
     */
    goToPage(page) {
        const totalPages = Math.ceil(this.totalRecords / this.pageSize);
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderTable();
        this.renderPagination();
    }



    /**
     * 重置筛选
     */
    resetFilters() {
        // 重置所有筛选条件
        document.getElementById('statusFilter').value = '';
        const startDateFilter = document.getElementById('startDateFilter');
        const endDateFilter = document.getElementById('endDateFilter');
        const departmentNameFilter = document.getElementById('departmentNameFilter');
        const managerFilter = document.getElementById('managerFilter');
        const phoneFilter = document.getElementById('phoneFilter');
        const remarksFilter = document.getElementById('remarksFilter');
        
        if (startDateFilter) startDateFilter.value = '';
        if (endDateFilter) endDateFilter.value = '';
        if (departmentNameFilter) departmentNameFilter.value = '';
        if (managerFilter) managerFilter.value = '';
        if (phoneFilter) phoneFilter.value = '';
        if (remarksFilter) remarksFilter.value = '';
        
        this.currentSearchTerm = '';
        this.currentPage = 1;
        this.loadDepartments();
    }

    /**
     * 加载部门长选项
     */
    loadManagerOptions() {
        const select = document.getElementById('departmentManager');
        select.innerHTML = '<option value="">请选择部门长</option>';
        
        this.availableManagers.forEach(manager => {
            select.innerHTML += `<option value="${manager.name}">${manager.name}</option>`;
        });
    }

    /**
     * 显示新增模态框
     */
    showAddModal() {
        this.currentEditId = null;
        document.getElementById('modalTitle').textContent = '新增部门';
        document.getElementById('departmentForm').reset();
        this.clearErrors();
        this.showModal();
    }

    /**
     * 编辑部门
     */
    editDepartment(id) {
        const dept = this.departments.find(d => d.id === id);
        if (!dept) return;

        this.currentEditId = id;
        document.getElementById('modalTitle').textContent = '编辑部门';
        document.getElementById('departmentName').value = dept.name;
        document.getElementById('departmentManager').value = dept.manager || '';
        document.getElementById('departmentPhone').value = dept.phone || '';
        document.getElementById('departmentRemark').value = dept.remark || '';
        this.clearErrors();
        this.showModal();
    }

    /**
     * 保存部门
     */
    saveDepartment() {
        const name = document.getElementById('departmentName').value.trim();
        const manager = document.getElementById('departmentManager').value;
        const phone = document.getElementById('departmentPhone').value.trim();
        const remark = document.getElementById('departmentRemark').value.trim();

        // 验证
        if (!this.validateForm(name, phone)) {
            return;
        }

        const now = new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).replace(/\//g, '-');

        if (this.currentEditId) {
            // 编辑
            const dept = this.departments.find(d => d.id === this.currentEditId);
            if (dept) {
                dept.name = name;
                dept.manager = manager;
                dept.phone = phone;
                dept.remark = remark;
                dept.updateTime = now;
            }
        } else {
            // 新增
            const newId = Math.max(...this.departments.map(d => d.id)) + 1;
            this.departments.push({
                id: newId,
                name: name,
                manager: manager,
                phone: phone,
                status: 'enabled',
                remark: remark,
                createTime: now,
                updateTime: now
            });
        }

        this.hideModal();
        this.loadDepartments();
        
        // 显示成功消息
        this.showMessage(this.currentEditId ? '部门更新成功！' : '部门创建成功！', 'success');
    }

    /**
     * 表单验证
     */
    validateForm(name, phone) {
        let isValid = true;
        this.clearErrors();

        // 验证部门名称
        if (!name) {
            this.showError('nameError', '请输入部门名称');
            isValid = false;
        } else {
            // 检查名称是否重复
            const existingDept = this.departments.find(d => 
                d.name === name && d.id !== this.currentEditId
            );
            if (existingDept) {
                this.showError('nameError', '部门名称已存在');
                isValid = false;
            }
        }

        // 验证电话号码
        if (phone && !/^1[3-9]\d{9}$/.test(phone.replace(/-/g, ''))) {
            this.showError('phoneError', '请输入正确的手机号码');
            isValid = false;
        }

        return isValid;
    }

    /**
     * 显示错误信息
     */
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }

    /**
     * 清除错误信息
     */
    clearErrors() {
        ['nameError', 'phoneError'].forEach(id => {
            const element = document.getElementById(id);
            element.textContent = '';
            element.classList.add('hidden');
        });
    }

    /**
     * 切换部门状态
     */
    toggleStatus(id) {
        const dept = this.departments.find(d => d.id === id);
        if (!dept) return;

        dept.status = dept.status === 'enabled' ? 'disabled' : 'enabled';
        dept.updateTime = new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).replace(/\//g, '-');

        this.loadDepartments();
        this.showMessage(`部门已${dept.status === 'enabled' ? '启用' : '停用'}！`, 'success');
    }

    /**
     * 删除部门
     */
    deleteDepartment(id) {
        this.currentDeleteId = id;
        this.showDeleteModal();
    }

    /**
     * 确认删除
     */
    confirmDelete() {
        if (!this.currentDeleteId) return;

        const index = this.departments.findIndex(d => d.id === this.currentDeleteId);
        if (index > -1) {
            this.departments.splice(index, 1);
            this.hideDeleteModal();
            this.loadDepartments();
            this.showMessage('部门删除成功！', 'success');
        }
    }

    /**
     * 显示人员分配模态框
     */
    showAssignmentModal(id) {
        this.currentAssignmentId = id;
        const dept = this.departments.find(d => d.id === id);
        if (!dept) return;

        // 模拟可分配用户数据
        this.availableUsersList = [
            { id: 1, name: '张三', position: '开发工程师', phone: '13800138001' },
            { id: 2, name: '李四', position: '产品经理', phone: '13800138002' },
            { id: 3, name: '王五', position: '设计师', phone: '13800138003' },
            { id: 4, name: '赵六', position: '测试工程师', phone: '13800138004' },
            { id: 5, name: '钱七', position: '运营专员', phone: '13800138005' },
            { id: 6, name: '孙八', position: '市场专员', phone: '13800138006' },
            { id: 7, name: '周九', position: '人事专员', phone: '13800138007' },
            { id: 8, name: '吴十', position: '财务专员', phone: '13800138008' }
        ];

        // 渲染可分配用户列表
        this.renderAvailableUsers(this.availableUsersList);

        // 渲染已分配用户列表
        document.getElementById('assignedUsers').innerHTML = `
            <div class="space-y-2">
                <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div>
                        <div class="text-sm font-medium">${dept.manager || '暂无'}</div>
                        <div class="text-xs text-gray-500">${dept.phone || '暂无联系方式'}</div>
                    </div>
                    <button class="text-red-600 hover:text-red-800 text-sm">移除</button>
                </div>
            </div>
        `;

        // 绑定搜索事件
        this.bindUserSearchEvent();

        this.showAssignmentModalDialog();
    }

    /**
     * 渲染可分配用户列表
     */
    renderAvailableUsers(users) {
        const container = document.getElementById('availableUsers');
        if (users.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-500 py-4">
                    <i class="fas fa-search text-2xl mb-2 block"></i>
                    <p class="text-sm">未找到匹配的人员</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="space-y-2">
                ${users.map(user => `
                    <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <div>
                            <div class="text-sm font-medium">${user.name}</div>
                            <div class="text-xs text-gray-500">${user.phone || user.contact || '暂无联系方式'}</div>
                        </div>
                        <button onclick="departmentManager.assignUser(${user.id})" 
                                class="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded hover:bg-blue-50">
                            分配
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * 绑定用户搜索事件
     */
    bindUserSearchEvent() {
        const searchInput = document.getElementById('userSearchInput');
        if (searchInput) {
            // 清空之前的值
            searchInput.value = '';
            
            // 移除之前的事件监听器
            searchInput.removeEventListener('input', this.handleUserSearch);
            
            // 绑定新的事件监听器
            this.handleUserSearch = (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                const filteredUsers = this.availableUsersList.filter(user => 
                    user.name.toLowerCase().includes(searchTerm) || 
                    user.position.toLowerCase().includes(searchTerm)
                );
                this.renderAvailableUsers(filteredUsers);
            };
            
            searchInput.addEventListener('input', this.handleUserSearch);
        }
        
        // 绑定搜索按钮事件
        const searchBtn = document.getElementById('searchUserBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const searchValue = document.getElementById('userSearchInput').value;
                this.filterAvailableUsers(searchValue);
            });
        }
        
        // 绑定重置按钮事件
        const resetBtn = document.getElementById('resetUserSearchBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                document.getElementById('userSearchInput').value = '';
                this.filterAvailableUsers('');
            });
        }
    }

    /**
     * 分配用户到部门
     */
    assignUser(userId) {
        const user = this.availableUsersList.find(u => u.id === userId);
        if (user) {
            this.showMessage(`已将 ${user.name} 分配到部门`, 'success');
            // 这里可以添加实际的分配逻辑
        }
    }

    /**
     * 保存人员分配
     */
    saveAssignment() {
        // 这里应该保存人员分配数据
        this.hideAssignmentModal();
        this.showMessage('人员分配保存成功！', 'success');
    }

    /**
     * 显示模态框
     */
    showModal() {
        const modal = document.getElementById('departmentModal');
        modal.classList.add('show');
    }

    /**
     * 隐藏模态框
     */
    hideModal() {
        const modal = document.getElementById('departmentModal');
        modal.classList.remove('show');
    }

    /**
     * 显示删除确认模态框
     */
    showDeleteModal() {
        const modal = document.getElementById('deleteModal');
        modal.classList.add('show');
    }

    /**
     * 隐藏删除确认模态框
     */
    hideDeleteModal() {
        const modal = document.getElementById('deleteModal');
        modal.classList.remove('show');
    }

    /**
     * 显示人员分配模态框
     */
    showAssignmentModalDialog() {
        const modal = document.getElementById('assignmentModal');
        modal.classList.add('show');
    }

    /**
     * 隐藏人员分配模态框
     */
    hideAssignmentModal() {
        const modal = document.getElementById('assignmentModal');
        modal.classList.remove('show');
    }

    /**
     * 显示消息提示
     */
    showMessage(message, type = 'info') {
        // 创建消息元素
        const messageDiv = document.createElement('div');
        messageDiv.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }

    /**
     * 格式化日期时间
     */
    formatDateTime(dateTimeStr) {
        if (!dateTimeStr) return '-';
        return dateTimeStr.replace(/T/, ' ').substring(0, 19);
    }

    /**
     * 初始化功能
     */
    init() {
        this.initData();
        this.bindEvents();
        this.loadDepartments();
    }

    /**
     * 初始化模拟数据
     */
    initData() {
        // 与小区管理相关的部门数据
        this.departments = [
            {
                id: 1,
                name: '物业管理部',
                manager: '张建国',
                phone: '13800010001',
                status: 'enabled',
                remark: '负责小区物业服务、设施维护、安全管理等工作',
                createTime: '2024-01-15 09:00:00',
                updateTime: '2024-01-15 09:00:00'
            },
            {
                id: 2,
                name: '社区服务部',
                manager: '李美华',
                phone: '13800020002',
                status: 'enabled',
                remark: '负责社区活动组织、居民服务、文化建设等工作',
                createTime: '2024-01-16 10:30:00',
                updateTime: '2024-01-16 10:30:00'
            },
            {
                id: 3,
                name: '运营管理部',
                manager: '王志强',
                phone: '13800030003',
                status: 'enabled',
                remark: '负责小区运营策略制定、业务流程优化、数据分析等工作',
                createTime: '2024-01-17 14:20:00',
                updateTime: '2024-01-17 14:20:00'
            },
            {
                id: 4,
                name: '市场推广部',
                manager: '陈晓丽',
                phone: '13800040004',
                status: 'enabled',
                remark: '负责小区品牌推广、招商引资、对外合作等工作',
                createTime: '2024-01-18 11:15:00',
                updateTime: '2024-01-18 11:15:00'
            },
            {
                id: 5,
                name: '技术运维部',
                manager: '刘德华',
                phone: '13800050005',
                status: 'enabled',
                remark: '负责智能化设备维护、系统运维、技术支持等工作',
                createTime: '2024-01-19 16:45:00',
                updateTime: '2024-01-19 16:45:00'
            },
            {
                id: 6,
                name: '财务管理部',
                manager: '赵敏',
                phone: '13800060006',
                status: 'enabled',
                remark: '负责小区财务管理、费用收缴、预算控制等工作',
                createTime: '2024-01-20 08:30:00',
                updateTime: '2024-01-20 08:30:00'
            },
            {
                id: 7,
                name: '客户服务部',
                manager: '孙丽娟',
                phone: '13800070007',
                status: 'enabled',
                remark: '负责业主投诉处理、客户关系维护、满意度调查等工作',
                createTime: '2024-01-21 13:20:00',
                updateTime: '2024-01-21 13:20:00'
            },
            {
                id: 8,
                name: '安全保卫部',
                manager: '马强',
                phone: '13800080008',
                status: 'enabled',
                remark: '负责小区安全防范、门禁管理、应急处置等工作',
                createTime: '2024-01-22 09:45:00',
                updateTime: '2024-01-22 09:45:00'
            },
            {
                id: 9,
                name: '环境绿化部',
                manager: '周芳',
                phone: '13800090009',
                status: 'disabled',
                remark: '负责小区绿化养护、环境卫生、垃圾处理等工作',
                createTime: '2024-01-23 15:10:00',
                updateTime: '2024-01-23 15:10:00'
            },
            {
                id: 10,
                name: '工程维修部',
                manager: '吴建军',
                phone: '138-0010-0010',
                status: 'enabled',
                remark: '负责小区设施维修、工程改造、设备更新等工作',
                createTime: '2024-01-24 10:25:00',
                updateTime: '2024-01-24 10:25:00'
            }
        ];

        // 可选择的部门长列表
        this.availableManagers = [
            { id: 1, name: '张建国', phone: '13800010001' },
            { id: 2, name: '李美华', phone: '13800020002' },
            { id: 3, name: '王志强', phone: '13800030003' },
            { id: 4, name: '陈晓丽', phone: '13800040004' },
            { id: 5, name: '刘德华', phone: '13800050005' },
            { id: 6, name: '赵敏', phone: '13800060006' },
            { id: 7, name: '孙丽娟', phone: '13800070007' },
            { id: 8, name: '马强', phone: '13800080008' },
            { id: 9, name: '周芳', phone: '13800090009' },
            { id: 10, name: '吴建军', phone: '138-0010-0010' },
            { id: 11, name: '黄志明', phone: '138-0011-0011' },
            { id: 12, name: '林小红', phone: '138-0012-0012' }
        ];
    }



    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 筛选相关事件
        document.getElementById('statusFilter').addEventListener('change', () => {
            this.currentPage = 1;
            this.loadDepartments();
        });
        
        // 搜索按钮事件
        const applyFiltersBtn = document.getElementById('applyFiltersBtn');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                this.currentPage = 1;
                this.loadDepartments();
            });
        }
        
        // 重置按钮事件
        const resetFiltersBtn = document.getElementById('resetFiltersBtn');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }
        
        // 输入框回车事件
        const filterInputs = ['departmentNameFilter', 'managerFilter', 'phoneFilter', 'remarksFilter'];
        filterInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.currentPage = 1;
                        this.loadDepartments();
                    }
                });
            }
        });
        
        // 日期筛选变化事件
        const startDateFilter = document.getElementById('startDateFilter');
        const endDateFilter = document.getElementById('endDateFilter');
        if (startDateFilter) {
            startDateFilter.addEventListener('change', () => {
                this.currentPage = 1;
                this.loadDepartments();
            });
        }
        if (endDateFilter) {
            endDateFilter.addEventListener('change', () => {
                this.currentPage = 1;
                this.loadDepartments();
            });
        }
        
        // 新增部门按钮
        document.getElementById('addDepartmentBtn').addEventListener('click', () => this.showAddModal());
        
        // 模态框按钮
        document.getElementById('cancelBtn').addEventListener('click', () => this.hideModal());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveDepartment());
        
        // 删除确认模态框
        document.getElementById('cancelDeleteBtn').addEventListener('click', () => this.hideDeleteModal());
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => this.confirmDelete());
        
        // 人员分配模态框
        document.getElementById('cancelAssignmentBtn').addEventListener('click', () => this.hideAssignmentModal());
        document.getElementById('saveAssignmentBtn').addEventListener('click', () => this.saveAssignment());
        
        // 分页大小改变
        document.getElementById('pageSize').addEventListener('change', (e) => {
            this.pageSize = parseInt(e.target.value);
            this.currentPage = 1;
            this.loadDepartments();
        });
        
        // 静态分页按钮事件绑定
        this.bindPaginationEvents();
    }
    
    /**
     * 绑定静态分页按钮事件
     */
    bindPaginationEvents() {
        // 上一页按钮
        const prevBtn = document.querySelector('.prev-btn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.goToPage(this.currentPage - 1);
                }
            });
        }
        
        // 下一页按钮
        const nextBtn = document.querySelector('.next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.totalRecords / this.pageSize);
                if (this.currentPage < totalPages) {
                    this.goToPage(this.currentPage + 1);
                }
            });
        }
        
        // 页码按钮
        const pageButtons = document.querySelectorAll('.page-btn');
        pageButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const pageNum = index + 1;
                this.goToPage(pageNum);
            });
        });
    }
}
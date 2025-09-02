/**
 * 用户管理页面数据配置文件
 * 集中管理用户角色、部门、状态等选项数据
 * 作者：AI助手
 * 创建时间：2024
 */

/**
 * 用户管理数据配置类
 */
class UserManagementData {
    constructor() {
        this.init();
    }

    /**
     * 初始化数据配置
     */
    init() {
        // 用户角色配置
        this.userRoles = [
            { value: '', label: '全部角色', disabled: false },
            { value: '小区管理员', label: '小区管理员', disabled: false }
        ];

        // 所属小区配置
        this.communities = [
            { value: '', label: '全部小区', disabled: false },
            { value: '阳光花园', label: '阳光花园', disabled: false },
            { value: '绿城小区', label: '绿城小区', disabled: false },
            { value: '金桂园', label: '金桂园', disabled: false },
            { value: '梧桐苑', label: '梧桐苑', disabled: false },
            { value: '翠湖湾', label: '翠湖湾', disabled: false },
            { value: '紫荆花园', label: '紫荆花园', disabled: false },
            { value: '碧水蓝天', label: '碧水蓝天', disabled: false },
            { value: '春江花月', label: '春江花月', disabled: false }
        ];

        // 状态配置
        this.accountStatus = [
            { value: '', label: '全部状态', disabled: false },
            { value: 'active', label: '启用', disabled: false, color: 'green' },
            { value: 'inactive', label: '停用', disabled: false, color: 'red' },
        ];

        // 部门配置
        this.departments = [
            { value: '', label: '请选择部门', disabled: true },
            { value: '业委会', label: '业委会', disabled: false },
            { value: '物业管理部', label: '物业管理部', disabled: false },
            { value: '保安部', label: '保安部', disabled: false },
            { value: '工程部', label: '工程部', disabled: false },
            { value: '客服部', label: '客服部', disabled: false },
            { value: '财务部', label: '财务部', disabled: false },
            { value: '清洁部', label: '清洁部', disabled: false },
            { value: '绿化部', label: '绿化部', disabled: false },
            { value: '其他', label: '其他', disabled: false }
        ];

        // 房屋绑定状态配置
        this.houseBindingStatus = [
            { value: '', label: '请选择状态', disabled: true },
            { value: '已绑定', label: '已绑定', disabled: false, color: 'green' },
            { value: '未绑定', label: '未绑定', disabled: false, color: 'red' },
            { value: '待审核', label: '待审核', disabled: false, color: 'yellow' }
        ];

        // 是否部门长配置
        this.isDepartmentHead = [
            { value: 'false', label: '否', disabled: false, default: true },
            { value: 'true', label: '是', disabled: false, default: false }
        ];

        // 重置密码方式配置
        this.resetPasswordMethods = [
            { value: 'random', label: '系统生成随机密码', disabled: false, default: true },
            { value: 'custom', label: '管理员设定密码', disabled: false, default: false },
            { value: 'email', label: '发送重置链接到邮箱', disabled: false, default: false },
            { value: 'sms', label: '发送重置链接到手机', disabled: false, default: false }
        ];

        // 表格列配置
        this.tableColumns = [
            { key: 'checkbox', label: '', width: '50px', sortable: false },
            { key: 'avatar', label: '头像', width: '80px', sortable: false },
            { key: 'name', label: '姓名', width: '120px', sortable: true },
            { key: 'phone', label: '手机号', width: '130px', sortable: false },
            { key: 'idCard', label: '身份证号', width: '180px', sortable: false },
            { key: 'houseBinding', label: '房屋绑定', width: '100px', sortable: true },
            { key: 'role', label: '用户角色', width: '120px', sortable: true },
            { key: 'status', label: '账号状态', width: '100px', sortable: true },
            { key: 'createTime', label: '创建时间', width: '150px', sortable: true },
            { key: 'updateTime', label: '更新时间', width: '150px', sortable: true },
            { key: 'lastOperator', label: '最后操作人', width: '120px', sortable: false },
            { key: 'lastLogin', label: '最后登录', width: '150px', sortable: true },
            { key: 'actions', label: '操作', width: '200px', sortable: false }
        ];

        // 批量操作配置
        this.batchActions = [
            { key: 'delete', label: '批量删除', icon: 'fas fa-trash', color: 'red', confirm: true },
            { key: 'enable', label: '批量启用', icon: 'fas fa-check', color: 'green', confirm: false },
            { key: 'disable', label: '批量停用', icon: 'fas fa-ban', color: 'yellow', confirm: true },
            { key: 'resetPassword', label: '批量重置密码', icon: 'fas fa-key', color: 'blue', confirm: true },
            { key: 'export', label: '导出选中', icon: 'fas fa-download', color: 'gray', confirm: false }
        ];

        // 操作按钮配置
        this.actionButtons = [
            { key: 'add', label: '新增用户', icon: 'fas fa-plus', type: 'primary' },
            { key: 'import', label: '批量导入', icon: 'fas fa-upload', type: 'secondary' },
            { key: 'download', label: '下载模板', icon: 'fas fa-download', type: 'secondary' },
            { key: 'export', label: '数据导出', icon: 'fas fa-file-export', type: 'secondary' }
        ];

        // 表单验证规则
        this.validationRules = {
            name: {
                required: true,
                minLength: 2,
                maxLength: 20,
                pattern: /^[\u4e00-\u9fa5a-zA-Z\s]+$/,
                message: '姓名为2-20位中文或英文字符'
            },
            phone: {
                required: true,
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入正确的手机号码'
            },
            idCard: {
                required: false,
                pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                message: '请输入正确的身份证号码'
            },
            email: {
                required: false,
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: '请输入正确的邮箱地址'
            },
            department: {
                required: true,
                message: '请选择所属部门'
            },
            role: {
                required: true,
                message: '请选择用户角色'
            }
        };
    }

    /**
     * 获取用户角色选项（用于筛选）
     * @returns {Array} 角色选项数组
     */
    getUserRolesForFilter() {
        return this.userRoles;
    }

    /**
     * 获取用户角色选项（用于表单）
     * @returns {Array} 角色选项数组（排除"全部角色"选项）
     */
    getUserRolesForForm() {
        return this.userRoles.filter(role => role.value !== '');
    }

    /**
     * 获取所属小区选项（用于筛选）
     * @returns {Array} 所属小区选项数组
     */
    getCommunitiesForFilter() {
        return this.communities;
    }

    /**
     * 获取所属小区选项（用于表单）
     * @returns {Array} 所属小区选项数组（排除"全部小区"选项）
     */
    getCommunitiesForForm() {
        return this.communities.filter(community => community.value !== '');
    }

    /**
     * 获取账号状态选项（用于筛选）
     * @returns {Array} 状态选项数组
     */
    getAccountStatusForFilter() {
        return this.accountStatus;
    }

    /**
     * 获取账号状态选项（用于表单）
     * @returns {Array} 状态选项数组（排除"全部状态"选项）
     */
    getAccountStatusForForm() {
        return this.accountStatus.filter(status => status.value !== '');
    }

    /**
     * 获取部门选项
     * @returns {Array} 部门选项数组
     */
    getDepartments() {
        return this.departments;
    }

    /**
     * 获取房屋绑定状态选项
     * @returns {Array} 房屋绑定状态选项数组
     */
    getHouseBindingStatus() {
        return this.houseBindingStatus;
    }

    /**
     * 获取是否部门长选项
     * @returns {Array} 是否部门长选项数组
     */
    getIsDepartmentHead() {
        return this.isDepartmentHead;
    }

    /**
     * 获取重置密码方式选项
     * @returns {Array} 重置密码方式选项数组
     */
    getResetPasswordMethods() {
        return this.resetPasswordMethods;
    }

    /**
     * 获取表格列配置
     * @returns {Array} 表格列配置数组
     */
    getTableColumns() {
        return this.tableColumns;
    }

    /**
     * 获取批量操作配置
     * @returns {Array} 批量操作配置数组
     */
    getBatchActions() {
        return this.batchActions;
    }

    /**
     * 获取操作按钮配置
     * @returns {Array} 操作按钮配置数组
     */
    getActionButtons() {
        return this.actionButtons;
    }

    /**
     * 获取表单验证规则
     * @returns {Object} 验证规则对象
     */
    getValidationRules() {
        return this.validationRules;
    }

    /**
     * 根据值获取标签
     * @param {string} type 数据类型（userRoles, accountStatus, departments等）
     * @param {string} value 值
     * @returns {string} 对应的标签
     */
    getLabelByValue(type, value) {
        const dataMap = {
            userRoles: this.userRoles,
            accountStatus: this.accountStatus,
            departments: this.departments,
            houseBindingStatus: this.houseBindingStatus,
            isDepartmentHead: this.isDepartmentHead,
            resetPasswordMethods: this.resetPasswordMethods
        };

        const data = dataMap[type];
        if (!data) return value;

        const item = data.find(item => item.value === value);
        return item ? item.label : value;
    }

    /**
     * 根据状态获取颜色
     * @param {string} type 数据类型
     * @param {string} value 值
     * @returns {string} 对应的颜色
     */
    getColorByValue(type, value) {
        const dataMap = {
            accountStatus: this.accountStatus,
            houseBindingStatus: this.houseBindingStatus
        };

        const data = dataMap[type];
        if (!data) return 'gray';

        const item = data.find(item => item.value === value);
        return item && item.color ? item.color : 'gray';
    }

    /**
     * 验证表单字段
     * @param {string} field 字段名
     * @param {string} value 字段值
     * @returns {Object} 验证结果 {valid: boolean, message: string}
     */
    validateField(field, value) {
        const rule = this.validationRules[field];
        if (!rule) return { valid: true, message: '' };

        // 必填验证
        if (rule.required && (!value || value.trim() === '')) {
            return { valid: false, message: rule.message || `${field}为必填项` };
        }

        // 如果不是必填且值为空，则通过验证
        if (!rule.required && (!value || value.trim() === '')) {
            return { valid: true, message: '' };
        }

        // 长度验证
        if (rule.minLength && value.length < rule.minLength) {
            return { valid: false, message: rule.message || `${field}长度不能少于${rule.minLength}位` };
        }

        if (rule.maxLength && value.length > rule.maxLength) {
            return { valid: false, message: rule.message || `${field}长度不能超过${rule.maxLength}位` };
        }

        // 正则验证
        if (rule.pattern && !rule.pattern.test(value)) {
            return { valid: false, message: rule.message || `${field}格式不正确` };
        }

        return { valid: true, message: '' };
    }

    /**
     * 验证整个表单
     * @param {Object} formData 表单数据
     * @returns {Object} 验证结果 {valid: boolean, errors: Object}
     */
    validateForm(formData) {
        const errors = {};
        let valid = true;

        Object.keys(this.validationRules).forEach(field => {
            const result = this.validateField(field, formData[field]);
            if (!result.valid) {
                errors[field] = result.message;
                valid = false;
            }
        });

        return { valid, errors };
    }
}

// 创建全局实例
const userManagementData = new UserManagementData();

// 确保在浏览器环境中全局可用
if (typeof window !== 'undefined') {
    window.userManagementData = userManagementData;
    window.UserManagementData = UserManagementData;
}

// Node.js环境导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserManagementData;
}
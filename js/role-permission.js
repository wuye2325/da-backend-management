/**
 * 角色权限管理页面JavaScript文件
 * 实现角色管理、权限配置、用户分配等核心功能
 */

// 全局变量
let currentPage = 1;
let pageSize = 20;
let totalRecords = 0;
let currentRoleId = null;
let currentPlatform = 'pc';
let rolesData = [];
let permissionsData = {};
let usersData = [];
let roleSearchComponent = null;
let addRoleModal = null; // 新增角色弹窗组件实例

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initPage('role-permission');
    initSearchComponent();
    loadRolesData();
    loadPermissionsData();
    loadUsersData();
    updateStatistics();
    
    // 确保在所有数据加载完成后初始化新增角色弹窗组件
    setTimeout(() => {
        initAddRoleModal();
    }, 100);
});

/**
 * 初始化搜索组件
 */
function initSearchComponent() {
    roleSearchComponent = new SearchComponent({
        containerId: 'roleSearchContainer',
        placeholder: '请输入角色名称进行搜索',
        label: '搜索',
        onSearch: function(searchValue) {
            applyFilters();
        },
        onReset: function() {
            applyFilters();
        }
    });
    
    // 为状态下拉框添加事件监听器
    const statusFilter = document.getElementById('filterStatus');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // 为权限范围多选下拉框添加事件监听器
    const permissionFilter = document.getElementById('filterPermissionScope');
    if (permissionFilter) {
        permissionFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // 为名称搜索框添加事件监听器
    const nameSearch = document.getElementById('nameSearch');
    if (nameSearch) {
        nameSearch.addEventListener('input', function() {
            applyFilters();
        });
    }
    
    // 为描述搜索框添加事件监听器
    const descSearch = document.getElementById('descriptionSearch');
    if (descSearch) {
        descSearch.addEventListener('input', function() {
            applyFilters();
        });
    }
}

/**
 * 初始化新增角色弹窗组件
 */
function initAddRoleModal() {
    console.log('开始初始化AddRoleModal组件');
    console.log('permissionsData:', permissionsData);
    
    // 检查AddRoleModal类是否已加载
    if (typeof AddRoleModal === 'undefined') {
        console.error('AddRoleModal类未定义，请检查js/AddRoleModal.js文件是否正确加载');
        return;
    }
    
    try {
        addRoleModal = new AddRoleModal({
            container: document.body,
            permissionsData: permissionsData,
            onSave: function(roleData) {
                // 保存角色后刷新页面数据
                loadRolesData();
                updateStatistics();
                alert('角色创建成功！');
            },
            onCancel: function() {
                console.log('取消新增角色');
            }
        });
        console.log('AddRoleModal组件初始化成功:', addRoleModal);
    } catch (error) {
        console.error('AddRoleModal组件初始化失败:', error);
    }
}

/**
 * 加载角色数据
 */
function loadRolesData() {
    // 模拟角色数据
    rolesData = [
        {
            id: 1,
            name: '超级管理员',
            type: 'community_admin',
            description: '拥有小区所有管理权限，包含中台小程序权限及角色分配权限',
            status: 'enabled',
            createTime: '2024-01-15 10:30:00',
            updateTime: '2024-12-20 15:30:00',
            platforms: ['pc', 'mobile', '总后台'],
            userCount: 1,
            permissions: [
                'pc_community_list_view',
                'pc_community_list_add',
                'pc_resident_list_view',
                'pc_resident_list_add'
            ]
        },
        {
            id: 2,
            name: '业委会成员',
            type: 'committee_member',
            description: '参与小区决策和监督管理，由小区管理员授权',
            status: 'enabled',
            createTime: '2024-02-10 14:20:00',
            updateTime: '2024-12-18 16:45:00',
            platforms: ['pc', 'mobile'],
            userCount: 8,
            permissions: [
                'pc_community_list_view',
                'pc_vote_list_view',
                'miniapp_community_list_view',
                'miniapp_vote_list_view'
            ]
        },
        {
            id: 3,
            name: '业主',
            type: 'resident',
            description: '小区业主基础权限，由小区管理员授权',
            status: 'enabled',
            createTime: '2024-03-01 09:00:00',
            updateTime: '2024-12-19 11:30:00',
            platforms: ['mobile'],
            userCount: 186,
            permissions: [
                'miniapp_community_list_view',
                'miniapp_resident_list_view',
                'miniapp_service_list_view',
                'miniapp_service_list_add',
                'miniapp_vote_list_view'
            ]
        },
        {
            id: 4,
            name: '物业',
            type: 'property_staff',
            description: '处理物业服务和维修事务，由小区管理员授权',
            status: 'enabled',
            createTime: '2024-03-15 13:30:00',
            updateTime: '2024-12-17 15:20:00',
            platforms: ['pc', 'mobile'],
            userCount: 12,
            permissions: [
                'pc_property_list_view',
                'pc_repair_list_view',
                'miniapp_property_list_view',
                'miniapp_repair_list_view'
            ]
        },
        {
            id: 5,
            name: '楼栋长',
            type: 'building_leader',
            description: '负责楼栋内业主协调和信息传达，由小区管理员授权',
            status: 'enabled',
            createTime: '2024-04-01 10:15:00',
            updateTime: '2024-12-16 14:10:00',
            platforms: ['mobile'],
            userCount: 24,
            permissions: [
                'miniapp_building_list_view',
                'miniapp_building_list_add',
                'miniapp_resident_list_view',
                'miniapp_notice_list_view',
                'miniapp_notice_list_add'
            ]
        }
    ];
    
    totalRecords = rolesData.length;
    renderRoleTable();
    updatePagination();
}

/**
 * 加载权限数据
 */
function loadPermissionsData() {
    // 基于实际中台菜单层级的权限树数据结构
    permissionsData = {
        // 总后台权限配置 - 基于功能需求文档的完整菜单结构
        admin: [
            {
                id: 'auth_center',
                name: '授权中心',
                children: [
                    {
                        id: 'auth_center:community_manage',
                        name: '小区管理',
                        children: [
                            { id: 'auth_center:community_manage:view', name: '查看' },
                            { id: 'auth_center:community_manage:add', name: '新增小区' },
                            { id: 'auth_center:community_manage:edit', name: '编辑小区' },
                            { id: 'auth_center:community_manage:auth_renew', name: '授权续期' },
                            { id: 'auth_center:community_manage:view_renew_record', name: '查看续期记录' },
                            { id: 'auth_center:community_manage:filter', name: '筛选功能' },
                            { id: 'auth_center:community_manage:export', name: '导出' }
                        ]
                    },
                    {
                        id: 'auth_center:auth_level_manage',
                        name: '授权等级管理',
                        children: [
                            { id: 'auth_center:auth_level_manage:view', name: '查看' },
                            { id: 'auth_center:auth_level_manage:add', name: '新增等级' },
                            { id: 'auth_center:auth_level_manage:edit', name: '编辑等级' },
                            { id: 'auth_center:auth_level_manage:permission_config', name: '权限配置' },
                            { id: 'auth_center:auth_level_manage:filter', name: '筛选功能' }
                        ]
                    }
                ]
            },
            {
                id: 'template_center',
                name: '模板中心',
                children: [
                    {
                        id: 'template_center:process_template',
                        name: '流程模板管理',
                        children: [
                            { id: 'template_center:process_template:view', name: '查看' },
                            { id: 'template_center:process_template:add', name: '新增流程模板' },
                            { id: 'template_center:process_template:edit', name: '编辑流程模板' },
                            { id: 'template_center:process_template:enable_disable', name: '启用/停用' },
                            { id: 'template_center:process_template:view_usage', name: '查看使用记录' },
                            { id: 'template_center:process_template:filter', name: '筛选功能' }
                        ]
                    },
                    {
                        id: 'template_center:survey_template',
                        name: '问卷模板管理',
                        children: [
                            { id: 'template_center:survey_template:view', name: '查看' },
                            { id: 'template_center:survey_template:add', name: '新增问卷模板' },
                            { id: 'template_center:survey_template:edit', name: '编辑问卷模板' },
                            { id: 'template_center:survey_template:preview', name: '预览问卷' },
                            { id: 'template_center:survey_template:copy', name: '复制' },
                            { id: 'template_center:survey_template:delete', name: '删除' },
                            { id: 'template_center:survey_template:view_stats', name: '查看统计' },
                            { id: 'template_center:survey_template:export', name: '导出' }
                        ]
                    }
                ]
            },
            {
                id: 'ai_center',
                name: 'AI中心',
                children: [
                    {
                        id: 'ai_center:prompt_manage',
                        name: '提示词管理',
                        children: [
                            { id: 'ai_center:prompt_manage:view', name: '查看' },
                            { id: 'ai_center:prompt_manage:add', name: '新增提示词' },
                            { id: 'ai_center:prompt_manage:edit', name: '编辑提示词' },
                            { id: 'ai_center:prompt_manage:test', name: '测试提示词' },
                            { id: 'ai_center:prompt_manage:copy', name: '复制' },
                            { id: 'ai_center:prompt_manage:delete', name: '删除' },
                            { id: 'ai_center:prompt_manage:filter', name: '筛选功能' }
                        ]
                    },
                    {
                        id: 'ai_center:api_config',
                        name: 'API配置管理',
                        children: [
                            { id: 'ai_center:api_config:view', name: '查看' },
                            { id: 'ai_center:api_config:add', name: '新增API配置' },
                            { id: 'ai_center:api_config:edit', name: '编辑API配置' },
                            { id: 'ai_center:api_config:test', name: 'API测试' },
                            { id: 'ai_center:api_config:monitor', name: '调用监控' },
                            { id: 'ai_center:api_config:filter', name: '筛选功能' }
                        ]
                    }
                ]
            },
            {
                id: 'system_center',
                name: '系统中心',
                children: [
                    {
                        id: 'system_center:role_permission',
                        name: '角色权限管理',
                        children: [
                            { id: 'system_center:role_permission:view', name: '查看' },
                            { id: 'system_center:role_permission:add', name: '新增角色' },
                            { id: 'system_center:role_permission:edit', name: '编辑角色' },
                            { id: 'system_center:role_permission:permission_config', name: '权限配置' },
                            { id: 'system_center:role_permission:user_assign', name: '用户分配' },
                            { id: 'system_center:role_permission:delete', name: '删除' },
                            { id: 'system_center:role_permission:filter', name: '筛选功能' }
                        ]
                    },
                    {
                        id: 'system_center:user_manage',
                        name: '用户账号管理',
                        children: [
                            { id: 'system_center:user_manage:view', name: '查看' },
                            { id: 'system_center:user_manage:add', name: '新增用户' },
                            { id: 'system_center:user_manage:edit', name: '编辑用户' },
                            { id: 'system_center:user_manage:role_manage', name: '角色管理' },
                            { id: 'system_center:user_manage:permission_config', name: '权限配置' },
                            { id: 'system_center:user_manage:reset_password', name: '重置密码' },
                            { id: 'system_center:user_manage:view_log', name: '查看日志' },
                            { id: 'system_center:user_manage:status_manage', name: '状态管理' },
                            { id: 'system_center:user_manage:batch_operation', name: '批量操作' },
                            { id: 'system_center:user_manage:export', name: '导出' }
                        ]
                    },
                    {
                        id: 'system_center:system_config',
                        name: '系统日志管理',
                        children: [
                            { id: 'system_center:system_config:view', name: '查看' },
                            { id: 'system_center:system_config:basic_config', name: '基础配置' },
                            { id: 'system_center:system_config:security_config', name: '安全配置' },
                            { id: 'system_center:system_config:notification_config', name: '通知配置' },
                            { id: 'system_center:system_config:system_monitor', name: '系统监控' }
                        ]
                    }
                ]
            },
            {
                id: 'data_center',
                name: '数据中心',
                children: [
                    {
                        id: 'data_center:user_behavior',
                        name: '用户行为监控',
                        children: [
                            { id: 'data_center:user_behavior:view', name: '查看' },
                            { id: 'data_center:user_behavior:activity_stats', name: '活跃度统计' },
                            { id: 'data_center:user_behavior:behavior_analysis', name: '行为分析' },
                            { id: 'data_center:user_behavior:community_compare', name: '小区对比' }
                        ]
                    },
                    {
                        id: 'data_center:system_performance',
                        name: '系统性能监控',
                        children: [
                            { id: 'data_center:system_performance:view', name: '查看' },
                            { id: 'data_center:system_performance:runtime_status', name: '运行状态' },
                            { id: 'data_center:system_performance:business_stats', name: '业务统计' },
                            { id: 'data_center:system_performance:alert_warning', name: '预警告警' }
                        ]
                    },
                    {
                        id: 'data_center:data_report',
                        name: '数据分析报表',
                        children: [
                            { id: 'data_center:data_report:view', name: '查看' },
                            { id: 'data_center:data_report:operation_report', name: '运营报表' },
                            { id: 'data_center:data_report:financial_report', name: '财务报表' },
                            { id: 'data_center:data_report:custom_report', name: '自定义报表' },
                            { id: 'data_center:data_report:export', name: '导出' }
                        ]
                    },
                    {
                        id: 'data_center:log_manage',
                        name: '日志管理',
                        children: [
                            { id: 'data_center:log_manage:view', name: '查看' },
                            { id: 'data_center:log_manage:operation_log', name: '操作日志' },
                            { id: 'data_center:log_manage:system_log', name: '系统日志' },
                            { id: 'data_center:log_manage:log_analysis', name: '日志分析' },
                            { id: 'data_center:log_manage:export', name: '导出' }
                        ]
                    }
                ]
            }
        ],
        // PC中台权限配置
        pc: [
            {
                id: 'workspace',
                name: '首页',
                children: [
                    {
                        id: 'workspace:dashboard',
                        name: '首页首页',
                        children: [
                            { id: 'workspace:dashboard:view', name: '查看' },
                            { id: 'workspace:dashboard:refresh', name: '刷新数据' },
                            { id: 'workspace:dashboard:export', name: '导出报表' }
                        ]
                    }
                ]
            },
            {
                id: 'basicData',
                name: '基本资料管理',
                children: [
                    {
                        id: 'basicData:resident',
                        name: '业主管理',
                        children: [
                            { id: 'basicData:resident:view', name: '查看' },
                            { id: 'basicData:resident:add', name: '新增' },
                            { id: 'basicData:resident:edit', name: '编辑' },
                            { id: 'basicData:resident:delete', name: '删除' },
                            { id: 'basicData:resident:import', name: '导入' },
                            { id: 'basicData:resident:export', name: '导出' },
                            { id: 'basicData:resident:search', name: '搜索筛选' }
                        ]
                    },
                    {
                        id: 'basicData:overview',
                        name: '事务AI概览管理',
                        children: [
                            { id: 'basicData:overview:view', name: '查看' },
                            { id: 'basicData:overview:config', name: '配置' },
                            { id: 'basicData:overview:refresh', name: '刷新数据' },
                            { id: 'basicData:overview:export', name: '导出报告' }
                        ]
                    }
                ]
            },
            {
                id: 'publish',
                name: '发布',
                children: [
                    {
                        id: 'publish:notification',
                        name: '通知管理',
                        children: [
                            { id: 'publish:notification:view', name: '查看' },
                            { id: 'publish:notification:add', name: '新增' },
                            { id: 'publish:notification:edit', name: '编辑' },
                            { id: 'publish:notification:delete', name: '删除' },
                            { id: 'publish:notification:publish', name: '发布' },
                            { id: 'publish:notification:revoke', name: '撤回' },
                            { id: 'publish:notification:search', name: '搜索筛选' }
                        ]
                    },
                    {
                        id: 'publish:announcement',
                        name: '公告管理',
                        children: [
                            { id: 'publish:announcement:view', name: '查看' },
                            { id: 'publish:announcement:add', name: '新增' },
                            { id: 'publish:announcement:edit', name: '编辑' },
                            { id: 'publish:announcement:delete', name: '删除' },
                            { id: 'publish:announcement:publish', name: '发布' },
                            { id: 'publish:announcement:revoke', name: '撤回' },
                            { id: 'publish:announcement:search', name: '搜索筛选' }
                        ]
                    },
                    {
                        id: 'publish:event',
                        name: '事件管理',
                        children: [
                            { id: 'publish:event:view', name: '查看' },
                            { id: 'publish:event:add', name: '新增' },
                            { id: 'publish:event:edit', name: '编辑' },
                            { id: 'publish:event:delete', name: '删除' },
                            { id: 'publish:event:publish', name: '发布' },
                            { id: 'publish:event:cancel', name: '取消' },
                            { id: 'publish:event:search', name: '搜索筛选' }
                        ]
                    },
                    {
                        id: 'publish:suggestion',
                        name: '小区建议管理',
                        children: [
                            { id: 'publish:suggestion:view', name: '查看' },
                            { id: 'publish:suggestion:reply', name: '回复' },
                            { id: 'publish:suggestion:process', name: '处理' },
                            { id: 'publish:suggestion:close', name: '关闭' },
                            { id: 'publish:suggestion:search', name: '搜索筛选' },
                            { id: 'publish:suggestion:export', name: '导出' }
                        ]
                    }
                ]
            },
            {
                id: 'process',
                name: '流程配置',
                children: [
                    {
                        id: 'process:template',
                        name: '流程模板配置',
                        children: [
                            { id: 'process:template:view', name: '查看' },
                            { id: 'process:template:add', name: '新增' },
                            { id: 'process:template:edit', name: '编辑' },
                            { id: 'process:template:delete', name: '删除' },
                            { id: 'process:template:copy', name: '复制' },
                            { id: 'process:template:publish', name: '发布' },
                            { id: 'process:template:test', name: '测试' },
                            { id: 'process:template:search', name: '搜索筛选' }
                        ]
                    },
                    {
                        id: 'process:survey',
                        name: '问卷模板配置',
                        children: [
                            { id: 'process:survey:view', name: '查看' },
                            { id: 'process:survey:add', name: '新增' },
                            { id: 'process:survey:edit', name: '编辑' },
                            { id: 'process:survey:delete', name: '删除' },
                            { id: 'process:survey:copy', name: '复制' },
                            { id: 'process:survey:publish', name: '发布' },
                            { id: 'process:survey:search', name: '搜索筛选' }
                        ]
                    }
                ]
            },
            {
                id: 'system',
                name: '系统管理',
                children: [
                    {
                        id: 'system:role',
                        name: '角色权限管理',
                        children: [
                            { id: 'system:role:view', name: '查看' },
                            { id: 'system:role:add', name: '新增' },
                            { id: 'system:role:edit', name: '编辑' },
                            { id: 'system:role:delete', name: '删除' },
                            { id: 'system:role:permission', name: '权限配置' },
                            { id: 'system:role:assign', name: '用户分配' },
                            { id: 'system:role:search', name: '搜索筛选' }
                        ]
                    },
                    {
                        id: 'system:account',
                        name: '用户账号管理',
                        children: [
                            { id: 'system:account:view', name: '查看' },
                            { id: 'system:account:add', name: '新增' },
                            { id: 'system:account:edit', name: '编辑' },
                            { id: 'system:account:delete', name: '删除' },
                            { id: 'system:account:reset', name: '重置密码' },
                            { id: 'system:account:enable', name: '启用/停用' },
                            { id: 'system:account:search', name: '搜索筛选' }
                        ]
                    },
                    {
                        id: 'system:logs',
                        name: '系统日志',
                        children: [
                            { id: 'system:logs:view', name: '查看' },
                            { id: 'system:logs:search', name: '搜索筛选' },
                            { id: 'system:logs:export', name: '导出' },
                            { id: 'system:logs:clear', name: '清理日志' }
                        ]
                    }
                ]
            }
        ],
        // 小程序端权限配置
        mobile: [
            {
                id: 'resident',
                name: '业主服务',
                children: [
                    {
                        id: 'resident:profile',
                        name: '个人信息',
                        children: [
                            { id: 'resident:profile:view', name: '查看' },
                            { id: 'resident:profile:edit', name: '编辑' }
                        ]
                    },
                    {
                        id: 'resident:service',
                        name: '服务申请',
                        children: [
                            { id: 'resident:service:view', name: '查看' },
                            { id: 'resident:service:apply', name: '申请' },
                            { id: 'resident:service:cancel', name: '取消' }
                        ]
                    }
                ]
            },
            {
                id: 'community',
                name: '小区事务',
                children: [
                    {
                        id: 'community:notice',
                        name: '通知公告',
                        children: [
                            { id: 'community:notice:view', name: '查看' },
                            { id: 'community:notice:comment', name: '评论' }
                        ]
                    },
                    {
                        id: 'community:vote',
                        name: '投票表决',
                        children: [
                            { id: 'community:vote:view', name: '查看' },
                            { id: 'community:vote:participate', name: '参与投票' }
                        ]
                    }
                ]
            }
        ],

    };

    // 函数不需要返回值，数据已经赋值给全局变量permissionsData
}

/**
 * 加载用户数据
 */
function loadUsersData() {
    // 模拟完整的用户数据，包含角色分配信息
    usersData = [
        // 管理员用户
        { 
            id: 1, 
            name: '张管理员', 
            email: 'admin@community.com', 
            phone: '13800138001', 
            department: '管理部',
            avatar: 'https://via.placeholder.com/40x40?text=张',
            status: 'active',
            roleIds: [1],
            createTime: '2024-01-15 10:30:00',
            lastLoginTime: '2024-12-20 15:30:00'
        },
        
        // 业委会成员
        { 
            id: 2, 
            name: '李业委', 
            email: 'committee1@community.com', 
            phone: '13800138002', 
            department: '业委会',
            avatar: 'https://via.placeholder.com/40x40?text=李',
            status: 'active',
            roleIds: [2],
            createTime: '2024-02-10 14:20:00',
            lastLoginTime: '2024-12-19 16:45:00'
        },
        { 
            id: 6, 
            name: '孙业委', 
            email: 'committee2@community.com', 
            phone: '13800138006', 
            department: '业委会',
            avatar: 'https://via.placeholder.com/40x40?text=孙',
            status: 'active',
            roleIds: [2],
            createTime: '2024-04-15 11:20:00',
            lastLoginTime: '2024-12-15 13:25:00'
        },
        { 
            id: 11, 
            name: '陈业委', 
            email: 'committee3@community.com', 
            phone: '13800138011', 
            department: '业委会',
            avatar: 'https://via.placeholder.com/40x40?text=陈',
            status: 'active',
            roleIds: [2],
            createTime: '2024-07-01 10:30:00',
            lastLoginTime: '2024-12-18 14:20:00'
        },
        { 
            id: 12, 
            name: '刘业委', 
            email: 'committee4@community.com', 
            phone: '13800138012', 
            department: '业委会',
            avatar: 'https://via.placeholder.com/40x40?text=刘',
            status: 'active',
            roleIds: [2],
            createTime: '2024-07-15 11:45:00',
            lastLoginTime: '2024-12-17 16:30:00'
        },
        { 
            id: 13, 
            name: '杨业委', 
            email: 'committee5@community.com', 
            phone: '13800138013', 
            department: '业委会',
            avatar: 'https://via.placeholder.com/40x40?text=杨',
            status: 'active',
            roleIds: [2],
            createTime: '2024-08-01 09:20:00',
            lastLoginTime: '2024-12-16 13:15:00'
        },
        { 
            id: 14, 
            name: '黄业委', 
            email: 'committee6@community.com', 
            phone: '13800138014', 
            department: '业委会',
            avatar: 'https://via.placeholder.com/40x40?text=黄',
            status: 'active',
            roleIds: [2],
            createTime: '2024-08-15 14:10:00',
            lastLoginTime: '2024-12-15 17:45:00'
        },
        { 
            id: 15, 
            name: '林业委', 
            email: 'committee7@community.com', 
            phone: '13800138015', 
            department: '业委会',
            avatar: 'https://via.placeholder.com/40x40?text=林',
            status: 'active',
            roleIds: [2],
            createTime: '2024-09-01 15:30:00',
            lastLoginTime: '2024-12-14 12:20:00'
        },
        { 
            id: 16, 
            name: '徐业委', 
            email: 'committee8@community.com', 
            phone: '13800138016', 
            department: '业委会',
            avatar: 'https://via.placeholder.com/40x40?text=徐',
            status: 'active',
            roleIds: [2],
            createTime: '2024-09-15 16:40:00',
            lastLoginTime: '2024-12-13 18:10:00'
        },
        
        // 业主用户
        { 
            id: 3, 
            name: '王业主', 
            email: 'resident1@community.com', 
            phone: '13800138003', 
            department: '1栋2单元',
            avatar: 'https://via.placeholder.com/40x40?text=王',
            status: 'active',
            roleIds: [3],
            createTime: '2024-03-01 09:00:00',
            lastLoginTime: '2024-12-18 11:30:00'
        },
        { 
            id: 7, 
            name: '周业主', 
            email: 'resident2@community.com', 
            phone: '13800138007', 
            department: '2栋1单元',
            avatar: 'https://via.placeholder.com/40x40?text=周',
            status: 'active',
            roleIds: [3],
            createTime: '2024-05-01 14:30:00',
            lastLoginTime: '2024-12-14 16:40:00'
        },
        { 
            id: 10, 
            name: '冯业主', 
            email: 'resident3@community.com', 
            phone: '13800138010', 
            department: '3栋1单元',
            avatar: 'https://via.placeholder.com/40x40?text=冯',
            status: 'active',
            roleIds: [3],
            createTime: '2024-06-15 12:10:00',
            lastLoginTime: '2024-12-12 14:20:00'
        },
        { 
            id: 17, 
            name: '马业主', 
            email: 'resident4@community.com', 
            phone: '13800138017', 
            department: '1栋3单元',
            avatar: 'https://via.placeholder.com/40x40?text=马',
            status: 'active',
            roleIds: [],
            createTime: '2024-10-01 10:15:00',
            lastLoginTime: '2024-12-11 15:30:00'
        },
        { 
            id: 18, 
            name: '朱业主', 
            email: 'resident5@community.com', 
            phone: '13800138018', 
            department: '2栋2单元',
            avatar: 'https://via.placeholder.com/40x40?text=朱',
            status: 'active',
            roleIds: [],
            createTime: '2024-10-15 11:20:00',
            lastLoginTime: '2024-12-10 16:45:00'
        },
        { 
            id: 19, 
            name: '胡业主', 
            email: 'resident6@community.com', 
            phone: '13800138019', 
            department: '3栋2单元',
            avatar: 'https://via.placeholder.com/40x40?text=胡',
            status: 'active',
            roleIds: [],
            createTime: '2024-11-01 12:30:00',
            lastLoginTime: '2024-12-09 17:20:00'
        },
        { 
            id: 20, 
            name: '郭业主', 
            email: 'resident7@community.com', 
            phone: '13800138020', 
            department: '4栋1单元',
            avatar: 'https://via.placeholder.com/40x40?text=郭',
            status: 'active',
            roleIds: [],
            createTime: '2024-11-15 13:40:00',
            lastLoginTime: '2024-12-08 18:15:00'
        },
        { 
            id: 21, 
            name: '何业主', 
            email: 'resident8@community.com', 
            phone: '13800138021', 
            department: '4栋2单元',
            avatar: 'https://via.placeholder.com/40x40?text=何',
            status: 'active',
            roleIds: [],
            createTime: '2024-12-01 14:50:00',
            lastLoginTime: '2024-12-07 19:10:00'
        },
        
        // 物业用户
        { 
            id: 4, 
            name: '赵物业', 
            email: 'property1@community.com', 
            phone: '13800138004', 
            department: '物业部',
            avatar: 'https://via.placeholder.com/40x40?text=赵',
            status: 'active',
            roleIds: [4],
            createTime: '2024-03-15 13:30:00',
            lastLoginTime: '2024-12-17 15:20:00'
        },
        { 
            id: 8, 
            name: '吴物业', 
            email: 'property2@community.com', 
            phone: '13800138008', 
            department: '物业部',
            avatar: 'https://via.placeholder.com/40x40?text=吴',
            status: 'inactive',
            roleIds: [4],
            createTime: '2024-05-15 09:45:00',
            lastLoginTime: '2024-12-10 10:15:00'
        },
        { 
            id: 22, 
            name: '高物业', 
            email: 'property3@community.com', 
            phone: '13800138022', 
            department: '物业部',
            avatar: 'https://via.placeholder.com/40x40?text=高',
            status: 'active',
            roleIds: [],
            createTime: '2024-12-05 15:20:00',
            lastLoginTime: '2024-12-06 16:30:00'
        },
        { 
            id: 23, 
            name: '罗物业', 
            email: 'property4@community.com', 
            phone: '13800138023', 
            department: '物业部',
            avatar: 'https://via.placeholder.com/40x40?text=罗',
            status: 'active',
            roleIds: [],
            createTime: '2024-12-10 16:40:00',
            lastLoginTime: '2024-12-05 17:50:00'
        },
        
        // 楼栋长用户
        { 
            id: 5, 
            name: '钱楼栋长', 
            email: 'building1@community.com', 
            phone: '13800138005', 
            department: '1栋楼栋长',
            avatar: 'https://via.placeholder.com/40x40?text=钱',
            status: 'active',
            roleIds: [5],
            createTime: '2024-04-01 10:15:00',
            lastLoginTime: '2024-12-16 14:10:00'
        },
        { 
            id: 9, 
            name: '郑楼栋长', 
            email: 'building2@community.com', 
            phone: '13800138009', 
            department: '2栋楼栋长',
            avatar: 'https://via.placeholder.com/40x40?text=郑',
            status: 'active',
            roleIds: [5],
            createTime: '2024-06-01 15:20:00',
            lastLoginTime: '2024-12-13 17:30:00'
        },
        { 
            id: 24, 
            name: '宋楼栋长', 
            email: 'building3@community.com', 
            phone: '13800138024', 
            department: '3栋楼栋长',
            avatar: 'https://via.placeholder.com/40x40?text=宋',
            status: 'active',
            roleIds: [],
            createTime: '2024-12-15 17:10:00',
            lastLoginTime: '2024-12-04 18:20:00'
        },
        { 
            id: 25, 
            name: '梁楼栋长', 
            email: 'building4@community.com', 
            phone: '13800138025', 
            department: '4栋楼栋长',
            avatar: 'https://via.placeholder.com/40x40?text=梁',
            status: 'active',
            roleIds: [],
            createTime: '2024-12-20 18:30:00',
            lastLoginTime: '2024-12-03 19:40:00'
        },
        
        // 待分配角色的新用户
        { 
            id: 26, 
            name: '韩新用户', 
            email: 'newuser1@community.com', 
            phone: '13800138026', 
            department: '5栋1单元',
            avatar: 'https://via.placeholder.com/40x40?text=韩',
            status: 'active',
            roleIds: [],
            createTime: '2024-12-21 09:10:00',
            lastLoginTime: '2024-12-02 10:20:00'
        },
        { 
            id: 27, 
            name: '唐新用户', 
            email: 'newuser2@community.com', 
            phone: '13800138027', 
            department: '5栋2单元',
            avatar: 'https://via.placeholder.com/40x40?text=唐',
            status: 'active',
            roleIds: [],
            createTime: '2024-12-22 10:30:00',
            lastLoginTime: '2024-12-01 11:40:00'
        },
        { 
            id: 28, 
            name: '冯新用户', 
            email: 'newuser3@community.com', 
            phone: '13800138028', 
            department: '6栋1单元',
            avatar: 'https://via.placeholder.com/40x40?text=冯',
            status: 'active',
            roleIds: [],
            createTime: '2024-12-23 11:50:00',
            lastLoginTime: '2024-11-30 12:00:00'
        },
        { 
            id: 29, 
            name: '于新用户', 
            email: 'newuser4@community.com', 
            phone: '13800138029', 
            department: '6栋2单元',
            avatar: 'https://via.placeholder.com/40x40?text=于',
            status: 'active',
            roleIds: [],
            createTime: '2024-12-24 12:10:00',
            lastLoginTime: '2024-11-29 13:20:00'
        },
        { 
            id: 30, 
            name: '董新用户', 
            email: 'newuser5@community.com', 
            phone: '13800138030', 
            department: '7栋1单元',
            avatar: 'https://via.placeholder.com/40x40?text=董',
            status: 'active',
            roleIds: [],
            createTime: '2024-12-25 13:30:00',
            lastLoginTime: '2024-11-28 14:40:00'
        }
    ];
}

/**
 * 更新统计信息
 */
function updateStatistics() {
    // 更新角色统计信息
    const totalRoles = rolesData.length;
    const enabledRoles = rolesData.filter(role => role.status === 'enabled').length;
    const disabledRoles = totalRoles - enabledRoles;
    
    // 计算总用户数
    const totalUsers = usersData.length;
    const activeUsers = usersData.filter(user => user.status === 'active').length;
    
    // 更新页面显示（如果存在对应元素）
    const totalRolesEl = document.querySelector('.total-roles');
    const enabledRolesEl = document.querySelector('.enabled-roles');
    const disabledRolesEl = document.querySelector('.disabled-roles');
    const totalUsersEl = document.querySelector('.total-users');
    const activeUsersEl = document.querySelector('.active-users');
    
    if (totalRolesEl) totalRolesEl.textContent = totalRoles;
    if (enabledRolesEl) enabledRolesEl.textContent = enabledRoles;
    if (disabledRolesEl) disabledRolesEl.textContent = disabledRoles;
    if (totalUsersEl) totalUsersEl.textContent = totalUsers;
    if (activeUsersEl) activeUsersEl.textContent = activeUsers;
}

/**
 * 计算权限数量
 */
function countPermissions(permissions) {
    if (!permissions || !Array.isArray(permissions)) {
        return 0;
    }
    
    let count = 0;
    permissions.forEach(permission => {
        count++;
        if (permission.children && Array.isArray(permission.children)) {
            count += countPermissions(permission.children);
        }
    });
    
    return count;
}

/**
 * 更新统计数据
 */
// 重复的updateStatistics函数已删除

/**
 * 递归计算权限节点数量
 */
// 重复的countPermissions函数已删除

/**
 * 渲染角色表格
 */
function renderRoleTable() {
    const tbody = document.getElementById('roleTableBody');
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, rolesData.length);
    const pageData = rolesData.slice(startIndex, endIndex);
    
    tbody.innerHTML = pageData.map((role, index) => {
        const platformsText = role.platforms.map(p => {
            const platformNames = { admin: '总后台', pc: 'PC中台', mobile: '小程序' };
            return platformNames[p] || p;
        }).join(', ');
        
        // 状态滑块容器
        const statusToggle = `<div id="toggle-role-${role.id}" class="flex justify-center"></div>`;
        
        // 判断是否为第一行数据（小区管理员）
        const isFirstRow = (startIndex + index) === 0;
        
        // 根据是否为第一行生成不同的操作按钮
        const actionButtons = isFirstRow ? `
            <button disabled class="text-gray-400 cursor-not-allowed mr-3" title="系统默认角色，不可操作">
                编辑
            </button>
            <button disabled class="text-gray-400 cursor-not-allowed mr-3" title="系统默认角色，不可操作">
                权限配置
            </button>
            <button disabled class="text-gray-400 cursor-not-allowed mr-3" title="系统默认角色，不可操作">
                分配
            </button>
            <button disabled class="text-gray-400 cursor-not-allowed" title="系统默认角色，不可操作">
                删除
            </button>
        ` : `
            <button onclick="editRole(${role.id})" class="text-blue-600 hover:text-blue-900 mr-3">
                编辑
            </button>
            <button onclick="configPermissions(${role.id})" class="text-purple-600 hover:text-purple-900 mr-3">
                权限配置
            </button>
            <button onclick="assignUsers(${role.id})" class="text-green-600 hover:text-green-900 mr-3">
                分配
            </button>
            <button onclick="deleteRole(${role.id})" class="text-red-600 hover:text-red-900">
                删除
            </button>
        `;
            
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${role.name}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 max-w-xs truncate" title="${role.description}">${role.description}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${role.userCount} 人</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${platformsText}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">${statusToggle}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ${actionButtons}
                </td>
            </tr>
        `;
    }).join('');
    
    // 初始化滑块开关
    initializeToggleSwitches();
}

/**
 * 初始化滑块开关组件
 */
function initializeToggleSwitches() {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, rolesData.length);
    const pageData = rolesData.slice(startIndex, endIndex);
    
    pageData.forEach((role, index) => {
        const containerId = `toggle-role-${role.id}`;
        const isFirstRow = (startIndex + index) === 0; // 系统默认角色
        
        // 创建滑块开关实例
        new ToggleSwitch({
            containerId: containerId,
            id: `switch-${role.id}`,
            checked: role.status === 'enabled',
            disabled: isFirstRow, // 系统默认角色停用操作
            size: 'sm',
            onChange: function(checked, switchId, event) {
                if (!isFirstRow) {
                    // 调用原有的状态切换逻辑
                    toggleRoleStatus(role.id);
                }
            }
        });
    });
}

/**
 * 更新分页控件
 */
function updatePagination() {
    const totalPages = Math.ceil(totalRecords / pageSize);
    const startRecord = (currentPage - 1) * pageSize + 1;
    const endRecord = Math.min(currentPage * pageSize, totalRecords);
    
    document.getElementById('startRecord').textContent = startRecord;
    document.getElementById('endRecord').textContent = endRecord;
    document.getElementById('totalRecords').textContent = totalRecords;
    
    // 更新分页按钮状态
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
    
    // 生成页码按钮
    const pageNumbers = document.getElementById('pageNumbers');
    pageNumbers.innerHTML = '';
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = `px-3 py-1 border rounded text-sm ${
            i === currentPage 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'border-gray-300 hover:bg-gray-50'
        }`;
        button.onclick = () => goToPage(i);
        pageNumbers.appendChild(button);
    }
}

/**
 * 应用筛选条件
 */
function applyFilters() {
    // 获取状态筛选值（下拉框）
    const statusSelect = document.getElementById('filterStatus');
    const status = statusSelect ? statusSelect.value : '';
    
    // 获取权限范围筛选值（单选下拉框）
    const permissionSelect = document.getElementById('filterPermissionScope');
    const permissionScope = permissionSelect ? permissionSelect.value : '';
    
    // 获取名称搜索值
    const nameSearch = document.getElementById('nameSearch') ? document.getElementById('nameSearch').value.toLowerCase() : '';
    
    // 获取描述搜索值
    const descriptionSearch = document.getElementById('descriptionSearch') ? document.getElementById('descriptionSearch').value.toLowerCase() : '';
    
    const filteredData = rolesData.filter(role => {
        // 状态筛选
        const statusMatch = !status || role.status === status;
        
        // 权限范围筛选（如果选择了"全部"或没有选择，则显示所有）
        let permissionMatch = true;
        if (permissionScope && permissionScope !== '') {
            switch(permissionScope) {
                case 'pc':
                    permissionMatch = role.platform === 'pc' || role.name.toLowerCase().includes('pc') || role.name.toLowerCase().includes('中台');
                    break;
                case 'miniprogram':
                    permissionMatch = role.platform === 'miniprogram' || role.name.toLowerCase().includes('小程序') || role.name.toLowerCase().includes('mini');
                    break;
                case 'backend':
                    permissionMatch = role.platform === 'backend' || role.name.toLowerCase().includes('后台') || role.name.toLowerCase().includes('管理');
                    break;
                default:
                    permissionMatch = true;
            }
        }
        
        // 名称搜索
        const nameMatch = !nameSearch || role.name.toLowerCase().includes(nameSearch);
        
        // 描述搜索
        const descriptionMatch = !descriptionSearch || role.description.toLowerCase().includes(descriptionSearch);
        
        return statusMatch && permissionMatch && nameMatch && descriptionMatch;
    });
    
    // 更新显示数据
    const originalData = rolesData;
    rolesData = filteredData;
    totalRecords = filteredData.length;
    currentPage = 1;
    
    renderRoleTable();
    updatePagination();
    
    // 恢复原始数据引用
    rolesData = originalData;
}

/**
 * 搜索角色（主要用于描述搜索框的搜索按钮）
 */
function searchRoles() {
    applyFilters();
}

/**
 * 重置筛选条件
 */
function resetFilters() {
    // 重置状态下拉框
    const statusSelect = document.getElementById('filterStatus');
    if (statusSelect) {
        statusSelect.value = '';
    }
    
    // 重置权限范围下拉框
    const permissionSelect = document.getElementById('filterPermissionScope');
    if (permissionSelect) {
        permissionSelect.value = '';
    }
    
    // 重置名称搜索框
    const nameSearch = document.getElementById('nameSearch');
    if (nameSearch) {
        nameSearch.value = '';
    }
    
    // 重置描述搜索框
    const descSearch = document.getElementById('descriptionSearch');
    if (descSearch) {
        descSearch.value = '';
    }
    
    // 应用筛选（显示所有数据）
    applyFilters();
}

/**
 * 改变页面大小
 */
function changePageSize() {
    pageSize = parseInt(document.getElementById('pageSize').value);
    currentPage = 1;
    renderRoleTable();
    updatePagination();
}

/**
 * 跳转到指定页面
 */
function goToPage(page) {
    currentPage = page;
    renderRoleTable();
    updatePagination();
}

/**
 * 上一页
 */
function previousPage() {
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
}

/**
 * 下一页
 */
function nextPage() {
    const totalPages = Math.ceil(totalRecords / pageSize);
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
}

/**
 * 关闭所有弹窗
 */
/**
 * 关闭所有模态框
 */
function closeAllModals() {
    const modals = ['roleModal', 'permissionModal', 'userAssignModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            // 延时处理，确保动画完成后再隐藏
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    });
    
    // 重置全局状态
    currentRoleId = null;
}

/**
 * 打开角色弹窗
 */
/**
 * 打开新增角色弹窗
 */
function openAddRoleModal() {
    console.log('点击新增角色按钮');
    console.log('addRoleModal实例:', addRoleModal);
    
    // 先关闭所有弹窗
    closeAllModals();
    
    // 如果组件实例不存在，尝试重新初始化
    if (!addRoleModal) {
        console.log('addRoleModal实例不存在，尝试重新初始化');
        initAddRoleModal();
    }
    
    // 使用组件显示弹窗
    if (addRoleModal) {
        console.log('调用addRoleModal.show()');
        // 更新组件的权限数据
        addRoleModal.setPermissionsData(permissionsData);
        addRoleModal.show();
        console.log('弹窗应该已显示');
    } else {
        console.error('addRoleModal实例仍然不存在，请检查AddRoleModal.js文件加载情况');
        alert('角色弹窗组件加载失败，请刷新页面重试');
    }
}

/**
 * 关闭新增角色弹窗
 */
function closeAddRoleModal() {
    if (addRoleModal) {
        addRoleModal.hide();
    }
}

/**
 * 打开编辑角色弹窗
 */
function openRoleModal(roleId) {
    // 先关闭所有弹窗
    closeAllModals();
    
    currentRoleId = roleId;
    const modal = document.getElementById('roleModal');
    const title = document.getElementById('roleModalTitle');
    
    title.textContent = '编辑角色';
    const role = rolesData.find(r => r.id === roleId);
    if (role) {
        document.getElementById('roleName').value = role.name;
        document.getElementById('roleDescription').value = role.description;
        
        // 适用平台相关代码已移除
    }
    
    // 延迟显示以确保动画效果
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

/**
 * 关闭角色弹窗
 */
function closeRoleModal() {
    document.getElementById('roleModal').classList.remove('show');
    currentRoleId = null;
}

// 级联权限选择器状态
let cascadeState = {
    currentPlatform: 'backend',
    selectedModule: null,
    selectedFunction: null,
    selectedPermissions: new Set()
};

// 注意：addCascadeState 已移至 AddRoleModal 组件内部管理

/**
 * 打开权限配置弹窗
 */
function openPermissionConfig() {
    // 验证角色基本信息
    const form = document.getElementById('roleForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // 关闭角色弹窗，打开权限配置弹窗
    closeRoleModal();
    
    setTimeout(() => {
        document.getElementById('permissionModal').classList.add('show');
        initPermissionCascade();
    }, 300); // 等待角色弹窗关闭动画完成
}

/**
 * 打开权限配置弹窗
 */
function openPermissionModal(roleId) {
    currentRoleId = roleId;
    const role = rolesData.find(r => r.id === roleId);
    if (role) {
        // 更新弹窗标题
        const modalTitle = document.querySelector('#permissionModal h3');
        if (modalTitle) {
            modalTitle.textContent = `权限配置 - ${role.name}`;
        }
        
        // 显示弹窗
        document.getElementById('permissionModal').style.display = 'block';
        document.getElementById('permissionModal').classList.add('show');
        
        // 初始化级联选择器
        setTimeout(() => {
            initPermissionCascade();
            // 加载角色现有权限
            loadRolePermissions(role);
        }, 100);
    }
}

/**
 * 初始化权限级联选择器
 */
function initPermissionCascade() {
    // 重置状态
    cascadeState = {
        currentPlatform: 'pc',
        selectedModule: null,
        selectedFunction: null,
        selectedPermissions: new Set()
    };
    
    // 绑定端切换事件
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            switchPlatform(this.dataset.platform);
        });
    });
    
    // 初始化显示
    switchPlatform('pc');
}

/**
 * 初始化新增角色弹窗的权限级联选择器
 */
// 注意：initAddPermissionCascade 和 switchAddPlatform 函数已移至 AddRoleModal 组件内部

/**
 * 关闭权限配置弹窗
 */
function closePermissionModal() {
    document.getElementById('permissionModal').classList.remove('show');
    document.getElementById('permissionModal').style.display = 'none';
    currentRoleId = null;
}

/**
 * 切换平台权限配置
 */
function switchPlatform(platform) {
    cascadeState.currentPlatform = platform;
    cascadeState.selectedModule = null;
    cascadeState.selectedFunction = null;
    
    // 更新标签样式
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.className = 'tab-btn px-4 py-2 text-gray-500 hover:text-gray-700';
    });
    document.getElementById(`tab${platform.charAt(0).toUpperCase() + platform.slice(1)}`)
        .className = 'tab-btn px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium';
    
    // 加载模块列表
    loadModuleList();
    // 清空功能和按钮列表
    document.getElementById('functionList').innerHTML = '';
    document.getElementById('buttonList').innerHTML = '';
}

/**
 * 加载新增角色弹窗的模块列表
 */
function loadAddModuleList() {
    const modules = permissionsData[addCascadeState.currentPlatform] || [];
    const container = document.getElementById('addModuleList');
    
    let html = '';
    modules.forEach(module => {
        const isSelected = addCascadeState.selectedModule === module.id;
        const isChecked = isAddModuleSelected(module.id);
        html += `
            <div class="module-item p-2 hover:bg-blue-50 rounded ${isSelected ? 'bg-blue-100 border-l-4 border-blue-500' : ''}" 
                 data-module-id="${module.id}">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" id="add_module_${module.id}" 
                           ${isChecked ? 'checked' : ''}
                           onchange="toggleAddModule('${module.id}', this.checked)"
                           class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                    <label for="add_module_${module.id}" class="flex-1 cursor-pointer" onclick="selectAddModule('${module.id}')">
                        <div class="font-medium text-gray-900">${module.name}</div>
                        <div class="text-xs text-gray-500">${module.children ? module.children.length : 0} 个功能</div>
                    </label>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * 加载模块列表
 */
function loadModuleList() {
    const modules = permissionsData[cascadeState.currentPlatform] || [];
    const container = document.getElementById('moduleList');
    
    let html = '';
    modules.forEach(module => {
        const isSelected = cascadeState.selectedModule === module.id;
        const isChecked = isModuleSelected(module.id);
        html += `
            <div class="module-item p-2 hover:bg-blue-50 rounded ${isSelected ? 'bg-blue-100 border-l-4 border-blue-500' : ''}" 
                 data-module-id="${module.id}">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" id="module_${module.id}" 
                           ${isChecked ? 'checked' : ''}
                           onchange="toggleModule('${module.id}', this.checked)"
                           class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                    <label for="module_${module.id}" class="flex-1 cursor-pointer" onclick="selectModule('${module.id}')">
                        <div class="font-medium text-gray-900">${module.name}</div>
                        <div class="text-xs text-gray-500">${module.children ? module.children.length : 0} 个功能</div>
                    </label>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * 新增角色弹窗选择模块
 */
function selectAddModule(moduleId) {
    addCascadeState.selectedModule = moduleId;
    addCascadeState.selectedFunction = null;
    
    // 更新模块列表样式
    document.querySelectorAll('#addModuleList .module-item').forEach(item => {
        if (item.dataset.moduleId === moduleId) {
            item.className = 'module-item p-2 cursor-pointer hover:bg-blue-50 rounded bg-blue-100 border-l-4 border-blue-500';
        } else {
            item.className = 'module-item p-2 cursor-pointer hover:bg-blue-50 rounded';
        }
    });
    
    // 加载功能列表
    loadAddFunctionList();
    // 清空按钮列表
    document.getElementById('addButtonList').innerHTML = '';
}

/**
 * 选择模块
 */
function selectModule(moduleId) {
    cascadeState.selectedModule = moduleId;
    cascadeState.selectedFunction = null;
    
    // 更新模块列表样式
    document.querySelectorAll('.module-item').forEach(item => {
        if (item.dataset.moduleId === moduleId) {
            item.className = 'module-item p-2 cursor-pointer hover:bg-blue-50 rounded bg-blue-100 border-l-4 border-blue-500';
        } else {
            item.className = 'module-item p-2 cursor-pointer hover:bg-blue-50 rounded';
        }
    });
    
    // 加载功能列表
    loadFunctionList();
    // 清空按钮列表
    document.getElementById('buttonList').innerHTML = '';
}

/**
 * 加载新增角色弹窗的功能列表
 */
function loadAddFunctionList() {
    const modules = permissionsData[addCascadeState.currentPlatform] || [];
    const selectedModule = modules.find(m => m.id === addCascadeState.selectedModule);
    
    if (!selectedModule || !selectedModule.children) {
        document.getElementById('addFunctionList').innerHTML = '<div class="text-gray-500 text-center py-4">请先选择模块</div>';
        return;
    }
    
    const container = document.getElementById('addFunctionList');
    let html = '';
    
    selectedModule.children.forEach(func => {
        const isSelected = addCascadeState.selectedFunction === func.id;
        const isChecked = isAddFunctionSelected(func.id);
        html += `
            <div class="function-item p-2 hover:bg-green-50 rounded ${isSelected ? 'bg-green-100 border-l-4 border-green-500' : ''}" 
                 data-function-id="${func.id}">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" id="add_function_${func.id}" 
                           ${isChecked ? 'checked' : ''}
                           onchange="toggleAddFunction('${func.id}', this.checked)"
                           class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500">
                    <label for="add_function_${func.id}" class="flex-1 cursor-pointer" onclick="selectAddFunction('${func.id}')">
                        <div class="font-medium text-gray-900">${func.name}</div>
                        <div class="text-xs text-gray-500">${func.children ? func.children.length : 0} 个按钮</div>
                    </label>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * 加载功能列表
 */
function loadFunctionList() {
    const modules = permissionsData[cascadeState.currentPlatform] || [];
    const selectedModule = modules.find(m => m.id === cascadeState.selectedModule);
    
    if (!selectedModule || !selectedModule.children) {
        document.getElementById('functionList').innerHTML = '<div class="text-gray-500 text-center py-4">请先选择模块</div>';
        return;
    }
    
    const container = document.getElementById('functionList');
    let html = '';
    
    selectedModule.children.forEach(func => {
        const isSelected = cascadeState.selectedFunction === func.id;
        const isChecked = isFunctionSelected(func.id);
        html += `
            <div class="function-item p-2 hover:bg-green-50 rounded ${isSelected ? 'bg-green-100 border-l-4 border-green-500' : ''}" 
                 data-function-id="${func.id}">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" id="function_${func.id}" 
                           ${isChecked ? 'checked' : ''}
                           onchange="toggleFunction('${func.id}', this.checked)"
                           class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500">
                    <label for="function_${func.id}" class="flex-1 cursor-pointer" onclick="selectFunction('${func.id}')">
                        <div class="font-medium text-gray-900">${func.name}</div>
                        <div class="text-xs text-gray-500">${func.children ? func.children.length : 0} 个按钮</div>
                    </label>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * 新增角色弹窗选择功能
 */
function selectAddFunction(functionId) {
    addCascadeState.selectedFunction = functionId;
    
    // 更新功能列表样式
    document.querySelectorAll('#addFunctionList .function-item').forEach(item => {
        if (item.dataset.functionId === functionId) {
            item.className = 'function-item p-2 cursor-pointer hover:bg-green-50 rounded bg-green-100 border-l-4 border-green-500';
        } else {
            item.className = 'function-item p-2 cursor-pointer hover:bg-green-50 rounded';
        }
    });
    
    // 加载按钮权限列表
    loadAddButtonList();
}

/**
 * 选择功能
 */
function selectFunction(functionId) {
    cascadeState.selectedFunction = functionId;
    
    // 更新功能列表样式
    document.querySelectorAll('.function-item').forEach(item => {
        if (item.dataset.functionId === functionId) {
            item.className = 'function-item p-2 cursor-pointer hover:bg-green-50 rounded bg-green-100 border-l-4 border-green-500';
        } else {
            item.className = 'function-item p-2 cursor-pointer hover:bg-green-50 rounded';
        }
    });
    
    // 加载按钮权限列表
    loadButtonList();
}

/**
 * 加载新增角色弹窗的按钮权限列表
 */
function loadAddButtonList() {
    const modules = permissionsData[addCascadeState.currentPlatform] || [];
    const selectedModule = modules.find(m => m.id === addCascadeState.selectedModule);
    
    if (!selectedModule) {
        document.getElementById('addButtonList').innerHTML = '<div class="text-gray-500 text-center py-4">请先选择模块</div>';
        return;
    }
    
    const selectedFunction = selectedModule.children.find(f => f.id === addCascadeState.selectedFunction);
    
    if (!selectedFunction || !selectedFunction.children) {
        document.getElementById('addButtonList').innerHTML = '<div class="text-gray-500 text-center py-4">请先选择功能</div>';
        return;
    }
    
    const container = document.getElementById('addButtonList');
    let html = '';
    
    selectedFunction.children.forEach(button => {
        const isSelected = addCascadeState.selectedPermissions.has(button.id);
        html += `
            <div class="button-item p-2 cursor-pointer hover:bg-yellow-50 rounded ${isSelected ? 'bg-yellow-100 border-l-4 border-yellow-500' : ''}" 
                 onclick="toggleAddPermission('${button.id}', '${button.name}')">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" ${isSelected ? 'checked' : ''} class="permission-checkbox" 
                           onchange="toggleAddPermission('${button.id}', '${button.name}')">
                    <span class="text-sm text-gray-900">${button.name}</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * 加载按钮权限列表
 */
function loadButtonList() {
    const modules = permissionsData[cascadeState.currentPlatform] || [];
    const selectedModule = modules.find(m => m.id === cascadeState.selectedModule);
    
    if (!selectedModule) {
        document.getElementById('buttonList').innerHTML = '<div class="text-gray-500 text-center py-4">请先选择模块</div>';
        return;
    }
    
    const selectedFunction = selectedModule.children.find(f => f.id === cascadeState.selectedFunction);
    
    if (!selectedFunction || !selectedFunction.children) {
        document.getElementById('buttonList').innerHTML = '<div class="text-gray-500 text-center py-4">请先选择功能</div>';
        return;
    }
    
    const container = document.getElementById('buttonList');
    let html = '';
    
    selectedFunction.children.forEach(button => {
        const isSelected = cascadeState.selectedPermissions.has(button.id);
        html += `
            <div class="button-item p-2 cursor-pointer hover:bg-yellow-50 rounded ${isSelected ? 'bg-yellow-100 border-l-4 border-yellow-500' : ''}" 
                 onclick="togglePermission('${button.id}', '${button.name}')">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" ${isSelected ? 'checked' : ''} class="permission-checkbox" 
                           onchange="togglePermission('${button.id}', '${button.name}')">
                    <span class="text-sm text-gray-900">${button.name}</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * 检查新增角色弹窗模块是否被选中（模块下所有权限都被选中）
 */
function isAddModuleSelected(moduleId) {
    const modules = permissionsData[addCascadeState.currentPlatform] || [];
    const module = modules.find(m => m.id === moduleId);
    if (!module || !module.children) return false;
    
    // 检查模块下所有按钮权限是否都被选中
    for (const func of module.children) {
        if (!func.children) continue;
        for (const button of func.children) {
            const permissionId = `${addCascadeState.currentPlatform}_${moduleId}_${func.id}_${button.id}`;
            if (!addCascadeState.selectedPermissions.has(permissionId)) {
                return false;
            }
        }
    }
    return true;
}

/**
 * 检查模块是否被选中（模块下所有权限都被选中）
 */
function isModuleSelected(moduleId) {
    const modules = permissionsData[cascadeState.currentPlatform] || [];
    const module = modules.find(m => m.id === moduleId);
    if (!module || !module.children) return false;
    
    // 检查模块下所有按钮权限是否都被选中
    for (const func of module.children) {
        if (!func.children) continue;
        for (const button of func.children) {
            const permissionId = `${cascadeState.currentPlatform}_${moduleId}_${func.id}_${button.id}`;
            if (!cascadeState.selectedPermissions.has(permissionId)) {
                return false;
            }
        }
    }
    return true;
}

/**
 * 检查新增角色弹窗功能是否被选中（功能下所有权限都被选中）
 */
function isAddFunctionSelected(functionId) {
    const modules = permissionsData[addCascadeState.currentPlatform] || [];
    const module = modules.find(m => m.id === addCascadeState.selectedModule);
    if (!module) return false;
    
    const func = module.children.find(f => f.id === functionId);
    if (!func || !func.children) return false;
    
    // 检查功能下所有按钮权限是否都被选中
    for (const button of func.children) {
        const permissionId = `${addCascadeState.currentPlatform}_${addCascadeState.selectedModule}_${functionId}_${button.id}`;
        if (!addCascadeState.selectedPermissions.has(permissionId)) {
            return false;
        }
    }
    return true;
}

/**
 * 检查功能是否被选中（功能下所有权限都被选中）
 */
function isFunctionSelected(functionId) {
    const modules = permissionsData[cascadeState.currentPlatform] || [];
    const module = modules.find(m => m.id === cascadeState.selectedModule);
    if (!module) return false;
    
    const func = module.children.find(f => f.id === functionId);
    if (!func || !func.children) return false;
    
    // 检查功能下所有按钮权限是否都被选中
    for (const button of func.children) {
        const permissionId = `${cascadeState.currentPlatform}_${cascadeState.selectedModule}_${functionId}_${button.id}`;
        if (!cascadeState.selectedPermissions.has(permissionId)) {
            return false;
        }
    }
    return true;
}

/**
 * 切换新增角色弹窗模块选择状态
 */
function toggleAddModule(moduleId, checked) {
    const modules = permissionsData[addCascadeState.currentPlatform] || [];
    const module = modules.find(m => m.id === moduleId);
    if (!module || !module.children) return;
    
    // 切换模块下所有权限
    module.children.forEach(func => {
        if (!func.children) return;
        func.children.forEach(button => {
            const permissionId = `${addCascadeState.currentPlatform}_${moduleId}_${func.id}_${button.id}`;
            if (checked) {
                addCascadeState.selectedPermissions.add(permissionId);
            } else {
                addCascadeState.selectedPermissions.delete(permissionId);
            }
        });
    });
    
    // 更新界面
    loadAddFunctionList();
    loadAddButtonList();
    updateAddSelectedPermissionsPreview();
}

/**
 * 切换模块选择状态
 */
function toggleModule(moduleId, checked) {
    const modules = permissionsData[cascadeState.currentPlatform] || [];
    const module = modules.find(m => m.id === moduleId);
    if (!module || !module.children) return;
    
    // 切换模块下所有权限
    module.children.forEach(func => {
        if (!func.children) return;
        func.children.forEach(button => {
            const permissionId = `${cascadeState.currentPlatform}_${moduleId}_${func.id}_${button.id}`;
            if (checked) {
                cascadeState.selectedPermissions.add(permissionId);
            } else {
                cascadeState.selectedPermissions.delete(permissionId);
            }
        });
    });
    
    // 更新界面
    loadFunctionList();
    loadButtonList();
    updateSelectedPermissionsPreview();
}

/**
 * 切换新增角色弹窗功能选择状态
 */
function toggleAddFunction(functionId, checked) {
    const modules = permissionsData[addCascadeState.currentPlatform] || [];
    const module = modules.find(m => m.id === addCascadeState.selectedModule);
    if (!module) return;
    
    const func = module.children.find(f => f.id === functionId);
    if (!func || !func.children) return;
    
    // 切换功能下所有权限
    func.children.forEach(button => {
        const permissionId = `${addCascadeState.currentPlatform}_${addCascadeState.selectedModule}_${functionId}_${button.id}`;
        if (checked) {
            addCascadeState.selectedPermissions.add(permissionId);
        } else {
            addCascadeState.selectedPermissions.delete(permissionId);
        }
    });
    
    // 更新界面
    loadAddModuleList();
    loadAddButtonList();
    updateAddSelectedPermissionsPreview();
}

/**
 * 切换功能选择状态
 */
function toggleFunction(functionId, checked) {
    const modules = permissionsData[cascadeState.currentPlatform] || [];
    const module = modules.find(m => m.id === cascadeState.selectedModule);
    if (!module) return;
    
    const func = module.children.find(f => f.id === functionId);
    if (!func || !func.children) return;
    
    // 切换功能下所有权限
    func.children.forEach(button => {
        const permissionId = `${cascadeState.currentPlatform}_${cascadeState.selectedModule}_${functionId}_${button.id}`;
        if (checked) {
            cascadeState.selectedPermissions.add(permissionId);
        } else {
            cascadeState.selectedPermissions.delete(permissionId);
        }
    });
    
    // 更新界面
    loadModuleList();
    loadButtonList();
    updateSelectedPermissionsPreview();
}

/**
 * 切换新增角色弹窗权限选择状态
 */
function toggleAddPermission(permissionId, permissionName) {
    if (addCascadeState.selectedPermissions.has(permissionId)) {
        addCascadeState.selectedPermissions.delete(permissionId);
    } else {
        addCascadeState.selectedPermissions.add(permissionId);
    }
    
    // 更新上级选择状态
    loadAddModuleList();
    loadAddFunctionList();
    loadAddButtonList();
}

/**
 * 切换权限选择状态
 */
function togglePermission(permissionId, permissionName) {
    if (cascadeState.selectedPermissions.has(permissionId)) {
        cascadeState.selectedPermissions.delete(permissionId);
    } else {
        cascadeState.selectedPermissions.add(permissionId);
    }
    
    // 更新上级选择状态
    loadModuleList();
    loadFunctionList();
    loadButtonList();
    updateSelectedPermissionsPreview();
    
    // 更新权限预览
    updatePermissionPreview();
}

/**
 * 更新新增角色弹窗已选权限预览
 */
function updateAddSelectedPermissionsPreview() {
    const container = document.getElementById('addSelectedPermissionsList');
    
    if (addCascadeState.selectedPermissions.size === 0) {
        container.innerHTML = '<div class="text-gray-500 text-center py-4">暂未选择任何权限</div>';
        return;
    }
    
    let html = '<div class="space-y-1">';
    addCascadeState.selectedPermissions.forEach(permissionId => {
        const permissionInfo = getPermissionInfo(permissionId);
        if (permissionInfo) {
            html += `
                <div class="flex items-center justify-between bg-white p-2 rounded border">
                    <span class="text-sm">
                        <span class="text-blue-600">${permissionInfo.platform}</span> > 
                        <span class="text-green-600">${permissionInfo.module}</span> > 
                        <span class="text-yellow-600">${permissionInfo.function}</span> > 
                        <span class="text-gray-900">${permissionInfo.button}</span>
                    </span>
                    <button type="button" class="text-red-500 hover:text-red-700 text-xs" 
                            onclick="removeAddPermission('${permissionId}')">
                        移除
                    </button>
                </div>
            `;
        }
    });
    html += '</div>';
    
    container.innerHTML = html;
}

/**
 * 更新已选权限预览
 */
function updateSelectedPermissionsPreview() {
    const container = document.getElementById('selectedPermissionsList');
    
    if (cascadeState.selectedPermissions.size === 0) {
        container.innerHTML = '<div class="text-gray-500 text-center py-4">暂未选择任何权限</div>';
        return;
    }
    
    let html = '<div class="space-y-1">';
    cascadeState.selectedPermissions.forEach(permissionId => {
        const permissionInfo = getPermissionInfo(permissionId);
        if (permissionInfo) {
            html += `
                <div class="flex items-center justify-between bg-white p-2 rounded border">
                    <span class="text-sm">
                        <span class="text-blue-600">${permissionInfo.platform}</span> > 
                        <span class="text-green-600">${permissionInfo.module}</span> > 
                        <span class="text-yellow-600">${permissionInfo.function}</span> > 
                        <span class="text-gray-900">${permissionInfo.button}</span>
                    </span>
                    <button type="button" class="text-red-500 hover:text-red-700 text-xs" 
                            onclick="removePermission('${permissionId}')">
                        移除
                    </button>
                </div>
            `;
        }
    });
    html += '</div>';
    
    container.innerHTML = html;
}

/**
 * 获取权限信息
 */
function getPermissionInfo(permissionId) {
    for (const [platform, modules] of Object.entries(permissionsData)) {
        for (const module of modules) {
            for (const func of module.children || []) {
                for (const button of func.children || []) {
                    if (button.id === permissionId) {
                        return {
                            platform: platform === 'pc' ? 'PC中台' : '小程序',
                            module: module.name,
                            function: func.name,
                            button: button.name
                        };
                    }
                }
            }
        }
    }
    return null;
}

/**
 * 移除新增角色弹窗权限
 */
function removeAddPermission(permissionId) {
    addCascadeState.selectedPermissions.delete(permissionId);
    loadAddButtonList();
}

/**
 * 移除权限
 */
function removePermission(permissionId) {
    cascadeState.selectedPermissions.delete(permissionId);
    loadButtonList();
    updateSelectedPermissionsPreview();
}

/**
 * 渲染权限树（保留原有方法作为备用）
 */
function renderPermissionTree() {
    const container = document.getElementById('permissionContent');
    const permissions = permissionsData[currentPlatform] || [];
    
    container.innerHTML = `
        <div class="mb-4">
            <button onclick="selectAllPermissions()" class="text-sm text-blue-600 hover:text-blue-800 mr-4">
                <i class="fas fa-check-square mr-1"></i>全选
            </button>
            <button onclick="clearAllPermissions()" class="text-sm text-gray-600 hover:text-gray-800">
                <i class="fas fa-square mr-1"></i>清空
            </button>
        </div>
        <div class="space-y-2">
            ${renderPermissionNodes(permissions)}
        </div>
    `;
}

/**
 * 渲染权限节点（保留原有方法作为备用）
 */
function renderPermissionNodes(nodes, level = 0) {
    return nodes.map(node => {
        const hasChildren = node.children && node.children.length > 0;
        const indent = level * 20;
        
        return `
            <div style="margin-left: ${indent}px;">
                <label class="flex items-center py-1 hover:bg-gray-50 rounded px-2">
                    <input type="checkbox" 
                           class="tree-checkbox rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                           value="${node.id}"
                           onchange="handlePermissionChange('${node.id}', this.checked)">
                    ${hasChildren ? '<i class="fas fa-folder text-yellow-500 mr-2"></i>' : '<i class="fas fa-key text-blue-500 mr-2"></i>'}
                    <span class="text-sm text-gray-700">${node.name}</span>
                </label>
                ${hasChildren ? renderPermissionNodes(node.children, level + 1) : ''}
            </div>
        `;
    }).join('');
}

/**
 * 处理权限变更
 */
function handlePermissionChange(permissionId, checked) {
    // 这里可以添加权限继承逻辑
    console.log(`权限 ${permissionId} ${checked ? '选中' : '取消选中'}`);
}

/**
 * 全选权限
 */
function selectAllPermissions() {
    document.querySelectorAll('#permissionContent input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = true;
    });
}

/**
 * 清空权限
 */
function clearAllPermissions() {
    cascadeState.selectedPermissions.clear();
    loadModuleList();
    loadFunctionList();
    loadButtonList();
    updateSelectedPermissionsPreview();
    updatePermissionPreview();
}

/**
 * 选择当前平台所有模块
 */
function selectAllModules() {
    const modules = permissionsData[cascadeState.currentPlatform] || [];
    modules.forEach(module => {
        if (!module.children) return;
        module.children.forEach(func => {
            if (!func.children) return;
            func.children.forEach(button => {
                const permissionId = `${cascadeState.currentPlatform}_${module.id}_${func.id}_${button.id}`;
                cascadeState.selectedPermissions.add(permissionId);
            });
        });
    });
    
    loadModuleList();
    loadFunctionList();
    loadButtonList();
    updateSelectedPermissionsPreview();
}

/**
 * 清空当前平台所有模块
 */
function clearAllModules() {
    const modules = permissionsData[cascadeState.currentPlatform] || [];
    modules.forEach(module => {
        if (!module.children) return;
        module.children.forEach(func => {
            if (!func.children) return;
            func.children.forEach(button => {
                const permissionId = `${cascadeState.currentPlatform}_${module.id}_${func.id}_${button.id}`;
                cascadeState.selectedPermissions.delete(permissionId);
            });
        });
    });
    
    loadModuleList();
    loadFunctionList();
    loadButtonList();
    updateSelectedPermissionsPreview();
}

/**
 * 选择当前模块所有功能
 */
function selectAllFunctions() {
    if (!cascadeState.selectedModule) return;
    
    const modules = permissionsData[cascadeState.currentPlatform] || [];
    const module = modules.find(m => m.id === cascadeState.selectedModule);
    if (!module || !module.children) return;
    
    module.children.forEach(func => {
        if (!func.children) return;
        func.children.forEach(button => {
            const permissionId = `${cascadeState.currentPlatform}_${cascadeState.selectedModule}_${func.id}_${button.id}`;
            cascadeState.selectedPermissions.add(permissionId);
        });
    });
    
    loadModuleList();
    loadFunctionList();
    loadButtonList();
    updateSelectedPermissionsPreview();
}

/**
 * 清空当前模块所有功能
 */
function clearAllFunctions() {
    if (!cascadeState.selectedModule) return;
    
    const modules = permissionsData[cascadeState.currentPlatform] || [];
    const module = modules.find(m => m.id === cascadeState.selectedModule);
    if (!module || !module.children) return;
    
    module.children.forEach(func => {
        if (!func.children) return;
        func.children.forEach(button => {
            const permissionId = `${cascadeState.currentPlatform}_${cascadeState.selectedModule}_${func.id}_${button.id}`;
            cascadeState.selectedPermissions.delete(permissionId);
        });
    });
    
    loadModuleList();
    loadFunctionList();
    loadButtonList();
    updateSelectedPermissionsPreview();
}

/**
 * 选择当前功能所有按钮
 */
function selectAllButtons() {
    if (!cascadeState.selectedModule || !cascadeState.selectedFunction) return;
    
    const modules = permissionsData[cascadeState.currentPlatform] || [];
    const module = modules.find(m => m.id === cascadeState.selectedModule);
    if (!module) return;
    
    const func = module.children.find(f => f.id === cascadeState.selectedFunction);
    if (!func || !func.children) return;
    
    func.children.forEach(button => {
        const permissionId = `${cascadeState.currentPlatform}_${cascadeState.selectedModule}_${cascadeState.selectedFunction}_${button.id}`;
        cascadeState.selectedPermissions.add(permissionId);
    });
    
    loadModuleList();
    loadFunctionList();
    loadButtonList();
    updateSelectedPermissionsPreview();
}

/**
 * 新增角色弹窗 - 选择所有模块
 */
function selectAllAddModules() {
    const currentPlatform = addCascadeState.currentPlatform;
    const platformData = permissionsData[currentPlatform];
    if (!platformData) return;
    
    platformData.forEach(module => {
        if (module.children) {
            module.children.forEach(func => {
                if (func.children) {
                    func.children.forEach(button => {
                        addCascadeState.selectedPermissions.add(button.id);
                    });
                }
            });
        }
    });
    
    loadAddModuleList();
    loadAddFunctionList();
    loadAddButtonList();
}

/**
 * 新增角色弹窗 - 清空所有模块
 */
function clearAllAddModules() {
    const currentPlatform = addCascadeState.currentPlatform;
    const platformData = permissionsData[currentPlatform];
    if (!platformData) return;
    
    platformData.forEach(module => {
        if (module.children) {
            module.children.forEach(func => {
                if (func.children) {
                    func.children.forEach(button => {
                        addCascadeState.selectedPermissions.delete(button.id);
                    });
                }
            });
        }
    });
    
    loadAddModuleList();
    loadAddFunctionList();
    loadAddButtonList();
}

/**
 * 新增角色弹窗 - 选择所有功能
 */
function selectAllAddFunctions() {
    const selectedModule = addCascadeState.selectedModule;
    if (!selectedModule) {
        alert('请先选择模块');
        return;
    }
    
    const currentPlatform = addCascadeState.currentPlatform;
    const platformData = permissionsData[currentPlatform];
    if (!platformData) return;
    
    const module = platformData.find(m => m.id === selectedModule);
    if (!module || !module.children) return;
    
    module.children.forEach(func => {
        if (func.children) {
            func.children.forEach(button => {
                addCascadeState.selectedPermissions.add(button.id);
            });
        }
    });
    
    loadAddFunctionList();
    loadAddButtonList();
}

/**
 * 新增角色弹窗 - 清空所有功能
 */
function clearAllAddFunctions() {
    const selectedModule = addCascadeState.selectedModule;
    if (!selectedModule) {
        alert('请先选择模块');
        return;
    }
    
    const currentPlatform = addCascadeState.currentPlatform;
    const platformData = permissionsData[currentPlatform];
    if (!platformData) return;
    
    const module = platformData.find(m => m.id === selectedModule);
    if (!module || !module.children) return;
    
    module.children.forEach(func => {
        if (func.children) {
            func.children.forEach(button => {
                addCascadeState.selectedPermissions.delete(button.id);
            });
        }
    });
    
    loadAddFunctionList();
    loadAddButtonList();
}

/**
 * 新增角色弹窗 - 选择所有按钮权限
 */
function selectAllAddButtons() {
    const selectedModule = addCascadeState.selectedModule;
    const selectedFunction = addCascadeState.selectedFunction;
    
    if (!selectedModule || !selectedFunction) {
        alert('请先选择模块和功能');
        return;
    }
    
    const currentPlatform = addCascadeState.currentPlatform;
    const platformData = permissionsData[currentPlatform];
    if (!platformData) return;
    
    const module = platformData.find(m => m.id === selectedModule);
    if (!module) return;
    
    const func = module.children.find(f => f.id === selectedFunction);
    if (!func || !func.children) return;
    
    func.children.forEach(button => {
        addCascadeState.selectedPermissions.add(button.id);
    });
    
    loadAddButtonList();
}

/**
 * 新增角色弹窗 - 清空所有按钮权限
 */
function clearAllAddButtons() {
    const selectedModule = addCascadeState.selectedModule;
    const selectedFunction = addCascadeState.selectedFunction;
    
    if (!selectedModule || !selectedFunction) {
        alert('请先选择模块和功能');
        return;
    }
    
    const currentPlatform = addCascadeState.currentPlatform;
    const platformData = permissionsData[currentPlatform];
    if (!platformData) return;
    
    const module = platformData.find(m => m.id === selectedModule);
    if (!module) return;
    
    const func = module.children.find(f => f.id === selectedFunction);
    if (!func || !func.children) return;
    
    func.children.forEach(button => {
        addCascadeState.selectedPermissions.delete(button.id);
    });
    
    loadAddButtonList();
}

/**
 * 清空当前功能所有按钮
 */
function clearAllButtons() {
    if (!cascadeState.selectedModule || !cascadeState.selectedFunction) return;
    
    const modules = permissionsData[cascadeState.currentPlatform] || [];
    const module = modules.find(m => m.id === cascadeState.selectedModule);
    if (!module) return;
    
    const func = module.children.find(f => f.id === cascadeState.selectedFunction);
    if (!func || !func.children) return;
    
    func.children.forEach(button => {
        const permissionId = `${cascadeState.currentPlatform}_${cascadeState.selectedModule}_${cascadeState.selectedFunction}_${button.id}`;
        cascadeState.selectedPermissions.delete(permissionId);
    });
    
    loadModuleList();
    loadFunctionList();
    loadButtonList();
    updateSelectedPermissionsPreview();
}

/**
 * 保存新增角色
 */
function saveAddRole() {
    // 验证必填字段
    const roleName = document.getElementById('addRoleName').value.trim();
    if (!roleName) {
        alert('请输入角色名称');
        return;
    }
    
    // 收集表单数据
    const formData = {
        name: roleName,
        description: document.getElementById('addRoleDescription').value.trim(),
        platforms: ['pc', 'mobile'] // 默认支持所有平台
    };
    
    // 收集权限数据 - 使用新增角色弹窗的级联选择器权限
    const selectedPermissions = Array.from(addCascadeState.selectedPermissions);
    formData.permissions = selectedPermissions;
    
    // 新增角色
    const newRole = {
        id: Math.max(...rolesData.map(r => r.id)) + 1,
        ...formData,
        status: 'enabled',
        createTime: new Date().toLocaleString(),
        updateTime: new Date().toLocaleString(),
        userCount: 0,
        communityCount: 0
    };
    rolesData.push(newRole);
    totalRecords++;
    alert(`角色创建成功！已配置 ${selectedPermissions.length} 个权限。`);
    
    closeAddRoleModal();
    renderRoleTable();
    updateStatistics();
    updatePagination();
}

/**
 * 保存角色
 */
function saveRole() {
    // 验证必填字段
    const roleName = document.getElementById('roleName').value.trim();
    if (!roleName) {
        alert('请输入角色名称');
        return;
    }
    
    // 收集表单数据
    const formData = {
        name: roleName,
        description: document.getElementById('roleDescription').value.trim(),
        platforms: []
    };
    
    // 设置默认适用平台（适用平台选择功能已移除）
    formData.platforms = ['admin', 'pc', 'mobile'];
    
    // 收集权限数据 - 使用级联选择器的权限
    const selectedPermissions = Array.from(cascadeState.selectedPermissions);
    formData.permissions = selectedPermissions;
    
    // 模拟保存
    if (currentRoleId) {
        // 更新现有角色
        const roleIndex = rolesData.findIndex(r => r.id === currentRoleId);
        if (roleIndex !== -1) {
            rolesData[roleIndex] = { ...rolesData[roleIndex], ...formData, updateTime: new Date().toLocaleString() };
        }
        alert(`角色更新成功！已配置 ${selectedPermissions.length} 个权限。`);
    } else {
        // 新增角色
        const newRole = {
            id: Math.max(...rolesData.map(r => r.id)) + 1,
            ...formData,
            status: 'enabled',
            createTime: new Date().toLocaleString(),
            updateTime: new Date().toLocaleString(),
            userCount: 0,
            communityCount: 0
        };
        rolesData.push(newRole);
        totalRecords++;
        alert(`角色创建成功！已配置 ${selectedPermissions.length} 个权限。`);
    }
    
    closeRoleModal();
    renderRoleTable();
    updatePagination();
    updateStatistics();
}

/**
 * 保存权限配置
 */
function savePermissions() {
    // 获取级联选择器选中的权限
    const selectedPermissions = Array.from(cascadeState.selectedPermissions);
    
    // 更新角色权限
    const role = rolesData.find(r => r.id === currentRoleId);
    if (role) {
        role.permissions = selectedPermissions;
        role.updateTime = new Date().toLocaleString();
        
        // 重新渲染表格
        renderRoleTable();
        
        // 关闭弹窗
        closePermissionModal();
        
        // 显示成功消息
        alert(`权限配置保存成功！已配置 ${selectedPermissions.length} 个权限。`);
    }
}

/**
 * 加载角色权限（更新版本）
 */
function loadRolePermissions(role) {
    // 清空当前选择
    cascadeState.selectedPermissions.clear();
    
    // 如果角色有权限配置，则加载到选择器中
    if (role.permissions) {
        // 处理不同格式的权限数据
        if (Array.isArray(role.permissions)) {
            role.permissions.forEach(permissionId => {
                cascadeState.selectedPermissions.add(permissionId);
            });
        } else if (typeof role.permissions === 'object') {
            // 处理按平台分组的权限格式
            Object.values(role.permissions).forEach(platformPerms => {
                if (Array.isArray(platformPerms)) {
                    platformPerms.forEach(permissionId => {
                        cascadeState.selectedPermissions.add(permissionId);
                    });
                }
            });
        }
    }
    
    // 更新已选权限预览
    updateSelectedPermissionsPreview();
}

/**
 * 编辑角色
 */
function editRole(roleId) {
    openRoleModal(roleId);
}

/**
 * 配置权限
 */
function configPermissions(roleId) {
    currentRoleId = roleId;
    const role = rolesData.find(r => r.id === roleId);
    if (role) {
        // 直接打开权限配置弹窗
        openPermissionModal(roleId);
    }
}

/**
 * 分配用户
 */
/**
 * 分配用户
 */
function assignUsers(roleId) {
    // 先关闭所有弹窗
    closeAllModals();
    
    currentRoleId = roleId;
    
    // 显示用户分配模态框
    const modal = document.getElementById('userAssignModal');
    modal.style.display = 'block';
    
    setTimeout(() => {
        modal.classList.add('show');
        // 清空搜索框
        const searchInput = document.getElementById('userSearchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        // 渲染用户分配界面
        renderUserAssignment();
    }, 10);
}

/**
 * 关闭用户分配弹窗
 */
/**
 * 关闭用户分配弹窗
 */
function closeUserAssignModal() {
    const modal = document.getElementById('userAssignModal');
    modal.classList.remove('show');
    
    // 延时处理，确保动画完成后再清理
    setTimeout(() => {
        modal.style.display = 'none';
        currentRoleId = null;
        
        // 清空搜索框
        const searchInput = document.getElementById('userSearchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // 清空用户列表
        const availableList = document.getElementById('availableUsersList');
        const assignedList = document.getElementById('assignedUsersList');
        if (availableList) availableList.innerHTML = '';
        if (assignedList) assignedList.innerHTML = '';
        
        // 重置统计数字
        const availableCount = document.getElementById('availableUsersCount');
        const assignedCount = document.getElementById('assignedUsersCount');
        if (availableCount) availableCount.textContent = '0';
        if (assignedCount) assignedCount.textContent = '0';
    }, 300);
}

/**
 * 渲染用户分配界面
 */
/**
 * 渲染用户分配界面
 */
function renderUserAssignment() {
    const role = rolesData.find(r => r.id === currentRoleId);
    if (!role) return;
    
    const searchKeyword = document.getElementById('userSearchInput')?.value.toLowerCase() || '';
    
    const assignedUsers = usersData.filter(user => 
        user.roleIds.includes(currentRoleId) &&
        (user.name.toLowerCase().includes(searchKeyword) || 
         user.email.toLowerCase().includes(searchKeyword))
    );
    
    const availableUsers = usersData.filter(user => 
        !user.roleIds.includes(currentRoleId) &&
        (user.name.toLowerCase().includes(searchKeyword) || 
         user.email.toLowerCase().includes(searchKeyword))
    );
    
    // 渲染可分配用户
    const availableList = document.getElementById('availableUsersList');
    if (availableUsers.length === 0) {
        availableList.innerHTML = '<div class="text-gray-500 text-center py-4">暂无可分配用户</div>';
    } else {
        availableList.innerHTML = availableUsers.map(user => `
            <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <i class="fas fa-user text-gray-600 text-sm"></i>
                    </div>
                    <div>
                        <div class="text-sm font-medium text-gray-900">${user.name}</div>
                        <div class="text-xs text-gray-500">${user.email}</div>
                        <div class="text-xs text-gray-400">${user.department || '未设置部门'}</div>
                    </div>
                </div>
                <button onclick="assignUserToRole(${user.id})" class="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded hover:bg-blue-50">
                    <i class="fas fa-plus"></i> 分配
                </button>
            </div>
        `).join('');
    }
    
    // 渲染已分配用户
    const assignedList = document.getElementById('assignedUsersList');
    if (assignedUsers.length === 0) {
        assignedList.innerHTML = '<div class="text-gray-500 text-center py-4">暂无已分配用户</div>';
    } else {
        assignedList.innerHTML = assignedUsers.map(user => `
            <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <i class="fas fa-user text-green-600 text-sm"></i>
                    </div>
                    <div>
                        <div class="text-sm font-medium text-gray-900">${user.name}</div>
                        <div class="text-xs text-gray-500">${user.email}</div>
                        <div class="text-xs text-gray-400">${user.department || '未设置部门'}</div>
                    </div>
                </div>
                <button onclick="removeUserFromRole(${user.id})" class="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50">
                    <i class="fas fa-minus"></i> 移除
                </button>
            </div>
        `).join('');
    }
    
    // 更新统计信息
    document.getElementById('availableUsersCount').textContent = availableUsers.length;
    document.getElementById('assignedUsersCount').textContent = assignedUsers.length;
}

/**
 * 搜索用户
 */
function searchUsers() {
    renderUserAssignment();
}

/**
 * 清空搜索
 */
function clearUserSearch() {
    document.getElementById('userSearchInput').value = '';
    renderUserAssignment();
}

/**
 * 分配用户到角色
 */
function assignUserToRole(userId) {
    const user = usersData.find(u => u.id === userId);
    if (user && !user.roleIds.includes(currentRoleId)) {
        user.roleIds.push(currentRoleId);
        renderUserAssignment();
    }
}

/**
 * 从角色中移除用户
 */
function removeUserFromRole(userId) {
    const user = usersData.find(u => u.id === userId);
    if (user) {
        user.roleIds = user.roleIds.filter(id => id !== currentRoleId);
        renderUserAssignment();
    }
}

/**
 * 保存用户分配
 */
function saveUserAssignment() {
    // 更新角色的用户数量
    const role = rolesData.find(r => r.id === currentRoleId);
    if (role) {
        role.userCount = usersData.filter(user => user.roleIds.includes(currentRoleId)).length;
    }
    
    closeUserAssignModal();
    renderRoleTable();
    updateStatistics();
    alert('用户分配保存成功！');
}

/**
 * 更新权限预览区域
 */
function updatePermissionPreview() {
    const previewContainer = document.getElementById('selectedPermissionPreview');
    const countElement = document.getElementById('selectedPermissionCount');
    
    if (!previewContainer || !countElement) return;
    
    const selectedPermissions = Array.from(cascadeState.selectedPermissions);
    const count = selectedPermissions.length;
    
    // 更新计数
    countElement.textContent = `已选择 ${count} 个权限`;
    
    if (count === 0) {
        previewContainer.innerHTML = '<div class="text-gray-500 text-sm text-center py-8">暂未选择任何权限</div>';
        return;
    }
    
    // 按平台分组显示权限
    const permissionsByPlatform = {};
    
    selectedPermissions.forEach(permissionId => {
        const parts = permissionId.split('_');
        if (parts.length >= 4) {
            const platform = parts[0];
            const module = parts[1];
            const func = parts[2];
            const button = parts[3];
            
            if (!permissionsByPlatform[platform]) {
                permissionsByPlatform[platform] = {};
            }
            if (!permissionsByPlatform[platform][module]) {
                permissionsByPlatform[platform][module] = {};
            }
            if (!permissionsByPlatform[platform][module][func]) {
                permissionsByPlatform[platform][module][func] = [];
            }
            
            // 获取权限名称
            const platformData = permissionsData[platform];
            if (platformData) {
                const moduleData = platformData.find(m => m.id === module);
                if (moduleData) {
                    const funcData = moduleData.children.find(f => f.id === func);
                    if (funcData) {
                        const buttonData = funcData.children.find(b => b.id === button);
                        if (buttonData) {
                            permissionsByPlatform[platform][module][func].push({
                                id: button,
                                name: buttonData.name,
                                moduleName: moduleData.name,
                                funcName: funcData.name
                            });
                        }
                    }
                }
            }
        }
    });
    
    // 生成预览HTML
    let html = '';
    const platformNames = {
        'admin': '总后台',
        'pc': 'PC中台',
        'mobile': '小程序端'
    };
    
    Object.keys(permissionsByPlatform).forEach(platform => {
        const platformName = platformNames[platform] || platform;
        html += `<div class="mb-4">`;
        html += `<h6 class="text-sm font-semibold text-gray-800 mb-2 flex items-center">`;
        html += `<i class="fas fa-${platform === 'pc' ? 'desktop' : 'mobile-alt'} mr-2 text-blue-600"></i>${platformName}</h6>`;
        
        Object.keys(permissionsByPlatform[platform]).forEach(moduleKey => {
            const modulePermissions = permissionsByPlatform[platform][moduleKey];
            Object.keys(modulePermissions).forEach(funcKey => {
                const buttons = modulePermissions[funcKey];
                if (buttons.length > 0) {
                    html += `<div class="ml-4 mb-2">`;
                    html += `<div class="text-xs text-gray-600 mb-1">${buttons[0].moduleName} > ${buttons[0].funcName}</div>`;
                    html += `<div class="flex flex-wrap gap-1">`;
                    buttons.forEach(button => {
                        html += `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">`;
                        html += `${button.name}`;
                        html += `<button onclick="removePermission('${platform}_${moduleKey}_${funcKey}_${button.id}')" class="ml-1 text-blue-600 hover:text-blue-800">`;
                        html += `<i class="fas fa-times text-xs"></i>`;
                        html += `</button>`;
                        html += `</span>`;
                    });
                    html += `</div></div>`;
                }
            });
        });
        
        html += `</div>`;
    });
    
    previewContainer.innerHTML = html;
}

/**
 * 从预览中移除权限
 */
function removePermission(permissionId) {
    cascadeState.selectedPermissions.delete(permissionId);
    
    // 更新界面
    loadModuleList();
    loadFunctionList();
    loadButtonList();
    updateSelectedPermissionsPreview();
    updatePermissionPreview();
}

/**
 * 切换角色状态
 */
function toggleRoleStatus(roleId) {
    const role = rolesData.find(r => r.id === roleId);
    if (role) {
        const newStatus = role.status === 'enabled' ? 'disabled' : 'enabled';
        const action = newStatus === 'enabled' ? '启用' : '停用';
        
        if (confirm(`确定要${action}角色"${role.name}"吗？`)) {
            role.status = newStatus;
            role.updateTime = new Date().toLocaleString();
            
            // 更新滑块状态
            const switchContainer = document.getElementById(`toggle-role-${roleId}`);
            if (switchContainer) {
                const switchElement = switchContainer.querySelector('input[type="checkbox"]');
                if (switchElement) {
                    switchElement.checked = newStatus === 'enabled';
                    // 触发滑块视觉更新
                    switchElement.dispatchEvent(new Event('change'));
                }
            }
            
            updateStatistics();
            alert(`角色${action}成功！`);
        } else {
            // 用户取消操作，需要恢复滑块状态
            const switchContainer = document.getElementById(`toggle-role-${roleId}`);
            if (switchContainer) {
                const switchElement = switchContainer.querySelector('input[type="checkbox"]');
                if (switchElement) {
                    switchElement.checked = role.status === 'enabled';
                    // 触发滑块视觉更新
                    switchElement.dispatchEvent(new Event('change'));
                }
            }
        }
    }
}

/**
 * 导出角色数据
 */
function exportRoles() {
    const exportData = rolesData.map(role => ({
        角色名称: role.name,
        角色类型: role.type,
        角色描述: role.description,
        用户数量: role.userCount,
        适用平台: role.applicablePlatforms.join(', '),
        数据权限: role.dataScope,
        关联小区: role.communityCount,
        状态: role.status,
        创建时间: role.createTime,
        更新时间: role.updateTime
    }));
    
    // 模拟导出
    console.log('导出数据:', exportData);
    alert('角色数据导出成功！');
}

// 点击模态框外部关闭
document.addEventListener('click', function(e) {
    const modals = ['roleModal', 'permissionModal', 'userAssignModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (e.target === modal && modal.classList.contains('show')) {
            modal.classList.remove('show');
            // 如果关闭的是权限配置或用户分配弹窗，清空当前角色ID
            if (modalId === 'permissionModal' || modalId === 'userAssignModal') {
                currentRoleId = null;
            }
        }
    });
});

// ESC键关闭弹窗
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modals = ['roleModal', 'permissionModal', 'userAssignModal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal.classList.contains('show')) {
                modal.classList.remove('show');
                if (modalId === 'permissionModal' || modalId === 'userAssignModal') {
                    currentRoleId = null;
                }
            }
        });
    }
});
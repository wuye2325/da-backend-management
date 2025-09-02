/**
 * 首页仪表板页面脚本
 * @author AI Assistant
 * @description 初始化首页仪表板的所有功能模块，包括筛选控件、图表和数据更新
 */

// 导入筛选控件组件
import { initFilterControls, getCurrentFilters, resetFilters } from '../components/filter-controls.js';

/**
 * 页面初始化函数
 * @description 当DOM加载完成后执行所有初始化操作
 */
function initDashboard() {
    console.log('初始化首页仪表板...');
    
    try {
        // 初始化筛选控件
        initFilterControls();
        
        // 设置筛选事件监听
        setupFilterEventListeners();
        
        // 初始化数据刷新
        setupDataRefresh();
        
        // 延迟初始化图表，确保DOM完全加载
        setTimeout(() => {
            initCharts();
        }, 200);
        
        console.log('首页仪表板初始化完成');
    } catch (error) {
        console.error('首页仪表板初始化失败:', error);
    }
}

/**
 * 设置筛选事件监听器
 * @description 监听筛选条件变化，更新页面数据
 */
function setupFilterEventListeners() {
    // 监听筛选应用事件
    document.addEventListener('filtersApplied', (event) => {
        const filters = event.detail;
        console.log('收到筛选应用事件:', filters);
        
        // 更新所有图表数据
        updateDashboardData(filters);
    });
    
    // 设置重置按钮事件监听器
    const resetFiltersBtn = document.getElementById('resetFilters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            console.log('重置筛选条件');
            
            // 添加加载状态
            resetFiltersBtn.disabled = true;
            resetFiltersBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>重置中...';
            
            // 调用重置函数
            resetFilters();
            
            // 模拟重置延迟
            setTimeout(() => {
                // 恢复按钮状态
                resetFiltersBtn.disabled = false;
                resetFiltersBtn.innerHTML = '<i class="fas fa-undo mr-2"></i>重置';
                
                // 显示重置成功通知
                showResetNotification();
                
                // 使用重置后的筛选条件更新数据
                const currentFilters = getCurrentFilters();
                updateDashboardData(currentFilters);
                
                console.log('筛选条件重置完成');
            }, 500);
        });
    }
}

/**
 * 更新仪表板数据
 * @param {Object} filters - 筛选条件
 * @description 根据筛选条件更新所有图表和统计数据
 */
function updateDashboardData(filters) {
    console.log('更新仪表板数据:', filters);
    
    // 显示加载状态
    showLoadingState();
    
    // 模拟API调用延迟
    setTimeout(() => {
        try {
            // 更新业主认证率数据
            updateOwnerAuthChart(filters);
            
            // 更新活跃度分布数据
            updateActivityDistribution(filters);
            
            // 更新发帖类型统计
            updatePostTypeStats(filters);
            
            // 更新用户活动数据
            updateUserActivityData(filters);
            
            // 更新流失分析数据
            updateChurnAnalysisData(filters);
            
            // 隐藏加载状态
            hideLoadingState();
            
            console.log('仪表板数据更新完成');
        } catch (error) {
            console.error('数据更新失败:', error);
            hideLoadingState();
        }
    }, 1000);
}

/**
 * 显示加载状态
 */
function showLoadingState() {
    // 为所有图表容器添加加载遮罩
    const chartContainers = document.querySelectorAll('.chart-container, [class*="chart"]');
    
    chartContainers.forEach(container => {
        if (container.querySelector('.loading-overlay')) return;
        
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10';
        overlay.innerHTML = `
            <div class="flex flex-col items-center">
                <i class="fas fa-spinner fa-spin text-2xl text-blue-600 mb-2"></i>
                <span class="text-sm text-gray-600">数据加载中...</span>
            </div>
        `;
        
        container.style.position = 'relative';
        container.appendChild(overlay);
    });
}

/**
 * 隐藏加载状态
 */
function hideLoadingState() {
    const overlays = document.querySelectorAll('.loading-overlay');
    overlays.forEach(overlay => {
        overlay.remove();
    });
}

/**
 * 显示重置成功通知
 * @description 显示筛选条件重置成功的提示信息
 */
function showResetNotification() {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center';
    notification.innerHTML = `
        <i class="fas fa-undo mr-2"></i>
        <span>筛选条件已重置</span>
    `;
    
    document.body.appendChild(notification);
    
    // 添加进入动画
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.3s ease-out';
    
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}



/**
 * 更新业主认证率图表
 * @param {Object} filters - 筛选条件
 */
function updateOwnerAuthChart(filters) {
    // 模拟根据筛选条件生成不同的数据
    const mockData = generateMockAuthData(filters);
    
    // 这里应该调用实际的图表更新方法
    console.log('更新业主认证率图表:', mockData);
    
    // 如果图表实例存在，更新数据
    if (window.ownerAuthChart) {
        window.ownerAuthChart.data.datasets[0].data = mockData.values;
        window.ownerAuthChart.data.labels = mockData.labels;
        window.ownerAuthChart.update();
    }
}

/**
 * 更新活跃度分布数据
 * @param {Object} filters - 筛选条件
 */
function updateActivityDistribution(filters) {
    const mockData = generateMockActivityData(filters);
    console.log('更新活跃度分布:', mockData);
    
    // 更新页面上的数字显示
    const elements = {
        dailyActive: document.querySelector('[data-metric="daily-active"]'),
        monthlyActive: document.querySelector('[data-metric="monthly-active"]'),
        growthRate: document.querySelector('[data-metric="growth-rate"]')
    };
    
    if (elements.dailyActive) {
        elements.dailyActive.textContent = mockData.dailyActive.toLocaleString();
    }
    if (elements.monthlyActive) {
        elements.monthlyActive.textContent = mockData.monthlyActive.toLocaleString();
    }
    if (elements.growthRate) {
        elements.growthRate.textContent = `+${mockData.growthRate}%`;
    }
}

/**
 * 更新发帖类型统计
 * @param {Object} filters - 筛选条件
 */
function updatePostTypeStats(filters) {
    const mockData = generateMockPostTypeData(filters);
    console.log('更新发帖类型统计:', mockData);
}

/**
 * 更新用户活动数据
 * @param {Object} filters - 筛选条件
 */
function updateUserActivityData(filters) {
    const mockData = generateMockUserActivityData(filters);
    console.log('更新用户活动数据:', mockData);
}

/**
 * 更新流失分析数据
 * @param {Object} filters - 筛选条件
 */
function updateChurnAnalysisData(filters) {
    const mockData = generateMockChurnData(filters);
    console.log('更新流失分析数据:', mockData);
}

/**
 * 生成模拟认证数据
 * @param {Object} filters - 筛选条件
 * @returns {Object} 模拟数据
 */
function generateMockAuthData(filters) {
    const baseData = [65, 70, 75, 80, 78, 82, 85];
    const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    
    // 根据小区调整数据
    const communityMultiplier = filters.community === 'all' ? 1 : Math.random() * 0.3 + 0.85;
    const adjustedData = baseData.map(value => Math.round(value * communityMultiplier));
    
    return { values: adjustedData, labels };
}

/**
 * 生成模拟活跃度数据
 * @param {Object} filters - 筛选条件
 * @returns {Object} 模拟数据
 */
function generateMockActivityData(filters) {
    const baseDaily = 3245;
    const baseMonthly = 8967;
    const baseGrowth = 8.3;
    
    // 根据筛选条件调整数据
    const multiplier = filters.community === 'all' ? 1 : Math.random() * 0.5 + 0.7;
    
    return {
        dailyActive: Math.round(baseDaily * multiplier),
        monthlyActive: Math.round(baseMonthly * multiplier),
        growthRate: (baseGrowth * multiplier).toFixed(1)
    };
}

/**
 * 生成模拟发帖类型数据
 * @param {Object} filters - 筛选条件
 * @returns {Object} 模拟数据
 */
function generateMockPostTypeData(filters) {
    return {
        community: Math.floor(Math.random() * 100 + 50),
        maintenance: Math.floor(Math.random() * 80 + 30),
        complaint: Math.floor(Math.random() * 60 + 20),
        suggestion: Math.floor(Math.random() * 40 + 15)
    };
}

/**
 * 生成模拟用户活动数据
 * @param {Object} filters - 筛选条件
 * @returns {Object} 模拟数据
 */
function generateMockUserActivityData(filters) {
    return {
        posts: Math.floor(Math.random() * 500 + 200),
        comments: Math.floor(Math.random() * 1000 + 500),
        likes: Math.floor(Math.random() * 2000 + 1000)
    };
}

/**
 * 生成模拟流失数据
 * @param {Object} filters - 筛选条件
 * @returns {Object} 模拟数据
 */
function generateMockChurnData(filters) {
    return {
        totalChurn: Math.floor(Math.random() * 500 + 1000),
        churnRate: (Math.random() * 5 + 10).toFixed(1)
    };
}

/**
 * 设置数据自动刷新
 */
function setupDataRefresh() {
    // 每5分钟自动刷新一次数据
    setInterval(() => {
        const currentFilters = getCurrentFilters();
        console.log('自动刷新数据...');
        updateDashboardData(currentFilters);
    }, 5 * 60 * 1000); // 5分钟
}

/**
 * 初始化图表（保持原有的图表初始化逻辑）
 */
function initCharts() {
    // 调用HTML中定义的内联图表初始化函数
    if (typeof window.initInlineCharts === 'function') {
        console.log('初始化图表...');
        window.initInlineCharts();
    }
}

/**
 * 初始化页面布局
 */
function initPageLayout() {
    // 调用HTML中定义的页面初始化函数
    if (typeof window.initPageFunction === 'function') {
        window.initPageFunction();
    }
}

// 当DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 先初始化页面布局
    initPageLayout();
    
    // 然后初始化仪表板功能
    setTimeout(() => {
        initDashboard();
    }, 100);
});

// 导出主要函数供其他模块使用
export { initDashboard, updateDashboardData };
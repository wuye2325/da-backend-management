/**
 * 筛选控件组件 - 处理小区名称搜索和时间范围筛选功能
 * @author AI Assistant
 * @description 提供下拉搜索框交互、筛选状态管理和数据更新功能
 */

// 小区数据配置
const COMMUNITY_DATA = [
    { value: 'all', name: '全部小区', icon: 'fas fa-globe', color: 'text-blue-600' },
    { value: 'sunshine-garden', name: '阳光花园小区', icon: 'fas fa-building', color: 'text-green-600' },
    { value: 'golden-coast', name: '金色海岸小区', icon: 'fas fa-building', color: 'text-yellow-600' },
    { value: 'green-valley', name: '绿谷家园小区', icon: 'fas fa-building', color: 'text-emerald-600' },
    { value: 'blue-sky', name: '蓝天雅苑小区', icon: 'fas fa-building', color: 'text-sky-600' },
    { value: 'peaceful-home', name: '安居家园小区', icon: 'fas fa-building', color: 'text-purple-600' }
];

// 当前筛选状态
let currentFilters = {
    communities: ['all'] // 改为数组支持多选
};

/**
 * 初始化筛选控件功能
 * @description 设置所有交互事件监听器和初始状态
 */
export function initFilterControls() {
    console.log('初始化筛选控件...');
    
    // 获取DOM元素
    const communitySearch = document.getElementById('communitySearch');
    const communityDropdown = document.getElementById('communityDropdown');
    const communityDropdownIcon = document.getElementById('communityDropdownIcon');
    const applyFiltersBtn = document.getElementById('applyFilters');
    
    if (!communitySearch || !communityDropdown) {
        console.error('筛选控件DOM元素未找到');
        return;
    }
    
    // 初始化事件监听器
    setupSearchInput(communitySearch, communityDropdown);
    setupDropdownToggle(communitySearch, communityDropdown, communityDropdownIcon);
    setupOptionSelection(communitySearch, communityDropdown);
    setupApplyFilters(applyFiltersBtn);
    setupClickOutside(communityDropdown);
    
    // 初始化UI状态
    updateCheckboxStates();
    updateSearchInputDisplay(communitySearch);
    updateFilterStatus();
    updateSelectedTags();
    
    console.log('筛选控件初始化完成');
}

/**
 * 设置搜索输入框功能
 * @param {HTMLElement} searchInput - 搜索输入框元素
 * @param {HTMLElement} dropdown - 下拉列表元素
 */
function setupSearchInput(searchInput, dropdown) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterCommunityOptions(searchTerm);
        
        // 显示下拉列表
        if (!dropdown.classList.contains('hidden')) {
            return;
        }
        showDropdown(dropdown);
    });
    
    // 获得焦点时显示下拉列表
    searchInput.addEventListener('focus', () => {
        showDropdown(dropdown);
    });
}

/**
 * 设置下拉列表切换功能
 * @param {HTMLElement} searchInput - 搜索输入框元素
 * @param {HTMLElement} dropdown - 下拉列表元素
 * @param {HTMLElement} icon - 下拉图标元素
 */
function setupDropdownToggle(searchInput, dropdown, icon) {
    if (!icon) return;
    
    icon.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (dropdown.classList.contains('hidden')) {
            showDropdown(dropdown);
            searchInput.focus();
        } else {
            hideDropdown(dropdown);
        }
    });
}

/**
 * 设置选项选择功能
 * @param {HTMLElement} searchInput - 搜索输入框元素
 * @param {HTMLElement} dropdown - 下拉列表元素
 */
function setupOptionSelection(searchInput, dropdown) {
    dropdown.addEventListener('click', (e) => {
        const option = e.target.closest('.community-option');
        if (!option) return;
        
        const value = option.dataset.value;
        const community = COMMUNITY_DATA.find(c => c.value === value);
        
        if (community) {
            // 处理多选逻辑
            if (value === 'all') {
                // 选择"全部小区"时，清空其他选择
                currentFilters.communities = ['all'];
            } else {
                // 移除"全部小区"选项（如果存在）
                const allIndex = currentFilters.communities.indexOf('all');
                if (allIndex > -1) {
                    currentFilters.communities.splice(allIndex, 1);
                }
                
                // 切换选择状态
                const index = currentFilters.communities.indexOf(value);
                if (index > -1) {
                    // 取消选择
                    currentFilters.communities.splice(index, 1);
                } else {
                    // 添加选择
                    currentFilters.communities.push(value);
                }
                
                // 如果没有选择任何小区，默认选择"全部小区"
                if (currentFilters.communities.length === 0) {
                    currentFilters.communities = ['all'];
                }
            }
            
            // 更新复选框状态
            updateCheckboxStates();
            
            // 更新输入框显示
            updateSearchInputDisplay(searchInput);
            
            // 更新筛选状态显示
            updateFilterStatus();
            updateSelectedTags();
            
            console.log('当前选择的小区:', currentFilters.communities);
        }
    });
}



/**
 * 设置应用筛选按钮功能
 * @param {HTMLElement} applyBtn - 应用筛选按钮元素
 */
function setupApplyFilters(applyBtn) {
    if (!applyBtn) return;
    
    applyBtn.addEventListener('click', () => {
        // 添加加载状态
        applyBtn.disabled = true;
        applyBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>应用中...';
        
        // 模拟API调用
        setTimeout(() => {
            // 触发数据更新事件
            const filterEvent = new CustomEvent('filtersApplied', {
                detail: { ...currentFilters }
            });
            document.dispatchEvent(filterEvent);
            
            // 恢复按钮状态
            applyBtn.disabled = false;
            applyBtn.innerHTML = '<i class="fas fa-check mr-2"></i>应用筛选';
            
            // 显示成功提示
            showFilterAppliedNotification();
            
            console.log('筛选已应用:', currentFilters);
        }, 800);
    });
}

/**
 * 设置点击外部区域关闭下拉列表
 * @param {HTMLElement} dropdown - 下拉列表元素
 */
function setupClickOutside(dropdown) {
    document.addEventListener('click', (e) => {
        const searchContainer = e.target.closest('.relative');
        if (!searchContainer || !searchContainer.contains(dropdown)) {
            hideDropdown(dropdown);
        }
    });
}

/**
 * 更新复选框状态
 */
function updateCheckboxStates() {
    const options = document.querySelectorAll('.community-option');
    options.forEach(option => {
        const value = option.dataset.value;
        const isSelected = currentFilters.communities.includes(value);
        
        // 查找或创建复选框
        let checkbox = option.querySelector('.community-checkbox');
        if (!checkbox) {
            checkbox = document.createElement('i');
            checkbox.className = 'community-checkbox fas fa-square-check text-blue-600 mr-2';
            option.insertBefore(checkbox, option.firstChild);
        }
        
        // 更新复选框状态
        if (isSelected) {
            checkbox.className = 'community-checkbox fas fa-square-check text-blue-600 mr-2';
            option.classList.add('bg-blue-50');
        } else {
            checkbox.className = 'community-checkbox far fa-square text-gray-400 mr-2';
            option.classList.remove('bg-blue-50');
        }
    });
}

/**
 * 更新搜索输入框显示
 * @param {HTMLElement} searchInput - 搜索输入框元素
 */
function updateSearchInputDisplay(searchInput) {
    const selectedCommunities = currentFilters.communities.map(value => {
        const community = COMMUNITY_DATA.find(c => c.value === value);
        return community ? community.name : value;
    });
    
    if (selectedCommunities.includes('全部小区')) {
        searchInput.value = '全部小区';
    } else if (selectedCommunities.length === 1) {
        searchInput.value = selectedCommunities[0];
    } else {
        searchInput.value = `已选择 ${selectedCommunities.length} 个小区`;
    }
}

/**
 * 更新已选择小区标签显示
 */
function updateSelectedTags() {
    const tagsContainer = document.getElementById('selectedCommunitiesTags');
    if (!tagsContainer) return;
    
    // 清空现有标签
    tagsContainer.innerHTML = '';
    
    // 如果选择了全部小区，不显示标签
    if (currentFilters.communities.includes('all')) {
        return;
    }
    
    // 为每个选中的小区创建标签
    currentFilters.communities.forEach(communityValue => {
        const community = COMMUNITY_DATA.find(c => c.value === communityValue);
        if (!community) return;
        
        const tag = document.createElement('div');
        tag.className = 'inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200';
        tag.innerHTML = `
            <i class="${community.icon} mr-2" style="color: ${community.color}"></i>
            <span>${community.name}</span>
            <button type="button" class="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none" 
                    onclick="removeCommunityTag('${communityValue}')">
                <i class="fas fa-times text-xs"></i>
            </button>
        `;
        
        tagsContainer.appendChild(tag);
    });
}

/**
 * 移除指定小区标签
 * @param {string} communityValue - 要移除的小区值
 */
window.removeCommunityTag = function(communityValue) {
    // 从选择列表中移除该小区
    currentFilters.communities = currentFilters.communities.filter(value => value !== communityValue);
    
    // 如果没有选择任何小区，默认选择全部小区
    if (currentFilters.communities.length === 0) {
        currentFilters.communities = ['all'];
    }
    
    // 更新UI显示
    const communitySearch = document.getElementById('communitySearch');
    updateCheckboxStates();
    updateSearchInputDisplay(communitySearch);
    updateFilterStatus();
    updateSelectedTags();
    
    console.log('移除小区后的选择:', currentFilters.communities);
}

/**
 * 根据搜索词过滤小区选项
 * @param {string} searchTerm - 搜索关键词
 */
function filterCommunityOptions(searchTerm) {
    const options = document.querySelectorAll('.community-option');
    
    options.forEach(option => {
        const text = option.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            option.style.display = 'block';
        } else {
            option.style.display = 'none';
        }
    });
}

/**
 * 显示下拉列表
 * @param {HTMLElement} dropdown - 下拉列表元素
 */
function showDropdown(dropdown) {
    dropdown.classList.remove('hidden');
    
    // 添加动画效果
    dropdown.style.opacity = '0';
    dropdown.style.transform = 'translateY(-10px)';
    
    requestAnimationFrame(() => {
        dropdown.style.transition = 'all 0.2s ease-out';
        dropdown.style.opacity = '1';
        dropdown.style.transform = 'translateY(0)';
    });
}

/**
 * 隐藏下拉列表
 * @param {HTMLElement} dropdown - 下拉列表元素
 */
function hideDropdown(dropdown) {
    dropdown.style.transition = 'all 0.15s ease-in';
    dropdown.style.opacity = '0';
    dropdown.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        dropdown.classList.add('hidden');
        dropdown.style.transition = '';
    }, 150);
}

/**
 * 更新筛选状态显示
 */
function updateFilterStatus() {
    // 注释：currentCommunity元素已从HTML中移除，避免与标签重复显示
    // const currentCommunityEl = document.getElementById('currentCommunity');
    
    // if (currentCommunityEl) {
    //     const selectedCommunities = currentFilters.communities.map(value => {
    //         const community = COMMUNITY_DATA.find(c => c.value === value);
    //         return community ? community.name : value;
    //     });
    //     
    //     if (selectedCommunities.includes('全部小区')) {
    //         currentCommunityEl.textContent = '全部小区';
    //     } else if (selectedCommunities.length === 1) {
    //         currentCommunityEl.textContent = selectedCommunities[0];
    //     } else {
    //         currentCommunityEl.textContent = `${selectedCommunities.join('、')}`;
    //     }
    // }
}

/**
 * 显示筛选应用成功通知
 */
function showFilterAppliedNotification() {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center';
    notification.innerHTML = `
        <i class="fas fa-check-circle mr-2"></i>
        <span>筛选条件已应用</span>
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
 * 获取当前筛选状态
 * @returns {Object} 当前筛选条件
 */
export function getCurrentFilters() {
    return { ...currentFilters };
}

/**
 * 重置筛选条件
 */
export function resetFilters() {
    currentFilters = {
        communities: ['all']
    };
    
    // 重置UI状态
    const communitySearch = document.getElementById('communitySearch');
    
    if (communitySearch) {
        communitySearch.value = '全部小区';
    }
    
    // 更新复选框状态
    updateCheckboxStates();
    updateFilterStatus();
    updateSelectedTags();
    console.log('筛选条件已重置');
}
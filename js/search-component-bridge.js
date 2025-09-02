/**
 * 搜索组件桥接脚本
 * 将组件导入并暴露到全局作用域
 */

// 动态导入SearchComponent
import('./search-component.js')
    .then(() => {
        // 组件已经通过全局作用域暴露，无需额外操作
        console.log('SearchComponent bridge loaded successfully');
    })
    .catch(error => {
        console.error('Failed to load SearchComponent:', error);
    });
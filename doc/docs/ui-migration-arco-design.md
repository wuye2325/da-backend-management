# UI 设计系统迁移方案：shadcn/ui → Arco Design

## 1. 目标
将项目 UI 框架从 `shadcn/ui` + `Tailwind CSS` 迁移至 `@arco-design/web-react`，统一设计语言，提升开发效率与一致性。

## 2. 技术栈变更
| 类别 | 原方案 | 新方案 |
|------|-------|-------|
| UI 组件库 | `shadcn/ui`, `Radix UI` | `@arco-design/web-react` |
| 图标库 | `lucide-react` | `@arco-design/web-react/icon` |
| 主题系统 | 手动 `light`/`dark` 类 | Arco `ConfigProvider` + `theme` |
| 样式机制 | Tailwind 原子类 | Arco 预设类 + 少量 Tailwind 布局类 |

## 3. 迁移步骤
1. **安装依赖**
   ```bash
   pnpm add @arco-design/web-react @arco-design/web-react/icon
   ```

2. **引入全局样式**
   在 `src/index.css` 或入口文件中：
   ```css
   @import '@arco-design/web-react/dist/css/arco.css';
   ```

3. **集成 ConfigProvider**
   在 `main.tsx` 中包裹应用：
   ```tsx
   import { ConfigProvider } from '@arco-design/web-react';
   import { useTheme } from './hooks/useTheme';

   function AppWrapper() {
     const { theme, isDark } = useTheme();
     
     return (
       <ConfigProvider theme={isDark ? 'dark' : 'light'}>
         <App />
       </ConfigProvider>
     );
   }
   ```

4. **组件迁移顺序**
   优先级从高到低：
   - `TopNavigation`, `BottomNavigation`
   - `Button`, `Card`, `Badge`, `Skeleton`
   - `EventCard`, `EventList`
   - `Suggestion` 系列组件
   - `Workflow` 组件
   - `Create` 流程
   - `ApprovalCenter`, `AuthCallback`

5. **图标替换映射**
   | lucide | Arco Icon |
   |--------|-----------|
   | `Search` | `IconSearch` |
   | `Bell` | `IconNotification` |
   | `List` | `IconList` |
   | `Image` | `IconImage` |
   | `ArrowLeft` | `IconLeft` |
   | `ArrowRight` | `IconRight` |
   | `Trash` | `IconDelete` |
   | `Edit` | `IconEdit` |
   | `Plus` | `IconPlus` |
   | `Settings` | `IconSetting` |

## 4. 测试策略
- 单元测试：确保组件 props 传递正确
- 视觉回归：对比迁移前后截图
- 交互测试：确保所有点击事件正常
- 主题切换：验证 light/dark 模式正常工作

## 5. 风险与应对
- **样式冲突**：Arco 的 CSS 可能与现有 Tailwind 冲突 → 使用 `!important` 或 CSS 优先级控制
- **包体积增大**：Arco 是完整库 → 后期引入按需加载（babel 插件或 vite 插件）
- **自定义样式丢失**：保留必要的 Tailwind 布局类（如 `flex`, `px-4`, `max-w-md`）

## 6. 验收标准
- 所有 shadcn/ui 组件被 Arco 组件替代
- 主题切换功能正常
- 无明显样式损坏或布局错乱
- 通过现有测试用例
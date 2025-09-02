# 审批流程系统开发 TODO 清单

## 当前状态
✅ 已完成：
- 核心组件架构设计
- useApprovalFlow.ts 类型定义更新
- workflowTemplates 业务流程更新
- 数据库角色匹配修正

## 立即开始的开发任务

### 🔥 阶段一：核心功能修复（今天完成）

#### ✅ TODO 1.1: 修复 useApprovalFlow.ts（已完成）
- [x] 更新 ApprovalWorkflow 类型定义
- [x] 更新角色名称匹配数据库
- [x] 重写 workflowTemplates 符合业务需求

#### ✅ TODO 1.2: 创建动态业委会配置（已完成）
- [x] 添加 getCommitteeConfig 函数从 Supabase 获取业委会成员数量
- [x] 动态计算过半数投票要求
- [x] 添加小区建议5%阈值计算
- [x] 更新 createWorkflow 函数使用动态配置

#### ✅ TODO 1.3: 创建角色映射工具（已完成）
- [x] 创建 src/utils/roleMapping.ts
- [x] 添加数据库角色和UI角色转换
- [x] 添加权限检查功能
- [x] 添加角色中文显示名称

### 🔥 阶段二：页面创建（明天完成）

#### 📝 TODO 2.1: 业主功能页面（优先级：高）
- [x] `src/pages/CommunitySuggestionPage.tsx`（已完成）
  - [x] 建议提交表单
  - [x] 分类选择和紧急程度
  - [x] 投票阈值说明
  - [x] 表单验证
- [x] `src/pages/SimplifiedRepairReportPage.tsx`（已完成，替代了RepairReportPage）
  - [x] 报修信息表单
  - [x] 报修类型选择（8种分类）
  - [x] 图片上传功能
  - [x] 紧急程度选择
  - [x] 联系信息和期望时间

#### 📝 TODO 2.2: 业委会功能页面（优先级：高）
- [x] `src/pages/ExpenseApplicationPage.tsx`（已完成）
  - [x] 支出申请表单
  - [x] 8种支出分类选择
  - [x] 附件上传功能
  - [x] 分级审批流程说明
  - [x] 表单验证和提交
- [ ] `src/pages/SealApplicationPage.tsx`
  - 用印申请表单
  - 用印事由说明
  - 审批流程跟踪

#### 📝 TODO 2.3: 其他功能页面（优先级：中）
- [ ] `src/pages/AnnouncementPage.tsx`
- [ ] `src/pages/ConsultationPage.tsx`
- [ ] `src/pages/NoticePublishPage.tsx`

### 🔥 阶段三：数据库集成（后天完成）

#### 🗄️ TODO 3.1: 创建审批流程数据表
```sql
-- 需要在 scripts/ 目录创建新的 SQL 文件
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'in_progress',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE workflow_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES workflows(id),
  title VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL,
  role VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  step_order INTEGER NOT NULL,
  required BOOLEAN DEFAULT true
);

CREATE TABLE workflow_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES workflows(id),
  step_id UUID REFERENCES workflow_steps(id),
  user_id UUID REFERENCES users(id),
  vote VARCHAR(20) NOT NULL, -- 'approve', 'reject', 'abstain'
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 🔌 TODO 3.2: 更新 Supabase 客户端
```typescript
// 在 src/lib/database.ts 中添加
export const workflowOperations = {
  createWorkflow,
  getWorkflows,
  updateWorkflowStep,
  submitVote,
  getCommitteeMembers
};
```

### 🔥 阶段四：UI 集成（第4天完成）

#### 🎨 TODO 4.1: 表单组件创建
- [ ] `src/components/forms/ExpenseApplicationForm.tsx`
- [ ] `src/components/forms/RepairReportForm.tsx`
- [ ] `src/components/forms/CommunitySuggestionForm.tsx`

#### 🎨 TODO 4.2: 审批组件集成
- [ ] 在各页面集成 `SimpleApprovalFlow`
- [ ] 在投票页面集成 `CommitteeVoting`
- [ ] 更新 `ApprovalCenter` 页面

## 具体实施步骤

### 第1天：修复核心逻辑 ✅
1. **✅ 完成 TODO 1.2**: 添加动态业委会配置
2. **✅ 完成 TODO 1.3**: 创建角色映射工具
3. **✅ 完成**: 创建 `CommunitySuggestionPage.tsx`
4. **✅ 完成**: 创建 `SimplifiedRepairReportPage.tsx`（替代RepairReportPage）
5. **✅ 完成**: 创建 `ExpenseApplicationPage.tsx`

### 第2天：创建剩余页面
1. **上午**: 创建 `SealApplicationPage.tsx`
2. **下午**: 创建 `AnnouncementPage.tsx` 和 `ConsultationPage.tsx`
3. **晚上**: 创建 `NoticePublishPage.tsx`

### 第3天：数据库集成
1. **上午**: 设计并创建数据库表结构
2. **下午**: 实现 Supabase 查询函数
3. **晚上**: 连接前端与数据库

### 第4天：UI 完善和测试
1. **上午**: 创建表单组件
2. **下午**: 集成审批流程组件
3. **晚上**: 端到端测试

## 开发优先级

### 🔴 高优先级（必须完成）
1. 小区建议页面 - 业主使用频率最高
2. 报事报修页面 - 核心功能
3. 支出申请页面 - 业委会核心功能
4. 动态业委会配置 - 基础功能

### 🟡 中优先级（重要但可延后）
1. 用印申请页面
2. 公告通知页面
3. 数据持久化

### 🟢 低优先级（可后续迭代）
1. 发布问卷页面
2. 通知发布页面
3. 高级统计功能

## 技术注意事项

### 1. 角色权限控制
```typescript
// 在每个页面中添加权限检查
const { currentUser } = useStore();
if (currentUser?.role !== 'COMMITTEE_MEMBER') {
  return <div>无权限访问</div>;
}
```

### 2. 表单验证
```typescript
// 使用现有的表单验证模式
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});
```

### 3. 文件上传
```typescript
// 复用现有的文件上传组件
import { FileUploader } from '@/components/create/FileUploader';
```

### 4. 状态管理
```typescript
// 使用 useApprovalFlow hook 管理审批状态
const { createWorkflow, workflows } = useApprovalFlow();
```

## 测试计划

### 单元测试
- [ ] useApprovalFlow hook 功能测试
- [ ] 角色映射工具测试
- [ ] 表单验证测试

### 集成测试
- [ ] 页面路由测试
- [ ] 数据库操作测试
- [ ] 权限控制测试

### 用户测试
- [ ] 业主建议提交流程
- [ ] 报修申请流程
- [ ] 业委会投票流程

## 完成标准

每个功能完成后需要满足：
1. ✅ 功能正常运行
2. ✅ 权限控制正确
3. ✅ 数据正确保存
4. ✅ UI 响应式适配
5. ✅ 错误处理完善

## 下一步行动

**立即开始**：
1. 打开 `src/hooks/useApprovalFlow.ts`
2. 添加动态业委会配置功能
3. 创建第一个页面 `CommunitySuggestionPage.tsx`

**今天目标**：完成核心逻辑修复，明天开始页面创建。
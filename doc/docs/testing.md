# 测试指南

## 概述

本指南详细说明了阳光花园社区应用的测试策略和实践。文档涵盖了测试策略、单元测试、集成测试、端到端测试、测试环境配置、运行测试等方面的内容。

## 测试策略

### 测试类型

我们采用分层测试策略，包括以下几种测试类型：

1. **单元测试**: 测试单个函数、组件或模块的功能。
2. **集成测试**: 测试多个组件或模块之间的交互。
3. **端到端测试**: 模拟用户操作，测试整个应用的流程。

### 测试原则

- **自动化**: 尽可能使用自动化测试，减少手动测试的工作量。
- **可重复**: 测试应可重复执行，结果应一致。
- **独立**: 测试应相互独立，不依赖其他测试的结果。
- **_specific_: 测试应针对特定功能或场景。
- **及时**: 测试应在开发过程中及时编写和执行。

### 测试覆盖率

我们的目标是达到80%以上的代码覆盖率，关键业务逻辑应达到100%覆盖率。

## 单元测试

### 技术栈

- **测试框架**: Jest
- **React测试工具**: React Testing Library
- **断言库**: Jest内置断言库

### 编写单元测试

#### 测试组件

使用React Testing Library编写组件测试：

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

test('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('calls onClick when clicked', async () => {
  const user = userEvent.setup();
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  await user.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

#### 测试工具函数

测试纯函数和工具函数：

```javascript
import { formatCurrency } from './utils';

test('formats currency correctly', () => {
  expect(formatCurrency(1000)).toBe('¥1,000.00');
  expect(formatCurrency(0)).toBe('¥0.00');
  expect(formatCurrency(-500)).toBe('-¥500.00');
});
```

### 运行单元测试

```bash
# 运行所有单元测试
npm run test:unit
# 或者使用 pnpm
# pnpm run test:unit

# 运行单元测试并监听文件变化
npm run test:unit:watch
# 或者使用 pnpm
# pnpm run test:unit:watch

# 生成测试覆盖率报告
npm run test:unit:coverage
# 或者使用 pnpm
# pnpm run test:unit:coverage
```

## 集成测试

### 技术栈

- **测试框架**: Jest
- **React测试工具**: React Testing Library
- **Mock工具**: Jest Mocks

### 编写集成测试

集成测试主要测试组件与外部依赖（如API、存储等）的交互。

#### 测试API调用

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventList from './EventList';
import * as eventService from '../services/eventService';

jest.mock('../services/eventService');

test('displays events from API', async () => {
  const mockEvents = [
    { id: 1, title: 'Event 1' },
    { id: 2, title: 'Event 2' }
  ];
  
  eventService.getEvents.mockResolvedValue(mockEvents);
  
  render(<EventList />);
  
  await waitFor(() => {
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
  });
});
```

#### 测试状态管理

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStore } from '../store';
import Counter from './Counter';

test('updates count in store', async () => {
  const user = userEvent.setup();
  render(<Counter />);
  
  expect(screen.getByText('Count: 0')).toBeInTheDocument();
  
  await user.click(screen.getByText('Increment'));
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
  
  // 验证store中的状态
  expect(useStore.getState().count).toBe(1);
});
```

### 运行集成测试

```bash
# 运行所有集成测试
npm run test:integration
# 或者使用 pnpm
# pnpm run test:integration

# 运行集成测试并监听文件变化
npm run test:integration:watch
# 或者使用 pnpm
# pnpm run test:integration:watch
```

## 端到端测试

### 技术栈

- **测试框架**: Cypress
- **断言库**: Chai (内置在Cypress中)

### 编写端到端测试

端到端测试模拟用户操作，测试整个应用的流程。

#### 测试用户登录流程

```javascript
describe('Login', () => {
  it('successfully logs in a user', () => {
    cy.visit('/login');
    
    cy.get('[data-testid="email-input"]').type('user@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-menu"]').should('be.visible');
  });
});
```

#### 测试事件创建流程

```javascript
describe('Event Creation', () => {
  beforeEach(() => {
    // 登录用户
    cy.login('user@example.com', 'password123');
  });
  
  it('creates a new event', () => {
    cy.visit('/events');
    cy.get('[data-testid="create-event-button"]').click();
    
    cy.get('[data-testid="event-title-input"]').type('Test Event');
    cy.get('[data-testid="event-description-input"]').type('This is a test event');
    cy.get('[data-testid="submit-event-button"]').click();
    
    cy.url().should('include', '/events');
    cy.contains('Test Event').should('be.visible');
  });
});
```

### 运行端到端测试

```bash
# 运行所有端到端测试
npm run test:e2e
# 或者使用 pnpm
# pnpm run test:e2e

# 以交互模式运行端到端测试
npm run test:e2e:open
# 或者使用 pnpm
# pnpm run test:e2e:open
```

## 测试环境配置

### 环境变量

为不同环境配置不同的环境变量：

- **开发环境**: `.env.development`
- **测试环境**: `.env.test`
- **生产环境**: `.env.production`

### 测试数据库

在测试环境中，我们使用内存数据库或测试数据库，以避免影响生产数据。

### Mock服务

对于外部服务（如AI服务、第三方API），在测试中使用Mock服务来模拟响应。

## 运行测试

### 运行所有测试

```bash
# 运行所有测试
npm run test
# 或者使用 pnpm
# pnpm run test
```

### 持续集成

在持续集成(CI)环境中，自动运行所有测试：

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm install
      
    - name: Run unit tests
      run: npm run test:unit:coverage
      
    - name: Run integration tests
      run: npm run test:integration
      
    - name: Run end-to-end tests
      run: npm run test:e2e
```

### 测试报告

测试完成后，会生成测试报告，包括：
- 测试覆盖率报告
- 测试结果报告
- 性能测试报告（如果有）

## 最佳实践

### 测试命名

使用清晰、描述性的测试名称：

```javascript
// 好的命名
test('displays error message when login fails with invalid credentials', () => {
  // ...
});

// 不好的命名
test('login test', () => {
  // ...
});
```

### 测试数据

使用工厂函数或fixtures来生成测试数据：

```javascript
const createUser = (overrides = {}) => ({
  id: Math.random(),
  name: 'Test User',
  email: 'test@example.com',
  ...overrides
});

test('displays user name', () => {
  const user = createUser({ name: 'John Doe' });
  render(<UserProfile user={user} />);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

### 避免测试实现细节

测试组件的行为，而不是实现细节：

```javascript
// 好的做法 - 测试行为
test('submits form when button is clicked', async () => {
  const user = userEvent.setup();
  const handleSubmit = jest.fn();
  render(<Form onSubmit={handleSubmit} />);
  
  await user.type(screen.getByLabelText('Name'), 'John');
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  
  expect(handleSubmit).toHaveBeenCalledWith({ name: 'John' });
});

// 不好的做法 - 测试实现细节
test('calls handleSubmit function', () => {
  const handleSubmit = jest.fn();
  const { container } = render(<Form onSubmit={handleSubmit} />);
  
  const form = container.querySelector('form');
  form.dispatchEvent(new Event('submit', { cancelable: true }));
  
  expect(handleSubmit).toHaveBeenCalled();
});
```

## 故障排除

### 测试运行缓慢

- 检查是否有异步操作未正确等待。
- 优化测试数据的生成和清理。
- 并行运行测试。

### 测试不稳定

- 确保测试环境的一致性。
- 避免测试之间的依赖。
- 使用适当的等待机制。

### 测试覆盖率不足

- 分析未覆盖的代码路径。
- 为关键业务逻辑编写更多测试。
- 定期审查和更新测试用例。
# 部署指南

## 概述

本指南详细说明了如何将阳光花园社区应用部署到生产环境。文档涵盖了部署环境要求、构建项目、配置环境变量、部署到不同平台、域名和SSL配置、监控和日志等方面的内容。

## 部署环境要求

### 硬件要求

- **CPU**: 至少2核
- **内存**: 至少4GB RAM
- **存储**: 至少20GB可用磁盘空间
- **网络**: 稳定的互联网连接

### 软件要求

- **操作系统**: Linux (推荐Ubuntu 20.04+), Windows Server, macOS
- **Node.js**: v16.x 或更高版本
- **Web服务器**: Nginx, Apache, 或其他支持静态文件服务的Web服务器
- **Supabase账户**: 用于后端服务
- **域名**: 用于生产环境访问

## 构建项目

在部署之前，需要先构建项目以生成生产环境所需的静态文件。

### 构建步骤

1. 确保所有代码已合并到`main`分支:
   ```bash
   git checkout main
   git pull origin main
   ```

2. 安装项目依赖:
   ```bash
   npm install
   # 或者使用 pnpm (推荐)
   # pnpm install
   ```

3. 构建项目:
   ```bash
   npm run build
   # 或者使用 pnpm
   # pnpm run build
   ```

4. 构建完成后，项目文件将生成在`dist`目录中。

## 配置环境变量

生产环境需要配置相应的环境变量，以确保应用能够正确连接到后端服务和AI服务。

### 环境变量文件

创建`.env.production`文件，并配置以下环境变量:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_AI_API_KEY=your_ai_service_api_key
```

### 环境变量说明

- `VITE_SUPABASE_URL`: Supabase项目的URL，可以在Supabase控制台找到。
- `VITE_SUPABASE_ANON_KEY`: Supabase的匿名密钥，用于前端应用访问Supabase服务。
- `VITE_AI_API_KEY`: AI服务的API密钥，用于调用AI功能。

## 部署到不同平台

### 部署到Nginx

1. 将`dist`目录中的文件复制到Nginx的Web根目录:
   ```bash
   sudo cp -r dist/* /var/www/html/
   ```

2. 配置Nginx服务器块:
   ```nginx
   server {
       listen 80;
       server_name your_domain.com;
       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

3. 重新加载Nginx配置:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### 部署到Apache

1. 将`dist`目录中的文件复制到Apache的Web根目录:
   ```bash
   sudo cp -r dist/* /var/www/html/
   ```

2. 配置Apache虚拟主机:
   ```apache
   <VirtualHost *:80>
       ServerName your_domain.com
       DocumentRoot /var/www/html

       <Directory /var/www/html>
           AllowOverride All
           Require all granted
       </Directory>

       # SPA路由支持
       RewriteEngine On
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule ^.*$ /index.html [QSA,L]
   </VirtualHost>
   ```

3. 启用重写模块并重新启动Apache:
   ```bash
   sudo a2enmod rewrite
   sudo systemctl restart apache2
   ```

### 部署到Vercel

1. 安装Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. 登录Vercel账户:
   ```bash
   vercel login
   ```

3. 在项目根目录下部署:
   ```bash
   vercel
   ```

4. 按照提示选择项目设置，Vercel会自动检测项目类型并配置部署。

### 部署到Netlify

1. 在Netlify官网创建账户并登录。

2. 点击"New site from Git"，连接到你的Git仓库。

3. 选择项目仓库并配置以下设置:
   - Build command: `npm run build`
   - Publish directory: `dist`

4. 点击"Deploy site"开始部署。

## 域名和SSL配置

### 域名配置

1. 在域名注册商处添加A记录，指向服务器的IP地址。
2. 如果使用Vercel或Netlify等平台，按照平台提供的说明配置域名。

### SSL证书

#### 使用Let's Encrypt (Certbot)

1. 安装Certbot:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. 获取SSL证书:
   ```bash
   sudo certbot --nginx -d your_domain.com
   ```

3. 按照提示完成证书申请和Nginx配置。

#### 使用平台提供的SSL

如果使用Vercel、Netlify等平台，通常会自动提供SSL证书。只需在平台的设置中启用SSL即可。

## 监控和日志

### 前端监控

- **错误监控**: 使用Sentry等工具监控前端JavaScript错误。
- **性能监控**: 使用Google Analytics或类似的工具监控页面加载性能和用户行为。

### 后端监控

- **Supabase监控**: Supabase控制台提供数据库性能和API调用监控。
- **AI服务监控**: 硅基流动控制台提供AI服务调用监控和成本分析。

### 日志记录

- **前端日志**: 在生产环境中，前端日志可以通过监控工具收集和分析。
- **后端日志**: Supabase自动记录数据库操作日志，可以在控制台查看。

## 备份和恢复

### 代码备份

- 定期将代码推送到远程Git仓库，确保代码安全。
- 使用Git标签标记重要版本，便于回滚。

### 数据备份

- **Supabase备份**: Supabase会自动备份数据库，也可以在控制台手动创建备份。
- **文件备份**: 如果使用Supabase存储服务，文件会自动冗余存储。

### 恢复流程

1. 如果需要回滚到之前的版本，可以从Git标签检出相应代码并重新部署。
2. 如果需要恢复数据库，可以从Supabase控制台的备份中恢复。

## 故障排除

### 常见问题

#### 页面无法访问

1. 检查Web服务器是否正常运行。
2. 检查防火墙设置，确保端口已开放。
3. 检查域名解析是否正确。

#### 静态资源加载失败

1. 检查Web服务器配置，确保静态文件路径正确。
2. 检查文件权限，确保Web服务器有权限访问文件。

#### API调用失败

1. 检查环境变量配置是否正确。
2. 检查Supabase服务是否正常运行。
3. 检查网络连接是否正常。

### 联系支持

如果遇到无法解决的问题，可以联系以下支持渠道:
- **Supabase支持**: https://supabase.com/support
- **硅基流动支持**: https://siliconflow.cn/support
- **项目维护者**: 通过Git提交Issue或Pull Request
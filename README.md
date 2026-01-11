# Flymail

一个现代化的自托管邮件接收系统，支持自定义域名。基于 React、Node.js 构建，采用简洁的 shadcn/ui 界面风格。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)

## 功能特性

- **自定义域名** - 添加您自己的域名，接收任意地址的邮件
- **MX 记录验证** - 自动 DNS 验证，简化域名配置
- **通配地址（Catch-all）** - 创建通配地址，接收该域名的所有邮件
- **管理员模式** - 用户管理、系统设置、注册控制
- **现代化界面** - 基于 shadcn/ui 的简洁响应式界面
- **深色模式** - 完整的明暗主题支持
- **多语言支持** - 中文/英文界面
- **附件支持** - 无缝处理邮件附件
- **搜索过滤** - 强大的邮件搜索功能

## 技术栈

### 前端
- React 18 + TypeScript
- Vite
- TailwindCSS + shadcn/ui
- TanStack Query
- Zustand
- React Router
- react-i18next

### 后端
- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite
- smtp-server + mailparser
- JWT 认证

## 快速开始

### Docker 部署（推荐）

```bash
# 克隆仓库
git clone https://github.com/GtxFury/flymail.git
cd flymail

# 复制并修改配置
cp .env.docker .env

# 编辑 .env 文件，修改以下配置：
# - JWT_SECRET: 改为安全的密钥
# - MX_HOSTNAME: 改为你的邮件服务器域名

# 启动服务
docker-compose up -d

# 初始化数据库
docker-compose exec server pnpm exec prisma db push
```

服务启动后：
- **Web 界面**: http://your-server:8080
- **API 服务**: http://your-server:3001
- **SMTP 服务**: your-server:25

### 本地开发

```bash
# 安装依赖
pnpm install

# 配置环境变量
cp packages/server/.env.example packages/server/.env

# 初始化数据库
cd packages/server
pnpm exec prisma db push
cd ..

# 启动开发服务器
pnpm dev
```

## 管理员模式

Flymail 采用管理员模式进行用户管理：

### 管理员账户

- **第一个注册的用户自动成为管理员**
- 管理员可以在侧边栏看到「管理」菜单
- 管理员拥有系统的完全控制权

### 管理员功能

1. **用户管理**
   - 查看所有用户列表
   - 创建新用户
   - 编辑用户信息（姓名、密码、角色）
   - 启用/禁用用户账户
   - 删除用户（会同时删除其所有域名、地址和邮件）

2. **系统设置**
   - **允许公开注册**：开启后任何人可以注册账户；关闭后只有管理员可以创建用户

3. **系统统计**
   - 用户总数
   - 域名总数
   - 邮箱地址总数
   - 邮件总数

### 已有数据库升级

如果你已经有旧版本的数据库，需要手动将第一个用户设为管理员：

```bash
# 方式 1：使用 Prisma Studio
docker-compose exec server pnpm exec prisma studio
# 然后在界面中编辑用户，将 isAdmin 设为 true

# 方式 2：直接操作数据库
docker-compose exec server sqlite3 ./data/flymail.db
UPDATE User SET isAdmin = 1 WHERE id = '你的用户ID';
```

## 配置说明

### 环境变量

```env
# JWT 密钥（务必修改！）
JWT_SECRET=your-super-secret-jwt-key-change-this

# 邮件服务器主机名（用于 MX 记录指引）
MX_HOSTNAME=mail.yourdomain.com

# 端口配置
WEB_PORT=8080      # Web 界面端口
API_PORT=3001      # API 服务端口
SMTP_PORT=25       # SMTP 服务端口
```

### 域名配置

1. 在 Flymail 控制台添加域名
2. 在你的 DNS 服务商配置 MX 记录：
   ```
   类型: MX
   主机: @
   值: mail.yourdomain.com（你的邮件服务器域名）
   优先级: 10
   ```
3. 点击「验证」确认 DNS 配置
4. 创建邮箱地址开始接收邮件

### SMTP 端口说明

- **端口 25** 是标准 SMTP 接收端口，接收外部邮件必须使用此端口
- 部分云服务商（如 DigitalOcean）默认封锁 25 端口，需要提交工单申请开通
- 确保服务器防火墙允许 25 端口入站流量

## API 接口

### 认证接口

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | `/api/auth/register` | 注册账户 |
| POST | `/api/auth/login` | 登录 |
| GET | `/api/auth/me` | 获取当前用户 |
| PUT | `/api/auth/password` | 修改密码 |

### 域名接口

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/domains` | 获取域名列表 |
| POST | `/api/domains` | 添加域名 |
| POST | `/api/domains/:id/verify` | 验证 MX 记录 |
| DELETE | `/api/domains/:id` | 删除域名 |

### 邮箱地址接口

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/addresses` | 获取地址列表 |
| POST | `/api/addresses` | 创建地址 |
| DELETE | `/api/addresses/:id` | 删除地址 |

### 邮件接口

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/emails` | 获取邮件列表（支持分页） |
| GET | `/api/emails/:id` | 获取邮件详情 |
| PATCH | `/api/emails/:id` | 更新邮件状态 |
| DELETE | `/api/emails/:id` | 删除邮件 |

### 管理员接口

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/admin/users` | 获取所有用户 |
| POST | `/api/admin/users` | 创建用户 |
| PATCH | `/api/admin/users/:id` | 更新用户 |
| DELETE | `/api/admin/users/:id` | 删除用户 |
| GET | `/api/admin/settings` | 获取系统设置 |
| PATCH | `/api/admin/settings` | 更新系统设置 |
| GET | `/api/admin/stats` | 获取系统统计 |

## 项目结构

```
flymail/
├── packages/
│   ├── web/                    # 前端 React 应用
│   │   ├── src/
│   │   │   ├── components/     # UI 组件
│   │   │   ├── pages/          # 页面组件
│   │   │   ├── stores/         # Zustand 状态管理
│   │   │   ├── lib/            # 工具函数和 API
│   │   │   └── locales/        # 国际化文件
│   │   └── package.json
│   │
│   └── server/                 # 后端 Express 应用
│       ├── src/
│       │   ├── routes/         # API 路由
│       │   ├── middleware/     # 中间件
│       │   ├── smtp/           # SMTP 服务器
│       │   └── lib/            # 工具函数
│       ├── prisma/             # 数据库模型
│       └── package.json
│
├── docker-compose.yml          # Docker 编排配置
├── .env.docker                 # Docker 环境变量模板
└── package.json                # 根配置文件
```

## 测试邮件接收

使用 `swaks` 工具测试：

```bash
# 安装 swaks
# macOS: brew install swaks
# Ubuntu: apt install swaks

# 发送测试邮件
swaks --to test@yourdomain.com \
      --from sender@example.com \
      --server your-server-ip \
      --port 25 \
      --header "Subject: 测试邮件" \
      --body "这是一封测试邮件"
```

## 注意事项

1. **SMTP 端口**：生产环境必须使用 25 端口接收邮件，可能需要 root 权限
2. **SSL/TLS**：生产环境建议配置 SSL 证书
3. **反向代理**：建议使用 Nginx 或 Caddy 处理 HTTPS
4. **防火墙**：确保开放 25（SMTP）、443（HTTPS）和 API 端口

## 开源协议

本项目基于 MIT 协议开源，详见 [LICENSE](LICENSE) 文件。

## 致谢

- [shadcn/ui](https://ui.shadcn.com/) - 精美的 UI 组件库
- [Prisma](https://prisma.io/) - 现代化 ORM
- [smtp-server](https://nodemailer.com/extras/smtp-server/) - SMTP 服务器实现

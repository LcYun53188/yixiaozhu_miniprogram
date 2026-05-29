# 益小助

基于 AI 的校园公益资源智能匹配小程序，用于旧书教材、闲置物资、失物招领、爱心帮扶与公益活动等校园公益场景。

## 项目结构

```text
SauAPP
├─ backend        Node.js + Express 后端服务
├─ miniprogram    微信小程序前端
├─ database       MySQL 建表与种子数据
├─ docs           开发说明
└─ 益小助-*.md    项目需求、设计和 UI 原型文档
```

## 已创建能力

1. 小程序端：首页、分类、发布、匹配、详情、消息、我的、设置、后台管理页面
2. 后端接口：用户、身份验证、管理员邀请码、资源、需求、AI、审核、匹配、消息、收藏、后台统计
3. 登录体系：支持真实微信登录 `code2Session`，未配置微信参数时自动回退离线演示登录
4. 身份治理：支持学号姓名验证、一次性管理员邀请码兑换、超级管理员角色管理
5. AI 兜底：文本分类、标签提取、文案优化、风险识别、规则匹配推荐、ISBN 扫码辅助、图片识别辅助
6. 互动闭环：双方信誉积分、对接评价和评价消息通知
7. 数据库：按设计文档整理的 MySQL 建表 SQL、邀请码迁移脚本与演示数据
8. Docker Compose 开发环境：后端、MySQL、phpMyAdmin 一键启动

## 快速开始

```powershell
cd backend
npm install
npm run dev
```

然后用微信开发者工具打开 `miniprogram` 目录。

演示阶段可在小程序“我的”页直接选择离线演示账号，包括普通用户、需求方用户、管理员和超级管理员，无需微信登录。

如需使用真实微信登录，请在根目录 `.env` 和 `backend/.env` 中配置：

```env
WECHAT_APPID=
WECHAT_SECRET=
```

完成真实登录后，可在“设置”页继续进行学号姓名验证，并使用一次性管理员邀请码升级为管理员。

## Docker 开发环境

```powershell
docker compose up -d --build
```

启动后可访问：

```text
后端 API: http://localhost:3000/api/health
数据库检测: http://localhost:3000/api/health/db
phpMyAdmin: http://localhost:8080
```

当前 Docker 环境会同时启动后端、MySQL 和 phpMyAdmin。如果 Docker Hub 拉取镜像时报 `EOF` 或超时，等网络恢复后重试即可。

如果持续拉取失败，可在 `.env` 中修改 `NODE_IMAGE`、`MYSQL_IMAGE`、`PHPMYADMIN_IMAGE` 切换镜像源，详见 [docs/DOCKER_TROUBLESHOOTING.md](docs/DOCKER_TROUBLESHOOTING.md)。

更多说明见 [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)。

超级管理员实际配置流程见 [docs/SUPER_ADMIN_SETUP.md](docs/SUPER_ADMIN_SETUP.md)。

图像识别接口启用流程见 [docs/IMAGE_RECOGNITION_SETUP.md](docs/IMAGE_RECOGNITION_SETUP.md)。

## 文档同步

项目书与开发细节文档已同步当前实现：

```text
益小助-项目大纲.md
益小助-开发细节设计.md
益小助-项目书.docx
docs/DEVELOPMENT.md
docs/DOCKER_TROUBLESHOOTING.md
docs/SUPER_ADMIN_SETUP.md
docs/IMAGE_RECOGNITION_SETUP.md
docs/益小助-作品介绍文档.md
docs/益小助-作品介绍文档.docx
```

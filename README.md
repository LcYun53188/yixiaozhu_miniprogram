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

1. 小程序端：首页、分类、发布、匹配、详情、消息、我的、后台管理页面
2. 后端接口：用户、资源、需求、AI、审核、匹配、消息、收藏、后台统计
3. AI 兜底：文本分类、标签提取、文案优化、风险识别、规则匹配推荐
4. 双方信誉积分、对接评价和评价消息通知
5. 数据库：按设计文档整理的 MySQL 建表 SQL 与演示数据
6. Docker Compose 开发环境：后端、MySQL、phpMyAdmin 一键启动

## 快速开始

```powershell
cd backend
npm install
npm run dev
```

然后用微信开发者工具打开 `miniprogram` 目录。

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

## 文档同步

项目书与开发细节文档已同步当前实现：

```text
益小助-项目大纲.md
益小助-开发细节设计.md
docs/DEVELOPMENT.md
docs/DOCKER_TROUBLESHOOTING.md
```

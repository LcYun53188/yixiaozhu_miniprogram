# 益小助开发说明

## 当前实现范围

本项目已按文档中的比赛落地版目标创建项目骨架，当前版本优先打通：

1. 登录、身份验证与角色识别
2. 资源/需求发布
3. AI 分类、标签、文案优化、风险识别的规则兜底
4. 管理员审核通过/驳回
5. 审核通过后生成匹配推荐
6. 消息通知、匹配记录、后台统计
7. 双方信誉积分与对接评价
8. 微信小程序主要页面原型
9. 微信登录后的学号姓名验证

## 后端启动

```powershell
cd backend
npm install
npm run dev
```

默认服务地址为：

```text
http://localhost:3000/api
```

当前后端使用内存数据，方便演示和联调。后续接 MySQL 时，可先执行：

```powershell
mysql --default-character-set=utf8mb4 -u root -p < database/schema.sql
mysql --default-character-set=utf8mb4 -u root -p < database/seed.sql
```

## Docker 开发环境

如果已经安装 Docker Desktop，可在项目根目录运行：

```powershell
docker compose up -d --build
```

服务地址：

```text
后端 API: http://localhost:3000/api/health
数据库检测: http://localhost:3000/api/health/db
phpMyAdmin: http://localhost:8080
MySQL: localhost:3306
```

当前 Docker 开发环境会同时启动 `backend`、`mysql` 和 `phpmyadmin` 三个服务。

### 网络较差时的建议

当前开发环境需要拉取 `node:22-alpine`、`mysql:8.4` 和 `phpmyadmin:5.2`。如果 Docker Hub 连接不稳定，建议分步拉取：

```powershell
docker compose pull mysql
docker compose pull phpmyadmin
docker compose build backend
docker compose up -d
```

如果仍出现 `EOF`、`connection reset`、`timeout` 等错误，说明镜像还没有完整拉取成功。此时项目配置无需修改，等网络恢复后重新执行同一条命令即可，Docker 会尽量复用已下载的镜像层。

也可以在 `.env` 中修改 `NODE_IMAGE`、`MYSQL_IMAGE`、`PHPMYADMIN_IMAGE`，切换到当前网络可访问的镜像源。详细排查见 [DOCKER_TROUBLESHOOTING.md](DOCKER_TROUBLESHOOTING.md)。

停止开发环境：

```powershell
docker compose down
```

如果需要清空数据库卷并重新导入 `database/schema.sql` 与 `database/seed.sql`：

```powershell
docker compose down -v
docker compose up -d --build
```

如果已有数据库卷且不想清空数据，可进入 MySQL 后执行：

```powershell
Get-Content -Raw -Encoding UTF8 .\database\migrations\001_credit_feedback.sql | docker compose exec -T mysql mysql --default-character-set=utf8mb4 -uyixiaozhu -pyixiaozhu_dev yixiaozhu
```

注意：手动导入 SQL 时请保持 `utf8mb4` 连接字符集。PowerShell 对容器内重定向支持不稳定时，推荐使用上面的 `Get-Content -Encoding UTF8 | docker compose exec -T ... --default-character-set=utf8mb4` 写法，或在 phpMyAdmin 导入前确认文件编码为 UTF-8。

如果 phpMyAdmin 中演示用户中文字段出现 `å¼ åŒå­¦` 这类乱码，可执行修复迁移：

```powershell
Get-Content -Raw -Encoding UTF8 .\database\migrations\004_fix_utf8mb4_user_seed.sql | docker compose exec -T mysql mysql --default-character-set=utf8mb4 -uyixiaozhu -pyixiaozhu_dev yixiaozhu
```

## 小程序运行

1. 打开微信开发者工具
2. 导入 `miniprogram` 目录
3. AppID 可先使用测试号或 `touristappid`
4. 确认 `miniprogram/app.js` 中 `apiBaseUrl` 指向后端地址
5. 本地调试时关闭合法域名校验

### 微信登录后的学号姓名验证

真实微信用户首次登录后默认为“未验证”。用户需要在“个人设置”页填写：

```text
学号
真实姓名
学院（可选）
```

验证成功后，后端会保存 `studentNo`、`realName`、`college`，并将 `identityVerified` 标记为 `true`。未验证用户不能发布资源/需求，也不能使用管理员邀请码。

演示账号默认已验证，便于离线演示。

如果微信开发者工具中出现 `timeout`，优先检查：

1. 浏览器或 PowerShell 能否访问 `http://127.0.0.1:3000/api/health`
2. 微信开发者工具是否勾选“不校验合法域名、TLS 版本以及 HTTPS 证书”
3. `miniprogram/app.js` 中 `apiBaseUrl` 是否为 `http://127.0.0.1:3000/api`
4. Docker 后端是否运行：`docker compose ps`

## 当前功能验证路径

### 图片添加

1. 进入小程序“发布”页
2. 点击“添加图片”
3. 选择相册或相机图片
4. 提交资源或需求
5. 审核通过后进入详情页查看图片展示

### 扫码 ISBN 与照片识别

1. 进入小程序“发布”页
2. 点击“扫码识别ISBN”可扫描图书条形码并自动填充图书标题、分类、标签和描述
3. 点击“照片识别物品”可从相册或相机选择图片，并生成物品分类、标签和描述建议
4. 识别结果会自动写入表单，但标题、分类、描述和标签都可以继续手动删改

当前图像识别为演示兜底逻辑。正式接入图像识别 API 的配置流程见 [IMAGE_RECOGNITION_SETUP.md](IMAGE_RECOGNITION_SETUP.md)。

### 管理员审核

1. 进入“我的”页
2. 点击“管理员演示登录”
3. 进入“后台管理”
4. 对待审核资源或需求执行“通过并匹配”或“驳回”

### 信誉积分与评价

1. 进入“匹配记录”
2. 点击“标记已联系”
3. 点击“评价对方”
4. 选择星级、填写评价内容、选择评价标签
5. 提交后回到“我的”页查看信誉积分和评价记录

如果新增后端接口后小程序提示 `接口不存在`，通常是 Docker 后端仍在运行旧代码，可执行：

```powershell
docker compose restart backend
```

## 演示账号

演示阶段可直接在小程序“我的”页选择离线演示账号，不依赖微信登录。

普通用户：

```text
code: demo-user
token: demo-token-1
```

需求方用户：

```text
code: demo-need-user
token: demo-token-3
```

管理员：

```text
code: demo-admin
token: demo-token-2
```

超级管理员：

```text
code: demo-super-admin
token: demo-token-4
```

小程序“我的”页面提供离线演示账号入口，便于在无微信登录条件下验证普通用户、需求方、管理员和超级管理员流程。

正式部署时，首个超级管理员应由部署人员在数据库中手动配置。详细流程见 [SUPER_ADMIN_SETUP.md](SUPER_ADMIN_SETUP.md)。

## 推荐开发顺序

1. 将内存数据仓库替换为 MySQL 数据访问层
2. 接入真实微信登录 `code2Session`
3. 接入真实图片上传与对象存储
4. 将 AI 规则兜底替换为大模型 API，并保留规则作为失败降级
5. 补充表单校验、空状态、加载态和权限错误提示
6. 完成比赛 PPT、演示脚本和测试数据

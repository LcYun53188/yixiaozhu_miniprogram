# Docker 开发环境故障处理

## 1. Docker Hub EOF

如果执行：

```powershell
docker compose up -d --build
```

出现类似错误：

```text
Error Get "https://registry-1.docker.io/v2/": EOF
```

说明 Docker 正在访问 Docker Hub，但网络连接被中断。项目配置本身通常没有问题。

## 2. 使用镜像源变量

项目已支持在 `.env` 中切换镜像地址：

```env
NODE_IMAGE=node:22-alpine
MYSQL_IMAGE=mysql:8.4
PHPMYADMIN_IMAGE=phpmyadmin:5.2
```

如果你的网络环境访问 Docker Hub 不稳定，可以把这三项改为当前可访问的镜像源。例如：

```env
NODE_IMAGE=docker.1ms.run/library/node:22-alpine
MYSQL_IMAGE=docker.1ms.run/library/mysql:8.4
PHPMYADMIN_IMAGE=docker.1ms.run/library/phpmyadmin:5.2
```

如果该镜像源也不可用，不需要改代码，只换 `.env` 中的镜像地址后重新执行启动命令即可。

## 3. 分步拉取镜像

网络较差时建议分步执行，方便看清楚是哪一个镜像失败：

```powershell
docker compose pull mysql
docker compose pull phpmyadmin
docker compose build backend
docker compose up -d
```

## 4. 查看启动状态

```powershell
docker compose ps
docker compose logs backend
docker compose logs mysql
docker compose logs phpmyadmin
```

## 5. 启动成功后的访问地址

```text
后端 API: http://localhost:3000/api/health
数据库检测: http://localhost:3000/api/health/db
phpMyAdmin: http://localhost:8080
MySQL: localhost:3306
```

phpMyAdmin 登录信息：

```text
服务器: mysql
用户名: yixiaozhu
密码: yixiaozhu_dev
数据库: yixiaozhu
```

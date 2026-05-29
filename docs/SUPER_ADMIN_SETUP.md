# 超级管理员配置流程

本文档说明实际部署时如何配置 `超级管理员`，以及超级管理员如何管理普通管理员。

## 一、角色说明

| 角色 | role 值 | 说明 |
|---|---|---|
| 普通用户 | user | 默认角色，可发布资源、需求、查看匹配和评价 |
| 管理员 | admin | 可审核内容、查看后台、管理邀请码和管理员账户 |
| 超级管理员 | super_admin | 系统最高权限，建议仅由项目负责人或指导教师持有 |

实际使用中，普通用户通过微信登录自动创建，默认角色为 `user`。管理员通过一次性邀请码升级。超级管理员不建议通过前台申请，应由部署人员在数据库中手动配置。

## 二、首次配置超级管理员

### 1. 使用真实微信登录

先用目标账号登录一次小程序。登录成功后，后端会在 `user` 表中创建该用户记录。

后端需要配置微信登录参数：

```env
WECHAT_APPID=你的微信小程序AppID
WECHAT_SECRET=你的微信小程序AppSecret
```

如果未配置以上变量，系统会使用演示登录，无法得到真实微信 `openid`。

### 2. 找到目标用户

使用 phpMyAdmin：

1. 打开 `http://localhost:8080`
2. 选择数据库 `yixiaozhu`
3. 打开 `user` 表
4. 根据昵称、手机号、学院或创建时间找到目标用户

或执行 SQL：

```sql
SELECT id, openid, nickname, role, created_at
FROM user
ORDER BY created_at DESC;
```

### 3. 设置为超级管理员

按用户 ID 更新：

```sql
UPDATE user
SET role = 'super_admin'
WHERE id = 目标用户ID;
```

或按 openid 更新：

```sql
UPDATE user
SET role = 'super_admin'
WHERE openid = '目标用户openid';
```

### 4. 重新登录小程序

更新角色后，在微信开发者工具中清缓存并重新编译，或重新进入小程序。刷新后，“我的”页应显示身份为 `超级管理员`，并可以进入后台管理。

## 三、Docker 环境下执行 SQL

在项目根目录执行：

```powershell
docker compose exec mysql mysql -uyixiaozhu -pyixiaozhu_dev yixiaozhu
```

进入 MySQL 后执行：

```sql
SELECT id, openid, nickname, role FROM user;
UPDATE user SET role = 'super_admin' WHERE id = 目标用户ID;
```

退出：

```sql
exit;
```

## 四、超级管理员管理管理员

超级管理员进入后台管理页后，可以：

1. 查看用户列表
2. 将普通用户设置为管理员
3. 撤销管理员权限
4. 生成一次性管理员邀请码
5. 停用未使用的邀请码

推荐实际管理流程：

1. 超级管理员在后台生成一次性邀请码
2. 将邀请码发给指定老师、学生干部或志愿服务负责人
3. 对方在“个人设置”页输入邀请码
4. 系统验证邀请码未使用后，将其角色升级为 `admin`
5. 邀请码立即失效，不能再次使用

## 五、演示账号说明

演示阶段可以直接在“我的”页选择离线账号：

| 演示账号 | code | 身份 |
|---|---|---|
| 张同学 | demo-user | 普通用户 |
| 李同学 | demo-need-user | 需求方用户 |
| 管理员 | demo-admin | 管理员 |
| 超级管理员 | demo-super-admin | 超级管理员 |

这些账号仅用于离线演示和功能验证。正式部署时，应使用真实微信登录账号，并按本文档通过数据库配置首个超级管理员。

## 六、安全建议

1. 超级管理员数量应尽量少，一般 1 到 2 人即可。
2. 管理员邀请码应只发给可信人员。
3. 邀请码应设置为一次性使用，使用后立即失效。
4. 不要把生产环境 `.env` 文件提交到 GitHub。
5. 定期检查 `user` 表中的管理员和超级管理员账号。
6. 如果管理员离开项目，应及时将其角色改回 `user` 或停用账号。

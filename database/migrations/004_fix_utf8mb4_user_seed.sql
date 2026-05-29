SET NAMES utf8mb4;

USE yixiaozhu;

UPDATE user
SET
  nickname = '张同学',
  phone = '13800000000',
  student_no = '20260001',
  real_name = '张同学',
  college = '计算机学院',
  identity_verified = 1,
  verified_at = COALESCE(verified_at, NOW()),
  role = 'user'
WHERE openid = 'demo-user';

UPDATE user
SET
  nickname = '管理员',
  phone = '13900000000',
  real_name = '管理员',
  college = '校团委',
  identity_verified = 1,
  verified_at = COALESCE(verified_at, NOW()),
  role = 'admin'
WHERE openid = 'demo-admin';

UPDATE user
SET
  nickname = '李同学',
  phone = '13700000000',
  student_no = '20260002',
  real_name = '李同学',
  college = '数学学院',
  identity_verified = 1,
  verified_at = COALESCE(verified_at, NOW()),
  role = 'user'
WHERE openid = 'demo-need-user';

UPDATE user
SET
  nickname = '超级管理员',
  phone = '13600000000',
  real_name = '超级管理员',
  college = '项目组',
  identity_verified = 1,
  verified_at = COALESCE(verified_at, NOW()),
  role = 'super_admin'
WHERE openid = 'demo-super-admin';

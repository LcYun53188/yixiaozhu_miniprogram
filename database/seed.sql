USE yixiaozhu;

INSERT INTO user (openid, nickname, phone, student_no, real_name, college, role, credit_score, rating_count)
VALUES
  ('demo-user', '张同学', '13800000000', '20260001', '张同学', '计算机学院', 'user', 100, 0),
  ('demo-admin', '管理员', '13900000000', '', '管理员', '校团委', 'admin', 100, 0),
  ('demo-need-user', '李同学', '13700000000', '20260002', '李同学', '数学学院', 'user', 100, 0)
ON DUPLICATE KEY UPDATE nickname = VALUES(nickname), role = VALUES(role);

INSERT INTO resource (user_id, title, description, polished_text, category, tags, contact_info, location_text, review_status, flow_status, ai_risk_level, ai_risk_reason, published_at)
VALUES
  (1, '高等数学教材转赠', '有几本高数教材，九成新，适合大一学生期末复习。', '有几本九成新的高等数学教材，适合大一学生期末复习使用，可在校内约定地点自取。', '旧书教材', '["教材","高数","大一","九成新"]', '微信：abc123', '图书馆门口', 'passed', 'pending_matching', 'low', '未发现明显风险', NOW());

INSERT INTO need (user_id, title, description, polished_text, category, tags, urgency_level, contact_info, review_status, flow_status, ai_risk_level, ai_risk_reason, published_at)
VALUES
  (3, '求高数复习资料', '准备期末考试，希望获取高等数学复习资料。', '本人正在准备期末考试，希望获得高等数学复习资料或教材，校内可自取。', '旧书教材', '["高数","复习","期末考试"]', 'high', '微信：stu001', 'passed', 'pending_matching', 'low', '未发现明显风险', NOW());

INSERT INTO match_record (resource_id, need_id, match_score, match_reason, status)
VALUES
  (1, 1, 92, '分类一致；标签重合：高数；关键词相关：高数；需求较紧急', 'recommended')
ON DUPLICATE KEY UPDATE match_score = VALUES(match_score), match_reason = VALUES(match_reason);

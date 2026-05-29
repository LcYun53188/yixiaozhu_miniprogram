SET NAMES utf8mb4;

USE yixiaozhu;

ALTER TABLE user
  ADD COLUMN IF NOT EXISTS credit_score INT NOT NULL DEFAULT 100 AFTER role,
  ADD COLUMN IF NOT EXISTS rating_count INT NOT NULL DEFAULT 0 AFTER credit_score;

CREATE TABLE IF NOT EXISTS feedback (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  match_id BIGINT NOT NULL,
  from_user_id BIGINT NOT NULL,
  to_user_id BIGINT NOT NULL,
  rating TINYINT NOT NULL,
  content VARCHAR(500) NOT NULL DEFAULT '',
  tags VARCHAR(255) NOT NULL DEFAULT '[]',
  credit_delta INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_feedback_match_from (match_id, from_user_id),
  INDEX idx_feedback_to_user (to_user_id)
);

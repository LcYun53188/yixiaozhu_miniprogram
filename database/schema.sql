SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS yixiaozhu DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE yixiaozhu;

CREATE TABLE IF NOT EXISTS user (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  openid VARCHAR(64) NOT NULL UNIQUE,
  nickname VARCHAR(64) NOT NULL DEFAULT '',
  avatar_url VARCHAR(255) NOT NULL DEFAULT '',
  phone VARCHAR(20) NOT NULL DEFAULT '',
  student_no VARCHAR(32) NOT NULL DEFAULT '',
  real_name VARCHAR(32) NOT NULL DEFAULT '',
  college VARCHAR(64) NOT NULL DEFAULT '',
  identity_verified TINYINT NOT NULL DEFAULT 0,
  verified_at DATETIME NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  credit_score INT NOT NULL DEFAULT 100,
  rating_count INT NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resource (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  title VARCHAR(128) NOT NULL,
  description TEXT NOT NULL,
  polished_text TEXT NULL,
  category VARCHAR(32) NOT NULL,
  tags VARCHAR(512) NOT NULL DEFAULT '[]',
  image_urls TEXT NULL,
  contact_info VARCHAR(128) NOT NULL DEFAULT '',
  location_text VARCHAR(128) NOT NULL DEFAULT '',
  review_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  flow_status VARCHAR(20) NOT NULL DEFAULT 'pending_matching',
  ai_risk_level VARCHAR(20) NOT NULL DEFAULT 'low',
  ai_risk_reason VARCHAR(255) NOT NULL DEFAULT '',
  published_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_flag TINYINT NOT NULL DEFAULT 0,
  INDEX idx_resource_user (user_id),
  INDEX idx_resource_category_status (category, review_status, flow_status)
);

CREATE TABLE IF NOT EXISTS need (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  title VARCHAR(128) NOT NULL,
  description TEXT NOT NULL,
  polished_text TEXT NULL,
  category VARCHAR(32) NOT NULL,
  tags VARCHAR(512) NOT NULL DEFAULT '[]',
  urgency_level VARCHAR(20) NOT NULL DEFAULT 'medium',
  contact_info VARCHAR(128) NOT NULL DEFAULT '',
  review_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  flow_status VARCHAR(20) NOT NULL DEFAULT 'pending_matching',
  ai_risk_level VARCHAR(20) NOT NULL DEFAULT 'low',
  ai_risk_reason VARCHAR(255) NOT NULL DEFAULT '',
  published_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_flag TINYINT NOT NULL DEFAULT 0,
  INDEX idx_need_user (user_id),
  INDEX idx_need_category_status (category, review_status, flow_status)
);

CREATE TABLE IF NOT EXISTS match_record (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  resource_id BIGINT NOT NULL,
  need_id BIGINT NOT NULL,
  match_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  match_reason VARCHAR(255) NOT NULL DEFAULT '',
  status VARCHAR(20) NOT NULL DEFAULT 'recommended',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_resource_need (resource_id, need_id)
);

CREATE TABLE IF NOT EXISTS review_record (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  target_type VARCHAR(20) NOT NULL,
  target_id BIGINT NOT NULL,
  review_status VARCHAR(20) NOT NULL,
  review_reason VARCHAR(255) NOT NULL DEFAULT '',
  reviewer_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_review_target (target_type, target_id)
);

CREATE TABLE IF NOT EXISTS message (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  message_type VARCHAR(32) NOT NULL,
  title VARCHAR(128) NOT NULL,
  content VARCHAR(500) NOT NULL,
  related_type VARCHAR(20) NOT NULL DEFAULT '',
  related_id BIGINT NULL,
  is_read TINYINT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_message_user (user_id, is_read)
);

CREATE TABLE IF NOT EXISTS favorite (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  target_type VARCHAR(20) NOT NULL,
  target_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_target (user_id, target_type, target_id)
);

CREATE TABLE IF NOT EXISTS admin_apply (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  apply_reason VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  reviewer_id BIGINT NULL,
  review_reason VARCHAR(255) NOT NULL DEFAULT '',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_invite_code (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  invite_code VARCHAR(64) NOT NULL UNIQUE,
  used TINYINT NOT NULL DEFAULT 0,
  disabled TINYINT NOT NULL DEFAULT 0,
  used_by BIGINT NULL,
  used_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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

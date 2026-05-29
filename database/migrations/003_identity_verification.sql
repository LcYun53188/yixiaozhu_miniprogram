SET NAMES utf8mb4;

USE yixiaozhu;

ALTER TABLE user
  ADD COLUMN IF NOT EXISTS identity_verified TINYINT NOT NULL DEFAULT 0 AFTER college,
  ADD COLUMN IF NOT EXISTS verified_at DATETIME NULL AFTER identity_verified;

UPDATE user
SET identity_verified = 1, verified_at = COALESCE(verified_at, NOW())
WHERE openid LIKE 'demo-%';

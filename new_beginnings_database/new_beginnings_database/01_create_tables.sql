-- ============================================================
--  NEW BEGINNINGS — REAL ESTATE PORTAL
--  FILE 1 OF 4: Create Database & All Tables
--  Run this FIRST before any other file
--  Command: mysql -u root -p < 01_create_tables.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS new_beginnings_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE new_beginnings_db;

-- ============================================================
--  TABLE 1: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          INT           AUTO_INCREMENT PRIMARY KEY,
  first_name  VARCHAR(100)  NOT NULL,
  last_name   VARCHAR(100)  NOT NULL,
  email       VARCHAR(191)  NOT NULL UNIQUE,
  phone       VARCHAR(20),
  city        VARCHAR(100),
  password    VARCHAR(255)  NOT NULL,
  role        ENUM('user','admin') DEFAULT 'user',
  is_active   TINYINT(1)    DEFAULT 1,
  created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_users_email (email),
  INDEX idx_users_role  (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  TABLE 2: properties
-- ============================================================
CREATE TABLE IF NOT EXISTS properties (
  id            INT           AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255)  NOT NULL,
  type          ENUM('Apartment','Villa','Independent House','Land / Plot','Commercial') NOT NULL,
  price         BIGINT        NOT NULL,
  area          DECIMAL(10,2) NOT NULL,
  beds          INT           DEFAULT 0,
  baths         INT           DEFAULT 0,
  city          VARCHAR(100)  NOT NULL,
  locality      VARCHAR(150),
  address       TEXT,
  description   TEXT,
  owner_name    VARCHAR(150),
  owner_phone   VARCHAR(25),
  owner_id      INT,
  rating        DECIMAL(3,2)  DEFAULT 0.00,
  review_count  INT           DEFAULT 0,
  badge         ENUM('featured','new','hot') DEFAULT 'new',
  emoji         VARCHAR(10)   DEFAULT '🏠',
  lat           DECIMAL(10,7),
  lng           DECIMAL(10,7),
  status        ENUM('active','pending','sold','rejected') DEFAULT 'active',
  created_at    DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_prop_owner FOREIGN KEY (owner_id)
    REFERENCES users(id) ON DELETE SET NULL,

  INDEX idx_prop_type   (type),
  INDEX idx_prop_city   (city),
  INDEX idx_prop_price  (price),
  INDEX idx_prop_status (status),
  INDEX idx_prop_badge  (badge),
  INDEX idx_prop_rating (rating),
  FULLTEXT idx_prop_search (title, locality, city, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  TABLE 3: amenities
-- ============================================================
CREATE TABLE IF NOT EXISTS amenities (
  id           INT          AUTO_INCREMENT PRIMARY KEY,
  property_id  INT          NOT NULL,
  name         VARCHAR(100) NOT NULL,

  CONSTRAINT fk_am_property FOREIGN KEY (property_id)
    REFERENCES properties(id) ON DELETE CASCADE,

  INDEX idx_am_property (property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  TABLE 4: property_images
-- ============================================================
CREATE TABLE IF NOT EXISTS property_images (
  id           INT          AUTO_INCREMENT PRIMARY KEY,
  property_id  INT          NOT NULL,
  url          VARCHAR(500) NOT NULL,
  is_primary   TINYINT(1)   DEFAULT 0,
  created_at   DATETIME     DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_img_property FOREIGN KEY (property_id)
    REFERENCES properties(id) ON DELETE CASCADE,

  INDEX idx_img_property (property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  TABLE 5: favorites
-- ============================================================
CREATE TABLE IF NOT EXISTS favorites (
  id           INT      AUTO_INCREMENT PRIMARY KEY,
  user_id      INT      NOT NULL,
  property_id  INT      NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_fav (user_id, property_id),

  CONSTRAINT fk_fav_user     FOREIGN KEY (user_id)     REFERENCES users(id)       ON DELETE CASCADE,
  CONSTRAINT fk_fav_property FOREIGN KEY (property_id) REFERENCES properties(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  TABLE 6: enquiries
-- ============================================================
CREATE TABLE IF NOT EXISTS enquiries (
  id           INT          AUTO_INCREMENT PRIMARY KEY,
  property_id  INT          NOT NULL,
  user_id      INT,
  name         VARCHAR(150) NOT NULL,
  email        VARCHAR(191) NOT NULL,
  phone        VARCHAR(25),
  message      TEXT,
  status       ENUM('new','read','replied') DEFAULT 'new',
  created_at   DATETIME     DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_enq_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  CONSTRAINT fk_enq_user     FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE SET NULL,

  INDEX idx_enq_property (property_id),
  INDEX idx_enq_user     (user_id),
  INDEX idx_enq_status   (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  TABLE 7: reviews
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id           INT          AUTO_INCREMENT PRIMARY KEY,
  property_id  INT,
  user_id      INT,
  name         VARCHAR(150) NOT NULL,
  role_label   VARCHAR(100) DEFAULT 'Member',
  rating       TINYINT      NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text  TEXT         NOT NULL,
  created_at   DATETIME     DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_rev_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  CONSTRAINT fk_rev_user     FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE SET NULL,

  INDEX idx_rev_property (property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  TABLE 8: visits
-- ============================================================
CREATE TABLE IF NOT EXISTS visits (
  id           INT          AUTO_INCREMENT PRIMARY KEY,
  property_id  INT          NOT NULL,
  user_id      INT,
  name         VARCHAR(150) NOT NULL,
  phone        VARCHAR(25),
  visit_date   DATE         NOT NULL,
  visit_time   VARCHAR(50),
  status       ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  created_at   DATETIME     DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_vis_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  CONSTRAINT fk_vis_user     FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE SET NULL,

  INDEX idx_vis_property   (property_id),
  INDEX idx_vis_visit_date (visit_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  CONFIRM all 8 tables created
-- ============================================================
SHOW TABLES;

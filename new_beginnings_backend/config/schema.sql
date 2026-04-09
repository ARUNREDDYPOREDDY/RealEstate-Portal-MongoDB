-- ============================================================
--  New Beginnings Real Estate Portal — PostgreSQL Schema
-- ============================================================

-- ── USERS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  first_name  VARCHAR(100) NOT NULL,
  last_name   VARCHAR(100) NOT NULL,
  email       VARCHAR(191) UNIQUE NOT NULL,
  phone       VARCHAR(20),
  city        VARCHAR(100),
  password    VARCHAR(255) NOT NULL,
  role        VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user','admin')),
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ── PROPERTIES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  type          VARCHAR(50) NOT NULL CHECK (type IN ('Apartment','Villa','Independent House','Land / Plot','Commercial')),
  price         BIGINT NOT NULL,
  area          DECIMAL(10,2) NOT NULL,
  beds          INT DEFAULT 0,
  baths         INT DEFAULT 0,
  city          VARCHAR(100) NOT NULL,
  locality      VARCHAR(150),
  address       TEXT,
  description   TEXT,
  owner_name    VARCHAR(150),
  owner_phone   VARCHAR(25),
  owner_id      INT,
  rating        DECIMAL(3,2) DEFAULT 0.00,
  review_count  INT DEFAULT 0,
  badge         VARCHAR(20) DEFAULT 'new' CHECK (badge IN ('featured','new','hot')),
  emoji         VARCHAR(10) DEFAULT '🏠',
  lat           DECIMAL(10,7),
  lng           DECIMAL(10,7),
  status        VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','pending','sold','rejected')),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_badge ON properties(badge);

-- ── AMENITIES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS amenities (
  id           SERIAL PRIMARY KEY,
  property_id  INT NOT NULL,
  name         VARCHAR(100) NOT NULL,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE INDEX idx_amenities_property ON amenities(property_id);

-- ── PROPERTY IMAGES ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS property_images (
  id           SERIAL PRIMARY KEY,
  property_id  INT NOT NULL,
  url          VARCHAR(500) NOT NULL,
  is_primary   BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE INDEX idx_images_property ON property_images(property_id);

-- ── FAVORITES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favorites (
  id           SERIAL PRIMARY KEY,
  user_id      INT NOT NULL,
  property_id  INT NOT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, property_id),
  FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- ── ENQUIRIES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enquiries (
  id           SERIAL PRIMARY KEY,
  property_id  INT NOT NULL,
  user_id      INT,
  name         VARCHAR(150) NOT NULL,
  email        VARCHAR(191) NOT NULL,
  phone        VARCHAR(25),
  message      TEXT,
  status       VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new','read','replied')),
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE SET NULL
);

CREATE INDEX idx_enquiries_property ON enquiries(property_id);
CREATE INDEX idx_enquiries_user ON enquiries(user_id);
CREATE INDEX idx_enquiries_status ON enquiries(status);

-- ── REVIEWS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id           SERIAL PRIMARY KEY,
  property_id  INT,
  user_id      INT,
  name         VARCHAR(150) NOT NULL,
  role_label   VARCHAR(100) DEFAULT 'Member',
  rating       INT CHECK (rating BETWEEN 1 AND 5),
  review_text  TEXT NOT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE SET NULL
);

CREATE INDEX idx_reviews_property ON reviews(property_id);

-- ── VISITS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS visits (
  id           SERIAL PRIMARY KEY,
  property_id  INT NOT NULL,
  user_id      INT,
  name         VARCHAR(150) NOT NULL,
  phone        VARCHAR(25),
  visit_date   DATE NOT NULL,
  visit_time   VARCHAR(50),
  status       VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE SET NULL
);
-- ============================================================
--  NEW BEGINNINGS — REAL ESTATE PORTAL
--  FILE 2 OF 4: Seed Users
--  Run AFTER 01_create_tables.sql
--  Command: mysql -u root -p new_beginnings_db < 02_seed_users.sql
-- ============================================================

USE new_beginnings_db;

-- ── Clear existing users (optional — remove if you want to keep data) ──
-- TRUNCATE TABLE users;

-- ── Insert demo users ─────────────────────────────────────────
-- Passwords stored as bcrypt hashes (cost factor 10):
--   user@demo.com  → plain password: demo123
--   admin@demo.com → plain password: admin123

INSERT INTO users
  (first_name, last_name, email, phone, city, password, role)
VALUES
  (
    'Arjun', 'Sharma',
    'user@demo.com',
    '+91 98765 43210',
    'Hyderabad',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    'user'
  ),
  (
    'Admin', 'User',
    'admin@demo.com',
    '+91 98765 00000',
    'Hyderabad',
    '$2a$10$gMCRBvz5wpmL.P9nkdPVAe3kbFCmXdC0PSlkQz4m4uShK0/YHd4.q',
    'admin'
  );

-- ── Verify ────────────────────────────────────────────────────
SELECT id, first_name, last_name, email, role, created_at FROM users;

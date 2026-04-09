-- ============================================================
--  NEW BEGINNINGS — REAL ESTATE PORTAL
--  USEFUL QUERIES  (reference & testing)
--  Run anytime after all seed files are loaded
--  Command: mysql -u root -p new_beginnings_db < 05_useful_queries.sql
-- ============================================================

USE new_beginnings_db;

-- ============================================================
--  SECTION 1: View all data
-- ============================================================

-- All users (without passwords)
SELECT id, first_name, last_name, email, phone, city, role, is_active, created_at
FROM users
ORDER BY id;

-- All properties with price formatted
SELECT
  id,
  title,
  type,
  CONCAT('₹', FORMAT(price, 0)) AS price,
  area,
  beds,
  city,
  locality,
  badge,
  status,
  rating,
  review_count
FROM properties
ORDER BY id;

-- All amenities grouped by property
SELECT
  p.id,
  p.title,
  GROUP_CONCAT(a.name ORDER BY a.name SEPARATOR ', ') AS amenities
FROM properties p
LEFT JOIN amenities a ON a.property_id = p.id
GROUP BY p.id, p.title
ORDER BY p.id;

-- All reviews with property name
SELECT
  r.id,
  IFNULL(p.title, 'Homepage Testimonial') AS property,
  r.name,
  r.role_label,
  r.rating,
  LEFT(r.review_text, 80) AS review_preview,
  r.created_at
FROM reviews r
LEFT JOIN properties p ON p.id = r.property_id
ORDER BY r.created_at DESC;

-- All enquiries with property name
SELECT
  e.id,
  p.title AS property,
  e.name,
  e.email,
  e.phone,
  LEFT(e.message, 60) AS message_preview,
  e.status,
  e.created_at
FROM enquiries e
JOIN properties p ON p.id = e.property_id
ORDER BY e.created_at DESC;

-- All visits with property name
SELECT
  v.id,
  p.title AS property,
  v.name,
  v.phone,
  v.visit_date,
  v.visit_time,
  v.status,
  v.created_at
FROM visits v
JOIN properties p ON p.id = v.property_id
ORDER BY v.visit_date ASC;

-- ============================================================
--  SECTION 2: Useful filter queries
-- ============================================================

-- Featured properties
SELECT id, title, type, price, city, rating
FROM properties
WHERE badge = 'featured' AND status = 'active'
ORDER BY rating DESC;

-- Properties by type
SELECT id, title, price, area, beds, city
FROM properties
WHERE type = 'Apartment' AND status = 'active'
ORDER BY price ASC;

-- Properties under ₹50 lakh
SELECT id, title, type, price, city
FROM properties
WHERE price <= 5000000 AND status = 'active'
ORDER BY price ASC;

-- Top rated properties
SELECT id, title, city, rating, review_count
FROM properties
WHERE status = 'active'
ORDER BY rating DESC
LIMIT 5;

-- Properties with swimming pool
SELECT p.id, p.title, p.city, p.price
FROM properties p
JOIN amenities a ON a.property_id = p.id
WHERE a.name = 'Swimming Pool' AND p.status = 'active'
ORDER BY p.price DESC;

-- Full text search (title, locality, city, description)
SELECT id, title, city, locality, price
FROM properties
WHERE MATCH(title, locality, city, description) AGAINST ('luxury villa' IN NATURAL LANGUAGE MODE);

-- ============================================================
--  SECTION 3: Admin dashboard stats
-- ============================================================
SELECT
  (SELECT COUNT(*) FROM properties WHERE status = 'active')   AS active_properties,
  (SELECT COUNT(*) FROM properties WHERE status = 'pending')  AS pending_approvals,
  (SELECT COUNT(*) FROM properties WHERE status = 'sold')     AS sold_properties,
  (SELECT COUNT(*) FROM users WHERE role = 'user')            AS total_users,
  (SELECT COUNT(*) FROM enquiries)                            AS total_enquiries,
  (SELECT COUNT(*) FROM enquiries WHERE status = 'new')       AS new_enquiries,
  (SELECT COUNT(*) FROM reviews WHERE property_id IS NOT NULL) AS property_reviews,
  (SELECT COUNT(*) FROM visits WHERE status = 'pending')       AS pending_visits;

-- Properties added this week
SELECT id, title, city, status, created_at
FROM properties
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY created_at DESC;

-- Users registered this week
SELECT id, first_name, last_name, email, role, created_at
FROM users
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY created_at DESC;

-- ============================================================
--  SECTION 4: Common admin operations
-- ============================================================

-- Approve a pending property (replace 1 with actual property id)
-- UPDATE properties SET status = 'active' WHERE id = 1;

-- Reject a pending property
-- UPDATE properties SET status = 'rejected' WHERE id = 1;

-- Mark a property as sold
-- UPDATE properties SET status = 'sold' WHERE id = 1;

-- Block a user
-- UPDATE users SET is_active = 0 WHERE id = 1;

-- Unblock a user
-- UPDATE users SET is_active = 1 WHERE id = 1;

-- Mark enquiry as read
-- UPDATE enquiries SET status = 'read' WHERE id = 1;

-- Delete a property (cascades to amenities, images, favorites, enquiries, reviews, visits)
-- DELETE FROM properties WHERE id = 1;

-- ============================================================
--  SECTION 5: Reset database (danger — deletes ALL data)
-- ============================================================

-- Uncomment lines below to reset everything:
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE visits;
-- TRUNCATE TABLE reviews;
-- TRUNCATE TABLE enquiries;
-- TRUNCATE TABLE favorites;
-- TRUNCATE TABLE property_images;
-- TRUNCATE TABLE amenities;
-- TRUNCATE TABLE properties;
-- TRUNCATE TABLE users;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
--  NEW BEGINNINGS — REAL ESTATE PORTAL
--  FILE 3 OF 4: Seed Properties & Amenities
--  Run AFTER 02_seed_users.sql
--  Command: mysql -u root -p new_beginnings_db < 03_seed_properties.sql
-- ============================================================

USE new_beginnings_db;

-- ============================================================
--  PROPERTIES  (12 listings)
-- ============================================================
INSERT INTO properties
  (title, type, price, area, beds, baths,
   city, locality, address, description,
   owner_name, owner_phone,
   rating, review_count, badge, emoji,
   lat, lng, status)
VALUES

-- 1 ── Luxury 3BHK, Banjara Hills
(
  'Luxury 3BHK in Banjara Hills',
  'Apartment', 8500000, 1800.00, 3, 3,
  'Hyderabad', 'Banjara Hills',
  'Road No. 12, Banjara Hills, Hyderabad',
  'A stunning luxury apartment with panoramic city views. Premium fittings, modular kitchen, and world-class amenities make this a dream home.',
  'Rajesh Reddy', '+91 98765 12345',
  4.80, 24, 'featured', '🏢',
  17.4156000, 78.4347000, 'active'
),

-- 2 ── Modern Villa, Jubilee Hills
(
  'Modern Villa in Jubilee Hills',
  'Villa', 25000000, 4200.00, 5, 6,
  'Hyderabad', 'Jubilee Hills',
  'Plot 23, Road 36, Jubilee Hills',
  'An architectural masterpiece spanning 4200 sq.ft. Sprawling lawns, private swimming pool, and luxury interiors define this property.',
  'Priya Nair', '+91 98765 23456',
  4.90, 12, 'featured', '🏡',
  17.4229000, 78.4062000, 'active'
),

-- 3 ── Affordable 2BHK, Kukatpally
(
  'Affordable 2BHK in Kukatpally',
  'Apartment', 4200000, 1100.00, 2, 2,
  'Hyderabad', 'Kukatpally',
  'KPHB Phase 6, Kukatpally',
  'Well-maintained apartment in a prime residential area. Close to HITEC City, ideal for IT professionals.',
  'Mohammed Farhan', '+91 98765 34567',
  4.20, 31, 'new', '🏠',
  17.4947000, 78.3996000, 'active'
),

-- 4 ── Commercial Space, Madhapur
(
  'Commercial Space in Madhapur',
  'Commercial', 15000000, 3500.00, 0, 4,
  'Hyderabad', 'Madhapur',
  'Cyber Towers, Madhapur, Hyderabad',
  'Premium Grade-A commercial office space in the heart of HITEC City. Excellent connectivity and modern infrastructure.',
  'Suresh Kumar', '+91 98765 45678',
  4.50, 8, 'hot', '🏗️',
  17.4486000, 78.3908000, 'active'
),

-- 5 ── Independent House, Kompally
(
  'Independent House in Kompally',
  'Independent House', 6800000, 2200.00, 4, 3,
  'Hyderabad', 'Kompally',
  'Suchitra Junction, Kompally',
  'Spacious independent house with a beautiful garden. Perfect for families looking for space and privacy.',
  'Lakshmi Devi', '+91 98765 56789',
  4.30, 15, 'new', '🏘️',
  17.5463000, 78.4884000, 'active'
),

-- 6 ── Plot, Shamshabad
(
  'Plot in Shamshabad',
  'Land / Plot', 3500000, 2000.00, 0, 0,
  'Hyderabad', 'Shamshabad',
  'Near RGIA, Shamshabad',
  'DTCP approved layout plot with clear titles. Excellent investment opportunity near international airport.',
  'Ravi Teja', '+91 98765 67890',
  4.00, 6, 'featured', '🌿',
  17.2403000, 78.4294000, 'active'
),

-- 7 ── 1BHK Studio, Gachibowli
(
  '1BHK Studio in Gachibowli',
  'Apartment', 2800000, 650.00, 1, 1,
  'Hyderabad', 'Gachibowli',
  'DLF Cyber City, Gachibowli',
  'Compact studio apartment ideal for working professionals. Fully furnished with modern amenities.',
  'Ananya Singh', '+91 98765 78901',
  4.60, 42, 'hot', '🏢',
  17.4400000, 78.3489000, 'active'
),

-- 8 ── Luxury Penthouse, HITEC City
(
  'Luxury Penthouse in Hitech City',
  'Apartment', 35000000, 5500.00, 5, 6,
  'Hyderabad', 'HITEC City',
  'Salarpuria Sattva, HITEC City',
  'Sky-high penthouse with 360° city views. Private terrace, jacuzzi, home theatre and sky lounge.',
  'Vikram Malhotra', '+91 98765 89012',
  5.00, 4, 'featured', '🌆',
  17.4475000, 78.3762000, 'active'
),

-- 9 ── Villa, Gandipet
(
  'Villa in Gandipet',
  'Villa', 18000000, 3800.00, 4, 5,
  'Hyderabad', 'Gandipet',
  'Osman Sagar Road, Gandipet',
  'Lakeside villa with serene Osman Sagar views. Private boat dock, organic farm, and infinity pool.',
  'Harsha Varma', '+91 98765 90123',
  4.70, 9, 'featured', '🏡',
  17.3942000, 78.2952000, 'active'
),

-- 10 ── 3BHK, Miyapur
(
  '3BHK in Miyapur',
  'Apartment', 5200000, 1450.00, 3, 2,
  'Hyderabad', 'Miyapur',
  'Metro Station Road, Miyapur',
  'Well-located apartment near Miyapur Metro Station. Modern amenities and excellent connectivity.',
  'Srinivas Rao', '+91 98765 01234',
  4.10, 18, 'new', '🏠',
  17.4953000, 78.3488000, 'active'
),

-- 11 ── Commercial Plot, Uppal
(
  'Commercial Plot in Uppal',
  'Land / Plot', 7500000, 3000.00, 0, 0,
  'Hyderabad', 'Uppal',
  'Uppal X Roads, Hyderabad',
  'Prime commercial plot on main road with high visibility. Suitable for showroom, hospital or retail outlet.',
  'Praveen Kumar', '+91 98765 11111',
  4.30, 5, 'hot', '🌿',
  17.4057000, 78.5590000, 'active'
),

-- 12 ── Heritage Bungalow, Secunderabad
(
  'Heritage Bungalow in Secunderabad',
  'Independent House', 12000000, 3200.00, 5, 4,
  'Hyderabad', 'Secunderabad',
  'Trimulgherry, Secunderabad',
  'Rare 80-year-old heritage bungalow with colonial architecture. Restored with modern amenities while preserving original charm.',
  'Col. Anand Krishnan', '+91 98765 22222',
  4.80, 7, 'featured', '🏛️',
  17.4399000, 78.4983000, 'active'
);

-- ============================================================
--  AMENITIES  (42 rows across 10 properties)
-- ============================================================
INSERT INTO amenities (property_id, name) VALUES

-- Property 1 — Luxury 3BHK, Banjara Hills
(1, 'Parking'),
(1, 'Swimming Pool'),
(1, 'Gym'),
(1, 'Security'),
(1, 'Power Backup'),
(1, 'Lift'),

-- Property 2 — Modern Villa, Jubilee Hills
(2, 'Parking'),
(2, 'Swimming Pool'),
(2, 'Gym'),
(2, 'Security'),
(2, 'Power Backup'),
(2, 'Lift'),
(2, 'Garden'),
(2, 'Club House'),

-- Property 3 — Affordable 2BHK, Kukatpally
(3, 'Parking'),
(3, 'Security'),
(3, 'Power Backup'),
(3, 'Lift'),

-- Property 4 — Commercial Space, Madhapur
(4, 'Parking'),
(4, 'Security'),
(4, 'Power Backup'),
(4, 'Lift'),
(4, 'Club House'),

-- Property 5 — Independent House, Kompally
(5, 'Parking'),
(5, 'Garden'),
(5, 'Security'),

-- Property 6 — Plot, Shamshabad: no amenities

-- Property 7 — 1BHK Studio, Gachibowli
(7, 'Parking'),
(7, 'Gym'),
(7, 'Security'),
(7, 'Power Backup'),
(7, 'Lift'),
(7, 'Swimming Pool'),

-- Property 8 — Luxury Penthouse, HITEC City
(8, 'Parking'),
(8, 'Swimming Pool'),
(8, 'Gym'),
(8, 'Security'),
(8, 'Power Backup'),
(8, 'Lift'),
(8, 'Garden'),
(8, 'Club House'),

-- Property 9 — Villa, Gandipet
(9, 'Parking'),
(9, 'Swimming Pool'),
(9, 'Garden'),
(9, 'Security'),

-- Property 10 — 3BHK, Miyapur
(10, 'Parking'),
(10, 'Security'),
(10, 'Power Backup'),
(10, 'Lift'),

-- Property 11 — Commercial Plot, Uppal: no amenities

-- Property 12 — Heritage Bungalow, Secunderabad
(12, 'Parking'),
(12, 'Garden'),
(12, 'Security');

-- ── Verify ────────────────────────────────────────────────────
SELECT id, title, type, price, city, badge, status FROM properties ORDER BY id;
SELECT property_id, GROUP_CONCAT(name ORDER BY name SEPARATOR ', ') AS amenities
FROM amenities GROUP BY property_id ORDER BY property_id;

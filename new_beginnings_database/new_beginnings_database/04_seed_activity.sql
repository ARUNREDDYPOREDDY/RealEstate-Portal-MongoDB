-- ============================================================
--  NEW BEGINNINGS — REAL ESTATE PORTAL
--  FILE 4 OF 4: Seed Reviews, Enquiries & Visits
--  Run AFTER 03_seed_properties.sql
--  Command: mysql -u root -p new_beginnings_db < 04_seed_activity.sql
-- ============================================================

USE new_beginnings_db;

-- ============================================================
--  REVIEWS  (3 homepage testimonials + 3 property reviews)
-- ============================================================

-- Homepage testimonials (property_id = NULL)
INSERT INTO reviews
  (property_id, user_id, name, role_label, rating, review_text)
VALUES
  (
    NULL, NULL,
    'Siddharth Reddy', 'Home Buyer', 5,
    'New Beginnings made our house-hunting journey so seamless! The filters, the map view, and the EMI calculator helped us make a confident decision. Found our dream home in Banjara Hills.'
  ),
  (
    NULL, NULL,
    'Meena Krishnan', 'Property Seller', 5,
    'As a seller, the platform gave my property incredible visibility. Within 2 weeks of listing, I had 12 enquiries. The admin panel is very professional and intuitive.'
  ),
  (
    NULL, NULL,
    'Rahul Agarwal', 'Real Estate Investor', 4,
    'The comparison feature is a game-changer. I compared 3 properties side by side and made my investment decision confidently. Highly recommend for anyone serious about real estate.'
  );

-- Property-specific reviews (user_id = 1 → Arjun Sharma)
INSERT INTO reviews
  (property_id, user_id, name, role_label, rating, review_text)
VALUES
  (
    1, 1,
    'Arjun Sharma', 'Verified Buyer', 5,
    'Absolutely stunning property! The views from the balcony are breathtaking. Premium quality fittings and the location is unbeatable.'
  ),
  (
    2, 1,
    'Arjun Sharma', 'Site Visitor', 5,
    'The villa is even more spectacular in person. The garden is massive and the pool area is luxurious. Definitely worth every rupee.'
  ),
  (
    7, 1,
    'Arjun Sharma', 'Tenant', 4,
    'Perfect studio for a working professional. Well-maintained and the gym facilities are top-notch. Great value for Gachibowli.'
  );

-- ============================================================
--  ENQUIRIES  (3 sample enquiries)
-- ============================================================
INSERT INTO enquiries
  (property_id, user_id, name, email, phone, message, status)
VALUES
  (
    1, 1,
    'Arjun Sharma', 'user@demo.com', '+91 98765 43210',
    'Hi, I am interested in "Luxury 3BHK in Banjara Hills". Could you arrange a site visit this weekend?',
    'read'
  ),
  (
    2, NULL,
    'Kavya Reddy', 'kavya.reddy@gmail.com', '+91 91234 56789',
    'Please share the floor plan and available photos of the villa. Also, is the price negotiable?',
    'new'
  ),
  (
    7, 1,
    'Arjun Sharma', 'user@demo.com', '+91 98765 43210',
    'Is the studio fully furnished? What is the monthly maintenance cost?',
    'replied'
  );

-- ============================================================
--  VISITS  (3 scheduled site visits)
-- ============================================================
INSERT INTO visits
  (property_id, user_id, name, phone, visit_date, visit_time, status)
VALUES
  (
    1, 1,
    'Arjun Sharma', '+91 98765 43210',
    DATE_ADD(CURDATE(), INTERVAL 3 DAY),
    'Morning (9–12 AM)',
    'confirmed'
  ),
  (
    8, 1,
    'Arjun Sharma', '+91 98765 43210',
    DATE_ADD(CURDATE(), INTERVAL 7 DAY),
    'Evening (4–7 PM)',
    'pending'
  ),
  (
    2, NULL,
    'Priya Menon', '+91 90000 11111',
    DATE_ADD(CURDATE(), INTERVAL 5 DAY),
    'Afternoon (12–3 PM)',
    'pending'
  );

-- ============================================================
--  FINAL VERIFY — row counts for all 8 tables
-- ============================================================
SELECT 'users'           AS `table`, COUNT(*) AS total_rows FROM users
UNION ALL
SELECT 'properties',                 COUNT(*)               FROM properties
UNION ALL
SELECT 'amenities',                  COUNT(*)               FROM amenities
UNION ALL
SELECT 'property_images',            COUNT(*)               FROM property_images
UNION ALL
SELECT 'favorites',                  COUNT(*)               FROM favorites
UNION ALL
SELECT 'enquiries',                  COUNT(*)               FROM enquiries
UNION ALL
SELECT 'reviews',                    COUNT(*)               FROM reviews
UNION ALL
SELECT 'visits',                     COUNT(*)               FROM visits;

-- ============================================================
--  NEW BEGINNINGS — REAL ESTATE PORTAL
--  Compatible with FreeSQLDatabase (MySQL 5.x)
-- ============================================================

-- ── TABLE: users ─────────────────────────────────────────────
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
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ── TABLE: properties ────────────────────────────────────────
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
  emoji         VARCHAR(10)   DEFAULT '',
  lat           DECIMAL(10,7),
  lng           DECIMAL(10,7),
  status        ENUM('active','pending','sold','rejected') DEFAULT 'active',
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ── TABLE: amenities ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS amenities (
  id           INT          AUTO_INCREMENT PRIMARY KEY,
  property_id  INT          NOT NULL,
  name         VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ── TABLE: property_images ───────────────────────────────────
CREATE TABLE IF NOT EXISTS property_images (
  id           INT          AUTO_INCREMENT PRIMARY KEY,
  property_id  INT          NOT NULL,
  url          VARCHAR(500) NOT NULL,
  is_primary   TINYINT(1)   DEFAULT 0,
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ── TABLE: favorites ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favorites (
  id           INT      AUTO_INCREMENT PRIMARY KEY,
  user_id      INT      NOT NULL,
  property_id  INT      NOT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_fav (user_id, property_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ── TABLE: enquiries ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enquiries (
  id           INT          AUTO_INCREMENT PRIMARY KEY,
  property_id  INT          NOT NULL,
  user_id      INT,
  name         VARCHAR(150) NOT NULL,
  email        VARCHAR(191) NOT NULL,
  phone        VARCHAR(25),
  message      TEXT,
  status       ENUM('new','read','replied') DEFAULT 'new',
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ── TABLE: reviews ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id           INT          AUTO_INCREMENT PRIMARY KEY,
  property_id  INT,
  user_id      INT,
  name         VARCHAR(150) NOT NULL,
  role_label   VARCHAR(100) DEFAULT 'Member',
  rating       TINYINT      NOT NULL,
  review_text  TEXT         NOT NULL,
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ── TABLE: visits ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS visits (
  id           INT          AUTO_INCREMENT PRIMARY KEY,
  property_id  INT          NOT NULL,
  user_id      INT,
  name         VARCHAR(150) NOT NULL,
  phone        VARCHAR(25),
  visit_date   DATE         NOT NULL,
  visit_time   VARCHAR(50),
  status       ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ============================================================
--  SEED DATA
-- ============================================================

-- ── Users ─────────────────────────────────────────────────────
INSERT INTO users (first_name, last_name, email, phone, city, password, role) VALUES
('Arjun', 'Sharma', 'user@demo.com', '+91 98765 43210', 'Hyderabad', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'user'),
('Admin', 'User', 'admin@demo.com', '+91 98765 00000', 'Hyderabad', '$2a$10$gMCRBvz5wpmL.P9nkdPVAe3kbFCmXdC0PSlkQz4m4uShK0/YHd4.q', 'admin');

-- ── Properties ────────────────────────────────────────────────
INSERT INTO properties (title, type, price, area, beds, baths, city, locality, address, description, owner_name, owner_phone, rating, review_count, badge, emoji, lat, lng, status) VALUES
('Luxury 3BHK in Banjara Hills', 'Apartment', 8500000, 1800, 3, 3, 'Hyderabad', 'Banjara Hills', 'Road No. 12, Banjara Hills, Hyderabad', 'A stunning luxury apartment with panoramic city views. Premium fittings, modular kitchen, and world-class amenities make this a dream home.', 'Rajesh Reddy', '+91 98765 12345', 4.8, 24, 'featured', '', 17.4156, 78.4347, 'active'),
('Modern Villa in Jubilee Hills', 'Villa', 25000000, 4200, 5, 6, 'Hyderabad', 'Jubilee Hills', 'Plot 23, Road 36, Jubilee Hills', 'An architectural masterpiece spanning 4200 sq.ft. Sprawling lawns, private swimming pool, and luxury interiors define this property.', 'Priya Nair', '+91 98765 23456', 4.9, 12, 'featured', '', 17.4229, 78.4062, 'active'),
('Affordable 2BHK in Kukatpally', 'Apartment', 4200000, 1100, 2, 2, 'Hyderabad', 'Kukatpally', 'KPHB Phase 6, Kukatpally', 'Well-maintained apartment in a prime residential area. Close to HITEC City, ideal for IT professionals.', 'Mohammed Farhan', '+91 98765 34567', 4.2, 31, 'new', '', 17.4947, 78.3996, 'active'),
('Commercial Space in Madhapur', 'Commercial', 15000000, 3500, 0, 4, 'Hyderabad', 'Madhapur', 'Cyber Towers, Madhapur, Hyderabad', 'Premium Grade-A commercial office space in the heart of HITEC City. Excellent connectivity and modern infrastructure.', 'Suresh Kumar', '+91 98765 45678', 4.5, 8, 'hot', '', 17.4486, 78.3908, 'active'),
('Independent House in Kompally', 'Independent House', 6800000, 2200, 4, 3, 'Hyderabad', 'Kompally', 'Suchitra Junction, Kompally', 'Spacious independent house with a beautiful garden. Perfect for families looking for space and privacy.', 'Lakshmi Devi', '+91 98765 56789', 4.3, 15, 'new', '', 17.5463, 78.4884, 'active'),
('Plot in Shamshabad', 'Land / Plot', 3500000, 2000, 0, 0, 'Hyderabad', 'Shamshabad', 'Near RGIA, Shamshabad', 'DTCP approved layout plot with clear titles. Excellent investment opportunity near international airport.', 'Ravi Teja', '+91 98765 67890', 4.0, 6, 'featured', '', 17.2403, 78.4294, 'active'),
('1BHK Studio in Gachibowli', 'Apartment', 2800000, 650, 1, 1, 'Hyderabad', 'Gachibowli', 'DLF Cyber City, Gachibowli', 'Compact studio apartment ideal for working professionals. Fully furnished with modern amenities.', 'Ananya Singh', '+91 98765 78901', 4.6, 42, 'hot', '', 17.4400, 78.3489, 'active'),
('Luxury Penthouse in Hitech City', 'Apartment', 35000000, 5500, 5, 6, 'Hyderabad', 'HITEC City', 'Salarpuria Sattva, HITEC City', 'Sky-high penthouse with 360 city views. Private terrace, jacuzzi, home theatre and sky lounge.', 'Vikram Malhotra', '+91 98765 89012', 5.0, 4, 'featured', '', 17.4475, 78.3762, 'active'),
('Villa in Gandipet', 'Villa', 18000000, 3800, 4, 5, 'Hyderabad', 'Gandipet', 'Osman Sagar Road, Gandipet', 'Lakeside villa with serene Osman Sagar views. Private boat dock, organic farm, and infinity pool.', 'Harsha Varma', '+91 98765 90123', 4.7, 9, 'featured', '', 17.3942, 78.2952, 'active'),
('3BHK in Miyapur', 'Apartment', 5200000, 1450, 3, 2, 'Hyderabad', 'Miyapur', 'Metro Station Road, Miyapur', 'Well-located apartment near Miyapur Metro Station. Modern amenities and excellent connectivity.', 'Srinivas Rao', '+91 98765 01234', 4.1, 18, 'new', '', 17.4953, 78.3488, 'active'),
('Commercial Plot in Uppal', 'Land / Plot', 7500000, 3000, 0, 0, 'Hyderabad', 'Uppal', 'Uppal X Roads, Hyderabad', 'Prime commercial plot on main road with high visibility. Suitable for showroom, hospital or retail outlet.', 'Praveen Kumar', '+91 98765 11111', 4.3, 5, 'hot', '', 17.4057, 78.5590, 'active'),
('Heritage Bungalow in Secunderabad', 'Independent House', 12000000, 3200, 5, 4, 'Hyderabad', 'Secunderabad', 'Trimulgherry, Secunderabad', 'Rare 80-year-old heritage bungalow with colonial architecture. Restored with modern amenities while preserving original charm.', 'Col. Anand Krishnan', '+91 98765 22222', 4.8, 7, 'featured', '', 17.4399, 78.4983, 'active');

-- ── Amenities ─────────────────────────────────────────────────
INSERT INTO amenities (property_id, name) VALUES
(1,'Parking'),(1,'Swimming Pool'),(1,'Gym'),(1,'Security'),(1,'Power Backup'),(1,'Lift'),
(2,'Parking'),(2,'Swimming Pool'),(2,'Gym'),(2,'Security'),(2,'Power Backup'),(2,'Lift'),(2,'Garden'),(2,'Club House'),
(3,'Parking'),(3,'Security'),(3,'Power Backup'),(3,'Lift'),
(4,'Parking'),(4,'Security'),(4,'Power Backup'),(4,'Lift'),(4,'Club House'),
(5,'Parking'),(5,'Garden'),(5,'Security'),
(7,'Parking'),(7,'Gym'),(7,'Security'),(7,'Power Backup'),(7,'Lift'),(7,'Swimming Pool'),
(8,'Parking'),(8,'Swimming Pool'),(8,'Gym'),(8,'Security'),(8,'Power Backup'),(8,'Lift'),(8,'Garden'),(8,'Club House'),
(9,'Parking'),(9,'Swimming Pool'),(9,'Garden'),(9,'Security'),
(10,'Parking'),(10,'Security'),(10,'Power Backup'),(10,'Lift'),
(12,'Parking'),(12,'Garden'),(12,'Security');

-- ── Reviews ───────────────────────────────────────────────────
INSERT INTO reviews (property_id, user_id, name, role_label, rating, review_text) VALUES
(NULL, NULL, 'Siddharth Reddy', 'Home Buyer', 5, 'New Beginnings made our house-hunting journey so seamless! The filters, the map view, and the EMI calculator helped us make a confident decision. Found our dream home in Banjara Hills.'),
(NULL, NULL, 'Meena Krishnan', 'Property Seller', 5, 'As a seller, the platform gave my property incredible visibility. Within 2 weeks of listing, I had 12 enquiries. The admin panel is very professional and intuitive.'),
(NULL, NULL, 'Rahul Agarwal', 'Real Estate Investor', 4, 'The comparison feature is a game-changer. I compared 3 properties side by side and made my investment decision confidently. Highly recommend for anyone serious about real estate.'),
(1, 1, 'Arjun Sharma', 'Verified Buyer', 5, 'Absolutely stunning property! The views from the balcony are breathtaking. Premium quality fittings and the location is unbeatable.'),
(2, 1, 'Arjun Sharma', 'Site Visitor', 5, 'The villa is even more spectacular in person. The garden is massive and the pool area is luxurious. Definitely worth every rupee.'),
(7, 1, 'Arjun Sharma', 'Tenant', 4, 'Perfect studio for a working professional. Well-maintained and the gym facilities are top-notch. Great value for Gachibowli.');

-- ── Enquiries ─────────────────────────────────────────────────
INSERT INTO enquiries (property_id, user_id, name, email, phone, message, status) VALUES
(1, 1, 'Arjun Sharma', 'user@demo.com', '+91 98765 43210', 'Hi, I am interested in Luxury 3BHK in Banjara Hills. Could you arrange a site visit this weekend?', 'read'),
(2, NULL, 'Kavya Reddy', 'kavya.reddy@gmail.com', '+91 91234 56789', 'Please share the floor plan and available photos of the villa. Also, is the price negotiable?', 'new'),
(7, 1, 'Arjun Sharma', 'user@demo.com', '+91 98765 43210', 'Is the studio fully furnished? What is the monthly maintenance cost?', 'replied');

-- ── Visits ────────────────────────────────────────────────────
INSERT INTO visits (property_id, user_id, name, phone, visit_date, visit_time, status) VALUES
(1, 1, 'Arjun Sharma', '+91 98765 43210', '2026-03-25', 'Morning (9-12 AM)', 'confirmed'),
(8, 1, 'Arjun Sharma', '+91 98765 43210', '2026-03-28', 'Evening (4-7 PM)', 'pending'),
(2, NULL, 'Priya Menon', '+91 90000 11111', '2026-03-26', 'Afternoon (12-3 PM)', 'pending');

-- ── Verify ────────────────────────────────────────────────────
SELECT 'users' AS tablename, COUNT(*) AS total FROM users
UNION ALL SELECT 'properties', COUNT(*) FROM properties
UNION ALL SELECT 'amenities', COUNT(*) FROM amenities
UNION ALL SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL SELECT 'enquiries', COUNT(*) FROM enquiries
UNION ALL SELECT 'visits', COUNT(*) FROM visits;

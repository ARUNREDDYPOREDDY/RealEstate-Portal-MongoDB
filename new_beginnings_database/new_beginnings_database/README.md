# New Beginnings — MySQL Database Folder

## Files in this folder

| File | Purpose | Run order |
|------|---------|-----------|
| `database.sql` | **All-in-one** — creates DB + all tables + all seed data in one shot | Run this alone |
| `01_create_tables.sql` | Creates the database and all 8 tables | 1st |
| `02_seed_users.sql` | Inserts 2 demo users (user + admin) | 2nd |
| `03_seed_properties.sql` | Inserts 12 properties + 42 amenity rows | 3rd |
| `04_seed_activity.sql` | Inserts reviews, enquiries, visits | 4th |
| `05_useful_queries.sql` | Reference queries for testing & admin work | Anytime |

---

## Quick start (one command)

```bash
mysql -u root -p < database.sql
```

This single file does everything: creates the DB, all 8 tables, and all seed data.

---

## Step-by-step (individual files)

```bash
mysql -u root -p < 01_create_tables.sql
mysql -u root -p new_beginnings_db < 02_seed_users.sql
mysql -u root -p new_beginnings_db < 03_seed_properties.sql
mysql -u root -p new_beginnings_db < 04_seed_activity.sql
```

---

## Using MySQL Workbench or phpMyAdmin

1. Open the tool and connect to your MySQL server
2. Open `database.sql`
3. Click **Run** (or press Ctrl+Shift+Enter)

---

## Database tables

| Table | Rows seeded | Description |
|-------|-------------|-------------|
| `users` | 2 | Registered users with bcrypt passwords |
| `properties` | 12 | Property listings with coords & badges |
| `amenities` | 42 | Amenities linked to properties |
| `property_images` | 0 | Uploaded images (added via API) |
| `favorites` | 0 | User saved properties (added via API) |
| `enquiries` | 3 | Sample buyer enquiries |
| `reviews` | 6 | 3 testimonials + 3 property reviews |
| `visits` | 3 | Sample scheduled site visits |

---

## Demo login credentials

| Role | Email | Password |
|------|-------|----------|
| User | user@demo.com | demo123 |
| Admin | admin@demo.com | admin123 |

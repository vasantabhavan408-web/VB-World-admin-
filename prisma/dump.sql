BEGIN;

-- Drop existing tables to ensure clean sync
DROP TABLE IF EXISTS "BranchGalleryImage" CASCADE;
DROP TABLE IF EXISTS "MenuExperience" CASCADE;
DROP TABLE IF EXISTS "MenuBlock" CASCADE;
DROP TABLE IF EXISTS "MenuCategory" CASCADE;
DROP TABLE IF EXISTS "PrivacyPolicyCTA" CASCADE;
DROP TABLE IF EXISTS "Location" CASCADE;
DROP TABLE IF EXISTS "Country" CASCADE;
DROP TABLE IF EXISTS "HeroConfig" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Table: User
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Table: HeroConfig
CREATE TABLE "HeroConfig" (
    "id" SERIAL PRIMARY KEY,
    "page" TEXT NOT NULL DEFAULT 'home',
    "titleHtml" TEXT NOT NULL,
    "subtitleHtml" TEXT NOT NULL,
    "webBannerUrl" TEXT NOT NULL,
    "mobileBannerUrl" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "HeroConfig_page_key" ON "HeroConfig"("page");

-- Table: Country
CREATE TABLE "Country" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "overrideCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- Table: Location
CREATE TABLE "Location" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "comingSoon" BOOLEAN NOT NULL DEFAULT false,
    "directionLink" TEXT,
    "contactLink" TEXT,
    "countryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Location_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: PrivacyPolicyCTA
CREATE TABLE "PrivacyPolicyCTA" (
    "id" SERIAL PRIMARY KEY,
    "page" TEXT NOT NULL DEFAULT 'privacy',
    "imageUrl" TEXT NOT NULL,
    "titleHtml" TEXT NOT NULL,
    "subtitleHtml" TEXT NOT NULL,
    "contactUsUrl" TEXT NOT NULL,
    "exploreMenuUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "PrivacyPolicyCTA_page_key" ON "PrivacyPolicyCTA"("page");

-- Table: MenuCategory
CREATE TABLE "MenuCategory" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "width" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: MenuBlock
CREATE TABLE "MenuBlock" (
    "id" TEXT PRIMARY KEY,
    "imageUrl" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "titleHighlight" TEXT NOT NULL,
    "titleNormal" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "badgeLabel" TEXT,
    "badgeTitle" TEXT,
    "badgeDescription" TEXT,
    "badgeLink" TEXT,
    "buttonLabel" TEXT,
    "align" TEXT NOT NULL DEFAULT 'left',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MenuBlock_id_fkey" FOREIGN KEY ("id") REFERENCES "MenuCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: MenuExperience
CREATE TABLE "MenuExperience" (
    "id" TEXT PRIMARY KEY,
    "time" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: BranchGalleryImage
CREATE TABLE "BranchGalleryImage" (
    "id" SERIAL PRIMARY KEY,
    "imageUrl" TEXT NOT NULL,
    "row" INTEGER NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 1. Insert Admin User
INSERT INTO "User" ("id", "email", "name", "password", "createdAt", "updatedAt") VALUES
(1, 'admin@framer.com', 'Administrator', '$2b$10$7R04y3aG7ySj0lq.R406fe1dEceHn3m/nK0t1z7e1E0.UoJ7H9Lye', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 2. Insert Countries & Locations
INSERT INTO "Country" ("id", "name", "overrideCount", "createdAt", "updatedAt") VALUES (11, 'India', 20, '2026-06-24T16:06:05.211Z', '2026-06-26T09:52:47.104Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (53, 'Vasantha Bhavan - Anna Nagar', '45, AD Block, Shanthi Colony, Anna Nagar, Chennai, Tamil Nadu 600040', '+91 98413 99994', '07:00 AM - 12:00 AM', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1785334394586-374827696.webp', 'Tamil Nadu', 'Chennai', false, 'https://maps.app.goo.gl/dyAiJSuP6sgP6r8T6', 'tel:+919841399994', 11, '2026-06-24T16:06:05.325Z', '2026-07-29T14:13:15.711Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (54, 'Namma Veedu Vasantha Bhavan - Egmore-II', '47, Gandhi Irwin Rd, Egmore, Chennai, Tamil Nadu 600008', '+91 98413 99994', '04:00 AM - 11:00 PM', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1782374616904-601157505.webp', 'Tamil Nadu', 'Chennai', false, 'https://maps.app.goo.gl/PCNBGikdYxCrZMJZ9', 'tel:+919841399994', 11, '2026-06-24T16:06:05.487Z', '2026-07-03T04:52:38.607Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (55, 'Namma Veedu Vasantha Bhavan - Egmore-I', 'shop No.33, Gandhi Irwin Rd, Egmore, Chennai, Tamil Nadu 600008', '+91 98413 99994', '05:30 AM - 12:00 AM', '/uploads/default-web.jpg', 'Tamil Nadu', 'Chennai', false, 'https://maps.app.goo.gl/aW3zztstDBbEcVKA9', 'tel:+919841399994', 11, '2026-06-24T16:06:05.560Z', '2026-07-03T04:52:48.831Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (56, 'Vasantha Bhavan - Kanchipuram', '504, Gandhi Rd, Kanchipuram, Tamil Nadu 631501', '+91 98413 99994', '06:00 AM - 11:00 PM', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1785328923364-425610595.webp', 'Tamil Nadu', 'Kanchipuram', false, 'https://maps.app.goo.gl/hRZwaRNLKvjW6Geq8', 'tel:+919841399994', 11, '2026-06-24T16:06:05.641Z', '2026-07-29T12:42:06.848Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (57, 'Namma Veedu Vasantha Bhavan - Maduravoyal', 'Poonamallee High Rd, Varalakshmi Nagar, Sentamil Nagar, Maduravoyal, Chennai, Tamil Nadu 600095', '+91 98413 99994', '06:00 AM - 12:00 AM', '/uploads/default-web.jpg', 'Tamil Nadu', 'Chennai', false, 'https://maps.app.goo.gl/DtYEgyvMx7QoaNiQ8', 'tel:+919841399994', 11, '2026-06-24T16:06:05.711Z', '2026-07-03T04:53:07.309Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (58, 'Vasantha Bhavan - Tambaram', 'Bus stand, 187, Rajaji Rd, beside Tambaram West, West Tambaram, Tambaram, Chennai, Tamil Nadu 600045', '+91 98413 99994', '06:00 AM - 11:00 PM', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1785328654792-813173586.webp', 'Tamil Nadu', 'Chennai', false, 'https://maps.app.goo.gl/nomEJY4X6kSYmape8', 'tel:+919841399994', 11, '2026-06-24T16:06:05.791Z', '2026-07-29T12:37:36.381Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (59, 'Vasantha Bhavan - Velachery', 'No.56, New No.163, Old, Velachery Main Rd, Anna Garden, Velachery, Chennai, Tamil Nadu 600042', '+91 98413 99994', '06:00 AM - 12:00 AM', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1785328710039-918145513.webp', 'Tamil Nadu', 'Chennai', false, 'https://maps.app.goo.gl/WY8KtSHmHshTZ4XYA', 'tel:+919841399994', 11, '2026-06-24T16:06:05.871Z', '2026-07-29T12:38:31.335Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (60, 'Namma Veedu Vasantha Bhavan - DLF - Taramani', 'DLF IT SEZ Park, Block 9B, Mount Poonamallee Road, Manapakkam, Chennai, Tamil Nadu 600125', '+91 98413 99994', '06:00 AM - 10:00 PM', '/uploads/default-web.jpg', 'Tamil Nadu', 'Chennai', false, 'https://www.google.com/maps/search/?api=1&query=Vasanta+Bhavan+DLF+IT+SEZ+Park+Block+9B+Mount+Poonamallee+Road+Manapakkam+Chennai+Tamil+Nadu+600125', 'tel:+919841399994', 11, '2026-06-24T16:06:05.941Z', '2026-07-03T04:53:33.803Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (61, 'Vasantha Bhavan - Saligramam', '33/1, Arunachalam Rd, Saligramam, Chennai, Tamil Nadu 600093', '+91 98413 99994', '06:00 AM - 12:00 AM', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1785328781657-960352291.jpg', 'Tamil Nadu', 'Chennai', false, 'https://maps.app.goo.gl/xbecY4a7n73wB3gA6', 'tel:+919841399994', 11, '2026-06-24T16:06:06.033Z', '2026-07-29T12:39:43.148Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (62, 'Namma Veedu Vasantha Bhavan - Phoenix Mall', '2nd Floor, Phoenix Market City, S36, Velachery Main Rd, Indira Gandhi Nagar, Velachery, Chennai, Tamil Nadu 600042', '+91 98413 99994', '11:00 AM - 11:00 PM', '/uploads/default-web.jpg', 'Tamil Nadu', 'Chennai', false, 'https://maps.app.goo.gl/WbWtthtMVeQC1n8h7', 'tel:+919841399994', 11, '2026-06-24T16:06:06.101Z', '2026-07-03T04:53:49.042Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (63, 'Namma Veedu Vasantha Bhavan - 100FT', '109, Jawaharlal Nehru Salai, Alagiri Nagar, Vadapalani, Chennai, Tamil Nadu 600026', '+91 98413 99994', '06:00 AM - 11:00 PM', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1782374909084-168420882.webp', 'Tamil Nadu', 'Chennai', false, 'https://maps.app.goo.gl/EjUyhzVazy8nAWrb6', 'tel:+919841399994', 11, '2026-06-24T16:06:06.177Z', '2026-07-03T04:54:11.650Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (64, 'Namma Veedu Vasantha Bhavan - Chennai Airport', 'Chennai International Airport, MLCP Block, TS No.1045, Aerohub West, Grand Southern Trunk Rd, Meenambakkam, Chennai, Tamil Nadu 600016', '+91 98413 99994', '06:30 AM - 12:00 AM', '/uploads/default-web.jpg', 'Tamil Nadu', 'Chennai', false, 'https://maps.app.goo.gl/KkDdRqsfjRtBtbQd8', 'tel:+919841399994', 11, '2026-06-24T16:06:06.275Z', '2026-07-03T04:54:17.783Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (65, 'Namma Veedu Vasantha Bhavan - Chromepet', 'Grand Southern Trunk Rd, near MIT Road, Chromepet, Chennai, Tamil Nadu 600044', '+91 98413 99994', '06:00 AM - 11:00 PM', '/uploads/default-web.jpg', 'Tamil Nadu', 'Chennai', false, 'https://maps.app.goo.gl/MQDHTrR9XmJz6c6D8', 'tel:+919841399994', 11, '2026-06-24T16:06:06.350Z', '2026-07-03T04:54:25.765Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (66, 'Namma Veedu Vasantha Bhavan - Medavakkam', '5/521, Velachery Main Rd, United Colony, Ranganathapuram, Medavakkam, Chennai, Tamil Nadu 600100', '+91 98413 99994', '06:00 AM - 12:00 AM', '/uploads/default-web.jpg', 'Tamil Nadu', 'Chennai', false, 'https://maps.app.goo.gl/K78vToBPKQ23edPU6', 'tel:+919841399994', 11, '2026-06-24T16:06:06.412Z', '2026-07-03T04:54:32.720Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (67, 'Namma Veedu Vasantha Bhavan - Mylapore', 'Kabaleeshwarar Temple, 41, S Mada St, near Mylai, Alamelu Manga Puram, Sankarapuram, Mylapore, Chennai, Tamil Nadu 600004', '+91 98413 99994', '06:00 AM - 11:00 PM', '/uploads/default-web.jpg', 'Tamil Nadu', 'Chennai', false, 'https://maps.app.goo.gl/5fDUBRxFJopX2Tth7', 'tel:+919841399994', 11, '2026-06-24T16:06:06.490Z', '2026-07-03T04:54:42.551Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (68, 'Namma Veedu Vasantha Bhavan - Neelankarai', '4/351, Sri Kapaleeswarar Nagar, Neelankarai, Chennai, Tamil Nadu 600115', '+91 98413 99994', '06:00 AM - 11:00 PM', '/uploads/default-web.jpg', 'Tamil Nadu', 'Chennai', false, 'https://maps.app.goo.gl/UkVVS9yWvAynJaaX9', 'tel:+919841399994', 11, '2026-06-24T16:06:06.563Z', '2026-07-03T04:54:56.453Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (69, 'Namma Veedu Vasantha Bhavan - Nexus Vijaya Mall', 'Ward 130, Forum Vijaya Mall, Third Floor Food Court, Kitchen 10 The, Vadapalani, Chennai, Tamil Nadu 600026', '+91 98413 99994', '11:00 AM - 11:00 PM', '/uploads/default-web.jpg', 'Tamil Nadu', 'Chennai', false, 'https://maps.app.goo.gl/ByWUwP3QKz56ZQe76', 'tel:+919841399994', 11, '2026-06-24T16:06:06.641Z', '2026-07-03T04:55:04.548Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (70, 'Namma Veedu Vasantha Bhavan - T Nagar', '15, Nageswaran Rao Rd, T. Nagar, Chennai, Tamil Nadu 600017', '+91 98413 99994', '06:00 AM - 11:00 PM', '/uploads/default-web.jpg', 'Tamil Nadu', 'Chennai', false, 'https://maps.app.goo.gl/9sjaKJ6qDLoqhKK96', 'tel:+919841399994', 11, '2026-06-24T16:06:06.717Z', '2026-07-03T04:55:11.437Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (71, 'Namma Veedu Vasantha Bhavan - Vikravandi', 'MKT Nagar, Kurinchipadi, Tamil Nadu 605652', '+91 98413 99994', '06:00 AM - 12:00 AM', '/uploads/default-web.jpg', 'Tamil Nadu', 'Vikravandi', false, 'https://maps.app.goo.gl/7uSELLu9RcK4wFwd8', 'tel:+919841399994', 11, '2026-06-24T16:06:06.792Z', '2026-07-03T04:55:18.958Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (72, 'Namma Veedu Vasantha Bhavan - Hosur', 'No:192/4, NH, Addakurukki, Shoolagiri, Tamil Nadu 635117', '+91 98413 99994', '06:00 AM - 11:00 PM', '/uploads/default-web.jpg', 'Tamil Nadu', 'Hosur', false, 'https://maps.app.goo.gl/ZskMQzJwESfnC9aq7', 'tel:+919841399994', 11, '2026-06-24T16:06:06.863Z', '2026-07-03T04:55:26.864Z');
INSERT INTO "Country" ("id", "name", "overrideCount", "createdAt", "updatedAt") VALUES (12, 'UK', 1, '2026-06-24T16:06:06.931Z', '2026-06-30T05:48:09.059Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (73, 'Namma Veedu Vasantha Bhavan - London (Wembley)', '533 High Rd, Wembley HA0 2DJ, United Kingdom', '+44 20 8902 2022', '08:00 AM - 10:30 PM', '/uploads/default-web.jpg', 'England', 'London', false, 'https://www.google.com/maps/search/?api=1&query=Vasanta+Bhavan+533+High+Rd+Wembley+HA0+2DJ+United+Kingdom', 'tel:+442089022022', 12, '2026-06-24T16:06:07.007Z', '2026-07-03T04:55:39.048Z');
INSERT INTO "Country" ("id", "name", "overrideCount", "createdAt", "updatedAt") VALUES (13, 'Saudi Arabia', 2, '2026-06-24T16:06:07.095Z', '2026-06-24T16:06:07.095Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (74, 'Namma Veedu Vasantha Bhavan - Riyadh (Murabba)', 'LuLu Hypermarket - Riyadh Avenue Mall - Murabba, Avenue Opposite to Arab National Bank New Tower, Prince Faisal Ibn Turki Ibn Abdul Aziz, Al Murabba, 1st floor, Riyadh 11491, Saudi Arabia', '+91 98413 99994', '08:00 AM - 11:00 PM', '/uploads/default-web.jpg', 'Riyadh', 'Riyadh', false, 'https://www.google.com/maps/search/?api=1&query=Vasanta+Bhavan+LuLu+Hypermarket+Riyadh+Avenue+Mall+Prince+Faisal+Ibn+Turki+Ibn+Abdul+Aziz+Al+Murabba+Riyadh+Saudi+Arabia', 'tel:+919841399994', 13, '2026-06-24T16:06:07.177Z', '2026-07-03T04:55:49.592Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (75, 'Namma Veedu Vasantha Bhavan - Riyadh (Sulaymaniyah)', 'AlSadhan Supermarket Sulaymaniyah, As Sulimaniyah, Riyadh 12241, Saudi Arabia', '+91 98413 99994', '07:00 AM - 12:00 AM', '/uploads/default-web.jpg', 'Riyadh', 'Riyadh', false, 'https://www.google.com/maps/search/?api=1&query=Vasanta+Bhavan+AlSadhan+Supermarket+As+Sulimaniyah+Riyadh+Saudi+Arabia', 'tel:+919841399994', 13, '2026-06-24T16:06:07.255Z', '2026-07-03T04:56:00.923Z');
INSERT INTO "Country" ("id", "name", "overrideCount", "createdAt", "updatedAt") VALUES (14, 'UAE', 2, '2026-06-24T16:06:07.332Z', '2026-06-24T16:06:07.332Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (76, 'VB World - Sharjah', 'Shop number 1&2, Fatima Building Block A, Muweillah Sharjah, UAE', '+91 98413 99994', '09:00 AM - 11:30 PM', '/uploads/default-web.jpg', 'Sharjah', 'Sharjah', false, 'https://www.google.com/maps/search/?api=1&query=VB+World+Shop+number+1+and+2+Fatima+Building+Block+A+Muweillah+Sharjah+UAE', 'tel:+919841399994', 14, '2026-06-24T16:06:07.407Z', '2026-06-24T16:06:07.407Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (77, 'VB World - Dubai (Raffa)', 'Shop - 6, Manazil Al Raffa Building, Sharaf DG Metro Station - near Choithrams BurDubai, Dubai, UAE', '+971 56 703 0703', '09:00 AM - 11:30 PM', '/uploads/default-web.jpg', 'Dubai', 'Dubai', false, 'https://www.google.com/maps/search/?api=1&query=VB+World+Shop+6+Manazil+Al+Raffa+Building+Sharaf+DG+Metro+Station+near+Choithrams+BurDubai+Dubai+UAE', 'tel:+971567030703', 14, '2026-06-24T16:06:07.481Z', '2026-06-24T16:06:07.481Z');
INSERT INTO "Country" ("id", "name", "overrideCount", "createdAt", "updatedAt") VALUES (15, 'Australia', 1, '2026-06-24T16:06:07.585Z', '2026-06-24T16:06:07.585Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (78, 'Namma Veedu Vasantha Bhavan - Clyde North', 'Meridian Square - Clyde North, 35 Mattethorn Drive, Clyde North, Victoria - 3978', '+91 98413 99994', '11:00 am - 10:00 pm', '/uploads/default-web.jpg', 'Victoria', 'Clyde North', true, 'https://www.google.com/maps/search/?api=1&query=Vasanta+Bhavan+Meridian+Square+Clyde+North+35+Mattethorn+Drive+Clyde+North+Victoria+3978', 'tel:+919841399994', 15, '2026-06-24T16:06:07.672Z', '2026-07-03T04:56:10.328Z');
INSERT INTO "Country" ("id", "name", "overrideCount", "createdAt", "updatedAt") VALUES (16, 'Germany', 1, '2026-06-24T16:06:07.739Z', '2026-06-24T16:06:07.739Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (79, 'Namma Veedu Vasantha Bhavan - Frankfurt', 'Thunderbirds Frankfurt GmbH, Taunusstraße 6, 60329 Frankfurt am Main, Germany', '+91 98413 99994', '11:30 am - 10:30 pm', '/uploads/default-web.jpg', 'Hesse', 'Frankfurt', true, 'https://www.google.com/maps/search/?api=1&query=Vasanta+Bhavan+Thunderbirds+Frankfurt+GmbH+Taunusstrasse+6+60329+Frankfurt+am+Main+Germany', 'tel:+919841399994', 16, '2026-06-24T16:06:07.861Z', '2026-07-03T04:56:20.384Z');
INSERT INTO "Country" ("id", "name", "overrideCount", "createdAt", "updatedAt") VALUES (17, 'Singapore', 1, '2026-06-24T16:06:07.971Z', '2026-06-24T16:06:07.971Z');
INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (80, 'Namma Veedu Vasantha Bhavan - Singapore', 'Serangoon Road, Little India, Singapore 218042', '+65 6291 1234', '08:30 am - 10:30 pm', '/uploads/default-web.jpg', 'Central', 'Singapore', false, 'https://www.google.com/maps/search/?api=1&query=Vasanta+Bhavan+Singapore+Serangoon+Road+Little+India+Singapore+218042', 'tel:+6562911234', 17, '2026-06-24T16:06:08.040Z', '2026-07-03T04:56:27.769Z');

-- 3. Insert Gallery Images
INSERT INTO "BranchGalleryImage" ("id", "imageUrl", "row", "displayOrder", "createdAt", "updatedAt") VALUES (45, 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1787132625097-486547214.webp', 1, 0, '2026-08-19T09:43:46.688Z', '2026-08-19T09:43:46.688Z');
INSERT INTO "BranchGalleryImage" ("id", "imageUrl", "row", "displayOrder", "createdAt", "updatedAt") VALUES (46, 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1787132625800-807631346.webp', 1, 0, '2026-08-19T09:43:47.249Z', '2026-08-19T09:43:47.249Z');
INSERT INTO "BranchGalleryImage" ("id", "imageUrl", "row", "displayOrder", "createdAt", "updatedAt") VALUES (47, 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1787132631769-637318858.webp', 1, 0, '2026-08-19T09:43:53.201Z', '2026-08-19T09:43:53.201Z');
INSERT INTO "BranchGalleryImage" ("id", "imageUrl", "row", "displayOrder", "createdAt", "updatedAt") VALUES (48, 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1787132640517-940596177.webp', 2, 0, '2026-08-19T09:44:01.744Z', '2026-08-19T09:44:01.744Z');
INSERT INTO "BranchGalleryImage" ("id", "imageUrl", "row", "displayOrder", "createdAt", "updatedAt") VALUES (50, 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1787132646170-904797355.webp', 2, 0, '2026-08-19T09:44:08.046Z', '2026-08-19T09:44:08.046Z');
INSERT INTO "BranchGalleryImage" ("id", "imageUrl", "row", "displayOrder", "createdAt", "updatedAt") VALUES (51, 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1787132650833-751414888.webp', 2, 0, '2026-08-19T09:44:11.586Z', '2026-08-19T09:44:11.586Z');
INSERT INTO "BranchGalleryImage" ("id", "imageUrl", "row", "displayOrder", "createdAt", "updatedAt") VALUES (54, 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1787132680399-844543730.webp', 2, 0, '2026-08-19T09:44:42.185Z', '2026-08-19T09:44:42.185Z');
INSERT INTO "BranchGalleryImage" ("id", "imageUrl", "row", "displayOrder", "createdAt", "updatedAt") VALUES (55, 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1787132700821-947691021.webp', 1, 0, '2026-08-19T09:45:02.339Z', '2026-08-19T09:45:02.339Z');

-- 4. Insert Hero Configurations
INSERT INTO "HeroConfig" ("id", "page", "titleHtml", "subtitleHtml", "webBannerUrl", "mobileBannerUrl", "updatedAt") VALUES (1, 'home', 'Serving Traditions<br />Across Generations', 'Six decades of authentic flavours, heartfelt hospitality, and memories shared around every table.', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/webBanner-1782291959297-578527377.png', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/mobileBanner-1782292000612-34151348.png', '2026-07-29T07:18:20.624Z');
INSERT INTO "HeroConfig" ("id", "page", "titleHtml", "subtitleHtml", "webBannerUrl", "mobileBannerUrl", "updatedAt") VALUES (2, 'about-us', 'Building A Hospitality<br />Legacy Since 1974', 'From a single family-run restaurant to a multi-brand hospitality group serving millions across India and international markets, Vasanta Bhavan continues to redefine vegetarian dining through innovation, scale, and enduring trust.', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/webBanner-1787128947799-618987242.webp', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/mobileBanner-1787139379297-82962051.webp', '2026-08-19T11:36:22.085Z');
INSERT INTO "HeroConfig" ("id", "page", "titleHtml", "subtitleHtml", "webBannerUrl", "mobileBannerUrl", "updatedAt") VALUES (3, 'menu', 'Authentic Flavours. Crafted<br> Across Generations.', 'Discover a carefully curated collection of authentic South Indian classics, global vegetarian cuisine, handcrafted sweets, and signature creations loved across generations.', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/webBanner-1782292088276-121291818.png', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/mobileBanner-1782292093518-894406074.png', '2026-07-29T07:33:25.057Z');
INSERT INTO "HeroConfig" ("id", "page", "titleHtml", "subtitleHtml", "webBannerUrl", "mobileBannerUrl", "updatedAt") VALUES (4, 'our-branches', 'Rooted In Tradition.<br> Growing Worldwide.', 'Every new location carries forward the values that built our journey — authentic food, warm hospitality, and uncompromising quality.', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/webBanner-1782292409560-807786145.png', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/mobileBanner-1782292411208-229812304.png', '2026-07-29T07:30:06.869Z');
INSERT INTO "HeroConfig" ("id", "page", "titleHtml", "subtitleHtml", "webBannerUrl", "mobileBannerUrl", "updatedAt") VALUES (5, 'our-brands', 'Different Experiences.<br />One Trusted Legacy.', 'Each brand offers a unique experience, united by the same legacy of authentic flavours, warm hospitality, and timeless tradition.
', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/webBanner-1782292496203-693367514.png', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/mobileBanner-1782292497545-505940800.png', '2026-06-25T16:26:54.281Z');
INSERT INTO "HeroConfig" ("id", "page", "titleHtml", "subtitleHtml", "webBannerUrl", "mobileBannerUrl", "updatedAt") VALUES (6, 'banquet-halls', 'Where Every Celebration<br />Becomes A Memory', 'From intimate family milestones to grand corporate celebrations, we
provide the canvas for your most cherished moments in an atmosphere
of refined South Indian heritage.', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/webBanner-1786614245211-672783470.webp', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/mobileBanner-1786614245684-362123534.webp', '2026-08-13T09:44:07.586Z');
INSERT INTO "HeroConfig" ("id", "page", "titleHtml", "subtitleHtml", "webBannerUrl", "mobileBannerUrl", "updatedAt") VALUES (7, 'terms-and-conditions', 'Terms & Conditions', 'Welcome to Namma Veedu Vasanta Bhavan. By accessing or using our website, services, reservations, or dining facilities, you agree to comply with and be bound by the following Terms & Conditions. Please read these terms carefully before using our website or services.', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/webBanner-1782292631051-522202803.png', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/mobileBanner-1782292631920-2839271.png', '2026-06-24T09:17:14.944Z');
INSERT INTO "HeroConfig" ("id", "page", "titleHtml", "subtitleHtml", "webBannerUrl", "mobileBannerUrl", "updatedAt") VALUES (8, 'privacy', 'Serving Traditions<br />Across Generations', 'Authentic South Indian vegetarian cuisine, crafted with love and served<br class="hidden sm:block" />with warmth for over six decades.', '/uploads/default-web.jpg', '/uploads/default-mobile.jpg', '2026-08-27T10:14:09.669Z');

-- 5. Insert Page CTAs
INSERT INTO "PrivacyPolicyCTA" ("id", "page", "titleHtml", "subtitleHtml", "contactUsUrl", "exploreMenuUrl", "imageUrl", "createdAt", "updatedAt") VALUES (1, 'home', 'Experience A Legacy Loved<br />Across Generations', 'From comforting breakfasts to grand celebrations and handcrafted sweets, every Vasantha Bhavan experience is made to be memorable. Discover the warmth, authenticity, and trusted hospitality of over five decades.', 'contact-model', '/menu', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1782373044503-379951197.webp', '2026-06-23T16:19:53.413Z', '2026-06-26T10:24:19.879Z');
INSERT INTO "PrivacyPolicyCTA" ("id", "page", "titleHtml", "subtitleHtml", "contactUsUrl", "exploreMenuUrl", "imageUrl", "createdAt", "updatedAt") VALUES (2, 'about-us', 'A Legacy Shared<br />Across Every Table', 'For over five decades, every meal served has carried the warmth of home and the spirit of tradition.', 'contact-modal', '/menu', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1786612975600-684631656.webp', '2026-06-23T16:19:53.668Z', '2026-08-13T09:22:57.894Z');
INSERT INTO "PrivacyPolicyCTA" ("id", "page", "titleHtml", "subtitleHtml", "contactUsUrl", "exploreMenuUrl", "imageUrl", "createdAt", "updatedAt") VALUES (3, 'menu', 'Taste The Legacy For Yourself', 'Join millions of guests who have made Vasanta Bhavan a part of their celebrations, traditions, and everyday moments.', 'contact-modal', '/menu', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1786616724395-504809282.webp', '2026-06-23T16:19:54.182Z', '2026-08-13T10:25:26.933Z');
INSERT INTO "PrivacyPolicyCTA" ("id", "page", "titleHtml", "subtitleHtml", "contactUsUrl", "exploreMenuUrl", "imageUrl", "createdAt", "updatedAt") VALUES (4, 'our-branches', 'Experience A Legacy Loved<br />Loved Across Generations', 'Discover the warmth, authenticity, and trusted hospitality of over five decades.', '/contact', '/menu', '/uploads/privacycta-banner.png', '2026-06-23T16:19:54.433Z', '2026-06-26T07:42:52.724Z');
INSERT INTO "PrivacyPolicyCTA" ("id", "page", "titleHtml", "subtitleHtml", "contactUsUrl", "exploreMenuUrl", "imageUrl", "createdAt", "updatedAt") VALUES (5, 'our-brands', 'Experience A Legacy Loved<br />Loved Across Generations', 'Discover the warmth, authenticity, and trusted hospitality of over five decades.', 'contact-modal', '/menu', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1782293018204-357577197.png', '2026-06-23T16:19:54.684Z', '2026-06-26T10:15:59.439Z');
INSERT INTO "PrivacyPolicyCTA" ("id", "page", "titleHtml", "subtitleHtml", "contactUsUrl", "exploreMenuUrl", "imageUrl", "createdAt", "updatedAt") VALUES (6, 'banquet-halls', 'Experience A Legacy Loved<br />Loved Across Generations', 'Discover the warmth, authenticity, and trusted hospitality of over five decades.', 'contact-model', '/menu', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1786614303340-371400676.webp', '2026-06-23T16:19:53.927Z', '2026-08-13T09:51:04.270Z');
INSERT INTO "PrivacyPolicyCTA" ("id", "page", "titleHtml", "subtitleHtml", "contactUsUrl", "exploreMenuUrl", "imageUrl", "createdAt", "updatedAt") VALUES (7, 'terms-and-conditions', 'Experience A Legacy Loved<br />Loved Across Generations', 'Discover the warmth, authenticity, and trusted hospitality of over five decades.', 'contact-modal', '/menu', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1782293204134-93550511.png', '2026-06-23T16:19:54.940Z', '2026-06-26T07:37:10.487Z');
INSERT INTO "PrivacyPolicyCTA" ("id", "page", "titleHtml", "subtitleHtml", "contactUsUrl", "exploreMenuUrl", "imageUrl", "createdAt", "updatedAt") VALUES (8, 'privacy', 'Experience A Legacy Loved<br /> Loved Across Generations', 'Discover the warmth, authenticity, and trusted hospitality of over five decades.', 'contact-model', '/menu', 'https://vbworld-assets.s3.ap-south-1.amazonaws.com/uploads/image-1782293083002-863930541.png', '2026-06-23T16:19:52.987Z', '2026-06-24T09:26:22.139Z');

-- 6. Insert Menu Categories & Blocks
INSERT INTO "MenuCategory" ("id", "name", "width", "displayOrder", "createdAt", "updatedAt") VALUES
('breakfast', 'BREAKFAST', 'w-[156px]', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('coffee', 'COFFEE', 'w-[124px]', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('fresh-juices', 'FRESH JUICES', 'w-[175px]', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('light-lunch', 'LIGHT LUNCH', 'w-[171px]', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('south-indian-meals', 'SOUTH INDIAN MEALS', 'w-[242px]', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('snacks', 'SNACKS', 'w-[125px]', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('desserts', 'DESSERTS', 'w-[137px]', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "MenuBlock" ("id", "imageUrl", "subtitle", "titleHighlight", "titleNormal", "description", "badgeLabel", "badgeTitle", "badgeDescription", "badgeLink", "buttonLabel", "align", "createdAt", "updatedAt") VALUES
('breakfast', '/uploads/image-1782197542951-765059417.png', 'THE ART OF BREAKFAST', 'The Morning', 'Ritual.', 'Begin your day with the comforting aroma of freshly brewed filter coffee and golden, crispy dosas. Crafted using traditional recipes, our breakfast brings the authentic taste of South India straight to your table.', 'POPULAR CHOICE', 'Ghee Roast Dosa', 'Sizzling hot, crispy rice crepes layered with pure aromatic ghee, served with a trio of chutneys and hot sambar.', 'EXPLORE DOSAS', 'VIEW FULL CATEGORY', 'left', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('coffee', '/uploads/image-1782199656596-188365013.png', 'ARTISANAL BREWS', 'Traditional Filter', 'Coffee.', 'Brewed to perfection, our signature filter coffee features chicory-infused decoction frothed dynamically with piping hot milk, served in traditional brass dabarah and tumbler.', 'DAILY RITUAL', 'Mylapore Degree Coffee', 'Enjoy a rich, aromatic beverage brewed with freshly roasted coffee beans harvested from the hills of Chikmagalur.', 'OUR BEANS', 'VIEW FULL CATEGORY', 'right', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('fresh-juices', '/uploads/image-1782197542951-765059417.png', 'PURE REFRESHMENT', 'Handcrafted', 'Nectars.', 'Quench your thirst with cold-pressed seasonal fruit juices, prepared fresh to order without artificial colors or preservatives.', NULL, NULL, NULL, NULL, 'VIEW ALL DRINKS', 'left', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('light-lunch', '/uploads/image-1782199656596-188365013.png', 'MIDDAY COMFORT', 'Variety Rice', 'Specials.', 'Quick, nutritious, and full of flavor. Enjoy classics like tang of lemon rice, tempered curd rice, or aromatic sambar rice.', NULL, NULL, NULL, NULL, 'EXPLORE LUNCH', 'right', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('south-indian-meals', '/uploads/image-1782199656596-188365013.png', 'THE GRAND THALI', 'A Feast of', 'Traditions.', 'A wholesome, multi-course feast featuring specialty rices, poriyals, kootus, sambar, rasam, freshly fried appalam, and sweet payasam served in the traditional way.', 'CHEF RECOMMENDATION', 'Vasantha Bhavan Special Meals', 'Experience the ultimate vegetarian thali highlighting unique regional subjis and premium basmati options.', 'ABOUT THE FEAST', 'VIEW FULL MEALS extraction', 'left', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('snacks', '/uploads/image-1782197542951-765059417.png', 'EVENING CRUNCH', 'Savory Delight', 'Snacks.', 'A crisp selection of fresh medu vadas, layered samosas, and piping hot pakoras, perfect companions for your evening tea.', NULL, NULL, NULL, NULL, 'EXPLORE SAVORIES', 'right', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('desserts', '/uploads/image-1782199656596-188365013.png', 'SWEET FINALE', 'Sweets &', 'Confections.', 'Indulge in our selection of rich ghee-laden halwas, milk-based pedas, and traditional sweets crafted with high-quality ingredients.', NULL, NULL, NULL, NULL, 'VIEW ALL SWEETS', 'left', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "MenuExperience" ("id", "time", "title", "description", "imageUrl", "displayOrder", "createdAt", "updatedAt") VALUES
('morning', '07:00 AM - 11:00 AM', 'Morning Mist', 'The aroma of freshly brewed filter coffee and sizzling ghee roasts.', '/uploads/image-1782197542951-765059417.png', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('noon', '12:00 PM - 04:00 PM', 'Noon Radiance', 'Hearty traditional meals and refreshing artisanal juices.', '/uploads/image-1782199656596-188365013.png', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('evening', '05:00 PM - 10:30 PM', 'Evening Glow', 'Warm snacks, special festival treats, and intimate conversation.', '/uploads/image-1782197542951-765059417.png', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('night', '10:30 PM - 12:00 AM', 'Midnight Cravings', 'Late night comfort food and warm desserts for the perfect end to your day.', '/uploads/image-1782199656596-188365013.png', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reset all serial sequences
SELECT setval(pg_get_serial_sequence('"User"', 'id'), coalesce(max("id"), 1)) FROM "User";
SELECT setval(pg_get_serial_sequence('"HeroConfig"', 'id'), coalesce(max("id"), 1)) FROM "HeroConfig";
SELECT setval(pg_get_serial_sequence('"Country"', 'id'), coalesce(max("id"), 1)) FROM "Country";
SELECT setval(pg_get_serial_sequence('"Location"', 'id'), coalesce(max("id"), 1)) FROM "Location";
SELECT setval(pg_get_serial_sequence('"PrivacyPolicyCTA"', 'id'), coalesce(max("id"), 1)) FROM "PrivacyPolicyCTA";
SELECT setval(pg_get_serial_sequence('"BranchGalleryImage"', 'id'), coalesce(max("id"), 1)) FROM "BranchGalleryImage";

COMMIT;

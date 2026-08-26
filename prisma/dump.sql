-- =============================================================================
-- PostgreSQL Database Dump & Seed Script
-- Project: vbworld_backend
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. Drop existing tables if needed (in reverse dependency order)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS "BranchGalleryImage" CASCADE;
DROP TABLE IF EXISTS "MenuExperience" CASCADE;
DROP TABLE IF EXISTS "MenuBlock" CASCADE;
DROP TABLE IF EXISTS "MenuCategory" CASCADE;
DROP TABLE IF EXISTS "PrivacyPolicyCTA" CASCADE;
DROP TABLE IF EXISTS "Location" CASCADE;
DROP TABLE IF EXISTS "Country" CASCADE;
DROP TABLE IF EXISTS "HeroConfig" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- -----------------------------------------------------------------------------
-- 2. Schema DDL Definitions
-- -----------------------------------------------------------------------------

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

-- -----------------------------------------------------------------------------
-- 3. Data Seed / Inserts
-- -----------------------------------------------------------------------------

-- 3.1 Default Admin User (Password: admin123)
INSERT INTO "User" ("id", "email", "name", "password", "createdAt", "updatedAt") VALUES
(1, 'admin@framer.com', 'Administrator', '$2b$10$7R04y3aG7ySj0lq.R406fe1dEceHn3m/nK0t1z7e1E0.UoJ7H9Lye', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 3.2 PrivacyPolicyCTA / Page CTAs
INSERT INTO "PrivacyPolicyCTA" ("id", "page", "titleHtml", "subtitleHtml", "contactUsUrl", "exploreMenuUrl", "imageUrl", "createdAt", "updatedAt") VALUES
(1, 'privacy', 'Experience A Legacy Loved<br /> Loved Across Generations', 'Discover the warmth, authenticity, and trusted hospitality of over five decades.', '/contact', '/menu', '/uploads/privacycta-banner.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'home', 'Experience A Legacy Loved<br /> Loved Across Generations', 'Discover the warmth, authenticity, and trusted hospitality of over five decades.', '/contact', '/menu', '/uploads/homecta-banner.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'about-us', 'Experience A Legacy Loved<br /> Loved Across Generations', 'Discover the warmth, authenticity, and trusted hospitality of over five decades.', '/contact', '/menu', '/uploads/aboutcta-banner.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'banquet-halls', 'Experience A Legacy Loved<br /> Loved Across Generations', 'Discover the warmth, authenticity, and trusted hospitality of over five decades.', '/contact', '/menu', '/uploads/banquet-hallscta-banner.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'menu', 'Experience A Legacy Loved<br /> Loved Across Generations', 'Discover the warmth, authenticity, and trusted hospitality of over five decades.', '/contact', '/menu', '/uploads/menucta-banner.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'our-branches', 'Experience A Legacy Loved<br /> Loved Across Generations', 'Discover the warmth, authenticity, and trusted hospitality of over five decades.', '/contact', '/menu', '/uploads/privacycta-banner.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'our-brands', 'Experience A Legacy Loved<br /> Loved Across Generations', 'Discover the warmth, authenticity, and trusted hospitality of over five decades.', '/contact', '/menu', '/uploads/brandcta-banner.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'terms-and-conditions', 'Experience A Legacy Loved<br /> Loved Across Generations', 'Discover the warmth, authenticity, and trusted hospitality of over five decades.', '/contact', '/menu', '/uploads/privacycta-banner.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 3.3 Hero Configurations
INSERT INTO "HeroConfig" ("id", "page", "titleHtml", "subtitleHtml", "webBannerUrl", "mobileBannerUrl", "updatedAt") VALUES
(1, 'home', 'Serving Traditions\r\n<span> <br>\r\nAcross Generations\r\n</span>', 'Authentic South Indian vegetarian cuisine, crafted with love and served with warmth for over six decades.', '/uploads/default-web.jpg', '/uploads/default-mobile.jpg', CURRENT_TIMESTAMP),
(2, 'about-us', 'Serving Traditions<br />Across Generations', 'Authentic South Indian vegetarian cuisine, crafted with love and served with warmth for over six decades.', '/uploads/default-web.jpg', '/uploads/default-mobile.jpg', CURRENT_TIMESTAMP),
(3, 'menu', 'Authentic flavors.<br>Timeless favorites.', 'From signature South Indian favorites to handcrafted sweets and global vegetarian delights, every dish is prepared with authentic flavors, fresh ingredients, and the warmth of tradition.', '/uploads/default-web.jpg', '/uploads/default-mobile.jpg', CURRENT_TIMESTAMP),
(4, 'our-branches', 'From Chennai To Tables<br>\r\nAround The World.', 'From a humble beginning in Trichy to becoming one of Tamil Nadu''s most loved vegetarian restaurant brands, our journey has always been rooted in warmth, authenticity, and honest hospitality.', '/uploads/default-web.jpg', '/uploads/default-mobile.jpg', CURRENT_TIMESTAMP),
(5, 'our-brands', 'Serving Traditions<br />Across Generations', 'Authentic South Indian vegetarian cuisine, crafted with love and served with warmth for over six decades.', '/uploads/default-web.jpg', '/uploads/default-mobile.jpg', CURRENT_TIMESTAMP),
(6, 'banquet-halls', 'Serving Traditions<br />Across Generations', 'Authentic South Indian vegetarian cuisine, crafted with love and served with warmth for over six decades.', '/uploads/default-web.jpg', '/uploads/default-mobile.jpg', CURRENT_TIMESTAMP),
(7, 'terms-and-conditions', 'Serving Traditions<br />Across Generations', 'Authentic South Indian vegetarian cuisine, crafted with love and served with warmth for over six decades.', '/uploads/default-web.jpg', '/uploads/default-mobile.jpg', CURRENT_TIMESTAMP);

-- 3.4 Menu Categories
INSERT INTO "MenuCategory" ("id", "name", "width", "displayOrder", "createdAt", "updatedAt") VALUES
('breakfast', 'BREAKFAST', 'w-[156px]', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('coffee', 'COFFEE', 'w-[124px]', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('fresh-juices', 'FRESH JUICES', 'w-[175px]', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('light-lunch', 'LIGHT LUNCH', 'w-[171px]', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('south-indian-meals', 'SOUTH INDIAN MEALS', 'w-[242px]', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('snacks', 'SNACKS', 'w-[125px]', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('desserts', 'DESSERTS', 'w-[137px]', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 3.5 Menu Blocks
INSERT INTO "MenuBlock" ("id", "imageUrl", "subtitle", "titleHighlight", "titleNormal", "description", "badgeLabel", "badgeTitle", "badgeDescription", "badgeLink", "buttonLabel", "align", "createdAt", "updatedAt") VALUES
('breakfast', '/uploads/image-1782197542951-765059417.png', 'THE ART OF BREAKFAST', 'The Morning', 'Ritual.', 'Begin your day with the comforting aroma of freshly brewed filter coffee and golden, crispy dosas. Crafted using traditional recipes, our breakfast brings the authentic taste of South India straight to your table.', 'POPULAR CHOICE', 'Ghee Roast Dosa', 'Sizzling hot, crispy rice crepes layered with pure aromatic ghee, served with a trio of chutneys and hot sambar.', 'EXPLORE DOSAS', 'VIEW FULL CATEGORY', 'left', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('coffee', '/uploads/image-1782199656596-188365013.png', 'ARTISANAL BREWS', 'Traditional Filter', 'Coffee.', 'Brewed to perfection, our signature filter coffee features chicory-infused decoction frothed dynamically with piping hot milk, served in traditional brass dabarah and tumbler.', 'DAILY RITUAL', 'Mylapore Degree Coffee', 'Enjoy a rich, aromatic beverage brewed with freshly roasted coffee beans harvested from the hills of Chikmagalur.', 'OUR BEANS', 'VIEW FULL CATEGORY', 'right', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('fresh-juices', '/uploads/image-1782197542951-765059417.png', 'PURE REFRESHMENT', 'Handcrafted', 'Nectars.', 'Quench your thirst with cold-pressed seasonal fruit juices, prepared fresh to order without artificial colors or preservatives.', NULL, NULL, NULL, NULL, 'VIEW ALL DRINKS', 'left', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('light-lunch', '/uploads/image-1782199656596-188365013.png', 'MIDDAY COMFORT', 'Variety Rice', 'Specials.', 'Quick, nutritious, and full of flavor. Enjoy classics like tang of lemon rice, tempered curd rice, or aromatic sambar rice.', NULL, NULL, NULL, NULL, 'EXPLORE LUNCH', 'right', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('south-indian-meals', '/uploads/image-1782199656596-188365013.png', 'THE GRAND THALI', 'A Feast of', 'Traditions.', 'A wholesome, multi-course feast featuring specialty rices, poriyals, kootus, sambar, rasam, freshly fried appalam, and sweet payasam served in the traditional way.', 'CHEF RECOMMENDATION', 'Vasantha Bhavan Special Meals', 'Experience the ultimate vegetarian thali highlighting unique regional subjis and premium basmati options.', 'ABOUT THE FEAST', 'VIEW FULL MEALS extraction', 'left', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('snacks', '/uploads/image-1782197542951-765059417.png', 'EVENING CRUNCH', 'Savory Delight', 'Snacks.', 'A crisp selection of fresh medu vadas, layered samosas, and piping hot pakoras, perfect companions for your evening tea.', NULL, NULL, NULL, NULL, 'EXPLORE SAVORIES', 'right', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('desserts', '/uploads/image-1782199656596-188365013.png', 'SWEET FINALE', 'Sweets &', 'Confections.', 'Indulge in our selection of rich ghee-laden halwas, milk-based pedas, and traditional sweets crafted with high-quality ingredients.', NULL, NULL, NULL, NULL, 'VIEW ALL SWEETS', 'left', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 3.6 Countries
INSERT INTO "Country" ("id", "name", "overrideCount", "createdAt", "updatedAt") VALUES
(1, 'India', 42, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Dubai', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Malaysia', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'UK', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Qatar', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 3.7 Locations
-- India: Chennai (14)
INSERT INTO "Location" ("countryId", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "createdAt", "updatedAt") VALUES
(1, 'Vasanta Bhavan - Chennai 1', 'Ganesh Apartment, 62a, Lattice Brg Rd, Bharathi Nagar, Thiruvanmiyur, Chennai, Tamil Nadu 600020, India', '+91 99528 34444', '11:00 am - 9:30 pm', '/uploads/image-1782197542951-765059417.png', 'Tamil Nadu', 'Chennai', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Vasanta Bhavan - Chennai 2', 'Ganesh Apartment, 62a, Lattice Brg Rd, Bharathi Nagar, Thiruvanmiyur, Chennai, Tamil Nadu 600020, India', '+91 99528 34444', '11:00 am - 9:30 pm', '/uploads/image-1782197542951-765059417.png', 'Tamil Nadu', 'Chennai', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Vasanta Bhavan - Chennai 3', 'Ganesh Apartment, 62a, Lattice Brg Rd, Bharathi Nagar, Thiruvanmiyur, Chennai, Tamil Nadu 600020, India', '+91 99528 34444', '11:00 am - 9:30 pm', '/uploads/image-1782197542951-765059417.png', 'Tamil Nadu', 'Chennai', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Vasanta Bhavan - Chennai 4', 'Ganesh Apartment, 62a, Lattice Brg Rd, Bharathi Nagar, Thiruvanmiyur, Chennai, Tamil Nadu 600020, India', '+91 99528 34444', '11:00 am - 9:30 pm', '/uploads/image-1782197542951-765059417.png', 'Tamil Nadu', 'Chennai', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Vasanta Bhavan - Chennai 5', 'Ganesh Apartment, 62a, Lattice Brg Rd, Bharathi Nagar, Thiruvanmiyur, Chennai, Tamil Nadu 600020, India', '+91 99528 34444', '11:00 am - 9:30 pm', '/uploads/image-1782197542951-765059417.png', 'Tamil Nadu', 'Chennai', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Vasanta Bhavan - Chennai 6', 'Ganesh Apartment, 62a, Lattice Brg Rd, Bharathi Nagar, Thiruvanmiyur, Chennai, Tamil Nadu 600020, India', '+91 99528 34444', '11:00 am - 9:30 pm', '/uploads/image-1782197542951-765059417.png', 'Tamil Nadu', 'Chennai', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Vasanta Bhavan - Chennai 7', 'Ganesh Apartment, 62a, Lattice Brg Rd, Bharathi Nagar, Thiruvanmiyur, Chennai, Tamil Nadu 600020, India', '+91 99528 34444', '11:00 am - 9:30 pm', '/uploads/image-1782197542951-765059417.png', 'Tamil Nadu', 'Chennai', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Vasanta Bhavan - Chennai 8', 'Ganesh Apartment, 62a, Lattice Brg Rd, Bharathi Nagar, Thiruvanmiyur, Chennai, Tamil Nadu 600020, India', '+91 99528 34444', '11:00 am - 9:30 pm', '/uploads/image-1782197542951-765059417.png', 'Tamil Nadu', 'Chennai', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Vasanta Bhavan - Chennai 9', 'Ganesh Apartment, 62a, Lattice Brg Rd, Bharathi Nagar, Thiruvanmiyur, Chennai, Tamil Nadu 600020, India', '+91 99528 34444', '11:00 am - 9:30 pm', '/uploads/image-1782197542951-765059417.png', 'Tamil Nadu', 'Chennai', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Vasanta Bhavan - Chennai 10', 'Ganesh Apartment, 62a, Lattice Brg Rd, Bharathi Nagar, Thiruvanmiyur, Chennai, Tamil Nadu 600020, India', '+91 99528 34444', '11:00 am - 9:30 pm', '/uploads/image-1782197542951-765059417.png', 'Tamil Nadu', 'Chennai', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Vasanta Bhavan - Chennai 11', 'Ganesh Apartment, 62a, Lattice Brg Rd, Bharathi Nagar, Thiruvanmiyur, Chennai, Tamil Nadu 600020, India', '+91 99528 34444', '11:00 am - 9:30 pm', '/uploads/image-1782197542951-765059417.png', 'Tamil Nadu', 'Chennai', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Vasanta Bhavan - Chennai 12', 'Ganesh Apartment, 62a, Lattice Brg Rd, Bharathi Nagar, Thiruvanmiyur, Chennai, Tamil Nadu 600020, India', '+91 99528 34444', '11:00 am - 9:30 pm', '/uploads/image-1782197542951-765059417.png', 'Tamil Nadu', 'Chennai', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Vasanta Bhavan - Chennai 13', 'Ganesh Apartment, 62a, Lattice Brg Rd, Bharathi Nagar, Thiruvanmiyur, Chennai, Tamil Nadu 600020, India', '+91 99528 34444', '11:00 am - 9:30 pm', '/uploads/image-1782197542951-765059417.png', 'Tamil Nadu', 'Chennai', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Vasanta Bhavan - Chennai 14', 'Ganesh Apartment, 62a, Lattice Brg Rd, Bharathi Nagar, Thiruvanmiyur, Chennai, Tamil Nadu 600020, India', '+91 99528 34444', '11:00 am - 9:30 pm', '/uploads/image-1782197542951-765059417.png', 'Tamil Nadu', 'Chennai', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- India: Delhi (4)
INSERT INTO "Location" ("countryId", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "createdAt", "updatedAt") VALUES
(1, 'Vasanta Bhavan - Delhi 1', 'Connaught Place, New Delhi, Delhi 110001, India', '+91 11 2345 6789', '10:00 am - 10:30 pm', '/uploads/image-1782199656596-188365013.png', 'Delhi', 'New Delhi', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Vasanta Bhavan - Delhi 2', 'Connaught Place, New Delhi, Delhi 110001, India', '+91 11 2345 6789', '10:00 am - 10:30 pm', '/uploads/image-1782199656596-188365013.png', 'Delhi', 'New Delhi', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Vasanta Bhavan - Delhi 3', 'Connaught Place, New Delhi, Delhi 110001, India', '+91 11 2345 6789', '10:00 am - 10:30 pm', '/uploads/image-1782199656596-188365013.png', 'Delhi', 'New Delhi', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Vasanta Bhavan - Delhi 4', 'Connaught Place, New Delhi, Delhi 110001, India', '+91 11 2345 6789', '10:00 am - 10:30 pm', '/uploads/image-1782199656596-188365013.png', 'Delhi', 'New Delhi', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Dubai (4)
INSERT INTO "Location" ("countryId", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "createdAt", "updatedAt") VALUES
(2, 'Vasanta Bhavan - Dubai Marina 1', 'Al Seef Street, Dubai Marina, Dubai, United Arab Emirates', '+971 4 123 4567', '11:00 am - 11:30 pm', '/uploads/image-1782199656596-188365013.png', 'Dubai', 'Dubai', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Vasanta Bhavan - Dubai Marina 2', 'Al Seef Street, Dubai Marina, Dubai, United Arab Emirates', '+971 4 123 4567', '11:00 am - 11:30 pm', '/uploads/image-1782199656596-188365013.png', 'Dubai', 'Dubai', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Vasanta Bhavan - Dubai Marina 3', 'Al Seef Street, Dubai Marina, Dubai, United Arab Emirates', '+971 4 123 4567', '11:00 am - 11:30 pm', '/uploads/image-1782199656596-188365013.png', 'Dubai', 'Dubai', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Vasanta Bhavan - Dubai Marina 4', 'Al Seef Street, Dubai Marina, Dubai, United Arab Emirates', '+971 4 123 4567', '11:00 am - 11:30 pm', '/uploads/image-1782199656596-188365013.png', 'Dubai', 'Dubai', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Malaysia (2)
INSERT INTO "Location" ("countryId", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "createdAt", "updatedAt") VALUES
(3, 'Vasanta Bhavan - Kuala Lumpur 1', 'Lebuh Ampang, City Centre, 50100 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur, Malaysia', '+60 3 1234 5678', '10:00 am - 10:00 pm', '/uploads/image-1782197542951-765059417.png', 'Kuala Lumpur', 'Kuala Lumpur', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Vasanta Bhavan - Kuala Lumpur 2', 'Lebuh Ampang, City Centre, 50100 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur, Malaysia', '+60 3 1234 5678', '10:00 am - 10:00 pm', '/uploads/image-1782197542951-765059417.png', 'Kuala Lumpur', 'Kuala Lumpur', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- UK (1)
INSERT INTO "Location" ("countryId", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "createdAt", "updatedAt") VALUES
(4, 'Vasanta Bhavan - London', 'East Ham, London E6 2JA, United Kingdom', '+44 20 1234 5678', '11:00 am - 10:30 pm', '/uploads/image-1782199656596-188365013.png', 'England', 'London', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Qatar (1)
INSERT INTO "Location" ("countryId", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "createdAt", "updatedAt") VALUES
(5, 'Vasanta Bhavan - Doha', 'Al Mansoura St, Doha, Qatar', '+974 4412 3456', '11:00 am - 11:00 pm', '/uploads/image-1782197542951-765059417.png', 'Doha', 'Doha', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 3.8 Menu Experiences
INSERT INTO "MenuExperience" ("id", "time", "title", "description", "imageUrl", "displayOrder", "createdAt", "updatedAt") VALUES
('morning', '07:00 AM - 11:00 AM', 'Morning Mist', 'The aroma of freshly brewed filter coffee and sizzling ghee roasts.', '/uploads/image-1782197542951-765059417.png', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('noon', '12:00 PM - 04:00 PM', 'Noon Radiance', 'Hearty traditional meals and refreshing artisanal juices.', '/uploads/image-1782199656596-188365013.png', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('evening', '05:00 PM - 10:30 PM', 'Evening Glow', 'Warm snacks, special festival treats, and intimate conversation.', '/uploads/image-1782197542951-765059417.png', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('night', '10:30 PM - 12:00 AM', 'Midnight Cravings', 'Late night comfort food and warm desserts for the perfect end to your day.', '/uploads/image-1782199656596-188365013.png', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 3.9 Branch Gallery Images
INSERT INTO "BranchGalleryImage" ("id", "imageUrl", "row", "displayOrder", "createdAt", "updatedAt") VALUES
(1, '/uploads/about_marquee_img1.png', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, '/uploads/home_marquee_img2.png', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, '/uploads/about_marquee_img3.png', 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, '/uploads/home_marquee_img4.png', 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, '/uploads/about_marquee_img5.png', 1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, '/uploads/home_marquee_img1.png', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, '/uploads/about_marquee_img2.png', 2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, '/uploads/home_marquee_img3.png', 2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, '/uploads/about_marquee_img4.png', 2, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, '/uploads/branch-section-img1.png', 2, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- -----------------------------------------------------------------------------
-- 4. Update Autoincrement Sequences
-- -----------------------------------------------------------------------------
SELECT setval(pg_get_serial_sequence('"User"', 'id'), coalesce(max("id"), 1)) FROM "User";
SELECT setval(pg_get_serial_sequence('"HeroConfig"', 'id'), coalesce(max("id"), 1)) FROM "HeroConfig";
SELECT setval(pg_get_serial_sequence('"Country"', 'id'), coalesce(max("id"), 1)) FROM "Country";
SELECT setval(pg_get_serial_sequence('"Location"', 'id'), coalesce(max("id"), 1)) FROM "Location";
SELECT setval(pg_get_serial_sequence('"PrivacyPolicyCTA"', 'id'), coalesce(max("id"), 1)) FROM "PrivacyPolicyCTA";
SELECT setval(pg_get_serial_sequence('"BranchGalleryImage"', 'id'), coalesce(max("id"), 1)) FROM "BranchGalleryImage";

COMMIT;

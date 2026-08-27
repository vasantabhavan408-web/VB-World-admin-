import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('scripts/source_data.json', 'utf8'));

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

let sql = `BEGIN;

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

`;

// 2. Insert Countries & Locations
if (raw.branches && raw.branches.data) {
  sql += `-- 2. Insert Countries & Locations\n`;
  for (const c of raw.branches.data) {
    sql += `INSERT INTO "Country" ("id", "name", "overrideCount", "createdAt", "updatedAt") VALUES (${c.id}, ${escapeSql(c.name)}, ${c.overrideCount || 'NULL'}, ${escapeSql(c.createdAt)}, ${escapeSql(c.updatedAt)});\n`;
    if (c.locations && c.locations.length > 0) {
      for (const loc of c.locations) {
        const img = loc.image || loc.imageUrl || '/uploads/default-web.jpg';
        sql += `INSERT INTO "Location" ("id", "title", "address", "phone", "time", "imageUrl", "state", "city", "comingSoon", "directionLink", "contactLink", "countryId", "createdAt", "updatedAt") VALUES (${loc.id}, ${escapeSql(loc.title)}, ${escapeSql(loc.address)}, ${escapeSql(loc.phone)}, ${escapeSql(loc.time)}, ${escapeSql(img)}, ${escapeSql(loc.state)}, ${escapeSql(loc.city)}, ${loc.comingSoon ? true : false}, ${escapeSql(loc.directionLink)}, ${escapeSql(loc.contactLink)}, ${c.id}, ${escapeSql(loc.createdAt)}, ${escapeSql(loc.updatedAt)});\n`;
      }
    }
  }
}

// 3. Insert Gallery Images
if (raw.gallery && raw.gallery.data) {
  sql += `\n-- 3. Insert Gallery Images\n`;
  for (const g of raw.gallery.data) {
    sql += `INSERT INTO "BranchGalleryImage" ("id", "imageUrl", "row", "displayOrder", "createdAt", "updatedAt") VALUES (${g.id}, ${escapeSql(g.imageUrl)}, ${g.row || 1}, ${g.displayOrder || 0}, ${escapeSql(g.createdAt)}, ${escapeSql(g.updatedAt)});\n`;
  }
}

// 4. Insert Hero Configs
if (raw.heroes) {
  sql += `\n-- 4. Insert Hero Configurations\n`;
  let heroId = 1;
  for (const page of Object.keys(raw.heroes)) {
    const h = raw.heroes[page]?.data;
    if (h) {
      sql += `INSERT INTO "HeroConfig" ("id", "page", "titleHtml", "subtitleHtml", "webBannerUrl", "mobileBannerUrl", "updatedAt") VALUES (${heroId++}, ${escapeSql(h.page || page)}, ${escapeSql(h.titleHtml)}, ${escapeSql(h.subtitleHtml)}, ${escapeSql(h.webBannerUrl)}, ${escapeSql(h.mobileBannerUrl)}, ${escapeSql(h.updatedAt)});\n`;
    }
  }
}

// 5. Insert CTAs
if (raw.ctas) {
  sql += `\n-- 5. Insert Page CTAs\n`;
  let ctaId = 1;
  for (const page of Object.keys(raw.ctas)) {
    const c = raw.ctas[page]?.data;
    if (c) {
      sql += `INSERT INTO "PrivacyPolicyCTA" ("id", "page", "titleHtml", "subtitleHtml", "contactUsUrl", "exploreMenuUrl", "imageUrl", "createdAt", "updatedAt") VALUES (${ctaId++}, ${escapeSql(c.page || page)}, ${escapeSql(c.titleHtml)}, ${escapeSql(c.subtitleHtml)}, ${escapeSql(c.contactUsUrl)}, ${escapeSql(c.exploreMenuUrl)}, ${escapeSql(c.imageUrl)}, ${escapeSql(c.createdAt || new Date().toISOString())}, ${escapeSql(c.updatedAt || new Date().toISOString())});\n`;
    }
  }
}

// 6. Insert Menu Categories & Blocks
sql += `\n-- 6. Insert Menu Categories & Blocks
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
`;

fs.writeFileSync('prisma/exact_vbworld_api_dump.sql', sql);
console.log('Successfully generated prisma/exact_vbworld_api_dump.sql');

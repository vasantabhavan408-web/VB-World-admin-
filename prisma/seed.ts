import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const prisma = new PrismaClient();

async function main() {
  console.log('--- START SEEDING ---');

  // 1. Seed Admin User
  console.log('Seeding admin user...');
  const existingUser = await prisma.user.findUnique({
    where: { email: 'admin@framer.com' },
  });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: 'admin@framer.com',
        name: 'Administrator',
        password: hashedPassword,
      },
    });
    console.log('Admin user created: admin@framer.com / admin123');
  } else {
    console.log('Admin user already exists.');
  }

  // 2. Seeding default CTA banner images from frontend to backend uploads
  console.log('Copying default CTA banner images from frontend to backend uploads...');
  const frontendImagesDir = path.join(process.cwd(), '../vbworld-fe/src/assets/images');
  const backendUploadsDir = path.join(process.cwd(), 'public/uploads');

  if (!fs.existsSync(backendUploadsDir)) {
    fs.mkdirSync(backendUploadsDir, { recursive: true });
  }

  const ctaImages = [
    'brandcta-banner.png',
    'homecta-banner.png',
    'menucta-banner.png',
    'aboutcta-banner.png',
    'banquet-hallscta-banner.png',
    'privacycta-banner.png',
  ];

  for (const filename of ctaImages) {
    const srcPath = path.join(frontendImagesDir, filename);
    const destPath = path.join(backendUploadsDir, filename);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${filename} to backend uploads.`);
    } else {
      console.warn(`Source image not found: ${srcPath}`);
    }
  }

  // Copy additional placeholder and default images from frontend assets to backend uploads
  const additionalImages = [
    { src: 'homehero-banner.png', dest: 'default-web.jpg' },
    { src: 'homehero-banner_m.png', dest: 'default-mobile.jpg' },
    { src: 'menu_cate_img1.png', dest: 'image-1782197542951-765059417.png' },
    { src: 'experience_card2.png', dest: 'image-1782199656596-188365013.png' }
  ];

  for (const item of additionalImages) {
    const srcPath = path.join(frontendImagesDir, item.src);
    const destPath = path.join(backendUploadsDir, item.dest);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${item.src} as placeholder ${item.dest} to backend uploads.`);
    } else {
      console.warn(`Source image not found: ${srcPath}`);
    }
  }

  // Conditional S3 client instantiation
  const isS3Configured =
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION &&
    process.env.AWS_S3_BUCKET_NAME;

  let s3Client: S3Client | null = null;
  if (isS3Configured) {
    console.log('AWS S3 is configured. Seed images will be uploaded to S3.');
    s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  } else {
    console.log('AWS S3 is not configured. Falling back to local server storage paths.');
  }

  // Helper function to resolve S3 upload and return URLs
  async function resolveAndUploadFile(filename: string): Promise<string> {
    const cleanFilename = filename.replace(/^\/?uploads\/?/, '');
    const localPath = path.join(backendUploadsDir, cleanFilename);
    const s3Key = `uploads/${cleanFilename}`;

    if (!fs.existsSync(localPath)) {
      return `/uploads/${cleanFilename}`;
    }

    if (isS3Configured && s3Client) {
      try {
        const fileBuffer = fs.readFileSync(localPath);
        let contentType = 'application/octet-stream';
        if (cleanFilename.endsWith('.png')) contentType = 'image/png';
        else if (cleanFilename.endsWith('.jpg') || cleanFilename.endsWith('.jpeg')) contentType = 'image/jpeg';
        else if (cleanFilename.endsWith('.webp')) contentType = 'image/webp';

        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: s3Key,
            Body: fileBuffer,
            ContentType: contentType,
          })
        );
        const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
        console.log(`Uploaded ${cleanFilename} to S3: ${s3Url}`);
        return s3Url;
      } catch (err) {
        console.error(`Failed to upload ${cleanFilename} to S3:`, err);
        return `/uploads/${cleanFilename}`;
      }
    }

    return `/uploads/${cleanFilename}`;
  }

  // 3. Seed default Page CTA configs
  console.log('Seeding default CTA configurations...');
  const defaultCtas = [
    {
      page: 'privacy',
      titleHtml: 'Experience A Legacy Loved<br /> Loved Across Generations',
      subtitleHtml: 'Discover the warmth, authenticity, and trusted hospitality of over five decades.',
      contactUsUrl: '/contact',
      exploreMenuUrl: '/menu',
      imageUrl: 'privacycta-banner.png',
    },
    {
      page: 'home',
      titleHtml: 'Experience A Legacy Loved<br /> Loved Across Generations',
      subtitleHtml: 'Discover the warmth, authenticity, and trusted hospitality of over five decades.',
      contactUsUrl: '/contact',
      exploreMenuUrl: '/menu',
      imageUrl: 'homecta-banner.png',
    },
    {
      page: 'about-us',
      titleHtml: 'Experience A Legacy Loved<br /> Loved Across Generations',
      subtitleHtml: 'Discover the warmth, authenticity, and trusted hospitality of over five decades.',
      contactUsUrl: '/contact',
      exploreMenuUrl: '/menu',
      imageUrl: 'aboutcta-banner.png',
    },
    {
      page: 'banquet-halls',
      titleHtml: 'Experience A Legacy Loved<br /> Loved Across Generations',
      subtitleHtml: 'Discover the warmth, authenticity, and trusted hospitality of over five decades.',
      contactUsUrl: '/contact',
      exploreMenuUrl: '/menu',
      imageUrl: 'banquet-hallscta-banner.png',
    },
    {
      page: 'menu',
      titleHtml: 'Experience A Legacy Loved<br /> Loved Across Generations',
      subtitleHtml: 'Discover the warmth, authenticity, and trusted hospitality of over five decades.',
      contactUsUrl: '/contact',
      exploreMenuUrl: '/menu',
      imageUrl: 'menucta-banner.png',
    },
    {
      page: 'our-branches',
      titleHtml: 'Experience A Legacy Loved<br /> Loved Across Generations',
      subtitleHtml: 'Discover the warmth, authenticity, and trusted hospitality of over five decades.',
      contactUsUrl: '/contact',
      exploreMenuUrl: '/menu',
      imageUrl: 'privacycta-banner.png',
    },
    {
      page: 'our-brands',
      titleHtml: 'Experience A Legacy Loved<br /> Loved Across Generations',
      subtitleHtml: 'Discover the warmth, authenticity, and trusted hospitality of over five decades.',
      contactUsUrl: '/contact',
      exploreMenuUrl: '/menu',
      imageUrl: 'brandcta-banner.png',
    },
    {
      page: 'terms-and-conditions',
      titleHtml: 'Experience A Legacy Loved<br /> Loved Across Generations',
      subtitleHtml: 'Discover the warmth, authenticity, and trusted hospitality of over five decades.',
      contactUsUrl: '/contact',
      exploreMenuUrl: '/menu',
      imageUrl: 'privacycta-banner.png',
    },
  ];

  for (const cta of defaultCtas) {
    const resolvedUrl = await resolveAndUploadFile(cta.imageUrl);
    await prisma.privacyPolicyCTA.upsert({
      where: { page: cta.page },
      update: {},
      create: {
        ...cta,
        imageUrl: resolvedUrl,
      },
    });
  }
  console.log('Page CTAs seeded.');

  // 4. Seed default Hero configurations
  console.log('Seeding default Hero configurations...');
  const defaultHeroes = [
    {
      page: 'home',
      titleHtml: 'Serving Traditions\r\n<span> <br>\r\nAcross Generations\r\n</span>',
      subtitleHtml: 'Authentic South Indian vegetarian cuisine, crafted with love and served with warmth for over six decades.',
      webBannerUrl: 'default-web.jpg',
      mobileBannerUrl: 'default-mobile.jpg',
    },
    {
      page: 'about-us',
      titleHtml: 'Serving Traditions<br />Across Generations',
      subtitleHtml: 'Authentic South Indian vegetarian cuisine, crafted with love and served with warmth for over six decades.',
      webBannerUrl: 'default-web.jpg',
      mobileBannerUrl: 'default-mobile.jpg',
    },
    {
      page: 'menu',
      titleHtml: 'Authentic flavors.<br>Timeless favorites.',
      subtitleHtml: 'From signature South Indian favorites to handcrafted sweets and global vegetarian delights, every dish is prepared with authentic flavors, fresh ingredients, and the warmth of tradition.',
      webBannerUrl: 'default-web.jpg',
      mobileBannerUrl: 'default-mobile.jpg',
    },
    {
      page: 'our-branches',
      titleHtml: 'From Chennai To Tables<br>\r\nAround The World.',
      subtitleHtml: "From a humble beginning in Trichy to becoming one of Tamil Nadu's most loved vegetarian restaurant brands, our journey has always been rooted in warmth, authenticity, and honest hospitality.",
      webBannerUrl: 'default-web.jpg',
      mobileBannerUrl: 'default-mobile.jpg',
    },
    {
      page: 'our-brands',
      titleHtml: 'Serving Traditions<br />Across Generations',
      subtitleHtml: 'Authentic South Indian vegetarian cuisine, crafted with love and served with warmth for over six decades.',
      webBannerUrl: 'default-web.jpg',
      mobileBannerUrl: 'default-mobile.jpg',
    },
    {
      page: 'banquet-halls',
      titleHtml: 'Serving Traditions<br />Across Generations',
      subtitleHtml: 'Authentic South Indian vegetarian cuisine, crafted with love and served with warmth for over six decades.',
      webBannerUrl: 'default-web.jpg',
      mobileBannerUrl: 'default-mobile.jpg',
    },
    {
      page: 'terms-and-conditions',
      titleHtml: 'Serving Traditions<br />Across Generations',
      subtitleHtml: 'Authentic South Indian vegetarian cuisine, crafted with love and served with warmth for over six decades.',
      webBannerUrl: 'default-web.jpg',
      mobileBannerUrl: 'default-mobile.jpg',
    },
  ];

  for (const hero of defaultHeroes) {
    const webUrl = await resolveAndUploadFile(hero.webBannerUrl);
    const mobileUrl = await resolveAndUploadFile(hero.mobileBannerUrl);
    await prisma.heroConfig.upsert({
      where: { page: hero.page },
      update: {},
      create: {
        ...hero,
        webBannerUrl: webUrl,
        mobileBannerUrl: mobileUrl,
      },
    });
  }
  console.log('Hero configurations seeded.');

  // 5. Seed default Menu Categories and blocks
  console.log('Seeding default Menu Categories and Blocks...');
  const defaultCategories = [
    {
      id: 'breakfast',
      name: 'BREAKFAST',
      width: 'w-[156px]',
      displayOrder: 0,
      block: {
        subtitle: 'THE ART OF BREAKFAST',
        titleHighlight: 'The Morning',
        titleNormal: 'Ritual.',
        description: 'Begin your day with the comforting aroma of freshly brewed filter coffee and golden, crispy dosas. Crafted using traditional recipes, our breakfast brings the authentic taste of South India straight to your table.',
        badgeLabel: 'POPULAR CHOICE',
        badgeTitle: 'Ghee Roast Dosa',
        badgeDescription: 'Sizzling hot, crispy rice crepes layered with pure aromatic ghee, served with a trio of chutneys and hot sambar.',
        badgeLink: 'EXPLORE DOSAS',
        buttonLabel: 'VIEW FULL CATEGORY',
        align: 'left',
        imageUrl: 'image-1782197542951-765059417.png',
      },
    },
    {
      id: 'coffee',
      name: 'COFFEE',
      width: 'w-[124px]',
      displayOrder: 1,
      block: {
        subtitle: 'ARTISANAL BREWS',
        titleHighlight: 'Traditional Filter',
        titleNormal: 'Coffee.',
        description: 'Brewed to perfection, our signature filter coffee features chicory-infused decoction frothed dynamically with piping hot milk, served in traditional brass dabarah and tumbler.',
        badgeLabel: 'DAILY RITUAL',
        badgeTitle: 'Mylapore Degree Coffee',
        badgeDescription: 'Enjoy a rich, aromatic beverage brewed with freshly roasted coffee beans harvested from the hills of Chikmagalur.',
        badgeLink: 'OUR BEANS',
        buttonLabel: 'VIEW FULL CATEGORY',
        align: 'right',
        imageUrl: 'image-1782199656596-188365013.png',
      },
    },
    {
      id: 'fresh-juices',
      name: 'FRESH JUICES',
      width: 'w-[175px]',
      displayOrder: 2,
      block: {
        subtitle: 'PURE REFRESHMENT',
        titleHighlight: 'Handcrafted',
        titleNormal: 'Nectars.',
        description: 'Quench your thirst with cold-pressed seasonal fruit juices, prepared fresh to order without artificial colors or preservatives.',
        buttonLabel: 'VIEW ALL DRINKS',
        align: 'left',
        imageUrl: 'image-1782197542951-765059417.png',
      },
    },
    {
      id: 'light-lunch',
      name: 'LIGHT LUNCH',
      width: 'w-[171px]',
      displayOrder: 3,
      block: {
        subtitle: 'MIDDAY COMFORT',
        titleHighlight: 'Variety Rice',
        titleNormal: 'Specials.',
        description: 'Quick, nutritious, and full of flavor. Enjoy classics like tang of lemon rice, tempered curd rice, or aromatic sambar rice.',
        buttonLabel: 'EXPLORE LUNCH',
        align: 'right',
        imageUrl: 'image-1782199656596-188365013.png',
      },
    },
    {
      id: 'south-indian-meals',
      name: 'SOUTH INDIAN MEALS',
      width: 'w-[242px]',
      displayOrder: 4,
      block: {
        subtitle: 'THE GRAND THALI',
        titleHighlight: 'A Feast of',
        titleNormal: 'Traditions.',
        description: 'A wholesome, multi-course feast featuring specialty rices, poriyals, kootus, sambar, rasam, freshly fried appalam, and sweet payasam served in the traditional way.',
        badgeLabel: 'CHEF RECOMMENDATION',
        badgeTitle: 'Vasantha Bhavan Special Meals',
        badgeDescription: 'Experience the ultimate vegetarian thali highlighting unique regional subjis and premium basmati options.',
        badgeLink: 'ABOUT THE FEAST',
        buttonLabel: 'VIEW FULL MEALS MENU',
        align: 'left',
        imageUrl: 'image-1782199656596-188365013.png',
      },
    },
    {
      id: 'snacks',
      name: 'SNACKS',
      width: 'w-[125px]',
      displayOrder: 5,
      block: {
        subtitle: 'EVENING CRUNCH',
        titleHighlight: 'Savory Delight',
        titleNormal: 'Snacks.',
        description: 'A crisp selection of fresh medu vadas, layered samosas, and piping hot pakoras, perfect companions for your evening tea.',
        buttonLabel: 'EXPLORE SAVORIES',
        align: 'right',
        imageUrl: 'image-1782197542951-765059417.png',
      },
    },
    {
      id: 'desserts',
      name: 'DESSERTS',
      width: 'w-[137px]',
      displayOrder: 6,
      block: {
        subtitle: 'SWEET FINALE',
        titleHighlight: 'Sweets &',
        titleNormal: 'Confections.',
        description: 'Indulge in our selection of rich ghee-laden halwas, milk-based pedas, and traditional sweets crafted with high-quality ingredients.',
        buttonLabel: 'VIEW ALL SWEETS',
        align: 'left',
        imageUrl: 'image-1782199656596-188365013.png',
      },
    },
  ];

  for (const cat of defaultCategories) {
    await prisma.menuCategory.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        width: cat.width,
        displayOrder: cat.displayOrder,
      },
      create: {
        id: cat.id,
        name: cat.name,
        width: cat.width,
        displayOrder: cat.displayOrder,
      },
    });

    const resolvedUrl = await resolveAndUploadFile(cat.block.imageUrl);
    await prisma.menuBlock.upsert({
      where: { id: cat.id },
      update: {
        subtitle: cat.block.subtitle,
        titleHighlight: cat.block.titleHighlight,
        titleNormal: cat.block.titleNormal,
        description: cat.block.description,
        badgeLabel: cat.block.badgeLabel,
        badgeTitle: cat.block.badgeTitle,
        badgeDescription: cat.block.badgeDescription,
        badgeLink: cat.block.badgeLink,
        buttonLabel: cat.block.buttonLabel,
        align: cat.block.align,
        imageUrl: resolvedUrl,
      },
      create: {
        id: cat.id,
        subtitle: cat.block.subtitle,
        titleHighlight: cat.block.titleHighlight,
        titleNormal: cat.block.titleNormal,
        description: cat.block.description,
        badgeLabel: cat.block.badgeLabel,
        badgeTitle: cat.block.badgeTitle,
        badgeDescription: cat.block.badgeDescription,
        badgeLink: cat.block.badgeLink,
        buttonLabel: cat.block.buttonLabel,
        align: cat.block.align,
        imageUrl: resolvedUrl,
      },
    });
  }
  console.log('Menu categories and content blocks seeded.');

  // 6. Seed Countries & Locations
  console.log('Clearing existing countries and locations...');
  await prisma.location.deleteMany({});
  await prisma.country.deleteMany({});

  console.log('Seeding countries and locations...');

  // India
  const india = await prisma.country.create({
    data: {
      name: 'India',
      overrideCount: 42,
    },
  });

  const indiaLocations = [
    ...Array(14).fill(null).map((_, i) => ({
      title: `Vasanta Bhavan - Chennai ${i + 1}`,
      address: 'Ganesh Apartment, 62a, Lattice Brg Rd, Bharathi Nagar, Thiruvanmiyur, Chennai, Tamil Nadu 600020, India',
      phone: '+91 99528 34444',
      time: '11:00 am - 9:30 pm',
      imageUrl: 'image-1782197542951-765059417.png',
      state: 'Tamil Nadu',
      city: 'Chennai',
      comingSoon: false,
      countryId: india.id,
    })),
    ...Array(4).fill(null).map((_, i) => ({
      title: `Vasanta Bhavan - Delhi ${i + 1}`,
      address: 'Connaught Place, New Delhi, Delhi 110001, India',
      phone: '+91 11 2345 6789',
      time: '10:00 am - 10:30 pm',
      imageUrl: 'image-1782199656596-188365013.png',
      state: 'Delhi',
      city: 'New Delhi',
      comingSoon: i === 3,
      countryId: india.id,
    })),
  ];

  for (const loc of indiaLocations) {
    const resolvedUrl = await resolveAndUploadFile(loc.imageUrl);
    await prisma.location.create({
      data: {
        ...loc,
        imageUrl: resolvedUrl,
      },
    });
  }

  // Dubai
  const dubai = await prisma.country.create({
    data: {
      name: 'Dubai',
      overrideCount: 4,
    },
  });

  const dubaiLocations = Array(4).fill(null).map((_, i) => ({
    title: `Vasanta Bhavan - Dubai Marina ${i + 1}`,
    address: 'Al Seef Street, Dubai Marina, Dubai, United Arab Emirates',
    phone: '+971 4 123 4567',
    time: '11:00 am - 11:30 pm',
    imageUrl: 'image-1782199656596-188365013.png',
    state: 'Dubai',
    city: 'Dubai',
    comingSoon: i === 3,
    countryId: dubai.id,
  }));

  for (const loc of dubaiLocations) {
    const resolvedUrl = await resolveAndUploadFile(loc.imageUrl);
    await prisma.location.create({
      data: {
        ...loc,
        imageUrl: resolvedUrl,
      },
    });
  }

  // Malaysia
  const malaysia = await prisma.country.create({
    data: {
      name: 'Malaysia',
      overrideCount: 2,
    },
  });

  const malaysiaLocations = Array(2).fill(null).map((_, i) => ({
    title: `Vasanta Bhavan - Kuala Lumpur ${i + 1}`,
    address: 'Lebuh Ampang, City Centre, 50100 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur, Malaysia',
    phone: '+60 3 1234 5678',
    time: '10:00 am - 10:00 pm',
    imageUrl: 'image-1782197542951-765059417.png',
    state: 'Kuala Lumpur',
    city: 'Kuala Lumpur',
    comingSoon: false,
    countryId: malaysia.id,
  }));

  for (const loc of malaysiaLocations) {
    const resolvedUrl = await resolveAndUploadFile(loc.imageUrl);
    await prisma.location.create({
      data: {
        ...loc,
        imageUrl: resolvedUrl,
      },
    });
  }

  // UK
  const uk = await prisma.country.create({
    data: {
      name: 'UK',
      overrideCount: 1,
    },
  });

  const resolvedUkUrl = await resolveAndUploadFile('image-1782199656596-188365013.png');
  await prisma.location.create({
    data: {
      title: 'Vasanta Bhavan - London',
      address: 'East Ham, London E6 2JA, United Kingdom',
      phone: '+44 20 1234 5678',
      time: '11:00 am - 10:30 pm',
      imageUrl: resolvedUkUrl,
      state: 'England',
      city: 'London',
      comingSoon: false,
      countryId: uk.id,
    },
  });

  // Qatar
  const qatar = await prisma.country.create({
    data: {
      name: 'Qatar',
      overrideCount: 1,
    },
  });

  const resolvedQatarUrl = await resolveAndUploadFile('image-1782197542951-765059417.png');
  await prisma.location.create({
    data: {
      title: 'Vasanta Bhavan - Doha',
      address: 'Al Mansoura St, Doha, Qatar',
      phone: '+974 4412 3456',
      time: '11:00 am - 11:00 pm',
      imageUrl: resolvedQatarUrl,
      state: 'Doha',
      city: 'Doha',
      comingSoon: true,
      countryId: qatar.id,
    },
  });
  console.log('Countries and locations seeded.');

  // 7. Menu Experiences
  console.log('Seeding menu experiences...');
  await prisma.menuExperience.deleteMany({});
  const experiences = [
    {
      id: 'morning',
      time: '07:00 AM - 11:00 AM',
      title: 'Morning Mist',
      description: 'The aroma of freshly brewed filter coffee and sizzling ghee roasts.',
      imageUrl: 'image-1782197542951-765059417.png',
      displayOrder: 1,
    },
    {
      id: 'noon',
      time: '12:00 PM - 04:00 PM',
      title: 'Noon Radiance',
      description: 'Hearty traditional meals and refreshing artisanal juices.',
      imageUrl: 'image-1782199656596-188365013.png',
      displayOrder: 2,
    },
    {
      id: 'evening',
      time: '05:00 PM - 10:30 PM',
      title: 'Evening Glow',
      description: 'Warm snacks, special festival treats, and intimate conversation.',
      imageUrl: 'image-1782197542951-765059417.png',
      displayOrder: 3,
    },
    {
      id: 'night',
      time: '10:30 PM - 12:00 AM',
      title: 'Midnight Cravings',
      description: 'Late night comfort food and warm desserts for the perfect end to your day.',
      imageUrl: 'image-1782199656596-188365013.png',
      displayOrder: 4,
    },
  ];

  for (const exp of experiences) {
    const resolvedUrl = await resolveAndUploadFile(exp.imageUrl);
    await prisma.menuExperience.create({
      data: {
        ...exp,
        imageUrl: resolvedUrl,
      },
    });
  }
  console.log('Menu experiences seeded.');

  // 8. Branch Gallery Marquee Images
  console.log('Seeding branch gallery marquee images...');
  await prisma.branchGalleryImage.deleteMany({});

  const galleryImages = [
    // Row 1
    { filename: 'about_marquee_img1.png', row: 1, displayOrder: 1 },
    { filename: 'home_marquee_img2.png', row: 1, displayOrder: 2 },
    { filename: 'about_marquee_img3.png', row: 1, displayOrder: 3 },
    { filename: 'home_marquee_img4.png', row: 1, displayOrder: 4 },
    { filename: 'about_marquee_img5.png', row: 1, displayOrder: 5 },
    // Row 2
    { filename: 'home_marquee_img1.png', row: 2, displayOrder: 1 },
    { filename: 'about_marquee_img2.png', row: 2, displayOrder: 2 },
    { filename: 'home_marquee_img3.png', row: 2, displayOrder: 3 },
    { filename: 'about_marquee_img4.png', row: 2, displayOrder: 4 },
    { filename: 'branch-section-img1.png', row: 2, displayOrder: 5 },
  ];

  for (const item of galleryImages) {
    const srcPath = path.join(frontendImagesDir, item.filename);
    const destFilename = `${Date.now()}-${item.filename}`;
    const destPath = path.join(backendUploadsDir, destFilename);

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      const imageUrl = await resolveAndUploadFile(destFilename);
      await prisma.branchGalleryImage.create({
        data: {
          imageUrl,
          row: item.row,
          displayOrder: item.displayOrder,
        },
      });
    } else {
      console.warn(`Source image not found: ${srcPath}`);
      const imageUrl = await resolveAndUploadFile(item.filename);
      await prisma.branchGalleryImage.create({
        data: {
          imageUrl,
          row: item.row,
          displayOrder: item.displayOrder,
        },
      });
    }
  }
  console.log('Branch gallery marquee images seeded.');

  console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
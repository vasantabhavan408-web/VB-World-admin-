import prisma from '../utils/prisma.js';
import { UpdateHeroInput } from '../validators/heroValidator.js';

interface HeroConfigData {
  id: number;
  titleHtml: string;
  subtitleHtml: string;
  webBannerUrl: string;
  mobileBannerUrl: string;
}

export async function getHeroConfig(page: string): Promise<HeroConfigData> {
  const config = await prisma.heroConfig.findUnique({
    where: { page },
  });
  if (config) {
    return config;
  }

  // Create default fallback record if none exists for this page
  return prisma.heroConfig.create({
    data: {
      page,
      titleHtml: 'Serving Traditions<br />Across Generations',
      subtitleHtml: 'Authentic South Indian vegetarian cuisine, crafted with love and served<br class="hidden sm:block" />with warmth for over six decades.',
      webBannerUrl: '/uploads/default-web.jpg',
      mobileBannerUrl: '/uploads/default-mobile.jpg',
    },
  });
}

export async function updateHeroConfig(
  page: string,
  input: UpdateHeroInput
): Promise<HeroConfigData> {
  const existing = await prisma.heroConfig.findUnique({
    where: { page },
  });

  if (existing) {
    return prisma.heroConfig.update({
      where: { id: existing.id },
      data: {
        titleHtml: input.titleHtml,
        subtitleHtml: input.subtitleHtml,
        ...(input.webBannerUrl && { webBannerUrl: input.webBannerUrl }),
        ...(input.mobileBannerUrl && { mobileBannerUrl: input.mobileBannerUrl }),
      },
    });
  }

  return prisma.heroConfig.create({
    data: {
      page,
      titleHtml: input.titleHtml,
      subtitleHtml: input.subtitleHtml,
      webBannerUrl: input.webBannerUrl || '/uploads/default-web.jpg',
      mobileBannerUrl: input.mobileBannerUrl || '/uploads/default-mobile.jpg',
    },
  });
}

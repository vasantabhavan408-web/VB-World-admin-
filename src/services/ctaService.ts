import prisma from '../utils/prisma.js';
import { UpdateCtaInput } from '../validators/ctaValidator.js';

interface PrivacyCtaData {
  id: number;
  imageUrl: string;
  titleHtml: string;
  subtitleHtml: string;
  contactUsUrl: string;
  exploreMenuUrl: string;
}

export async function getCtaConfig(page: string): Promise<PrivacyCtaData | null> {
  return prisma.privacyPolicyCTA.findUnique({
    where: { page },
  });
}

export async function updateCtaConfig(
  page: string,
  input: UpdateCtaInput
): Promise<PrivacyCtaData> {
  const existing = await prisma.privacyPolicyCTA.findUnique({
    where: { page },
  });

  if (existing) {
    return prisma.privacyPolicyCTA.update({
      where: { id: existing.id },
      data: {
        titleHtml: input.titleHtml,
        subtitleHtml: input.subtitleHtml,
        contactUsUrl: input.contactUsUrl,
        exploreMenuUrl: input.exploreMenuUrl,
        ...(input.imageUrl && { imageUrl: input.imageUrl }),
      },
    });
  }

  return prisma.privacyPolicyCTA.create({
    data: {
      page,
      titleHtml: input.titleHtml,
      subtitleHtml: input.subtitleHtml,
      contactUsUrl: input.contactUsUrl,
      exploreMenuUrl: input.exploreMenuUrl,
      imageUrl: input.imageUrl || '/uploads/default-privacy-cta.png',
    },
  });
}

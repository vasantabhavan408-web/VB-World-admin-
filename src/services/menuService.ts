import prisma from '../utils/prisma.js';
import { UpdateMenuBlockInput, CreateMenuExperienceInput, UpdateMenuExperienceInput } from '../validators/menuValidator.js';

export async function listCategories() {
  const count = await prisma.menuCategory.count();
  
  if (count === 0) {
    // Seed default categories only (no content blocks seeded)
    const defaults = [
      { id: 'breakfast', name: 'BREAKFAST', width: 'w-[156px]', displayOrder: 0 },
      { id: 'coffee', name: 'COFFEE', width: 'w-[124px]', displayOrder: 1 },
      { id: 'fresh-juices', name: 'FRESH JUICES', width: 'w-[175px]', displayOrder: 2 },
      { id: 'light-lunch', name: 'LIGHT LUNCH', width: 'w-[171px]', displayOrder: 3 },
      { id: 'south-indian-meals', name: 'SOUTH INDIAN MEALS', width: 'w-[242px]', displayOrder: 4 },
      { id: 'snacks', name: 'SNACKS', width: 'w-[125px]', displayOrder: 5 },
      { id: 'desserts', name: 'DESSERTS', width: 'w-[137px]', displayOrder: 6 },
    ];

    for (const item of defaults) {
      await prisma.menuCategory.create({
        data: {
          id: item.id,
          name: item.name,
          width: item.width,
          displayOrder: item.displayOrder,
        }
      });
    }
  }

  return prisma.menuCategory.findMany({
    orderBy: { displayOrder: 'asc' },
    include: { menuBlock: true }
  });
}

export async function updateMenuBlock(id: string, input: UpdateMenuBlockInput) {
  const existingBlock = await prisma.menuBlock.findUnique({
    where: { id }
  });

  if (existingBlock) {
    return prisma.menuBlock.update({
      where: { id },
      data: {
        subtitle: input.subtitle,
        titleHighlight: input.titleHighlight,
        titleNormal: input.titleNormal,
        description: input.description,
        badgeLabel: input.badgeLabel,
        badgeTitle: input.badgeTitle,
        badgeDescription: input.badgeDescription,
        badgeLink: input.badgeLink,
        buttonLabel: input.buttonLabel,
        align: input.align,
        ...(input.imageUrl && { imageUrl: input.imageUrl }),
      }
    });
  }

  return prisma.menuBlock.create({
    data: {
      id,
      subtitle: input.subtitle,
      titleHighlight: input.titleHighlight,
      titleNormal: input.titleNormal,
      description: input.description,
      badgeLabel: input.badgeLabel,
      badgeTitle: input.badgeTitle,
      badgeDescription: input.badgeDescription,
      badgeLink: input.badgeLink,
      buttonLabel: input.buttonLabel,
      align: input.align,
      imageUrl: input.imageUrl || '',
    }
  });
}

export async function reorderCategories(ids: string[]) {
  return prisma.$transaction(
    ids.map((id, index) =>
      prisma.menuCategory.update({
        where: { id },
        data: { displayOrder: index }
      })
    )
  );
}

export async function listExperiences() {
  return prisma.menuExperience.findMany({
    orderBy: { displayOrder: 'asc' },
  });
}

export async function createExperience(input: CreateMenuExperienceInput) {
  let displayOrder = input.displayOrder;
  if (displayOrder === undefined) {
    const maxExp = await prisma.menuExperience.findFirst({
      orderBy: { displayOrder: 'desc' },
    });
    displayOrder = maxExp ? maxExp.displayOrder + 1 : 1;
  }

  return prisma.menuExperience.create({
    data: {
      id: input.id,
      time: input.time,
      title: input.title,
      description: input.description,
      imageUrl: input.imageUrl,
      displayOrder,
    },
  });
}

export async function updateExperience(id: string, input: UpdateMenuExperienceInput) {
  return prisma.menuExperience.update({
    where: { id },
    data: input,
  });
}

export async function deleteExperience(id: string) {
  return prisma.menuExperience.delete({
    where: { id },
  });
}

export async function reorderExperiences(ids: string[]) {
  return prisma.$transaction(
    ids.map((id, index) =>
      prisma.menuExperience.update({
        where: { id },
        data: { displayOrder: index },
      })
    )
  );
}


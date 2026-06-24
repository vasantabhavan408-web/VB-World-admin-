import prisma from '../utils/prisma.js';
import {
  CreateCountryInput,
  UpdateCountryInput,
  CreateLocationInput,
  UpdateLocationInput,
} from '../validators/branchValidator.js';

export async function getAllCountriesWithLocations() {
  return prisma.country.findMany({
    include: {
      locations: {
        orderBy: {
          id: 'asc',
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  });
}

export async function getAllCountries() {
  return prisma.country.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}

export async function createCountry(input: CreateCountryInput) {
  return prisma.country.create({
    data: {
      name: input.name,
      overrideCount: input.overrideCount,
    },
  });
}

export async function updateCountry(id: number, input: UpdateCountryInput) {
  return prisma.country.update({
    where: { id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.overrideCount !== undefined && { overrideCount: input.overrideCount }),
    },
  });
}

export async function deleteCountry(id: number) {
  return prisma.country.delete({
    where: { id },
  });
}

export async function createLocation(input: CreateLocationInput) {
  return prisma.location.create({
    data: {
      title: input.title,
      address: input.address,
      phone: input.phone,
      time: input.time,
      imageUrl: input.imageUrl || '/uploads/default-branch.jpg',
      state: input.state,
      city: input.city,
      countryId: input.countryId,
      comingSoon: input.comingSoon,
    },
  });
}

export async function updateLocation(id: number, input: UpdateLocationInput) {
  return prisma.location.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.address !== undefined && { address: input.address }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.time !== undefined && { time: input.time }),
      ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl }),
      ...(input.state !== undefined && { state: input.state }),
      ...(input.city !== undefined && { city: input.city }),
      ...(input.countryId !== undefined && { countryId: input.countryId }),
      ...(input.comingSoon !== undefined && { comingSoon: input.comingSoon }),
    },
  });
}

export async function deleteLocation(id: number) {
  return prisma.location.delete({
    where: { id },
  });
}

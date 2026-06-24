import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../utils/response.js';
import * as branchService from '../services/branchService.js';
import {
  createCountrySchema,
  updateCountrySchema,
  createLocationSchema,
  updateLocationSchema,
} from '../validators/branchValidator.js';

export async function getBranches(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await branchService.getAllCountriesWithLocations();
    const formattedData = data.map((country) => ({
      id: country.id,
      name: country.name,
      overrideCount: country.overrideCount,
      createdAt: country.createdAt,
      updatedAt: country.updatedAt,
      locations: country.locations.map((loc) => ({
        id: loc.id,
        title: loc.title,
        address: loc.address,
        phone: loc.phone,
        time: loc.time,
        image: loc.imageUrl,
        state: loc.state,
        city: loc.city,
        countryId: loc.countryId,
        comingSoon: loc.comingSoon,
        directionLink: loc.directionLink,
        contactLink: loc.contactLink,
        createdAt: loc.createdAt,
        updatedAt: loc.updatedAt,
      })),
    }));
    sendSuccess(res, formattedData, 'Branch directories retrieved successfully');
  } catch (error) {
    next(error);
  }
}

export async function getCountries(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await branchService.getAllCountries();
    sendSuccess(res, data, 'Countries retrieved successfully');
  } catch (error) {
    next(error);
  }
}

export async function createCountry(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedBody = createCountrySchema.parse(req.body);
    const data = await branchService.createCountry(validatedBody);
    sendSuccess(res, data, 'Country created successfully');
  } catch (error) {
    next(error);
  }
}

export async function updateCountry(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    const validatedBody = updateCountrySchema.parse(req.body);
    const data = await branchService.updateCountry(id, validatedBody);
    sendSuccess(res, data, 'Country updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteCountry(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    await branchService.deleteCountry(id);
    sendSuccess(res, null, 'Country deleted successfully');
  } catch (error) {
    next(error);
  }
}

export async function createLocation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const file = req.file;
    const imageUrl = file ? ((file as any).location || `/uploads/${file.filename}`) : undefined;

    const validatedBody = createLocationSchema.parse({
      ...req.body,
      imageUrl,
    });

    const data = await branchService.createLocation(validatedBody);
    sendSuccess(res, data, 'Location created successfully');
  } catch (error) {
    next(error);
  }
}

export async function updateLocation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    const file = req.file;
    const imageUrl = file ? ((file as any).location || `/uploads/${file.filename}`) : undefined;

    const validatedBody = updateLocationSchema.parse({
      ...req.body,
      ...(imageUrl && { imageUrl }),
    });

    const data = await branchService.updateLocation(id, validatedBody);
    sendSuccess(res, data, 'Location updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteLocation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    await branchService.deleteLocation(id);
    sendSuccess(res, null, 'Location deleted successfully');
  } catch (error) {
    next(error);
  }
}

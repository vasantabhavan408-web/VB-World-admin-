import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../utils/response.js';
import * as galleryService from '../services/galleryService.js';
import {
  createGalleryImageSchema,
  updateGalleryImageSchema,
  reorderGalleryImagesSchema,
} from '../validators/galleryValidator.js';

export async function getGalleryImages(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await galleryService.getAllGalleryImages();
    sendSuccess(res, data, 'Gallery images retrieved successfully');
  } catch (error) {
    next(error);
  }
}

export async function createGalleryImage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, message: 'Image file is required' });
      return;
    }

    const validatedBody = createGalleryImageSchema.parse(req.body);
    const imageUrl = (file as any).location || `/uploads/${file.filename}`;

    const data = await galleryService.createGalleryImage({
      ...validatedBody,
      imageUrl,
    });
    sendSuccess(res, data, 'Gallery image uploaded successfully');
  } catch (error) {
    next(error);
  }
}

export async function updateGalleryImage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    const validatedBody = updateGalleryImageSchema.parse(req.body);

    const file = req.file;
    const imageUrl = file ? ((file as any).location || `/uploads/${file.filename}`) : undefined;

    const data = await galleryService.updateGalleryImage(id, {
      ...validatedBody,
      ...(imageUrl && { imageUrl }),
    });
    sendSuccess(res, data, 'Gallery image updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteGalleryImage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    await galleryService.deleteGalleryImage(id);
    sendSuccess(res, null, 'Gallery image deleted successfully');
  } catch (error) {
    next(error);
  }
}

export async function reorderGalleryImages(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedBody = reorderGalleryImagesSchema.parse(req.body);
    await galleryService.reorderGalleryImages(validatedBody.items);
    sendSuccess(res, null, 'Image row updated successfully');
  } catch (error) {
    next(error);
  }
}

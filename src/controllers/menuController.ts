import { Request, Response, NextFunction } from 'express';
import { 
  listCategories, 
  updateMenuBlock, 
  reorderCategories, 
  listExperiences, 
  createExperience, 
  updateExperience, 
  deleteExperience, 
  reorderExperiences 
} from '../services/menuService.js';
import { sendSuccess } from '../utils/response.js';
import { 
  updateMenuBlockSchema, 
  createMenuExperienceSchema, 
  updateMenuExperienceSchema 
} from '../validators/menuValidator.js';

export async function getCategories(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const categories = await listCategories();
    sendSuccess(res, categories, 'Menu categories retrieved successfully');
  } catch (error) {
    next(error);
  }
}

export async function updateBlock(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    
    const imageUrl = req.file
      ? ((req.file as any).location || `/uploads/${req.file.filename}`)
      : undefined;

    const validatedBody = updateMenuBlockSchema.parse({
      subtitle: req.body.subtitle,
      titleHighlight: req.body.titleHighlight,
      titleNormal: req.body.titleNormal,
      description: req.body.description,
      badgeLabel: req.body.badgeLabel === 'null' || !req.body.badgeLabel ? null : req.body.badgeLabel,
      badgeTitle: req.body.badgeTitle === 'null' || !req.body.badgeTitle ? null : req.body.badgeTitle,
      badgeDescription: req.body.badgeDescription === 'null' || !req.body.badgeDescription ? null : req.body.badgeDescription,
      badgeLink: req.body.badgeLink === 'null' || !req.body.badgeLink ? null : req.body.badgeLink,
      buttonLabel: req.body.buttonLabel === 'null' || !req.body.buttonLabel ? null : req.body.buttonLabel,
      imageUrl,
    });

    const updated = await updateMenuBlock(id, validatedBody);
    sendSuccess(res, updated, 'Menu block updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function reorder(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      throw new Error('Category IDs list is required');
    }
    await reorderCategories(ids);
    sendSuccess(res, null, 'Categories reordered successfully');
  } catch (error) {
    next(error);
  }
}

export async function getExperiences(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const experiences = await listExperiences();
    sendSuccess(res, experiences, 'Menu experiences retrieved successfully');
  } catch (error) {
    next(error);
  }
}

export async function createMenuExperience(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const imageUrl = req.file
      ? ((req.file as any).location || `/uploads/${req.file.filename}`)
      : req.body.imageUrl;

    const validatedBody = createMenuExperienceSchema.parse({
      id: req.body.id,
      time: req.body.time,
      title: req.body.title,
      description: req.body.description,
      imageUrl,
      displayOrder: req.body.displayOrder ? parseInt(req.body.displayOrder, 10) : undefined,
    });

    const created = await createExperience(validatedBody);
    sendSuccess(res, created, 'Menu experience created successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateMenuExperience(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const imageUrl = req.file
      ? ((req.file as any).location || `/uploads/${req.file.filename}`)
      : req.body.imageUrl;

    const validatedBody = updateMenuExperienceSchema.parse({
      time: req.body.time,
      title: req.body.title,
      description: req.body.description,
      imageUrl,
      displayOrder: req.body.displayOrder ? parseInt(req.body.displayOrder, 10) : undefined,
    });

    const updated = await updateExperience(id, validatedBody);
    sendSuccess(res, updated, 'Menu experience updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteMenuExperience(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    await deleteExperience(id);
    sendSuccess(res, null, 'Menu experience deleted successfully');
  } catch (error) {
    next(error);
  }
}

export async function reorderMenuExperiences(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      throw new Error('Experience IDs list is required');
    }
    await reorderExperiences(ids);
    sendSuccess(res, null, 'Menu experiences reordered successfully');
  } catch (error) {
    next(error);
  }
}


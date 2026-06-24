import { Request, Response, NextFunction } from 'express';
import { getHeroConfig, updateHeroConfig } from '../services/heroService.js';
import { sendSuccess } from '../utils/response.js';
import { updateHeroSchema } from '../validators/heroValidator.js';

export async function getHero(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = typeof req.query.page === 'string' ? req.query.page : 'home';
    const config = await getHeroConfig(page);
    sendSuccess(res, config, 'Hero configuration retrieved successfully');
  } catch (error) {
    next(error);
  }
}

export async function updateHero(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    const webBannerUrl = files?.webBanner?.[0]
      ? ((files.webBanner[0] as any).location || `/uploads/${files.webBanner[0].filename}`)
      : undefined;

    const mobileBannerUrl = files?.mobileBanner?.[0]
      ? ((files.mobileBanner[0] as any).location || `/uploads/${files.mobileBanner[0].filename}`)
      : undefined;

    // Validate body (including file paths if present)
    const validatedBody = updateHeroSchema.parse({
      page: req.body.page || 'home',
      titleHtml: req.body.titleHtml,
      subtitleHtml: req.body.subtitleHtml,
      webBannerUrl,
      mobileBannerUrl,
    });

    const updated = await updateHeroConfig(validatedBody.page || 'home', validatedBody);
    sendSuccess(res, updated, 'Hero configuration updated successfully');
  } catch (error) {
    next(error);
  }
}

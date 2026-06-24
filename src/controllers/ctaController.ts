import { Request, Response, NextFunction } from 'express';
import { getCtaConfig, updateCtaConfig } from '../services/ctaService.js';
import { sendSuccess } from '../utils/response.js';
import { updateCtaSchema } from '../validators/ctaValidator.js';

export async function getCta(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = typeof req.query.page === 'string' ? req.query.page : 'privacy';
    const config = await getCtaConfig(page);
    sendSuccess(res, config, 'Privacy CTA configuration retrieved successfully');
  } catch (error) {
    next(error);
  }
}

export async function updateCta(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const imageUrl = req.file
      ? ((req.file as any).location || `/uploads/${req.file.filename}`)
      : undefined;

    const validatedBody = updateCtaSchema.parse({
      page: req.body.page || 'privacy',
      titleHtml: req.body.titleHtml,
      subtitleHtml: req.body.subtitleHtml,
      contactUsUrl: req.body.contactUsUrl,
      exploreMenuUrl: req.body.exploreMenuUrl,
      imageUrl,
    });

    const updated = await updateCtaConfig(validatedBody.page || 'privacy', validatedBody);
    sendSuccess(res, updated, 'Privacy CTA configuration updated successfully');
  } catch (error) {
    next(error);
  }
}

import { Router } from 'express';
import { login, refresh } from '../controllers/authController.js';
import { getHero, updateHero } from '../controllers/heroController.js';
import {
  getBranches,
  createCountry,
  updateCountry,
  deleteCountry,
  createLocation,
  updateLocation,
  deleteLocation,
  getCountries,
} from '../controllers/branchController.js';
import { getCta, updateCta } from '../controllers/ctaController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';
import {
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  reorderGalleryImages,
} from '../controllers/galleryController.js';

const router = Router();

const uploadFields = upload.fields([
  { name: 'webBanner', maxCount: 1 },
  { name: 'mobileBanner', maxCount: 1 },
]);

// Auth routes
router.post('/auth/login', login);
router.post('/auth/refresh', refresh);

// Hero routes
router.get('/hero', getHero);
router.post('/hero', requireAuth, uploadFields, updateHero);

// Public Branch routes
router.get('/branches', getBranches);
router.get('/branches/gallery', getGalleryImages);

// Admin Country routes
router.get('/admin/countries', requireAuth, getCountries);
router.post('/admin/countries', requireAuth, createCountry);
router.put('/admin/countries/:id', requireAuth, updateCountry);
router.delete('/admin/countries/:id', requireAuth, deleteCountry);

// Admin Location routes
router.post('/admin/locations', requireAuth, upload.single('image'), createLocation);
router.put('/admin/locations/:id', requireAuth, upload.single('image'), updateLocation);
router.delete('/admin/locations/:id', requireAuth, deleteLocation);

// Admin Gallery routes
router.post('/admin/branches/gallery', requireAuth, upload.single('image'), createGalleryImage);
router.put('/admin/branches/gallery/reorder', requireAuth, reorderGalleryImages);
router.put('/admin/branches/gallery/:id', requireAuth, upload.single('image'), updateGalleryImage);
router.delete('/admin/branches/gallery/:id', requireAuth, deleteGalleryImage);

// CTA routes
router.get('/cta', getCta);
router.post('/admin/cta', requireAuth, upload.single('image'), updateCta);

// Menu Categories and Blocks routes
import { 
  getCategories, 
  createCategory,
  updateCategory,
  deleteCategory,
  updateBlock, 
  reorder,
  getExperiences,
  createMenuExperience,
  updateMenuExperience,
  deleteMenuExperience,
  reorderMenuExperiences
} from '../controllers/menuController.js';
router.get('/menu/categories', getCategories);
router.post('/admin/menu/categories', requireAuth, createCategory);
router.put('/admin/menu/categories/:id', requireAuth, updateCategory);
router.delete('/admin/menu/categories/:id', requireAuth, deleteCategory);
router.post('/admin/menu/blocks/:id', requireAuth, upload.single('image'), updateBlock);
router.put('/admin/menu/categories/reorder', requireAuth, reorder);

// Menu Experiences routes
router.get('/menu/experiences', getExperiences);
router.post('/admin/menu/experiences', requireAuth, upload.single('image'), createMenuExperience);
router.put('/admin/menu/experiences/reorder', requireAuth, reorderMenuExperiences);
router.put('/admin/menu/experiences/:id', requireAuth, upload.single('image'), updateMenuExperience);
router.delete('/admin/menu/experiences/:id', requireAuth, deleteMenuExperience);

export default router;

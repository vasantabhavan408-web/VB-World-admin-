import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.js';
import { sendSuccess } from './utils/response.js';
import apiRoutes from './routes/apiRoutes.js';

const app: Express = express();

// Security middlewares
app.use(
  (helmet as any)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(cors());

// Serve uploads statically
app.use('/uploads', express.static('public/uploads'));

// Logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
import { prisma } from './utils/prisma.js';

// Mount API routes
app.use('/api', apiRoutes);

// Root endpoint with database ping
app.get('/', async (req: Request, res: Response) => {
  let dbStatus = 'connected';
  let dbLatencyMs: number | null = null;

  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - start;
  } catch (err: any) {
    dbStatus = `error: ${err.message}`;
  }

  sendSuccess(
    res,
    {
      name: 'VB World Backend API',
      status: 'active',
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
      endpoints: {
        health: '/health',
        branches: '/api/branches',
        menu: '/api/menu',
        hero: '/api/hero',
        cta: '/api/cta',
        gallery: '/api/gallery',
      },
    },
    'VB World API Server is running'
  );
});

// Health Check with database ping
app.get('/health', async (req: Request, res: Response) => {
  let dbStatus = 'healthy';
  let dbLatencyMs: number | null = null;

  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - start;
  } catch (err: any) {
    dbStatus = 'unhealthy';
  }

  sendSuccess(
    res,
    {
      status: 'healthy',
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
      timestamp: new Date(),
    },
    'API and Database are active'
  );
});

// Error handling middleware (should be attached at the end)
app.use(errorHandler);

export default app;

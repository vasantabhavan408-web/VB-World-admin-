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
  helmet({
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
//app.use(limiter);

// Mount API routes
app.use('/api', apiRoutes);

// Health Check
app.get('/health', (req: Request, res: Response) => {
  sendSuccess(res, { status: 'healthy', timestamp: new Date() }, 'API is active');
});

// Error handling middleware (should be attached at the end)
app.use(errorHandler);

export default app;

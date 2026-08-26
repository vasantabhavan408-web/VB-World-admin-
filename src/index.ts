import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 4000;

// Only call listen when not running in a serverless environment (like Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Server] running on http://localhost:${PORT}`);
  });
}

export default app;

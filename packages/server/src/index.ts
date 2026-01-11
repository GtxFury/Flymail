import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { domainsRouter } from './routes/domains.js';
import { addressesRouter } from './routes/addresses.js';
import { emailsRouter } from './routes/emails.js';
import { startSmtpServer } from './smtp/server.js';
import { errorHandler } from './middleware/error.js';

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/domains', domainsRouter);
app.use('/api/addresses', addressesRouter);
app.use('/api/emails', emailsRouter);

// Error handler
app.use(errorHandler);

// Start servers
app.listen(Number(PORT), HOST, () => {
  console.log(`API server running on http://${HOST}:${PORT}`);
});

// Start SMTP server
startSmtpServer();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import fundRoutes from './routes/funds';
import transactionRoutes from './routes/transactions';
import holdingRoutes from './routes/holdings';
import dashboardRoutes from './routes/dashboard';
import fundRelationshipsRoutes from './routes/fund-relationships';
import approvalsRoutes from './routes/approvals';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/funds', fundRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/holdings', holdingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/fund-relationships', fundRelationshipsRoutes);
app.use('/api/approvals', approvalsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

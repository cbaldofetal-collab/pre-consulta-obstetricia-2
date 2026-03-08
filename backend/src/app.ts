import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import preConsultaRoutes from './routes/preConsultaRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT ?? 3002;

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5174' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pre-consulta', preConsultaRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});

export default app;

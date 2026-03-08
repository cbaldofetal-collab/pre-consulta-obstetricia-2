import { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../lib/auth';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
  userNome?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token não fornecido.' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verificarToken(token);
    req.userId = payload.id;
    req.userEmail = payload.email;
    req.userNome = payload.nome;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

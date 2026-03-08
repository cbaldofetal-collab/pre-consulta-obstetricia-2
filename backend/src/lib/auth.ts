import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const _secret = process.env.JWT_SECRET;
if (!_secret) {
  throw new Error('JWT_SECRET não definido. Configure a variável de ambiente JWT_SECRET.');
}
const JWT_SECRET: string = _secret;
const JWT_EXPIRES = '7d';

export function hashSenha(senha: string): Promise<string> {
  return bcrypt.hash(senha, 12);
}

export function compararSenha(senha: string, hash: string): Promise<boolean> {
  return bcrypt.compare(senha, hash);
}

export function gerarToken(payload: { id: string; email: string; nome: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verificarToken(token: string): { id: string; email: string; nome: string } {
  return jwt.verify(token, JWT_SECRET) as { id: string; email: string; nome: string };
}

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashSenha, compararSenha, gerarToken } from '../lib/auth';

const prisma = new PrismaClient();

export async function register(req: Request, res: Response) {
  try {
    const { nome, email, senha, aceitouLGPD } = req.body;

    if (!nome || !email || !senha) {
      res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
      return;
    }

    if (!aceitouLGPD) {
      res.status(400).json({ error: 'É necessário aceitar o Termo de Consentimento LGPD.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'E-mail inválido.' });
      return;
    }

    if (senha.length < 6) {
      res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    const existente = await prisma.user.findUnique({ where: { email } });
    if (existente) {
      res.status(409).json({ error: 'E-mail já cadastrado.' });
      return;
    }

    const senhaHash = await hashSenha(senha);
    const ipOrigem = req.ip ?? req.headers['x-forwarded-for']?.toString() ?? null;

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senhaHash,
        consentimento: {
          create: {
            aceitouEm: new Date(),
            ipOrigem,
            versao: '1.0',
          },
        },
      },
    });

    const token = gerarToken({ id: user.id, email: user.email, nome: user.nome });

    res.status(201).json({
      token,
      user: { id: user.id, nome: user.nome, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'E-mail ou senha incorretos.' });
      return;
    }

    const senhaCorreta = await compararSenha(senha, user.senhaHash);
    if (!senhaCorreta) {
      res.status(401).json({ error: 'E-mail ou senha incorretos.' });
      return;
    }

    const token = gerarToken({ id: user.id, email: user.email, nome: user.nome });

    res.json({
      token,
      user: { id: user.id, nome: user.nome, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
}

import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { processarFormulario } from '../lib/hipoteses';
import { gerarPdf } from '../lib/gerarPdf';
import type { Sintoma, Hipotese, Alerta } from '../lib/hipoteses';
import type { AuthRequest } from '../middleware/authMiddleware';

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5174';
const BACKEND_URL = process.env.BACKEND_URL ?? `http://localhost:${process.env.PORT ?? 3002}`;

export async function criarPreConsulta(req: AuthRequest, res: Response) {
  try {
    const {
      nomeGestante, idadeGestante, semanaGestacional, dum, numGestacoes,
      queixaPrincipal, sintomas, paDomiciliar, pesoAtual, medicacoes, perguntasMedico,
    } = req.body;

    const { resumo, hipoteses, alertas } = processarFormulario({
      nomeGestante, idadeGestante, semanaGestacional, dum, numGestacoes,
      queixaPrincipal, sintomas, paDomiciliar, pesoAtual, medicacoes, perguntasMedico,
    });

    const preConsulta = await prisma.preConsulta.create({
      data: {
        userId: req.userId ?? null,
        nomeGestante,
        idadeGestante: Number(idadeGestante),
        semanaGestacional: Number(semanaGestacional),
        dum: dum ?? null,
        numGestacoes: Number(numGestacoes ?? 1),
        queixaPrincipal,
        sintomas: JSON.stringify(sintomas),
        paDomiciliar: paDomiciliar ?? null,
        pesoAtual: pesoAtual ? Number(pesoAtual) : null,
        medicacoes: medicacoes ?? null,
        perguntasMedico: perguntasMedico ?? null,
        resumo,
        hipoteses: JSON.stringify(hipoteses),
        alertas: JSON.stringify(alertas),
      },
    });

    res.status(201).json({
      id: preConsulta.id,
      resumo,
      hipoteses,
      alertas,
      linkMedico: `${FRONTEND_URL}/resultado/${preConsulta.id}`,
      linkPdf: `${BACKEND_URL}/api/pre-consulta/${preConsulta.id}/pdf`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar pré-consulta.' });
  }
}

export async function buscarPreConsulta(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const raw = await prisma.preConsulta.findUnique({ where: { id } });

    if (!raw) {
      res.status(404).json({ error: 'Pré-consulta não encontrada.' });
      return;
    }

    res.json({
      ...raw,
      sintomas: JSON.parse(raw.sintomas),
      hipoteses: JSON.parse(raw.hipoteses),
      alertas: JSON.parse(raw.alertas),
      linkMedico: `${FRONTEND_URL}/resultado/${raw.id}`,
      linkPdf: `${BACKEND_URL}/api/pre-consulta/${raw.id}/pdf`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pré-consulta.' });
  }
}

export async function baixarPdf(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const raw = await prisma.preConsulta.findUnique({ where: { id } });

    if (!raw) {
      res.status(404).json({ error: 'Pré-consulta não encontrada.' });
      return;
    }

    const pdfBuffer = await gerarPdf({
      ...raw,
      sintomas: JSON.parse(raw.sintomas) as Sintoma[],
      hipoteses: JSON.parse(raw.hipoteses) as Hipotese[],
      alertas: JSON.parse(raw.alertas) as Alerta[],
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="pre-consulta-${raw.nomeGestante.replace(/\s+/g, '-')}-${id.slice(0, 8)}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar PDF.' });
  }
}

import { Router } from 'express';
import { criarPreConsulta, buscarPreConsulta, baixarPdf } from '../controllers/preConsultaController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, criarPreConsulta);
router.get('/:id/pdf', baixarPdf);      // PDF público (médico acessa sem login)
router.get('/:id', buscarPreConsulta);  // Resultado público (médico acessa sem login)

export default router;

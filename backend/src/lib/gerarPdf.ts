import PDFDocument from 'pdfkit';
import type { Hipotese, Alerta, Sintoma } from './hipoteses';

interface PreConsultaData {
  id: string;
  createdAt: Date;
  nomeGestante: string;
  idadeGestante: number;
  semanaGestacional: number;
  dum?: string | null;
  numGestacoes: number;
  queixaPrincipal: string;
  sintomas: Sintoma[];
  paDomiciliar?: string | null;
  pesoAtual?: number | null;
  medicacoes?: string | null;
  perguntasMedico?: string | null;
  resumo: string;
  hipoteses: Hipotese[];
  alertas: Alerta[];
}

const CORES = {
  sage: '#6B8F71',
  sageLight: '#A8C5AD',
  cream: '#F5F0E8',
  vermelho: '#DC2626',
  amarelo: '#D97706',
  verde: '#16A34A',
  cinza: '#6B7280',
  preto: '#1F2937',
};

export function gerarPdf(data: PreConsultaData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // ── Cabeçalho ──────────────────────────────────────────────────
    doc
      .fillColor(CORES.sage)
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('Pré-Consulta Obstétrica', { align: 'center' });

    doc
      .fillColor(CORES.cinza)
      .fontSize(10)
      .font('Helvetica')
      .text(
        `ID: ${data.id}   |   Data: ${new Date(data.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
        { align: 'center' }
      );

    doc.moveDown(1);
    divisor(doc);

    // ── Identificação ───────────────────────────────────────────────
    secao(doc, 'Identificação da Gestante');
    linha(doc, 'Nome', data.nomeGestante);
    linha(doc, 'Idade', `${data.idadeGestante} anos`);
    linha(doc, 'Idade Gestacional', `${data.semanaGestacional} semanas`);
    if (data.dum) linha(doc, 'DUM', data.dum);
    linha(doc, 'Nº de Gestações', String(data.numGestacoes));
    doc.moveDown(0.5);

    // ── Queixa Principal ────────────────────────────────────────────
    secao(doc, 'Queixa Principal');
    doc
      .fillColor(CORES.preto)
      .fontSize(11)
      .font('Helvetica')
      .text(`"${data.queixaPrincipal}"`, { indent: 10 });
    doc.moveDown(0.5);

    // ── Sintomas ────────────────────────────────────────────────────
    const sintomasPresentes = data.sintomas.filter(s => s.presente);
    if (sintomasPresentes.length > 0) {
      secao(doc, 'Sintomas Relatados');
      sintomasPresentes.forEach(s => {
        const intensidade = s.intensidade ? ` (${s.intensidade})` : '';
        doc
          .fillColor(CORES.preto)
          .fontSize(10)
          .font('Helvetica')
          .text(`• ${s.nome.replace(/_/g, ' ')}${intensidade}`, { indent: 10 });
      });
      doc.moveDown(0.5);
    }

    // ── Dados Vitais / Clínicos ──────────────────────────────────────
    secao(doc, 'Dados Clínicos');
    if (data.paDomiciliar) linha(doc, 'PA Domiciliar', data.paDomiciliar);
    if (data.pesoAtual) linha(doc, 'Peso Atual', `${data.pesoAtual} kg`);
    if (data.medicacoes) linha(doc, 'Medicações em uso', data.medicacoes);
    if (!data.paDomiciliar && !data.pesoAtual && !data.medicacoes) {
      doc.fillColor(CORES.cinza).fontSize(10).text('Nenhum dado informado.', { indent: 10 });
    }
    doc.moveDown(0.5);

    // ── Perguntas para o Médico ──────────────────────────────────────
    if (data.perguntasMedico) {
      secao(doc, 'Perguntas para o Médico');
      doc
        .fillColor(CORES.preto)
        .fontSize(10)
        .font('Helvetica')
        .text(data.perguntasMedico, { indent: 10 });
      doc.moveDown(0.5);
    }

    divisor(doc);

    // ── Resumo Clínico ───────────────────────────────────────────────
    secao(doc, 'Resumo Clínico (Gerado Automaticamente)');
    doc
      .fillColor(CORES.preto)
      .fontSize(10)
      .font('Helvetica')
      .text(data.resumo, { indent: 10 });
    doc.moveDown(0.5);

    // ── Sinais de Alerta ─────────────────────────────────────────────
    if (data.alertas.length > 0) {
      secao(doc, 'Sinais de Alerta');
      data.alertas.forEach(a => {
        const cor = a.nivel === 'vermelho' ? CORES.vermelho : a.nivel === 'amarelo' ? CORES.amarelo : CORES.verde;
        const icone = a.nivel === 'vermelho' ? '🔴' : a.nivel === 'amarelo' ? '🟡' : '🟢';
        doc
          .fillColor(cor)
          .fontSize(11)
          .font('Helvetica-Bold')
          .text(`${icone}  ${a.descricao}`, { indent: 10 });
        if (a.detalhes) {
          doc
            .fillColor(CORES.cinza)
            .fontSize(9)
            .font('Helvetica')
            .text(a.detalhes, { indent: 20 });
        }
        doc.moveDown(0.3);
      });
    }

    // ── Hipóteses Diagnósticas ───────────────────────────────────────
    if (data.hipoteses.length > 0) {
      secao(doc, 'Hipóteses Diagnósticas');
      data.hipoteses.forEach(h => {
        const cor = h.nivel === 'vermelho' ? CORES.vermelho : h.nivel === 'amarelo' ? CORES.amarelo : CORES.verde;
        doc
          .fillColor(cor)
          .fontSize(10)
          .font('Helvetica')
          .text(`• ${h.descricao}`, { indent: 10 });
      });
      doc.moveDown(0.5);
    }

    divisor(doc);

    // ── Rodapé ───────────────────────────────────────────────────────
    doc
      .fillColor(CORES.cinza)
      .fontSize(8)
      .font('Helvetica-Oblique')
      .text(
        'Documento gerado automaticamente pelo sistema Pré-Consulta Obstétrica. ' +
        'As hipóteses e alertas são baseados em regras clínicas e devem ser validados pelo profissional de saúde.',
        { align: 'center' }
      );

    doc.end();
  });
}

function secao(doc: PDFKit.PDFDocument, titulo: string) {
  doc
    .fillColor(CORES.sage)
    .fontSize(12)
    .font('Helvetica-Bold')
    .text(titulo);
  doc.moveDown(0.3);
}

function linha(doc: PDFKit.PDFDocument, label: string, valor: string) {
  doc
    .fillColor(CORES.cinza)
    .fontSize(10)
    .font('Helvetica-Bold')
    .text(`${label}: `, { continued: true, indent: 10 })
    .fillColor(CORES.preto)
    .font('Helvetica')
    .text(valor);
}

function divisor(doc: PDFKit.PDFDocument) {
  doc
    .moveTo(50, doc.y)
    .lineTo(doc.page.width - 50, doc.y)
    .strokeColor(CORES.sageLight)
    .lineWidth(0.5)
    .stroke();
  doc.moveDown(0.5);
}

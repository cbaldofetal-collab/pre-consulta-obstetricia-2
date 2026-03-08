export interface Sintoma {
  nome: string;
  presente: boolean;
  intensidade?: 'leve' | 'moderado' | 'intenso';
}

export interface FormData {
  nomeGestante: string;
  idadeGestante: number;
  semanaGestacional: number;
  dum?: string;
  numGestacoes: number;
  queixaPrincipal: string;
  sintomas: Sintoma[];
  paDomiciliar?: string;
  pesoAtual?: number;
  medicacoes?: string;
  perguntasMedico?: string;
}

export interface Hipotese {
  descricao: string;
  nivel: 'vermelho' | 'amarelo' | 'verde';
}

export interface Alerta {
  descricao: string;
  nivel: 'vermelho' | 'amarelo' | 'verde';
  detalhes?: string;
}

export interface ResultadoMotor {
  resumo: string;
  hipoteses: Hipotese[];
  alertas: Alerta[];
}

function temSintoma(sintomas: Sintoma[], nome: string, intensidadeMinima?: 'leve' | 'moderado' | 'intenso'): boolean {
  const s = sintomas.find(s => s.nome === nome && s.presente);
  if (!s) return false;
  if (!intensidadeMinima) return true;
  const ordem = { leve: 1, moderado: 2, intenso: 3 };
  return ordem[s.intensidade ?? 'leve'] >= ordem[intensidadeMinima];
}

export function processarFormulario(data: FormData): ResultadoMotor {
  const alertas: Alerta[] = [];
  const hipoteses: Hipotese[] = [];
  const { sintomas, semanaGestacional } = data;

  // ===== ALERTAS VERMELHOS (urgência imediata) =====

  if (
    temSintoma(sintomas, 'cefaleia', 'intenso') &&
    temSintoma(sintomas, 'visao_turva') &&
    temSintoma(sintomas, 'edema')
  ) {
    alertas.push({
      nivel: 'vermelho',
      descricao: 'Possível pré-eclâmpsia grave',
      detalhes: 'Tríade cefaleia intensa + visão turva + edema. Verificar PA e proteinúria urgente.',
    });
    hipoteses.push({ nivel: 'vermelho', descricao: 'Pré-eclâmpsia grave' });
  }

  if (temSintoma(sintomas, 'sangramento') && temSintoma(sintomas, 'dor_abdominal', 'moderado')) {
    alertas.push({
      nivel: 'vermelho',
      descricao: 'Sangramento + dor abdominal',
      detalhes: 'Avaliar DPP (descolamento prematuro de placenta) ou placenta prévia.',
    });
    hipoteses.push({ nivel: 'vermelho', descricao: 'DPP / Placenta prévia' });
  }

  if (temSintoma(sintomas, 'movimentos_fetais_reduzidos')) {
    alertas.push({
      nivel: 'vermelho',
      descricao: 'Movimentos fetais reduzidos',
      detalhes: 'Realizar cardiotocografia e avaliação do bem-estar fetal.',
    });
    hipoteses.push({ nivel: 'vermelho', descricao: 'Sofrimento fetal — investigar urgente' });
  }

  if (temSintoma(sintomas, 'contracoes') && semanaGestacional < 37) {
    alertas.push({
      nivel: 'vermelho',
      descricao: `Contrações com ${semanaGestacional} semanas (pré-termo)`,
      detalhes: 'Avaliar trabalho de parto prematuro. Tocolíticos se indicado.',
    });
    hipoteses.push({ nivel: 'vermelho', descricao: 'Trabalho de parto prematuro (TPP)' });
  }

  if (temSintoma(sintomas, 'dispneia', 'intenso')) {
    alertas.push({
      nivel: 'vermelho',
      descricao: 'Dispneia intensa',
      detalhes: 'Excluir TEP, cardiopatia ou edema agudo de pulmão.',
    });
    hipoteses.push({ nivel: 'vermelho', descricao: 'TEP / Cardiopatia — excluir urgente' });
  }

  // ===== ALERTAS AMARELOS (atenção na consulta) =====

  if (
    temSintoma(sintomas, 'cefaleia') &&
    temSintoma(sintomas, 'edema') &&
    !temSintoma(sintomas, 'visao_turva')
  ) {
    alertas.push({
      nivel: 'amarelo',
      descricao: 'Cefaleia + edema sem visão turva',
      detalhes: 'Aferir PA. Pode indicar hipertensão gestacional.',
    });
    if (!hipoteses.some(h => h.descricao.includes('pré-eclâmpsia'))) {
      hipoteses.push({ nivel: 'amarelo', descricao: 'Hipertensão gestacional' });
    }
  }

  if (temSintoma(sintomas, 'febre') && temSintoma(sintomas, 'disuria')) {
    alertas.push({
      nivel: 'amarelo',
      descricao: 'Febre + disúria',
      detalhes: 'Solicitar EAS e urocultura. Avaliar ITU / pielonefrite.',
    });
    hipoteses.push({ nivel: 'amarelo', descricao: 'ITU / Pielonefrite' });
  }

  if (temSintoma(sintomas, 'corrimento')) {
    alertas.push({
      nivel: 'amarelo',
      descricao: 'Corrimento vaginal',
      detalhes: 'Avaliar características. Cogitar vaginose bacteriana ou candidíase.',
    });
    hipoteses.push({ nivel: 'amarelo', descricao: 'Vaginose bacteriana / Candidíase' });
  }

  if (temSintoma(sintomas, 'nauseas', 'intenso') && semanaGestacional > 12) {
    alertas.push({
      nivel: 'amarelo',
      descricao: `Náuseas intensas com ${semanaGestacional} semanas`,
      detalhes: 'Fora da faixa esperada. Avaliar hiperêmese gravídica, estado nutricional e hidratação.',
    });
    hipoteses.push({ nivel: 'amarelo', descricao: 'Hiperêmese gravídica' });
  }

  if (temSintoma(sintomas, 'sangramento') && !temSintoma(sintomas, 'dor_abdominal')) {
    alertas.push({
      nivel: 'amarelo',
      descricao: 'Sangramento sem dor abdominal',
      detalhes: 'Avaliar colo uterino. Pode ser sangramento de implantação, ectrópio ou placenta prévia assintomática.',
    });
    hipoteses.push({ nivel: 'amarelo', descricao: 'Sangramento vaginal — investigar etiologia' });
  }

  // ===== HIPÓTESES VERDES (comuns / benignas) =====

  if (temSintoma(sintomas, 'nauseas') && semanaGestacional <= 12) {
    hipoteses.push({ nivel: 'verde', descricao: 'Enjoo gravídico típico (1º trimestre)' });
  }

  if (temSintoma(sintomas, 'azia')) {
    hipoteses.push({ nivel: 'verde', descricao: 'DRGE gestacional (azia)' });
  }

  if (temSintoma(sintomas, 'edema') && !temSintoma(sintomas, 'cefaleia') && !temSintoma(sintomas, 'visao_turva')) {
    hipoteses.push({ nivel: 'verde', descricao: 'Edema fisiológico gestacional (MMII)' });
  }

  if (temSintoma(sintomas, 'contracoes') && semanaGestacional >= 37) {
    hipoteses.push({ nivel: 'verde', descricao: 'Contrações de Braxton-Hicks (termo)' });
  }

  if (temSintoma(sintomas, 'constipacao')) {
    hipoteses.push({ nivel: 'verde', descricao: 'Constipação intestinal gestacional' });
  }

  // ===== RESUMO =====

  const sintomasPresentes = sintomas.filter(s => s.presente).map(s => s.nome.replace(/_/g, ' '));
  const alertasVermelhos = alertas.filter(a => a.nivel === 'vermelho').length;
  const alertasAmarelos = alertas.filter(a => a.nivel === 'amarelo').length;

  let resumo = `${data.nomeGestante}, ${data.idadeGestante} anos, G${data.numGestacoes}, ${semanaGestacional} semanas de gestação. `;
  resumo += `Queixa principal: "${data.queixaPrincipal}". `;

  if (sintomasPresentes.length > 0) {
    resumo += `Refere: ${sintomasPresentes.join(', ')}. `;
  } else {
    resumo += 'Sem sintomas adicionais relatados. ';
  }

  if (data.paDomiciliar) {
    resumo += `PA domiciliar: ${data.paDomiciliar}. `;
  }

  if (data.pesoAtual) {
    resumo += `Peso atual: ${data.pesoAtual} kg. `;
  }

  if (alertasVermelhos > 0) {
    resumo += `⚠️ ${alertasVermelhos} sinal(is) de alerta vermelho — avaliação urgente necessária.`;
  } else if (alertasAmarelos > 0) {
    resumo += `${alertasAmarelos} ponto(s) de atenção identificado(s).`;
  } else {
    resumo += 'Sem alertas de urgência identificados no formulário.';
  }

  return { resumo, hipoteses, alertas };
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepBar from '../components/StepBar';
import { preConsultaApi, type Sintoma } from '../services/api';

const STEP_LABELS = ['Identificação', 'Queixa', 'Sintomas', 'Dados Clínicos', 'Perguntas'];

const SINTOMAS_CONFIG: { nome: string; label: string }[] = [
  { nome: 'cefaleia', label: 'Cefaleia (dor de cabeça)' },
  { nome: 'tontura', label: 'Tontura' },
  { nome: 'visao_turva', label: 'Visão turva / embaçada' },
  { nome: 'nauseas', label: 'Náuseas / enjoos' },
  { nome: 'vomitos', label: 'Vômitos' },
  { nome: 'azia', label: 'Azia / queimação' },
  { nome: 'constipacao', label: 'Constipação (prisão de ventre)' },
  { nome: 'dor_abdominal', label: 'Dor abdominal' },
  { nome: 'contracoes', label: 'Contrações / cólicas uterinas' },
  { nome: 'sangramento', label: 'Sangramento vaginal' },
  { nome: 'corrimento', label: 'Corrimento vaginal' },
  { nome: 'edema', label: 'Edema (inchaço) — pés, mãos ou face' },
  { nome: 'febre', label: 'Febre' },
  { nome: 'disuria', label: 'Disúria (dor ao urinar)' },
  { nome: 'dispneia', label: 'Dispneia (falta de ar)' },
  { nome: 'movimentos_fetais_reduzidos', label: 'Movimentos do bebê reduzidos' },
];

type Intensidade = 'leve' | 'moderado' | 'intenso';

interface SintomaState {
  presente: boolean;
  intensidade: Intensidade;
}

interface FormState {
  // Etapa 1
  nomeGestante: string;
  idadeGestante: string;
  semanaGestacional: string;
  dum: string;
  numGestacoes: string;
  // Etapa 2
  queixaPrincipal: string;
  // Etapa 3
  sintomas: Record<string, SintomaState>;
  outrosSintomas: string;
  // Etapa 4
  paDomiciliar: string;
  pesoAtual: string;
  medicacoes: string;
  // Etapa 5
  perguntasMedico: string;
}

const initialSintomas: Record<string, SintomaState> = Object.fromEntries(
  SINTOMAS_CONFIG.map(s => [s.nome, { presente: false, intensidade: 'leve' }])
);

export default function Form() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const [form, setForm] = useState<FormState>({
    nomeGestante: '',
    idadeGestante: '',
    semanaGestacional: '',
    dum: '',
    numGestacoes: '1',
    queixaPrincipal: '',
    sintomas: initialSintomas,
    outrosSintomas: '',
    paDomiciliar: '',
    pesoAtual: '',
    medicacoes: '',
    perguntasMedico: '',
  });

  function set(field: keyof FormState, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function toggleSintoma(nome: string) {
    setForm(f => ({
      ...f,
      sintomas: {
        ...f.sintomas,
        [nome]: { ...f.sintomas[nome], presente: !f.sintomas[nome].presente },
      },
    }));
  }

  function setIntensidade(nome: string, intensidade: Intensidade) {
    setForm(f => ({
      ...f,
      sintomas: { ...f.sintomas, [nome]: { ...f.sintomas[nome], intensidade } },
    }));
  }

  function validarStep(): boolean {
    setErro('');
    if (step === 0) {
      if (!form.nomeGestante.trim()) { setErro('Informe o nome.'); return false; }
      if (!form.idadeGestante) { setErro('Informe a idade.'); return false; }
      if (!form.semanaGestacional) { setErro('Informe as semanas de gestação.'); return false; }
    }
    if (step === 1 && !form.queixaPrincipal.trim()) {
      setErro('Descreva sua queixa principal.'); return false;
    }
    return true;
  }

  function avancar() {
    if (!validarStep()) return;
    setStep(s => s + 1);
  }

  async function enviar() {
    if (!validarStep()) return;
    setLoading(true);
    setErro('');
    try {
      const sintomasArray: Sintoma[] = SINTOMAS_CONFIG.map(s => ({
        nome: s.nome,
        presente: form.sintomas[s.nome].presente,
        intensidade: form.sintomas[s.nome].presente ? form.sintomas[s.nome].intensidade : undefined,
      }));

      const resultado = await preConsultaApi.criar({
        nomeGestante: form.nomeGestante.trim(),
        idadeGestante: Number(form.idadeGestante),
        semanaGestacional: Number(form.semanaGestacional),
        dum: form.dum || undefined,
        numGestacoes: Number(form.numGestacoes) || 1,
        queixaPrincipal: form.queixaPrincipal.trim(),
        sintomas: sintomasArray,
        paDomiciliar: form.paDomiciliar || undefined,
        pesoAtual: form.pesoAtual ? Number(form.pesoAtual) : undefined,
        medicacoes: form.medicacoes || undefined,
        perguntasMedico: form.perguntasMedico || undefined,
      });

      navigate(`/resultado/${resultado.id}`, { state: resultado });
    } catch {
      setErro('Erro ao enviar. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4">
      <div className="glass-card p-8 max-w-2xl w-full shadow-xl">
        <h2 className="text-xl font-bold mb-6" style={{ color: '#6B8F71' }}>
          Formulário Pré-Consulta
        </h2>
        <StepBar total={5} current={step} labels={STEP_LABELS} />

        {/* ETAPA 0 — Identificação */}
        {step === 0 && (
          <div className="space-y-4">
            <Campo label="Nome completo *">
              <input className={input} value={form.nomeGestante} onChange={e => set('nomeGestante', e.target.value)} placeholder="Maria Silva" />
            </Campo>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Idade *">
                <input className={input} type="number" min="12" max="60" value={form.idadeGestante} onChange={e => set('idadeGestante', e.target.value)} placeholder="28" />
              </Campo>
              <Campo label="Semanas de gestação *">
                <input className={input} type="number" min="1" max="45" value={form.semanaGestacional} onChange={e => set('semanaGestacional', e.target.value)} placeholder="24" />
              </Campo>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="DUM (data última menstruação)">
                <input className={input} type="date" value={form.dum} onChange={e => set('dum', e.target.value)} />
              </Campo>
              <Campo label="Nº de gestações (incluindo esta)">
                <input className={input} type="number" min="1" max="20" value={form.numGestacoes} onChange={e => set('numGestacoes', e.target.value)} />
              </Campo>
            </div>
          </div>
        )}

        {/* ETAPA 1 — Queixa Principal */}
        {step === 1 && (
          <div className="space-y-4">
            <Campo label="O que te trouxe hoje? Descreva sua queixa principal *">
              <textarea
                className={`${input} h-36 resize-none`}
                value={form.queixaPrincipal}
                onChange={e => set('queixaPrincipal', e.target.value)}
                placeholder="Ex: Estou sentindo muita dor de cabeça há 3 dias, com inchaço nos pés..."
              />
            </Campo>
            <p className="text-xs text-gray-400">Seja o mais detalhada possível. Quando começou? O que melhora ou piora?</p>
          </div>
        )}

        {/* ETAPA 2 — Sintomas */}
        {step === 2 && (
          <div>
            <p className="text-sm text-gray-500 mb-4">Marque os sintomas que você está sentindo <strong>atualmente</strong>:</p>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {SINTOMAS_CONFIG.map(s => (
                <div
                  key={s.nome}
                  className="rounded-xl p-3 cursor-pointer select-none transition-all"
                  style={{
                    background: form.sintomas[s.nome].presente ? 'rgba(107,143,113,0.12)' : 'rgba(255,255,255,0.5)',
                    border: `1.5px solid ${form.sintomas[s.nome].presente ? '#6B8F71' : '#E5E7EB'}`,
                  }}
                  onClick={() => toggleSintoma(s.nome)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{form.sintomas[s.nome].presente ? '✅' : '⬜'}</span>
                    <span className="text-sm font-medium text-gray-700">{s.label}</span>
                  </div>
                  {form.sintomas[s.nome].presente && (
                    <div className="mt-2 ml-8 flex gap-2" onClick={e => e.stopPropagation()}>
                      {(['leve', 'moderado', 'intenso'] as Intensidade[]).map(intens => (
                        <button
                          key={intens}
                          onClick={() => setIntensidade(s.nome, intens)}
                          className="text-xs px-3 py-1 rounded-full capitalize transition-all"
                          style={{
                            background: form.sintomas[s.nome].intensidade === intens ? '#6B8F71' : '#F3F4F6',
                            color: form.sintomas[s.nome].intensidade === intens ? 'white' : '#6B7280',
                          }}
                        >
                          {intens}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Campo label="Outros sintomas" className="mt-4">
              <input className={input} value={form.outrosSintomas} onChange={e => set('outrosSintomas', e.target.value)} placeholder="Descreva outros sintomas não listados..." />
            </Campo>
          </div>
        )}

        {/* ETAPA 3 — Dados Clínicos */}
        {step === 3 && (
          <div className="space-y-4">
            <Campo label="Pressão arterial domiciliar (se você mediu)">
              <input className={input} value={form.paDomiciliar} onChange={e => set('paDomiciliar', e.target.value)} placeholder="Ex: 120/80 mmHg" />
            </Campo>
            <Campo label="Peso atual (kg)">
              <input className={input} type="number" value={form.pesoAtual} onChange={e => set('pesoAtual', e.target.value)} placeholder="Ex: 72.5" />
            </Campo>
            <Campo label="Medicações em uso (incluindo suplementos)">
              <textarea className={`${input} h-24 resize-none`} value={form.medicacoes} onChange={e => set('medicacoes', e.target.value)} placeholder="Ex: Ácido fólico 5mg, Sulfato ferroso 40mg..." />
            </Campo>
          </div>
        )}

        {/* ETAPA 4 — Perguntas */}
        {step === 4 && (
          <div className="space-y-4">
            <Campo label="Perguntas que você quer fazer ao médico hoje">
              <textarea
                className={`${input} h-40 resize-none`}
                value={form.perguntasMedico}
                onChange={e => set('perguntasMedico', e.target.value)}
                placeholder="Ex: Quando faço o teste de tolerância à glicose? Posso viajar com 30 semanas?..."
              />
            </Campo>
            <div
              className="rounded-xl p-4 text-sm"
              style={{ background: 'rgba(107,143,113,0.08)', borderLeft: '3px solid #6B8F71' }}
            >
              <p className="text-gray-600">
                Ao clicar em <strong>Enviar</strong>, suas respostas serão processadas e o médico receberá um resumo com hipóteses e sinais de alerta antes do atendimento.
              </p>
            </div>
          </div>
        )}

        {/* Erro */}
        {erro && (
          <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: '#FEE2E2', color: '#991B1B' }}>
            {erro}
          </div>
        )}

        {/* Navegação */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              className="flex-1 py-3 rounded-xl font-semibold text-gray-600 transition-all"
              style={{ background: '#F3F4F6' }}
              onClick={() => setStep(s => s - 1)}
            >
              ← Voltar
            </button>
          )}
          {step < 4 ? (
            <button className="btn-sage flex-1" onClick={avancar}>
              Próximo →
            </button>
          ) : (
            <button className="btn-sage flex-1" onClick={enviar} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar formulário ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const input = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/70 text-sm focus:outline-none focus:border-[#6B8F71] transition-colors';

function Campo({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import AlertCard from '../components/AlertCard';
import { preConsultaApi, type PreConsultaCompleta, type ResultadoAPI } from '../services/api';

export default function Resultado() {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [dados, setDados] = useState<(ResultadoAPI & Partial<PreConsultaCompleta>) | null>(
    state ?? null
  );
  const [loading, setLoading] = useState(!state);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!state && id) {
      preConsultaApi
        .buscar(id)
        .then(d => setDados(d))
        .catch(() => setErro('Pré-consulta não encontrada.'))
        .finally(() => setLoading(false));
    }
  }, [id, state]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p style={{ color: '#6B8F71' }}>Carregando resultado...</p>
        </div>
      </div>
    );
  }

  if (erro || !dados) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-8 text-center">
          <p className="text-red-600 mb-4">{erro || 'Resultado não encontrado.'}</p>
          <button className="btn-sage" onClick={() => navigate('/')}>Voltar ao início</button>
        </div>
      </div>
    );
  }

  const alertasVermelhos = dados.alertas.filter(a => a.nivel === 'vermelho');
  const alertasAmarelos = dados.alertas.filter(a => a.nivel === 'amarelo');
  const alertasVerdes = dados.alertas.filter(a => a.nivel === 'verde');

  const hipotesesVerm = dados.hipoteses.filter(h => h.nivel === 'vermelho');
  const hipotesesAm = dados.hipoteses.filter(h => h.nivel === 'amarelo');
  const hipotesesVerd = dados.hipoteses.filter(h => h.nivel === 'verde');

  const urlPdf = preConsultaApi.urlPdf(id!);
  const linkMedico = dados.linkMedico ?? window.location.href;

  function copiarLink() {
    navigator.clipboard.writeText(linkMedico);
    alert('Link copiado para a área de transferência!');
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Cabeçalho */}
        <div className="glass-card p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">📋</span>
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#6B8F71' }}>
                Pré-Consulta <span className="italic font-light">Concluída</span>
              </h1>
              <p className="text-xs text-gray-400">ID: {id}</p>
            </div>
          </div>

          {/* Status banner */}
          {alertasVermelhos.length > 0 ? (
            <div className="rounded-xl p-3 mb-4" style={{ background: '#FEE2E2', border: '1px solid #DC2626' }}>
              <p className="text-sm font-semibold text-red-700">
                🔴 {alertasVermelhos.length} sinal(is) de urgência identificado(s). O médico será notificado.
              </p>
            </div>
          ) : alertasAmarelos.length > 0 ? (
            <div className="rounded-xl p-3 mb-4" style={{ background: '#FEF3C7', border: '1px solid #D97706' }}>
              <p className="text-sm font-semibold text-yellow-700">
                🟡 {alertasAmarelos.length} ponto(s) de atenção para avaliar na consulta.
              </p>
            </div>
          ) : (
            <div className="rounded-xl p-3 mb-4" style={{ background: '#DCFCE7', border: '1px solid #6B8F71' }}>
              <p className="text-sm font-semibold" style={{ color: '#166534' }}>
                🟢 Sem alertas de urgência identificados.
              </p>
            </div>
          )}

          {/* Resumo clínico */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Resumo Clínico</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{dados.resumo}</p>
          </div>
        </div>

        {/* Sinais de Alerta */}
        {dados.alertas.length > 0 && (
          <div className="glass-card p-6 shadow">
            <h2 className="text-base font-bold mb-4" style={{ color: '#6B8F71' }}>
              Sinais de Alerta
            </h2>
            {[...alertasVermelhos, ...alertasAmarelos, ...alertasVerdes].map((a, i) => (
              <AlertCard key={i} nivel={a.nivel} descricao={a.descricao} detalhes={a.detalhes} />
            ))}
          </div>
        )}

        {/* Hipóteses Diagnósticas */}
        {dados.hipoteses.length > 0 && (
          <div className="glass-card p-6 shadow">
            <h2 className="text-base font-bold mb-4" style={{ color: '#6B8F71' }}>
              Hipóteses Diagnósticas
            </h2>
            {[...hipotesesVerm, ...hipotesesAm, ...hipotesesVerd].map((h, i) => (
              <div
                key={i}
                className="flex items-center gap-2 py-2 border-b last:border-b-0"
                style={{ borderColor: '#F3F4F6' }}
              >
                <span>
                  {h.nivel === 'vermelho' ? '🔴' : h.nivel === 'amarelo' ? '🟡' : '🟢'}
                </span>
                <span className="text-sm text-gray-700">{h.descricao}</span>
              </div>
            ))}
          </div>
        )}

        {/* Link para o médico + PDF */}
        <div className="glass-card p-6 shadow">
          <h2 className="text-base font-bold mb-4" style={{ color: '#6B8F71' }}>
            Compartilhar com o Médico
          </h2>

          <div className="rounded-xl p-3 mb-4" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
            <p className="text-xs text-gray-400 mb-1">Link de acesso do médico:</p>
            <p className="text-xs font-mono break-all text-gray-600">{linkMedico}</p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              className="btn-sage flex-1 min-w-[140px]"
              onClick={copiarLink}
            >
              📋 Copiar link
            </button>
            <a
              href={urlPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sage flex-1 min-w-[140px] text-center no-underline"
              style={{ display: 'block' }}
            >
              📄 Baixar PDF
            </a>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            O médico pode acessar todos os dados e baixar o PDF pelo link acima.
          </p>
        </div>

        {/* Rodapé */}
        <div className="text-center text-xs text-gray-400 pb-6">
          <p>Documento gerado automaticamente. Hipóteses devem ser validadas pelo profissional de saúde.</p>
          <button
            className="mt-3 text-sm underline"
            style={{ color: '#6B8F71', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Novo formulário
          </button>
        </div>

      </div>
    </div>
  );
}

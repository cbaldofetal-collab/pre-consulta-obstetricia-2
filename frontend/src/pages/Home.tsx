import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="glass-card p-10 max-w-lg w-full text-center shadow-xl">
        <div className="text-5xl mb-4">🤰</div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#6B8F71' }}>
          Pré-Consulta <span className="italic font-light">Obstétrica</span>
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Dr. Carlos — Ginecologia & Obstetrícia
        </p>

        <div
          className="rounded-xl p-4 mb-8 text-left text-sm"
          style={{ background: 'rgba(107,143,113,0.08)', borderLeft: '3px solid #6B8F71' }}
        >
          <p className="text-gray-700 leading-relaxed">
            <strong>Olá!</strong> Antes da sua consulta, preencha este formulário rápido.
            Ele ajuda o médico a se preparar melhor para o seu atendimento.
          </p>
          <ul className="mt-3 space-y-1 text-gray-600">
            <li>✅ Leva cerca de 5 minutos</li>
            <li>✅ Suas respostas ficam salvas com segurança</li>
            <li>✅ O médico recebe um resumo antes de te ver</li>
          </ul>
        </div>

        <button
          className="btn-sage w-full text-lg"
          onClick={() => navigate('/login')}
        >
          Começar formulário →
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Seus dados são confidenciais e usados apenas para fins clínicos.
        </p>
      </div>
    </div>
  );
}

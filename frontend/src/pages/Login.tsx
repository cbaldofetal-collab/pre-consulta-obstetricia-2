import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      await login(email, senha);
      navigate('/form');
    } catch (err: any) {
      setErro(err?.response?.data?.error ?? 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="glass-card p-10 max-w-md w-full shadow-xl">
        <div className="text-center mb-8">
          <span className="text-4xl">🤰</span>
          <h1 className="text-2xl font-bold mt-3" style={{ color: '#6B8F71' }}>
            Pré-Consulta <span className="italic font-light">Obstétrica</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">Dr. Carlos — Ginecologia & Obstetrícia</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">E-mail</label>
            <input
              className={input}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Senha</label>
            <input
              className={input}
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {erro && (
            <div className="p-3 rounded-xl text-sm" style={{ background: '#FEE2E2', color: '#991B1B' }}>
              {erro}
            </div>
          )}

          <button type="submit" className="btn-sage w-full mt-2" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar →'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Não tem conta?{' '}
          <Link to="/signup" style={{ color: '#6B8F71', fontWeight: 600 }}>
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}

const input = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/70 text-sm focus:outline-none focus:border-[#6B8F71] transition-colors';

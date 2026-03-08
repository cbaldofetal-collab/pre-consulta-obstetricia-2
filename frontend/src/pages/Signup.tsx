import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import TermoLGPD from '../components/TermoLGPD';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [aceitouLGPD, setAceitouLGPD] = useState(false);
  const [mostrarTermo, setMostrarTermo] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (!aceitouLGPD) {
      setErro('É necessário aceitar o Termo de Consentimento LGPD para continuar.');
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.register({ nome, email, senha, aceitouLGPD: true });
      setSession(data.user, data.token);
      navigate('/form');
    } catch (err: any) {
      setErro(err?.response?.data?.error ?? 'Erro ao cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {mostrarTermo && (
        <TermoLGPD
          onAceitar={() => {
            setAceitouLGPD(true);
            setMostrarTermo(false);
          }}
          onFechar={() => setMostrarTermo(false)}
        />
      )}

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="glass-card p-10 max-w-md w-full shadow-xl">
          <div className="text-center mb-8">
            <span className="text-4xl">🤰</span>
            <h1 className="text-2xl font-bold mt-3" style={{ color: '#6B8F71' }}>
              Criar <span className="italic font-light">Conta</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">Pré-Consulta Obstétrica — Dr. Carlos</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Nome completo</label>
              <input
                className={input}
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Maria Silva"
                required
                autoComplete="name"
              />
            </div>
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
                placeholder="Mínimo 6 caracteres"
                required
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Confirmar senha</label>
              <input
                className={input}
                type="password"
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                placeholder="Repita a senha"
                required
                autoComplete="new-password"
              />
            </div>

            {/* LGPD */}
            <div
              className="rounded-xl p-4"
              style={{
                background: aceitouLGPD ? 'rgba(107,143,113,0.1)' : 'rgba(255,255,255,0.5)',
                border: `1.5px solid ${aceitouLGPD ? '#6B8F71' : '#E5E7EB'}`,
              }}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="lgpd"
                  checked={aceitouLGPD}
                  onChange={() => {
                    if (!aceitouLGPD) setMostrarTermo(true);
                    else setAceitouLGPD(false);
                  }}
                  className="mt-0.5 w-4 h-4 cursor-pointer"
                  style={{ accentColor: '#6B8F71' }}
                />
                <label htmlFor="lgpd" className="text-sm text-gray-600 cursor-pointer">
                  Li e aceito o{' '}
                  <button
                    type="button"
                    onClick={() => setMostrarTermo(true)}
                    className="underline font-semibold"
                    style={{ color: '#6B8F71', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Termo de Consentimento LGPD
                  </button>{' '}
                  para tratamento dos meus dados de saúde, conforme Lei 13.709/2018.
                </label>
              </div>
              {aceitouLGPD && (
                <p className="text-xs mt-2 ml-7" style={{ color: '#6B8F71' }}>
                  ✓ Consentimento registrado com data e hora
                </p>
              )}
            </div>

            {erro && (
              <div className="p-3 rounded-xl text-sm" style={{ background: '#FEE2E2', color: '#991B1B' }}>
                {erro}
              </div>
            )}

            <button
              type="submit"
              className="btn-sage w-full mt-2"
              disabled={loading || !aceitouLGPD}
            >
              {loading ? 'Cadastrando...' : 'Criar conta →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem conta?{' '}
            <Link to="/login" style={{ color: '#6B8F71', fontWeight: 600 }}>
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

const input = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/70 text-sm focus:outline-none focus:border-[#6B8F71] transition-colors';

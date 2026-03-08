import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3002';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('@PreConsulta:token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface Sintoma {
  nome: string;
  presente: boolean;
  intensidade?: 'leve' | 'moderado' | 'intenso';
}

export interface FormPayload {
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

export interface ResultadoAPI {
  id: string;
  resumo: string;
  hipoteses: Hipotese[];
  alertas: Alerta[];
  linkMedico: string;
  linkPdf: string;
}

export interface PreConsultaCompleta extends ResultadoAPI {
  createdAt: string;
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

export interface AuthResponse {
  token: string;
  user: { id: string; nome: string; email: string };
}

export const preConsultaApi = {
  criar: (payload: FormPayload) =>
    api.post<ResultadoAPI>('/api/pre-consulta', payload).then(r => r.data),

  buscar: (id: string) =>
    api.get<PreConsultaCompleta>(`/api/pre-consulta/${id}`).then(r => r.data),

  urlPdf: (id: string) => `${BASE_URL}/api/pre-consulta/${id}/pdf`,
};

export const authApi = {
  register: (payload: { nome: string; email: string; senha: string; aceitouLGPD: boolean }) =>
    api.post<AuthResponse>('/api/auth/register', payload).then(r => r.data),

  login: (email: string, senha: string) =>
    api.post<AuthResponse>('/api/auth/login', { email, senha }).then(r => r.data),
};

export default api;

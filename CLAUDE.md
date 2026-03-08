# Pré-Consulta Obstétrica

Web app para gestante preencher formulário antes da consulta.
O backend processa, gera resumo + hipóteses diagnósticas + sinais de alerta,
e disponibiliza link único para o médico + PDF para download.

---

## Stack
- **Frontend:** React + Vite + TailwindCSS 4 + React Router 7 | porta 5174
- **Backend:** Node.js + Express + Prisma + **SQLite** | porta 3002
- **Auth:** JWT (jsonwebtoken) + bcryptjs — token em `localStorage` como `@PreConsulta:token`
- **PDF:** pdfkit (gerado no backend)
- **API base URL:** `VITE_API_URL` → `http://localhost:3002`

---

## Estrutura
```
pre-consulta-obstetricia/
├── frontend/   — React + Vite
└── backend/    — Express + Prisma
```

## Rotas de API
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/api/auth/register` | — | Cadastro + cria ConsentimentoLGPD |
| POST | `/api/auth/login` | — | Login, retorna JWT |
| POST | `/api/pre-consulta` | Bearer JWT | Cria pré-consulta, associa userId |
| GET | `/api/pre-consulta/:id` | — | Busca resultado (link médico público) |
| GET | `/api/pre-consulta/:id/pdf` | — | Gera PDF (acesso público para médico) |

## Páginas Frontend
| Rota | Auth | Descrição |
|------|------|-----------|
| `/` | — | Home / landing |
| `/login` | — | Login com e-mail + senha |
| `/signup` | — | Cadastro + Termo LGPD obrigatório |
| `/form` | PrivateRoute | Formulário multi-step (5 etapas) |
| `/resultado/:id` | PrivateRoute | Resultado com link médico + PDF |

## Modelos Prisma (SQLite)
- `User` — id, nome, email, senhaHash
- `ConsentimentoLGPD` — aceitouEm, ipOrigem, versao, userId (1:1 com User)
- `PreConsulta` — dados gestante, userId (opcional), sintomas/hipóteses/alertas como String (JSON.stringify)

## Design System
- `bg-[#F5F0E8]` (cream), `text-[#6B8F71]` (sage), cards com `backdrop-blur`
- Alertas: vermelho (#DC2626), amarelo (#D97706), verde (#6B8F71)

## Como rodar
```bash
# Backend
cd backend && npm install && npx prisma db push && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

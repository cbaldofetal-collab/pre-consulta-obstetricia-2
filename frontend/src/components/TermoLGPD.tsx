import { useState, useRef, useEffect } from 'react';

interface TermoLGPDProps {
  onAceitar: () => void;
  onFechar: () => void;
}

export default function TermoLGPD({ onAceitar, onFechar }: TermoLGPDProps) {
  const [leuTudo, setLeuTudo] = useState(false);
  const conteudoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = conteudoRef.current;
    if (!el) return;
    const handleScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
        setLeuTudo(true);
      }
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
    >
      <div className="glass-card w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Cabeçalho */}
        <div className="p-6 border-b" style={{ borderColor: 'rgba(107,143,113,0.2)' }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#6B8F71' }}>
                Termo de Consentimento para Tratamento de Dados
              </h2>
              <p className="text-xs text-gray-400">
                Lei Geral de Proteção de Dados — Lei 13.709/2018 (LGPD)
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo com scroll */}
        <div
          ref={conteudoRef}
          className="flex-1 overflow-y-auto p-6 text-sm text-gray-700 space-y-5"
          style={{ lineHeight: '1.7' }}
        >
          <p className="text-xs text-gray-400 italic">
            Role até o final para habilitar a confirmação.
          </p>

          {/* 1. Identificação do Controlador */}
          <section>
            <h3 className="font-bold mb-1" style={{ color: '#6B8F71' }}>
              1. Identificação do Controlador de Dados
            </h3>
            <p>
              O responsável pelo tratamento dos seus dados pessoais é o{' '}
              <strong>Consultório Dr. Carlos — Ginecologia e Obstetrícia</strong>, doravante
              denominado "Controlador", nos termos do art. 5º, VI da Lei 13.709/2018 (LGPD).
            </p>
          </section>

          {/* 2. Finalidade */}
          <section>
            <h3 className="font-bold mb-1" style={{ color: '#6B8F71' }}>
              2. Finalidade do Tratamento
            </h3>
            <p>
              Os seus dados pessoais e de saúde são coletados exclusivamente para:
            </p>
            <ul className="list-disc ml-5 mt-1 space-y-1">
              <li>Subsidiar o atendimento médico pré-natal com informações clínicas relevantes;</li>
              <li>Gerar um resumo estruturado para o médico responsável antes da consulta;</li>
              <li>Identificar automaticamente hipóteses diagnósticas e sinais de alerta obstétricos;</li>
              <li>Disponibilizar um documento PDF para uso clínico durante o atendimento.</li>
            </ul>
          </section>

          {/* 3. Dados Tratados */}
          <section>
            <h3 className="font-bold mb-1" style={{ color: '#6B8F71' }}>
              3. Dados Pessoais e de Saúde Coletados
            </h3>
            <p>Serão coletados os seguintes dados:</p>
            <ul className="list-disc ml-5 mt-1 space-y-1">
              <li><strong>Identificação:</strong> nome completo, idade, e-mail;</li>
              <li><strong>Obstétricos:</strong> idade gestacional (semanas), DUM, número de gestações;</li>
              <li><strong>Clínicos:</strong> queixa principal, sintomas atuais e intensidade, pressão arterial domiciliar, peso atual;</li>
              <li><strong>Farmacológicos:</strong> medicações e suplementos em uso;</li>
              <li><strong>Comunicação:</strong> perguntas destinadas ao médico.</li>
            </ul>
            <p className="mt-2">
              Esses dados são classificados como <strong>dados sensíveis de saúde</strong>, nos
              termos do art. 5º, II da LGPD, e recebem proteção reforçada.
            </p>
          </section>

          {/* 4. Base Legal */}
          <section>
            <h3 className="font-bold mb-1" style={{ color: '#6B8F71' }}>
              4. Base Legal para o Tratamento
            </h3>
            <p>O tratamento dos seus dados se fundamenta em:</p>
            <ul className="list-disc ml-5 mt-1 space-y-1">
              <li>
                <strong>Consentimento do titular</strong> (art. 7º, I e art. 11, I da LGPD) — que
                você manifesta ao aceitar este termo;
              </li>
              <li>
                <strong>Tutela da saúde</strong> (art. 7º, VIII e art. 11, II, "f" da LGPD) —
                tratamento realizado por profissional de saúde para prestação de serviços médicos.
              </li>
            </ul>
          </section>

          {/* 5. Compartilhamento */}
          <section>
            <h3 className="font-bold mb-1" style={{ color: '#6B8F71' }}>
              5. Compartilhamento de Dados
            </h3>
            <p>
              Seus dados serão compartilhados <strong>exclusivamente</strong> com o médico
              responsável pelo seu acompanhamento pré-natal, mediante link único e temporário
              gerado pelo sistema. Não haverá compartilhamento com terceiros, parceiros
              comerciais ou plataformas de publicidade.
            </p>
          </section>

          {/* 6. Retenção */}
          <section>
            <h3 className="font-bold mb-1" style={{ color: '#6B8F71' }}>
              6. Prazo de Retenção dos Dados
            </h3>
            <p>
              Os dados serão mantidos pelo período da gestação e por até{' '}
              <strong>5 (cinco) anos</strong> após o parto, conforme exigência de guarda de
              prontuários médicos (CFM 1.638/2002). Após este prazo, os dados serão eliminados
              de forma segura, salvo obrigação legal de retenção.
            </p>
          </section>

          {/* 7. Direitos do Titular */}
          <section>
            <h3 className="font-bold mb-1" style={{ color: '#6B8F71' }}>
              7. Seus Direitos como Titular (art. 18 da LGPD)
            </h3>
            <p>Você tem direito a:</p>
            <ul className="list-disc ml-5 mt-1 space-y-1">
              <li>Confirmar a existência de tratamento dos seus dados;</li>
              <li>Acessar os dados que possuímos sobre você;</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação dos dados desnecessários;</li>
              <li>Obter portabilidade dos seus dados para outro serviço;</li>
              <li>
                <strong>Revogar este consentimento a qualquer momento</strong>, sem prejudicar
                os atendimentos já realizados.
              </li>
            </ul>
          </section>

          {/* 8. Segurança */}
          <section>
            <h3 className="font-bold mb-1" style={{ color: '#6B8F71' }}>
              8. Medidas de Segurança
            </h3>
            <p>
              Adotamos medidas técnicas e administrativas para proteger seus dados contra
              acesso não autorizado, destruição, perda ou alteração, incluindo criptografia
              de senhas (bcrypt), autenticação por token JWT e armazenamento local seguro.
            </p>
          </section>

          {/* 9. Contato DPO */}
          <section>
            <h3 className="font-bold mb-1" style={{ color: '#6B8F71' }}>
              9. Contato para Exercício de Direitos (DPO)
            </h3>
            <p>
              Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento dos seus
              dados, entre em contato com nosso Encarregado de Dados (DPO):
            </p>
            <p className="mt-1 font-medium">
              📧 <a href="mailto:privacidade@drcarlos.med.br" style={{ color: '#6B8F71' }}>
                privacidade@drcarlos.med.br
              </a>
            </p>
          </section>

          {/* 10. Revogação */}
          <section>
            <h3 className="font-bold mb-1" style={{ color: '#6B8F71' }}>
              10. Revogação do Consentimento
            </h3>
            <p>
              Você pode revogar este consentimento a qualquer momento, sem ônus, entrando em
              contato pelo e-mail acima. A revogação não afeta a licitude do tratamento
              realizado anteriormente com base no consentimento.
            </p>
          </section>

          <div
            className="rounded-xl p-4 mt-4"
            style={{ background: 'rgba(107,143,113,0.08)', border: '1px solid rgba(107,143,113,0.3)' }}
          >
            <p className="text-xs text-gray-600 text-center">
              <strong>Versão 1.0</strong> — Vigente a partir de {new Date().toLocaleDateString('pt-BR')}.
              Este termo foi elaborado em conformidade com a Lei nº 13.709/2018 (LGPD).
            </p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-6 border-t space-y-4" style={{ borderColor: 'rgba(107,143,113,0.2)' }}>
          {!leuTudo && (
            <p className="text-xs text-center text-gray-400">
              ↓ Role o texto acima até o final para habilitar a confirmação
            </p>
          )}
          <div className="flex gap-3">
            <button
              className="flex-1 py-3 rounded-xl font-semibold text-gray-600 transition-all"
              style={{ background: '#F3F4F6' }}
              onClick={onFechar}
            >
              Cancelar
            </button>
            <button
              className="btn-sage flex-1"
              disabled={!leuTudo}
              onClick={onAceitar}
            >
              {leuTudo ? 'Li e aceito os termos ✓' : 'Leia o termo completo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

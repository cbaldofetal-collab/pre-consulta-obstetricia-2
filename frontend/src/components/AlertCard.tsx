interface AlertCardProps {
  nivel: 'vermelho' | 'amarelo' | 'verde';
  descricao: string;
  detalhes?: string;
}

const config = {
  vermelho: {
    bg: 'rgba(220,38,38,0.08)',
    border: '#DC2626',
    text: '#991B1B',
    icon: '🔴',
    badge: 'Urgente',
    badgeBg: '#FEE2E2',
    badgeText: '#991B1B',
  },
  amarelo: {
    bg: 'rgba(217,119,6,0.08)',
    border: '#D97706',
    text: '#92400E',
    icon: '🟡',
    badge: 'Atenção',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
  },
  verde: {
    bg: 'rgba(107,143,113,0.08)',
    border: '#6B8F71',
    text: '#3F6B45',
    icon: '🟢',
    badge: 'Observação',
    badgeBg: '#DCFCE7',
    badgeText: '#166534',
  },
};

export default function AlertCard({ nivel, descricao, detalhes }: AlertCardProps) {
  const c = config[nivel];
  return (
    <div
      className="rounded-xl p-4 mb-3"
      style={{ background: c.bg, borderLeft: `4px solid ${c.border}` }}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg mt-0.5">{c.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: c.badgeBg, color: c.badgeText }}
            >
              {c.badge}
            </span>
          </div>
          <p className="font-semibold text-sm" style={{ color: c.text }}>{descricao}</p>
          {detalhes && (
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>{detalhes}</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface StepBarProps {
  total: number;
  current: number;
  labels: string[];
}

export default function StepBar({ total, current, labels }: StepBarProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {labels.map((label, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1 transition-all"
              style={{
                background: i < current ? '#6B8F71' : i === current ? '#6B8F71' : '#E5E7EB',
                color: i <= current ? 'white' : '#9CA3AF',
                opacity: i < current ? 0.6 : 1,
              }}
            >
              {i < current ? '✓' : i + 1}
            </div>
            <span
              className="text-xs text-center hidden sm:block"
              style={{ color: i <= current ? '#6B8F71' : '#9CA3AF' }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="relative h-1.5 rounded-full" style={{ background: '#E5E7EB' }}>
        <div
          className="absolute h-full rounded-full transition-all duration-500"
          style={{
            background: 'linear-gradient(90deg, #6B8F71, #8BAF91)',
            width: `${(current / (total - 1)) * 100}%`,
          }}
        />
      </div>
      <p className="text-xs text-right mt-1" style={{ color: '#9CA3AF' }}>
        Etapa {current + 1} de {total}
      </p>
    </div>
  );
}

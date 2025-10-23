interface ProgressBarProps {
  progress: number;        // 0..100
  totalSteps: number;
  completedSteps: number;
}

export const ProgressBar = ({ progress, totalSteps, completedSteps }: ProgressBarProps) => {
  const pct = Math.max(0, Math.min(100, Math.round(progress)));
  return (
    <div className="min-w-[280px] w-[360px]">
      <div className="text-gray-900 font-semibold mb-2">Seu progresso</div>
      <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
        <div className="h-full rounded-full bg-[#60A5FA]" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-xs text-gray-600 text-right">
        {completedSteps} de {totalSteps} etapas
      </div>
    </div>
  );
};

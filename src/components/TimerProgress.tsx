import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const fmt = (s: number) => {
  const m = Math.floor(s / 60).toString().padStart(1, "0");
  const ss = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
};

export function TimerProgress({
  elapsed,
  limitSeconds = 60, // Definido como 5 minutos (300 segundos)
  className,
}: {
  elapsed: number;
  limitSeconds?: number; // Mantido opcional para flexibilidade
  className?: string;
}) {
  const pct = Math.min(100, Math.round((elapsed / limitSeconds) * 100));
  const ratio = elapsed / limitSeconds;

  // < 45% azul, < 80% amarelo, >= 80% vermelho
  const barColor =
    ratio < 0.45
      ? "[&>div]:bg-[#0385d1]"
      : ratio < 0.8
      ? "[&>div]:bg-amber-500"
      : "[&>div]:bg-red-600";

  return (
    <div className={cn("w-full", className)}>
      <span className="mb-1 block text-sm text-gray-700">Tempo restante</span>
      <Progress value={pct} className={cn("h-2", barColor)} />
      <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
        <span>{fmt(elapsed)}</span>
        <span>{fmt(limitSeconds)}</span>
      </div>
    </div>
  );
}

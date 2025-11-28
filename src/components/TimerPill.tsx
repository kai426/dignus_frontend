import { fmt } from "@/utils/helpers";
import { Clock3 } from "lucide-react";


export function TimerPill({ remaining }: { remaining: number }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full bg-black/80 px-3 py-1.5 text-sm font-semibold text-white shadow-md ring-1 ring-white/20 md:bg-yellow-100 md:text-yellow-800 md:ring-yellow-300"
      aria-label={`Tempo restante ${fmt(remaining)}`}
    >
      <Clock3 className="size-4 opacity-90 md:text-yellow-700" />
      <span className="tabular-nums">{fmt(remaining)}</span>
    </span>
  );
}

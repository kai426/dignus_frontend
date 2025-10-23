// components/QuestionTabs.tsx
import { cn } from "@/lib/utils";

export default function QuestionTabs({
  total,
  active,
  onSelect,
  className,
}: {
  total: number;
  active: number;
  onSelect: (i: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-3", className)}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            i === active
              ? // ATIVO AZUL (paleta do app)
                "bg-[#0385d1] text-white shadow-sm"
              : // Inativos
                "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {`Questão #${i + 1}`}
        </button>
      ))}
    </div>
  );
}

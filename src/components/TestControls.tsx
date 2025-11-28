import { Button } from "@/components/ui/button";
import { ChevronRight, Square } from "lucide-react";

interface Props {
    phase: string;
    isLast: boolean;
    onStart: () => void;
    onStop: () => void;
    loading: boolean;
    disabled: boolean;
}

export const TestControls = ({ phase, isLast, onStart, onStop, loading, disabled }: Props) => {
    if (phase === "recording") {
        return (
            <Button
                onClick={onStop}
                className={
                    isLast ? "rounded-lg bg-red-600 text-white hover:bg-red-700" : "rounded-lg bg-[#0385d1] text-white hover:bg-[#0271b2]"
                }
            >
                {isLast ? (
                    <>
                        <Square className="mr-2 h-4 w-4" /> Finalizar
                    </>
                ) : (
                    <>
                        Avançar <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                )}
            </Button>
        );
    }

    if (phase === "idle") {
        return (
            <Button onClick={onStart} disabled={disabled || loading} className="rounded-lg bg-[#0385d1] text-white hover:bg-[#0271b2]">
                {loading ? "Carregando..." : "Iniciar gravação"}
            </Button>
        );
    }

    return <Button disabled className="rounded-lg bg-gray-300 text-gray-700">Preparando…</Button>;
};

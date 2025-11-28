import { useState } from "react";
import type { OptionKey } from "@/components/options";

export function useAnswers(total: number) {
    const [answers, setAnswers] = useState<Record<number, OptionKey | null>>(() =>
        Object.fromEntries(Array.from({ length: total }, (_, i) => [i, null]))
    );

    function setAnswer(step: number, key: OptionKey) {
        setAnswers((prev) => ({ ...prev, [step]: key }));
    }

    return { answers, setAnswer };
}

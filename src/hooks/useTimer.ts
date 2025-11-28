import { LIMIT_SECONDS } from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";

export function useTimer(onFinish: () => void) {
    const [elapsed, setElapsed] = useState(0);
    const timerRef = useRef<number | null>(null);

    const remaining = Math.max(0, LIMIT_SECONDS - elapsed);

    useEffect(() => {
        timerRef.current = window.setInterval(() => {
            setElapsed((e) => e + 1);
        }, 1000);

        return () => {
            if (timerRef.current) window.clearInterval(timerRef.current);
        };
    }, []);

    useEffect(() => {
        if (remaining <= 0) {
            onFinish();
        }
    }, [remaining]);

    function stop() {
        if (timerRef.current) window.clearInterval(timerRef.current);
    }

    return { remaining, elapsed, stop };
}

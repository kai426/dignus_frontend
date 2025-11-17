import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRecorder } from "@/hooks/useRecorder";
import { useMediaStore } from "@/store/useMediaStore";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type Phase = "idle" | "prep" | "recording" | "uploading";

export function useQuestionRecorder(
    total: number,
    prepSeconds: number,
    perQuestionSeconds: number,
    onAllVideosReady: (videos: (Blob | null)[]) => void
) {
    const { start, stop, elapsed, videoBlob, setSourceStream } = useRecorder(perQuestionSeconds);
    const makeRecordableStream = useMediaStore((s) => s.makeRecordableStream);

    const [phase, setPhase] = useState<Phase>("idle");
    const [currentIdx, setCurrentIdx] = useState(0);
    const [prepLeft, setPrepLeft] = useState(prepSeconds);
    const [recordedBlobs, setRecordedBlobs] = useState<(Blob | null)[]>([]);

    // Inicia contagem de preparo
    useEffect(() => {
        if (phase !== "prep") return;
        console.log(`⏳ Entrou em PREP da questão ${currentIdx + 1}, tempo restante: ${prepSeconds}s`);

        const id = setInterval(() => {
            setPrepLeft((v) => {
                if (v <= 1) {
                    clearInterval(id);
                    return 0;
                }
                return v - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [phase]);

    // Começa gravação após preparo
    useEffect(() => {
        if (phase !== "prep" || prepLeft !== 0) return;

        (async () => {
            console.log(`🎬 Preparação terminou — iniciando stream para questão ${currentIdx + 1}`);
            const recordable = await makeRecordableStream();
            if (!recordable) {
                toast.error("Erro ao iniciar câmera/microfone.");
                console.error("❌ Falha ao criar stream (camera/mic)");
                return;
            }

            setSourceStream(recordable);
            await sleep(1500);
            console.log(`🔴 Iniciando gravação da questão ${currentIdx + 1}`);
            start();
            setPhase("recording");
        })();
    }, [phase, prepLeft]);

    // Quando um vídeo for finalizado
    useEffect(() => {
        if (!videoBlob) return;
        if (videoBlob.size === 0) {
            toast.error(`O vídeo da questão ${currentIdx + 1} não gravou corretamente.`);
            console.warn(`⚠️ Vídeo ${currentIdx + 1} está vazio`);
            return;
        }

        console.log(`✅ Gravação da questão ${currentIdx + 1} finalizada, tamanho: ${videoBlob.size} bytes`);

        setRecordedBlobs((prev) => {
            const newArr = [...prev];
            newArr[currentIdx] = videoBlob;
            return newArr;
        });

        (async () => {
            await sleep(1200);
            if (currentIdx < total - 1) {
                console.log(`➡️ Indo para a próxima questão (${currentIdx + 2}/${total})`);
                setCurrentIdx((i) => i + 1);
                setPrepLeft(prepSeconds);
                setPhase("prep");
            } else {
                console.log("🏁 Todas as questões gravadas! Preparando envio final...");
                setPhase("idle");

                const finalBlobs = [...recordedBlobs];
                finalBlobs[currentIdx] = videoBlob;

                console.log("📦 Array final de vídeos:", finalBlobs.map((b, i) => ({
                    idx: i + 1,
                    size: b?.size ?? 0,
                })));

                onAllVideosReady(finalBlobs);
            }
        })();
    }, [videoBlob]);

    function startPrep() {
        console.log("🟢 Iniciando gravações do teste...");
        setCurrentIdx(0);
        setPrepLeft(prepSeconds);
        setPhase("prep");
        setRecordedBlobs(new Array(total).fill(null));
    }

    return { phase, setPhase, currentIdx, prepLeft, elapsed, recordedBlobs, startPrep, stop };
}

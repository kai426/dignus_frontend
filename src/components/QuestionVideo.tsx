import React, { memo } from "react";
import Webcam from "react-webcam";
import { TimerProgress } from "@/components/TimerProgress";

interface Props {
    phase: string;
    cameraId: string | null;
    mirror: boolean;
    videoEnabled: boolean;
    audioEnabled: boolean;
    prepLeft: number;
    elapsed: number;
    limitSeconds: number;
}

export const QuestionVideo = memo(
    ({ phase, cameraId, mirror, videoEnabled, audioEnabled, prepLeft, elapsed, limitSeconds }: Props) => {
        const videoConstraints =
            videoEnabled && cameraId
                ? { deviceId: { exact: cameraId }, width: 800, height: 540 }
                : { width: 960, height: 540 };

        return (
            <div className="relative overflow-hidden rounded-lg border-0 bg-white max-w-[700px] mx-auto">
                {phase === "recording" ? (
                    <Webcam
                        videoConstraints={videoConstraints}
                        audio={!!audioEnabled}
                        muted
                        mirrored={mirror}
                        className="aspect-video w-full bg-[url('/checker.svg')] bg-center object-cover"
                    />
                ) : (
                    <div className="aspect-video w-full bg-[url('/checker.svg')] bg-center border border-gray-300 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-sm">
                            Pré-visualização da câmera
                        </span>
                    </div>
                )}

                {phase === "prep" && (
                    <div className="absolute inset-0 grid place-items-center bg-black/40">
                        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/90 shadow-xl">
                            <span className="text-4xl font-semibold text-gray-900">{prepLeft}</span>
                        </div>
                    </div>
                )}

                {phase === "recording" && (
                    <TimerProgress elapsed={elapsed} limitSeconds={limitSeconds} className="mt-4" />
                )}
            </div>
        );
    }
);

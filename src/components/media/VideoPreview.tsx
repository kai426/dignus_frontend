import { useEffect, useRef } from "react";
import { VideoOff } from "lucide-react";

type Props = { stream: MediaStream | null; mirror?: boolean; videoEnabled?: boolean };

export default function VideoPreview({ stream, mirror, videoEnabled = true }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (stream && videoEnabled) {
      ref.current.srcObject = stream;
      void ref.current.play();
    } else {
      ref.current.srcObject = null;
    }
  }, [stream, videoEnabled]);

  return (
    <div className={`relative overflow-hidden rounded-lg border bg-white ${mirror ? "scale-x-[-1]" : ""}`}>
      {videoEnabled ? (
        <video
          ref={ref}
          className="aspect-video w-full object-cover bg-[url('/checker.svg')]"
          muted
          playsInline
        />
      ) : (
        <div className="aspect-video grid place-items-center bg-gray-100">
          <div className="flex flex-col items-center text-gray-500">
            <VideoOff className="mb-2 h-6 w-6" />
            <span className="text-sm">Câmera desativada</span>
          </div>
        </div>
      )}
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff } from "lucide-react";
import { useMediaStore } from "@/store/useMediaStore";

export default function MediaToggles() {
  const videoEnabled = useMediaStore((s) => s.videoEnabled);
  const audioEnabled = useMediaStore((s) => s.audioEnabled);
  const toggleVideo = useMediaStore((s) => s.toggleVideo);
  const toggleAudio = useMediaStore((s) => s.toggleAudio);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        className={videoEnabled ? "" : "border-red-300 text-red-600"}
        onClick={() => toggleVideo()}
      >
        {videoEnabled ? <Video className="mr-2 h-4 w-4" /> : <VideoOff className="mr-2 h-4 w-4" />}
        {videoEnabled ? "Desativar câmera" : "Ativar câmera"}
      </Button>

      <Button
        variant="outline"
        className={audioEnabled ? "" : "border-red-300 text-red-600"}
        onClick={() => toggleAudio()}
      >
        {audioEnabled ? <Mic className="mr-2 h-4 w-4" /> : <MicOff className="mr-2 h-4 w-4" />}
        {audioEnabled ? "Desativar áudio" : "Ativar áudio"}
      </Button>
    </div>
  );
}

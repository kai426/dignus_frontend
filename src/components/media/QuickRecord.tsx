import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMediaStore } from "@/store/useMediaStore";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

type Props = { seconds?: number };

export default function QuickRecord({ seconds = 5 }: Props) {
  const stream = useMediaStore((s) => s.stream);
  const testing = useMediaStore((s) => s.testing);
  const url = useMediaStore((s) => s.recordingUrl);
  const start = useMediaStore((s) => s.startQuickRecord);
  const open = useMediaStore((s) => s.isQuickPreviewOpen);
  const setOpen = useMediaStore((s) => s.setQuickPreviewOpen);

  const hasVideo = !!stream?.getVideoTracks()?.length;
  const hasAudio = !!stream?.getAudioTracks()?.length;
  const canTest = !!stream && hasVideo && hasAudio && !testing;

  return (
    <div className="space-y-2">
      <Label>Gravação-teste ({seconds}s)</Label>
      <div className="flex items-center gap-2">
        <Button onClick={() => start(seconds)} disabled={!canTest}>
          {testing ? "Gravando…" : "Gravar e visualizar"}
        </Button>
      </div>
      <p className="text-xs text-gray-500">
        É necessário ter câmera e microfone ativos para gravar o teste.
      </p>

      <Dialog open={!!url && open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[720px] rounded-2xl p-0 overflow-hidden">
          <DialogHeader />
          {url && <video src={url} controls autoPlay className="w-full h-full" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmStopDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
  description?: string;
}

export function ConfirmStopDialog({
  open,
  onOpenChange,
  onConfirm,
  description = "Você deseja encerrar sua resposta agora?",
}: ConfirmStopDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-[min(92vw,620px)] rounded-[24px] p-8 bg-white shadow-xl outline-none
        "
      >
        {/* Ícone central com glow vermelho */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 relative">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.18),transparent_60%)]" />
          <div className="z-10 grid h-10 w-10 place-items-center rounded-full bg-[#e04b51] text-white">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-2xl font-semibold text-gray-900 text-center">
            Encerrar resposta?
          </DialogTitle>
          <DialogDescription className="mt-2 text-center text-[15px] leading-relaxed text-gray-500">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 sm:justify-center">
          <div className="flex w-full items-center justify-center gap-4">
            <Button
              className="rounded-full px-6 py-2 bg-[#e04b51] hover:bg-red-400 text-white"
              onClick={() => {
                onOpenChange(false);
                onConfirm();
              }}
            >
              Encerrar
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-6 py-2 text-gray-700 border-gray-300"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

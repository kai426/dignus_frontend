import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface ConfirmStartDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  minutes: number;
  onConfirm: () => void;
}

export function ConfirmStartDialog({
  open,
  onOpenChange,
  minutes,
  onConfirm,
}: ConfirmStartDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        // sempre centralizado (sem bottom-sheet)
        className="
          fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-[min(92vw,620px)] rounded-[24px] p-8 bg-white shadow-xl outline-none
        "
      >
        {/* Ícone central com glow azul */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 relative">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(3,133,209,0.15),transparent_60%)]" />
          <div className="z-10 grid h-10 w-10 place-items-center rounded-full bg-[#0385D1] text-white">
            <HelpCircle className="h-5 w-5" />
          </div>
        </div>

        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-2xl font-semibold text-gray-900 text-center">
            Iniciar prova?
          </DialogTitle>
          <DialogDescription className="mt-2 text-center text-[15px] leading-relaxed text-gray-500">
            Ao clicar em <b>Confirmar</b>, você dará início à prova e terá{" "}
            <b>
              {minutes} minuto{minutes === 1 ? "" : "s"}
            </b>{" "}
            para finalizá-la.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 sm:justify-center">
          <div className="flex w-full items-center justify-center gap-4">
            <Button
              variant="outline"
              className="rounded-full px-6 py-2 text-gray-700 border-gray-300"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              className="rounded-full px-6 py-2 bg-[#0385D1] hover:bg-[#0271B2] text-white"
              onClick={() => {
                onOpenChange(false);
                onConfirm();
              }}
            >
              Confirmar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

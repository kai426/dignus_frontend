import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    onConfirm: () => void;
}

export function ConfirmExitTestDialog({ open, onOpenChange, onConfirm }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-red-600">
                        Atenção!
                    </DialogTitle>
                </DialogHeader>

                <p className="text-gray-700 text-[15px] leading-relaxed">
                    Se você sair agora, <strong>perderá a única chance</strong> de realizar esta prova.
                    Ela só pode ser feita <strong>uma única vez</strong>.
                </p>

                <p className="mt-2 text-gray-700 text-[15px]">
                    Tem certeza de que deseja encerrar e sair da prova?
                </p>

                <DialogFooter className="mt-5">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Continuar na prova
                    </Button>

                    <Button
                        className="bg-red-600 hover:bg-red-700"
                        onClick={onConfirm}
                    >
                        Sair e encerrar prova
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

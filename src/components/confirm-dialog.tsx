// components/shared/confirm-dialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type ConfirmDialogProps = {
  trigger?: ReactNode;                // botão/link que abre o modal
  title: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  tone?: "primary" | "danger";       // variação do botão de ação
  className?: string;                // opcional para ajustar o content
};

export function ConfirmDialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  tone = "primary",
  className,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {<AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}

      <AlertDialogContent className={cn("max-w-[440px] rounded-2xl", className)}>
        <AlertDialogHeader className="text-center">
          <AlertDialogTitle className="text-2xl font-semibold text-gray-900">
            {title}
          </AlertDialogTitle>
          {description ? (
            <AlertDialogDescription className="mt-1 text-center text-gray-500">
              {description}
            </AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:justify-center gap-3">
          <AlertDialogCancel className="rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              "rounded-lg text-white",
              tone === "primary"
                ? "bg-[#0385d1] hover:bg-[#0271b2]"
                : "bg-red-600 hover:bg-red-700"
            )}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

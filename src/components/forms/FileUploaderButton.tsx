// src/components/forms/FileUploaderButton.tsx
import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { FileRejection } from "react-dropzone";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPT = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
};

export type FileUploaderButtonProps = {
  files?: File[];
  onChange: (files: File[]) => void;
  className?: string;
};

export function FileUploaderButton({ files = [], onChange, className }: FileUploaderButtonProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      if (rejections?.length) {
        const r = rejections[0];
        // mensagem amigável
        const tooBig = r.errors.find((e) => e.code === "file-too-large");
        const notAccepted = r.errors.find((e) => e.code === "file-invalid-type");
        const msg = tooBig
          ? "Arquivo acima de 5MB."
          : notAccepted
          ? "Formato não permitido. Aceito: PDF, DOC, DOCX ou Imagem."
          : "Não foi possível anexar o arquivo.";
        setError(msg);
        return;
      }
      setError(null);
      onChange(accepted);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    maxSize: MAX_SIZE,
    accept: ACCEPT,
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  const label = useMemo(() => (files.length ? files[0].name : "Anexar laudo"), [files]);

  return (
    <div {...getRootProps()} className={className}>
      <input {...getInputProps()} />
      <Button
        type="button"
        onClick={open}
        className="inline-flex items-center gap-2 rounded-lg bg-[#0385d1] px-4 py-2 text-white hover:bg-[#0271b2]"
      >
        <Paperclip className="size-4" />
        {label}
      </Button>

      <p className="mt-2 text-[12px] text-gray-500">
        Anexe seu laudo em PDF, Word ou imagem com tamanho máximo de 5MB.
      </p>
      {error && <p className="mt-1 text-[12px] text-red-600">{error}</p>}
    </div>
  );
}

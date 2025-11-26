// components/pcd/PCDUploadArea.tsx

import { Button } from "@/components/ui/button";
import { FileText, UploadCloud, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

export const PCDUploadArea = ({
    onFileSelect,
    selectedFile,
}: {
    onFileSelect: (f: File | null) => void;
    selectedFile: File | null;
}) => {
    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        multiple: false,
    });

    if (selectedFile) {
        return (
            <div className="mt-4 flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                        <FileText size={20} />
                    </div>
                    <div className="text-sm">
                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFileSelect(null)}
                    className="text-red-500 hover:text-red-700"
                >
                    <X size={18} />
                </Button>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={`mt-4 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                <UploadCloud size={32} />
                <p className="text-sm font-medium">
                    Arraste e solte o laudo (PDF) aqui, ou clique para selecionar
                </p>
                <p className="text-xs text-gray-400">Apenas arquivos PDF (Máx. 5MB)</p>
            </div>
        </div>
    );
};

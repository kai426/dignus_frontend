import type { Question } from "@/@types";
import { TOTAL_QUESTIONS } from "@/mocks/questionario";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUploaderButton } from "@/components/forms/FileUploaderButton";
import { CountryCombobox } from "@/components/forms/CountryCombobox";
import { isValidCID } from "@/utils/validators";
import { Progress } from "@/components/ui/progress";

export function ProgressHeader({ answered }: { answered: number }) {
  const total = TOTAL_QUESTIONS;
  const progressPct = total > 0 ? Math.min(100, Math.round((answered / total) * 100)) : 0;

  return (
    <header className="sticky top-0 z-20 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-200">
      <div className="mx-auto w-full max-w-[1100px] px-6 py-2">
        <h1 className="text-[18px] font-semibold text-gray-900">Questionário de Perfil</h1>
        <div className="mt-1 flex items-center gap-3">
          <span className="text-[12px] text-gray-500 whitespace-nowrap">
            Progresso: {answered}/{total}
          </span>
          <Progress value={progressPct} className="h-[8px] flex-1 [&>div]:bg-[#0385d1]" />
        </div>
      </div>
    </header>
  );
}

export function OptionItem({
  selected,
  label,
  onSelect,
  disabled = false,
  role = "radio",
}: {
  selected: boolean;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  role?: "radio" | "checkbox";
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled && !selected}
      className={[
        "w-full rounded-md border px-3 py-2 text-left text-[13px]",
        "transition-colors focus:outline-none focus-visible:ring-2",
        selected
          ? "bg-[#DBEAFE] border-[#BFDBFE] focus-visible:ring-[#93C5FD]"
          : "bg-white border-gray-200 hover:border-[#93C5FD] focus-visible:ring-[#93C5FD]",
        disabled && !selected ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      ].join(" ")}
      role={role}
      aria-checked={selected}
    >
      {label}
    </button>
  );
}

export function QuestionBlock({
  q,
  value,
  onChange,
  extraGet,
  extraSet,
}: {
  q: Question;
  value?: string | string[];
  onChange: (newValue: string | string[]) => void;
  extraGet?: (key: string) => any;
  extraSet?: (key: string, v: any) => void;
}) {
  const isMulti = q.type === "multi";
  const isText = q.type === "text";
  const maxSel = q.maxSelections ?? 1;
  (q as any).__get = extraGet;
  (q as any).__set = extraSet;

  const selectedIds: string[] = Array.isArray(value) ? value : value ? [value] : [];
  const atMax = isMulti && selectedIds.length >= maxSel;

  function toggle(optId: string) {
    if (!isMulti) {
      onChange(optId);
      return;
    }
    const already = selectedIds.includes(optId);
    if (already) {
      onChange(selectedIds.filter((id) => id !== optId));
      return;
    }
    if (selectedIds.length >= maxSel) return;
    onChange([...selectedIds, optId]);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Enunciado + pill (para multi) */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-[13px] font-semibold text-gray-800">{q.prompt}</div>
        {isMulti && (
          <span className="shrink-0 rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
            {selectedIds.length}/{maxSel}
          </span>
        )}
      </div>

      {isText ? (
        <Textarea
          placeholder={q.placeholder ?? "Digite aqui..."}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-32 resize-y"
        />
      ) : (
        <>
          <div className="space-y-2">
            {q.options.map((o) => {
              const isSelected = selectedIds.includes(o.id);
              const disabled = atMax && !isSelected;
              return (
                <OptionItem
                  key={o.id}
                  selected={isSelected}
                  disabled={disabled}
                  role={isMulti ? "checkbox" : "radio"}
                  label={o.label}
                  onSelect={() => toggle(o.id)}
                />
              );
            })}
          </div>

          {/* ========== Q47: PCD -> CID + Anexo (com validação) ========== */}
          {q.id === "q-47" && !isMulti && selectedIds[0] === "a" && (
            <div className="mt-4 space-y-3">
              {/* CID */}
              <div>
                <Label htmlFor="cid" className="text-[13px] text-gray-800">
                  Informe seu CID:
                </Label>
                {(() => {
                  const cidVal: string = (q as any).__get?.("q-47:cid") ?? "";
                  const invalid = cidVal.length > 0 && !isValidCID(cidVal);

                  return (
                    <>
                      <Input
                        id="cid"
                        placeholder="A00 | A00.0 | 000.0"
                        className={
                          "mt-1 " +
                          (invalid
                            ? "border-red-500 focus-visible:ring-red-400"
                            : "")
                        }
                        value={cidVal}
                        onChange={(e) => (q as any).__set?.("q-47:cid", e.target.value)}
                      />
                      <p className={"mt-1 text-[12px] " + (invalid ? "text-red-600" : "text-gray-500")}>
                        Formatos aceitos: <b>A00</b>, <b>A00.0</b> ou <b>000.0</b>.
                      </p>
                    </>
                  );
                })()}
              </div>

              {/* Anexo */}
              <FileUploaderButton
                files={(q as any).__get?.("q-47:files") ?? []}
                onChange={(files) => (q as any).__set?.("q-47:files", files)}
              />
            </div>
          )}

          {/* ========== Q48: Estrangeiro -> País (combobox) ========== */}
          {q.id === "q-48" && !isMulti && selectedIds[0] === "a" && (
            <div className="mt-4 space-y-2">
              <Label className="text-[13px] text-gray-800">
                Qual é a sua nacionalidade de origem?
              </Label>
              <CountryCombobox
                value={(q as any).__get?.("q-48:nationality")}
                onChange={(val) => (q as any).__set?.("q-48:nationality", val)}
                placeholder="Informe sua nacionalidade..."
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

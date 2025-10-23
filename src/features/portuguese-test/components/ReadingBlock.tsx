type ReadingBlockProps = {
  text?: string;
};

export function ReadingBlock({ text }: ReadingBlockProps) {
  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5">
      <p className="mb-3 text-base font-semibold text-gray-900">Texto para leitura</p>
      <div className="space-y-4 text-[15px] leading-7 text-gray-800 md:text-[16px]">
        <p>
          {/* Renderiza o texto recebido via props. 
            Se o texto não for fornecido, exibe uma mensagem de fallback.
          */}
          {text || "Carregando texto... Se esta mensagem persistir, houve um erro ao buscar o conteúdo."}
        </p>
      </div>
    </div>
  );
}

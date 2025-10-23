export function InstructionList() {
  return (
    <section>
      <h2 className="mb-2 text-lg font-semibold text-gray-900">Instruções</h2>
      <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-700">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Ao clicar em <b>Iniciar gravação</b> você começará a <b>Leitura</b> do texto (duração:
            <b> 1 minuto</b>).
          </li>
          <li>
            Em seguida virá a <b>Interpretação</b>, dividida em <b>3 perguntas</b>. Para cada uma
            haverá uma <b>contagem de 5 segundos</b> e depois <b>1 minuto</b> para responder.
          </li>
          <li>
            Cada resposta é gravada e enviada individualmente. Você pode encerrar antes; pediremos
            confirmação.
          </li>
          <li>Garanta câmera e microfone ativos; o temporizador aparece em todas as etapas.</li>
        </ol>
        <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-blue-700">
          Durante o teste, o navegador pode solicitar permissão de câmera e microfone. Clique em{" "}
          <b>Permitir</b>.
        </div>
      </div>
    </section>
  );
}

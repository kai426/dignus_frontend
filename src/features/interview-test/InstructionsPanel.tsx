export function InstructionsPanel() {
  return (
    <section className="mx-auto mb-8 w-full max-w-[920px]">
      <h2 className="mb-2 text-lg font-semibold text-gray-900">Instruções</h2>
      <div className="rounded-lg border border-gray-300 bg-white p-4 text-gray-700">
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>
            Ao clicar em <b>Iniciar gravação</b>, será exibida uma contagem
            regressiva de <b>5 segundos</b> antes da primeira pergunta.
          </li>
          <li>
            Cada pergunta deve ser respondida em até <b>2 minutos</b>. Ao atingir
            esse limite, a gravação da pergunta é encerrada automaticamente.
          </li>
          <li>
            Você pode avançar antes dos 2 minutos. Nesse caso, confirmaremos sua
            decisão antes de enviar a resposta.
          </li>
          <li>
            São <b>5 perguntas</b> no total (cada resposta é enviada
            individualmente). O tempo total previsto é de <b>10 minutos</b>.
          </li>
        </ol>

        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Durante a entrevista, o navegador pode solicitar permissão para acessar
          câmera e microfone. Clique em <b>Permitir</b>.
        </div>
      </div>
    </section>
  );
}

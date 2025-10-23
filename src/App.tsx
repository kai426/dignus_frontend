import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from './routeTree.gen' // Importa a árvore gerada
import { Toaster } from "sonner";

// Cria o roteador
const router = createRouter({ routeTree });

// Declara os tipos para o roteador (para autocompletar)
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        richColors
        closeButton
        expand
        duration={3000}
      // theme="light" // opcional
      />
    </>
  );
}

export default App;
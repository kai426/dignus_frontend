import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from './routeTree.gen'
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext"; 

const router = createRouter({
  routeTree,
  context: {
    auth: {
      isAuthenticated: false, 
      token: null,
    },
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function AppRouter() {
  const auth = useAuth(); // Pega o estado reativo do contexto

  return (
    <RouterProvider 
      router={router} 
      context={{ auth }} // Passa o auth atualizado para o roteador
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster
        position="top-center"
        richColors
        closeButton
        expand
        duration={3000}
      />
    </AuthProvider>
  );
}

export default App;
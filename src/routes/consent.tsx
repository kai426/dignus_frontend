import { ConsentPage } from '@/pages/ConsentPage';
import { createFileRoute, redirect } from '@tanstack/react-router'
import { toast } from 'sonner' 

export const Route = createFileRoute('/consent')({
  // A mágica acontece aqui no beforeLoad
  beforeLoad: ({ context }) => {
    // Verifica se NÃO está autenticado
    if (!context.auth.isAuthenticated) {
      
      // Dispara o Toast antes de redirecionar
      toast.error("Acesso restrito", {
        description: "Por favor, insira seu CPF na tela de login para continuar."
      });

      // Redireciona para o login
      throw redirect({
        to: '/', // Ou '/' se sua rota de login for a raiz
      })
    }
  },
  component: ConsentPage, // Seu componente existente
})
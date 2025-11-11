// src/pages/ConsentPage.tsx
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Checkbox } from '@/components/ui/checkbox'
// import { Label } from '@/components/ui/label'
import { AuthLayout } from '@/layouts/AuthLayout' // <-- Importa o novo layout
import { toast } from 'sonner'
import { useSubmitConsent } from '@/hooks/useConsent'

// Asset para consistência no mobile (NÃO é mais necessário aqui)
// import CTAMobile from '@/assets/BemolRecruta_Assets/images/CTA_Mobile.png'

export function ConsentPage() {
  const [agreed, setAgreed] = useState(false)
  const { mutate: submitConsent, isPending } = useSubmitConsent()

  const handleSubmit = () => {
    // ... (sua lógica de handleSubmit)
  }

  return (
    // Usa o AuthLayout como wrapper
    <AuthLayout>
      {/* O Card é passado como children */}
      <Card className="w-[400px] rounded-[16px] overflow-hidden border border-[#E5E7EB] shadow-lg p-0">
        {/* A imagem mobile já é tratada pelo AuthLayout, 
            mas o seu ConsentPage tinha uma específica. 
            Vamos manter a do seu ConsentPage para mobile.
        */}
        <img
          src={'/src/assets/BemolRecruta_Assets/images/CTA_Mobile.png'} // Use o path correto
          alt="Bem-vindo ao processo seletivo Bemol"
          className="block w-full lg:hidden object-cover"
        />

        <div className="p-8">
          <CardHeader className="text-center mb-4 p-0">
            <CardTitle className="text-[22px] font-bold">
              Termo de Consentimento
            </CardTitle>
            <CardDescription className="text-[13px] mt-2">
              Para continuar, você precisa ler e aceitar nossos termos de uso e
              política de privacidade.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 p-0">
            {/* ... (Resto do seu CardContent) ... */}
          </CardContent>

          <CardFooter className="mt-6 p-0">
            {/* ... (Resto do seu CardFooter) ... */}
          </CardFooter>
        </div>
      </Card>
    </AuthLayout>
  )
}
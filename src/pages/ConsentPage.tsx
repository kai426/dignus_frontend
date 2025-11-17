import { useState } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { AuthLayout } from '@/layouts/AuthLayout'
import { useSubmitConsent } from '@/hooks/useConsent'

import CTAMobile from '@/assets/BemolRecruta_Assets/images/CTA_Mobile.png'

export function ConsentPage() {
  const [agreed, setAgreed] = useState(false)
  const { mutate: submitConsent, isPending } = useSubmitConsent()

  const handleSubmit = () => {
    if (agreed) {
      submitConsent({ hasAccepted: true })
    }
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-[400px] rounded-[16px] overflow-hidden border border-[#E5E7EB] shadow-lg p-0">
        {/* Imagem para mobile, agora usando a variável importada */}
        <img
          src={CTAMobile}
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

          {/* CardContent agora contém o texto rolável, como no Figma */}
          <CardContent className="space-y-4 p-0">
            <div className="border rounded-md p-4 h-48 overflow-y-auto text-sm text-gray-600">
              <p className="font-semibold mb-2">
                Termos de Uso e Política de Privacidade
              </p>
              <p className="mb-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="mb-2">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint
                occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </p>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque
                ipsa quae ab illo inventore veritatis et quasi architecto
                beatae vitae dicta sunt explicabo.
              </p>
            </div>
          </CardContent>

          {/* Checkbox posicionado entre o conteúdo e o botão, como no Figma */}
          <div className="flex items-center space-x-2 mt-6">
            <Checkbox
              id="consent-checkbox"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <Label
              htmlFor="consent-checkbox"
              className="text-sm font-medium cursor-pointer"
            >
              Li e aceito os termos de consentimento
            </Label>
          </div>

          {/* CardFooter contém o botão de ação */}
          <CardFooter className="mt-6 p-0">
            <Button
              className="w-full bg-[#0385D1] hover:bg-[#0073C7] text-white font-semibold text-base h-11 rounded-md cursor-pointer"
              disabled={!agreed || isPending} // Desabilitado se não concordou OU se está carregando
              onClick={handleSubmit}
            >
              {isPending ? 'Enviando...' : 'Continuar'}
            </Button>
          </CardFooter>
        </div>
      </Card>
    </AuthLayout>
  )
}
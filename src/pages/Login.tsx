// src/pages/Login.tsx
import * as React from 'react'
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import LoginForm from '@/components/forms/LoginForm'
import { AuthLayout } from '@/layouts/AuthLayout' 

import CTAMobile from '@/assets/BemolRecruta_Assets/images/CTA_Mobile.png'

const Login: React.FC = () => {
  return (
    <AuthLayout>
      <Card className="w-[400px] rounded-[16px] overflow-hidden border border-[#E5E7EB] shadow-lg p-0">
        <img
          src={CTAMobile}
          alt="Bem-vindo ao processo seletivo Bemol"
          className="block w-full lg:hidden object-cover"
        />

        <div className="p-8">
          <CardHeader className="text-center mb-4 p-0">
            <CardTitle className="text-[22px] font-bold">
              Acessar o processo seletivo
            </CardTitle>
            <CardDescription className="text-[13px] mt-2">
              Informe abaixo o seu CPF para entrar no portal de recrutamento da
              Bemol.
            </CardDescription>
          </CardHeader>

          <LoginForm />

          <CardFooter className="mt-4 p-0">
            <p className="text-center text-xs text-muted-foreground leading-5">
              Ao continuar, você concorda com os{' '}
              <a
                href="#"
                className="underline underline-offset-2 text-[#0385D1]"
              >
                Termos de uso
              </a>{' '}
              e{' '}
              <a
                href="#"
                className="underline underline-offset-2 text-[#0385D1]"
              >
                Política de Privacidade
              </a>{' '}
              da Bemol S.A.
            </p>
          </CardFooter>
        </div>
      </Card>
    </AuthLayout>
  )
}

export default Login
import * as React from "react";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import LoginForm from "@/components/forms/LoginForm";

// ====== ASSETS ======
import Logos from "@/assets/BemolRecruta_Assets/images/Logos.png";
import CTA from "@/assets/BemolRecruta_Assets/images/CTA.svg";
import CamadaTopo from "@/assets/BemolRecruta_Assets/images/Camada_Topo.png";
// banner único já composto para mobile
import CTAMobile from "@/assets/BemolRecruta_Assets/images/CTA_Mobile.png";

const Login: React.FC = () => {
  return (
    <div className="min-h-svh w-full grid grid-cols-1 lg:grid-cols-[640px_1fr] 2xl:grid-cols-[700px_1fr] overflow-hidden bg-[#F9F9F9]">
      {/* ====== BANNER ESQUERDO (desktop/notebook) ====== */}
      <aside className="relative hidden lg:block bg-[#0385D1] overflow-visible">
        {/* palco central para logos + slogan alinhados */}
        <div className="pointer-events-none absolute inset-x-0 top-0">
          <div className="mx-auto w-[84%] max-w-[720px] relative">
            <img
              src={Logos}
              alt="Bemol e marcas do grupo"
              className="absolute left-1/2 -translate-x-1/2 w-full max-w-[740px] top-7 md:top-8 2xl:top-10 select-none"
              draggable={false}
            />
            <img
              src={CTA}
              alt="Escolha sua carreira com confiança no futuro."
              className="absolute left-1/2 -translate-x-1/2 w-full max-w-[740px] top-[180px] md:top-[198px] 2xl:top-[216px] select-none mt-4"
              draggable={false}
            />
          </div>
        </div>

        {/* “personagens + faixa” com bleed para a direita */}
        <img
          src={CamadaTopo}
          alt=""
          className="pointer-events-none select-none absolute bottom-0 left-0 max-w-none"
          style={{ width: "calc(100% + 40px)" }}
          draggable={false}
        />
      </aside>

      {/* ====== FORMULÁRIO ====== */}
      <main className="flex items-center justify-center px-4 sm:px-6">
        <Card className="w-[400px] rounded-[16px] overflow-hidden border border-[#E5E7EB] shadow-lg p-0">
          {/* HERO MOBILE (apenas < lg) — exatamente como no Figma */}
          <img
            src={CTAMobile}
            alt="Bem-vindo ao processo seletivo Bemol"
            className="block w-full lg:hidden object-cover"
            /* a arte já vem com proporção correta;
               se quiser forçar altura use: h-[180px] sm:h-[200px] */
          />

          {/* conteúdo do card */}
          <div className="p-8">
            <CardHeader className="text-center mb-4 p-0">
              <CardTitle className="text-[22px] font-bold">
                Acessar o processo seletivo
              </CardTitle>
              <CardDescription className="text-[13px] mt-2">
                Informe abaixo o seu CPF para entrar no portal de recrutamento
                da Bemol.
              </CardDescription>
            </CardHeader>

            <LoginForm />

            <CardFooter className="mt-4 p-0">
              <p className="text-center text-xs text-muted-foreground leading-5">
                Ao continuar, você concorda com os{" "}
                <a
                  href="#"
                  className="underline underline-offset-2 text-[#0385D1]"
                >
                  Termos de uso
                </a>{" "}
                e{" "}
                <a
                  href="#"
                  className="underline underline-offset-2 text-[#0385D1]"
                >
                  Política de Privacidade
                </a>{" "}
                da Bemol S.A.
              </p>
            </CardFooter>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Login;

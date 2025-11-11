import React from 'react'

import Logos from '@/assets/BemolRecruta_Assets/images/Logos.png'
import CTA from '@/assets/BemolRecruta_Assets/images/CTA.svg'
import CamadaTopo from '@/assets/BemolRecruta_Assets/images/Camada_Topo.png'
import CTAMobile from '@/assets/BemolRecruta_Assets/images/CTA_Mobile.png'

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-svh w-full grid grid-cols-1 lg:grid-cols-[640px_1fr] 2xl:grid-cols-[700px_1fr] overflow-hidden bg-[#F9F9F9]">
      {/* ====== BANNER ESQUERDO (Exatamente o seu) ====== */}
      <aside className="relative hidden lg:block bg-[#0385D1] overflow-visible">
        {/* Banner Mobile (para consistência se o ConsentPage usar) */}
        <img
          src={CTAMobile}
          alt="Bem-vindo ao processo seletivo Bemol"
          className="absolute inset-0 block h-full w-full object-cover lg:hidden"
        />
        {/* Overlay escuro para mobile */}
        <div className="absolute inset-0 block bg-black/30 lg:hidden" />

        {/* Banner Desktop */}
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
        <img
          src={CamadaTopo}
          alt=""
          className="pointer-events-none select-none absolute bottom-0 left-0 max-w-none"
          style={{ width: 'calc(100% + 40px)' }}
          draggable={false}
        />
      </aside>

      {/* ====== CONTEÚDO (Login ou Consent) ====== */}
      <main className="flex items-center justify-center px-4 sm:px-6">
        {children}
      </main>
    </div>
  )
}
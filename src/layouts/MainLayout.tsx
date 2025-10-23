import Sidebar from "@/components/layout/Sidebar";
import MobileTopbar from "@/components/layout/MobileTopbar";
import React from "react";

interface MainLayoutProps { children: React.ReactNode; }

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="sp-shell flex h-[100vh] bg-[#F9FAFB]">
      {/* Sidebar (desktop) */}
      <div className="sticky top-0 hidden lg:block lg:py-4">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-y-auto">
        {/* Topbar azul só no mobile */}
        <div className="lg:hidden">
          <MobileTopbar />
        </div>

        {/* Conteúdo – menos padding no lg para caber em 1272x594; desktop (≥2xl) intacto */}
        <div className="sp-container mx-auto w-full max-w-[1435px] py-4 lg:py-4 2xl:py-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { navItems } from "@/constant";

export default function MobileTopbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-[#0385D1] text-white">
      <div className="mx-auto max-w-[1435px] h-12 px-4 flex items-center justify-end">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Abrir menu"
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <Menu className="size-5" />
            </button>
          </SheetTrigger>

          {/* painel compacto igual ao mock do Figma */}
          <SheetContent side="top" className="border-0 bg-transparent p-0">
            <div className="mx-auto mt-3 w-[260px] rounded-2xl bg-[#0385D1] text-white shadow-xl">
              <nav className="p-5 space-y-5">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 hover:opacity-90"
                  >
                    {/* usa os ícones PNG já padronizados */}
                    <img
                      src={item.iconExpanded ?? item.iconCollapsed}
                      aria-hidden
                      className="w-[22px] h-[22px]"
                    />
                    <span className="text-[15px] font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

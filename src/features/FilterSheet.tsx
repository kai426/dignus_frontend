import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Filters = {
  status?: string;
  company?: string;
};

interface FilterSheetProps {
  // O componente pai passa o gatilho (o botão "Filtrar")
  children: React.ReactNode;
  // Filtros ativos atualmente
  activeFilters: Filters;
  // Função para aplicar os novos filtros
  onApplyFilters: (filters: Filters) => void;
}

export const FilterSheet = ({ children, activeFilters, onApplyFilters }: FilterSheetProps) => {
  // Estado interno para controlar os filtros dentro do painel
  const [localFilters, setLocalFilters] = useState<Filters>(activeFilters);

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleClear = () => {
    setLocalFilters({});
    onApplyFilters({});
  };

  return (
    <Sheet>
      {/* O botão "Filtrar" que abre o painel */}
      {children} 
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtrar Vagas</SheetTitle>
        </SheetHeader>
        
        <div className="grid gap-6 py-6">
          {/* Filtro por Empresa */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Empresa
            </Label>
            <Select
              value={localFilters.company || ""}
              onValueChange={(value) => setLocalFilters(prev => ({ ...prev, company: value }))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione a empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bemol Digital">Bemol Digital</SelectItem>
                <SelectItem value="Bemol S.A.">Bemol S.A.</SelectItem>
                <SelectItem value="BSP">BSP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={localFilters.status || ""}
              onValueChange={(value) => setLocalFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Publicado">Publicado</SelectItem>
                <SelectItem value="Encerrada">Encerrada</SelectItem>
                <SelectItem value="Rascunho">Rascunho</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={handleClear}>Limpar</Button>
          <SheetClose asChild>
            <Button onClick={handleApply}>Aplicar Filtros</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
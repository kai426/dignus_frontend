// src/components/forms/CountryCombobox.tsx
import { useMemo, useState } from "react";
import countries from "world-countries";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

export function CountryCombobox({
  value,
  onChange,
  placeholder = "Informe sua nacionalidade...",
}: {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const opts: Option[] = useMemo(() => {
    const list = countries.map((c) => ({
      value: c.cca2,
      label: (c.translations as any)?.por?.common ?? c.name.common,
    }));
    return list.sort((a, b) => a.label.localeCompare(b.label, "pt"));
  }, []);

  const selected = opts.find((o) => o.value === value)?.label;
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[360px] justify-between rounded-md border-gray-300 text-gray-700",
            !selected && "text-gray-400"
          )}
        >
          {selected ?? placeholder}
          <ChevronsUpDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-0">
        <Command>
          <CommandInput placeholder="Pesquisar país..." />
          <CommandList>
            <CommandEmpty>Nenhum país encontrado.</CommandEmpty>
            <CommandGroup>
              {opts.map((o) => (
                <CommandItem
                  key={o.value}
                  value={o.label}
                  onSelect={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 size-4", o.value === value ? "opacity-100" : "opacity-0")} />
                  {o.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

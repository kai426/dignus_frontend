import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronDown, Search } from "lucide-react";
import countries from "world-countries";

export const CountrySelect = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (val: string) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    const countriesList = useMemo(() => {
        return countries
            .map((c) => ({
                label: c.translations.por?.common || c.name.common,
                value: c.cca2,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, []);

    const filteredCountries = countriesList.filter((c) =>
        c.label.toLowerCase().includes(search.toLowerCase())
    );

    const selectedCountry = countriesList.find((c) => c.value === value);

    return (
        <div className="mt-4 relative w-full max-w-md">
            <Label className="mb-2 block text-sm font-medium text-gray-700">
                Selecione sua nacionalidade
            </Label>

            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm cursor-pointer hover:bg-gray-50"
            >
                {selectedCountry ? (
                    <span className="flex items-center gap-2">
                        <img
                            src={`https://flagcdn.com/${selectedCountry.value.toLowerCase()}.svg`}
                            alt={selectedCountry.label}
                            className="w-6 h-auto object-contain border border-gray-100 rounded-sm"
                        />
                        {selectedCountry.label}
                    </span>
                ) : (
                    <span className="text-gray-500">Selecione um país...</span>
                )}
                <ChevronDown size={16} className="text-gray-400" />
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg animate-in fade-in zoom-in-95 duration-100">
                    <div className="sticky top-0 bg-white p-2 border-b z-20">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Buscar país..."
                                className="pl-8 h-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="py-1">
                        {filteredCountries.length === 0 ? (
                            <div className="px-4 py-2 text-sm text-gray-500">
                                Nenhum país encontrado.
                            </div>
                        ) : (
                            filteredCountries.map((c) => (
                                <div
                                    key={c.value}
                                    onClick={() => {
                                        onChange(c.value);
                                        setIsOpen(false);
                                        setSearch("");
                                    }}
                                    className={`flex cursor-pointer items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 ${value === c.value
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700"
                                        }`}
                                >
                                    <img
                                        src={`https://flagcdn.com/${c.value.toLowerCase()}.svg`}
                                        alt={c.label}
                                        className="w-6 h-auto object-contain border border-gray-100 rounded-sm"
                                    />
                                    {c.label}

                                    {value === c.value && <Check size={14} className="ml-auto" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
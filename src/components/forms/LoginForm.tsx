import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import { onlyDigits, maskCPF, isValidCPF } from "@/utils/cpfUtils";
import { useLogin } from "@/hooks/useAuth";
import type { AxiosError } from "axios";

interface ApiError {
  message?: string;
  error?: string;
}

const LoginForm: React.FC = () => {
  const [cpf, setCpf] = React.useState("");
  const [validationError, setValidationError] = React.useState<string | null>(null);

  // Usa o hook useLogin (V1)
  const loginMutation = useLogin();

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = onlyDigits(e.target.value);
    setCpf(maskCPF(digits));
    setValidationError(null);
    loginMutation.reset(); // Limpa erro da API anterior ao digitar
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCpf = onlyDigits(cpf);

    if (!isValidCPF(cleanCpf)) {
      setValidationError("CPF inválido. Verifique e tente novamente.");
      return;
    }
    setValidationError(null);
    loginMutation.mutate(cleanCpf); // Chama a mutação V1
  };

   // Função para extrair mensagem de erro (ajustada)
   const getApiErrorMessage = (error: AxiosError<ApiError | string> | null): string | null => {
      if (!error) return null;
      if (error.response) {
        if (error.response.status === 401 && typeof error.response.data === 'string' && error.response.data.includes("Invalid CPF")) {
           return "CPF não encontrado ou inválido.";
        }
        if (typeof error.response.data === 'object' && error.response.data?.message) {
            return error.response.data.message;
        }
        if (typeof error.response.data === 'string') {
            return error.response.data;
        }
      } else if (error.request) {
        return "Não foi possível conectar ao servidor.";
      }
      return "Ocorreu um erro inesperado.";
  };
  const apiError = getApiErrorMessage(loginMutation.error);

  return (
    <CardContent className="p-0">
      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        {/* ... (renderização do input CPF e botão, como na versão V1) ... */}
         <div className="flex flex-col gap-2 text-left">
          <Label htmlFor="cpf" className="font-semibold text-sm">
            CPF
          </Label>
          <Input
            id="cpf"
            inputMode="numeric"
            autoComplete="off"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={handleCpfChange}
            maxLength={14}
            disabled={loginMutation.isPending}
            className={`h-11 rounded-md text-base ${
              (validationError || apiError) ? "border-destructive focus-visible:ring-destructive" : ""
            }`}
          />
          {(validationError || apiError) && (
            <span className="text-destructive text-xs mt-1">{validationError || apiError}</span>
          )}
        </div>

        <Button
          type="submit"
          disabled={loginMutation.isPending || onlyDigits(cpf).length !== 11}
          className="w-full h-11 rounded-md bg-[#0385D1] hover:bg-[#0073C7] text-white font-semibold text-base mt-2 disabled:opacity-70"
        >
          {loginMutation.isPending ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </CardContent>
  );
};

export default LoginForm;
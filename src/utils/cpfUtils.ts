export const onlyDigits = (v: string) => v.replace(/\D+/g, "");

export const maskCPF = (d: string) => 
  d
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");

export const isValidCPF = (value: string) => {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11) return false;
  // if (/^(\d)\1{10}$/.test(cpf)) return false;
  // const calc = (factor: number) => {
  //   let s = 0;
  //   for (let i = 0; i < factor - 1; i++) s += parseInt(cpf[i], 10) * (factor - i);
  //   const m = (s * 10) % 11;
  //   return m === 10 ? 0 : m;
  // };
  // return calc(10) === +cpf[9] && calc(11) === +cpf[10];
  return true; // desabilitado temporariamente
};

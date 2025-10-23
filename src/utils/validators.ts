/** 
 * Aceita:
 *  - Alfanumérico CID-10: A00, A00.0 (A-Z + 2 dígitos, opcional . + 1 char)
 *  - Numérico com ponto: 000.0
 */
const CID_ALFANUM = /^[A-Z][0-9]{2}(?:\.[0-9A-Z])?$/i;
const CID_NUM = /^\d{3}\.\d$/;

export function isValidCID(value: string): boolean {
  if (!value) return false;
  const v = value.trim().toUpperCase();
  return CID_ALFANUM.test(v) || CID_NUM.test(v);
}
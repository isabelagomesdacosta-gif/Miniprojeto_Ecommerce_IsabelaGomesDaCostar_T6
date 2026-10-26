// Etapa 2: validações pequenas e reutilizáveis mantêm as regras em um só lugar.
export function validarId(id: number): void {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("O identificador deve ser um inteiro positivo.");
  }
}
export function validarTexto(texto: string, campo: string): void {
  if (texto.trim() === "") throw new Error(`${campo} não pode estar vazio.`);
}
export function validarQuantidade(quantidade: number, permiteZero = false): void {
  if (!Number.isSafeInteger(quantidade) || quantidade < (permiteZero ? 0 : 1)) {
    throw new Error("Quantidade inválida: informe um inteiro dentro do limite permitido.");
  }
}
export function validarPreco(preco: number): void {
  if (!Number.isFinite(preco) || preco <= 0 || !Number.isSafeInteger(Math.round(preco * 100))) {
    throw new Error("O preço deve ser finito, maior que zero e estar dentro do limite monetário.");
  }
  // O preço do catálogo representa reais e deve ter no máximo duas casas decimais.
  if (Math.abs(preco * 100 - Math.round(preco * 100)) > 0.000001) {
    throw new Error("O preço deve ter no máximo duas casas decimais.");
  }
}
// Os cálculos usam centavos inteiros para evitar 0.1 + 0.2 = 0.30000000000000004.
export function paraCentavos(valor: number): number {
  const centavos = Math.round(valor * 100);
  if (!Number.isSafeInteger(centavos)) throw new Error("Valor monetário fora do limite.");
  return centavos;
}
export function deCentavos(centavos: number): number {
  if (!Number.isSafeInteger(centavos)) throw new Error("Valor monetário fora do limite.");
  return centavos / 100;
}

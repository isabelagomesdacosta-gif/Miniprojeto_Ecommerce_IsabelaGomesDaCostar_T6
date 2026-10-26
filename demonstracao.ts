// Usada no main para mostrar os erros esperados e interromper a execução se a regra falhar.
export function demonstrarErro(descricao: string, operacao: () => void, mensagemEsperada: string): void {
  try {
    operacao();
  } catch (erro: unknown) {
    if (!(erro instanceof Error) || !erro.message.includes(mensagemEsperada)) throw erro;
    console.log(`[OK - bloqueado] ${descricao}: ${erro.message}`);
    return;
  }
  throw new Error(`A validação falhou: ${descricao}`);
}
export function conferir(condicao: boolean, descricao: string): void {
  if (!condicao) throw new Error(`Conferência falhou: ${descricao}`);
  console.log(`[OK] ${descricao}`);
}

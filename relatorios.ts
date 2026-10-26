import { listarPedidos } from "./pedidos";
import { deCentavos, paraCentavos } from "./validacoes";
export type ResumoVendas = {
  quantidadePedidos: number;
  unidadesVendidas: number;
  faturamento: number;
  ticketMedio: number;
};
// O enunciado pede relatórios sem definir métricas: adotamos estes quatro indicadores.
export function gerarResumoVendas(): ResumoVendas {
  const pedidos = listarPedidos();
  const centavos = pedidos.reduce((total, pedido) => total + paraCentavos(pedido.total), 0);
  return {
    quantidadePedidos: pedidos.length,
    unidadesVendidas: pedidos.reduce((total, pedido) => total + pedido.itens.reduce((qtd, item) => qtd + item.quantidade, 0), 0),
    faturamento: deCentavos(centavos),
    ticketMedio: pedidos.length ? deCentavos(Math.round(centavos / pedidos.length)) : 0
  };
}
export function gerarVendasPorProduto(): { produtoId: number; nome: string; quantidade: number; receita: number }[] {
  const vendas: { produtoId: number; nome: string; quantidade: number; receita: number }[] = [];
  for (const pedido of listarPedidos()) {
    for (const item of pedido.itens) {
      const venda = vendas.find(venda => venda.produtoId === item.produtoId);
      if (venda) {
        venda.quantidade += item.quantidade;
        venda.receita = deCentavos(paraCentavos(venda.receita) + paraCentavos(item.subtotal));
      } else {
        vendas.push({ produtoId: item.produtoId, nome: item.nome, quantidade: item.quantidade, receita: item.subtotal });
      }
    }
  }
  return vendas;
}

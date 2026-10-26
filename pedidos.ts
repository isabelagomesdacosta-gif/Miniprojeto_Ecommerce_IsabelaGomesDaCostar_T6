import { buscarClientePorId } from "./clientes";
import { adicionarProduto, calcularTotal, criarCarrinho, listarItens } from "./carrinho";
import { baixarEstoque } from "./produtos";
import { Carrinho, Pedido } from "./types";
const pedidos: Pedido[] = [];
let proximoId = 1;
function copiarPedido(pedido: Pedido): Pedido {
  return { ...pedido, itens: pedido.itens.map(item => ({ ...item })) };
}
export function finalizarPedido(clienteId: number, carrinho: Carrinho): Pedido {
  if (!buscarClientePorId(clienteId)) throw new Error("Cliente inexistente.");
  if (carrinho.length === 0) throw new Error("Não é possível finalizar um carrinho vazio.");
  // Fase 1: nenhum estado é alterado. Revalidamos o estoque atual e somamos duplicatas.
  const validado = criarCarrinho();
  for (const item of carrinho) adicionarProduto(validado, item.produtoId, item.quantidade);
  const pedido: Pedido = {
    id: proximoId, clienteId,
    itens: listarItens(validado), // Copia os preços praticados agora, sem consultar o catálogo depois.
    total: calcularTotal(validado),
    data: new Date().toISOString()
  };
  // Fase 2: todos os itens passaram. A operação é síncrona e o lote é validado novamente.
  baixarEstoque(validado);
  pedidos.push(pedido);
  proximoId += 1;
  carrinho.length = 0;
  return copiarPedido(pedido);
}
export function listarPedidos(): Pedido[] {
  return pedidos.map(copiarPedido);
}
export function buscarPedidosPorCliente(clienteId: number): Pedido[] {
  return listarPedidos().filter(pedido => pedido.clienteId === clienteId);
}

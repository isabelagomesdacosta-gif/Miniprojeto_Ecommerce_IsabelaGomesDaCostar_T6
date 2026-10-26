import { buscarProdutoPorId } from "./produtos";
import { Carrinho, ItemCalculado } from "./types";
import { deCentavos, paraCentavos, validarQuantidade } from "./validacoes";
export function criarCarrinho(): Carrinho { return []; }
export function adicionarProduto(carrinho: Carrinho, produtoId: number, quantidade: number): void {
  validarQuantidade(quantidade);
  const existente = carrinho.find(item => item.produtoId === produtoId);
  const novaQuantidade = (existente?.quantidade ?? 0) + quantidade;
  alterarOuAdicionar(carrinho, produtoId, novaQuantidade);
}
function alterarOuAdicionar(carrinho: Carrinho, produtoId: number, quantidade: number): void {
  validarQuantidade(quantidade);
  const produto = buscarProdutoPorId(produtoId);
  if (!produto) throw new Error("Produto inexistente.");
  if (quantidade > produto.estoque) throw new Error("Estoque insuficiente.");
  const item = carrinho.find(item => item.produtoId === produtoId);
  if (item) item.quantidade = quantidade;
  else carrinho.push({ produtoId, quantidade });
}
export function alterarQuantidade(carrinho: Carrinho, produtoId: number, quantidade: number): void {
  if (!carrinho.find(item => item.produtoId === produtoId)) throw new Error("Item não está no carrinho.");
  alterarOuAdicionar(carrinho, produtoId, quantidade);
}
export function removerProdutoDoCarrinho(carrinho: Carrinho, produtoId: number): void {
  const indice = carrinho.findIndex(item => item.produtoId === produtoId);
  if (indice === -1) throw new Error("Item não está no carrinho.");
  carrinho.splice(indice, 1);
}
export function listarItens(carrinho: Carrinho): ItemCalculado[] {
  return carrinho.map(item => {
    validarQuantidade(item.quantidade);
    const produto = buscarProdutoPorId(item.produtoId);
    if (!produto) throw new Error("Produto inexistente.");
    return {
      ...item, nome: produto.nome, precoUnitario: produto.preco,
      subtotal: deCentavos(paraCentavos(produto.preco) * item.quantidade)
    };
  });
}
export function calcularTotal(carrinho: Carrinho): number {
  const centavos = listarItens(carrinho).reduce((total, item) => total + paraCentavos(item.subtotal), 0);
  return deCentavos(centavos);
}

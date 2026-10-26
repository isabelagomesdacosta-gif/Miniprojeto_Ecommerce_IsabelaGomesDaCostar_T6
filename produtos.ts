import { produtosIniciais } from "./dados";
import { AtualizacaoProduto, ItemCarrinho, Produto } from "./types";
import { validarId, validarPreco, validarQuantidade, validarTexto } from "./validacoes";

const produtos: Produto[] = produtosIniciais.map(produto => ({ ...produto }));
// IDs removidos não são reutilizados, evitando confundir carrinhos e históricos.
const idsUtilizados: number[] = produtos.map(produto => produto.id);
function validarProduto(produto: Produto): void {
  validarId(produto.id);
  validarTexto(produto.nome, "Nome");
  validarTexto(produto.categoria, "Categoria");
  validarPreco(produto.preco);
  validarQuantidade(produto.estoque, true);
}
export function cadastrarProduto(produto: Produto): Produto {
  validarProduto(produto);
  if (idsUtilizados.includes(produto.id)) throw new Error("Identificador de produto já utilizado.");
  const novo = { ...produto, nome: produto.nome.trim(), categoria: produto.categoria.trim() };
  produtos.push(novo);
  idsUtilizados.push(novo.id);
  return { ...novo };
}
export function listarProdutos(): Produto[] {
  return produtos.map(produto => ({ ...produto }));
}
export function buscarProdutoPorId(id: number): Produto | undefined {
  const produto = produtos.find(produto => produto.id === id);
  return produto ? { ...produto } : undefined;
}
export function buscarProdutosPorNome(nome: string): Produto[] {
  const termo = nome.trim().toLowerCase();
  return listarProdutos().filter(produto => produto.nome.toLowerCase().includes(termo));
}
export function filtrarProdutosPorCategoria(categoria: string): Produto[] {
  return listarProdutos().filter(produto => produto.categoria.toLowerCase() === categoria.trim().toLowerCase());
}
export function atualizarProduto(id: number, alteracoes: AtualizacaoProduto): Produto {
  const indice = produtos.findIndex(produto => produto.id === id);
  if (indice === -1) throw new Error("Produto inexistente.");
  const atualizado: Produto = { ...produtos[indice], ...alteracoes, id };
  // Só substituímos o original quando TODOS os novos campos forem válidos.
  validarProduto(atualizado);
  atualizado.nome = atualizado.nome.trim();
  atualizado.categoria = atualizado.categoria.trim();
  produtos[indice] = atualizado;
  return { ...atualizado };
}
export function removerProduto(id: number): void {
  const indice = produtos.findIndex(produto => produto.id === id);
  if (indice === -1) throw new Error("Produto inexistente.");
  // Remoção do catálogo não apaga pedidos. Carrinhos antigos serão revalidados.
  produtos.splice(indice, 1);
}
// Valida o lote inteiro antes de reduzir qualquer estoque.
export function baixarEstoque(itens: ItemCarrinho[]): void {
  const totais: ItemCarrinho[] = [];
  for (const item of itens) {
    validarQuantidade(item.quantidade);
    const existente = totais.find(total => total.produtoId === item.produtoId);
    if (existente) existente.quantidade += item.quantidade;
    else totais.push({ ...item });
  }
  for (const item of totais) {
    validarQuantidade(item.quantidade);
    const produto = produtos.find(produto => produto.id === item.produtoId);
    if (!produto) throw new Error("Produto inexistente.");
    if (item.quantidade > produto.estoque) throw new Error("Estoque insuficiente.");
  }
  for (const item of totais) {
    const produto = produtos.find(produto => produto.id === item.produtoId)!;
    produto.estoque -= item.quantidade;
  }
}

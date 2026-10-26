// Etapa 1: os tipos descrevem os dados usados pelos outros módulos.
export type Produto = {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
};
export type Cliente = { id: number; nome: string; email: string };
export type ItemCarrinho = { produtoId: number; quantidade: number };
export type Carrinho = ItemCarrinho[];
export type ItemCalculado = ItemCarrinho & {
  nome: string;
  precoUnitario: number;
  subtotal: number;
};
export type Pedido = {
  id: number;
  clienteId: number;
  itens: ItemCalculado[];
  total: number;
  data: string;
};
export type AtualizacaoProduto = {
  nome?: string;
  categoria?: string;
  preco?: number;
  estoque?: number;
};

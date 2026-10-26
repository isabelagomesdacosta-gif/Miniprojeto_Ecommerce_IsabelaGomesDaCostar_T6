const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const pastaDist = path.resolve(__dirname, "./dist") + path.sep;
let p, c, cart, orders, reports;
beforeEach(() => {
  // Cada teste recebe arrays novos, como uma nova execução do sistema.
  for (const arquivo of Object.keys(require.cache)) {
    if (arquivo.startsWith(pastaDist)) delete require.cache[arquivo];
  }
  p = require("./dist/produtos");
  c = require("./dist/clientes");
  cart = require("./dist/carrinho");
  orders = require("./dist/pedidos");
  reports = require("./dist/relatorios");
});
test("catálogo consulta por nome parcial, categoria e ID", () => {
  assert.equal(p.buscarProdutosPorNome(" CAD ")[0].id, 1);
  assert.equal(p.filtrarProdutosPorCategoria("PAPELARIA").length, 2);
  assert.equal(p.buscarProdutoPorId(999), undefined);
});
test("produto inválido não entra no catálogo", () => {
  const produto = { id: 4, nome: "Estojo", categoria: "Papelaria", preco: 10, estoque: 2 };
  const antes = p.listarProdutos();
  for (const alteracao of [{id: 1}, {id: 1.5}, {nome: " "}, {categoria: ""}, {preco: 0}, {preco: -1}, {preco: NaN}, {preco: Infinity}, {preco: 1.001}, {estoque: -1}, {estoque: 0.5}]) {
    assert.throws(() => p.cadastrarProduto({...produto, ...alteracao}));
    assert.deepEqual(p.listarProdutos(), antes);
  }
});
test("atualização inválida preserva todos os campos anteriores", () => {
  const antes = p.buscarProdutoPorId(1);
  assert.throws(() => p.atualizarProduto(1, { nome: "Novo", estoque: -1 }));
  assert.deepEqual(p.buscarProdutoPorId(1), antes);
  assert.equal(p.atualizarProduto(1, { estoque: 0 }).estoque, 0);
});
test("remoção não permite reaproveitar ID antigo", () => {
  const antes = p.buscarProdutoPorId(1);
  p.removerProduto(1);
  assert.throws(() => p.cadastrarProduto(antes), /já utilizado/);
  assert.throws(() => p.removerProduto(1), /inexistente/);
});
test("clientes começam com três cadastros e rejeitam duplicatas e dados vazios", () => {
  assert.equal(c.listarClientes().length, 3);
  for (const cliente of [
    { id: 1, nome: "Outro", email: "outro@example.com" },
    { id: 4, nome: "Outra", email: " ANA@example.com " },
    { id: 4, nome: " ", email: "novo@example.com" },
    { id: 4, nome: "Nova", email: " " },
    { id: 4, nome: "Nova", email: "invalido" }
  ]) assert.throws(() => c.cadastrarCliente(cliente));
  assert.equal(c.listarClientes().length, 3);
  c.cadastrarCliente({id: 4, nome: " Diego ", email: " DIEGO@example.com "});
  assert.equal(c.buscarClientePorId(4).email, "diego@example.com");
});
test("carrinho soma o mesmo produto e valida a quantidade acumulada", () => {
  const carrinho = cart.criarCarrinho();
  cart.adicionarProduto(carrinho, 1, 6);
  assert.throws(() => cart.adicionarProduto(carrinho, 1, 5), /Estoque insuficiente/);
  assert.deepEqual(carrinho, [{produtoId: 1, quantidade: 6}]);
  cart.adicionarProduto(carrinho, 1, 4);
  assert.equal(carrinho.length, 1);
  assert.equal(carrinho[0].quantidade, 10);
});
test("quantidades inválidas e produtos ausentes não alteram o carrinho", () => {
  const carrinho = cart.criarCarrinho();
  for (const quantidade of [0, -1, 0.5, NaN, Infinity]) {
    assert.throws(() => cart.adicionarProduto(carrinho, 1, quantidade));
  }
  assert.throws(() => cart.adicionarProduto(carrinho, 999, 1), /inexistente/);
  assert.deepEqual(carrinho, []);
});
test("carrinho altera, remove e calcula subtotais e total em centavos", () => {
  const carrinho = cart.criarCarrinho();
  cart.adicionarProduto(carrinho, 1, 2);
  cart.adicionarProduto(carrinho, 2, 1);
  cart.alterarQuantidade(carrinho, 2, 3);
  assert.deepEqual(cart.listarItens(carrinho).map(item => item.subtotal), [51, 9.6]);
  assert.equal(cart.calcularTotal(carrinho), 60.6);
  assert.throws(() => cart.alterarQuantidade(carrinho, 2, 0));
  cart.removerProdutoDoCarrinho(carrinho, 1);
  assert.equal(cart.calcularTotal(carrinho), 9.6);
  cart.removerProdutoDoCarrinho(carrinho, 2);
  assert.equal(cart.calcularTotal(carrinho), 0);
  p.atualizarProduto(1, {preco: 0.1}); p.atualizarProduto(2, {preco: 0.2});
  cart.adicionarProduto(carrinho, 1, 1);cart.adicionarProduto(carrinho, 2, 1);
  assert.equal(cart.calcularTotal(carrinho), 0.3);
});
test("pedido válido reduz estoque, limpa carrinho e registra cliente/data", () => {
  const carrinho = cart.criarCarrinho(); cart.adicionarProduto(carrinho, 1, 2);
  const pedido = orders.finalizarPedido(1, carrinho);
  assert.equal(pedido.total, 51); assert.equal(pedido.clienteId, 1);
  assert.ok(Number.isFinite(Date.parse(pedido.data)));
  assert.equal(p.buscarProdutoPorId(1).estoque, 8);
  assert.deepEqual(carrinho, []);
  assert.equal(orders.buscarPedidosPorCliente(1).length, 1);
  assert.deepEqual(orders.buscarPedidosPorCliente(2), []);
});
test("cliente inexistente e carrinho vazio não geram pedidos", () => {
  const carrinho = cart.criarCarrinho();cart.adicionarProduto(carrinho, 1, 1);
  const antes = p.listarProdutos();
  assert.throws(() => orders.finalizarPedido(999, carrinho), /Cliente inexistente/);
  assert.throws(() => orders.finalizarPedido(1, []), /vazio/);
  assert.deepEqual(p.listarProdutos(), antes);
  assert.equal(orders.listarPedidos().length, 0);
  assert.equal(carrinho.length, 1);
});
test("falha no segundo item não desconta o primeiro nem esvazia o carrinho", () => {
  const carrinho = cart.criarCarrinho();cart.adicionarProduto(carrinho, 1, 2);cart.adicionarProduto(carrinho, 3, 1);
  p.atualizarProduto(3, {estoque: 0});
  const antes = p.listarProdutos();const itensAntes = structuredClone(carrinho);
  assert.throws(() => orders.finalizarPedido(1, carrinho), /Estoque insuficiente/);
  assert.deepEqual(p.listarProdutos(), antes);
  assert.deepEqual(carrinho, itensAntes);
  assert.equal(orders.listarPedidos().length, 0);
});
test("produto removido depois de adicionado impede a compra inteira", () => {
  const carrinho = cart.criarCarrinho();cart.adicionarProduto(carrinho, 1, 1);cart.adicionarProduto(carrinho, 3, 1);
  p.removerProduto(3);
  assert.throws(() => orders.finalizarPedido(1, carrinho), /Produto inexistente/);
  assert.equal(p.buscarProdutoPorId(1).estoque, 10);
  assert.equal(orders.listarPedidos().length, 0);
});
test("dois carrinhos disputam o estoque disponível no momento da compra", () => {
  const a = cart.criarCarrinho();const b = cart.criarCarrinho();
  cart.adicionarProduto(a, 3, 4);cart.adicionarProduto(b, 3, 4);
  orders.finalizarPedido(1, a);
  assert.throws(() => orders.finalizarPedido(2, b), /Estoque insuficiente/);
  assert.equal(p.buscarProdutoPorId(3).estoque, 1);
  assert.equal(orders.listarPedidos().length, 1);
});
test("finalização agrega linhas duplicadas antes de validar o estoque", () => {
  assert.throws(() => orders.finalizarPedido(1, [{produtoId: 1, quantidade: 6}, {produtoId: 1, quantidade: 5}]), /Estoque insuficiente/);
  assert.equal(p.buscarProdutoPorId(1).estoque, 10);
  const pedido = orders.finalizarPedido(1, [{produtoId: 1, quantidade: 2}, {produtoId: 1, quantidade: 3}]);
  assert.equal(pedido.itens.length, 1);assert.equal(pedido.itens[0].quantidade, 5);
});
test("pedidos preservam preço/nome e consultas não expõem referências internas", () => {
  const carrinho = cart.criarCarrinho();cart.adicionarProduto(carrinho, 1, 2);
  const retorno = orders.finalizarPedido(1, carrinho);
  retorno.itens[0].precoUnitario = 999;retorno.total = 999;
  p.atualizarProduto(1, {preco: 99, nome: "Renomeado"}); p.removerProduto(1);
  const consultado = orders.listarPedidos();consultado[0].itens[0].quantidade = 100;
  const original = orders.listarPedidos()[0];
  assert.equal(original.total, 51);assert.equal(original.itens[0].nome, "Caderno");
  assert.equal(original.itens[0].precoUnitario, 25.5);assert.equal(original.itens[0].quantidade, 2);
  assert.equal(reports.gerarVendasPorProduto()[0].receita, 51);
});
test("IDs dos pedidos são únicos e relatórios usam vendas históricas", () => {
  assert.deepEqual(reports.gerarResumoVendas(), {quantidadePedidos: 0, unidadesVendidas: 0, faturamento: 0, ticketMedio: 0});
  const a = cart.criarCarrinho();cart.adicionarProduto(a, 1, 2);cart.adicionarProduto(a, 2, 3);
  const primeiro = orders.finalizarPedido(1, a);
  const b = cart.criarCarrinho();cart.adicionarProduto(b, 2, 5);const segundo = orders.finalizarPedido(2, b);
  assert.notEqual(primeiro.id, segundo.id);
  assert.deepEqual(reports.gerarResumoVendas(), {quantidadePedidos: 2, unidadesVendidas: 10, faturamento: 76.6, ticketMedio: 38.3});
  assert.deepEqual(reports.gerarVendasPorProduto().map(v => [v.produtoId, v.quantidade, v.receita]), [[1, 2, 51], [2, 8, 25.6]]);
});

import { clientesIniciais, produtosIniciais } from "./dados";
import { conferir, demonstrarErro } from "./demonstracao";
import { atualizarProduto, buscarProdutoPorId, buscarProdutosPorNome, cadastrarProduto, filtrarProdutosPorCategoria, listarProdutos, removerProduto } from "./produtos";
import { buscarClientePorId, cadastrarCliente, listarClientes } from "./clientes";
import { adicionarProduto, alterarQuantidade, calcularTotal, criarCarrinho, listarItens, removerProdutoDoCarrinho } from "./carrinho";
import { buscarPedidosPorCliente, finalizarPedido, listarPedidos } from "./pedidos";
import { gerarResumoVendas, gerarVendasPorProduto } from "./relatorios";


console.log("\nETAPA 1 - Estrutura, tipos e dados iniciais");
console.log("Produtos:", produtosIniciais);
console.log("Clientes:", clientesIniciais);
conferir(clientesIniciais.length >= 3, "Pelo menos três clientes iniciais");

console.log("\nETAPA 2 - Catálogo e validações");
cadastrarProduto({ id: 4, nome: "Estojo", categoria: "Papelaria", preco: 15, estoque: 8 });
console.log("Produtos cadastrados:", listarProdutos());
console.log("Busca por ID:", buscarProdutoPorId(1));
console.log("Busca por parte do nome:", buscarProdutosPorNome("cad"));
console.log("Produtos da categoria Papelaria:", filtrarProdutosPorCategoria("papelaria"));
console.log("Atualizado:", atualizarProduto(4, { preco: 18, estoque: 9 }));
removerProduto(4);
conferir(buscarProdutoPorId(4) === undefined, "Produto removido do catálogo");
demonstrarErro("Preço negativo", () => cadastrarProduto({ id: 5, nome: "Inválido", categoria: "Teste", preco: -1, estoque: 1 }), "preço");
demonstrarErro("ID repetido", () => cadastrarProduto({ id: 1, nome: "Outro", categoria: "Teste", preco: 1, estoque: 1 }), "já utilizado");

console.log("\nETAPA 3 - Clientes e carrinho");
cadastrarCliente({ id: 4, nome: "Diego Alves", email: "diego@example.com" });
console.log("Clientes cadastrados:", listarClientes());
console.log("Cliente 1:", buscarClientePorId(1));
demonstrarErro("E-mail repetido", () => cadastrarCliente({ id: 5, nome: "Outra Ana", email: " ANA@example.com " }), "já utilizado");
const carrinho = criarCarrinho();
adicionarProduto(carrinho, 1, 1);
adicionarProduto(carrinho, 1, 1);
adicionarProduto(carrinho, 2, 2);
alterarQuantidade(carrinho, 2, 3);
adicionarProduto(carrinho, 3, 1);
removerProdutoDoCarrinho(carrinho, 3);
console.log("Itens do carrinho:", listarItens(carrinho));
console.log("Total: R$", calcularTotal(carrinho).toFixed(2));
conferir(carrinho.length === 2 && carrinho[0].quantidade === 2, "Mesmo produto ocupa uma única linha");
conferir(calcularTotal(carrinho) === 60.60, "Total de 2 cadernos e 3 canetas = R$ 60,60");
demonstrarErro("Quantidade acima do estoque", () => adicionarProduto(carrinho, 1, 100), "Estoque insuficiente");
demonstrarErro("Quantidade zero", () => alterarQuantidade(carrinho, 1, 0), "Quantidade inválida");
demonstrarErro("Produto inexistente", () => adicionarProduto(carrinho, 999, 1), "Produto inexistente");

console.log("\nETAPA 4 - Pedidos e estoque");
const pedido = finalizarPedido(1, carrinho);
console.log("Pedido criado:", pedido);
console.log("Pedidos registrados:", listarPedidos());
console.log("Pedidos do cliente 1:", buscarPedidosPorCliente(1));
conferir(buscarProdutoPorId(1)?.estoque === 8 && buscarProdutoPorId(2)?.estoque === 17, "Estoque descontado após a compra");
conferir(carrinho.length === 0, "Carrinho esvaziado após sucesso");
atualizarProduto(1, { preco: 30 });
conferir(listarPedidos()[0].total === 60.60 && listarPedidos()[0].itens[0].precoUnitario === 25.50, "Preço histórico preservado");
demonstrarErro("Compra sem itens", () => finalizarPedido(1, criarCarrinho()), "vazio");
const semCliente = criarCarrinho();
adicionarProduto(semCliente, 2, 1);
demonstrarErro("Cliente inexistente", () => finalizarPedido(999, semCliente), "Cliente inexistente");
// Um item fica sem estoque depois de ter sido colocado no carrinho.
const carrinhoComFalha = criarCarrinho();
adicionarProduto(carrinhoComFalha, 1, 1);
adicionarProduto(carrinhoComFalha, 3, 1);
atualizarProduto(3, { estoque: 0 });
const estoqueAntes = buscarProdutoPorId(1)!.estoque;
const pedidosAntes = listarPedidos().length;
demonstrarErro("Falha no segundo item", () => finalizarPedido(1, carrinhoComFalha), "Estoque insuficiente");
conferir(buscarProdutoPorId(1)!.estoque === estoqueAntes && listarPedidos().length === pedidosAntes && carrinhoComFalha.length === 2, "Falha não altera estoque, pedidos ou carrinho");

console.log("\nETAPA 5 - Integração e relatórios");
const segundoCarrinho = criarCarrinho();
adicionarProduto(segundoCarrinho, 2, 5);
finalizarPedido(2, segundoCarrinho);
console.log("Resumo das vendas:", gerarResumoVendas());
console.log("Vendas por produto:", gerarVendasPorProduto());
conferir(gerarResumoVendas().quantidadePedidos === 2 && gerarResumoVendas().faturamento === 76.60, "Dois pedidos somam R$ 76,60");
conferir(gerarResumoVendas().unidadesVendidas === 10 && gerarResumoVendas().ticketMedio === 38.30, "10 unidades e ticket médio de R$ 38,30");

console.log("\nETAPA 6 - Revisão final");
console.log("Demonstração concluída. Consulte README.md.");
console.log("Os dados são fictícios e permanecem somente em memória.");

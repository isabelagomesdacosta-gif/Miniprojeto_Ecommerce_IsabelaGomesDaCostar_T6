import { clientesIniciais, produtosIniciais } from "./dados";
import { conferir, demonstrarErro } from "./demonstracao";
import { atualizarProduto, buscarProdutoPorId, buscarProdutosPorNome, cadastrarProduto, filtrarProdutosPorCategoria, listarProdutos, removerProduto } from "./produtos";
import { buscarClientePorId, cadastrarCliente, listarClientes } from "./clientes";
import { adicionarProduto, alterarQuantidade, calcularTotal, criarCarrinho, listarItens, removerProdutoDoCarrinho } from "./carrinho";


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

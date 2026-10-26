import { clientesIniciais, produtosIniciais } from "./dados";
import { conferir, demonstrarErro } from "./demonstracao";
import { atualizarProduto, buscarProdutoPorId, buscarProdutosPorNome, cadastrarProduto, filtrarProdutosPorCategoria, listarProdutos, removerProduto } from "./produtos";


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

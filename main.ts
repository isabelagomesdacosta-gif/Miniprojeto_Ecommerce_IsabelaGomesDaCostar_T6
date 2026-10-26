import { clientesIniciais, produtosIniciais } from "./dados";
import { conferir, demonstrarErro } from "./demonstracao";


console.log("\nETAPA 1 - Estrutura, tipos e dados iniciais");
console.log("Produtos:", produtosIniciais);
console.log("Clientes:", clientesIniciais);
conferir(clientesIniciais.length >= 3, "Pelo menos três clientes iniciais");

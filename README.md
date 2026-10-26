# Mini-projeto E-commerce em TypeScript

**Aluna:** Isabela Gomes da Costa.  
**Turma:** Desenvolvedor Back-End Node T6, Módulo 1, Semana 7, conforme o enunciado. Confirmar identificação no AVA antes da publicação.

## Objetivo

Gerenciar um pequeno e-commerce no terminal: catálogo, clientes, carrinhos, pedidos, controle de estoque e relatórios de vendas. O foco é aplicar funções reutilizáveis, tipos explícitos, módulos e manipulação de arrays.

## Funcionalidades

- Produtos: cadastro, listagem, busca por ID, busca por parte do nome, filtro por categoria, atualização e remoção.
- Clientes: cadastro, listagem e busca por ID; bloqueio de ID/e-mail repetidos. Três clientes iniciais.
- Carrinho: adicionar, somar unidades do mesmo produto, alterar quantidade, remover, listar, calcular subtotais e total.
- Pedidos: finalizar para um cliente cadastrado, preservar preços, baixar estoque e consultar geral ou por cliente.
- Relatórios: quantidade de pedidos, unidades vendidas, faturamento, ticket médio e vendas por produto.
- Demonstração de um fluxo completo e de mais de três situações inválidas, com mensagens compreensíveis.

## Tecnologias

TypeScript 5.9, Node.js, npm e VS Code. Tipos do Node são usados no desenvolvimento. Testes com `node:test` e `node:assert`, incluídos no Node. Não há dependências de execução externas.

## Estrutura

Os módulos TypeScript ficam **diretamente na raiz do repositório**, sem a pasta `src`. Cada arquivo continua responsável por uma parte do sistema e usa `import`/`export` para se comunicar com os demais. O `tsconfig.json` usa `rootDir: "."` e `include: ["*.ts"]` para compilar essa organização. O JavaScript gerado fica em `dist/` e não é enviado ao GitHub.

O README inicial foi mantido durante as etapas intermediárias e atualizado nesta documentação de entrega.

```text
types.ts          Tipos de produto, cliente, carrinho e pedido
dados.ts          Produtos e três clientes fictícios iniciais
validacoes.ts     Regras reutilizáveis e conversão de valores
produtos.ts       Operações do catálogo e baixa de estoque em lote
clientes.ts       Cadastro e consulta de clientes
carrinho.ts       Operações de itens e cálculos
pedidos.ts        Finalização e consultas de pedidos
relatorios.ts     Consolidação das vendas históricas
demonstracao.ts   Conferências e tratamento dos erros esperados
main.ts           Inicialização e demonstração acumulada
regras.test.cjs   Testes de regras de negócio com Node
package.json        Dependências e comandos
package-lock.json   Versões resolvidas para reproduzir a instalação
tsconfig.json       Compilação TypeScript estrita
```

## Compilar e executar no VS Code

Abra a pasta do projeto no VS Code. Com Node.js e npm instalados, execute no terminal integrado:

```powershell
npm.cmd ci
npm.cmd run build
npm.cmd start
```

Ou compile e execute com `npm.cmd run demo`. `npm.cmd test` compila e roda os testes. Validado localmente com Node.js 24; os testes exigem uma versão que ofereça `node:test`. Os comandos usam `npm.cmd` para funcionar no PowerShell sem alterar a política de execução de scripts do Windows.

O compilador gera `dist/`. A execução usa `node dist/main.js`, cumprindo o fluxo TypeScript → JavaScript → Node.js. Os dados são criados em memória e reiniciados a cada execução.

## Exemplos das principais operações

O `main.ts` chama todos os módulos. Exemplos de uso em TypeScript, para experimentar em um arquivo .ts na raiz do projeto:

```typescript
import { cadastrarProduto, buscarProdutosPorNome } from "./produtos";
import { cadastrarCliente } from "./clientes";
import { criarCarrinho, adicionarProduto, alterarQuantidade, calcularTotal } from "./carrinho";
import { finalizarPedido, buscarPedidosPorCliente } from "./pedidos";

cadastrarProduto({ id: 10, nome: "Lápis", categoria: "Papelaria", preco: 2.50, estoque: 10 });
cadastrarCliente({ id: 10, nome: "Pessoa Exemplo", email: "pessoa@example.com" });
console.log("Produtos encontrados:", buscarProdutosPorNome("láp"));
const carrinho = criarCarrinho();
adicionarProduto(carrinho, 10, 2);
alterarQuantidade(carrinho, 10, 3);
console.log(calcularTotal(carrinho)); // 7.50
console.log(finalizarPedido(10, carrinho));
console.log("Pedidos do cliente:", buscarPedidosPorCliente(10));
```

No fluxo demonstrado por `main.ts`, o primeiro pedido tem 2 cadernos e 3 canetas, total R$ 60,60. O segundo tem 5 canetas, total R$ 16,00. Os relatórios mostram **2 pedidos, 10 unidades, R$ 76,60 de faturamento e R$ 38,30 de ticket médio**. A data é gerada no momento da execução, em ISO UTC.

Exemplos inválidos apresentados: preço negativo, ID de produto repetido, e-mail repetido, quantidade acima do estoque, quantidade zero, produto inexistente, carrinho vazio, cliente inexistente e falta de estoque em um item de uma compra com vários itens.

## Regras de negócio

1. IDs de produtos e clientes são inteiros positivos e únicos. IDs de produtos removidos não são reutilizados durante a execução.
2. Nomes e categorias não podem ficar vazios. Preço finito maior que zero, com até duas casas decimais; estoque inteiro não negativo.
3. Clientes precisam de nome e e-mail; o e-mail é normalizado e tem formato básico validado. Duplicidade ignora espaços nas pontas e maiúsculas/minúsculas.
4. Quantidade de compra é um inteiro positivo, o produto deve existir e a quantidade acumulada não pode exceder o estoque.
5. Adicionar um produto repetido soma a quantidade na mesma linha. Alterar quantidade substitui o valor; para remover use a função de remoção.
6. Subtotais são preço × quantidade. Somatórios e multiplicações usam centavos inteiros, com verificação do limite seguro de números.
7. O carrinho não reserva estoque nem fixa preço. Ambos são consultados ao finalizar; todas as linhas são validadas antes de alterar o estado.
8. Pedido exige cliente existente e pelo menos um item. Qualquer falha preserva estoque, pedidos anteriores e carrinho, sem registro parcial.
9. Após o sucesso, o estoque é reduzido, o pedido recebe ID único/data e o carrinho é esvaziado.
10. Nome e preço da compra são copiados para o pedido. Alterações ou remoções futuras no catálogo não mudam valores históricos. Consultas devolvem cópias.
11. Remoção de produto é permitida. Pedidos históricos são preservados; um carrinho que ainda contenha o produto removido será rejeitado na finalização.
12. Relatórios somam preços históricos. Ticket médio é faturamento / número de pedidos, arredondado para centavos; sem pedidos, retorna zero.

## Testes

`npm.cmd test` executa 16 testes que verificam cadastro, buscas, atualizações inválidas, duplicidade, valores monetários, limites do carrinho, finalização, concorrência simulada entre dois carrinhos, duplicatas manuais de itens, histórico e relatórios. Um caso confirma que falha no segundo item não desconta o primeiro.

A demonstração do `main.ts` também confere cálculos e efeitos no estado. Mensagens `[OK - bloqueado]` indicam validações esperadas, não falhas de execução. Um erro inesperado ou resultado divergente encerra o processo com falha.

## Limitações conhecidas

- Dados em arrays, perdidos ao encerrar o processo; IDs dos pedidos recomeçam em uma nova execução.
- Não há banco, API REST, interface gráfica, login, pagamento, frete, cupons ou impostos.
- Operações síncronas no mesmo processo. A validação em lote não é uma transação de banco nem resolve concorrência distribuída.
- E-mail possui validação básica; não há verificação externa de existência.
- Moeda fixa em reais, até duas casas decimais, dentro do limite seguro de inteiros do JavaScript.
- Busca ignora caixa, mas distingue acentos. No relatório por produto, o nome exibido é o primeiro nome histórico vendido daquele ID.
- Os carrinhos são arrays tipados gerenciados pelas funções. Código externo deve respeitar os tipos; não há uma camada de validação de entrada JSON não confiável.
- A execução é uma demonstração por chamadas de funções, sem menu interativo.

## Referências e autoria

Enunciado: **Mini-Projeto Avaliativo - Back End Node [T6] - M1S7 (1).pdf**, atualizado em 16/10/2026. Conteúdos de referência: os PDFs **Desenvolvedor Back-End [Node] T6 - M1S01.pdf** a **M1S05.pdf**, disponibilizados nas aulas (ambiente, funções, arrays, objetos e callbacks).

Desenvolvimento com auxílio do Codex, com revisão das funções, decisões e resultados pela aluna antes da entrega.

Repositório público no padrão `Miniprojeto_Ecommerce_NomeAluno_Turma`; prazo informado no enunciado: **26/10/2026 às 22h**, via AVA. Conferir identificação da turma antes de publicar.

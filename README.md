# Mini-projeto E-commerce - etapa 1

Aluna: Isabela Gomes da Costa. Turma: Back-End Node T6.

Nesta etapa foi preparada a estrutura do projeto, com configuração do TypeScript, definição dos tipos e dados iniciais de produtos e clientes.

## Funcionalidades implementadas

- Configuração de compilação TypeScript para JavaScript.
- Tipos de produto, cliente, item do carrinho e pedido.
- Dados iniciais de três produtos e três clientes.
- Exibição dos dados no terminal com console.log.

## Executar no VS Code

Abra a pasta do projeto no VS Code e execute no terminal:

```powershell
npm.cmd install
npm.cmd run demo
```

Para compilar e executar separadamente:

```powershell
npm.cmd run build
npm.cmd start
```

Os comandos usam `npm.cmd` para funcionar no PowerShell sem alterar a política de execução de scripts do Windows.

## Estrutura

- `src/`: código TypeScript e dados iniciais.
- `package.json`: dependências e comandos de execução.
- `package-lock.json`: versões das dependências.
- `tsconfig.json`: configuração da compilação.
- `.gitignore`: arquivos e pastas ignorados pelo Git.

Tecnologias: TypeScript, Node.js e npm. Os dados são arrays em memória e são reiniciados ao executar. As saídas utilizam console.log. Não há interface gráfica ou persistência.

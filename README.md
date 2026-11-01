# pgats-automacao-web-BrunaCosta

Projeto de conclusão da disciplina de Automação de Testes na Camada Web (PGATS), feito por Bruna Costa.
Automatiza, com Cypress, dez casos de teste da aplicação [Automation Exercise](https://www.automationexercise.com).

## Pré-requisitos

- Node.js 22 ou superior
- npm
- versão do Cypress utilizada: cypress@13.7.3
- Caso a versão seja superior poderar voltar a versão com o comando: npm install cypress@13.7.3 --save-dev

## Como rodar

```bash
npm ci          # instala as dependências
npm test        # executa todos os testes em modo headless
npm run cy:open # abre o Cypress no modo interativo
```

## Casos automatizados

Todos ficam em `cypress/e2e/casos-de-teste.cy.js`.

| Código | Cenário |
|---|---|
| CT01 | Cadastrar um novo usuário e excluir a conta |
| CT02 | Entrar com e-mail e senha corretos |
| CT03 | Erro ao entrar com credenciais inválidas (negativo) |
| CT04 | Sair da conta (logout) |
| CT05 | Erro ao cadastrar com e-mail já existente (negativo) |
| CT08 | Listagem de produtos e página de detalhe |
| CT09 | Busca de produtos |
| CT10 | Inscrição na newsletter pela página inicial |
| CT15 | Pedido com cadastro antes da compra |
| CT16 | Pedido com login antes da compra |

## Organização das pastas

```
.github/workflows/testes-e2e.yml   pipeline do GitHub Actions
cypress/
  e2e/                             specs (somente a sequência dos passos)
  modules/                         elementos e ações agrupados por área
    menu/                          cabeçalho, navegação e botão Continue
    registro/                      Signup, ficha de cadastro e limpeza das contas
    autenticacao/                  login, logout e exclusão de conta
    catalogo/                      listagem, detalhe e busca de produtos
    newsletter/                    rodapé e inscrição
    compra/                        carrinho, checkout e pagamento
  fixtures/                        dados do cartão e das compras
  support/
    commands.js                    comandos customizados do Cypress
    e2e.js                         configuração global dos testes
    dados/usuario.js               gerador de usuários únicos
```

## Decisões de projeto

- **Specs enxutos:** o arquivo de teste só descreve o fluxo; seletores e ações ficam em `cypress/modules`.
- **Seletores estáveis:** preferência por `data-qa` e `id`.
- **Independência:** cada teste cria o próprio usuário, gerado com e-mail único.
- **Limpeza:** ao fim de cada teste as contas criadas são apagadas pela API do site, mesmo se o teste falhar.
- **Dados externos:** cartão e itens da compra ficam em `cypress/fixtures`.
- **Estabilidade:** os anúncios do Google são bloqueados, erros de JavaScript do site não derrubam o teste e há 2 novas tentativas por teste, tanto no `cypress run` quanto no `cypress open`.
- **Sincronização:** o logout só é considerado concluído quando o site redireciona para `/login`, e o total de produtos da busca (CT09) é guardado como valor fixo antes de pesquisar, para a comparação ser feita com o catálogo completo.
- **Escopo da execução:** o Cypress roda apenas os specs da pasta `cypress/e2e` (`cypress/e2e/*.cy.js`), ou seja, o `casos-de-teste.cy.js`.

## Relatório

O relatório HTML com gráficos e capturas de tela é gerado em `cypress/reports/index.html` (abre sozinho nas execuções locais). Os vídeos ficam em `cypress/reports/videos/`.

## GitHub Actions

O workflow `.github/workflows/testes-e2e.yml` roda os testes em modo headless:

- a cada push e pull request na `main`;
- automaticamente a cada 7 minutos (agendamento `*/7 * * * *`, horário UTC);
- manualmente, pela aba **Actions**.

Ao final, o relatório fica disponível como artefato da execução por 30 dias.
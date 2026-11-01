// Elementos da tela de Login e das ações ligadas à sessão do usuário
const alvo = {
  tituloLogin: '.login-form h2',
  campoEmail: '[data-qa="login-email"]',
  campoSenha: '[data-qa="login-password"]',
  botaoEntrar: '[data-qa="login-button"]',
  avisoErro: '.login-form form p',

  // Cabeçalho com usuário autenticado
  usuarioLogado: '#header a:contains("Logged in as")',
  botaoSair: '#header a[href="/logout"]',
  botaoExcluir: '#header a[href="/delete_account"]',

  // Confirmação de exclusão
  contaExcluida: '[data-qa="account-deleted"]',
};

const autenticacao = {
  // Confere que a tela de login está aberta
  conferirTelaLogin() {
    cy.get(alvo.tituloLogin)
      .should('be.visible')
      .and('contain.text', 'Login to your account');
  },

  entrar(email, senha) {
    cy.get(alvo.campoEmail).type(email);
    cy.get(alvo.campoSenha).type(senha);
    cy.get(alvo.botaoEntrar).click();
  },

  // Confere "Logged in as <nome>" no cabeçalho
  conferirUsuarioLogado(nome) {
    cy.get(alvo.usuarioLogado)
      .should('be.visible')
      .and('contain.text', nome);
  },

  // Confere o aviso exibido quando as credenciais estão erradas
  conferirErroCredenciais(mensagem) {
    cy.get(alvo.avisoErro)
      .should('be.visible')
      .and('contain.text', mensagem);
  },

  // Clica em Logout e espera o site concluir a saída (redireciona para /login).
  // Sem essa espera, o próximo cy.visit pode interromper o logout e deixar o
  // usuário ainda logado, sem o link "Signup / Login" no cabeçalho.
  sair() {
    cy.get(alvo.botaoSair).click();
    cy.location('pathname').should('eq', '/login');
    cy.get(alvo.tituloLogin).should('be.visible');
  },

  // Exclui a conta e confere "Account Deleted!"
  excluirConta() {
    cy.get(alvo.botaoExcluir).click();
    cy.get(alvo.contaExcluida)
      .should('be.visible')
      .and('contain.text', 'Account Deleted!');
  },
};

module.exports = autenticacao;

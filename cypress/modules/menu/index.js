// Elementos do cabeçalho e ações de navegação usadas por vários módulos
const alvo = {
  inicio: '#header a[href="/"]',
  telaLogin: '#header a[href="/login"]',
  produtos: '#header a[href="/products"]',
  carrinho: '#header a[href="/view_cart"]',
  continuar: '[data-qa="continue-button"]',
  tabelaCarrinho: '#cart_info',
};

const menu = {
  // Abre a home e espera o cabeçalho aparecer
  abrirInicio() {
    cy.visit('/');
    cy.get(alvo.inicio).should('be.visible');
  },

  // Vai da home até a tela de Login / Cadastro
  abrirTelaLogin() {
    menu.abrirInicio();
    cy.get(alvo.telaLogin).click();
  },

  irParaProdutos() {
    cy.get(alvo.produtos).click();
  },

  // Abre o carrinho pelo cabeçalho e confirma que a tabela foi exibida
  abrirCarrinho() {
    cy.get(alvo.carrinho).click();
    cy.location('pathname').should('eq', '/view_cart');
    cy.get(alvo.tabelaCarrinho).should('be.visible');
  },

  // Botão "Continue" mostrado depois de criar ou excluir uma conta
  clicarContinuar() {
    cy.get(alvo.continuar).click();
  },
};

module.exports = menu;

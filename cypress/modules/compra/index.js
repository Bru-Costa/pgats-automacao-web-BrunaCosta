const catalogo = require('../catalogo');

// Elementos do carrinho, do checkout e do pagamento
const alvo = {
  botaoAdicionar: '.features_items .productinfo .add-to-cart',
  janelaCarrinho: '#cartModal',
  fecharJanela: '#cartModal .close-modal',
  tabelaCarrinho: '#cart_info',
  linhasCarrinho: '#cart_info tbody tr[id^="product-"]',
  botaoCheckout: 'a.check_out',
  blocoCheckout: '[data-qa="checkout-info"]',
  enderecoEntrega: '#address_delivery',
  enderecoCobranca: '#address_invoice',
  observacao: 'textarea[name="message"]',
  botaoPedido: 'a[href="/payment"]',

  titularCartao: '[data-qa="name-on-card"]',
  numeroCartao: '[data-qa="card-number"]',
  cvcCartao: '[data-qa="cvc"]',
  mesValidade: '[data-qa="expiry-month"]',
  anoValidade: '[data-qa="expiry-year"]',
  botaoPagar: '[data-qa="pay-button"]',
  pedidoFeito: '[data-qa="order-placed"]',
};

// Adiciona o item da listagem na posição informada e fecha a janela de confirmação
function adicionarItemDaListagem(posicao) {
  cy.get(alvo.botaoAdicionar).eq(posicao).scrollIntoView().click();
  cy.get(alvo.janelaCarrinho).should('have.class', 'show');
  cy.get(alvo.fecharJanela).click();
}

function conferirLinhasDoCarrinho(itens) {
  cy.get(alvo.linhasCarrinho).should('have.length', itens.length);
  itens.forEach((item) => {
    cy.get(alvo.tabelaCarrinho).should('contain.text', item);
  });
}

const compra = {
  // Coloca no carrinho os dois primeiros itens da listagem
  colocarDoisItensNoCarrinho() {
    catalogo.abrirListagem();
    adicionarItemDaListagem(0);
    adicionarItemDaListagem(1);
  },

  conferirItensNoCarrinho(itens) {
    conferirLinhasDoCarrinho(itens);
  },

  iniciarCheckout() {
    cy.get(alvo.botaoCheckout).click();
    cy.location('pathname').should('eq', '/checkout');
    cy.get(alvo.blocoCheckout).should('be.visible');
  },

  // Confere endereço de entrega, endereço de cobrança e a revisão do pedido
  conferirDadosDoCheckout(usuario, itens) {
    cy.get(alvo.enderecoEntrega)
      .should('be.visible')
      .and('contain.text', usuario.primeiroNome)
      .and('contain.text', usuario.sobrenome)
      .and('contain.text', usuario.endereco)
      .and('contain.text', usuario.complemento)
      .and('contain.text', usuario.cidade)
      .and('contain.text', usuario.estado)
      .and('contain.text', usuario.cep)
      .and('contain.text', usuario.pais)
      .and('contain.text', usuario.celular);
    cy.get(alvo.enderecoCobranca)
      .should('be.visible')
      .and('contain.text', usuario.primeiroNome)
      .and('contain.text', usuario.sobrenome);
    cy.contains('h2', 'Review Your Order').should('be.visible');
    conferirLinhasDoCarrinho(itens);
  },

  // Escreve a observação e segue para a tela de pagamento
  confirmarPedido(observacao) {
    cy.get(alvo.observacao).type(observacao);
    cy.get(alvo.botaoPedido).click();
    cy.location('pathname').should('eq', '/payment');
    cy.contains('h2', 'Payment').should('be.visible');
  },

  pagar(titular, cartao) {
    cy.get(alvo.titularCartao).type(titular);
    cy.get(alvo.numeroCartao).type(cartao.numero);
    cy.get(alvo.cvcCartao).type(cartao.cvc);
    cy.get(alvo.mesValidade).type(cartao.mesValidade);
    cy.get(alvo.anoValidade).type(cartao.anoValidade);
    cy.get(alvo.botaoPagar).click();
  },

  conferirPedidoConcluido() {
    cy.location('pathname').should('match', /\/payment_done\/\d+$/);
    cy.get(alvo.pedidoFeito)
      .should('be.visible')
      .and('contain.text', 'Order Placed!');
    cy.contains('Congratulations! Your order has been confirmed!').should('be.visible');
  },
};

module.exports = compra;

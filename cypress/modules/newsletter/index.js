// Elementos do rodapé e da inscrição na newsletter
const alvo = {
  rodape: '#footer',
  campoEmail: '#susbscribe_email', // a grafia errada é a original do site
  botaoInscrever: '#subscribe',
  avisoSucesso: '#success-subscribe .alert-success',
};

const newsletter = {
  // Desce até o rodapé e confere o título "Subscription"
  irAteRodape() {
    cy.get(alvo.rodape).scrollIntoView();
    cy.contains(`${alvo.rodape} h2`, /subscription/i).should('be.visible');
  },

  inscrever(email) {
    cy.get(alvo.campoEmail).type(email);
    cy.get(alvo.botaoInscrever).click();
  },

  conferirInscricao() {
    cy.get(alvo.avisoSucesso)
      .should('be.visible')
      .and('contain.text', 'You have been successfully subscribed!');
  },
};

module.exports = newsletter;

const menu = require('../menu');

// Elementos da listagem, da ficha do produto e da busca
const alvo = {
  titulo: 'h2.title',
  cartao: '.features_items .product-image-wrapper',
  resumoCartao: '.features_items .productinfo',
  linkDetalhe: '.features_items a[href^="/product_details/"]',
  ficha: '.product-information',
  campoBusca: '#search_product',
  botaoBusca: '#submit_search',
};

const catalogo = {
  // Abre a home, vai até ALL PRODUCTS e confere que há itens listados
  abrirListagem() {
    menu.abrirInicio();
    menu.irParaProdutos();
    cy.contains(alvo.titulo, 'All Products').should('be.visible');
    cy.get(alvo.cartao).should('have.length.greaterThan', 0);
  },

  // Memoriza nome e preço do primeiro item e abre a página de detalhe dele
  abrirPrimeiroProduto() {
    cy.get(alvo.resumoCartao).first().then(($resumo) => {
      cy.wrap({
        nome: $resumo.find('p').text().trim(),
        preco: $resumo.find('h2').text().trim(),
      }).as('primeiroItem');
    });
    cy.get(alvo.linkDetalhe).first().scrollIntoView().click();
    cy.location('pathname').should('match', /\/product_details\/\d+$/);
    cy.get(alvo.ficha).should('be.visible');
  },

  // Compara a ficha com o que foi visto na listagem e confere os demais campos
  conferirFichaDoProduto() {
    cy.get('@primeiroItem').then(({ nome, preco }) => {
      cy.get(alvo.ficha).within(() => {
        cy.get('h2').invoke('text').then((texto) => {
          expect(texto.trim(), 'nome do produto').to.eq(nome);
        });
        cy.get('span span').should('contain.text', preco);
        cy.contains('p', 'Category:').invoke('text').should('match', /Category:\s*\S+/);
        cy.contains('p', 'Availability:').invoke('text').should('match', /Availability:\s*\S+/);
        cy.contains('p', 'Condition:').invoke('text').should('match', /Condition:\s*\S+/);
        cy.contains('p', 'Brand:').invoke('text').should('match', /Brand:\s*\S+/);
      });
    });
  },

  // Guarda o total de produtos para comparar com o resultado da busca.
  // O número é gravado como valor fixo (cy.wrap): um alias criado direto sobre
  // cy.get().its() é refeito a cada uso e passaria a contar os itens da tela atual.
  memorizarTotal() {
    cy.get(alvo.cartao)
      .its('length')
      .then((total) => {
        cy.wrap(total, { log: false }).as('totalCatalogo');
      });
  },

  buscar(termo) {
    cy.get(alvo.campoBusca).type(termo);
    cy.get(alvo.botaoBusca).click();
  },

  // Confere o título, nome e preço em cada resultado, a presença do termo
  // e se a busca realmente reduziu a lista
  conferirBusca(termo) {
    cy.contains(alvo.titulo, 'Searched Products').should('be.visible');
    cy.get(alvo.cartao)
      .should('have.length.greaterThan', 0)
      .then(($cartoes) => {
        // Usa DOM puro (toArray) em vez de espalhar o objeto jQuery, que não é iterável nesta versão do Cypress
        const resumos = $cartoes.toArray().map((cartao) => cartao.querySelector('.productinfo'));
        const nomes = resumos.map((resumo) => resumo.querySelector('p').textContent.trim());

        resumos.forEach((resumo) => {
          expect(resumo.querySelector('p').textContent.trim(), 'nome do produto').to.not.be.empty;
          expect(resumo.querySelector('h2').textContent, 'preço do produto').to.contain('Rs.');
        });

        expect(
          nomes.some((nome) => nome.toLowerCase().includes(termo.toLowerCase())),
          `ao menos um resultado contém "${termo}"`
        ).to.be.true;

        cy.get('@totalCatalogo').then((total) => {
          expect($cartoes.length, 'resultados da busca < catálogo completo').to.be.lessThan(total);
        });
      });
  },
};

module.exports = catalogo;

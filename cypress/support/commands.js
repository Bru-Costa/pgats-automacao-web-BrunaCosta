// Intercepta e descarta as chamadas de anúncios do Google. Esses anúncios abrem
// pop-ups (como o #google_vignette) por cima da página e geram falhas intermitentes.
Cypress.Commands.add('bloquearAnuncios', () => {
  cy.intercept(
    { hostname: /(googlesyndication|doubleclick|googleadservices|adservice\.google)\./ },
    { statusCode: 204, body: '' }
  );
});

// Apaga a conta direto pela API do site, sem falhar o teste se ela já não existir.
// Garante a limpeza dos usuários criados mesmo quando o teste quebra no meio.
Cypress.Commands.add('removerContaPorApi', ({ email, senha }) => {
  cy.request({
    method: 'DELETE',
    url: '/api/deleteAccount',
    form: true,
    body: { email, password: senha },
    failOnStatusCode: false,
    log: false,
  });
});

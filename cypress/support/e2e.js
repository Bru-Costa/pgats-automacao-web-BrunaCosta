import 'cypress-mochawesome-reporter/register';
import './commands';

// Anúncios e scripts de terceiros do site podem lançar erros de JavaScript que não
// têm relação com o que está sendo validado, então não devem interromper o teste.
Cypress.on('uncaught:exception', () => false);

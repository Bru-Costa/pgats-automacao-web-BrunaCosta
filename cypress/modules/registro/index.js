const menu = require('../menu');

// Elementos da tela de Signup e do formulário de criação de conta
const alvo = {
  // Primeira etapa
  tituloSecao: 'h2',
  campoNome: '[data-qa="signup-name"]',
  campoEmail: '[data-qa="signup-email"]',
  botaoSignup: '[data-qa="signup-button"]',
  avisoEmailDuplicado: '.signup-form form p',

  // Formulário completo
  nomeGravado: '[data-qa="name"]',
  emailGravado: '[data-qa="email"]',
  tratamentoMr: 'input[name="title"][value="Mr"]',
  senha: '[data-qa="password"]',
  dia: '#days',
  mes: '#months',
  ano: '#years',
  newsletter: '#newsletter',
  ofertas: '#optin',
  primeiroNome: '[data-qa="first_name"]',
  sobrenome: '[data-qa="last_name"]',
  empresa: '[data-qa="company"]',
  endereco: '[data-qa="address"]',
  complemento: '[data-qa="address2"]',
  pais: '[data-qa="country"]',
  estado: '[data-qa="state"]',
  cidade: '[data-qa="city"]',
  cep: '[data-qa="zipcode"]',
  celular: '[data-qa="mobile_number"]',
  botaoCriar: '[data-qa="create-account"]',

  // Confirmação
  contaCriada: '[data-qa="account-created"]',
};

// Usuários cadastrados no teste em andamento, removidos pela API ao final dele
const pendentesDeLimpeza = [];

const registro = {
  // Informa nome e e-mail e avança com o botão Signup
  informarNomeEEmail(nome, email) {
    cy.contains(alvo.tituloSecao, 'New User Signup!').should('be.visible');
    cy.get(alvo.campoNome).type(nome);
    cy.get(alvo.campoEmail).type(email);
    cy.get(alvo.botaoSignup).click();
  },

  // Preenche toda a ficha e confere cada valor digitado antes de enviar
  preencherFicha(usuario) {
    cy.contains('Enter Account Information').should('be.visible');
    cy.get(alvo.nomeGravado).should('have.value', usuario.nome);
    cy.get(alvo.emailGravado).should('have.value', usuario.email);
    cy.get(alvo.tratamentoMr).check();
    cy.get(alvo.senha).type(usuario.senha);
    cy.get(alvo.dia).select(usuario.nascimento.dia);
    cy.get(alvo.mes).select(usuario.nascimento.mes);
    cy.get(alvo.ano).select(usuario.nascimento.ano);
    cy.get(alvo.newsletter).check().should('be.checked');
    cy.get(alvo.ofertas).check().should('be.checked');
    cy.get(alvo.primeiroNome).type(usuario.primeiroNome);
    cy.get(alvo.sobrenome).type(usuario.sobrenome);
    cy.get(alvo.empresa).type(usuario.empresa);
    cy.get(alvo.endereco).type(usuario.endereco);
    cy.get(alvo.complemento).type(usuario.complemento);
    cy.get(alvo.pais).select(usuario.pais);
    cy.get(alvo.estado).type(usuario.estado);
    cy.get(alvo.cidade).type(usuario.cidade);
    cy.get(alvo.cep).type(usuario.cep);
    cy.get(alvo.celular).type(usuario.celular);

    cy.get(alvo.primeiroNome).should('have.value', usuario.primeiroNome);
    cy.get(alvo.sobrenome).should('have.value', usuario.sobrenome);
    cy.get(alvo.empresa).should('have.value', usuario.empresa);
    cy.get(alvo.endereco).should('have.value', usuario.endereco);
    cy.get(alvo.complemento).should('have.value', usuario.complemento);
    cy.get(alvo.pais).should('have.value', usuario.pais);
    cy.get(alvo.estado).should('have.value', usuario.estado);
    cy.get(alvo.cidade).should('have.value', usuario.cidade);
    cy.get(alvo.cep).should('have.value', usuario.cep);
    cy.get(alvo.celular).should('have.value', usuario.celular);
    cy.get(alvo.botaoCriar).click();
  },

  // Confere a mensagem "Account Created!"
  conferirContaCriada() {
    cy.get(alvo.contaCriada)
      .should('be.visible')
      .and('contain.text', 'Account Created!');
  },

  // Fluxo completo de cadastro. O usuário entra na lista de limpeza para ser
  // apagado ao final do teste.
  cadastrarUsuario(usuario) {
    pendentesDeLimpeza.push(usuario);
    menu.abrirTelaLogin();
    registro.informarNomeEEmail(usuario.nome, usuario.email);
    registro.preencherFicha(usuario);
    registro.conferirContaCriada();
  },

  // Confere o aviso de e-mail já cadastrado
  conferirEmailDuplicado() {
    cy.get(alvo.avisoEmailDuplicado)
      .should('be.visible')
      .and('contain.text', 'Email Address already exist!');
  },

  // Apaga pela API todas as contas criadas durante o teste
  apagarContasCriadas() {
    pendentesDeLimpeza.splice(0).forEach((usuario) => cy.removerContaPorApi(usuario));
  },
};

module.exports = registro;

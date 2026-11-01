/// <reference types="cypress" />

const menu = require('../modules/menu');
const registro = require('../modules/registro');
const autenticacao = require('../modules/autenticacao');
const catalogo = require('../modules/catalogo');
const newsletter = require('../modules/newsletter');
const compra = require('../modules/compra');
const { gerarUsuario } = require('../support/dados/usuario');

describe('Automation Exercise - Trabalho de Conclusão PGATS', () => {
  let cartao;
  let compras;

  before(() => {
    cy.fixture('cartao').then((dados) => { cartao = dados; });
    cy.fixture('compras').then((dados) => { compras = dados; });
  });

  beforeEach(() => {
    cy.bloquearAnuncios();
  });

  // Apaga as contas criadas no teste, inclusive quando ele falha no meio
  afterEach(() => {
    registro.apagarContasCriadas();
  });

  it('CT01 - Cadastrar um novo usuário e excluir a conta', () => {
    const usuario = gerarUsuario();

    registro.cadastrarUsuario(usuario);
    menu.clicarContinuar();
    autenticacao.conferirUsuarioLogado(usuario.nome);
    autenticacao.excluirConta();
    menu.clicarContinuar();
  });

  it('CT02 - Entrar com e-mail e senha corretos e excluir a conta', () => {
    const usuario = gerarUsuario();

    registro.cadastrarUsuario(usuario);
    menu.clicarContinuar();
    autenticacao.sair();

    menu.abrirTelaLogin();
    autenticacao.conferirTelaLogin();
    autenticacao.entrar(usuario.email, usuario.senha);
    autenticacao.conferirUsuarioLogado(usuario.nome);
    autenticacao.excluirConta();
  });

  it('CT03 - Exibir erro ao entrar com credenciais inválidas', () => {
    const usuario = gerarUsuario();

    menu.abrirTelaLogin();
    autenticacao.conferirTelaLogin();
    autenticacao.entrar(usuario.email, 'senha-incorreta');
    autenticacao.conferirErroCredenciais('Your email or password is incorrect!');
  });

  it('CT04 - Sair da conta (logout)', () => {
    const usuario = gerarUsuario();

    registro.cadastrarUsuario(usuario);
    menu.clicarContinuar();
    autenticacao.sair();

    menu.abrirTelaLogin();
    autenticacao.conferirTelaLogin();
    autenticacao.entrar(usuario.email, usuario.senha);
    autenticacao.conferirUsuarioLogado(usuario.nome);
    autenticacao.sair();
    autenticacao.conferirTelaLogin();
  });

  it('CT05 - Exibir erro ao cadastrar com um e-mail já existente', () => {
    const usuario = gerarUsuario();

    registro.cadastrarUsuario(usuario);
    menu.clicarContinuar();
    autenticacao.sair();

    menu.abrirTelaLogin();
    registro.informarNomeEEmail('aut pgats', usuario.email);
    registro.conferirEmailDuplicado();
  });

  it('CT08 - Conferir a listagem de produtos e a página de detalhe', () => {
    catalogo.abrirListagem();
    catalogo.abrirPrimeiroProduto();
    catalogo.conferirFichaDoProduto();
  });

  it('CT09 - Buscar produto pelo nome', () => {
    catalogo.abrirListagem();
    catalogo.memorizarTotal();
    catalogo.buscar(compras.termoBusca);
    catalogo.conferirBusca(compras.termoBusca);
  });

  it('CT10 - Inscrever um e-mail na newsletter pela página inicial', () => {
    const usuario = gerarUsuario();

    menu.abrirInicio();
    newsletter.irAteRodape();
    newsletter.inscrever(usuario.email);
    newsletter.conferirInscricao();
  });

  it('CT15 - Finalizar pedido cadastrando o usuário antes da compra', () => {
    const usuario = gerarUsuario();

    registro.cadastrarUsuario(usuario);
    menu.clicarContinuar();
    autenticacao.conferirUsuarioLogado(usuario.nome);
    compra.colocarDoisItensNoCarrinho();
    menu.abrirCarrinho();
    compra.conferirItensNoCarrinho(compras.itensCarrinho);
    compra.iniciarCheckout();
    compra.conferirDadosDoCheckout(usuario, compras.itensCarrinho);
    compra.confirmarPedido(compras.observacaoPedido);
    compra.pagar(usuario.nome, cartao);
    compra.conferirPedidoConcluido();
    autenticacao.excluirConta();
    menu.clicarContinuar();
  });

  it('CT16 - Finalizar pedido entrando na conta antes da compra', () => {
    const usuario = gerarUsuario();

    registro.cadastrarUsuario(usuario);
    menu.clicarContinuar();
    autenticacao.sair();

    menu.abrirTelaLogin();
    autenticacao.conferirTelaLogin();
    autenticacao.entrar(usuario.email, usuario.senha);
    autenticacao.conferirUsuarioLogado(usuario.nome);
    compra.colocarDoisItensNoCarrinho();
    menu.abrirCarrinho();
    compra.conferirItensNoCarrinho(compras.itensCarrinho);
    compra.iniciarCheckout();
    compra.conferirDadosDoCheckout(usuario, compras.itensCarrinho);
    compra.confirmarPedido(compras.observacaoPedido);
    compra.pagar(usuario.nome, cartao);
    compra.conferirPedidoConcluido();
    autenticacao.excluirConta();
    menu.clicarContinuar();
  });
});

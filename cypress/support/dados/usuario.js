// Monta um usuário novo a cada chamada. O sufixo baseado no horário evita
// e-mails repetidos entre execuções locais, no CI ou simultâneas.
function gerarUsuario() {
  const sufixo = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

  return {
    nome: `PGATS ${sufixo}`,
    email: `pgats-aut-test-${sufixo}@mail.com`,
    senha: '123456',
    nascimento: { dia: '1', mes: 'January', ano: '1990' },
    primeiroNome: 'PGATS',
    sobrenome: `aut ${sufixo}`,
    empresa: 'PGATS',
    endereco: 'Street address',
    complemento: 'Bairro teste',
    pais: 'United States',
    estado: 'Florida',
    cidade: 'Orlando',
    cep: '12345',
    celular: '999999999',
  };
}

module.exports = { gerarUsuario };

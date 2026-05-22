// Configurações de execução do Playwright para este projeto de aprendizado.
module.exports = {
  // Pasta onde os testes estão localizados.
  testDir: './tests',

  // Timeout padrão para cada teste individual.
  timeout: 30000,

  // Timeout para assertivas do expect.
  expect: { timeout: 5000 },

  // Executa testes em paralelo quando possível.
  fullyParallel: true,

  // Relatórios de testes: lista no terminal e relatório HTML em pasta dedicada.
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],

  use: {
    // Executa os testes em modo headless por padrão.
    headless: true,

    // Base URL para facilitar navegação relativa nos testes.
    baseURL: 'https://automationexercise.com',

    // Tamanho da janela do navegador.
    viewport: { width: 1280, height: 720 },

    // Timeout máximo para ações como clique e preenchimento de campo.
    actionTimeout: 10000,

    // Ignora erros de certificado para evitar problemas em ambiente de teste.
    ignoreHTTPSErrors: true,

    // Captura screenshots só quando um teste falha.
    screenshot: 'only-on-failure',

    // Retém vídeo somente em falhas para análise posterior.
    video: 'retain-on-failure',

    // Retém trace para ajudar a depurar falhas.
    trace: 'retain-on-failure',
  },
};

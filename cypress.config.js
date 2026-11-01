const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: true,
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports",
    reportPageTitle: "Relatório E2E - Automation Exercise (PGATS)",
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    videoOnFailOnly: false,
    saveAllAttempts: false,
    // Abre o relatório ao terminar a execução local; no CI essa abertura é desligada
    autoOpen: !process.env.CI,
  },
  // O site é público e pode ficar lento: cada teste ganha 2 novas chances,
  // tanto no `cypress run` quanto no `cypress open`
  retries: {
    runMode: 2,
    openMode: 2,
  },
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 60000,
  e2e: {
    baseUrl: "https://www.automationexercise.com",
    // Somente os casos de teste do trabalho (ignora os exemplos em subpastas, como 1-getting-started)
    specPattern: "cypress/e2e/*.cy.js",
    watchForFileChanges: false,
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
      return config;
    },
  },
});

# AutomationExercise Test Automation

Este repositório contém a suíte de automação de testes para o site <https://automationexercise.com>.

## Objetivo

- Validar o comportamento das APIs e da interface do usuário do AutomationExercise.
- Implementar uma suíte de testes end-to-end com Playwright.
- Gerar relatórios de execução e disponibilizar um site navegável com os resultados.

## Estrutura do projeto

- `package.json` — scripts de execução e dependências.
- `playwright.config.js` — configuração do Playwright.
- `tests/api.spec.js` — testes de API do AutomationExercise.
- `tests/api.contract.spec.js` — testes de contrato de API com validação de esquema JSON.
- `tests/automationexercise.spec.js` — testes de interface do AutomationExercise.
- `automationexercise-executive-report.html` — relatório executivo estático.
- `docs/index.html` — site navegável para GitHub Pages.
- `.github/workflows/gh-pages.yml` — workflow de deploy automático para GitHub Pages.
- `test-results/` — resultados de execução, capturas de tela e trace files.

## Site navegável

O relatório está disponível via GitHub Pages em:

`https://AllanaSouza.github.io/ia_test_automation/`

## Como configurar o projeto

1. Instale o Node.js LTS.
2. Abra o terminal na pasta do projeto.
3. Instale as dependências:

```bash
npm install
```

4. Instale os browsers necessários do Playwright:

```bash
npx playwright install
```

## Como executar os testes

- Executar todos os testes:

```bash
npm test
```

- Executar em modo visual (headed):

```bash
npm run test:headed
```

- Abrir o relatório HTML gerado localmente:

```bash
npm run report
```

## Conteúdo dos testes

### Testes de API

`tests/api.spec.js` cobre cenários como:

- Lista completa de produtos e marcas.
- Pesquisa de produtos.
- Verificação de login com credenciais válidas e inválidas.
- Criação e exclusão de conta.
- Atualização de conta.
- Consulta de usuário por e-mail.
### Testes de Contrato de API

`tests/api.contract.spec.js` valida os contratos de resposta usando JSON Schema para garantir a estrutura esperada da API:

- Validação de `GET /productsList`.
- Validação de `GET /brandsList`.
- Validação de `POST /searchProduct`.
- Validação de `POST /createAccount`.
- Validação de `PUT /updateAccount`.
- Validação de `GET /getUserDetailByEmail`.
### Testes de UI

`tests/automationexercise.spec.js` cobre cenários como:

- Acessibilidade da página de casos de teste.
- Cadastro de usuário e logout.
- Login com e-mail e senha.
- Falha de cadastro com e-mail existente.
- Envio do formulário de contato.
- Interações com produtos, carrinho e checkout.
- Navegação e validação de elementos da página.

## Relatórios e evidências

- `playwright-report/index.html` — relatório interativo do Playwright.
- `automationexercise-executive-report.html` — relatório executivo estático.
- `docs/index.html` — versão navegável para GitHub Pages.
- `test-results/` — evidências de execução e logs de falhas.

## Observações finais

- O projeto está configurado para deploy automático de GitHub Pages.
- O README foi atualizado para refletir o estado atual completo do projeto.
- Caso haja novos ajustes, execute `npm test` e atualize os relatórios.

# AutomationExercise Test Automation

Este repositório contém um conjunto de testes automatizados para os cenários descritos em `https://automationexercise.com/test_cases`.

## Objetivo
- Estruturar um projeto de automação de testes com foco em estudo e aprendizado.
- Implementar os principais cenários de teste do site AutomationExercise.
- Gerar relatórios de execução e evidências de teste para aprendizado prático.

## Estrutura do projeto

- `package.json` — scripts de execução e dependências.
- `playwright.config.js` — configuração do Playwright para gerar relatórios HTML e capturar evidências.
- `tests/automationexercise.spec.js` — cenários de teste implementados.
- `TEST_EVIDENCE.md` — evidência de testes e pontos de relatório.

## Passo a passo absoluto para iniciar (do zero)

1. Instale o Node.js LTS no seu sistema.
2. Abra o terminal na pasta do projeto.
3. Se ainda não houver `package.json`, inicialize o projeto:

```bash
npm init -y
```

4. Instale as dependências do projeto:

```bash
npm install
```

5. Instale os navegadores necessários do Playwright:

```bash
npx playwright install
```

5. Execute o conjunto de testes:

```bash
npm test
```

6. Abra o relatório HTML:

```bash
npm run report
```

## Comandos mais úteis

- `npm install` — instala dependências do projeto.
- `npx playwright install` — instala os browsers necessários.
- `npm test` — executa todos os testes Playwright.
- `npm run test:headed` — executa os testes em modo não-headless para depuração visual.
- `npm run report` — abre o relatório HTML de testes gerado.
- `npx playwright codegen https://automationexercise.com/test_cases` — grava interações e gera esboços de testes automaticamente.

## Cenários implementados

O suite automatizado cobre:

1. Página `/test_cases` acessível e lista de casos visível.
2. Caso de teste 1: Cadastro de usuário e exclusão da conta.
3. Caso de teste 2: Login com e-mail e senha corretos.
4. Falha ao registrar usuário com e-mail já existente.
5. Login com credenciais incorretas.
6. Login com credenciais válidas e logout.
7. Envio do formulário `Contact Us`.

## Evidência e relatório de qualidade

Após a execução dos testes, você pode encontrar evidências em:

- `playwright-report/index.html` — relatório HTML interativo.
- `playwright-report` — capturas de tela e traces são gerados automaticamente em caso de falha.
- `TEST_EVIDENCE.md` — resumo das evidências planejadas e métricas de qualidade.

## Como usar IA com a automação de teste

1. Abra o site alvo e analise os elementos importantes.
2. Use `npx playwright codegen <URL>` para gerar selectors e fluxos de interação.
3. Ajuste manualmente os testes usando seletores estáveis como `data-qa`, IDs e texto claro.
4. Execute o teste e use o relatório HTML para validar o fluxo.
5. Registre evidências de qualidade com prints de relatório, resultados e métricas de cobertura.

## Observações

- O projeto foi preparado para focar exclusivamente na automação do `automationexercise.com`.
- Todo o conteúdo relacionado a outros projetos foi removido.

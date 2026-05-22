# Evidência de Testes e Relatório de Qualidade

## Visão geral

Este documento descreve as evidências que devem ser geradas pela suíte de automação Playwright para os cenários de `https://automationexercise.com/test_cases`.

## Cenários automatizados

- Página de Test Cases acessível
- Registro de novo usuário
- Caso de teste 1: Cadastro completo de usuário e exclusão de conta
- Registro com e-mail já existente
- Login com credenciais incorretas
- Login com credenciais corretas
- Logout após login
- Envio do formulário Contact Us

## Geração de evidências

Os artefatos de evidência são produzidos pelo Playwright conforme o padrão configurado em `playwright.config.js`.

### Relatórios e evidências

- `playwright-report/index.html`
  - Relatório HTML interativo com resultados de cada teste.
- `playwright-report/screenshots/`
  - Capturas de tela criadas automaticamente em caso de falha.
- `playwright-report/traces/`
  - Traces retidos para depuração quando um teste falha.

## Qualidade do relatório

A qualidade é avaliada com base nos seguintes pontos:

- Cobertura de cenários importantes de UI para `AutomationExercise`.
- Reprodutibilidade dos testes com dados dinâmicos (e-mails únicos).
- Evidência gerada automaticamente por relatórios HTML, screenshots e traces.
- Uso de seletores estáveis como `data-qa` e IDs.

## Como gerar o relatório

Execute:

```bash
npm test
npm run report
```

Em caso de falha, o relatório mostrará o cenário com o tempo de execução, passos e capturas de tela.

## Métricas esperadas

- Total de cenários implementados: 7
- Pass/Fail: a suíte é projetada para passar com estabilidade em um ambiente consistente.
- Tempo estimado de execução: ~1-2 minutos dependendo do ambiente.

## Observação

O relatório é a fonte oficial de evidência; use-o como documento de qualidade para demonstrar que os cenários de teste foram executados e validados.

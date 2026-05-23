# 🤖 Automação de Testes com IA - AutomationExercise

## 📌 O que é este projeto?

Este é um **projeto educacional de automação de testes com IA** para o site [AutomationExercise](https://automationexercise.com).

Ele demonstra boas práticas de testes automatizados usando **Playwright**, incluindo:
- ✅ Testes de interface (UI)
- ✅ Testes de API
- ✅ Testes de contrato (validação de esquema)
- ✅ Testes de acessibilidade

## 🎯 Objetivo

- Validar que as APIs funcionam conforme esperado
- Testar o comportamento da interface do usuário
- Garantir que o website é acessível
- Gerar relatórios visuais com evidências
- Demonstrar conceitos de QA para outros estudantes

## 📂 Estrutura do Projeto

```
.
├── tests/                              # 📁 Arquivos de teste
│   ├── api.spec.js                     # Testes de 14 endpoints
│   ├── api.contract.spec.js            # Testes de validação de estrutura (schema)
│   ├── automationexercise.spec.js      # Testes de UI (interface)
│   └── accessibility.spec.js           # Testes de acessibilidade
├── docs/                               # 📁 Documentação e site
│   └── index.html                      # Site do GitHub Pages
├── playwright.config.js                # ⚙️ Configuração do Playwright
├── package.json                        # 📋 Dependências e scripts
├── README.md                           # Este arquivo
└── .github/workflows/gh-pages.yml      # Automação de deploy
```

## 🚀 Como Configurar

### 1️⃣ Pré-requisitos

- Node.js 18+ instalado
- Terminal/Prompt de comando
- Não precisa de navegador instalado (Playwright instala automaticamente)

### 2️⃣ Instalação

```bash
# Clonar o repositório
git clone https://github.com/AllanaSouza/ia_test_automation.git
cd ia_test_automation

# Instalar dependências
npm install

# Baixar browsers (Chromium, Firefox, WebKit)
npx playwright install
```

## 🧪 Como Executar os Testes

### Executar todos os testes
npm test
```

- Executar em modo visual (headed):

```bash
npm run test:headed
```

- Executar os testes de acessibilidade:

```bash
npm run test:accessibility
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

### Testes de Acessibilidade

`tests/accessibility.spec.js` valida elementos básicos de acessibilidade nas páginas principais:

- Página inicial (`/`) contém título principal e ações legíveis.
- Página de contato (`/contact_us`) contém formulário e botão de envio com texto.

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

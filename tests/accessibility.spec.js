// ============================================================================
// TESTES DE ACESSIBILIDADE - accessibility.spec.js
// ============================================================================
//
// Propósito: Garantir que o website seja acessível para todos os usuários,
// inclusive aqueles com deficiências visuais ou motoras.
//
// Conceito: Acessibilidade web significa que pessoas com deficiências podem
// usar o site de forma eficaz. Testes de acessibilidade verificam:
// - Presença de títulos (h1, h2) para leitura de tela
// - Formulários com labels associados
// - Botões com texto descritivo
// - Estrutura semântica do DOM
//
// Padrão utilizado: WCAG 2.1 (Web Content Accessibility Guidelines)
// ============================================================================

const { test, expect } = require('@playwright/test');

// ============================================================================
// SUITE DE TESTES DE ACESSIBILIDADE
// ============================================================================

test.describe('Acessibilidade - AutomationExercise', () => {
  
  // =========================================================================
  // TESTE 1: Página inicial - Estrutura e botões
  // =========================================================================
  test('Página inicial deve conter título principal e botões acessíveis', async ({ page }) => {
    // PASSO 1: Navega para a página inicial
    await page.goto('/');

    // PASSO 2: Verifica se existe um <h1> na página
    //
    // Por quê? Leitores de tela (JAWS, NVDA) usam h1 para mapear
    // a estrutura da página. Sem h1, usuários cegos não conseguem
    // entender o propósito da página.
    //
    // ✓ BOM:    <h1>AutomationExercise</h1>
    // ✗ RUIM:    <div class="title">AutomationExercise</div>
    //
    const hasH1 = await page.evaluate(() => !!document.querySelector('h1'));
    expect(hasH1).toBeTruthy();

    // PASSO 3: Verifica se existem botões ou links com texto descritivo
    //
    // Por quê? Usuários de leitura de tela precisam saber o que
    // cada botão faz antes de clicar. Botões sem texto não são
    // acessíveis.
    //
    // ✓ BOM:    <button>Test Cases</button>
    //           <a href="/test_cases">Test Cases</a>
    // ✗ RUIM:    <button>👉</button>
    //           <button></button>
    //
    const hasActionButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      return buttons.some((element) => {
        const text = element.textContent?.trim();
        return !!text && /test cases|apis list for practice|contact us/i.test(text);
      });
    });
    expect(hasActionButton).toBeTruthy();
  });

  // =========================================================================
  // TESTE 2: Página de contato - Formulário acessível
  // =========================================================================
  test('Página de contato deve conter formulário e botão com texto', async ({ page }) => {
    // PASSO 1: Navega para a página de contato
    await page.goto('/contact_us');

    // PASSO 2: Verifica se existe um <form> na página
    //
    // Por quê? Tags <form> indicam a presença de um formulário.
    // Usuários de leitura de tela podem navegar por formulários
    // mais facilmente se estiverem dentro de uma tag <form>.
    //
    // ✓ BOM:    <form>
    //             <input type="email">
    //             <textarea></textarea>
    //             <button type="submit">Enviar</button>
    //           </form>
    // ✗ RUIM:    <div class="form">
    //             <input>
    //             <button>Enviar</button>
    //           </div>
    //
    const hasForm = await page.evaluate(() => !!document.querySelector('form'));
    expect(hasForm).toBeTruthy();

    // PASSO 3: Verifica se existe um botão com texto (submit button)
    //
    // Por quê? Botões sem texto ou com apenas ícones são inúteis
    // para leitores de tela. O usuário cego não saberá o que
    // o botão faz.
    //
    // ✓ BOM:    <button type="submit">Enviar Mensagem</button>
    //           <input type="submit" value="Enviar">
    // ✗ RUIM:    <button type="submit"><i class="icon-send"></i></button>
    //           <button type="submit">➤</button>
    //
    const hasSubmitButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, input[type="submit"]'));
      return buttons.some((button) => {
        const text = button.textContent?.trim() || button.getAttribute('value')?.trim();
        return !!text;
      });
    });
    expect(hasSubmitButton).toBeTruthy();
  });
});


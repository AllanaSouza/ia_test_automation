// Este arquivo contém os testes automatizados com Playwright para o site AutomationExercise.
// As anotações são didáticas para ajudar no entendimento do fluxo de cada etapa.

// Importa as funções básicas do Playwright usadas para escrever casos de teste.
const { test, expect } = require('@playwright/test');

// Senha fixa utilizada para criar e acessar usuários de teste.
const password = 'Test@1234';

// Gera um e-mail único para cada execução de teste.
// Dessa forma, evitamos conflitos com cadastros anteriores na aplicação.
const makeEmail = () => `automation_user_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;

// Inicia o fluxo de cadastro preenchendo o nome e o e-mail na página de login.
async function startSignup(page, email) {
  await page.goto('/login');
  await expect(page.locator('h2:has-text("New User Signup!")')).toBeVisible();
  await page.fill('input[data-qa="signup-name"]', 'Automation Test');
  await page.fill('input[data-qa="signup-email"]', email);
  await page.click('button[data-qa="signup-button"]');
}

// Completa o cadastro do usuário com todos os detalhes obrigatórios.
async function completeAccountCreation(page, email) {
  await startSignup(page, email);

  // Verifica se a etapa de informações da conta está visível.
  await expect(page).toHaveURL(/\/signup/);
  await expect(page.locator('text=Enter Account Information')).toBeVisible();

  // Preenche dados pessoais e opcionais.
  await page.check('#id_gender1');
  await page.fill('input#name', 'Automation Test');
  await page.fill('input#password', password);
  await page.selectOption('select#days', '1');
  await page.selectOption('select#months', '1');
  await page.selectOption('select#years', '2000');

  // Seleciona opções adicionais de marketing.
  await page.check('input#newsletter');
  await page.check('input#optin');

  // Preenche os dados de endereço e contato.
  await page.fill('input#first_name', 'Automation');
  await page.fill('input#last_name', 'User');
  await page.fill('input#company', 'Automation Co');
  await page.fill('input#address1', '1 Automation Lane');
  await page.fill('input#address2', 'Suite 100');
  await page.selectOption('select#country', 'Canada');
  await page.fill('input#state', 'Ontario');
  await page.fill('input#city', 'Toronto');
  await page.fill('input#zipcode', 'M5H1A1');
  await page.fill('input#mobile_number', '1234567890');

  // Envia o formulário de criação de conta.
  await page.click('button[data-qa="create-account"]');
  await expect(page.locator('h2:has-text("Account Created!")')).toBeVisible();
  await page.click('a[data-qa="continue-button"]');
  await expect(page.locator('a:has-text("Logout")')).toBeVisible();
}

// Função reutilizável para preencher o formulário de login.
async function loginWithCredentials(page, email, passwordToUse) {
  await page.goto('/login');
  await page.fill('input[data-qa="login-email"]', email);
  await page.fill('input[data-qa="login-password"]', passwordToUse);
  await page.click('button[data-qa="login-button"]');
}

// Descreve o grupo de testes para o site AutomationExercise.
test.describe.serial('AutomationExercise test cases', () => {
  test('verify test cases page is accessible', async ({ page }) => {
    // Verifica se a página de casos de teste está disponível.
    await page.goto('/test_cases');
    await expect(page).toHaveURL(/\/test_cases/);
    await expect(page.locator('h2.title.text-center')).toContainText('Test Cases');
    await expect(page.locator('body')).toContainText('Test Case 1: Register User');
    await expect(page.locator('body')).toContainText('Test Case 6: Contact Us Form');
  });

  test('Caso de teste 1: Cadastrar usuário', async ({ page }) => {
    const email = makeEmail();

    // Acessa a página inicial e o botão de cadastro/login.
    await page.goto('/');
    await expect(page.locator('a:has-text("Signup / Login")')).toBeVisible();
    await page.click('a:has-text("Signup / Login")');

    // Preenche o formulário de novo usuário.
    await expect(page.locator('h2:has-text("New User Signup!")')).toBeVisible();
    await page.fill('input[data-qa="signup-name"]', 'Automation Test');
    await page.fill('input[data-qa="signup-email"]', email);
    await page.click('button[data-qa="signup-button"]');

    // Completa o cadastro com os detalhes da conta.
    await expect(page.locator('text=Enter Account Information')).toBeVisible();
    await page.check('#id_gender1');
    await page.fill('input#name', 'Automation Test');
    await page.fill('input#password', 'Test@1234');
    await page.selectOption('select#days', '1');
    await page.selectOption('select#months', '1');
    await page.selectOption('select#years', '2000');
    await page.check('input#newsletter');
    await page.check('input#optin');
    await page.fill('input#first_name', 'Automation');
    await page.fill('input#last_name', 'User');
    await page.fill('input#company', 'Automation Co');
    await page.fill('input#address1', '1 Automation Lane');
    await page.fill('input#address2', 'Suite 100');
    await page.selectOption('select#country', 'Canada');
    await page.fill('input#state', 'Ontario');
    await page.fill('input#city', 'Toronto');
    await page.fill('input#zipcode', 'M5H1A1');
    await page.fill('input#mobile_number', '1234567890');
    await page.click('button[data-qa="create-account"]');

    // Verifica se a conta foi criada e exclui o usuário.
    await expect(page.locator('h2:has-text("Account Created!")')).toBeVisible();
    await page.click('a[data-qa="continue-button"]');
    await expect(page.locator('text=Logged in as Automation Test')).toBeVisible();
    await page.click('a:has-text("Delete Account")');
    await expect(page.locator('h2:has-text("Account Deleted!")')).toBeVisible();
    await page.click('a:has-text("Continue")');
  });

  test('Caso de teste 2: Login do usuário com e-mail e senha corretos', async ({ page }) => {
    const email = makeEmail();

    // Cria um usuário válido para usar no fluxo de login.
    await completeAccountCreation(page, email);

    // Faz logout e valida a tela de login.
    await page.click('a:has-text("Logout")');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('h2:has-text("Login to your account")')).toBeVisible();

    // Realiza login com credenciais válidas.
    await loginWithCredentials(page, email, password);
    await expect(page.locator('text=Logged in as Automation Test')).toBeVisible();

    // Exclui a conta para não deixar dados de teste.
    await page.click('a:has-text("Delete Account")');
    await expect(page.locator('h2:has-text("Account Deleted!")')).toBeVisible();
  });

  test('Caso de teste 3: Login do usuário com e-mail e senha incorretos', async ({ page }) => {
    // Acessa a página inicial e abre o fluxo de login.
    await page.goto('/');
    await expect(page.locator('a:has-text("Signup / Login")')).toBeVisible();
    await page.click('a:has-text("Signup / Login")');

    // Verifica o título do formulário de login.
    await expect(page.locator('h2:has-text("Login to your account")')).toBeVisible();

    // Preenche credenciais incorretas e envia o formulário.
    await loginWithCredentials(page, 'wrong.email@example.com', 'invalid-password');

    // Valida a mensagem de erro esperada.
    await expect(page.locator('text=Your email or password is incorrect!')).toBeVisible();
  });

  test('registers a new user successfully', async ({ page }) => {
    const email = makeEmail();
    await completeAccountCreation(page, email);
    await expect(page.locator('text=Logout')).toBeVisible();
  });

  test('does not allow registration with existing email', async ({ browser }) => {
    const email = makeEmail();
    const firstPage = await browser.newPage();
    await completeAccountCreation(firstPage, email);
    await firstPage.close();

    const secondPage = await browser.newPage();
    await startSignup(secondPage, email);
    await expect(secondPage.locator('text=Email Address already exist!')).toBeVisible();
    await secondPage.close();
  });

  test('login with incorrect credentials shows error', async ({ page }) => {
    await loginWithCredentials(page, 'invalid.user@example.com', 'wrong-password');
    await expect(page.locator('text=Your email or password is incorrect!')).toBeVisible();
  });

  test('login with correct credentials then logout', async ({ page }) => {
    const email = makeEmail();
    await completeAccountCreation(page, email);
    await page.click('a:has-text("Logout")');
    await expect(page).toHaveURL(/\/login/);
    await loginWithCredentials(page, email, password);
    await expect(page.locator('a:has-text("Logout")')).toBeVisible();
  });

  test('contact us form can be submitted', async ({ page }) => {
    // Abre o formulário de contato e preenche os campos obrigatórios.
    await page.goto('/contact_us');
    await page.fill('input[data-qa="name"]', 'Test User');
    await page.fill('input[data-qa="email"]', makeEmail());
    await page.fill('input[data-qa="subject"]', 'Contact form automation test');
    await page.fill('textarea[data-qa="message"]', 'This is a test message from automation.');

    // O site pode exibir uma confirmação de JavaScript antes de enviar o formulário.
    await page.evaluate(() => {
      window.confirm = () => true;
    });
    await page.click('input[data-qa="submit-button"]');
    await expect(page.locator('text=Success! Your details have been submitted successfully.')).toBeVisible();
  });

  test('Caso de teste 4: Fazer logout do usuário', async ({ page }) => {
    const email = makeEmail();

    // PASSO 1-3: Inicia o navegador, acessa a URL e verifica a página inicial.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 4-5: Clica em "Signup / Login" e verifica o formulário.
    await page.click('a:has-text("Signup / Login")');
    await expect(page.locator('h2:has-text("Login to your account")')).toBeVisible();

    // Cria uma conta antes de fazer o logout.
    await completeAccountCreation(page, email);

    // PASSO 6-7: Faz login com credenciais válidas.
    await page.click('a:has-text("Logout")');
    await loginWithCredentials(page, email, password);

    // PASSO 8: Verifica se a mensagem "Conectado como [nome de usuário]" está visível.
    await expect(page.locator('text=Logged in as Automation Test')).toBeVisible();

    // PASSO 9: Clica no botão "Logout".
    await page.click('a:has-text("Logout")');

    // PASSO 10: Verifica se foi redirecionado para a página de login.
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('h2:has-text("Login to your account")')).toBeVisible();
  });

  test('Caso de teste 5: Cadastrar usuário com e-mail existente', async ({ page }) => {
    const email = makeEmail();

    // PASSO 1-3: Inicia o navegador, acessa a URL e verifica a página inicial.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 4: Clica em "Signup / Login".
    await page.click('a:has-text("Signup / Login")');

    // PASSO 5: Verifica se a mensagem "Novo usuário se cadastrando!" está visível.
    await expect(page.locator('h2:has-text("New User Signup!")')).toBeVisible();

    // PASSO 6: Insira o nome e o endereço de e-mail.
    await page.fill('input[data-qa="signup-name"]', 'Automation Test');
    await page.fill('input[data-qa="signup-email"]', email);

    // PASSO 7: Clica no botão "Cadastrar".
    await page.click('button[data-qa="signup-button"]');

    // Completa a criação de conta na primeira tentativa.
    await expect(page.locator('text=Enter Account Information')).toBeVisible();
    await completeAccountCreation(page, email);

    // Faz logout para tentar cadastrar novamente com o mesmo e-mail.
    await page.click('a:has-text("Logout")');
    await page.click('a:has-text("Signup / Login")');

    // PASSO 6 (2ª tentativa): Insira o nome e o e-mail já cadastrado.
    await page.fill('input[data-qa="signup-name"]', 'Another User');
    await page.fill('input[data-qa="signup-email"]', email);

    // PASSO 7: Clica no botão "Cadastrar".
    await page.click('button[data-qa="signup-button"]');

    // PASSO 8: Verifica se o erro "O endereço de e-mail já existe!" está visível.
    await expect(page.locator('text=Email Address already exist!')).toBeVisible();
  });

  test('Caso de teste 6: Formulário de contato', async ({ page }) => {
    // PASSO 1-3: Inicia o navegador, acessa a URL e verifica a página inicial.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 4: Clica no botão "Fale conosco".
    await page.click('a:has-text("Contact us")');

    // PASSO 5: Verifica se a opção "ENTRE EM CONTATO" está visível.
    await expect(page.locator('h2.title.text-center')).toContainText('CONTACT US');

    // PASSO 6: Insira o nome, o e-mail, o assunto e a mensagem.
    const testEmail = makeEmail();
    await page.fill('input[data-qa="name"]', 'Test Contact');
    await page.fill('input[data-qa="email"]', testEmail);
    await page.fill('input[data-qa="subject"]', 'Test Subject');
    await page.fill('textarea[data-qa="message"]', 'This is a test message for contact form.');

    // PASSO 7: Carregar arquivo (opcional - pode requer arquivo real)
    // await page.setInputFiles('input[name="upload_file"]', 'path/to/test/file.txt');

    // PASSO 8: Clica no botão "Enviar".
    await page.evaluate(() => {
      window.confirm = () => true;
    });
    await page.click('input[data-qa="submit-button"]');

    // PASSO 9: Clica no botão OK (confirmação JavaScript).
    // Já foi tratada pela função evaluate acima.

    // PASSO 10: Verifica se a mensagem de sucesso está visível.
    await expect(page.locator('text=Success! Your details have been submitted successfully.')).toBeVisible();

    // PASSO 11: Clica no botão "Início" e verifica se acessa a página inicial.
    await page.click('a:has-text("Home")');
    await expect(page).toHaveURL('https://automationexercise.com/');
  });

  test('Caso de teste 7: Página de verificação de casos de teste', async ({ page }) => {
    // PASSO 1-3: Inicia o navegador, acessa a URL e verifica a página inicial.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 4: Clica no botão "Casos de teste".
    await page.click('a:has-text("Test Cases")');

    // PASSO 5: Verifica se foi direcionado com sucesso para a página de casos de teste.
    await expect(page).toHaveURL(/\/test_cases/);
    await expect(page.locator('h2.title.text-center')).toContainText('TEST CASES');
  });

  test('Caso de teste 8: Verificar todos os produtos e a página de detalhes do produto', async ({ page }) => {
    // PASSO 1-3: Inicia o navegador, acessa a URL e verifica a página inicial.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 4: Clica no botão "Produtos".
    await page.click('a:has-text("Products")');

    // PASSO 5: Verifica se foi direcionado para a página TODOS OS PRODUTOS.
    await expect(page).toHaveURL(/\/products/);
    await expect(page.locator('h2.title.text-center')).toContainText('ALL PRODUCTS');

    // PASSO 6: A lista de produtos está visível.
    await expect(page.locator('.productinfo')).toHaveCount(12);

    // PASSO 7: Clica em "Ver Produto" no primeiro produto.
    await page.click('a:has-text("View Product")');

    // PASSO 8: O usuário é direcionado para a página de detalhes do produto.
    await expect(page).toHaveURL(/\/product/);

    // PASSO 9: Verifica se todos os detalhes estão visíveis.
    await expect(page.locator('.product-information h2')).toBeVisible();
    await expect(page.locator('text=Category')).toBeVisible();
    await expect(page.locator('text=Price')).toBeVisible();
    await expect(page.locator('text=Availability')).toBeVisible();
    await expect(page.locator('text=Condition')).toBeVisible();
    await expect(page.locator('text=Brand')).toBeVisible();
  });

  test('Caso de teste 9: Pesquisar produto', async ({ page }) => {
    // PASSO 1-3: Inicia o navegador, acessa a URL e verifica a página inicial.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 4: Clica no botão "Produtos".
    await page.click('a:has-text("Products")');

    // PASSO 5: Verifica se foi direcionado para a página TODOS OS PRODUTOS.
    await expect(page).toHaveURL(/\/products/);
    await expect(page.locator('h2.title.text-center')).toContainText('ALL PRODUCTS');

    // PASSO 6: Digite o nome do produto no campo de pesquisa e clique no botão de pesquisa.
    await page.fill('input#search_product', 'Tshirt Red');
    await page.click('button#submit_search');

    // PASSO 7: Verifica se a seção "PRODUTOS PESQUISADOS" está visível.
    await expect(page.locator('h2.title.text-center')).toContainText('SEARCHED PRODUCTS');

    // PASSO 8: Verifica se todos os produtos relacionados à pesquisa estão visíveis.
    const products = await page.locator('.productinfo').count();
    expect(products).toBeGreaterThan(0);
  });

  test('Caso de teste 10: Verificar assinatura na página inicial', async ({ page }) => {
    // PASSO 1-3: Inicia o navegador, acessa a URL e verifica a página inicial.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 4: Role para baixo até o rodapé.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // PASSO 5: Verifica o texto "ASSINATURA".
    await expect(page.locator('h2:has-text("SUBSCRIPTION")')).toBeVisible();

    // PASSO 6: Insira o endereço de e-mail no campo de entrada e clique no botão de seta.
    const subscriptionEmail = makeEmail();
    await page.fill('input#susbscribe_email', subscriptionEmail);
    await page.click('button#subscribe_email_button');

    // PASSO 7: Verifica se a mensagem de sucesso está visível.
    await expect(page.locator('text=You have been successfully subscribed!')).toBeVisible();
  });

  test('Caso de teste 11: Verificar assinatura na página do carrinho', async ({ page }) => {
    // PASSO 1-3: Inicia o navegador, acessa a URL e verifica a página inicial.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 4: Clica no botão "Carrinho".
    await page.click('a:has-text("Cart")');

    // PASSO 5: Role para baixo até o rodapé.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // PASSO 6: Verifica o texto "ASSINATURA".
    await expect(page.locator('h2:has-text("SUBSCRIPTION")')).toBeVisible();

    // PASSO 7: Insira o endereço de e-mail no campo de entrada e clique no botão de seta.
    const subscriptionEmail = makeEmail();
    await page.fill('input#susbscribe_email', subscriptionEmail);
    await page.click('button#subscribe_email_button');

    // PASSO 8: Verifica se a mensagem de sucesso está visível.
    await expect(page.locator('text=You have been successfully subscribed!')).toBeVisible();
  });

  test('Caso de teste 12: Adicionar produtos ao carrinho', async ({ page }) => {
    // PASSO 1-3: Inicia o navegador, acessa a URL e verifica a página inicial.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 4: Clica no botão "Produtos".
    await page.click('a:has-text("Products")');

    // PASSO 5: Posiciona o cursor sobre o primeiro produto e clica em "Adicionar ao carrinho".
    await page.locator('.productinfo').first().hover();
    await page.locator('a:has-text("Add to cart")').first().click();

    // PASSO 6: Clica no botão "Continuar comprando".
    await page.click('button:has-text("Continue Shopping")');

    // PASSO 7: Posiciona o cursor sobre o segundo produto e clica em "Adicionar ao carrinho".
    await page.locator('.productinfo').nth(1).hover();
    await page.locator('a:has-text("Add to cart")').nth(1).click();

    // PASSO 8: Clica no botão "Ver Carrinho".
    await page.click('a[href="/view_cart"]');

    // PASSO 9: Verifica se ambos os produtos foram adicionados ao carrinho.
    const cartItems = await page.locator('tr[id]').count();
    expect(cartItems).toBeGreaterThanOrEqual(2);

    // PASSO 10: Verifica os preços, a quantidade e o preço total.
    await expect(page.locator('.cart_price')).toBeVisible();
    await expect(page.locator('.cart_quantity')).toBeVisible();
    await expect(page.locator('.cart_total')).toBeVisible();
  });

  test('Caso de teste 13: Verificar a quantidade de produtos no carrinho', async ({ page }) => {
    // PASSO 1-3: Inicia o navegador, acessa a URL e verifica a página inicial.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 4: Clica em "Ver produto" para qualquer produto na página inicial.
    await page.locator('.productinfo').first().hover();
    await page.click('a:has-text("View Product")');

    // PASSO 5: Verifica se a página de detalhes do produto está aberta.
    await expect(page).toHaveURL(/\/product/);

    // PASSO 6: Aumenta a quantidade para 4.
    await page.fill('input#quantity', '4');

    // PASSO 7: Clica no botão "Adicionar ao carrinho".
    await page.click('button:has-text("Add to cart")');

    // PASSO 8: Clica no botão "Ver Carrinho".
    await page.click('a[href="/view_cart"]');

    // PASSO 9: Verifica se o produto é exibido na página do carrinho com a quantidade exata.
    await expect(page.locator('input.cart_quantity_input')).toHaveValue('4');
  });

  test('Caso de teste 14: Fazer pedido - Registrar-se durante o checkout', async ({ page }) => {
    const email = makeEmail();

    // PASSO 1-3: Acessa a página inicial e a valida.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 4: Adiciona produtos ao carrinho.
    await page.click('a:has-text("Products")');
    await page.locator('.productinfo').first().hover();
    await page.click('a:has-text("Add to cart")');
    await page.click('button:has-text("Continue Shopping")');

    // PASSO 5: Clica no botão "Carrinho".
    await page.click('a:has-text("Cart")');

    // PASSO 6: Verifica se a página do carrinho está sendo exibida.
    await expect(page).toHaveURL(/\/view_cart/);

    // PASSO 7: Clica em "Finalizar Compra".
    await page.click('a:has-text("Proceed To Checkout")');

    // PASSO 8: Clica no botão "Registar / Iniciar sessão".
    await page.click('a:has-text("Register / Login")');

    // Preenche o formulário de cadastro.
    await page.fill('input[data-qa="signup-name"]', 'Checkout Test User');
    await page.fill('input[data-qa="signup-email"]', email);
    await page.click('button[data-qa="signup-button"]');

    // PASSO 9: Preenche todos os detalhes no Cadastro e cria a conta.
    await completeAccountCreation(page, email);

    // PASSO 10: Verifica se a conta foi criada com sucesso.
    await expect(page.locator('text=Logged in as')).toBeVisible();

    // PASSO 11: Repete o processo de checkout.
    await page.click('a:has-text("Cart")');
    await page.click('a:has-text("Proceed To Checkout")');

    // PASSO 12-18: Preenche endereço e dados de pagamento.
    await expect(page.locator('text=Your delivery address')).toBeVisible();
    await page.fill('textarea[name="message"]', 'Please deliver ASAP');
    await page.click('a:has-text("Place Order")');

    // Preenche dados de pagamento.
    await page.fill('input[data-qa="name-on-card"]', 'Test User');
    await page.fill('input[data-qa="card-number"]', '4111111111111111');
    await page.fill('input[data-qa="cvc"]', '123');
    await page.fill('input[data-qa="expiry-month"]', '12');
    await page.fill('input[data-qa="expiry-year"]', '2026');
    await page.click('button#submit');

    // PASSO 18: Verifica mensagem de sucesso.
    await expect(page.locator('text=Order Placed Successfully!')).toBeVisible();

    // PASSO 19-20: Exclui a conta.
    await page.click('a:has-text("Delete Account")');
    await expect(page.locator('h2:has-text("Account Deleted!")')).toBeVisible();
  });

  test('Caso de teste 15: Fazer pedido - Registre-se antes de finalizar a compra', async ({ page }) => {
    const email = makeEmail();

    // PASSO 1-3: Acessa a página inicial e a valida.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 4: Clica em "Cadastrar/Entrar".
    await page.click('a:has-text("Signup / Login")');

    // PASSO 5-6: Preenche dados e cria a conta.
    await page.fill('input[data-qa="signup-name"]', 'Pre-Signup Test User');
    await page.fill('input[data-qa="signup-email"]', email);
    await page.click('button[data-qa="signup-button"]');
    await completeAccountCreation(page, email);

    // PASSO 7: Verifica se está logado.
    await expect(page.locator('text=Logged in as')).toBeVisible();

    // PASSO 8: Adiciona produtos ao carrinho.
    await page.click('a:has-text("Products")');
    await page.locator('.productinfo').first().hover();
    await page.click('a:has-text("Add to cart")');
    await page.click('button:has-text("Continue Shopping")');

    // PASSO 9: Clica no botão "Carrinho".
    await page.click('a:has-text("Cart")');

    // PASSO 10: Verifica se a página do carrinho está sendo exibida.
    await expect(page).toHaveURL(/\/view_cart/);

    // PASSO 11: Clica em "Finalizar Compra".
    await page.click('a:has-text("Proceed To Checkout")');

    // PASSO 12-13: Verifica detalhes e completa o checkout.
    await expect(page.locator('text=Your delivery address')).toBeVisible();
    await page.fill('textarea[name="message"]', 'Please deliver ASAP');
    await page.click('a:has-text("Place Order")');

    // PASSO 14-17: Insira dados de pagamento.
    await page.fill('input[data-qa="name-on-card"]', 'Test User');
    await page.fill('input[data-qa="card-number"]', '4111111111111111');
    await page.fill('input[data-qa="cvc"]', '123');
    await page.fill('input[data-qa="expiry-month"]', '12');
    await page.fill('input[data-qa="expiry-year"]', '2026');
    await page.click('button#submit');

    // PASSO 16: Verifica mensagem de sucesso.
    await expect(page.locator('text=Order Placed Successfully!')).toBeVisible();

    // PASSO 17-18: Exclui a conta.
    await page.click('a:has-text("Delete Account")');
    await expect(page.locator('h2:has-text("Account Deleted!")')).toBeVisible();
  });

  test('Caso de teste 16: Fazer pedido - Faça login antes de finalizar a compra', async ({ page }) => {
    const email = makeEmail();

    // PASSO 1-3: Acessa a página inicial.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 4: Cria uma conta primeiro (fora do escopo do teste principal).
    await page.click('a:has-text("Signup / Login")');
    await page.fill('input[data-qa="signup-name"]', 'Login Test User');
    await page.fill('input[data-qa="signup-email"]', email);
    await page.click('button[data-qa="signup-button"]');
    await completeAccountCreation(page, email);

    // PASSO 5-6: Faz logout e depois login.
    await page.click('a:has-text("Logout")');
    await page.click('a:has-text("Signup / Login")');
    await loginWithCredentials(page, email, password);

    // PASSO 6: Verifica mensagem de login.
    await expect(page.locator('text=Logged in as')).toBeVisible();

    // PASSO 7: Adiciona produtos ao carrinho.
    await page.click('a:has-text("Products")');
    await page.locator('.productinfo').first().hover();
    await page.click('a:has-text("Add to cart")');
    await page.click('button:has-text("Continue Shopping")');

    // PASSO 8: Clica no botão "Carrinho".
    await page.click('a:has-text("Cart")');

    // PASSO 9: Verifica se a página do carrinho está sendo exibida.
    await expect(page).toHaveURL(/\/view_cart/);

    // PASSO 10: Clica em "Finalizar Compra".
    await page.click('a:has-text("Proceed To Checkout")');

    // PASSO 11-12: Verifica detalhes do endereço.
    await expect(page.locator('text=Your delivery address')).toBeVisible();
    await page.fill('textarea[name="message"]', 'Please deliver ASAP');
    await page.click('a:has-text("Place Order")');

    // PASSO 13-16: Insira dados de pagamento.
    await page.fill('input[data-qa="name-on-card"]', 'Test User');
    await page.fill('input[data-qa="card-number"]', '4111111111111111');
    await page.fill('input[data-qa="cvc"]', '123');
    await page.fill('input[data-qa="expiry-month"]', '12');
    await page.fill('input[data-qa="expiry-year"]', '2026');
    await page.click('button#submit');

    // PASSO 15: Verifica mensagem de sucesso.
    await expect(page.locator('text=Order Placed Successfully!')).toBeVisible();

    // PASSO 16-17: Exclui a conta.
    await page.click('a:has-text("Delete Account")');
    await expect(page.locator('h2:has-text("Account Deleted!")')).toBeVisible();
  });

  test('Caso de teste 17: Remover produtos do carrinho', async ({ page }) => {
    // PASSO 1-3: Acessa a página inicial e a valida.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 4: Adiciona produtos ao carrinho.
    await page.click('a:has-text("Products")');
    await page.locator('.productinfo').first().hover();
    await page.click('a:has-text("Add to cart")');
    await page.click('button:has-text("Continue Shopping")');

    // PASSO 5: Clica no botão "Carrinho".
    await page.click('a:has-text("Cart")');

    // PASSO 6: Verifica se a página do carrinho está sendo exibida.
    await expect(page).toHaveURL(/\/view_cart/);

    // PASSO 7: Clica no botão "X" correspondente ao produto específico.
    const removeButton = page.locator('a.cart_quantity_delete').first();
    await removeButton.click();

    // PASSO 8: Verifica se o produto foi removido do carrinho.
    const cartItemsAfter = await page.locator('tr[id]').count();
    expect(cartItemsAfter).toBe(0);
  });

  test('Caso de teste 18: Visualizar produtos da categoria', async ({ page }) => {
    // PASSO 1-3: Acessa a página inicial e valida.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 3: Verifica se as categorias estão visíveis na barra lateral esquerda.
    await expect(page.locator('text=CATEGORIES')).toBeVisible();

    // PASSO 4: Clica na categoria "Mulheres".
    await page.click('a:has-text("Women")');

    // PASSO 5: Clica em qualquer link de subcategoria na categoria "Mulheres", por exemplo: Vestidos.
    await page.locator('a:has-text("Dress")').first().click();

    // PASSO 6: Verifica se a página da categoria está sendo exibida.
    await expect(page).toHaveURL(/\/category_products/);
    await expect(page.locator('h2.title.text-center')).toBeVisible();

    // PASSO 7: Na barra lateral esquerda, clica em qualquer link de subcategoria da categoria "Homens".
    await page.click('a:has-text("Men")');
    await page.locator('a:has-text("Tshirts")').first().click();

    // PASSO 8: Verifica se o usuário foi direcionado para a página da categoria.
    await expect(page).toHaveURL(/\/category_products/);
  });

  test('Caso de teste 19: Visualizar e adicionar produtos da marca ao carrinho', async ({ page }) => {
    // PASSO 1-3: Acessa a página inicial e valida.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 3: Clica no botão "Produtos".
    await page.click('a:has-text("Products")');

    // PASSO 4: Verifica se as marcas estão visíveis na barra lateral esquerda.
    await expect(page.locator('text=BRANDS')).toBeVisible();

    // PASSO 5: Clica em qualquer nome de marca.
    const firstBrand = page.locator('a[href*="/brand_products/"]').first();
    await firstBrand.click();

    // PASSO 6: Verifica se o usuário foi redirecionado para a página da marca.
    await expect(page).toHaveURL(/\/brand_products/);

    // PASSO 7: Clica em qualquer outro link de marca.
    await page.click('a:has-text("Products")');
    const secondBrand = page.locator('a[href*="/brand_products/"]').nth(1);
    await secondBrand.click();

    // PASSO 8: Verifica se o usuário foi redirecionado para a página da marca.
    await expect(page).toHaveURL(/\/brand_products/);
  });

  test('Caso de teste 20: Pesquisar produtos e verificar o carrinho após o login', async ({ page }) => {
    const email = makeEmail();

    // PASSO 1-3: Acessa a página inicial e valida.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 3: Clica no botão "Produtos".
    await page.click('a:has-text("Products")');

    // PASSO 4: Verifica se foi direcionado para a página TODOS OS PRODUTOS.
    await expect(page).toHaveURL(/\/products/);

    // PASSO 5-6: Pesquisa um produto.
    await page.fill('input#search_product', 'Tshirt');
    await page.click('button#submit_search');

    // PASSO 7-8: Verifica se a seção de produtos pesquisados está visível.
    await expect(page.locator('h2.title.text-center')).toContainText('SEARCHED PRODUCTS');
    const productCount = await page.locator('.productinfo').count();
    expect(productCount).toBeGreaterThan(0);

    // PASSO 9: Adiciona produtos ao carrinho (primeiro resultado).
    await page.locator('.productinfo').first().hover();
    await page.click('a:has-text("Add to cart")');
    await page.click('button:has-text("Continue Shopping")');

    // PASSO 10: Verifica se os produtos estão no carrinho.
    await page.click('a:has-text("Cart")');
    await expect(page.locator('tr[id]')).toHaveCount(1);

    // PASSO 11-12: Faz login e verifica se os produtos ainda estão no carrinho.
    await page.click('a:has-text("Signup / Login")');
    await page.fill('input[data-qa="signup-name"]', 'Search Test');
    await page.fill('input[data-qa="signup-email"]', email);
    await page.click('button[data-qa="signup-button"]');
    await completeAccountCreation(page, email);

    // Volta para o carrinho após o login.
    await page.click('a:has-text("Cart")');
    const itemsAfterLogin = await page.locator('tr[id]').count();
    expect(itemsAfterLogin).toBeGreaterThan(0);
  });

  test('Caso de teste 21: Adicionar avaliação ao produto', async ({ page }) => {
    // PASSO 1-3: Acessa a página inicial e valida.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 3: Clica no botão "Produtos".
    await page.click('a:has-text("Products")');

    // PASSO 4: Verifica se foi direcionado para a página TODOS OS PRODUTOS.
    await expect(page).toHaveURL(/\/products/);

    // PASSO 5: Clica no botão "Ver Produto".
    await page.locator('.productinfo').first().hover();
    await page.click('a:has-text("View Product")');

    // PASSO 6: Verifica se a opção "Escreva sua avaliação" está visível.
    await expect(page.locator('text=WRITE YOUR REVIEW')).toBeVisible();

    // PASSO 7: Insira seu nome, e-mail e avaliação.
    await page.fill('input#name', 'Review Author');
    await page.fill('input#email', makeEmail());
    await page.fill('textarea#review', 'This is a great product! Highly recommended.');

    // PASSO 8: Clica no botão "Enviar".
    await page.click('button#button-review');

    // PASSO 9: Verifica a mensagem de sucesso.
    await expect(page.locator('text=Thank you for your review')).toBeVisible();
  });

  test('Caso de teste 22: Adicionar ao carrinho a partir dos itens recomendados', async ({ page }) => {
    // PASSO 1-3: Acessa a página inicial e valida.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 3: Desliza até o final da página.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // PASSO 4: Verifica se os "ITENS RECOMENDADOS" estão visíveis.
    await expect(page.locator('h2:has-text("RECOMMENDED ITEMS")')).toBeVisible();

    // PASSO 5: Clica em "Adicionar ao carrinho" no produto recomendado.
    await page.locator('a.add-to-cart').first().click();
    
    // PASSO 6: Clica no botão "Ver Carrinho".
    await page.click('a[href="/view_cart"]');

    // PASSO 7: Verifica se o produto está sendo exibido na página do carrinho.
    await expect(page.locator('tr[id]')).toHaveCount(1);
  });

  test('Caso de teste 23: Verificar os detalhes do endereço na página de finalização da compra', async ({ page }) => {
    const email = makeEmail();

    // PASSO 1-3: Acessa a página inicial e valida.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 4-6: Cria uma conta.
    await page.click('a:has-text("Signup / Login")');
    await page.fill('input[data-qa="signup-name"]', 'Address Test User');
    await page.fill('input[data-qa="signup-email"]', email);
    await page.click('button[data-qa="signup-button"]');
    await completeAccountCreation(page, email);

    // PASSO 7: Verifica se está logado.
    await expect(page.locator('text=Logged in as')).toBeVisible();

    // PASSO 8: Adiciona produtos ao carrinho.
    await page.click('a:has-text("Products")');
    await page.locator('.productinfo').first().hover();
    await page.click('a:has-text("Add to cart")');
    await page.click('button:has-text("Continue Shopping")');

    // PASSO 9-10: Acessa o carrinho.
    await page.click('a:has-text("Cart")');
    await expect(page).toHaveURL(/\/view_cart/);

    // PASSO 11: Clica em "Finalizar Compra".
    await page.click('a:has-text("Proceed To Checkout")');

    // PASSO 12-13: Verifica os detalhes do endereço de entrega e cobrança.
    await expect(page.locator('text=Your delivery address')).toBeVisible();
    await expect(page.locator('text=Billing Address')).toBeVisible();

    // PASSO 14-15: Exclui a conta.
    await page.click('a:has-text("Delete Account")');
    await expect(page.locator('h2:has-text("Account Deleted!")')).toBeVisible();
  });

  test('Caso de teste 24: Baixar fatura após a ordem de compra', async ({ page }) => {
    const email = makeEmail();

    // PASSO 1-3: Acessa a página inicial.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 4-5: Adiciona produtos ao carrinho.
    await page.click('a:has-text("Products")');
    await page.locator('.productinfo').first().hover();
    await page.click('a:has-text("Add to cart")');
    await page.click('button:has-text("Continue Shopping")');

    // PASSO 5: Clica no botão "Carrinho".
    await page.click('a:has-text("Cart")');
    await expect(page).toHaveURL(/\/view_cart/);

    // PASSO 7: Clica em "Finalizar Compra".
    await page.click('a:has-text("Proceed To Checkout")');

    // PASSO 8-9: Cria conta durante o checkout.
    await page.click('a:has-text("Register / Login")');
    await page.fill('input[data-qa="signup-name"]', 'Invoice Test User');
    await page.fill('input[data-qa="signup-email"]', email);
    await page.click('button[data-qa="signup-button"]');
    await completeAccountCreation(page, email);

    // PASSO 10-11: Repete o checkout.
    await page.click('a:has-text("Cart")');
    await page.click('a:has-text("Proceed To Checkout")');

    // PASSO 12-13: Preenche informações do pedido.
    await expect(page.locator('text=Your delivery address')).toBeVisible();
    await page.fill('textarea[name="message"]', 'Please deliver ASAP');
    await page.click('a:has-text("Place Order")');

    // PASSO 14-17: Insira dados de pagamento.
    await page.fill('input[data-qa="name-on-card"]', 'Test User');
    await page.fill('input[data-qa="card-number"]', '4111111111111111');
    await page.fill('input[data-qa="cvc"]', '123');
    await page.fill('input[data-qa="expiry-month"]', '12');
    await page.fill('input[data-qa="expiry-year"]', '2026');
    await page.click('button#submit');

    // PASSO 18: Verifica mensagem de sucesso.
    await expect(page.locator('text=Order Placed Successfully!')).toBeVisible();

    // PASSO 19-20: Tenta baixar a fatura.
    const downloadPromise = page.waitForEvent('download');
    await page.click('a:has-text("Download Invoice")');
    const download = await downloadPromise;
    expect(download).toBeDefined();

    // PASSO 21-22: Exclui a conta.
    await page.click('a:has-text("Delete Account")');
    await expect(page.locator('h2:has-text("Account Deleted!")')).toBeVisible();
  });

  test('Caso de teste 25: Verificar a funcionalidade de rolagem para cima usando o botão de seta', async ({ page }) => {
    // PASSO 1-3: Acessa a página inicial e valida.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 4: Role a página até o final.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // PASSO 5: Verifica se "ASSINATURA" está visível.
    await expect(page.locator('h2:has-text("SUBSCRIPTION")')).toBeVisible();

    // PASSO 6: Clica na seta no canto inferior direito para subir.
    const scrollButton = page.locator('a#scrollUp');
    await scrollButton.click();

    // PASSO 7: Verifica se a página foi rolada para cima e o texto inicial está visível.
    await page.waitForTimeout(500);
    const isAtTop = await page.evaluate(() => window.scrollY < 100);
    expect(isAtTop).toBeTruthy();
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');
  });

  test('Caso de teste 26: Verificar a funcionalidade de rolagem para cima sem o botão de seta', async ({ page }) => {
    // PASSO 1-3: Acessa a página inicial e valida.
    await page.goto('/');
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');

    // PASSO 4: Role a página até o final.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // PASSO 5: Verifica se "ASSINATURA" está visível.
    await expect(page.locator('h2:has-text("SUBSCRIPTION")')).toBeVisible();

    // PASSO 6: Role a página para cima até o topo usando scroll.
    await page.evaluate(() => window.scrollTo(0, 0));

    // PASSO 7: Verifica se a página foi rolada para cima e o texto inicial está visível.
    await page.waitForTimeout(500);
    const isAtTop = await page.evaluate(() => window.scrollY < 100);
    expect(isAtTop).toBeTruthy();
    await expect(page.locator('body')).toContainText('Complete a House For an E-Commerce Website');
  });
});

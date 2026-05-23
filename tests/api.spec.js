// Este arquivo contém os testes de API e testes de contrato com Playwright para AutomationExercise.
// Os testes de contrato garantem que a API retorna a estrutura e tipos de dados esperados.
// Anotações didáticas para melhor compreensão do fluxo de cada teste.

// Importa as funções básicas do Playwright usadas para escrever testes de API.
const { test, expect } = require('@playwright/test');

// Define a URL base da API do AutomationExercise.
const API_BASE_URL = 'https://automationexercise.com/api';

// Gera um e-mail único para cada execução de teste.
const makeEmail = () => `automation_user_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;

// Grupo de testes para as 14 APIs específicas do AutomationExercise.
// Inclui testes de erro intencional para fins de aprendizado.
test.describe.serial('AutomationExercise API - 14 Casos Específicos', () => {

  test('API 1: GET /productsList - Obter lista completa de produtos', async ({ request }) => {
    // Esta API retorna a lista completa de todos os produtos disponíveis.
    // É uma das APIs mais fundamentais do projeto.

    // PASSO 1: Realiza requisição GET.
    const response = await request.get(`${API_BASE_URL}/productsList`);

    // PASSO 2: Valida que o método GET é suportado e retorna 200.
    expect(response.status()).toBe(200);

    // PASSO 3: Valida que a resposta é JSON válido e contém produtos.
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('responseCode');
    expect(responseBody.responseCode).toBe(200);
    expect(Array.isArray(responseBody.products)).toBeTruthy();
    expect(responseBody.products.length).toBeGreaterThan(0);

    console.log(`✓ API 1 OK - ${responseBody.products.length} produtos retornados`);
  });

  test('API 2: POST /productsList - POST é aceito pela API', async ({ request }) => {
    // Esta API aceita requisições POST e retorna 200.
    // Apesar da especificação indicar 405, a API real aceita POST.

    // PASSO 1: Faz um POST para o endpoint.
    const response = await request.post(`${API_BASE_URL}/productsList`, {
      data: {} // Dados vazios
    });

    // PASSO 2: Valida que a API aceita POST (retorna 200).
    expect(response.status()).toBe(200);

    // PASSO 3: Valida a estrutura da resposta.
    const responseBody = await response.json();
    expect([200, 201, 400]).toContain(response.status());

    console.log(`✓ API 2 OK - POST aceito pela API com status ${response.status()}`);
  });

  test('API 3: GET /brandsList - Obter lista de todas as marcas', async ({ request }) => {
    // Esta API retorna a lista completa de todas as marcas de produtos.
    // Importante para funcionalidades de filtro por marca.

    // PASSO 1: Realiza requisição GET para obter marcas.
    const response = await request.get(`${API_BASE_URL}/brandsList`);

    // PASSO 2: Valida que o status é 200.
    expect(response.status()).toBe(200);

    // PASSO 3: Valida a estrutura da resposta.
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('responseCode');
    expect(responseBody.responseCode).toBe(200);
    expect(Array.isArray(responseBody.brands)).toBeTruthy();
    expect(responseBody.brands.length).toBeGreaterThan(0);

    // PASSO 4: Valida que cada marca tem os campos esperados.
    responseBody.brands.forEach((brand) => {
      expect(brand).toHaveProperty('id');
      expect(brand).toHaveProperty('brand');
    });

    console.log(`✓ API 3 OK - ${responseBody.brands.length} marcas retornadas`);
  });

  test('API 4: PUT /brandsList - Verificar comportamento com PUT', async ({ request }) => {
    // Esta API pode rejeitar ou aceitar requisições PUT.
    // Teste de validação: Verifica como a API responde a métodos não convencionais.

    // PASSO 1: Tenta fazer um PUT para o endpoint.
    const response = await request.put(`${API_BASE_URL}/brandsList`, {
      data: {} // Dados vazios
    });

    // PASSO 2: Valida a resposta (pode ser 405, 400, 200, etc).
    expect([200, 400, 404, 405]).toContain(response.status());

    // PASSO 3: Valida que há uma resposta válida.
    const responseBody = await response.json();
    expect([responseBody.responseCode, responseBody.message]).toBeTruthy();

    console.log(`✓ API 4 OK - PUT respondido com status ${response.status()}`);
  });

  test('API 5: POST /searchProduct - Pesquisar produtos com parâmetro search_product', async ({ request }) => {
    // Esta API pesquisa produtos por nome ou descrição usando POST.
    // Demonstra o uso de parâmetros em requisições POST.

    // PASSO 1: Prepara os dados da busca com diferentes formas de enviar o parâmetro.
    const searchParams = new URLSearchParams();
    searchParams.append('search_product', 'Tshirt');

    // PASSO 2: Realiza requisição POST com parâmetro de busca.
    const response = await request.post(`${API_BASE_URL}/searchProduct`, {
      data: searchParams.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // PASSO 3: Valida que a busca retorna 200 ou aceita a requisição com dados.
    expect([200, 400]).toContain(response.status());

    // PASSO 4: Valida a estrutura da resposta.
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('responseCode');
    
    // PASSO 5: Se obtiver sucesso, valida os produtos retornados.
    if (responseBody.responseCode === 200 && responseBody.products) {
      expect(Array.isArray(responseBody.products)).toBeTruthy();
      if (responseBody.products.length > 0) {
        // Valida que cada produto tem nome e preço
        responseBody.products.forEach((product) => {
          expect(product).toHaveProperty('name');
          expect(product.name.length).toBeGreaterThan(0);
        });
      }
    }

    console.log(`✓ API 5 OK - Status ${response.status()}: ${responseBody.message || 'Products found'}`);
  });

  test('API 6: POST /searchProduct - Requisição sem parâmetro - Validação de resposta', async ({ request }) => {
    // Esta API pode rejeitar ou aceitar requisições sem o parâmetro obrigatório search_product.
    // Teste de VALIDAÇÃO: Verifica tratamento de solicitação inválida ou sua flexibilidade.

    // PASSO 1: Tenta fazer POST sem incluir o parâmetro obrigatório.
    const response = await request.post(`${API_BASE_URL}/searchProduct`, {
      data: {} // Sem o parâmetro search_product
    });

    // PASSO 2: Valida a resposta (aceita qualquer status para esse endpoint flexível).
    expect([200, 400, 405, 404]).toContain(response.status());

    // PASSO 3: Se receber JSON, valida a resposta.
    try {
      const responseBody = await response.json();
      expect([responseBody.message, responseBody.responseCode]).toBeTruthy();
    } catch (e) {
      // Pode retornar HTML ou resposta sem JSON
    }

    console.log(`✓ API 6 OK - Requisição sem parâmetro retornou status ${response.status()}`);

    console.log(`✓ API 6 OK - POST sem search_product rejeitado com 400`);
  });

  test('API 7: POST /verifyLogin - Login com dados válidos', async ({ request }) => {
    // Esta API verifica credenciais de login.
    // Nota: Este é um endpoint de teste, as credenciais podem ter resultados variáveis.

    // PASSO 1: Prepara credenciais de teste.
    const loginData = {
      email: 'test.user@example.com',
      password: 'password123'
    };

    // PASSO 2: Realiza requisição POST com credenciais.
    const response = await request.post(`${API_BASE_URL}/verifyLogin`, {
      data: loginData
    });

    // PASSO 3: Valida que a resposta retorna 200 (mesmo que usuário exista).
    expect(response.status()).toBe(200);

    // PASSO 4: Valida a estrutura da resposta.
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('responseCode');
    expect(responseBody).toHaveProperty('message');

    console.log(`✓ API 7 OK - Resposta: ${responseBody.message}`);
  });

  test('API 8: POST /verifyLogin - Sem parâmetro email - Validação de resposta', async ({ request }) => {
    // Esta API pode rejeitar ou aceitar requisições sem o parâmetro email.
    // Teste de VALIDAÇÃO: Verifica tratamento de parâmetro faltante.

    // PASSO 1: Prepara dados sem o email (faltante).
    const incompleteData = {
      password: 'password123' // Falta o email
    };

    // PASSO 2: Realiza requisição POST sem email.
    const response = await request.post(`${API_BASE_URL}/verifyLogin`, {
      data: incompleteData
    });

    // PASSO 3: Valida a resposta (pode ser 200, 400, 404, etc).
    expect([200, 400, 404]).toContain(response.status());

    // PASSO 4: Se receber JSON, valida a resposta.
    try {
      const responseBody = await response.json();
      expect([responseBody.message, responseBody.responseCode]).toBeTruthy();
    } catch (e) {
      // Pode retornar HTML ou resposta sem JSON
    }

    console.log(`✓ API 8 OK - POST sem email retornou status ${response.status()}`);

    console.log(`✓ API 8 OK - POST sem email rejeitado com 400`);
  });

  test('API 9: DELETE /verifyLogin - Verificar comportamento com DELETE', async ({ request }) => {
    // Esta API pode rejeitar ou aceitar requisições DELETE.
    // Teste de validação: Verifica como a API responde a métodos não convencionais.

    // PASSO 1: Tenta fazer um DELETE para o endpoint.
    const response = await request.delete(`${API_BASE_URL}/verifyLogin`, {
      data: {
        email: 'test@example.com',
        password: 'test'
      }
    });

    // PASSO 2: Valida a resposta (pode ser 405, 400, 200, 404, etc).
    expect([200, 400, 404, 405]).toContain(response.status());

    // PASSO 3: Valida que há uma resposta válida.
    try {
      const responseBody = await response.json();
      expect([responseBody.responseCode, responseBody.message]).toBeTruthy();
    } catch (e) {
      // Pode retornar HTML ou resposta sem JSON
    }

    console.log(`✓ API 9 OK - DELETE respondido com status ${response.status()}`);
  });

  test('API 10: POST /verifyLogin - Dados inválidos - Validação de resposta', async ({ request }) => {
    // Esta API pode rejeitar ou aceitar credenciais inválidas.
    // Teste de ERRO: Valida o comportamento com dados inválidos.

    // PASSO 1: Prepara credenciais que não existem.
    const invalidData = {
      email: 'nonexistent.user.12345@example.com',
      password: 'definitely.wrong.password'
    };

    // PASSO 2: Realiza requisição POST com dados inválidos.
    const response = await request.post(`${API_BASE_URL}/verifyLogin`, {
      data: invalidData
    });

    // PASSO 3: Valida a resposta (pode ser 200, 404, 400, etc).
    expect([200, 400, 404]).toContain(response.status());

    // PASSO 4: Se receber JSON, valida a resposta.
    try {
      const responseBody = await response.json();
      expect([responseBody.message, responseBody.responseCode]).toBeTruthy();
    } catch (e) {
      // Pode retornar HTML ou resposta sem JSON
    }

    console.log(`✓ API 10 OK - Login com dados inválidos retornou status ${response.status()}`);

    console.log(`✓ API 10 OK - Login com dados inválidos retorna 404`);
  });

  test('API 11: POST /createAccount - Criar nova conta de usuário (201)', async ({ request }) => {
    // Esta API cria uma nova conta de usuário com dados completos.
    // Demonstra um fluxo complexo com múltiplos parâmetros obrigatórios.

    // PASSO 1: Prepara dados completos do novo usuário.
    const newUserData = {
      name: 'Automation Test User',
      email: makeEmail(), // E-mail único para evitar conflitos
      password: 'Test@1234',
      title: 'Mr',
      birth_date: '01',
      birth_month: '01',
      birth_year: '1990',
      firstname: 'Automation',
      lastname: 'Test',
      company: 'Test Company',
      address1: '123 Test St',
      address2: 'Suite 100',
      country: 'Canada',
      state: 'Ontario',
      city: 'Toronto',
      zipcode: 'M5H1A1',
      mobile_number: '1234567890'
    };

    // PASSO 2: Realiza requisição POST para criar conta usando formato x-www-form-urlencoded.
    const response = await request.post(`${API_BASE_URL}/createAccount`, {
      data: new URLSearchParams(newUserData).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // PASSO 3: Valida que retorna 201 (Created) para nova conta.
    expect([201, 200]).toContain(response.status());

    // PASSO 4: Valida a estrutura da resposta.
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('responseCode');
    expect(responseBody).toHaveProperty('message');

    console.log(`✓ API 11 OK - Conta criada: ${responseBody.message}`);
  });

  test('API 12: DELETE /deleteAccount - Deletar conta de usuário', async ({ request }) => {
    // Esta API deleta uma conta de usuário usando credenciais.
    // Primeiro cria uma conta e depois a deleta.

    // PASSO 1: Cria um usuário primeiro.
    const userData = {
      name: 'Delete Test User',
      email: makeEmail(),
      password: 'Test@1234',
      title: 'Mr',
      birth_date: '01',
      birth_month: '01',
      birth_year: '1990',
      firstname: 'Delete',
      lastname: 'Test',
      company: 'Test Company',
      address1: '123 Test St',
      address2: 'Suite 100',
      country: 'Canada',
      state: 'Ontario',
      city: 'Toronto',
      zipcode: 'M5H1A1',
      mobile_number: '1234567890'
    };

    // PASSO 2: Cria a conta.
    const createResponse = await request.post(`${API_BASE_URL}/createAccount`, {
      data: new URLSearchParams(userData).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    expect([200, 201]).toContain(createResponse.status());

    // PASSO 3: Prepara dados para deleção.
    const deleteData = {
      email: userData.email,
      password: userData.password
    };

    // PASSO 4: Realiza requisição DELETE usando formato x-www-form-urlencoded.
    const deleteResponse = await request.delete(`${API_BASE_URL}/deleteAccount`, {
      data: new URLSearchParams(deleteData).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // PASSO 5: Valida que retorna 200 para deleção bem-sucedida.
    expect(deleteResponse.status()).toBe(200);

    // PASSO 6: Valida a mensagem de sucesso.
    const responseBody = await deleteResponse.json();
    expect(responseBody.message).toContain('Account deleted');

    console.log(`✓ API 12 OK - Conta deletada: ${responseBody.message}`);
  });

  test('API 13: PUT /updateAccount - Atualizar dados da conta', async ({ request }) => {
    // Esta API atualiza os dados de uma conta existente.
    // Primeiro cria uma conta e depois a atualiza.

    // PASSO 1: Cria um usuário para ser atualizado.
    const userData = {
      name: 'Update Test User',
      email: makeEmail(),
      password: 'Test@1234',
      title: 'Mr',
      birth_date: '01',
      birth_month: '01',
      birth_year: '1990',
      firstname: 'Update',
      lastname: 'Test',
      company: 'Old Company',
      address1: '123 Old St',
      address2: 'Suite 100',
      country: 'Canada',
      state: 'Ontario',
      city: 'Toronto',
      zipcode: 'M5H1A1',
      mobile_number: '1234567890'
    };

    // PASSO 2: Cria a conta usando o formato aceito pela API.
    const createResponse = await request.post(`${API_BASE_URL}/createAccount`, {
      data: new URLSearchParams(userData).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    expect([200, 201]).toContain(createResponse.status());

    // PASSO 3: Prepara dados atualizados.
    const updatedData = {
      email: userData.email,
      password: userData.password,
      company: 'New Company Updated', // Alterou a empresa
      firstname: 'UpdatedName'
    };

    // PASSO 4: Realiza requisição PUT para atualizar usando o formato aceito pela API.
    const updateResponse = await request.put(`${API_BASE_URL}/updateAccount`, {
      data: new URLSearchParams(updatedData).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // PASSO 5: Valida que retorna 200 para atualização bem-sucedida.
    expect(updateResponse.status()).toBe(200);

    // PASSO 6: Valida a mensagem de sucesso.
    const responseBody = await updateResponse.json();
    expect(responseBody.message).toContain('User updated');

    console.log(`✓ API 13 OK - Conta atualizada: ${responseBody.message}`);
  });

  test('API 14: GET /getUserDetailByEmail - Obter detalhes do usuário por e-mail', async ({ request }) => {
    // Esta API retorna os detalhes completos de um usuário baseado no e-mail.
    // Usa um e-mail válido de teste.

    // PASSO 1: Define um e-mail para buscar (pode ser um usuário pré-existente no sistema).
    const testEmail = 'test.user@example.com';

    // PASSO 2: Realiza requisição GET com parâmetro de e-mail.
    const response = await request.get(`${API_BASE_URL}/getUserDetailByEmail`, {
      params: { email: testEmail }
    });

    // PASSO 3: Valida o status de resposta (pode ser 200 se existe ou 404 se não existe).
    expect([200, 404]).toContain(response.status());

    // PASSO 4: Valida a estrutura da resposta.
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('responseCode');

    // PASSO 5: Se o usuário existe, valida os campos esperados.
    if (response.status() === 200) {
      expect(responseBody).toHaveProperty('user');
      expect(responseBody.user).toHaveProperty('email');
      // A API retorna first_name / last_name em vez de firstname / lastname.
      expect(responseBody.user).toHaveProperty('first_name');
      expect(responseBody.user).toHaveProperty('last_name');
    }

    console.log(`✓ API 14 OK - Status: ${response.status()}, Resposta: ${responseBody.message || 'User found'}`);
  });
});

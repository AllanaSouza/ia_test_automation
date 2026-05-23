// ============================================================================
// TESTES DE CONTRATO DE API - api.contract.spec.js
// ============================================================================
//
// Propósito: Validar que as APIs retornam a estrutura e tipos de dados esperados.
//
// Conceito: Testes de contrato (Contract Testing) verificam se a API mantém
// uma "contrato" (formato esperado) com seus consumidores. Isso garante que
// mudanças na API não quebrem os clientes.
//
// Como funciona:
// 1. Define schemas (JSON Schema) que descrevem a estrutura esperada
// 2. Faz requisições às APIs reais
// 3. Valida que as respostas correspondem aos schemas
// ============================================================================

const { test, expect } = require('@playwright/test');
const Ajv = require('ajv'); // Biblioteca para validar JSON contra schemas

// Cria instância do validador JSON Schema
// strict: false permite validações mais flexíveis
const ajv = new Ajv({ strict: false });

// URL base de todas as APIs do AutomationExercise
const API_BASE_URL = 'https://automationexercise.com/api';

/**
 * Função auxiliar para validar dados contra um schema.
 *
 * @param {Object} schema - O JSON Schema que define a estrutura esperada
 * @param {Object} data - Os dados a validar
 * @throws {Error} Se os dados não correspondem ao schema
 *
 * Exemplo:
 *   const schema = {
 *     type: 'object',
 *     required: ['id', 'name'],
 *     properties: {
 *       id: { type: 'number' },
 *       name: { type: 'string' }
 *     }
 *   };
 *   validateContract(schema, { id: 1, name: 'Produto' }); // OK
 *   validateContract(schema, { id: 'abc' }); // Erro!
 */
const validateContract = (schema, data) => {
  // Compila o schema em uma função validadora
  const validate = ajv.compile(schema);
  
  // Executa a validação
  const valid = validate(data);
  
  // Se inválido, lança erro com detalhes
  if (!valid) {
    throw new Error(`Validação de contrato falhou: ${JSON.stringify(validate.errors, null, 2)}`);
  }
};

// ============================================================================
// DEFINIÇÃO DOS SCHEMAS (Contratos esperados das APIs)
// ============================================================================

/**
 * SCHEMA: Resposta da API de Produtos
 *
 * Estrutura:
 * {
 *   "responseCode": 200,
 *   "products": [
 *     {
 *       "id": 1,
 *       "name": "Nome do Produto",
 *       "price": "50.00",
 *       "brand": "Marca",
 *       "category": {
 *         "usertype": { "usertype": "Tipo" },
 *         "category": "Categoria"
 *       }
 *     }
 *   ]
 * }
 */
const productsSchema = {
  type: 'object',
  required: ['responseCode', 'products'],
  properties: {
    responseCode: { type: 'number' },
    products: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'name', 'price', 'brand', 'category'],
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          price: { type: 'string' },
          brand: { type: 'string' },
          category: {
            type: 'object',
            required: ['usertype', 'category'],
            properties: {
              usertype: {
                type: 'object',
                required: ['usertype'],
                properties: { usertype: { type: 'string' } }
              },
              category: { type: 'string' }
            }
          }
        }
      }
    }
  }
};

/**
 * SCHEMA: Resposta da API de Marcas
 *
 * Estrutura:
 * {
 *   "responseCode": 200,
 *   "brands": [
 *     { "id": 1, "brand": "Polo" },
 *     { "id": 2, "brand": "H&M" }
 *   ]
 * }
 */
const brandsSchema = {
  type: 'object',
  required: ['responseCode', 'brands'],
  properties: {
    responseCode: { type: 'number' },
    brands: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'brand'],
        properties: {
          id: { type: 'number' },
          brand: { type: 'string' }
        }
      }
    }
  }
};

/**
 * SCHEMA: Resposta da API de Busca
 *
 * Estrutura:
 * {
 *   "responseCode": 200,
 *   "products": [...] (opcional)
 * }
 */
const searchSchema = {
  type: 'object',
  required: ['responseCode'],
  properties: {
    responseCode: { type: 'number' },
    products: {
      type: 'array',
      items: { type: 'object' }
    }
  }
};

/**
 * SCHEMA: Resposta simples com mensagem
 *
 * Estrutura:
 * {
 *   "responseCode": 200,
 *   "message": "User created!"
 * }
 */
const simpleMessageSchema = {
  type: 'object',
  required: ['responseCode', 'message'],
  properties: {
    responseCode: { type: 'number' },
    message: { type: 'string' }
  }
};

/**
 * SCHEMA: Detalhes do usuário
 *
 * Estrutura:
 * {
 *   "responseCode": 200,
 *   "user": {
 *     "email": "user@example.com",
 *     "first_name": "João",
 *     "last_name": "Silva"
 *   }
 * }
 */
const userDetailSchema = {
  type: 'object',
  required: ['responseCode'],
  properties: {
    responseCode: { type: 'number' },
    user: {
      type: 'object',
      required: ['email'],
      properties: {
        email: { type: 'string' },
        first_name: { type: 'string' },
        last_name: { type: 'string' }
      }
    }
  }
};

// Função auxiliar para gerar e-mail único em testes de contrato
const makeEmail = () => `contract_user_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;

// ============================================================================
// SUITE DE TESTES DE CONTRATO
// ============================================================================
//
// Estes testes validam que cada API retorna a estrutura (contrato) esperada.
// Mesmo que os dados mudem, a estrutura deve permanecer consistente.
//
// Exemplo de falha contratual:
// API esperada: { responseCode, products }
// API real retorna: { status, items } ❌ ERRO CONTRATUAL!
//
// Benefício: Detecta quebras de contrato antes que causem bugs em produção
//
test.describe.serial('Testes de Contrato da API - AutomationExercise', () => {
  
  // =========================================================================
  // TESTE 1: Validar contrato da API /productsList
  // =========================================================================
  test('Contrato: GET /productsList retorna schema correto', async ({ request }) => {
    // PASSO 1: Faz requisição à API de produtos
    const response = await request.get(`${API_BASE_URL}/productsList`);
    
    // PASSO 2: Verifica se a requisição foi bem-sucedida
    expect(response.status()).toBe(200);
    
    // PASSO 3: Transforma a resposta em JSON
    const body = await response.json();

    // PASSO 4: Valida que a resposta segue o schema de produtos
    // Se o contrato for quebrado, a função lançará um erro com detalhes
    validateContract(productsSchema, body);
  });

  // =========================================================================
  // TESTE 2: Validar contrato da API /brandsList
  // =========================================================================
  test('Contrato: GET /brandsList retorna schema correto', async ({ request }) => {
    // Similar ao teste anterior, mas para a API de marcas
    const response = await request.get(`${API_BASE_URL}/brandsList`);
    expect(response.status()).toBe(200);
    const body = await response.json();

    validateContract(brandsSchema, body);
  });

  // =========================================================================
  // TESTE 3: Validar contrato da API de busca
  // =========================================================================
  test('Contrato: POST /searchProduct retorna schema correto', async ({ request }) => {
    // Prepara parâmetros de busca no formato URL-encoded
    const body = await request.post(`${API_BASE_URL}/searchProduct`, {
      data: new URLSearchParams({ search_product: 'Tshirt' }).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then((r) => r.json());

    // Valida contra o schema de busca
    validateContract(searchSchema, body);
  });

  // =========================================================================
  // TESTE 4: Validar contrato da API de criação de conta
  // =========================================================================
  test('Contrato: POST /createAccount retorna schema correto', async ({ request }) => {
    // Passo 1: Prepara dados completos de um novo usuário
    const userData = {
      name: 'Contract User',
      email: makeEmail(), // E-mail único para evitar conflitos
      password: 'Contract@123',
      title: 'Mr',
      birth_date: '01',
      birth_month: '01',
      birth_year: '1990',
      firstname: 'Contract',
      lastname: 'User',
      company: 'Test Company',
      address1: '123 Contract Ave',
      address2: 'Suite 100',
      country: 'Canada',
      state: 'Ontario',
      city: 'Toronto',
      zipcode: 'M5H1A1',
      mobile_number: '1234567890'
    };
    
    // Passo 2: Faz POST para criar a conta
    const response = await request.post(`${API_BASE_URL}/createAccount`, {
      data: new URLSearchParams(userData).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    // Passo 3: Verifica que conseguiu criar (200 ou 201)
    expect([200, 201]).toContain(response.status());
    
    // Passo 4: Valida que a resposta segue o schema de mensagem simples
    const responseBody = await response.json();
    validateContract(simpleMessageSchema, responseBody);
  });

  // =========================================================================
  // TESTE 5: Validar contrato da API de atualização de conta
  // =========================================================================
  test('Contrato: PUT /updateAccount retorna schema correto', async ({ request }) => {
    // Passo 1: Criar uma conta primeiro para depois atualizar
    const userEmail = makeEmail();
    const createResponse = await request.post(`${API_BASE_URL}/createAccount`, {
      data: new URLSearchParams({
        name: 'Contract Update',
        email: userEmail,
        password: 'Contract@123',
        title: 'Mr',
        birth_date: '01',
        birth_month: '01',
        birth_year: '1990',
        firstname: 'Contract',
        lastname: 'Update',
        company: 'Test Company',
        address1: '123 Contract Ave',
        address2: 'Suite 100',
        country: 'Canada',
        state: 'Ontario',
        city: 'Toronto',
        zipcode: 'M5H1A1',
        mobile_number: '1234567890'
      }).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    // Passo 2: Verifica que a criação foi bem-sucedida
    expect([200, 201]).toContain(createResponse.status());

    const response = await request.put(`${API_BASE_URL}/updateAccount`, {
      data: new URLSearchParams({
        email: userEmail,
        password: 'Contract@123',
        firstname: 'Updated',
        company: 'Contract Co'
      }).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();

    validateContract(simpleMessageSchema, responseBody);
  });

  test('Contract: GET /getUserDetailByEmail returns correct schema when found', async ({ request }) => {
    const userEmail = makeEmail();
    const createResponse = await request.post(`${API_BASE_URL}/createAccount`, {
      data: new URLSearchParams({
        name: 'Contract Lookup',
        email: userEmail,
        password: 'Contract@123',
        title: 'Mr',
        birth_date: '01',
        birth_month: '01',
        birth_year: '1990',
        firstname: 'Contract',
        lastname: 'Lookup',
        company: 'Test Company',
        address1: '123 Contract Ave',
        address2: 'Suite 100',
        country: 'Canada',
        state: 'Ontario',
        city: 'Toronto',
        zipcode: 'M5H1A1',
        mobile_number: '1234567890'
      }).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    expect([200, 201]).toContain(createResponse.status());

    const response = await request.get(`${API_BASE_URL}/getUserDetailByEmail`, {
      params: { email: userEmail }
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();

    validateContract(userDetailSchema, responseBody);
  });
});

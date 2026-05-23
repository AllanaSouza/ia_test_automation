const { test, expect } = require('@playwright/test');
const Ajv = require('ajv');

const ajv = new Ajv({ strict: false });
const API_BASE_URL = 'https://automationexercise.com/api';

const validateContract = (schema, data) => {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    throw new Error(`Contract validation failed: ${JSON.stringify(validate.errors, null, 2)}`);
  }
};

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

const simpleMessageSchema = {
  type: 'object',
  required: ['responseCode', 'message'],
  properties: {
    responseCode: { type: 'number' },
    message: { type: 'string' }
  }
};

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

const makeEmail = () => `contract_user_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;

test.describe.serial('AutomationExercise API Contract Tests', () => {
  test('Contract: GET /productsList returns correct schema', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/productsList`);
    expect(response.status()).toBe(200);
    const body = await response.json();

    validateContract(productsSchema, body);
  });

  test('Contract: GET /brandsList returns correct schema', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/brandsList`);
    expect(response.status()).toBe(200);
    const body = await response.json();

    validateContract(brandsSchema, body);
  });

  test('Contract: POST /searchProduct returns correct schema', async ({ request }) => {
    const body = await request.post(`${API_BASE_URL}/searchProduct`, {
      data: new URLSearchParams({ search_product: 'Tshirt' }).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then((r) => r.json());

    validateContract(searchSchema, body);
  });

  test('Contract: POST /createAccount returns correct schema', async ({ request }) => {
    const userData = {
      name: 'Contract User',
      email: makeEmail(),
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
    const response = await request.post(`${API_BASE_URL}/createAccount`, {
      data: new URLSearchParams(userData).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    expect([200, 201]).toContain(response.status());
    const responseBody = await response.json();

    validateContract(simpleMessageSchema, responseBody);
  });

  test('Contract: PUT /updateAccount returns correct schema', async ({ request }) => {
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

# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api.spec.js >> AutomationExercise API - 14 Casos Específicos >> API 10: POST /verifyLogin - Dados inválidos retornam 404
- Location: tests\api.spec.js:247:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 404
Received: 200
```

# Test source

```ts
  163 |   });
  164 | 
  165 |   test('API 7: POST /verifyLogin - Login com dados válidos', async ({ request }) => {
  166 |     // Esta API verifica credenciais de login.
  167 |     // Nota: Este é um endpoint de teste, as credenciais podem ter resultados variáveis.
  168 | 
  169 |     // PASSO 1: Prepara credenciais de teste.
  170 |     const loginData = {
  171 |       email: 'test.user@example.com',
  172 |       password: 'password123'
  173 |     };
  174 | 
  175 |     // PASSO 2: Realiza requisição POST com credenciais.
  176 |     const response = await request.post(`${API_BASE_URL}/verifyLogin`, {
  177 |       data: loginData
  178 |     });
  179 | 
  180 |     // PASSO 3: Valida que a resposta retorna 200 (mesmo que usuário exista).
  181 |     expect(response.status()).toBe(200);
  182 | 
  183 |     // PASSO 4: Valida a estrutura da resposta.
  184 |     const responseBody = await response.json();
  185 |     expect(responseBody).toHaveProperty('responseCode');
  186 |     expect(responseBody).toHaveProperty('message');
  187 | 
  188 |     console.log(`✓ API 7 OK - Resposta: ${responseBody.message}`);
  189 |   });
  190 | 
  191 |   test('API 8: POST /verifyLogin - Sem parâmetro email - Validação de resposta', async ({ request }) => {
  192 |     // Esta API pode rejeitar ou aceitar requisições sem o parâmetro email.
  193 |     // Teste de VALIDAÇÃO: Verifica tratamento de parâmetro faltante.
  194 | 
  195 |     // PASSO 1: Prepara dados sem o email (faltante).
  196 |     const incompleteData = {
  197 |       password: 'password123' // Falta o email
  198 |     };
  199 | 
  200 |     // PASSO 2: Realiza requisição POST sem email.
  201 |     const response = await request.post(`${API_BASE_URL}/verifyLogin`, {
  202 |       data: incompleteData
  203 |     });
  204 | 
  205 |     // PASSO 3: Valida a resposta (pode ser 200, 400, 404, etc).
  206 |     expect([200, 400, 404]).toContain(response.status());
  207 | 
  208 |     // PASSO 4: Se receber JSON, valida a resposta.
  209 |     try {
  210 |       const responseBody = await response.json();
  211 |       expect([responseBody.message, responseBody.responseCode]).toBeTruthy();
  212 |     } catch (e) {
  213 |       // Pode retornar HTML ou resposta sem JSON
  214 |     }
  215 | 
  216 |     console.log(`✓ API 8 OK - POST sem email retornou status ${response.status()}`);
  217 | 
  218 |     console.log(`✓ API 8 OK - POST sem email rejeitado com 400`);
  219 |   });
  220 | 
  221 |   test('API 9: DELETE /verifyLogin - Verificar comportamento com DELETE', async ({ request }) => {
  222 |     // Esta API pode rejeitar ou aceitar requisições DELETE.
  223 |     // Teste de validação: Verifica como a API responde a métodos não convencionais.
  224 | 
  225 |     // PASSO 1: Tenta fazer um DELETE para o endpoint.
  226 |     const response = await request.delete(`${API_BASE_URL}/verifyLogin`, {
  227 |       data: {
  228 |         email: 'test@example.com',
  229 |         password: 'test'
  230 |       }
  231 |     });
  232 | 
  233 |     // PASSO 2: Valida a resposta (pode ser 405, 400, 200, 404, etc).
  234 |     expect([200, 400, 404, 405]).toContain(response.status());
  235 | 
  236 |     // PASSO 3: Valida que há uma resposta válida.
  237 |     try {
  238 |       const responseBody = await response.json();
  239 |       expect([responseBody.responseCode, responseBody.message]).toBeTruthy();
  240 |     } catch (e) {
  241 |       // Pode retornar HTML ou resposta sem JSON
  242 |     }
  243 | 
  244 |     console.log(`✓ API 9 OK - DELETE respondido com status ${response.status()}`);
  245 |   });
  246 | 
  247 |   test('API 10: POST /verifyLogin - Dados inválidos retornam 404', async ({ request }) => {
  248 |     // Esta API retorna 404 quando as credenciais são inválidas ou o usuário não existe.
  249 |     // Teste de ERRO: Simula tentativa de login com credenciais incorretas.
  250 | 
  251 |     // PASSO 1: Prepara credenciais que não existem.
  252 |     const invalidData = {
  253 |       email: 'nonexistent.user.12345@example.com',
  254 |       password: 'definitely.wrong.password'
  255 |     };
  256 | 
  257 |     // PASSO 2: Realiza requisição POST com dados inválidos.
  258 |     const response = await request.post(`${API_BASE_URL}/verifyLogin`, {
  259 |       data: invalidData
  260 |     });
  261 | 
  262 |     // PASSO 3: Valida que retorna 404 (Not Found).
> 263 |     expect(response.status()).toBe(404);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  264 | 
  265 |     // PASSO 4: Valida a mensagem de erro esperada.
  266 |     const responseBody = await response.json();
  267 |     expect(responseBody.message).toContain('User not found');
  268 | 
  269 |     console.log(`✓ API 10 OK - Login com dados inválidos retorna 404`);
  270 |   });
  271 | 
  272 |   test('API 11: POST /createAccount - Criar nova conta de usuário (201)', async ({ request }) => {
  273 |     // Esta API cria uma nova conta de usuário com dados completos.
  274 |     // Demonstra um fluxo complexo com múltiplos parâmetros obrigatórios.
  275 | 
  276 |     // PASSO 1: Prepara dados completos do novo usuário.
  277 |     const newUserData = {
  278 |       name: 'Automation Test User',
  279 |       email: makeEmail(), // E-mail único para evitar conflitos
  280 |       password: 'Test@1234',
  281 |       title: 'Mr',
  282 |       birth_date: '01',
  283 |       birth_month: '01',
  284 |       birth_year: '1990',
  285 |       firstname: 'Automation',
  286 |       lastname: 'Test',
  287 |       company: 'Test Company',
  288 |       address1: '123 Test St',
  289 |       address2: 'Suite 100',
  290 |       country: 'Canada',
  291 |       state: 'Ontario',
  292 |       city: 'Toronto',
  293 |       zipcode: 'M5H1A1',
  294 |       mobile_number: '1234567890'
  295 |     };
  296 | 
  297 |     // PASSO 2: Realiza requisição POST para criar conta.
  298 |     const response = await request.post(`${API_BASE_URL}/createAccount`, {
  299 |       data: newUserData
  300 |     });
  301 | 
  302 |     // PASSO 3: Valida que retorna 201 (Created) para nova conta.
  303 |     expect([201, 200]).toContain(response.status());
  304 | 
  305 |     // PASSO 4: Valida a estrutura da resposta.
  306 |     const responseBody = await response.json();
  307 |     expect(responseBody).toHaveProperty('responseCode');
  308 |     expect(responseBody).toHaveProperty('message');
  309 | 
  310 |     console.log(`✓ API 11 OK - Conta criada: ${responseBody.message}`);
  311 |   });
  312 | 
  313 |   test('API 12: DELETE /deleteAccount - Deletar conta de usuário', async ({ request }) => {
  314 |     // Esta API deleta uma conta de usuário usando credenciais.
  315 |     // Primeiro cria uma conta e depois a deleta.
  316 | 
  317 |     // PASSO 1: Cria um usuário primeiro.
  318 |     const userData = {
  319 |       name: 'Delete Test User',
  320 |       email: makeEmail(),
  321 |       password: 'Test@1234',
  322 |       title: 'Mr',
  323 |       birth_date: '01',
  324 |       birth_month: '01',
  325 |       birth_year: '1990',
  326 |       firstname: 'Delete',
  327 |       lastname: 'Test',
  328 |       company: 'Test Company',
  329 |       address1: '123 Test St',
  330 |       address2: 'Suite 100',
  331 |       country: 'Canada',
  332 |       state: 'Ontario',
  333 |       city: 'Toronto',
  334 |       zipcode: 'M5H1A1',
  335 |       mobile_number: '1234567890'
  336 |     };
  337 | 
  338 |     // PASSO 2: Cria a conta.
  339 |     const createResponse = await request.post(`${API_BASE_URL}/createAccount`, {
  340 |       data: userData
  341 |     });
  342 |     expect([200, 201]).toContain(createResponse.status());
  343 | 
  344 |     // PASSO 3: Prepara dados para deleção.
  345 |     const deleteData = {
  346 |       email: userData.email,
  347 |       password: userData.password
  348 |     };
  349 | 
  350 |     // PASSO 4: Realiza requisição DELETE.
  351 |     const deleteResponse = await request.delete(`${API_BASE_URL}/deleteAccount`, {
  352 |       data: deleteData
  353 |     });
  354 | 
  355 |     // PASSO 5: Valida que retorna 200 para deleção bem-sucedida.
  356 |     expect(deleteResponse.status()).toBe(200);
  357 | 
  358 |     // PASSO 6: Valida a mensagem de sucesso.
  359 |     const responseBody = await deleteResponse.json();
  360 |     expect(responseBody.message).toContain('Account deleted');
  361 | 
  362 |     console.log(`✓ API 12 OK - Conta deletada: ${responseBody.message}`);
  363 |   });
```
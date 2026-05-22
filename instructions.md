# API Test Automation Engineering Standards

This project follows strict automation engineering standards.
GitHub Copilot must always generate code respecting these rules.

---

## Core Principles

Code must be:
- Clean
- Reusable
- Maintainable
- Readable
- Deterministic
- Explicit
- Scalable
- Production-quality

Avoid:
- duplicated logic
- hardcoded values
- flaky tests
- magic strings
- weak assertions
- generic validations
- quick dirty solutions
- deprecated patterns

Follow:
- DRY
- SOLID
- Clean Code
- Separation of concerns
- Composition over inheritance when appropriate

---

## Modern Technology Preference

Always prefer modern, actively maintained, secure, and industry-recommended technologies unless a specific technology is explicitly required.

Default behavior:
choose the most current stable and well-supported solution.

Prefer:
- actively maintained libraries
- stable modern frameworks
- official tooling
- secure dependencies
- performant solutions
- scalable architecture patterns
- modern syntax and language features

Avoid:
- deprecated frameworks
- obsolete libraries
- abandoned packages
- insecure legacy approaches
- outdated authentication patterns
- old implementations when superior alternatives exist

Exception:
if the user explicitly requires a specific stack, framework, language, or compatibility constraint, respect that requirement.

Never replace explicit project constraints without request.

---

## API Documentation First Rule (Swagger / OpenAPI)

Whenever API documentation is available, it must be treated as the source of truth.

Always read and analyze the complete documentation before generating automation:
- Swagger
- OpenAPI
- Postman collections
- API reference documentation

Understand:
- endpoints
- HTTP methods
- request body contracts
- response contracts
- headers
- authentication
- path params
- query params
- required fields
- optional fields
- enums
- examples
- API versions
- deprecations
- documented error responses

Never:
- invent endpoints
- invent fields
- invent contracts
- assume undocumented behavior

If documentation conflicts with implementation:
flag the inconsistency explicitly.

---

## Test Philosophy

Tests must validate business behavior, not implementation details.

Each test must:
- have a single responsibility
- validate one business scenario
- be deterministic
- isolated
- independent
- easy to understand
- reproducible

Never:
- depend on execution order
- share mutable state
- depend on previous tests

---

## API Validation Rules

Status code validation must be exact.

NEVER do:

```js
expect(status).to.be.oneOf([200, 201])
```

OR

```js
assertTrue(status == 200 || status == 201)
```

Always validate the exact expected response.

Examples:
- 200 = success retrieval
- 201 = resource created
- 204 = no content
- 400 = client input error
- 401 = authentication missing/invalid
- 403 = authenticated but forbidden
- 404 = resource not found
- 409 = conflict
- 422 = semantic validation error
- 500 = server failure
- 503 = service unavailable

---

## Critical Error Rule

503 must NEVER be accepted as expected business behavior.

If an upstream dependency fails:
the application should translate technical failures into controlled business responses whenever applicable.

Prefer:
- 400
- 422

With:
- meaningful error messages
- explicit business contract handling

Never normalize infrastructure instability as acceptable behavior.

---

## Contract Testing and JSON Schema Validation

All API responses with body content must be validated using JSON Schema.

Contract validation is mandatory.

Validate:
- required fields
- optional fields
- field types
- enum values
- nullable fields
- nested objects
- arrays
- error response contracts
- success response contracts

Rules:
- JSON Schema validates structure
- business assertions validate behavior
- both are mandatory

Never validate only status code when a contract exists.

Preferred structure:

```text
src/
 schemas/
 validators/
 tests/
```

Examples:

```text
schemas/
 customer/
   create-customer-response.schema.json
   customer-error-response.schema.json
```

One schema per contract.

Separate:
- success schemas
- error schemas

Version contracts when needed.

---

## Assertions

Assertions must be strict and meaningful.

Avoid:
- vague assertions
- partial validations
- "not null" only checks
- validating artificial generated values without business meaning

Bad:

```js
assertNotNull(response.body)
```

```js
expect(found.name).to.equal('Teste Cypress')
```

```js
expect(response.name).to.equal(customer.name)
```

Unless the value itself is the business rule.

Good:

```js
validateSchema(response.body, customerSchema)
```

```js
expect(response.status).to.equal(201)
```

```js
expect(response.body.status).to.equal('ACTIVE')
```

```js
expect(response.body.error.code).to.equal('CUSTOMER_ALREADY_EXISTS')
```

```js
expect(response.body.totalAmount).to.equal(expectedTotal)
```

Never assert fields just because they exist.

---

## Request Construction

Requests must be reusable.

Create:
- API client classes
- request builders
- payload factories
- auth helpers

Avoid duplicated setup.

Bad:
repeat headers/auth in every test

Good:
centralized request abstraction

---

## Authentication

Authentication must be centralized.

Never duplicate:
- token generation
- auth headers
- auth setup

Use:
- token providers
- auth helpers
- auth clients

---

## Test Data

Test data must be controlled and automatically generated whenever possible.

Use:
- factories
- builders
- fixtures
- FakerJS
- Java Faker
- Kotlin Faker
- equivalent generators

Generate:
- names
- emails
- phone numbers
- CPF
- CNPJ
- addresses
- usernames
- document numbers
- dates
- order/payment/customer data

Avoid:
- hardcoded production-like IDs
- fixed CPF/CNPJ
- static users
- shared mutable data
- environment dependency
- real personal data

Generated data must be:
- valid
- isolated
- unique when needed
- deterministic when necessary
- traceable in logs

Examples:

Bad:

```js
name: "João Silva"
cpf: "12345678900"
```

Good:

```js
CustomerFactory.valid()
```

```js
CustomerBuilder.valid().withInvalidCpf().build()
```

Business rules must control the scenario.

---

## API Client Pattern

Use API client abstraction.

Examples:
- UserApiClient
- PaymentApiClient
- OrderApiClient

Responsibilities:
- endpoint execution
- auth handling
- request setup

Tests should validate business behavior only.

---

## Logging

Always log:
- request
- response
- headers
- payload
- correlation IDs
- trace IDs

Logs must support fast debugging.

---

## Retry Rules

Never retry:
- business failures
- validation failures
- contract failures

Retry only:
- transient infrastructure failures
- explicitly configured retry scenarios

Never hide defects with retries.

---

## Performance

Tests must be efficient.

Avoid:
- unnecessary waits
- duplicated setup
- repeated auth
- expensive repeated calls

Optimize:
- setup reuse where safe
- deterministic execution

---

## Naming

Names must clearly describe behavior.

Good:

```text
should_return_401_when_token_is_invalid
```

Bad:

```text
testLogin
```

---

## Cucumber Usage

Use Cucumber only when business readability matters.

Do not create unnecessary BDD layers.

Feature files must describe business behavior.

Avoid technical Gherkin.

Bad:

```gherkin
Given I send POST request
```

Good:

```gherkin
Given the customer has a valid account
```

---

## Code Structure

Preferred structure:

```text
src/
 clients/
 builders/
 factories/
 auth/
 helpers/
 validators/
 schemas/
 tests/
```

---

## Clean Code Rules

Methods:
- small
- single responsibility

Classes:
- cohesive
- explicit

Avoid:
- giant utility classes
- God objects
- duplicated logic
- mixed responsibilities

---

## Object-Oriented Design

Prefer:
- encapsulation
- abstraction
- composition

Avoid inheritance abuse.

Inheritance only when true is-a relationship exists.

---

## Flaky Test Prevention

Avoid:
- timing dependency
- environment dependency
- race conditions
- unstable assertions
- random uncontrolled data
- async timing assumptions

Use deterministic validation.

---

## Pull Request Quality

Generated code must be production-quality.

Before generating code validate:
- duplication
- readability
- maintainability
- architecture consistency
- strict assertions
- schema validation
- business correctness
- modern best practices

Never generate quick dirty solutions.
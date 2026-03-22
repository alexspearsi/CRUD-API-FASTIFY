# CRUD API on Fastify

A RESTful CRUD API for managing products, built with Fastify and TypeScript.

## Requirements

- Node.js 24+
- npm

## Installation

```bash
1. git clone https://github.com/alexspearsi/CRUD-API-ON-FASTIFY.git
2. cd CRUD-API-ON-FASTIFY
3. git checkout dev
4. npm install
5. cp .env.example .env

```

## Running

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run start:prod
```

### Cluster mode (multi-process)

```bash
npm run start:multi
```

The server starts on port `4000` by default. Override with the `PORT` environment variable:

```bash
PORT=3000 npm run start:dev
```

## Environment variables

Create a `.env` file in the root of the project:

```env
PORT=4000
NODE_ENV=development
```

## API

Base URL: [http://localhost:4000/api/products](http://localhost:4000/api/products)

Interactive documentation is available via Swagger UI at [http://localhost:4000/docs](http://localhost:4000/docs) after starting the server.

### Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create a product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

### Product object type

```json
 {
  "id": "uuid",
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "inStock": "boolean"
}
```

### Examples

**Get all products**
```bash
curl http://localhost:4000/api/products
```

**Get product by ID**
```bash
curl http://localhost:4000/api/products/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11
```

**Create a product**
```bash
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"iPad","description":"Apple tablet","price":799,"category":"electronics","inStock":true}'
```

**Update a product**
```bash
curl -X PUT http://localhost:4000/api/products/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11 \
  -H "Content-Type: application/json" \
  -d '{"name":"iPad Pro","description":"Apple tablet","price":1099,"category":"electronics","inStock":true}'
```

**Delete a product**
```bash
curl -X DELETE http://localhost:4000/api/products/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11
```

### Response codes

| Code | Description |
|------|-------------|
| 200 | OK |
| 201 | Created |
| 204 | No Content (deleted) |
| 400 | Validation error (invalid UUID or missing fields) |
| 404 | Product not found |

## Testing

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:int

# With coverage
npm run test:coverage
```

## Build

```bash
npm run build
```

Output is placed in the `dist/` directory.

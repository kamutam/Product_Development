# REST API Catalog & Specifications

## Base URL
`http://localhost:5000/api/v1`

## Interactive OpenAPI / Swagger UI
`http://localhost:5000/api/docs`

---

## 1. Authentication Endpoints

| Method | Path | Auth Required | Description |
|---|---|---|---|
| `POST` | `/auth/register` | No | Register a new team member with email and password |
| `POST` | `/auth/login` | No | Authenticate user and receive access + refresh token |
| `POST` | `/auth/refresh` | No | Exchange refresh token for new access token |
| `POST` | `/auth/logout` | No | Revoke active refresh token |
| `GET` | `/auth/me` | Yes | Get authenticated user profile & roles |

---

## 2. Product Development & Roadmaps

| Method | Path | Auth Required | Description |
|---|---|---|---|
| `GET` | `/products` | No | List products with search, category, and status filters |
| `GET` | `/products/:id` | No | Get product specification details by ID |
| `POST` | `/products` | Yes | Create new hardware product with specs |
| `PUT` | `/products/:id` | Yes | Update product specs or homologation certifications |
| `DELETE` | `/products/:id` | Yes | Delete product record |
| `GET` | `/products/ideas` | No | List proposed product ideas |
| `POST` | `/products/ideas` | Yes | Create new product idea |
| `GET` | `/products/roadmaps` | No | List engineering roadmaps with milestones |

---

## 3. Tender Intelligence

| Method | Path | Auth Required | Description |
|---|---|---|---|
| `GET` | `/tenders` | No | List all ingested tenders |
| `GET` | `/tenders/:id` | No | Get tender statutory dossier |
| `POST` | `/tenders` | Yes | Record new tender package |
| `POST` | `/tenders/:id/analyze` | Yes | Trigger AI 14-point statutory extraction |
| `POST` | `/tenders/:id/search` | No | Search within 345+ page tender package |

---

## 4. Analytics & Telemetry

| Method | Path | Auth Required | Description |
|---|---|---|---|
| `GET` | `/analytics/overview` | No | Get overall company product development metrics |
| `GET` | `/analytics/products` | No | Component demand and sourcing spend metrics |
| `GET` | `/analytics/tenders` | No | Tender pipeline velocity and win-loss ratio |
| `GET` | `/analytics/vendors` | No | Vendor allocation and Tier-1 reliability metrics |

---

## 5. AI Orchestrator & Chat

| Method | Path | Auth Required | Description |
|---|---|---|---|
| `POST` | `/ai/chat` | No | Multi-Agent AI Orchestration query |

---

## 6. Global Search (Ctrl + K)

| Method | Path | Auth Required | Description |
|---|---|---|---|
| `GET` | `/search?q={query}` | No | Cross-entity search across Products, Tenders, and Vendors |

# System Architecture: Product Intelligence & OEM Platform

## 1. High-Level Topology

The Brihaspathi Technologies Product Intelligence Platform is built on a decoupled, resilient, and enterprise-grade architecture:

```
[React + Vite Frontend (Port 3000)]
               │
               ▼ (HTTP/REST /api/v1)
[Express + TypeScript Backend (Port 5000)]
  ├── Security & Middlewares: Helmet, CORS, JWT Auth, Zod Validation, RateLimiter
  ├── Multi-Agent AI Orchestrator
  │     ├── ProductAgent (STQC/ARAI Spec Matcher)
  │     ├── TenderAgent (345+ Page Statutory Extractor)
  │     ├── CompetitorAgent (SWOT & Pricing Comps)
  │     ├── VendorAgent (RFQ Dispatcher)
  │     └── DocumentAgent (PDF/CSV/XLSX Chunker)
  ├── Prisma ORM Layer
  │     └── PostgreSQL 15+ (pgvector for semantic search)
  ├── Storage Abstraction (Local Uploads & AWS S3)
  └── Redis / BullMQ Job Gateway (Asynchronous document processing)
```

## 2. Security Architecture
- **JWT Authentication**: Short-lived access tokens (15m) paired with rotating refresh tokens stored in the database.
- **RBAC**: Role-based access control with granular permission gates (`ADMIN`, `PRODUCT_MANAGER`, `RESEARCHER`, `ANALYST`, `SALES`, `VENDOR_MANAGER`, `USER`).
- **Zero Exposure**: No database passwords, JWT secrets, or LLM keys exposed to the client bundle.

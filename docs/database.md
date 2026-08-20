# Database Architecture & Entity Specifications

## PostgreSQL + Prisma Normalized Architecture

The platform's persistence layer is built on PostgreSQL with Prisma ORM.

```
Users & RBAC:
  ├── users (id, email, passwordHash, fullName, role, department)
  ├── roles (id, name, description)
  ├── permissions (id, action, description)
  ├── refresh_tokens (id, token, userId, isRevoked, expiresAt)
  └── sessions (id, userId, ipAddress, userAgent, lastActiveAt)

Product Development:
  ├── products (id, name, sku, categoryId, vendorId, price, status, specs, certifications)
  ├── product_categories (id, name, icon, fields)
  ├── product_ideas (id, title, description, feasibility, targetPrice)
  ├── product_roadmaps (id, title, startDate, endDate)
  └── product_milestones (id, roadmapId, name, dueDate, isCompleted)

Tender Intelligence:
  ├── tenders (id, tenderRefNo, gemBidId, title, organisationName, estimatedValue, emdAmount, statutoryDossier)
  ├── tender_documents (id, tenderId, docType, fileName, fileUrl, pageCount)
  └── tender_analyses (id, tenderId, complianceScore, status, deviationsForm4, boqArchitecture)

Vendor Directory:
  ├── vendors (id, name, oemCategory, country, rating, tier)
  ├── vendor_contacts (id, vendorId, name, email, phone, designation)
  ├── vendor_evaluations (id, vendorId, qualityScore, deliveryScore, complianceScore)
  └── email_history (id, vendorId, oemName, requirementTitle, subject, body, status)

Market & Competitor:
  ├── markets (id, name, region, tamValue, cagrPercentage)
  ├── market_trends (id, marketId, trendName, impactLevel)
  ├── market_opportunities (id, marketId, opportunityTitle, potentialRevenue)
  ├── competitors (id, name, marketShare, strengths, weaknesses)
  └── competitor_products (id, competitorId, productName, price, specs)
```

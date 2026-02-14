---
name: contractoria-full-system
description: Complete functional, architectural and behavioral specification for ContractorIA multi-tenant SaaS platform. Enforces bilingual production standards and multi-tenant security.
---

# ContractorIA Full SaaS System (Bilingual Production Skill)

Complete functional, architectural and behavioral specification for ContractorIA multi-tenant SaaS platform. This skill governs all interactions related to authentication, clients, estimates, AI conversations, and multi-tenant logic.

## Context
ContractorIA is a premium multi-tenant SaaS for contractors. It uses Next.js (App Router), Supabase (PostgreSQL with RLS), and next-intl for bilingual support.

## Security & Multi-Tenancy (CRITICAL)
> [!CAUTION]
> This project follows a strict multi-tenant architecture. 
> - ALL database queries MUST include a filter for `company_id` (the tenant identifier).
> - RLS policies must be respected at the database level.
> - Never leak data between tenants.

## 🌎 Language Policy
1. Internal system logic and code: **English**.
2. Database fields: **English**.
3. User-facing content: Default **English**, support **Spanish**.
4. AI responses: Match user language, store data in **English**.

## 🏗 System Modules

### 1. Authentication & Tenant Management
- All records must include `company_id`.
- Tenant isolation is mandatory.

### 2. Branding
- Store `company_name`, `logo_url`, `primary_color`, `secondary_color`, etc.
- Support dynamic CSS variables for tenant-specific themes.

### 3. Client Module
- Manage client profile: `name`, `email`, `phone`, `address`.

### 4. Estimate & Line Item System
- Status Flow: `DRAFT` -> `SENT` -> `REVISION_REQUESTED` -> `SIGNED` -> `ARCHIVED`.
- Calculations: `total = round2(quantity * rate)`.
- Use deterministic 2-decimal rounding for all financial math.
- Signed estimates are immutable.

### 5. AI Conversation System
- Guide the user through estimate creation: ask for rate, quantity, and confirm totals.
- Never invent pricing.
- Map natural language commands to secure backend functions.

### 6. Signature & Revisions
- On signature: Log IP, timestamp, and generate document hash.
- Lock version. Revisions must create a new version (N+1).

## Implementation Steps
1. **Validation**: Before any database mutation, ensure `company_id` is present and belongs to the authenticated user.
2. **Standard Response**: All mutations must return `{ success: boolean, data?: object, error?: string }`.
3. **Audit**: Log critical events like `ESTIMATE_CREATED`, `SIGNED`, etc.

## Validation
- [ ] Verify `company_id` scoping in every query.
- [ ] Ensure all code and DB fields are in English.
- [ ] Confirm user-facing strings use `next-intl`.
- [ ] Test immutability of signed records.

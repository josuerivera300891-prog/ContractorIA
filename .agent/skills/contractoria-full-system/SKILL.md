---
name: contractoria-full-system
description: Complete functional, architectural and behavioral specification for ContractorIA multi-tenant SaaS platform for service businesses. Enforces bilingual production standards and multi-tenant security.
---

# ContractorIA Full SaaS System (Production Skill)

Complete functional, architectural and behavioral specification for ContractorIA multi-tenant SaaS platform. This skill governs all interactions related to authentication, clients, estimates, invoices, projects, expenses, and multi-tenant logic.

## Context
ContractorIA is a premium multi-tenant SaaS for service businesses (contractors, plumbers, electricians, etc.). It uses Next.js (App Router), Supabase (PostgreSQL with RLS), and next-intl for bilingual support.

## Security & Multi-Tenancy (CRITICAL)
> [!CAUTION]
> This project follows a strict multi-tenant architecture.
> - ALL database queries MUST include a filter for `company_id` (the tenant identifier).
> - RLS policies must be respected at the database level.
> - Never leak data between tenants.

## Language Policy
1. Internal system logic and code: **English**.
2. Database fields: **English**.
3. User-facing content: Default **English**, support **Spanish**.
4. AI responses: Match user language, store data in **English**.

## System Modules

### 1. Authentication & Tenant Management
- All records must include `company_id`.
- Tenant isolation is mandatory.
- Routes structure: `/[locale]/[tenant]/...`

### 2. Branding
- Store `company_name`, `logo_url`, `primary_color`, `secondary_color`, etc.
- Support dynamic CSS variables for tenant-specific themes.

### 3. Client Module
- Manage client profile: `first_name`, `last_name`, `email`, `phone`, `address`, `company_name`.
- Status: `ACTIVE` | `INACTIVE`

### 4. Estimate & Line Item System
- Status Flow: `DRAFT` -> `SENT` -> `VIEWED` -> `APPROVED` -> `SIGNED` -> `REJECTED`.
- Calculations: `total = round2(quantity * rate)`.
- Use deterministic 2-decimal rounding for all financial math.
- Signed estimates are immutable.
- Items stored as JSONB with structure: `{id, description, unit_type, quantity, rate, total}`

### 5. Invoice System
- Status Flow: `UNPAID` -> `PARTIAL` -> `PAID` -> `OVERDUE` -> `CANCELLED`
- Supports partial payments via Stripe or manual recording
- Automatic balance calculation via database trigger

### 6. Project & Task Management
- Projects linked to estimates and clients
- Status: `PLANNING` -> `IN_PROGRESS` -> `COMPLETED` -> `ON_HOLD`
- Tasks with Kanban-style management (TODO, IN_PROGRESS, DONE)

### 7. Expense Tracking
- Track project-related expenses
- Calculate profitability (estimate total - expenses)

### 8. AI Estimate Builder
- Natural language to estimate items
- Powered by Gemini 1.5 Flash
- Validates company_id for multi-tenant security

### 9. Signature System
- On signature: Log IP, timestamp, and generate document hash.
- Lock version. Revisions must create a new version (N+1).

## Implementation Rules
1. **Validation**: Before any database mutation, ensure `company_id` is present and belongs to the authenticated user.
2. **Standard Response**: All mutations must return `{ success: boolean, data?: object, error?: string }`.
3. **Audit**: Log critical events like `ESTIMATE_CREATED`, `SIGNED`, `INVOICE_PAID`, etc.

## Validation Checklist
- [ ] Verify `company_id` scoping in every query.
- [ ] Ensure all code and DB fields are in English.
- [ ] Confirm user-facing strings use `next-intl`.
- [ ] Test immutability of signed records.
- [ ] Verify RLS policies on all tables.

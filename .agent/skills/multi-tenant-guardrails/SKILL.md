---
name: multi-tenant-guardrails
description: Ensures all development follows strict multi-tenancy rules. Use when creating models, queries, or UI components.
---

# Multi-Tenant Guardrails Skill

This skill ensures that the ContractorIA project remains secure by strictly enforcing isolation between companies (tenants).

## Context
ContractorIA is a SaaS for multiple companies. Each user/resource/record belongs to a `company_id` (or `tenant_id`). Leaking data between companies is a P0 security risk.

## Multi-Tenancy Rules

### 1. Database level (Supabase/PostgreSQL)
- All tables must have a `company_id` (or `tenant_id`) column.
- Row Level Security (RLS) must be enabled on every table.
- Policies must check `auth.uid()` and its associated company.

### 2. Querying (Server Components & Actions)
> [!IMPORTANT]
> Never perform a "select all" without a filter.
> **Correct:** `.from('tables').select('*').eq('company_id', current_tenant_id)`
> **Incorrect:** `.from('tables').select('*')`

### 3. Routing (Next.js)
- All routes must be scoped by the tenant slug in the URL: `/[locale]/[tenant]/...`
- Verify the tenant slug against the authenticated session.

## Implementation Steps for New Features
1. **Schema Check**: Ensure the table has `company_id`.
2. **RLS Check**: Write or audit the RLS policy for the table.
3. **Action Check**: Ensure server actions accept and validate the tenant context.
4. **UI Check**: Ensure data fetching is scoped to the current tenant.

## Validation
- [ ] Try to access data without a `tenant_id` filter (it should fail due to RLS).
- [ ] Try to access data from a different tenant (it should return empty).
- [ ] Verify that `tenant_id` is passed correctly in the layout chain.

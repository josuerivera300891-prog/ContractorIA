---
name: [skill-name]
description: [Concise description of what this skill does and when to use it]
---

# [Skill Display Name]

Detailed instructions for the AI agent on how to perform this specific task.

## Context
Provide background context on the system components involved (e.g., Supabase, Next.js App Router).

## Security & Multi-Tenancy (CRITICAL)
> [!CAUTION]
> This project follows a strict multi-tenant architecture. 
> - ALL database queries MUST include a filter for `tenant_id` (or `company_id`).
> - RLS policies must be respected.
> - Never leak data between tenants.

## Implementation Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Validation
- [ ] Verify `tenant_id` scoping.
- [ ] Verify TypeScript strict mode.
- [ ] Test with mock data for a specific tenant.

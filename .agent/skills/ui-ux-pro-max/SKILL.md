---
name: ui-ux-pro-max
description: Premium design intelligence for UI/UX and landing page construction. Follows professional standards for SaaS and multi-tenant apps.
---

# UI/UX Pro Max Skill (ContractorIA Edition)

Extended design intelligence for building high-conversion landing pages and premium dashboard interfaces, adapted for the ContractorIA multi-tenant ecosystem.

## Context
ContractorIA requires a premium, production-grade aesthetic. Every UI element must be visually stunning while strictly respecting data isolation (tenant_id).

## 🛠️ Design Workflow

### Step 1: Analyze Requirements
- **Tenant Context**: Identify which tenant/company this UI is for.
- **Style**: Choose between Minimal, Glassmorphism, or Sleek Dark Mode.
- **Industry**: Construction, Contracting, or Multi-tenant Marketplace.

### Step 2: Generate Design System (Source of Truth)
Before coding, define the design tokens:
- **Colors**: Use curated palettes (avoid generic colors).
- **Typography**: Google Fonts (Inter, Roboto, Outfit).
- **Persistence**: Store in a `MASTER.md` within the task context for consistency.

### Step 3: Landing Page Construction (Domain: `landing`)
For landing pages, prioritize these sections:
1. **Hero Section**: High-impact messaging with crystal-clear CTA.
2. **Social Proof**: Testimonials and "Trusted by" strips.
3. **Pricing Tables**: Supporting tier-based billing (supported by project stack).
4. **Features Grid**: Multi-tenant benefits.

## 🔒 Multi-Tenant Guardrails (CRITICAL)
> [!CAUTION]
> Even in UI design, data isolation is top priority.
> - Ensure all dynamically loaded content (images, logos, text) is filtered by `tenant_id`.
> - Public landing pages must only show data designated as "public" for that specific tenant.

## 💎 Professionalism Rules
- **No Emojis**: Use SVG icons (Heroicons/Lucide) ONLY.
- **Interactions**: Always add `cursor-pointer` and `hover:scale-[1.02]`.
- **Performance**: Use WebP for images via `next/image`.
- **Typography**: Minimum 16px for body text on mobile.

## Validation Checklist
- [ ] Is the UI stunning and premium?
- [ ] Is `tenant_id` validation present in all data-fetching hooks?
- [ ] Does it use SVG icons instead of emojis?
- [ ] Is it fully responsive (375px to 1440px)?
- [ ] Is the contrast ratio >= 4.5:1?

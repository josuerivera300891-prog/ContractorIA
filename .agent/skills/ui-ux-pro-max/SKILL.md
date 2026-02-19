---
name: ui-ux-pro-max
description: Premium design intelligence for UI/UX and dashboard interfaces. Follows professional standards for SaaS and multi-tenant apps.
---

# UI/UX Pro Max Skill (ContractorIA Edition)

Extended design intelligence for building premium dashboard interfaces, adapted for the ContractorIA multi-tenant ecosystem.

## Context
ContractorIA requires a premium, production-grade aesthetic. Every UI element must be visually stunning while strictly respecting data isolation (company_id).

## Design Workflow

### Step 1: Analyze Requirements
- **Tenant Context**: Identify which tenant/company this UI is for.
- **Style**: Use Sleek Modern Dark/Light Mode with turquoise accents.
- **Industry**: Construction, Contracting, Service Businesses.

### Step 2: Design System (Source of Truth)
Design tokens defined in tailwind.config.ts:
- **Colors**: `turq-primary`, `deep-blue`, `slate` scale
- **Typography**: Google Fonts (Outfit for headings)
- **Shadows**: `shadow-card`, `shadow-elevated`
- **Radii**: `rounded-xl`, `rounded-2xl`, `rounded-[2.5rem]`

### Step 3: Dashboard Construction
For dashboards, prioritize these patterns:
1. **Pro Cards**: Use `pro-card` class with gradient accents
2. **Stats Grid**: Financial metrics prominently displayed
3. **Quick Actions**: Prominent CTAs for common tasks
4. **Data Tables**: Clean, scannable with status badges

## Multi-Tenant Guardrails (CRITICAL)
> [!CAUTION]
> Even in UI design, data isolation is top priority.
> - Ensure all dynamically loaded content is filtered by `company_id`.
> - Pass `companyId` to all data-fetching functions.

## Professionalism Rules
- **No Emojis**: Use SVG icons (Lucide) ONLY.
- **Interactions**: Always add `cursor-pointer` and hover states.
- **Performance**: Use WebP for images via `next/image`.
- **Typography**: Minimum 16px for body text on mobile.
- **Spacing**: Use Tailwind scale consistently (gap-4, gap-6, p-4, p-6, p-8).

## Component Patterns

### Pro Card
```tsx
<div className="pro-card bg-white p-8 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-40 h-40 bg-turq-primary/5 rounded-bl-[100px]"></div>
    {/* Content */}
</div>
```

### Status Badge
```tsx
<span className="px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border bg-emerald-50 text-emerald-600 border-emerald-100">
    PAID
</span>
```

### Section Header
```tsx
<h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
    Section Title
</h3>
```

## Validation Checklist
- [ ] Is the UI stunning and premium?
- [ ] Is `company_id` validation present in all data-fetching?
- [ ] Does it use SVG icons instead of emojis?
- [ ] Is it fully responsive (375px to 1440px)?
- [ ] Is the contrast ratio >= 4.5:1?

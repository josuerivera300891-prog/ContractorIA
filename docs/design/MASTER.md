# ContractorIA Design System: MASTER

This document serves as the single source of truth for the UI/UX of ContractorIA. All components must adhere to these standards to ensure a premium, minimalist, and secure experience.

## 🎨 Color Palette: Turquoise Gradient Aura
We move away from pure white/black to a sophisticated turquoise-blue depth.

| Token | Hex | Usage |
|-------|-----|-------|
| `turq-primary` | `#06b6d4` | Accents, links, icons |
| `turq-secondary` | `#0891b2` | Hover states, depth |
| `deep-blue` | `#1e3a8a` | Headings, primary text contrast |
| `aura-gradient` | `linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)` | Component backgrounds, CTA |
| `page-bg` | `linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #cffafe 100%)` | Main page background (subtle but colorful) |

## Background & Depth
The background should NOT be white, but a soft-to-medium turquoise-blue gradient.
- **Global Aura**: Use a large, soft radial gradient or a fixed mesh background using `turquoise-100` to `blue-100` hues.
- **Sectioning**: Distinct sections on the landing page use slightly more saturated versions of the gradient to create flow.

## Typography
- **Display**: `Outfit` (Bold/Black for headings).
- **Body**: `Inter` (14px dashboard, 16px landing).
- **Standard**: Tracking `-0.01em` for readability and premium feel.
- **Colors**: Use `text-deep-blue` for titles and `text-black` for body content.

## 🧱 Component Standards

### Minimalist Surfaces
Avoid heavy drop shadows. Use hairline borders and subtle depth.
- **Borders**: `1px solid #e2e8f0` (very subtle gray).
- **Shadows**: `0 1px 3px 0 rgba(0, 0, 0, 0.05)` (hardly visible).
- **Radius**: `12px` (rounded but not too much).

### Buttons
- **Primary**: `bg-turquoise-gradient` with white text. Crisp, no shadow.
- **Secondary**: Clean white background, `turquoise-primary` border and text.
- **Hover**: Subtle opacity change or slightly darker gradient shift.

### Icons
- **Standard**: Lucide React SVGs (`strokeWidth: 2`).
- **Color**: Default to `turquoise-primary` or `text-deep-blue`.

## 🔒 Multi-Tenant UI Rules
- **Brand Balance**: Maintain minimalist white space to allow tenant branding to stand out.
- **Consistency**: The shell (navbar, sidebar) remains minimalist white/gray to frame tenant content.

## ✅ Pre-Delivery Checklist
- [ ] No cluttered sections. Use ample padding (`p-8` to `p-12`).
- [ ] Responsive layouts.
- [ ] Fast load times (no heavy background images).
- [ ] Accessible contrast.

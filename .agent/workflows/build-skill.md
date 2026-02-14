---
description: How to create a new Antigravity Skill for ContractorIA
---

# Workflow: Build New Skill

Use this workflow to generate a new specialized skill for the ContractorIA project. Every skill must enforce multi-tenancy and security best practices.

## Prerequisites
- Confirm if the skill needs database access (Supabase).
- Identify the specific role (Admin, Client, Staff, SuperAdmin) the skill serves.

## Steps

### 1. Initialize Skill Directory
Create a new folder in `.agent/skills/<skill-name>`.

// turbo
### 2. Create SKILL.md
Copy the template from `.agent/templates/base-skill-template.md` to `.agent/skills/<skill-name>/SKILL.md`.

### 3. Customize Metadata
Update the YAML frontmatter in `SKILL.md`:
- `name`: unique identifier (lowercase-dash-separated).
- `description`: clear explanation of when the agent should use this skill.

### 4. Implement Instructions
Fill the Markdown section with clear, actionable steps. 
> [!IMPORTANT]
> If the skill involves database queries, YOU MUST include a mandatory step to validate `company_id` / `tenant_id`.

### 5. Add Supporting Assets (Optional)
- Create `scripts/` for complex logic.
- Create `resources/` for templates.

### 6. Verify and Register
- Ensure no hardcoded secrets or IDs exist.
- Verify that the skill is listed when running a skill search.

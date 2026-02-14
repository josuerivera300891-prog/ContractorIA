-- 1. Create Audit Logs table
create table if not exists audit_logs (
    id uuid default gen_random_uuid() primary key,
    company_id uuid references companies(id) not null,
    actor_id uuid references auth.users not null,
    action text not null,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);
-- Enable RLS for Audit Logs
alter table audit_logs enable row level security;
create policy "Users can view audit logs from own company" on audit_logs for
select using (
        company_id in (
            select company_id
            from profiles
            where id = auth.uid()
        )
    );
-- 2. Update Companies with Branding fields
alter table companies
add column if not exists logo_url text,
    add column if not exists primary_color text default '#06b6d4',
    add column if not exists secondary_color text default '#1e3a8a',
    add column if not exists accent_color text default '#22d3ee',
    add column if not exists default_terms text,
    add column if not exists default_language text default 'en',
    add column if not exists payment_methods_template jsonb default '[]'::jsonb;
-- 3. Update Clients with extra fields
alter table clients
add column if not exists address text,
    add column if not exists notes text;
-- 4. Update Estimates with Versioning and Advanced Billing
alter table estimates
add column if not exists estimate_number text,
    add column if not exists version integer default 1,
    add column if not exists parent_estimate_id uuid references estimates(id),
    add column if not exists scope_summary text,
    add column if not exists terms_text text,
    add column if not exists tax_enabled boolean default false,
    add column if not exists tax_rate numeric(5, 2) default 0,
    add column if not exists deposit_type text default 'NONE' check (deposit_type in ('PERCENT', 'FIXED', 'NONE')),
    add column if not exists deposit_value numeric(10, 2) default 0,
    add column if not exists payment_methods_snapshot jsonb default '[]'::jsonb;
-- 5. Create Signatures table
create table if not exists signatures (
    id uuid default gen_random_uuid() primary key,
    estimate_id uuid references estimates(id) not null,
    company_id uuid references companies(id) not null,
    signer_name text not null,
    signer_email text not null,
    signature_data text not null,
    -- Base64 or path
    ip_address text,
    user_agent text,
    document_hash text,
    -- For integrity
    created_at timestamptz default now()
);
-- Enable RLS for Signatures
alter table signatures enable row level security;
create policy "Users can view signatures from own company" on signatures for
select using (
        company_id in (
            select company_id
            from profiles
            where id = auth.uid()
        )
    );
-- 6. Create Invoices table
create table if not exists invoices (
    id uuid default gen_random_uuid() primary key,
    company_id uuid references companies(id) not null,
    estimate_id uuid references estimates(id),
    invoice_number text not null,
    status text not null check (
        status in (
            'UNPAID',
            'PARTIAL',
            'PAID',
            'OVERDUE',
            'CANCELLED'
        )
    ),
    client_id uuid not null,
    items jsonb not null default '[]'::jsonb,
    subtotal numeric(10, 2) not null,
    tax_amount numeric(10, 2) not null,
    total numeric(10, 2) not null,
    amount_paid numeric(10, 2) default 0,
    balance_due numeric(10, 2) not null,
    due_date timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
-- Enable RLS for Invoices
alter table invoices enable row level security;
create policy "Users can view invoices from own company" on invoices for
select using (
        company_id in (
            select company_id
            from profiles
            where id = auth.uid()
        )
    );
create policy "Users can insert invoices for own company" on invoices for
insert with check (
        company_id in (
            select company_id
            from profiles
            where id = auth.uid()
        )
    );
-- 7. Update Companies with Stripe fields
alter table companies
add column if not exists stripe_account_id text,
    add column if not exists stripe_customer_id text;
-- Optional if managing platform customers
-- Create Companies (Tenants)
create table companies (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    slug text not null unique,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
-- Enable RLS for Companies
alter table companies enable row level security;
-- Profiles table (extends Auth Users)
create table profiles (
    id uuid references auth.users not null primary key,
    company_id uuid references companies(id),
    -- Tenant ID
    first_name text,
    last_name text,
    role text default 'staff',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
-- Enable RLS
alter table profiles enable row level security;
-- Create Estimates table
create table estimates (
    id uuid default gen_random_uuid() primary key,
    company_id uuid references companies(id) not null,
    -- Strict Multi-tenancy
    client_id uuid not null,
    -- In a real app, references clients(id)
    created_by uuid references auth.users not null,
    status text not null check (
        status in (
            'DRAFT',
            'SENT',
            'VIEWED',
            'APPROVED',
            'SIGNED',
            'REJECTED'
        )
    ),
    date_issued timestamptz default now(),
    date_expires timestamptz,
    items jsonb not null default '[]'::jsonb,
    -- Store line items as JSONB for flexibility
    subtotal numeric(10, 2) not null,
    tax_amount numeric(10, 2) not null,
    total numeric(10, 2) not null,
    deposit_amount numeric(10, 2) default 0,
    balance_due numeric(10, 2) not null,
    notes text,
    signature_id uuid,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
-- Enable RLS
alter table estimates enable row level security;
-- RLS Policies
-- Profiles: Users can view their own profile
create policy "Users can view own profile" on profiles for
select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for
update using (auth.uid() = id);
-- Companies: Users can view their own company
create policy "Users can view own company" on companies for
select using (
        id in (
            select company_id
            from profiles
            where id = auth.uid()
        )
    );
-- Estimates: Users can view estimates from their own company
create policy "Users can view estimates from own company" on estimates for
select using (
        company_id in (
            select company_id
            from profiles
            where id = auth.uid()
        )
    );
create policy "Users can insert estimates for own company" on estimates for
insert with check (
        company_id in (
            select company_id
            from profiles
            where id = auth.uid()
        )
    );
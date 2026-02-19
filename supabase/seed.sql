-- =====================================================
-- SEED DATA - ContractorIA
-- =====================================================
-- Sistema de Estimados y Facturación para Empresas de Servicios
-- =====================================================

-- Crear empresa de prueba
INSERT INTO companies (id, name, slug, logo_url, primary_color, plan_tier, is_active, settings)
VALUES (
    'c0000001-0001-0001-0001-000000000001',
    'Rivera Construction LLC',
    'rivera-construction',
    NULL,
    '#0891B2',
    'professional',
    true,
    '{"currency": "USD", "tax_rate": 8.25, "address": "123 Main St, Houston TX 77001"}'
)
ON CONFLICT (id) DO NOTHING;

-- Crear usuario de prueba en auth.users
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES
  ('u0000001-0001-0001-0001-000000000001', '00000000-0000-0000-0000-000000000000', 'admin@riveraconstruction.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated'),
  ('u0000002-0002-0002-0002-000000000002', '00000000-0000-0000-0000-000000000000', 'estimator@riveraconstruction.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- Insertar identidades
INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, created_at, updated_at)
VALUES
  ('u0000001-0001-0001-0001-000000000001', 'u0000001-0001-0001-0001-000000000001', '{"sub":"u0000001-0001-0001-0001-000000000001","email":"admin@riveraconstruction.com"}', 'email', 'u0000001-0001-0001-0001-000000000001', now(), now()),
  ('u0000002-0002-0002-0002-000000000002', 'u0000002-0002-0002-0002-000000000002', '{"sub":"u0000002-0002-0002-0002-000000000002","email":"estimator@riveraconstruction.com"}', 'email', 'u0000002-0002-0002-0002-000000000002', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Actualizar profiles con company_id
UPDATE profiles
SET
    full_name = 'Jose Rivera',
    role = 'admin',
    company_id = 'c0000001-0001-0001-0001-000000000001'
WHERE id = 'u0000001-0001-0001-0001-000000000001';

UPDATE profiles
SET
    full_name = 'Maria Garcia',
    role = 'estimator',
    company_id = 'c0000001-0001-0001-0001-000000000001'
WHERE id = 'u0000002-0002-0002-0002-000000000002';

-- Insertar clientes de prueba
INSERT INTO clients (id, company_id, first_name, last_name, email, phone, company_name, address, status)
VALUES
  ('cl000001-0001-0001-0001-000000000001', 'c0000001-0001-0001-0001-000000000001', 'John', 'Smith', 'john.smith@email.com', '555-0101', 'Smith Properties', '456 Oak Ave, Houston TX 77002', 'ACTIVE'),
  ('cl000002-0002-0002-0002-000000000002', 'c0000001-0001-0001-0001-000000000001', 'Sarah', 'Johnson', 'sarah.j@email.com', '555-0102', NULL, '789 Pine St, Houston TX 77003', 'ACTIVE'),
  ('cl000003-0003-0003-0003-000000000003', 'c0000001-0001-0001-0001-000000000001', 'Michael', 'Brown', 'mbrown@company.com', '555-0103', 'Brown & Associates', '321 Elm Rd, Houston TX 77004', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- Insertar estimados de prueba
INSERT INTO estimates (id, company_id, client_id, estimate_number, version, status, items, subtotal, tax_rate, tax_amount, total, deposit_amount, balance_due, notes, created_by)
VALUES
  (
    'est00001-0001-0001-0001-000000000001',
    'c0000001-0001-0001-0001-000000000001',
    'cl000001-0001-0001-0001-000000000001',
    'EST-001',
    1,
    'DRAFT',
    '[{"id": "item1", "description": "Kitchen Cabinet Installation", "unit_type": "unit", "quantity": 12, "rate": 350, "total": 4200}, {"id": "item2", "description": "Granite Countertop", "unit_type": "sqft", "quantity": 45, "rate": 85, "total": 3825}]',
    8025.00,
    8.25,
    662.06,
    8687.06,
    0,
    8687.06,
    'Kitchen renovation project - Phase 1',
    'u0000001-0001-0001-0001-000000000001'
  ),
  (
    'est00002-0002-0002-0002-000000000002',
    'c0000001-0001-0001-0001-000000000001',
    'cl000002-0002-0002-0002-000000000002',
    'EST-002',
    1,
    'SIGNED',
    '[{"id": "item1", "description": "Bathroom Tile Installation", "unit_type": "sqft", "quantity": 120, "rate": 15, "total": 1800}, {"id": "item2", "description": "Plumbing Fixtures", "unit_type": "unit", "quantity": 5, "rate": 250, "total": 1250}]',
    3050.00,
    8.25,
    251.63,
    3301.63,
    1000.00,
    2301.63,
    'Master bathroom remodel',
    'u0000001-0001-0001-0001-000000000001'
  )
ON CONFLICT (id) DO NOTHING;

-- Insertar proyecto de prueba
INSERT INTO projects (id, company_id, client_id, estimate_id, name, description, status, start_date)
VALUES
  (
    'prj00001-0001-0001-0001-000000000001',
    'c0000001-0001-0001-0001-000000000001',
    'cl000002-0002-0002-0002-000000000002',
    'est00002-0002-0002-0002-000000000002',
    'Master Bathroom Remodel',
    'Complete bathroom renovation including tiles, fixtures, and vanity',
    'IN_PROGRESS',
    CURRENT_DATE
  )
ON CONFLICT (id) DO NOTHING;

-- Insertar tareas de proyecto
INSERT INTO project_tasks (id, project_id, company_id, title, description, status, priority, position)
VALUES
  ('tsk00001-0001-0001-0001-000000000001', 'prj00001-0001-0001-0001-000000000001', 'c0000001-0001-0001-0001-000000000001', 'Demo existing bathroom', 'Remove old tiles, fixtures, and vanity', 'DONE', 'high', 1),
  ('tsk00002-0002-0002-0002-000000000002', 'prj00001-0001-0001-0001-000000000001', 'c0000001-0001-0001-0001-000000000001', 'Plumbing rough-in', 'Install new plumbing lines', 'IN_PROGRESS', 'high', 2),
  ('tsk00003-0003-0003-0003-000000000003', 'prj00001-0001-0001-0001-000000000001', 'c0000001-0001-0001-0001-000000000001', 'Tile installation', 'Install floor and wall tiles', 'TODO', 'medium', 3),
  ('tsk00004-0004-0004-0004-000000000004', 'prj00001-0001-0001-0001-000000000001', 'c0000001-0001-0001-0001-000000000001', 'Fixture installation', 'Install toilet, sink, and shower', 'TODO', 'medium', 4)
ON CONFLICT (id) DO NOTHING;

-- Verificar datos insertados
SELECT 'companies:' as tabla, count(*) as total FROM companies;
SELECT 'profiles:' as tabla, count(*) as total FROM profiles WHERE company_id IS NOT NULL;
SELECT 'clients:' as tabla, count(*) as total FROM clients;
SELECT 'estimates:' as tabla, count(*) as total FROM estimates;
SELECT 'projects:' as tabla, count(*) as total FROM projects;
SELECT 'project_tasks:' as tabla, count(*) as total FROM project_tasks;

-- =====================================================
-- CREDENCIALES DE PRUEBA:
-- Email: admin@riveraconstruction.com | Password: password123
-- Email: estimator@riveraconstruction.com | Password: password123
-- Tenant Slug: rivera-construction
-- =====================================================

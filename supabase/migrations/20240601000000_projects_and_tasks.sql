-- =====================================================
-- PROJECTS TABLE - Migración Segura (Idempotente)
-- =====================================================

-- Paso 1: Crear tabla si no existe (estructura base ContractorIA)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Proyecto Sin Nombre',
    status TEXT NOT NULL DEFAULT 'PLANNING',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Paso 2: Agregar columnas que podrían faltar (seguro si ya existen)
DO $$
BEGIN
    -- Agregar company_id si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'projects' AND column_name = 'company_id') THEN
        ALTER TABLE projects ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE;
    END IF;

    -- Agregar client_id si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'projects' AND column_name = 'client_id') THEN
        ALTER TABLE projects ADD COLUMN client_id UUID;
    END IF;

    -- Agregar estimate_id si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'projects' AND column_name = 'estimate_id') THEN
        ALTER TABLE projects ADD COLUMN estimate_id UUID REFERENCES estimates(id) ON DELETE SET NULL;
    END IF;

    -- Agregar name si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'projects' AND column_name = 'name') THEN
        ALTER TABLE projects ADD COLUMN name TEXT NOT NULL DEFAULT 'Proyecto';
    END IF;

    -- Agregar description si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'projects' AND column_name = 'description') THEN
        ALTER TABLE projects ADD COLUMN description TEXT;
    END IF;

    -- Agregar status si no existe (o actualizar constraint)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'projects' AND column_name = 'status') THEN
        ALTER TABLE projects ADD COLUMN status TEXT NOT NULL DEFAULT 'PLANNING';
    END IF;

    -- Agregar start_date si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'projects' AND column_name = 'start_date') THEN
        ALTER TABLE projects ADD COLUMN start_date DATE;
    END IF;

    -- Agregar end_date si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'projects' AND column_name = 'end_date') THEN
        ALTER TABLE projects ADD COLUMN end_date DATE;
    END IF;
END $$;

-- Paso 3: Crear índices (solo si columna existe)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'projects' AND column_name = 'company_id') THEN
        CREATE INDEX IF NOT EXISTS idx_projects_company_id ON projects(company_id);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'projects' AND column_name = 'client_id') THEN
        CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'projects' AND column_name = 'status') THEN
        CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'projects' AND column_name = 'estimate_id') THEN
        CREATE INDEX IF NOT EXISTS idx_projects_estimate_id ON projects(estimate_id);
    END IF;
END $$;

-- RLS para projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view projects from own company" ON projects;
CREATE POLICY "Users can view projects from own company" ON projects
    FOR SELECT USING (
        company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can insert projects for own company" ON projects;
CREATE POLICY "Users can insert projects for own company" ON projects
    FOR INSERT WITH CHECK (
        company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can update projects from own company" ON projects;
CREATE POLICY "Users can update projects from own company" ON projects
    FOR UPDATE USING (
        company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can delete projects from own company" ON projects;
CREATE POLICY "Users can delete projects from own company" ON projects
    FOR DELETE USING (
        company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
    );

-- =====================================================
-- PROJECT_TASKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS project_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'TODO' CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
    due_date DATE,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para project_tasks
CREATE INDEX IF NOT EXISTS idx_project_tasks_project_id ON project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_company_id ON project_tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_status ON project_tasks(status);
CREATE INDEX IF NOT EXISTS idx_project_tasks_assigned_to ON project_tasks(assigned_to);

-- RLS para project_tasks
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view tasks from own company" ON project_tasks;
CREATE POLICY "Users can view tasks from own company" ON project_tasks
    FOR SELECT USING (
        company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can insert tasks for own company" ON project_tasks;
CREATE POLICY "Users can insert tasks for own company" ON project_tasks
    FOR INSERT WITH CHECK (
        company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can update tasks from own company" ON project_tasks;
CREATE POLICY "Users can update tasks from own company" ON project_tasks
    FOR UPDATE USING (
        company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can delete tasks from own company" ON project_tasks;
CREATE POLICY "Users can delete tasks from own company" ON project_tasks
    FOR DELETE USING (
        company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())
    );

-- =====================================================
-- TRIGGER: Actualizar updated_at automáticamente
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS project_tasks_updated_at ON project_tasks;
CREATE TRIGGER project_tasks_updated_at
    BEFORE UPDATE ON project_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- MonoSpec: Supabase Standalone Schema
-- Execute directly in Supabase SQL Editor
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COMPANIES
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE CHECK (code IN ('awamer', 'creative_system')),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. TRAINING DATASETS
CREATE TABLE IF NOT EXISTS training_datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    project_title TEXT NOT NULL,
    scope_description TEXT NOT NULL,
    technical_analysis TEXT NOT NULL,
    figma_reference_url TEXT,
    demo_app_url TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    raw_brief TEXT NOT NULL,
    figma_file_url TEXT,
    demo_preview_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. PROJECT CHATS
CREATE TABLE IF NOT EXISTS project_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    stage TEXT NOT NULL CHECK (
        stage IN (
            'technical_analysis',
            'ui_ux_design',
            'software_engineering',
            'qa_testing',
            'content_strategy',
            'technical_support'
        )
    ),
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_project_stage UNIQUE (project_id, stage)
);

-- 5. INDEXES
CREATE INDEX IF NOT EXISTS idx_companies_code ON companies(code);
CREATE INDEX IF NOT EXISTS idx_training_datasets_company_id ON training_datasets(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_company_id ON projects(company_id);
CREATE INDEX IF NOT EXISTS idx_project_chats_project_id ON project_chats(project_id);
CREATE INDEX IF NOT EXISTS idx_project_chats_stage ON project_chats(project_id, stage);

-- 6. AUTO-UPDATE TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION set_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_project_chats_updated_at ON project_chats;
CREATE TRIGGER trigger_set_project_chats_updated_at
    BEFORE UPDATE ON project_chats
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at_column();

-- 7. ROW LEVEL SECURITY
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on companies" ON companies FOR SELECT USING (true);
CREATE POLICY "Allow public read access on training_datasets" ON training_datasets FOR SELECT USING (true);
CREATE POLICY "Allow public read access on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access on project_chats" ON project_chats FOR SELECT USING (true);

CREATE POLICY "Allow write operations on projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write operations on project_chats" ON project_chats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write operations on training_datasets" ON training_datasets FOR ALL USING (true) WITH CHECK (true);

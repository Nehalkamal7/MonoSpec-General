-- ==============================================================================
-- MonoSpec: Enterprise Software Architecture & Design System Specification
-- Supabase Schema & Migration
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean Drop if Re-running Migration (in development)
-- DROP TABLE IF EXISTS project_chats CASCADE;
-- DROP TABLE IF EXISTS projects CASCADE;
-- DROP TABLE IF EXISTS training_datasets CASCADE;
-- DROP TABLE IF EXISTS companies CASCADE;

-- ==============================================================================
-- TABLE: companies
-- ==============================================================================
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE CHECK (code IN ('awamer', 'creative_system')),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE: training_datasets
-- ==============================================================================
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

-- ==============================================================================
-- TABLE: projects
-- ==============================================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    raw_brief TEXT NOT NULL,
    figma_file_url TEXT,
    demo_preview_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE: project_chats
-- ==============================================================================
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

-- ==============================================================================
-- INDEXES FOR HIGH-PERFORMANCE QUERIES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_companies_code ON companies(code);
CREATE INDEX IF NOT EXISTS idx_training_datasets_company_id ON training_datasets(company_id);
CREATE INDEX IF NOT EXISTS idx_training_datasets_created_at ON training_datasets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_company_id ON projects(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_chats_project_id ON project_chats(project_id);
CREATE INDEX IF NOT EXISTS idx_project_chats_stage ON project_chats(project_id, stage);

-- ==============================================================================
-- TRIGGER: Auto-update updated_at for project_chats
-- ==============================================================================
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

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_chats ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for anon client exploration)
CREATE POLICY "Allow public read access on companies" 
    ON companies FOR SELECT USING (true);

CREATE POLICY "Allow public read access on training_datasets" 
    ON training_datasets FOR SELECT USING (true);

CREATE POLICY "Allow public read access on projects" 
    ON projects FOR SELECT USING (true);

CREATE POLICY "Allow public read access on project_chats" 
    ON project_chats FOR SELECT USING (true);

-- Allow authenticated or anon CRUD (customizable according to deployment security rules)
CREATE POLICY "Allow write operations on projects" 
    ON projects FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow write operations on project_chats" 
    ON project_chats FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow write operations on training_datasets" 
    ON training_datasets FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================
INSERT INTO companies (id, code, name)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'awamer', 'Awamer Alshabaka'),
    ('22222222-2222-2222-2222-222222222222', 'creative_system', 'Creative System')
ON CONFLICT (code) DO UPDATE 
SET name = EXCLUDED.name;

-- Seed Sample Training Datasets for Awamer Alshabaka
INSERT INTO training_datasets (
    id,
    company_id,
    project_title,
    scope_description,
    technical_analysis,
    figma_reference_url,
    demo_app_url,
    metadata
) VALUES (
    '33333333-3333-3333-3333-333333333331',
    '11111111-1111-1111-1111-111111111111',
    'B2B Freight Brokerage & Telemetry Architecture',
    'Autonomous logistics orchestration and customs declaration engine for 14,000+ carriers with ZATCA Phase-2 compliance.',
    'System topology with Kafka event streaming, partitioned PostgreSQL with PostGIS, and Redis distributed idempotency locks.',
    'https://figma.com/@monospec/awm-freight-design-system',
    'https://freight.awamer.internal',
    '{"tier": "Tier 1 Enterprise", "compliance": ["ZATCA Phase 2", "ISO 27001"], "target_throughput_rps": 18500}'::jsonb
), (
    '33333333-3333-3333-3333-333333333332',
    '22222222-2222-2222-2222-222222222222',
    'SoftPOS Tap-on-Phone Cryptographic Kernel',
    'PCI-CPoC compliant contactless terminal engine with DUKPT key derivation and hardware Keystore attestation.',
    'Sub-80ms transaction settlement via WebAssembly Rust ISO-8583 message serialization and multi-region sovereign cluster.',
    'https://figma.com/@creativesystem/softpos-sdk',
    'https://wallet.creativesystem.io',
    '{"tier": "Mission Critical", "compliance": ["PCI-CPoC", "SAMA Regulations"], "target_throughput_rps": 25000}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Project
INSERT INTO projects (
    id,
    company_id,
    title,
    raw_brief,
    figma_file_url,
    demo_preview_url
) VALUES (
    '44444444-4444-4444-4444-444444444441',
    '11111111-1111-1111-1111-111111111111',
    'B2B Logistics & Freight Platform',
    'Build an enterprise freight dispatching platform with real-time waypoint streaming, GPS telemetry ingestion, and automated customs clearance manifests.',
    'https://figma.com/@monospec/awm-freight-design-system',
    'https://freight.awamer.internal'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Stage Chats for Sample Project
INSERT INTO project_chats (
    project_id,
    stage,
    messages
) VALUES (
    '44444444-4444-4444-4444-444444444441',
    'technical_analysis',
    '[
        {
            "id": "msg-01",
            "sender": "assistant",
            "content": "### MonoSpec Architectural Analysis Engine\\nInitialized system topology for **B2B Logistics & Freight Platform**.\\n\\n- **Throughput target:** 18,500 RPS\\n- **Persistence:** PostgreSQL 16 Partitioned + PostGIS\\n- **Broker:** Apache Kafka with Redis SHA-256 idempotency locks",
            "timestamp": "2026-10-14T11:20:00Z"
        },
        {
            "id": "msg-02",
            "sender": "user",
            "content": "Can you specify the Redis lock acquisition strategy to prevent duplicate webhook retries?",
            "timestamp": "2026-10-14T11:28:00Z"
        },
        {
            "id": "msg-03",
            "sender": "assistant",
            "content": "### Idempotency Strategy\\nWe employ a distributed lock with key format `idemp:<sha256(carrier_id + waybill_no + window)>` using `SET NX EX 120`. If lock acquisition fails, an immediate HTTP 202 is returned.",
            "timestamp": "2026-10-14T11:30:00Z"
        }
    ]'::jsonb
), (
    '44444444-4444-4444-4444-444444444441',
    'ui_ux_design',
    '[
        {
            "id": "msg-ui-01",
            "sender": "assistant",
            "content": "UI/UX Design stage initialized. Design tokens aligned with MonoSpec Strict Monochrome system (#000000 / #ffffff / #18181b / #27272a).",
            "timestamp": "2026-10-14T11:35:00Z"
        }
    ]'::jsonb
)
ON CONFLICT (project_id, stage) DO NOTHING;

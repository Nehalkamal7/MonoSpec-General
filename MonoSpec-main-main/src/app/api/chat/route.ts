import { NextRequest, NextResponse } from 'next/server';
import {
  getCompanyByCode,
  listTrainingDatasets,
  appendChatMessage,
} from '@/lib/supabaseClient';
import { CompanyCode, ProjectChatStage, TrainingDatasetRow } from '@/types/database.types';

// Map legacy or frontend stage keys to database stage keys if needed
function normalizeStage(stage: string): ProjectChatStage {
  const map: Record<string, ProjectChatStage> = {
    tech_analysis: 'technical_analysis',
    technical_analysis: 'technical_analysis',
    logo: 'logo_branding',
    logo_branding: 'logo_branding',
    ui_ux: 'ui_ux_design',
    ui_ux_design: 'ui_ux_design',
    engineering: 'software_engineering',
    software_engineering: 'software_engineering',
    qa_testing: 'qa_testing',
    content: 'content_strategy',
    content_strategy: 'content_strategy',
    devops: 'technical_support',
    technical_support: 'technical_support',
  };

  return map[stage] || 'technical_analysis';
}

function normalizeCompanyCode(code: string): CompanyCode {
  if (code === 'creative' || code === 'creative_system') return 'creative_system';
  return 'awamer';
}

/**
 * 1. Stage-Aware Agent Routing Prompts
 */
const STAGE_INSTRUCTIONS: Record<ProjectChatStage, { title: string; instructions: string }> = {
  technical_analysis: {
    title: 'Enterprise Technical Analysis & SRS Architecture',
    instructions: `
You are the Chief Technical Architect. Formulate an exhaustive Software Requirements Specification (SRS) with:
1. System Topology & Architectural Invariants (Microservices, Event Streams, High-Availability SLA).
2. Entity Relationship Model (Core database entities, relational constraints, partition strategy).
3. Integration Matrix (External APIs, Webhooks, Idempotency keys, Circuit Breakers).
4. Phased Milestone Roadmap with formal acceptance gates and non-functional requirements (NFRs).
Output format: Precision Markdown with bullet points, ASCII/Mermaid flowcharts, and markdown tables.
`,
  },
  logo_branding: {
    title: 'Brand Identity, Geometric Logomark & Vector Design System',
    instructions: `
You are the Executive Brand Identity Director & Design Technologist. Formulate the visual brand specification with:
1. Logomark Geometry & Mathematical Construction (Proportions, grid balance, golden ratio alignment).
2. Valid Standalone SVG Vector Markup: Provide complete, valid \`\`\`svg ... \`\`\` blocks for the brand mark that render crisply.
3. High-Contrast Enterprise Color Token Matrix (HEX, HSL, RGB for dark and light surfaces).
4. Typography Hierarchy (Primary Brand Typeface, Display headings, Microcopy and Monospace pairings).
5. Brand Application & Asset Specs (Favicon 16/32px, App Store icons, Negatives & Isolation boundary).
Output format: Structured Markdown with clean SVG vector blocks and token tables.
`,
  },
  ui_ux_design: {
    title: 'UI/UX Design System & Figma Component Specifications',
    instructions: `
You are the Principal Design Technologist. Formulate the UI/UX architecture with:
1. Information Architecture & Navigation hierarchy.
2. Component specifications (Tokens, spacing, typography scales, accessibility contrast ratios).
3. Figma-Ready Semantic Markup: Provide pure, valid HTML + Tailwind CSS snippets that can be pasted directly into Figma using "HTML to Design" plugins.
4. Micro-interactions and interactive states (default, hover, active, focus, disabled).
Output format: Clean structured Markdown with dedicated \`\`\`html code blocks containing semantic Tailwind markup.
`,
  },
  software_engineering: {
    title: 'Software Engineering & Core Implementation Blueprint',
    instructions: `
You are the Staff Principal Engineer. Deliver clean, production-grade implementation blueprints:
1. Robust API route handlers with request validation (Zod schemas, input sanitization).
2. Database migration scripts (PostgreSQL, indexes, constraints, trigger functions).
3. Resilient concurrency patterns (Distributed Redis locks, retry exponential backoff).
4. Frontend state orchestration and TypeScript contracts.
Output format: Production-ready TypeScript and SQL code blocks with minimal boilerplate and clear explanatory comments.
`,
  },
  qa_testing: {
    title: 'QA, BDD Test Engineering & Automated Verification',
    instructions: `
You are the Lead QA & Test Automation Architect. Formulate exhaustive verification protocols:
1. Behavior-Driven Development (BDD) test suites using standard Gherkin syntax (Feature, Scenario, Given, When, Then).
2. Boundary and Edge-case matrices (Concurrency races, payload overflow, network partition simulation).
3. Security, penetration testing, and auth validation (CSRF, JWT expiration, IDOR, SQL injection).
4. High-throughput performance benchmarking protocols (Target RPS, P95/P99 latency thresholds).
Output format: Structured Markdown with Gherkin code blocks and verification checklists.
`,
  },
  content_strategy: {
    title: 'Bilingual Digital Content & UX Copywriting Architecture',
    instructions: `
You are the Bilingual UX Copy Lead & Content Strategist. Formulate copy specifications:
1. Dual-Language Microcopy (English & Arabic - Modern Standard / Gulf Business format).
2. Empty States, Modal Dialogs, and Error Interventions with clear recovery actions.
3. Transactional notifications (SMS, Push, In-App alerts, and Email confirmation copies).
4. Tone of Voice guidelines aligned with the selected enterprise organization.
Output format: Parallel bilingual tables (English | Arabic) and clear contextual usage rules.
`,
  },
  technical_support: {
    title: 'DevOps, Site Reliability & Incident Playbook Architecture',
    instructions: `
You are the Lead Site Reliability Engineer (SRE). Formulate the operational runbook:
1. Containerization & Orchestration (Production Dockerfile, Docker Compose / Kubernetes manifests).
2. CI/CD pipeline triggers and immutable blue/green deployment strategy.
3. Observability telemetry (Prometheus metrics, Grafana dashboards, OpenTelemetry distributed tracing).
4. Severity 0/1 Incident response playbook with step-by-step triage and rollback procedures.
Output format: Production YAML configurations, Shell runbook scripts, and structured incident triage procedures.
`,
  },
};

/**
 * 2. Company Style Conditioning
 */
function getCompanyStylePrompt(code: CompanyCode): string {
  if (code === 'awamer') {
    return `
### COMPANY GOVERNANCE CONDITIONING: Awamer Alshabaka (أوامر الشبكة)
- Compliance Mandate: Strictly observe Saudi digital regulations, CITC governance, ZATCA Phase-2 e-invoicing standards, and NCA cybersecurity controls.
- Infrastructure: Multi-zone Saudi sovereign cloud deployment, AES-256 at rest, strict tenant data localization.
- Tone & Cadence: Authoritative enterprise rigor, formal milestone sign-offs, and dual-language audit trails.
`;
  }

  return `
### COMPANY GOVERNANCE CONDITIONING: Creative System
- Architecture Philosophy: Cutting-edge modular design, composable headless microservices, and reactive event-driven telemetry.
- Performance Standard: Sub-100ms P99 latency, sleek aesthetic precision, and developer-first documentation.
- Tone & Cadence: Innovative, agile, hyper-efficient, and engineered for high-growth tech ecosystems.
`;
}

/**
 * 3. Context & Few-Shot Retrieval Hook from Supabase
 */
async function retrieveTrainingContext(companyCode: CompanyCode): Promise<string> {
  try {
    const { data: company } = await getCompanyByCode(companyCode);
    if (!company) return '';

    const { data: datasets } = await listTrainingDatasets({ companyId: company.id });
    if (!datasets || datasets.length === 0) return '';

    const references = datasets.slice(0, 2).map((ds: TrainingDatasetRow, idx: number) => `
#### Reference Benchmark #${idx + 1}: ${ds.project_title}
- **Scope**: ${ds.scope_description}
- **Technical Analysis Reference**: ${ds.technical_analysis}
${ds.figma_reference_url ? `- **Design System Reference**: ${ds.figma_reference_url}` : ''}
${ds.demo_app_url ? `- **Live Architecture**: ${ds.demo_app_url}` : ''}
`).join('\n');

    return `
### RETRIEVED HISTORICAL COMPANY BENCHMARKS (FEW-SHOT CONTEXT)
The following approved projects represent past gold-standard outputs for this company. Ensure tone, depth, and standards match or exceed this benchmark:
${references}
`;
  } catch (err) {
    console.warn('[MonoSpec AI Pipeline] Context retrieval fallback:', err);
    return '';
  }
}

/**
 * Fallback Content Generator for Offline / Unconnected Environments
 */
function generateRealisticStageSpec(
  stage: ProjectChatStage,
  companyCode: CompanyCode,
  userMessage: string,
  isArabic = false
): string {
  const isAwamer = companyCode === 'awamer';

  if (isArabic) {
    switch (stage) {
      case 'technical_analysis':
        return `### مواصفة التحليل المعماري للنظام (MonoSpec)
**السياق:** ${userMessage}
**المنشأة المستهدفة:** ${isAwamer ? 'أوامر الشبكة (المعيار السيادي المعتمد)' : 'النظام الإبداعي (الأداء الفائق الحديث)'}

#### 1. طوبولوجيا النظام وضوابط المعمارية
- **القدرة الاستيعابية:** استهداف 22,000 طلب بالثانية مع زمن استجابة P99 < 65ms.
- **طبقة استبقاء البيانات:** قاعدة بيانات PostgreSQL 16 مقسمة مع ملحقات TimescaleDB و PostGIS.
- **وسيط الرسائل:** Apache Kafka مع تقسيم متعدد المستأجرين عبر المفتاح \`tenant_id + entity_id\`.
- **ضمان عدم التكرار (Idempotency):** أقفال موزعة في Redis بصيغة \`idemp:<sha256(payload + timestamp_window)>\` مع فترة صلاحية 120 ثانية.

#### 2. الكيانات البرمجية الأساسية
| الكيان | محرك التخزين | المفاتيح الأساسية | استراتيجية الفهرسة |
| :--- | :--- | :--- | :--- |
| \`organizations\` | علائقي (PG) | UUIDv7 | \`idx_org_code_active\` |
| \`audit_events\` | سجل غير قابل للتعديل | UUIDv7 + الوقت | تقسيم شهري للبيانات |
| \`telemetry_stream\` | جداول زمنية مجمعة | معرف الجهاز + الوقت | فهرس معكوس مركب |

#### 3. بوابات الأمان والامتثال
${isAwamer 
  ? '- **هيئة الاتصالات وهيئة الزكاة والضريبة:** ختم تشفيري معتمد، وتجزئة SHA-256، واستبقاء كامل للبيانات داخل المملكة.\n- **ضوابط الهيئة الوطنية للأمن السيبراني (ECC-1:2018):** تحكم دقيق في الوصول المبني على الأدوار RBAC مع سجل تدقيق غير قابل للتغيير.'
  : '- **معايير PCI-DSS و SOC2:** تجزئة الخدمات المصغرة مع تشفير ثنائي mTLS عبر شبكة Istio.\n- **معيار OpenTelemetry:** تمرير سياق التتبع الموزع عبر كافة بوابات HTTP و gRPC.'}
`;

      case 'logo_branding':
        return `### مواصفة الهوية البصرية والشعار الهندسي المتجهي
**النطاق:** ${userMessage}
**معيار التصميم:** تباين أحادي فائق الدقة مع عنصر تمييز ديناميكي

#### 1. بناء الشعار الهندسي (كود SVG متجهي نقي)
\`\`\`svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 80" width="280" height="80" class="w-56 h-16">
  <rect width="280" height="80" rx="14" fill="#09090b" stroke="#27272a" stroke-width="2"/>
  <path d="M35 55 L52 24 L69 55 L59 55 L52 41 L45 55 Z" fill="#ffffff" />
  <circle cx="72" cy="30" r="4.5" fill="#22c55e" />
  <text x="88" y="47" font-family="monospace" font-size="20" font-weight="900" fill="#ffffff" letter-spacing="2">SPEC</text>
  <text x="156" y="47" font-family="sans-serif" font-size="14" font-weight="300" fill="#a1a1aa">BRAND</text>
  <circle cx="250" cy="40" r="3" fill="#71717a" />
</svg>
\`\`\`

#### 2. جدول رموز ألوان الهوية
| الرمز | كود HEX | المقابل في HSL | الغرض الدلالي |
| :--- | :--- | :--- | :--- |
| \`--brand-base\` | \`#09090b\` | \`hsl(240, 10%, 4%)\` | طبقة الخلفية الأساسية |
| \`--brand-mark-contrast\` | \`#ffffff\` | \`hsl(0, 0%, 100%)\` | علامة الشعار البصرية الرئيسية |
| \`--brand-grid-border\` | \`#27272a\` | \`hsl(240, 5%, 16%)\` | حدود العزل الهندسي |
| \`--brand-status-signal\` | \`#22c55e\` | \`hsl(142, 71%, 45%)\` | نقطة التشغيل الحية |
`;

      case 'ui_ux_design':
        return `### مواصفة نظام واجهات وتجربة المستخدم وكود Figma
**النطاق:** ${userMessage}

#### 1. هيكل المعلومات وتوزيع الشاشات
- **نموذج التخطيط:** مساحة عمل مزدوجة (شريط جانبي 260px، ومساحة العمل الرئيسية بنسبة مرنة).
- **التوجه الجمالي:** أحادي داكن دقيق (#000000 أسود خالص، #ffffff أبيض نقي، مع لمسات رمادية).

#### 2. كود HTML و Tailwind جاهز لبرنامج Figma
\`\`\`html
<div class="w-full max-w-4xl p-6 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-sans">
  <div class="flex items-center justify-between pb-4 border-b border-zinc-800">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-white text-black font-mono font-black flex items-center justify-center text-sm">MS</div>
      <div>
        <h4 class="text-sm font-semibold text-white">MonoSpec Design System</h4>
        <p class="text-xs text-zinc-400 font-mono">UI/UX Stage Invariant</p>
      </div>
    </div>
  </div>
</div>
\`\`\`
`;

      case 'software_engineering':
        return `### مخطط التنفيذ الهندسي والبرمجي
**الميزة المستهدفة:** ${userMessage}

\`\`\`typescript
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

const RequestSchema = z.object({
  entityId: z.string().uuid(),
  action: z.enum(['PROCESS', 'VERIFY', 'ARCHIVE']),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const payload = RequestSchema.parse(rawBody);

    const lockKey = \`lock:entity:\${payload.entityId}\`;
    
    return NextResponse.json({
      success: true,
      transactionId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      status: 'COMMITTED',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
\`\`\`
`;

      case 'qa_testing':
        return `### بروتوكول فحص الجودة ومجموعة اختبارات BDD
**الخاصية:** ${userMessage}

\`\`\`gherkin
خاصية: مسار معالجة المعاملات عالية الأداء
  كمحرك ربط وتكامل مؤسسي
  أحتاج إلى ضمان عدم تكرار تنفيذ العمليات مطلقاً
  حتى لا تؤدي إعادة إرسال إشعارات Webhook إلى تلف سجل الحسابات

  الخلفية:
    بفرض أن مجموعة خوادم Redis الموزعة تعمل بزمن استجابة أقل من 5ms
    وأن رمز مصادقة المستأجر تم التحقق منه رقمياً

  سيناريو: معالجة معاملة متطابقة خلال نافذة عدم التكرار (60 ثانية)
    بفرض ورود طلب إرسال مع تدقيق تجزئة صالح
    عندما يستقبل المسار الطلب للمرة الأولى
    حينئذ يتم حجز القفل الموزع بنجاح
    ويتم إرجاع حالة 201 Created مع إيصال العملية
    وعند ورود طلب Webhook مكرر بنفس كود التجزئة
    حينئذ تفشل عملية حجز القفل بحالة 409 Conflict
    ولا تتم كتابة أي مدخل مكرر في السجل
\`\`\`
`;

      case 'content_strategy':
        return `### استراتيجية المحتوى وصياغة النصوص الرقمية

| المفتاح / السياق | النص باللغة العربية (العربية الفصحى المعاصرة) |
| :--- | :--- |
| \`header.title\` | لوحة المعمارية المؤسسية المتكاملة |
| \`status.synced\` | تم مزامنة كافة المواصفات مع قاعدة البيانات المركزية |
| \`modal.confirm\` | تأكيد اعتماد النموذج المعماري |
| \`error.timeout\` | تعذر الاتصال بالبوابة المركزية، جاري إعادة المحاولة |
| \`empty.state\` | لا توجد مواصفات فنية مدخلة في هذه المرحلة حتى الآن |
`;

      case 'technical_support':
        return `### ملف بنية التشغيل التحتية ونشر الخدمات (DevOps)
**البيئة المستهدفة:** بيئة التشغيل الإنتاجية متعددة الحاويات

\`\`\`yaml
version: '3.9'

services:
  monospec-core:
    image: monospec/core:2.0.0-enterprise
    restart: always
    deploy:
      replicas: 4
      resources:
        limits:
          cpus: '2.0'
          memory: 4096M
    environment:
      - NODE_ENV=production
      - PORT=3000
      - KSA_SOVEREIGN_MODE=enabled
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 10s
      timeout: 3s
      retries: 3
    ports:
      - "3000:3000"
\`\`\`
`;
    }
  }

  switch (stage) {
    case 'technical_analysis':
      return `### MonoSpec Architectural Analysis Specification
**Context:** ${userMessage}
**Target Organization:** ${isAwamer ? 'Awamer Alshabaka (KSA Sovereign Standard)' : 'Creative System (Modern High-Throughput)'}

#### 1. System Topology & Invariant Matrix
- **Throughput Capability:** Target 22,000 RPS sustained, P99 < 65ms.
- **Persistence Layer:** PostgreSQL 16 partitioned with TimescaleDB / PostGIS extensions.
- **Message Broker:** Apache Kafka with multi-tenant partition keying by \`tenant_id + entity_id\`.
- **Idempotency Strategy:** Redis distributed locks with key format \`idemp:<sha256(payload + timestamp_window)>\` using TTL 120s.

#### 2. Core Entities
| Entity | Storage Engine | Primary Keys | Indexing Strategy |
| :--- | :--- | :--- | :--- |
| \`organizations\` | Relational (PG) | UUIDv7 | \`idx_org_code_active\` |
| \`audit_events\` | Append-only partitioned | UUIDv7 + Timestamp | Partitioned by Month |
| \`telemetry_stream\` | TimescaleDB Hypertable | Device ID + Time | Composite inverted index |

#### 3. Compliance & Governance Gates
${isAwamer 
  ? '- **CITC & ZATCA Phase 2:** Fully integrated cryptographic stamp, SHA-256 invoice hashing, and KSA data residency.\n- **NCA Essential Cybersecurity Controls (ECC-1:2018):** Strict role-based RBAC with immutable audit trails.'
  : '- **PCI-DSS & SOC2 Type II:** Microservice segmentation with mutual TLS (mTLS) via Istio service mesh.\n- **OpenTelemetry Standard:** Distributed trace context propagation across all HTTP/gRPC ingress.'}
`;

    case 'logo_branding':
      return `### Brand Identity & Geometric Logomark Specification
**Scope:** ${userMessage}
**System Design Standard:** Ultra-High Contrast Monochrome & Semantic Accent

#### 1. Geometric Logomark Construction (Pure SVG Vector)
*Renderable standalone SVG vector with mathematical 45-degree angle chevrons and status node:*

\`\`\`svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 80" width="280" height="80" class="w-56 h-16">
  <rect width="280" height="80" rx="14" fill="#09090b" stroke="#27272a" stroke-width="2"/>
  <path d="M35 55 L52 24 L69 55 L59 55 L52 41 L45 55 Z" fill="#ffffff" />
  <circle cx="72" cy="30" r="4.5" fill="#22c55e" />
  <text x="88" y="47" font-family="monospace" font-size="20" font-weight="900" fill="#ffffff" letter-spacing="2">SPEC</text>
  <text x="156" y="47" font-family="sans-serif" font-size="14" font-weight="300" fill="#a1a1aa">BRAND</text>
  <circle cx="250" cy="40" r="3" fill="#71717a" />
</svg>
\`\`\`

#### 2. Color Palette Token Matrix
| Token Key | HEX | HSL Equivalent | Semantic Purpose |
| :--- | :--- | :--- | :--- |
| \`--brand-base\` | \`#09090b\` | \`hsl(240, 10%, 4%)\` | Canvas Base Layer |
| \`--brand-mark-contrast\` | \`#ffffff\` | \`hsl(0, 0%, 100%)\` | Primary Visual Mark |
| \`--brand-grid-border\` | \`#27272a\` | \`hsl(240, 5%, 16%)\` | Geometric Isolation Bounds |
| \`--brand-status-signal\` | \`#22c55e\` | \`hsl(142, 71%, 45%)\` | Live Operational Active Node |

#### 3. Font Scale & Pairings
- **Display Markings:** JetBrains Mono (Weight 800) / Space Grotesk.
- **Enterprise Body Copy:** Inter (Weight 400, 500, 600) + IBM Plex Sans Arabic.
`;

    case 'ui_ux_design':
      return `### UI/UX Design System Specification & Figma Code
**Scope:** ${userMessage}

#### 1. Information Architecture
- **Layout Model:** Dual-column developer workspace (Sidebar 260px, Main canvas auto-flex).
- **Aesthetic Direction:** Strict Monochrome (#000000 pure black, #ffffff pure white, #18181b / #27272a accents).

#### 2. Figma-Ready HTML + Tailwind Markup
*Ready for immediate copy/paste into the Figma "HTML to Design" plugin:*

\`\`\`html
<div class="w-full max-w-4xl p-6 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-sans">
  <div class="flex items-center justify-between pb-4 border-b border-zinc-800">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-white text-black font-mono font-bold flex items-center justify-center text-sm">
        MS
      </div>
      <div>
        <h3 class="text-sm font-semibold tracking-tight">Enterprise Telemetry Node</h3>
        <p class="text-xs text-zinc-400 font-mono">Status: Sovereign Active</p>
      </div>
    </div>
    <span class="px-2.5 py-1 text-xs font-mono rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300">
      ZATCA Phase-2 Validated
    </span>
  </div>
  
  <div class="grid grid-cols-3 gap-4 mt-4">
    <div class="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800">
      <span class="text-xs text-zinc-400">Peak Load</span>
      <p class="text-xl font-mono font-bold mt-1">24,500 <span class="text-xs text-zinc-500">RPS</span></p>
    </div>
    <div class="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800">
      <span class="text-xs text-zinc-400">P99 Latency</span>
      <p class="text-xl font-mono font-bold mt-1">42 <span class="text-xs text-zinc-500">ms</span></p>
    </div>
    <div class="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800">
      <span class="text-xs text-zinc-400">Security Gate</span>
      <p class="text-xl font-mono font-bold mt-1 text-emerald-400">100% Passed</p>
    </div>
  </div>
</div>
\`\`\`
`;

    case 'software_engineering':
      return `### Software Engineering Implementation Blueprint
**Module:** Core Execution Handler for ${userMessage}

\`\`\`typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const RequestSchema = z.object({
  entityId: z.string().uuid(),
  action: z.enum(['PROCESS', 'DISPATCH', 'SETTLE']),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const payload = RequestSchema.parse(rawBody);

    // Distributed idempotency lock
    const lockKey = \`lock:entity:\${payload.entityId}\`;
    
    // Core transactional execution with row-level integrity
    return NextResponse.json({
      success: true,
      transactionId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      status: 'COMMITTED',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
\`\`\`
`;

    case 'qa_testing':
      return `### QA Verification Protocol & BDD Test Suite
**Feature:** ${userMessage}

\`\`\`gherkin
Feature: Enterprise High-Throughput Processing Pipeline
  As an Enterprise Integration Engine
  I need to guarantee strict transaction idempotency and zero duplicate execution
  So that high-frequency webhook retries do not corrupt financial ledger state

  Background:
    Given the distributed Redis lock cluster is healthy with latency < 5ms
    And the tenant authentication token is cryptographically verified

  Scenario: Processing identical transaction within 60s idempotent window
    Given an inbound dispatch request with payload checksum "sha256-d7a8e..."
    When the endpoint receives the request for the first time
    Then the distributed lock "idemp:sha256-d7a8e..." is successfully acquired
    And a 201 Created status is returned with transaction receipt
    When a duplicate webhook retry arrives with the exact same checksum
    Then the lock acquisition fails with HTTP 409 Conflict
    And no duplicate entry is written to the audit ledger
\`\`\`
`;

    case 'content_strategy':
      return `### Bilingual Content Strategy & UX Microcopy Matrix

| Key / Context | English Microcopy | Arabic Microcopy (العربية المعيارية) |
| :--- | :--- | :--- |
| \`header.title\` | Enterprise Architecture Canvas | لوحة المعمارية المؤسسية المتكاملة |
| \`status.synced\` | All specs synchronized to Supabase | تم مزامنة كافة المواصفات مع قاعدة البيانات |
| \`modal.confirm\` | Confirm architectural lock | تأكيد اعتماد النموذج المعماري |
| \`error.timeout\` | Ingress gateway timeout. Retry scheduled. | تعذر الاتصال بالبوابة المركزية. جاري إعادة المحاولة. |
| \`empty.state\` | No active specifications in this phase. | لا توجد مواصفات فنية مدخلة في هذه المرحلة حتى الآن. |
`;

    case 'technical_support':
      return `### DevOps & Site Reliability Infrastructure Manifest
**Target:** Production Multi-Container Orchestration

\`\`\`yaml
version: '3.9'

services:
  monospec-core:
    image: monospec/core:2.0.0-enterprise
    restart: always
    deploy:
      replicas: 4
      resources:
        limits:
          cpus: '2.0'
          memory: 4096M
    environment:
      - NODE_ENV=production
      - PORT=3000
      - KSA_SOVEREIGN_MODE=enabled
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 10s
      timeout: 3s
      retries: 3
    ports:
      - "3000:3000"
\`\`\`
`;
  }
}

/**
 * Main AI Execution Pipeline Route
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, stage, message, companyCode, locale } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "message" in request body' },
        { status: 400 }
      );
    }

    const isArabic = locale === 'ar' || /[\u0600-\u06FF]/.test(message);
    const normalizedStage = normalizeStage(stage || 'technical_analysis');
    const normalizedCompany = normalizeCompanyCode(companyCode || 'awamer');

    // 1. Stage-Aware Agent Routing Definition
    const stageConfig = STAGE_INSTRUCTIONS[normalizedStage];

    // 2. Company Style Conditioning
    const companyStyle = getCompanyStylePrompt(normalizedCompany);

    // 3. Context & Few-Shot Retrieval Hook
    const retrievedContext = await retrieveTrainingContext(normalizedCompany);

    // Synthesize full system prompt
    const fullSystemPrompt = `
System Identity: MonoSpec Enterprise Architecture AI Pipeline
Active Stage: ${stageConfig.title}
${stageConfig.instructions}
${companyStyle}
${retrievedContext}
${isArabic 
  ? 'CRITICAL MANDATORY INSTRUCTION: You MUST respond 100% in pure Arabic. Zero English words in narrative, explanations, checklists or diagrams. Every section, header, and explanation MUST be Arabic.'
  : 'CRITICAL MANDATORY INSTRUCTION: You MUST respond 100% in pure English. Zero Arabic text. Every section, header, and explanation MUST be English.'}
`;

    // Check if an external LLM key is configured (OpenAI or Anthropic or custom endpoint)
    const openAiApiKey = process.env.OPENAI_API_KEY;

    if (openAiApiKey && !openAiApiKey.includes('your-api-key')) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiApiKey}`,
          },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || 'gpt-4o',
            stream: true,
            temperature: 0.2,
            messages: [
              { role: 'system', content: fullSystemPrompt },
              { role: 'user', content: message },
            ],
          }),
        });

        if (response.ok && response.body) {
          // Stream directly to the client
          return new Response(response.body, {
            headers: {
              'Content-Type': 'text/event-stream; charset=utf-8',
              'Cache-Control': 'no-cache, no-transform',
              Connection: 'keep-alive',
            },
          });
        }
      } catch (externalErr) {
        console.warn('[MonoSpec AI] External provider error, falling back to local generator:', externalErr);
      }
    }

    // 4. Built-in High-Speed Streaming Generator with SSE chunking
    const generatedMarkdown = generateRealisticStageSpec(
      normalizedStage,
      normalizedCompany,
      message,
      isArabic
    );

    // Automatically persist the message to Supabase / local mock in the background
    if (projectId) {
      appendChatMessage(projectId, normalizedStage, {
        id: `msg-${Date.now().toString(36)}`,
        sender: 'assistant',
        content: generatedMarkdown,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }).catch((saveErr) => {
        console.warn('[MonoSpec AI] Background chat append warning:', saveErr);
      });
    }

    // Stream the generated markdown in progressive SSE chunks
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Break markdown into realistic paragraphs/lines
        const chunks = generatedMarkdown.split(/(?<=\n\n|\n)/);

        for (const chunk of chunks) {
          // Format as Server-Sent Event (SSE)
          const sseEvent = `data: ${JSON.stringify({ text: chunk, stage: normalizedStage })}\n\n`;
          controller.enqueue(encoder.encode(sseEvent));
          // Micro-delay to simulate fluid real-time streaming
          await new Promise((resolve) => setTimeout(resolve, 35));
        }

        // Close event
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('[MonoSpec AI Pipeline] Unhandled route error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal AI Pipeline Execution Error' },
      { status: 500 }
    );
  }
}

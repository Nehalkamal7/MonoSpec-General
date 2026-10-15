import { Project, ChatMessage, StageId } from '@/types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-awm-01',
    slug: 'b2b-logistics-portal',
    title: 'B2B Logistics & Freight Platform',
    companyId: 'awamer',
    description: 'Autonomous freight brokerage orchestration, real-time fleet GPS tracking, and automated customs document clearing engine.',
    activeStageId: 'tech_analysis',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-10-14T11:45:00Z',
    status: 'active',
    architectureTier: 'Tier 1 Enterprise',
    figmaUrl: 'https://figma.com/@monospec/awm-freight-design-system',
    demoUrl: 'https://freight.awamer.internal',
    stages: {
      tech_analysis: {
        stageId: 'tech_analysis',
        status: 'in_progress',
        progress: 85,
        specTitle: 'System Topology & Customs Ingestion Pipeline',
        updatedAt: '2026-10-14T11:30:00Z',
        checklist: [
          { id: 'c1', text: 'Define high-throughput message bus (Apache Kafka / Redis Streams)', done: true },
          { id: 'c2', text: 'Draft relational schema for Customs Declaration manifests', done: true },
          { id: 'c3', text: 'Specify OAuth 2.1 mTLS mutual authentication for Gov Gateways', done: true },
          { id: 'c4', text: 'Document Idempotency-Key handling on bill of lading submission', done: false },
        ],
        specMarkdown: `# Technical Architecture: B2B Freight Brokerage System
**Author:** Enterprise Architecture Council (Awamer Alshabaka)  
**Status:** Approved for Implementation (v2.4.0)

---

## 1. Executive Summary
The Freight Orchestration Engine ingests telemetry from 14,000+ active cross-border transit carriers. It guarantees Sub-120ms p99 latency for load-matching algorithms while satisfying ZATCA Phase-2 e-invoicing compliance.

\`\`\`mermaid
flowchart LR
    A[Carrier Telemetry] --> B[API Gateway]
    B --> C[(Redis Idempotency)]
    B --> D[Kafka Cluster: freight.events]
    D --> E[Customs Pipeline]
    D --> F[Fleet Dispatch Service]
\`\`\`

## 2. Ingestion Schema (TypeScript Contract)
Strict validation occurs on incoming manifest payloads at edge routers before touching persistence layers.

\`\`\`typescript
export interface FreightManifestPayload {
  readonly manifestUuid: string;
  readonly carrierId: \`CARR-\${string}\`;
  readonly destinationPort: 'JEDDAH_ISLAMIC' | 'KING_ABDULAZIZ_DAMMAM' | 'RIYADH_DRY_PORT';
  readonly waybill: {
    billNumber: string;
    grossWeightKg: number;
    hazardousClass: null | 'CLASS_3_FLAMMABLE' | 'CLASS_8_CORROSIVE';
    declaredValueSar: number;
  };
  readonly timestampUtc: number;
  readonly signatureHash: string;
}
\`\`\`

## 3. Database Schema (PostgreSQL 16)
Partitioned monthly on \`created_at\` to ensure query speed under 500M row volume:

\`\`\`sql
CREATE TABLE freight_waybills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manifest_id VARCHAR(64) NOT NULL,
    carrier_code VARCHAR(32) NOT NULL,
    status VARCHAR(24) NOT NULL CHECK (status IN ('PENDING', 'CLEARED', 'HELD_CUSTOMS', 'IN_TRANSIT')),
    gross_weight_kg NUMERIC(10, 2) NOT NULL,
    origin_geo GEOGRAPHY(Point, 4326),
    destination_geo GEOGRAPHY(Point, 4326),
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
) PARTITION BY RANGE (created_at);
\`\`\`

## 4. SLA & Performance Benchmarks
- **Throughput Target:** 18,500 RPS burst.
- **Data Durability:** 99.999999999% across 3 availability zones.
- **RTO / RPO:** RTO < 15 minutes, RPO < 0 seconds.
`,
      },
      logo: {
        stageId: 'logo',
        status: 'completed',
        progress: 100,
        specTitle: 'AWM Freight Kinetic Monogram & Brand Assets',
        updatedAt: '2026-10-13T09:00:00Z',
        checklist: [
          { id: 'l1', text: 'Construct mathematical 45° angle geometric vector mark', done: true },
          { id: 'l2', text: 'Define high-contrast enterprise color tokens (Onyx, Silver, Slate)', done: true },
          { id: 'l3', text: 'Export SVG icon pack for web manifest and native mobile dispatch app', done: true },
          { id: 'l4', text: 'Compile Brand Book PDF with negative space isolation rules', done: true },
        ],
        specMarkdown: `# Logo & Visual Identity Specification: AWM Freight
**Brand Architecture Lead:** Awamer Creative Council  
**Classification:** Enterprise Tier 1 Visual Identity System (v2.1)

---

## 1. Brand Concept & Geometric Geometry
The AWM Freight logomark encapsulates two interlocking vector chevrons symbolizing cross-border logistics velocity and cryptographic assurance.

\`\`\`svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80" width="240" height="80" class="w-48 h-16">
  <rect width="240" height="80" rx="12" fill="#09090b" stroke="#27272a" stroke-width="2"/>
  <path d="M30 55 L50 25 L70 55 L60 55 L50 40 L40 55 Z" fill="#ffffff" />
  <path d="M55 55 L65 40 L75 55 Z" fill="#a1a1aa" />
  <text x="85" y="46" font-family="monospace" font-size="20" font-weight="bold" fill="#ffffff" letter-spacing="2">AWM</text>
  <text x="145" y="46" font-family="sans-serif" font-size="14" font-weight="300" fill="#a1a1aa">FREIGHT</text>
  <circle cx="215" cy="40" r="4" fill="#22c55e" />
</svg>
\`\`\`

## 2. Palette Specification
| Token Name | HEX Value | RGB / HSL | Application Purpose |
| :--- | :--- | :--- | :--- |
| \`brand-onyx\` | \`#09090b\` | \`hsl(240, 10%, 4%)\` | Canvas Ground, Primary Shell |
| \`brand-pure-white\` | \`#ffffff\` | \`hsl(0, 0%, 100%)\` | Primary Mark, High-Contrast Typography |
| \`brand-slate-glow\` | \`#27272a\` | \`hsl(240, 5%, 16%)\` | Geometric Border, Isolation Grid |
| \`brand-telemetry-emerald\` | \`#22c55e\` | \`hsl(142, 71%, 45%)\` | Live GPS Transit Indicator |

## 3. Clear-Space & Minimum Sizing
- **Minimum Digital Height:** 24px (Favicon mark at 16x16 with simplified single chevron).
- **Clear Space Boundary:** Equal to the capital letter height "X" (minimum 16px padding on all axes).
`,
      },
      ui_ux: {
        stageId: 'ui_ux',
        status: 'completed',
        progress: 100,
        specTitle: 'Monochrome Dispatch Console & Dark Mode Grid',
        updatedAt: '2026-10-12T16:20:00Z',
        checklist: [
          { id: 'u1', text: 'Design High-Density 8px grid data table with virtual scroll', done: true },
          { id: 'u2', text: 'Define status indicators using strictly pure tones & bordered badges', done: true },
          { id: 'u3', text: 'Prototype interactive waypoint trajectory modal', done: true },
        ],
        specMarkdown: `# UI/UX Design System Specification: Freight Console
**Design Lead:** MonoSpec Design System Core  
**Figma File:** [DSGN-AWM-FREIGHT-V3](https://figma.com/@monospec)

## Design Pillars
1. **Zero Distraction (Strict Monochrome):** Critical transit anomalies are surfaced via high-contrast border weight and subtle typographic emphasis, never noisy neon alerts.
2. **High Information Density:** 32 rows visible above the fold on 1080p viewport.

\`\`\`json
{
  "tokens": {
    "colors": {
      "surface-base": "#000000",
      "surface-card": "#09090b",
      "surface-hover": "#18181b",
      "border-default": "#27272a",
      "text-primary": "#ffffff",
      "text-secondary": "#a1a1aa"
    },
    "typography": {
      "font-family": "Geist, -apple-system, sans-serif",
      "monospace": "Geist Mono, ui-monospace, monospace"
    }
  }
}
\`\`\`
`,
      },
      engineering: {
        stageId: 'engineering',
        status: 'in_progress',
        progress: 60,
        specTitle: 'Service Worker GPS Sync & Edge Router Architecture',
        updatedAt: '2026-10-13T19:00:00Z',
        checklist: [
          { id: 'e1', text: 'Implement Redis cluster cache for live vehicle coordinates', done: true },
          { id: 'e2', text: 'Build Supabase Row-Level Security policies for carrier organizations', done: true },
          { id: 'e3', text: 'Integrate Webhooks dispatch with exponential backoff retry queue', done: false },
        ],
        specMarkdown: `# Engineering Implementation Blueprint
**Service:** \`svc-carrier-dispatcher\`  
**Runtime:** Node.js 22 LTS / Next.js 16 App Router / Supabase

## Row Level Security (RLS) Policy Definition
Multi-tenant isolation strictly enforced at the database layer:

\`\`\`sql
ALTER TABLE freight_waybills ENABLE ROW LEVEL SECURITY;

CREATE POLICY carrier_isolation_policy ON freight_waybills
FOR ALL
TO authenticated
USING (
  carrier_code = (auth.jwt() ->> 'carrier_id')
  OR (auth.jwt() ->> 'role') = 'platform_admin'
);
\`\`\`
`,
      },
      qa_testing: {
        stageId: 'qa_testing',
        status: 'pending',
        progress: 25,
        specTitle: 'Chaos Engineering & Load Injection Matrix',
        updatedAt: '2026-10-10T14:15:00Z',
        checklist: [
          { id: 'q1', text: 'Write k6 benchmark script for 20k concurrent socket streams', done: true },
          { id: 'q2', text: 'Automate Playwright visual regression in Dark / Light modes', done: false },
        ],
        specMarkdown: `# QA & Verification Suite
## k6 Synthetic Ingestion Benchmark
Target: Validate zero memory leak under 60-minute sustained 15,000 req/sec load.

\`\`\`javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 5000 },
    { duration: '5m', target: 15000 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  const res = http.post('https://api.freight.internal/v1/telemetry', JSON.stringify({
    carrierId: 'CARR-8812',
    lat: 24.7136,
    lon: 46.6753,
  }), { headers: { 'Content-Type': 'application/json' } });
  check(res, { 'status is 202': (r) => r.status === 202 });
}
\`\`\`
`,
      },
      content: {
        stageId: 'content',
        status: 'pending',
        progress: 40,
        specTitle: 'Arabic & English Multilingual Customs Glossary',
        updatedAt: '2026-10-09T10:00:00Z',
        checklist: [
          { id: 'ct1', text: 'Harmonize customs terminology with Saudi ZATCA standards', done: true },
          { id: 'ct2', text: 'Draft client onboarding guide with step-by-step API curl examples', done: false },
        ],
        specMarkdown: `# Multilingual Content Matrix & Microcopy
## Core Terminology Mapping (En <-> Ar)

| Key Term | Arabic (المصطلح المعتمد) | Context & Clarification |
| :--- | :--- | :--- |
| **Bill of Lading (BOL)** | بوليصة الشحن الرسمية | Sovereign legal cargo transport document |
| **Customs Clearing** | التخليص الجمركي الفوري | Automated electronic pre-clearance |
| **Consignee** | المستلم النهائي المعتمد | Destination organization authorized to inspect |
| **Demurrage Fee** | غرامات أرضيات الميناء | Penalties accrued for port terminal delay |
`,
      },
      devops: {
        stageId: 'devops',
        status: 'in_progress',
        progress: 70,
        specTitle: 'Kubernetes Multi-AZ Deployment & OpenTelemetry Pipeline',
        updatedAt: '2026-10-14T09:30:00Z',
        checklist: [
          { id: 'd1', text: 'Configure Terraform Helm provider for AWS EKS 1.30 cluster', done: true },
          { id: 'd2', text: 'Establish ArgoCD GitOps sync with signed commit validation', done: true },
          { id: 'd3', text: 'Deploy Prometheus alert rules for p99 latency threshold', done: false },
        ],
        specMarkdown: `# Support & DevOps Runbook
## Kubernetes Deployment Manifest (\`deployment.yaml\`)

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: freight-orchestrator
  namespace: awamer-production
  labels:
    app.kubernetes.io/name: freight-orchestrator
    app.kubernetes.io/part-of: monospec-platform
spec:
  replicas: 6
  selector:
    matchLabels:
      app: freight-orchestrator
  template:
    metadata:
      labels:
        app: freight-orchestrator
    spec:
      containers:
      - name: app
        image: ghcr.io/awamer/freight-engine:v2.4.0
        resources:
          limits:
            cpu: "2"
            memory: "4Gi"
          requests:
            cpu: "500m"
            memory: "1Gi"
        readinessProbe:
          httpGet:
            path: /api/healthz
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
\`\`\`
`,
      },
    },
  },
  {
    id: 'proj-awm-02',
    slug: 'enterprise-hr-payroll',
    title: 'Enterprise HR & Payroll Automation',
    companyId: 'awamer',
    description: 'Compliant payroll processing engine, Qiwa & GOSI synchronization, automated labor compliance validator.',
    activeStageId: 'engineering',
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-10-13T17:30:00Z',
    status: 'active',
    architectureTier: 'Core Platform',
    figmaUrl: 'https://figma.com/@monospec/hr-payroll-system',
    stages: {
      tech_analysis: {
        stageId: 'tech_analysis',
        status: 'completed',
        progress: 100,
        specTitle: 'Wage Protection System (WPS) Pipeline Spec',
        updatedAt: '2026-09-10T12:00:00Z',
        checklist: [
          { id: 'hr1', text: 'Map Central Bank SAMA WPS text file format', done: true },
          { id: 'hr2', text: 'Build salary calculation math validator with tax exempt rules', done: true },
        ],
        specMarkdown: `# Wage Protection System (WPS) Architecture
Full compliance with Saudi Central Bank (SAMA) specification standard v3.1.
`,
      },
      logo: {
        stageId: 'logo',
        status: 'completed',
        progress: 100,
        specTitle: 'HR Portal Shield Mark & Corporate Stationery Guidelines',
        updatedAt: '2026-09-15T10:00:00Z',
        checklist: [
          { id: 'hr_l1', text: 'Design dual-pillar biometric shield symbol', done: true },
          { id: 'hr_l2', text: 'Formulate official Arabic typography pairings (IBM Plex Sans Arabic)', done: true },
        ],
        specMarkdown: `# Logo & Corporate Branding: Awamer HR Portal
**Lead Identity Designer:** Awamer Enterprise Design
- **Mark Philosophy:** Symmetrical shield conveying employee trust and SAMA banking governance.
- **Corporate Typeface:** IBM Plex Sans Arabic (Regular 400, SemiBold 600).
`,
      },
      ui_ux: {
        stageId: 'ui_ux',
        status: 'completed',
        progress: 100,
        specTitle: 'Executive Payroll Approval Flow & Ledger Table',
        updatedAt: '2026-09-22T14:00:00Z',
        checklist: [{ id: 'hr_ui1', text: 'Two-man rule dual verification UI', done: true }],
        specMarkdown: `# UX Specifications for Payroll Dual-Authorization
Requires cryptographic key approval from both CFO and HR Director before bank batch transmission.
`,
      },
      engineering: {
        stageId: 'engineering',
        status: 'in_progress',
        progress: 75,
        specTitle: 'GOSI API Synchronizer & Batch Calculation Worker',
        updatedAt: '2026-10-13T17:30:00Z',
        checklist: [
          { id: 'eng_hr1', text: 'Parallel worker pool for 50,000 payslip generation in < 45s', done: true },
          { id: 'eng_hr2', text: 'Dead letter queue handling for failed IBAN validation', done: true },
        ],
        specMarkdown: `# Engineering: Worker Pool Pipeline
Utilizes BullMQ with Redis persistence to guarantee exactly-once deduction calculation.
`,
      },
      qa_testing: {
        stageId: 'qa_testing',
        status: 'pending',
        progress: 30,
        specTitle: 'End-of-Service Benefit (EOSB) Precision Test Matrix',
        updatedAt: '2026-10-05T11:00:00Z',
        checklist: [{ id: 'qa_hr1', text: 'Test leap year calculation edge cases', done: true }],
        specMarkdown: `# QA Test Matrix: Saudi Labor Law Article 84 & 85
Automated verification of severance compensation for arbitrary tenure intervals.
`,
      },
      content: {
        stageId: 'content',
        status: 'in_progress',
        progress: 50,
        specTitle: 'Labor Law Clause Explanations & Employee Notifications',
        updatedAt: '2026-10-08T15:20:00Z',
        checklist: [{ id: 'ct_hr1', text: 'Arabic push notifications for payslip dispatch', done: true }],
        specMarkdown: `# Notifications & Employee Portal Copy
Precision copywriting regarding deductions, social insurance, and net deposit confirmations.
`,
      },
      devops: {
        stageId: 'devops',
        status: 'pending',
        progress: 20,
        specTitle: 'Isolated Financial Database Encryption at Rest (KMS)',
        updatedAt: '2026-09-30T10:00:00Z',
        checklist: [{ id: 'd_hr1', text: 'AWS CloudHSM automated key rotation', done: false }],
        specMarkdown: `# DevOps: High Assurance Security Profile
Database isolation with dedicated customer-managed keys (CMK) and strict audit logging.
`,
      },
    },
  },
  {
    id: 'proj-crt-01',
    slug: 'fintech-pos-sdk',
    title: 'FinTech Digital Wallet & POS SDK',
    companyId: 'creative',
    description: 'EMV Level 2 contactless kernel, soft-POS tap-on-phone payment gateway with sub-second terminal processing.',
    activeStageId: 'ui_ux',
    createdAt: '2026-09-18T10:00:00Z',
    updatedAt: '2026-10-14T10:15:00Z',
    status: 'active',
    architectureTier: 'Mission Critical',
    figmaUrl: 'https://figma.com/@creativesystem/softpos-sdk',
    demoUrl: 'https://wallet.creativesystem.io',
    stages: {
      tech_analysis: {
        stageId: 'tech_analysis',
        status: 'completed',
        progress: 100,
        specTitle: 'PCI-CPoC SoftPOS Cryptographic Handshake Architecture',
        updatedAt: '2026-09-25T11:00:00Z',
        checklist: [
          { id: 'cp1', text: 'DUKPT key management schema specification', done: true },
          { id: 'cp2', text: 'Hardware-backed keystore attestation spec (Android Keystore / iOS Secure Enclave)', done: true },
        ],
        specMarkdown: `# FinTech SoftPOS Technical Architecture
**Regulatory Standard:** PCI CPoC (Contactless Payments on Commercial Off-The-Shelf)
- DUKPT (Derived Unique Key Per Transaction) with AES-256 pin block encryption.
- Direct ISO 8583 switch integration.
`,
      },
      logo: {
        stageId: 'logo',
        status: 'completed',
        progress: 100,
        specTitle: 'SoftPOS Dynamic Contactless Pulse Mark',
        updatedAt: '2026-09-28T14:30:00Z',
        checklist: [
          { id: 'pos_l1', text: 'Generate EMV-compliant tap-wave vector badge', done: true },
          { id: 'pos_l2', text: 'Define high-contrast dark OLED terminal color profile', done: true },
        ],
        specMarkdown: `# Branding: Creative SoftPOS Identity & NFC Waves
**Visual Architecture:** Creative System Labs
- **NFC Waveform:** 4 concentric curved vectors with graduated opacity representing sub-second transaction speed.
- **Terminal Display Optimization:** 100% black true OLED contrast to prevent merchant battery drain.
`,
      },
      ui_ux: {
        stageId: 'ui_ux',
        status: 'in_progress',
        progress: 90,
        specTitle: 'Haptic Feedback Terminal & Minimalist Monochrome Card Reader',
        updatedAt: '2026-10-14T10:15:00Z',
        checklist: [
          { id: 'pos_u1', text: 'Design high-contrast PIN-pad with randomized tactile key shuffling', done: true },
          { id: 'pos_u2', text: 'Create contactless NFC radar ripple animation (Pure Monochrome)', done: true },
          { id: 'pos_u3', text: 'Define biometric receipt signature canvas', done: false },
        ],
        specMarkdown: `# UI/UX Design System: SoftPOS Terminal Interface
**Style:** Strict Monochrome Luxury / High-Performance Financial Terminal

## Key Experience Touchpoints
- **Neutral Screen Presence:** Dark mode default (#000000) avoids OLED burn-in and conserves handheld battery.
- **Dynamic Numeric Keypad:** Shuffles digit arrangement between transactions to counteract thermal camera fingerprint tracing.
`,
      },
      engineering: {
        stageId: 'engineering',
        status: 'in_progress',
        progress: 55,
        specTitle: 'Rust WebAssembly Core & ISO-8583 Message Packer',
        updatedAt: '2026-10-11T13:40:00Z',
        checklist: [
          { id: 'pos_e1', text: 'Compile Rust cryptographic kernel to Wasm target', done: true },
          { id: 'pos_e2', text: 'Implement TLV (Tag-Length-Value) parser for EMV tag reading', done: true },
        ],
        specMarkdown: `# Engineering: Core Rust WASM Kernel
\`\`\`rust
pub struct EmvTransactionPayload {
    pub terminal_id: [u8; 8],
    pub amount_authorized: u64,
    pub currency_code: u16,
    pub cryptogram: [u8; 8],
}

impl EmvTransactionPayload {
    pub fn pack_iso8583(&self) -> Result<Vec<u8>, TransactionError> {
        // High efficiency binary serialization
        Ok(vec![])
    }
}
\`\`\`
`,
      },
      qa_testing: {
        stageId: 'qa_testing',
        status: 'pending',
        progress: 15,
        specTitle: 'Attestation & Jailbreak Detection Test Scenarios',
        updatedAt: '2026-10-04T09:00:00Z',
        checklist: [{ id: 'pos_q1', text: 'Rooted device rejection verification', done: true }],
        specMarkdown: `# Security Verification & Penetration Testing
Automated execution of Frida dynamic instrumentation hooks to confirm zero tampering tolerance.
`,
      },
      content: {
        stageId: 'content',
        status: 'pending',
        progress: 35,
        specTitle: 'Developer Integration Guides & Terminal Error Codes',
        updatedAt: '2026-10-06T16:00:00Z',
        checklist: [{ id: 'pos_c1', text: 'Map ISO-8583 response codes to human-readable strings', done: true }],
        specMarkdown: `# POS Error Code Reference
Comprehensive documentation for EMV declines, chip malfunctions, and issuer timeouts.
`,
      },
      devops: {
        stageId: 'devops',
        status: 'pending',
        progress: 30,
        specTitle: 'Multi-Region Sovereign Cloud Infrastructure (Saudi KSA Datacenters)',
        updatedAt: '2026-10-02T12:00:00Z',
        checklist: [{ id: 'pos_d1', text: 'Direct SAMA certified colocation interconnect', done: false }],
        specMarkdown: `# DevOps: Sovereign Cloud Topology
High availability deployment inside Class-4 certified Tier-IV data centers within Saudi territory.
`,
      },
    },
  },
  {
    id: 'proj-crt-02',
    slug: 'omnichannel-ecommerce-engine',
    title: 'Omnichannel Headless E-Commerce Storefront',
    companyId: 'creative',
    description: 'Sub-second edge rendered commerce engine, unified inventory synchronization, and AI checkout conversion optimizer.',
    activeStageId: 'content',
    createdAt: '2026-09-20T12:00:00Z',
    updatedAt: '2026-10-14T08:30:00Z',
    status: 'active',
    architectureTier: 'Core Platform',
    figmaUrl: 'https://figma.com/@creativesystem/omnistore',
    demoUrl: 'https://store.creativesystem.io',
    stages: {
      tech_analysis: {
        stageId: 'tech_analysis',
        status: 'completed',
        progress: 100,
        specTitle: 'Headless Commerce Graph & Edge Caching Architecture',
        updatedAt: '2026-09-24T14:00:00Z',
        checklist: [{ id: 'ec1', text: 'GraphQL federation schema for Catalog and Cart', done: true }],
        specMarkdown: `# E-Commerce Headless Architecture
High-throughput edge caching utilizing Cloudflare Workers and Fastly VCL.
`,
      },
      logo: {
        stageId: 'logo',
        status: 'completed',
        progress: 100,
        specTitle: 'Omnistore Headless Modern Wordmark & Favicons',
        updatedAt: '2026-09-26T11:00:00Z',
        checklist: [
          { id: 'ec_l1', text: 'Craft geometric sans wordmark with bespoke "O" ligature', done: true },
          { id: 'ec_l2', text: 'Generate full asset bundle for PWA app manifests', done: true },
        ],
        specMarkdown: `# Omnistore Brand & Wordmark Identity
**Design Technologist:** Creative System Brand Engineering
- **Concept:** Minimalist modular ligature engineered for responsive scaling from 16px favicon up to 4K billboard displays.
`,
      },
      ui_ux: {
        stageId: 'ui_ux',
        status: 'completed',
        progress: 100,
        specTitle: 'Minimalist Monochrome Product Showcase & Micro-Cart',
        updatedAt: '2026-09-29T16:30:00Z',
        checklist: [{ id: 'ec_u1', text: 'Instant keyboard-driven search overlay (Cmd+K)', done: true }],
        specMarkdown: `# UX Guidelines: Ultra-Fast Monochrome Commerce
Seamless transition from product grid to 1-click checkout with zero layout shift.
`,
      },
      engineering: {
        stageId: 'engineering',
        status: 'completed',
        progress: 100,
        specTitle: 'Next.js 16 Partial Prerendering & Cart Optimistic UI',
        updatedAt: '2026-10-08T18:00:00Z',
        checklist: [{ id: 'ec_e1', text: 'Zero latency optimistic cart mutation engine', done: true }],
        specMarkdown: `# Engineering: Next.js 16 Partial Prerendering
Dynamic user basket rendered through Server Actions with instant fallback skeletons.
`,
      },
      qa_testing: {
        stageId: 'qa_testing',
        status: 'completed',
        progress: 100,
        specTitle: 'Black Friday 50,000 Concurrent User Simulation',
        updatedAt: '2026-10-10T12:00:00Z',
        checklist: [{ id: 'ec_q1', text: 'Inventory locking race condition fuzz test', done: true }],
        specMarkdown: `# QA Performance Assertions
Zero overselling under high concurrency flash sale simulations using distributed Redis locks.
`,
      },
      content: {
        stageId: 'content',
        status: 'in_progress',
        progress: 80,
        specTitle: 'Bilingual Brand Voice, SEO Metadata & Catalog Taxonomies',
        updatedAt: '2026-10-14T08:30:00Z',
        checklist: [
          { id: 'ec_ct1', text: 'Generate localized meta tags for 4,500 luxury SKUs', done: true },
          { id: 'ec_ct2', text: 'Draft Arabic tone-of-voice guidelines for premium tech catalog', done: true },
          { id: 'ec_ct3', text: 'Publish OpenAPI documentation for vendor drop-shipping partners', done: false },
        ],
        specMarkdown: `# Content Strategy & Bilingual SEO Matrix
**Brand:** Monochrome Luxury Tech Commerce  
**Primary Language:** Arabic (KSA Market Priority) / Secondary: English Global

## Brand Tone Principles
1. **Understated Elegance:** Avoid exclamation marks, hyperbolic adjectives ("Amazing!", "Unbelievable!"), and colorful discount banners.
2. **Technical Precision:** Highlight materials, tolerances, wattages, and engineering benchmarks.

### Localized Category Hierarchy
\`\`\`yaml
categories:
  - slug: "computing-workstations"
    en: "Precision Computing Workstations"
    ar: "محطات العمل الحاسوبية فائقة الدقة"
  - slug: "developer-ergonomics"
    en: "Developer Ergonomic Interfaces"
    ar: "أجهزة وأنظمة بيئة عمل المطورين"
\`\`\`
`,
      },
      devops: {
        stageId: 'devops',
        status: 'pending',
        progress: 45,
        specTitle: 'Multi-Cloud Edge Deployment with Global Anycast Routing',
        updatedAt: '2026-10-12T11:00:00Z',
        checklist: [{ id: 'ec_d1', text: 'Edge SSL certificate automated provisioning', done: true }],
        specMarkdown: `# DevOps: Global Edge Topology
Global Anycast routing delivering sub-25ms Time To First Byte (TTFB) worldwide.
`,
      },
    },
  },
];

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'proj-awm-01-tech_analysis': [
    {
      id: 'msg-1',
      projectId: 'proj-awm-01',
      stageId: 'tech_analysis',
      sender: 'assistant',
      content: `### Welcome to MonoSpec Technical Analysis Workspace
I have initialized the system architecture review for **B2B Logistics & Freight Platform** (Awamer Alshabaka).

The current focus is on **Customs Declaration Data Ingestion & High-Throughput Telemetry**.
- Target throughput: **18,500 RPS**
- Primary database: **PostgreSQL 16 partitioned with PostGIS**
- Event stream: **Apache Kafka cluster with Redis idempotency**

How would you like to refine the specification today?`,
      timestamp: '11:20 AM',
      suggestedActions: [
        { label: 'Refine Idempotency Schema', action: 'refine_idempotency' },
        { label: 'Generate ZATCA XML Envelope', action: 'zatca_xml' },
        { label: 'Add Redis Cluster Failover Spec', action: 'redis_failover' },
      ],
      codeSnippets: [
        {
          language: 'typescript',
          filename: 'types/telemetry.ts',
          code: `export interface TelemetryPacket {\n  carrierId: string;\n  coordinates: [number, number];\n  speedKmH: number;\n  fuelLevelPct: number;\n  telemetryTimestamp: number;\n}`,
        },
      ],
    },
    {
      id: 'msg-2',
      projectId: 'proj-awm-01',
      stageId: 'tech_analysis',
      sender: 'user',
      content: 'Can you specify how we handle duplicate webhook submissions if the carrier network retries within 5 seconds?',
      timestamp: '11:28 AM',
    },
    {
      id: 'msg-3',
      projectId: 'proj-awm-01',
      stageId: 'tech_analysis',
      sender: 'assistant',
      content: `### Idempotency Strategy for Carrier Webhooks
To guarantee **exactly-once processing** during network flapping, we implement a **Redis Distributed Lock with a SHA-256 fingerprint**:

1. **Fingerprint Composition:** \`SHA256(carrier_id + bill_number + timestamp_bucket_10s)\`.
2. **Lock Acquisition:** \`SET lock:waybill:<hash> "PROCESSING" EX 60 NX\`.
3. If \`NX\` returns \`0\`, we return **HTTP 202 Accepted** immediately with the previous cached \`receipt_token\` without queuing duplicate Kafka events.

\`\`\`typescript
export async function verifyWebhookIdempotency(
  redis: RedisClient,
  carrierId: string,
  waybillNumber: string
): Promise<{ isDuplicate: boolean; receiptId: string }> {
  const hash = crypto.createHash('sha256')
    .update(\`\${carrierId}:\${waybillNumber}\`)
    .digest('hex');

  const lockKey = \`idemp:\${hash}\`;
  const wasSet = await redis.set(lockKey, 'ACQUIRED', 'EX', 120, 'NX');

  if (!wasSet) {
    const existingToken = await redis.get(\`receipt:\${hash}\`);
    return { isDuplicate: true, receiptId: existingToken ?? 'IN_FLIGHT' };
  }

  return { isDuplicate: false, receiptId: hash };
}
\`\`\`

I have updated the specification checklist in the active canvas.`,
      timestamp: '11:30 AM',
      suggestedActions: [
        { label: 'Export Schema to Canvas', action: 'export_to_canvas' },
        { label: 'View Database Migration', action: 'view_migration' },
      ],
    },
  ],
};

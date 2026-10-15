'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Users,
  KeyRound,
  FileText,
  Palette,
  Terminal,
  CheckSquare,
  Server,
  Database,
  ExternalLink,
  Layers,
  ChevronRight,
  Copy,
  Check,
  Zap,
  Globe,
  Lock,
  Cpu,
  LogIn,
  UserPlus,
  Briefcase,
  TrendingUp,
  Workflow,
  Clock,
  CheckCheck,
  AlertCircle,
  Code2,
  FolderOpen,
  Phone,
  Mail,
  Headphones,
  MessageSquare,
  MapPin,
  Award,
  Star,
  Compass,
  HelpCircle,
  Send,
  CheckCircle,
  RefreshCw,
  Play,
  Share2,
} from 'lucide-react';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';
import { STAGES } from '@/lib/constants';

const INDUSTRIES = [
  {
    id: 'fintech',
    name: 'FinTech & Banking',
    nameAr: 'التكنولوجيا المالية والمدفوعات',
    icon: '💳',
    summary: 'Sub-second POS transactions, EMV Level 2 contactless kernels, and SAMA/PCI-CPoC compliance.',
    badge: 'PCI-DSS & SAMA Validated',
    sampleOutput: 'ISO 8583 SoftPOS Handshake + DUKPT Key Derivation Engine',
  },
  {
    id: 'logistics',
    name: 'Logistics & Supply Chain',
    nameAr: 'اللوجستيات وسلاسل الإمداد',
    icon: '🚚',
    summary: 'Autonomous freight brokerage, GPS fleet telemetry, and automated ZATCA customs clearance.',
    badge: 'ZATCA Phase-2 Validated',
    sampleOutput: 'Kafka Event Bus: freight.telemetry.ingest (Sub-120ms P99)',
  },
  {
    id: 'healthtech',
    name: 'HealthTech & Medical',
    nameAr: 'الرعاية الصحية والتقنية الطبية',
    icon: '🏥',
    summary: 'HL7/FHIR health record interoperability, HIPAA encrypted medical data, and clinician workflows.',
    badge: 'HIPAA & HL7 FHIR Compliant',
    sampleOutput: 'EHR Encryption Boundary with Zero-Knowledge Patient Identifiers',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce & Retail',
    nameAr: 'التجارة الإلكترونية والتجزئة',
    icon: '🛒',
    summary: 'Headless commerce graph, edge-cached carts, omnichannel POS synchronization, and 1-click checkout.',
    badge: 'Next.js 16 Edge Graph',
    sampleOutput: 'GraphQL Federation for Cart Mutation with Zero Layout Shift',
  },
  {
    id: 'govtech',
    name: 'GovTech & Sovereign Cloud',
    nameAr: 'القطاع الحكومي والسيادي',
    icon: '🏛️',
    summary: 'KSA sovereign cloud data localization, CITC regulations, and NCA Essential Cybersecurity Controls.',
    badge: 'NCA ECC-1:2018 Standard',
    sampleOutput: 'Multi-AZ Sovereign Cloud Deployment with Hardware Security Modules',
  },
  {
    id: 'ai_saas',
    name: 'AI & Big Data SaaS',
    nameAr: 'الذكاء الاصطناعي ومنصات السحاب',
    icon: '⚡',
    summary: 'Vector embeddings, autonomous RAG pipelines, microservices, and distributed streaming telemetries.',
    badge: 'Real-time Vector RAG',
    sampleOutput: 'Multi-Tenant Agentic Pipeline with OpenTelemetry Tracing',
  },
];

export function UniversalLandingPage() {
  const {
    setActiveView,
    setOnboardingStep,
    joinWorkspaceByRoomCode,
    setUserSession,
    locale,
    toggleLocale,
    accountType,
    setAccountType,
  } = useMonoSpecStore();

  const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRIES[0]);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [targetAccountType, setTargetAccountType] = useState<'enterprise' | 'freelancer'>('enterprise');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Interactive Live Showcase State in Hero
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'arch' | 'logo' | 'api' | 'figma'>('arch');
  
  // Interactive Pipeline Stage State
  const [activePipelineStageId, setActivePipelineStageId] = useState<string>('tech_analysis');

  // Contact & Support Form State
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportPhone, setSupportPhone] = useState('');
  const [supportCategory, setSupportCategory] = useState('technical');
  const [supportPriority, setSupportPriority] = useState('high');
  const [supportMessage, setSupportMessage] = useState('');
  const [ticketId, setTicketId] = useState<string | null>(null);

  const isArabic = locale === 'ar';

  const handleStartOnboarding = (type: 'enterprise' | 'freelancer' = 'enterprise') => {
    setAccountType(type);
    setOnboardingStep(1);
    setActiveView('onboarding');
  };

  const handleDirectDemoAccess = () => {
    setActiveView('workspace');
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (authMode === 'signup') {
      if (!nameInput.trim() || !emailInput.trim()) {
        setErrorMessage(isArabic ? 'يرجى إدخال الاسم والبريد الإلكتروني.' : 'Please enter your name and email.');
        return;
      }
      setAccountType(targetAccountType);
      setUserSession({
        id: `usr-${Date.now().toString(36)}`,
        name: nameInput.trim(),
        email: emailInput.trim(),
        role: targetAccountType === 'freelancer' ? 'Independent Consultant' : 'Enterprise Architect',
        workspaceId: '',
        isAuthenticated: true,
        accountType: targetAccountType,
      });
      setOnboardingStep(1);
      setActiveView('onboarding');
    } else {
      if (roomCodeInput.trim()) {
        const success = joinWorkspaceByRoomCode(roomCodeInput.trim());
        if (success) {
          setUserSession({
            id: `usr-${Date.now().toString(36)}`,
            name: nameInput.trim() || 'Team Member',
            email: emailInput.trim() || 'member@enterprise.internal',
            role: 'Collaborator',
            workspaceId: roomCodeInput.trim(),
            isAuthenticated: true,
          });
          setActiveView('workspace');
        } else {
          setErrorMessage(isArabic ? 'كود الغرفة غير صحيح. يرجى التأكد وإعادة المحاولة.' : 'Invalid team room code.');
        }
      } else {
        setUserSession({
          id: `usr-${Date.now().toString(36)}`,
          name: nameInput.trim() || 'Enterprise Architect',
          email: emailInput.trim() || 'architect@enterprise.internal',
          role: 'Architect',
          workspaceId: 'ws-default',
          isAuthenticated: true,
        });
        setActiveView('workspace');
      }
    }
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportName.trim() || !supportEmail.trim()) return;
    const generatedTicket = `MS-${Math.floor(10000 + Math.random() * 90000)}`;
    setTicketId(generatedTicket);
    setSupportMessage('');
  };

  return (
    <div className={`min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)] overflow-x-hidden font-sans ${isArabic ? 'rtl' : 'ltr'}`}>
      
      {/* 1. TOP STICKY GLASSMORPHIC NAVBAR (Clean, World-Class SaaS) */}
      <nav className="sticky top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/85 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center font-mono font-black text-base shadow-sm group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-[var(--text-primary)]">MonoSpec</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 font-bold">
                  v2.4
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] font-mono hidden md:block">
                Precision Architecture OS
              </p>
            </div>
          </button>
        </div>

        {/* Center Nav Links */}
        <div className="hidden lg:flex items-center gap-6 text-xs text-[var(--text-secondary)] font-medium">
          <a href="#features" className="hover:text-[var(--text-primary)] transition-colors">
            {isArabic ? 'المميزات' : 'Features'}
          </a>
          <a href="#how-it-works" className="hover:text-[var(--text-primary)] transition-colors">
            {isArabic ? 'كيف يسهل عملك؟' : 'How It Works'}
          </a>
          <a href="#pipeline" className="hover:text-[var(--text-primary)] transition-colors">
            {isArabic ? 'مراحل المشروع (7)' : '7-Stage Pipeline'}
          </a>
          <a href="#freelancers" className="hover:text-emerald-400 transition-colors font-semibold flex items-center gap-1 text-emerald-400">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{isArabic ? 'استوديو المستقلين' : 'Freelancer Studio'}</span>
          </a>
          <a href="#contact" className="hover:text-[var(--text-primary)] transition-colors font-semibold text-emerald-400">
            {isArabic ? 'الدعم والتواصل' : 'Support & Contact'}
          </a>
        </div>

        {/* Right Nav CTAs */}
        <div className="flex items-center gap-2">
          {/* Prominent Language Switcher Button (E / ع) */}
          <button
            onClick={toggleLocale}
            title={isArabic ? 'Switch to English' : 'التحويل للغة العربية'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-xs font-bold text-emerald-400 transition-colors shadow-2xs"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="font-mono text-xs">{isArabic ? 'English' : 'عربي'}</span>
          </button>

          <button
            onClick={handleDirectDemoAccess}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Play className="w-3 h-3 text-emerald-400 fill-current" />
            <span>{isArabic ? 'معاينة حية' : 'Live Demo'}</span>
          </button>

          <a
            href="#auth-portal"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] text-xs font-bold hover:opacity-90 transition-opacity shadow-xs"
          >
            <span>{isArabic ? 'ابدأ مجاناً' : 'Get Started'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </nav>

      {/* 2. HERO SECTION & FEATURES (World-Class SaaS, High Impact) */}
      <section id="features" className="relative px-4 sm:px-6 pt-14 sm:pt-20 pb-20 max-w-6xl mx-auto flex flex-col items-center text-center scroll-mt-24">
        {/* Ambient Radial Gradient Mesh */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[360px] bg-gradient-to-tr from-emerald-500/15 via-emerald-900/5 to-transparent blur-3xl pointer-events-none rounded-full" />

        {/* Floating Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 shadow-2xs mb-6 animate-in fade-in duration-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-xs font-bold">
            {isArabic ? 'الجيل القادم من معمارية البرمجيات وهندسة المواصفات' : 'Next-Gen Software Architecture & Spec Engine'}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-6xl font-black tracking-tight max-w-4xl text-[var(--text-primary)] leading-[1.12]">
          {isArabic ? (
            <>
              حوّل فكرة مشروعك إلى <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-zinc-300">مواصفات برمجية وهندسة معمارية</span> وشعار متكامل في ثوانٍ.
            </>
          ) : (
            <>
              Turn complex software into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-zinc-300">precision architecture specs</span> & visual identity in seconds.
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-xs sm:text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          {isArabic
            ? 'منظومة معمارية متكاملة للشركات التقنية والمستقلين: تدريب وتحليل ملفات الـ PDF ولينكات Google Drive، تصميم الشعار والهوية، استخراج توكنز Figma، وتوليد كود الـ APIs ومخططات الـ ERD بكود روم مخصص لكل عميل وتيم.'
            : 'Autonomous architecture OS for tech enterprises & solo freelancers. Deep ingestion of PDFs & Google Drive links, SVG logo vectors, Figma tokens, OpenAPI schemas, and shareable team room codes.'}
        </p>

        {/* Hero Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full max-w-xl">
          <button
            onClick={() => handleStartOnboarding('enterprise')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] text-xs sm:text-sm font-bold hover:opacity-95 transition-all shadow-md group"
          >
            <Building2 className="w-4 h-4" />
            <span>{isArabic ? 'مساحة عمل للشركات والتيم' : 'Enterprise Workspace'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => handleStartOnboarding('freelancer')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-emerald-500/50 bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-400 text-xs sm:text-sm font-bold transition-all shadow-xs group"
          >
            <Briefcase className="w-4 h-4" />
            <span>{isArabic ? 'استوديو المستقلين والفريلانسرز' : 'Freelancer Studio'}</span>
          </button>

          <button
            onClick={handleDirectDemoAccess}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-xs sm:text-sm font-medium text-[var(--text-primary)] transition-colors shadow-xs"
          >
            <Play className="w-4 h-4 text-emerald-400 fill-current" />
            <span>{isArabic ? 'معاينة تجريبية فورية' : 'Live Guest Demo'}</span>
          </button>
        </div>

        {/* 3. INTERACTIVE PRODUCT SHOWCASE (Looks like real app canvas!) */}
        <div className="mt-14 w-full max-w-5xl rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-surface)] p-2 sm:p-4 shadow-2xl relative overflow-hidden group">
          {/* Top Bar of Mockup */}
          <div className="flex items-center justify-between pb-3 px-2 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-[11px] font-mono text-[var(--text-muted)] ml-2">
                monospec-workspace-v2.4.spec
              </span>
            </div>

            {/* Showcase Tabs */}
            <div className="flex items-center gap-1 bg-[var(--bg-canvas)] p-1 rounded-lg border border-[var(--border-subtle)]">
              {[
                { id: 'arch', label: isArabic ? 'الهندسة المعمارية' : 'Architecture Spec', icon: FileText },
                { id: 'logo', label: isArabic ? 'الشعار والهوية' : 'SVG Logomark', icon: Sparkles },
                { id: 'api', label: isArabic ? 'كود الـ APIs' : 'OpenAPI Schema', icon: Terminal },
                { id: 'figma', label: isArabic ? 'توكنز Figma' : 'Figma Tokens', icon: Palette },
              ].map((tab) => {
                const Icon = tab.icon;
                const isAct = activeShowcaseTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveShowcaseTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                      isAct
                        ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] font-bold shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>P99 &lt; 38ms</span>
            </div>
          </div>

          {/* Body of Mockup */}
          <div className="p-4 sm:p-6 text-left font-mono text-xs space-y-4 bg-[var(--bg-canvas)] rounded-xl mt-2 min-h-[220px]">
            {activeShowcaseTab === 'arch' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                  <span>SPEC_ID: ARCH-8842-ENTERPRISE</span>
                  <span className="text-emerald-400">STATUS: 100% DETERMINISTIC</span>
                </div>
                <div className="p-3 rounded-lg bg-[var(--code-bg)] border border-[var(--border-subtle)] text-[var(--text-secondary)] space-y-1 text-[11px]">
                  <p className="text-white font-bold"># Microservices Event Mesh Architecture</p>
                  <p>- Ingestion Engine: Kafka Partition Hash [carrier_id, timestamp_bucket]</p>
                  <p>- Cache Isolation: Redis Cluster Multi-AZ with Distributed Idempotency Key</p>
                  <p>- Security & Compliance: OAuth 2.1 mTLS mutual verification + SAMA/ZATCA Gateways</p>
                </div>
              </div>
            )}

            {activeShowcaseTab === 'logo' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                  <span>VECTOR_ENGINE: SVG_GEOMETRIC_PRECISION</span>
                  <span className="text-emerald-400">TOKENS: DARK_MODE_COMPATIBLE</span>
                </div>
                <div className="p-4 rounded-lg bg-black border border-zinc-800 flex items-center justify-around">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center font-black text-2xl text-white">
                    M
                  </div>
                  <div className="space-y-1 text-[11px] text-zinc-300">
                    <p className="text-emerald-400 font-bold">Mathematical 45° Angle Geometry</p>
                    <p className="text-zinc-500 font-mono">Primary: #FFFFFF • Surface: #000000 • Accent: #10B981</p>
                  </div>
                </div>
              </div>
            )}

            {activeShowcaseTab === 'api' && (
              <div className="space-y-2 animate-in fade-in duration-200 text-[11px]">
                <span className="text-emerald-400">POST /api/v2/specs/generate</span>
                <pre className="p-3 rounded-lg bg-[var(--code-bg)] border border-[var(--border-subtle)] text-zinc-300 overflow-x-auto">
{`{
  "project": "Omnichannel Logistics Engine",
  "pipeline_stage": "engineering",
  "dod_verified": true,
  "endpoints": ["/telemetry", "/dispatch", "/customs/zatca"]
}`}
                </pre>
              </div>
            )}

            {activeShowcaseTab === 'figma' && (
              <div className="space-y-2 animate-in fade-in duration-200 text-[11px]">
                <span className="text-emerald-400">Tokens & Auto-Layout Synchronizer</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-center">
                    <span className="text-zinc-500 block text-[9px]">COLOR TOKEN</span>
                    <span className="font-bold text-white">Surface Base</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-center">
                    <span className="text-zinc-500 block text-[9px]">SPACING</span>
                    <span className="font-bold text-white">8pt Grid</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-center">
                    <span className="text-zinc-500 block text-[9px]">FRAMES</span>
                    <span className="font-bold text-emerald-400">Ready in Figma</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. KEY METRICS STATS BAR */}
        <div className={`mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-4xl ${isArabic ? 'text-right' : 'text-left'}`}>
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xs">
            <div className="text-2xl font-black font-mono text-[var(--text-primary)]">
              {isArabic ? '10 أضعاف أسرع' : '10x Faster'}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {isArabic ? 'تسليم المواصفات الفنية للعميل والتيم' : 'Speed in architectural spec delivery'}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xs">
            <div className="text-2xl font-black font-mono text-emerald-400">
              {isArabic ? '7 مراحل' : '7 Stages'}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {isArabic ? 'بما فيها مرحلة اللوجو والهوية البصرية' : 'Complete with Logo & Brand stage'}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xs">
            <div className="text-2xl font-black font-mono text-[var(--text-primary)]">
              {isArabic ? 'ملفات ومستندات' : 'PDF & Drive'}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {isArabic ? 'فهم عميق للجداول والكيانات والامتثال' : 'Deep parsing of documents & links'}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xs">
            <div className="text-2xl font-black font-mono text-[var(--text-primary)]">
              {isArabic ? 'رموز الغرف' : 'Room Codes'}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {isArabic ? 'روم مخصص لكل تيم ولكل موقع' : 'Unique codes per client / website'}
            </p>
          </div>
        </div>
      </section>

      {/* 5. HOW IT SIMPLIFIES YOUR WORK (مقارنة بصرية واضحة تحسم البيع) */}
      <section id="how-it-works" className="px-4 sm:px-6 py-20 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/40 scroll-mt-24">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
              {isArabic ? 'تحول جذري في أسلوب العمل' : 'WORKFLOW TRANSFORMATION'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              {isArabic ? 'كيف يسهل MonoSpec عملك ويوفر 80% من وقت المشروع؟' : 'How MonoSpec Simplifies Your Entire Workflow'}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              {isArabic
                ? 'مقارنة دقيقة بين الطريقة التقليدية المرهقة في توثيق المشاريع وبناء الهوية، وبين قوة وسرعة MonoSpec الذكية'
                : 'See the contrast between traditional manual document chaos and the automated MonoSpec pipeline'}
            </p>
          </div>

          {/* Before vs After Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old Way */}
            <div className="p-6 sm:p-8 rounded-2xl border border-red-500/20 bg-red-950/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-red-500/20">
                <span className="font-bold text-sm text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{isArabic ? 'الطريقة التقليدية القديمة' : 'Traditional Workflow'}</span>
                </span>
                <span className="text-[10px] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded">
                  {isArabic ? 'بطيئة ومكلفة' : 'Slow & Costly'}
                </span>
              </div>
              <ul className="space-y-3 text-xs text-[var(--text-secondary)]">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 shrink-0 font-bold">✕</span>
                  <span>
                    <strong>{isArabic ? 'تشتت الملفات: ' : 'Scattered Documents: '}</strong>
                    {isArabic ? 'كراسات الشروط مبعثرة في ملفات منفصلة لا يفهمها المطورون بدقة.' : 'Requirements scattered across documents that engineers easily misunderstand.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 shrink-0 font-bold">✕</span>
                  <span>
                    <strong>{isArabic ? 'انفصال الهوية عن الكود: ' : 'Disconnected Brand & UI: '}</strong>
                    {isArabic ? 'تصميم الشعار يتم بمعزل عن الشاشات والـ Figma وتوكنز الألوان.' : 'Logos designed in silos, disconnected from UI screens and Figma tokens.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 shrink-0 font-bold">✕</span>
                  <span>
                    <strong>{isArabic ? 'أخطاء المعمارية والـ APIs: ' : 'Architectural Inconsistencies: '}</strong>
                    {isArabic ? 'غياب مخططات الـ ERD والتدفقات، مما يسبب إعادة كتابة الكود لاحقاً.' : 'Missing ERDs and data flows leading to costly engineering refactors.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 shrink-0 font-bold">✕</span>
                  <span>
                    <strong>{isArabic ? 'صعوبة مشاركة العميل: ' : 'Fragmented Delivery: '}</strong>
                    {isArabic ? 'إرسال ملفات ضخمة بالإيميل بدون روم كود موحد ولا متابعة حية.' : 'Clunky attachments without unified room codes or live interactive progress.'}
                  </span>
                </li>
              </ul>
            </div>

            {/* The MonoSpec Way */}
            <div className="p-6 sm:p-8 rounded-2xl border border-emerald-500/40 bg-radial from-emerald-950/20 to-[var(--bg-surface)] space-y-4 shadow-xl ring-1 ring-emerald-500/30">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                <span className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                  <CheckCheck className="w-4 h-4" />
                  <span>{isArabic ? 'مع منظومة MonoSpec' : 'The MonoSpec Engine'}</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded font-bold">
                  {isArabic ? 'دقة 100%' : '100% Precision'}
                </span>
              </div>
              <ul className="space-y-3 text-xs text-[var(--text-primary)]">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                  <span>
                    <strong>{isArabic ? 'استيعاب الـ PDF وروابط درايف: ' : 'PDF & Drive Ingestion: '}</strong>
                    {isArabic ? 'يحلل النظام المستند تلقائياً ويستخرج الجداول والـ APIs فوراً.' : 'Parses requirements automatically, extracting database entities and endpoints.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                  <span>
                    <strong>{isArabic ? 'مرحلة الشعار والهوية المدمجة: ' : 'Integrated SVG Brand Studio: '}</strong>
                    {isArabic ? 'توليد شعار هندسي SVG فوري مع باليتة الألوان للشاشات الداكنة.' : 'Generates instant geometric SVG brand identity and theme palettes.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                  <span>
                    <strong>{isArabic ? 'تصدير لـ Figma وكود جاهز: ' : 'Figma & Production Code: '}</strong>
                    {isArabic ? 'توكنز التصميم ومخططات Mermaid وأكواد Next.js بنقرة واحدة.' : 'One-click export of design tokens, Mermaid diagrams, and clean code.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 shrink-0 font-bold">✓</span>
                  <span>
                    <strong>{isArabic ? 'كود روم موحد لكل تيم وموقع: ' : 'Dedicated Room Codes: '}</strong>
                    {isArabic ? 'يدخل العميل أو التيم برمز الروم ليرى كل مراحل مشروعه تفاعلياً.' : 'Clients & engineers access their interactive spec stages with a single room code.'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE 7-STAGE PIPELINE SECTION */}
      <section id="pipeline" className="px-4 sm:px-6 py-20 border-t border-[var(--border-subtle)] max-w-6xl mx-auto space-y-10 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
            {isArabic ? 'خط الإنتاج المتكامل' : 'END-TO-END PIPELINE'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            {isArabic ? 'مراحل خط الإنتاج الشاملة (7 مراحل متكاملة)' : 'Full 7-Stage Architectural Pipeline'}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            {isArabic
              ? 'كل مرحلة تنتج مخرجات برمجية ومعمارية حقيقية جاهزة للتنفيذ والتصدير'
              : 'Every stage produces deterministic code deliverables and production blueprints'}
          </p>
        </div>

        {/* 7 Stages Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {STAGES.map((stg) => {
            const isLogo = stg.id === 'logo';
            return (
              <div
                key={stg.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isLogo
                    ? 'border-emerald-500/50 bg-radial from-emerald-950/20 to-[var(--bg-surface)] shadow-md ring-1 ring-emerald-500/30'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xs hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]">
                      {stg.badge}
                    </span>
                    {isLogo && (
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        {isArabic ? 'شعار وهوية' : 'Brand Identity'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)]">
                      {isArabic ? stg.labelAr : stg.labelEn}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">
                      {isArabic ? (stg.shortDescAr || stg.shortDesc) : stg.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
                  <span>{isArabic ? 'قوائم معايير الإنجاز' : 'DoD Checklists'}</span>
                  <span className="text-emerald-400 font-bold">{isArabic ? 'جاهز 100%' : '100% Ready'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. DEDICATED FREELANCER SECTION (لو فريلانسر يدير مواقعه الخاصة) */}
      <section id="freelancers" className="px-4 sm:px-6 py-20 border-t border-[var(--border-subtle)] max-w-6xl mx-auto space-y-8 scroll-mt-24">
        <div className="p-8 sm:p-12 rounded-3xl border border-emerald-500/30 bg-radial from-emerald-950/30 via-zinc-950 to-black shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs font-semibold">
                <Briefcase className="w-3.5 h-3.5" />
                <span>{isArabic ? 'حل مخصص للمستقلين والفريلانسرز' : 'Dedicated for Solo Freelancers & Developers'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {isArabic ? 'فريلانسر؟ أضف مواقعك الخاصة وسلّم عملاءك كود روم استشاري.' : 'Freelancer? Manage Personal Platforms & Deliver Fortune-500 Specs.'}
              </h2>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {isArabic
                  ? 'بصفتك مستقلاً، صممنا لك نظاماً لا يفرض عليك إضافة شركات، بل يتيح لك إدارة مواقعك الخاصة وتطبيقات الويب (My Websites & Platforms) مع روابطها، وتوليد مواصفات معمارية، شعار، وكود روم لكل عميل.'
                  : 'Manage your own web apps, e-commerce stores, and digital portfolio with live domain URLs. Generate SVG brand marks and isolated architecture workspaces per project.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-200 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isArabic ? 'إضافة مواقعك الخاصة بروابطها ودوميناتها' : 'Manage personal platforms & custom domains'}</span>
                </div>
                <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-200 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isArabic ? 'كود روم مستقل لمشاركة كل مشروع مع العميل' : 'Isolated client room codes for easy handover'}</span>
                </div>
                <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-200 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isArabic ? 'توليد الشعار والهوية ومواصفات الـ APIs معاً' : 'Simultaneous SVG brand marks & API specs'}</span>
                </div>
                <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-200 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isArabic ? 'توفير تكلفة استشارات تقنية ضخمة' : 'Save thousands in technical consultation fees'}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleStartOnboarding('freelancer')}
                  className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs sm:text-sm font-extrabold tracking-wide uppercase transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>{isArabic ? 'سجل حسابك كـ مستقل الآن' : 'Start as a Freelancer Free'}</span>
                </button>
              </div>
            </div>

            {/* Freelancer Preview Mockup */}
            <div className="lg:col-span-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 font-mono text-xs space-y-3 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Globe className="w-3.5 h-3.5" />
                  {isArabic ? 'مواقعي وتطبيقاتي الخاصة' : 'MY WEBSITES & PLATFORMS'}
                </span>
                <span className="text-[10px] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">FREE-8842-PRO</span>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex justify-between items-center">
                  <div>
                    <span className="text-white font-bold block">Nova Store & E-Commerce</span>
                    <span className="text-emerald-400 text-[10px]">https://novastore.dev</span>
                  </div>
                  <span className="text-emerald-400 text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded">
                    {isArabic ? '7/7 مراحل' : '7/7 Stages'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex justify-between items-center">
                  <div>
                    <span className="text-white font-bold block">Personal Portfolio & Blog</span>
                    <span className="text-zinc-400 text-[10px]">https://nehal.dev</span>
                  </div>
                  <span className="text-zinc-400 text-[10px] bg-zinc-800 px-2 py-0.5 rounded">
                    {isArabic ? 'نشط' : 'Active'}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 text-center pt-1 font-sans">
                {isArabic ? 'كل موقع له معمارية خاصة وشعار وكود روم مخصص' : 'Isolated architecture specs & room codes for each website'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. COMPREHENSIVE CONTACT, NUMBERS & TECHNICAL SUPPORT (قسم الدعم الفني وأرقام التواصل المباشرة) */}
      <section id="contact" className="px-4 sm:px-6 py-20 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 scroll-mt-24">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
              {isArabic ? 'دعم واستفسارات على مدار الساعة' : '24/7 SUPPORT & COMMERCIAL INQUIRIES'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              {isArabic ? 'مركز الدعم الفني وأرقام التواصل المباشرة' : 'Direct Support Lines & Contact Center'}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              {isArabic
                ? 'فريقنا الهندسي متاح على مدار الساعة للإجابة عن استفساراتكم التقنية والتجارية ومناقشة تراخيص واستحواذ المنظومة'
                : 'Our technical team and enterprise desk are available 24/7 via direct phone hotlines and instant tickets'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Contact Numbers & Headquarters Info */}
            <div className="lg:col-span-5 space-y-4">
              {/* Direct Support Phone Numbers */}
              <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <Phone className="w-5 h-5 shrink-0" />
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">
                    {isArabic ? 'أرقام التواصل والدعم الفني المباشر' : 'Direct Support Lines & Hotlines'}
                  </h3>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] block font-sans">
                        {isArabic ? 'المؤسس والدعم الفني المباشر (م. نهال كمال)' : 'Founder & Technical Desk (Nehal Kamal)'}
                      </span>
                      <a href="tel:+201553646123" className="font-bold text-white hover:text-emerald-400 transition-colors">
                        +20 155 364 6123
                      </a>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                      {isArabic ? 'مباشر 24/7' : '24/7 Live'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] block font-sans">
                        {isArabic ? 'مصر والشرق الأوسط (القرية الذكية)' : 'Egypt & Regional Support (Smart Village)'}
                      </span>
                      <a href="tel:+201553646123" className="font-bold text-white hover:text-emerald-400 transition-colors">
                        +20 155 364 6123
                      </a>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                      {isArabic ? 'متاح' : 'Direct'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] block font-sans">
                        {isArabic ? 'الخط الساخن الدولي المجاني' : 'Toll-Free International Hotline'}
                      </span>
                      <span className="font-bold text-emerald-400">
                        800-MONOSPEC (800-666-67732)
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                      {isArabic ? 'مجاني' : 'Toll-Free'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Emails & Addresses */}
              <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] shadow-xs space-y-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Mail className="w-4 h-4 shrink-0" />
                  <h4 className="font-bold text-[var(--text-primary)]">
                    {isArabic ? 'عناوين البريد المباشر' : 'Official Direct Inboxes'}
                  </h4>
                </div>
                <div className="space-y-1.5 text-[11px] font-mono text-[var(--text-secondary)]">
                  <p>
                    {isArabic ? 'الدعم الفني والتقني: ' : 'Technical Support: '}
                    <a href="mailto:nehaledeib@gmail.com" className="text-white hover:underline">nehaledeib@gmail.com</a>
                  </p>
                  <p>
                    {isArabic ? 'مبيعات التراخيص والمؤسسات: ' : 'Enterprise & Licensing: '}
                    <a href="mailto:nehaledeib@gmail.com" className="text-white hover:underline">nehaledeib@gmail.com</a>
                  </p>
                  <p>
                    {isArabic ? 'الاستحواذ وشراء المشروع (نهال كمال): ' : 'Founder & Commercial Acquisition: '}
                    <a href="mailto:nehaledeib@gmail.com" className="text-emerald-400 font-bold hover:underline">nehaledeib@gmail.com</a>
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1.5 text-[11px] text-[var(--text-muted)]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      {isArabic
                        ? 'القاهرة: القرية الذكية | الرياض: برج التقنية | دبي: مركز DIFC'
                        : 'Cairo: Smart Village | Riyadh: Tech Tower | Dubai: DIFC'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold">{isArabic ? 'جميع الأنظمة السحابية تعمل بنسبة 100%' : 'All Cloud Systems 100% Operational'}</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">{isArabic ? 'زمن الاستجابة أقل من 3 دقائق' : 'Response SLA < 3 mins'}</span>
              </div>
            </div>

            {/* Right: Interactive Support & Purchase Ticket Form */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleSupportSubmit}
                className="p-6 sm:p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] shadow-xl space-y-4 text-xs"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-sm text-[var(--text-primary)]">
                      {isArabic ? 'فتح تذكرة دعم فني أو طلب استشارة وشراء' : 'Open Direct Ticket / Purchase Inquiry'}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    {isArabic ? 'استجابة فائقة السرعة' : 'Fast Response SLA'}
                  </span>
                </div>

                {ticketId ? (
                  <div className="p-6 rounded-xl border border-emerald-500/40 bg-emerald-950/20 text-center space-y-3 animate-in fade-in">
                    <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                    <h4 className="font-bold text-sm text-white">
                      {isArabic ? 'تم استلام طلبك وتوليد تذكرة الدعم بنجاح!' : 'Ticket Created Successfully!'}
                    </h4>
                    <p className="text-xs text-zinc-300">
                      {isArabic ? (
                        <>رقم التذكرة: <strong className="font-mono text-emerald-400">{ticketId}</strong> • تم توجيه الطلب للمهندس المختص وسيتواصل معك خلال دقائق.</>
                      ) : (
                        <>Ticket ID: <strong className="font-mono text-emerald-400">{ticketId}</strong> • Assigned to lead engineer, we will contact you shortly.</>
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => setTicketId(null)}
                      className="px-4 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-950/40 transition-colors"
                    >
                      {isArabic ? 'إرسال استفسار آخر' : 'Submit Another Inquiry'}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-[var(--text-secondary)]">
                          {isArabic ? 'الاسم الكامل *' : 'Your Name *'}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={isArabic ? 'نهال كمال' : 'Nehal Kamal'}
                          value={supportName}
                          onChange={(e) => setSupportName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--border-strong)]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-[var(--text-secondary)]">
                          {isArabic ? 'البريد الإلكتروني المهني *' : 'Business Email *'}
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="nehaledeib@gmail.com"
                          value={supportEmail}
                          onChange={(e) => setSupportEmail(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--border-strong)]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-[var(--text-secondary)]">
                          {isArabic ? 'رقم الهاتف أو الواتساب' : 'Phone / WhatsApp'}
                        </label>
                        <input
                          type="tel"
                          placeholder="+201553646123"
                          value={supportPhone}
                          onChange={(e) => setSupportPhone(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-mono focus:outline-hidden focus:border-[var(--border-strong)]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-[var(--text-secondary)]">
                          {isArabic ? 'نوع الاستفسار / الموضوع' : 'Inquiry Category'}
                        </label>
                        <select
                          value={supportCategory}
                          onChange={(e) => setSupportCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-hidden"
                        >
                          <option value="technical">{isArabic ? 'دعم فني واستشارات معمارية' : 'Technical & Architecture Support'}</option>
                          <option value="buyout">{isArabic ? 'شراء وترخيص المشروع بالكامل' : 'Full Commercial Buyout & IP License'}</option>
                          <option value="enterprise">{isArabic ? 'اشتراك شركات ومؤسسات كبرى' : 'Enterprise & Team Plan'}</option>
                          <option value="freelancer">{isArabic ? 'مساعدة حسابات المستقلين' : 'Freelancer Studio Support'}</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[var(--text-secondary)]">
                        {isArabic ? 'تفاصيل الاستفسار أو الرسالة *' : 'Message Details *'}
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder={isArabic ? 'اكتب تفاصيل طلبك الفني أو اهتمامك بشراء وترخيص المنظومة...' : 'Describe your technical requirements or commercial licensing inquiry...'}
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-hidden resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isArabic ? 'بياناتك محمية ومحفوظة بموجب اتفاقية سرية (NDA)' : 'Protected by Enterprise Non-Disclosure Agreement (NDA)'}</span>
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'إرسال التذكرة فوراً' : 'Submit Direct Ticket'}</span>
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 10. AUTH PORTAL & WORKSPACE ACCESS */}
      <section id="auth-portal" className="px-4 sm:px-6 py-20 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] scroll-mt-24">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center font-mono font-black text-xl mx-auto shadow-md">
              M
            </div>
            <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
              {authMode === 'signup'
                ? (isArabic ? 'إنشاء حساب ومساحة عمل جديدة' : 'Create New Account & Workspace')
                : (isArabic ? 'تسجيل الدخول إلى مساحة العمل' : 'Sign In to Workspace')}
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              {authMode === 'signup'
                ? (isArabic ? 'ابدأ بإعداد مساحة عمل فريقك أو حسابك كـ مستقل بكود مخصص' : 'Setup your team room or freelancer studio with a room code')
                : (isArabic ? 'أدخل كود الغرفة أو بريدك للوصول إلى مشاريعك' : 'Enter your room code or email to access projects')}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]">
            <button
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'signup'
                  ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isArabic ? 'تسجيل جديد' : 'Sign Up'}</span>
            </button>
            <button
              onClick={() => {
                setAuthMode('signin');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'signin'
                  ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isArabic ? 'تسجيل دخول' : 'Sign In'}</span>
            </button>
          </div>

          {/* Persona selector on signup */}
          {authMode === 'signup' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setTargetAccountType('enterprise')}
                className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                  targetAccountType === 'enterprise'
                    ? 'border-[var(--border-strong)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] ring-1 ring-[var(--border-strong)] font-bold'
                    : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                }`}
              >
                {isArabic ? '🏢 شركة / فريق عمل' : '🏢 Enterprise Team'}
              </button>
              <button
                type="button"
                onClick={() => setTargetAccountType('freelancer')}
                className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                  targetAccountType === 'freelancer'
                    ? 'border-emerald-500/60 bg-emerald-950/30 text-emerald-400 ring-1 ring-emerald-500/30 font-bold'
                    : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                }`}
              >
                {isArabic ? '💼 مستقل / فريلانسر' : '💼 Solo Freelancer'}
              </button>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleAuthSubmit}
            className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] shadow-xl space-y-4 text-xs"
          >
            {errorMessage && (
              <div className="p-3 rounded-lg border border-red-500/30 bg-red-950/30 text-red-300 text-xs">
                {errorMessage}
              </div>
            )}

            {authMode === 'signup' && (
              <div className="space-y-1">
                <label className="font-semibold text-[var(--text-secondary)]">
                  {isArabic ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <input
                  type="text"
                  placeholder={isArabic ? 'نهال كمال' : 'Nehal Kamal'}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--border-strong)]"
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="font-semibold text-[var(--text-secondary)]">
                {isArabic ? 'البريد الإلكتروني المهني' : 'Work Email Address'}
              </label>
              <input
                type="email"
                placeholder="nehaledeib@gmail.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--border-strong)]"
                required
              />
            </div>

            {authMode === 'signin' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-[var(--text-secondary)]">
                    {isArabic ? 'كود الغرفة للفريق (اختياري)' : 'Team Room Code (Optional)'}
                  </label>
                  <span className="text-[10px] font-mono text-emerald-400">e.g. MONO-8842-PRO</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. MONO-8842-PRO"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-mono uppercase focus:outline-hidden focus:border-[var(--border-strong)]"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xs"
            >
              <span>
                {authMode === 'signup'
                  ? (isArabic ? 'متابعة لإعداد مساحة العمل والشركات ←' : 'Continue to Workspace Setup →')
                  : (isArabic ? 'دخول مساحة العمل ←' : 'Enter Workspace →')}
              </span>
            </button>

            <div className="pt-2 text-center border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={handleDirectDemoAccess}
                className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors underline underline-offset-2"
              >
                {isArabic
                  ? 'أو الدخول مباشرة كزائر لاستكشاف المشاريع الحالية'
                  : 'Or enter directly as guest to explore active projects'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 11. CORPORATE WORLD-CLASS SAAS FOOTER */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-14 px-4 sm:px-8 text-xs text-[var(--text-muted)]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center font-mono font-black text-sm">
                M
              </div>
              <span className="font-extrabold text-base text-[var(--text-primary)]">MonoSpec</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm leading-relaxed">
              {isArabic
                ? 'المنظومة السحابية المتقدمة لهندسة معمارية البرمجيات، تحويل كراسات الشروط إلى مواصفات تقنية وشعارات واختبارات قياسية.'
                : 'The autonomous operating system for deterministic software architecture, visual identity, and live spec governance.'}
            </p>
            <div className="flex items-center gap-3 pt-2 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isArabic ? 'متوافق مع معايير SAMA و ZATCA و NCA و SOC2' : 'SAMA • ZATCA • NCA • SOC2 COMPLIANT'}</span>
            </div>
          </div>

          {/* Col 1 */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[var(--text-primary)]">{isArabic ? 'المنظومة' : 'Platform'}</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#pipeline" className="hover:text-white transition-colors">{isArabic ? 'المراحل السبع' : 'The 7 Stages'}</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">{isArabic ? 'تحليل PDF ومستندات العمل' : 'PDF & Drive Ingestion'}</a></li>
              <li><a href="#freelancers" className="hover:text-white transition-colors">{isArabic ? 'استوديو المستقلين' : 'Freelancer Studio'}</a></li>
              <li><a href="#pipeline" className="hover:text-white transition-colors">{isArabic ? 'تكاملات Figma والمعمارية' : 'Figma & Architecture'}</a></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[var(--text-primary)]">{isArabic ? 'القطاعات' : 'Industries'}</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#how-it-works" className="hover:text-white transition-colors">{isArabic ? 'التقنية المالية والمدفوعات' : 'FinTech & Payments'}</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">{isArabic ? 'اللوجستيات والشحن' : 'Logistics & Supply Chain'}</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">{isArabic ? 'الرعاية الصحية (HIPAA)' : 'HealthTech (HIPAA)'}</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">{isArabic ? 'الأنظمة السيادية والحكومية' : 'GovTech & Sovereign Cloud'}</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[var(--text-primary)]">{isArabic ? 'الدعم والتواصل' : 'Direct Support'}</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="tel:+201553646123" className="hover:text-white font-mono transition-colors">+20 155 364 6123</a></li>
              <li><a href="mailto:nehaledeib@gmail.com" className="hover:text-white font-mono transition-colors">nehaledeib@gmail.com</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">{isArabic ? 'فتح تذكرة دعم فني' : 'Open Support Ticket'}</a></li>
              <li><a href="mailto:nehaledeib@gmail.com" className="text-emerald-400 font-bold hover:underline">{isArabic ? 'شراء وترخيص المشروع' : 'Commercial IP Buyout'}</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>{isArabic ? '© 2026 منظومة MonoSpec التقنية. كافة الحقوق محفوظة.' : '© 2026 MonoSpec Enterprise OS. All rights reserved.'}</p>
          <div className="flex items-center gap-4 text-[var(--text-muted)]">
            <a href="#contact" className="hover:text-white transition-colors">{isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}</a>
            <span>•</span>
            <a href="#contact" className="hover:text-white transition-colors">{isArabic ? 'شروط الاستخدام' : 'Terms of Service'}</a>
            <span>•</span>
            <a href="#contact" className="hover:text-white transition-colors">{isArabic ? 'شهادات الامتثال والأمان' : 'Security & Compliance'}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

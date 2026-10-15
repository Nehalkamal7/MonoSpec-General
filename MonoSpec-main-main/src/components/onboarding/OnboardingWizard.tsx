'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  KeyRound,
  Building2,
  Check,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Layers,
  Copy,
  CheckCircle2,
  HelpCircle,
  FileCode2,
  Palette,
  Terminal,
  CheckSquare,
  FileText,
  Server,
  ShieldCheck,
  Rocket,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';
import { RECOMMENDED_STAGES } from '@/lib/constants';
import { Company, StageDefinition } from '@/types';

const STAGE_ICON_MAP: Record<string, typeof FileCode2> = {
  tech_analysis: FileCode2,
  logo: Sparkles,
  ui_ux: Palette,
  engineering: Terminal,
  qa_testing: CheckSquare,
  content: FileText,
  devops: Server,
  security_compliance: ShieldCheck,
  gtm_marketing: Rocket,
};

export function OnboardingWizard() {
  const {
    onboardingStep,
    setOnboardingStep,
    setActiveView,
    createWorkspaceWithRoomCode,
    addCompany,
    companies,
    setCompanies,
    setSelectedStageIds,
    selectedStageIds,
    customStages,
    addCustomStage,
    accountType,
    locale,
  } = useMonoSpecStore();

  const isArabic = locale === 'ar';
  const isFreelancer = accountType === 'freelancer';

  // Step 1: Workspace State
  const [workspaceName, setWorkspaceName] = useState(
    isFreelancer 
      ? (isArabic ? 'استوديو المواقع والمشاريع الخاصة' : 'Freelancer Studio & Web Apps') 
      : (isArabic ? 'فريق أبيكس للابتكارات والأنظمة' : 'Apex Innovations Team')
  );
  const [roomCode, setRoomCode] = useState(
    isFreelancer ? 'FREE-8842-PRO' : 'MONO-8842-KSA'
  );
  const [copiedCode, setCopiedCode] = useState(false);

  // Step 2: Site / Company Setup State - Tailored for Freelancers vs Enterprise
  const [companyList, setCompanyList] = useState<Omit<Company, 'id'>[]>([]);
  const [newCompName, setNewCompName] = useState('');
  const [newCompNameAr, setNewCompNameAr] = useState('');
  const [newCompCode, setNewCompCode] = useState('');
  const [newCompUrl, setNewCompUrl] = useState('');
  const [newCompIndustry, setNewCompIndustry] = useState('');

  // Step 3: Stages State
  const [chosenStageIds, setChosenStageIds] = useState<string[]>(
    RECOMMENDED_STAGES.filter((s) => s.isRecommended).map((s) => s.id)
  );
  const [customStageLabel, setCustomStageLabel] = useState('');
  const [customStageLabelAr, setCustomStageLabelAr] = useState('');

  const handleCopyCode = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(roomCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleNameChange = (val: string) => {
    setNewCompName(val);
    if (!newCompCode || newCompCode.length <= 4) {
      const words = val.trim().split(/\s+/);
      const code =
        words.length > 1
          ? words
              .map((w) => w[0])
              .join('')
              .slice(0, 4)
              .toUpperCase()
          : val.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase();
      if (code) setNewCompCode(code);
    }
  };

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName.trim()) return;

    const code = (newCompCode.trim() || newCompName.slice(0, 3)).toUpperCase();
    setCompanyList((prev) => [
      ...prev,
      {
        name: newCompName.trim(),
        nameAr: newCompNameAr.trim() || newCompName.trim(),
        code,
        websiteUrl: newCompUrl.trim() || undefined,
        industry:
          newCompIndustry.trim() ||
          (isFreelancer 
            ? (isArabic ? 'منصة وتطبيق ويب' : 'Web App & Platform') 
            : (isArabic ? 'تقنية وأنظمة برمجية' : 'Software & Technology')),
        tagline: `${
          isFreelancer 
            ? (isArabic ? 'مواصفات وتصميم موقع' : 'Architecture & Spec for') 
            : (isArabic ? 'معمارية برمجية لـ' : 'Enterprise Architecture for')
        } ${newCompName.trim()}`,
        type: isFreelancer ? 'freelancer_site' : 'enterprise',
      },
    ]);

    setNewCompName('');
    setNewCompNameAr('');
    setNewCompCode('');
    setNewCompUrl('');
    setNewCompIndustry('');
  };

  const handleLoadSampleCompany = () => {
    if (isFreelancer) {
      setCompanyList([
        {
          name: 'Nova Store & E-Commerce',
          nameAr: 'متجر ومنصة نوفا للتجارة السريعة',
          code: 'NOVA',
          websiteUrl: 'https://novastore.dev',
          industry: isArabic ? 'متجر إلكتروني ومنصة دفع' : 'E-Commerce Storefront',
          tagline: isArabic ? 'منصة ويب للتجارة الإلكترونية والمدفوعات' : 'Headless e-commerce platform',
          type: 'freelancer_site',
        },
      ]);
    } else {
      setCompanyList([
        {
          name: 'Apex Cloud Innovations',
          nameAr: 'أنظمة أبيكس السحابية المتقدمة',
          code: 'APX',
          websiteUrl: 'https://apexcloud.internal',
          industry: isArabic ? 'أنظمة سحابية وتكنولوجيا مالية' : 'Enterprise Cloud & FinTech Systems',
          tagline: isArabic ? 'منصة معمارية عالية الإتاحة' : 'High-Availability Architecture Platform',
          type: 'enterprise',
        },
      ]);
    }
  };

  const handleRemoveCompany = (index: number) => {
    setCompanyList((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleToggleStage = (stageId: string) => {
    setChosenStageIds((prev) =>
      prev.includes(stageId)
        ? prev.length > 1
          ? prev.filter((id) => id !== stageId)
          : prev
        : [...prev, stageId]
    );
  };

  const handleSelectAllRecommended = () => {
    setChosenStageIds(RECOMMENDED_STAGES.filter((s) => s.isRecommended).map((s) => s.id));
  };

  const handleAddCustomStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStageLabel.trim()) return;

    const newId = `custom_${customStageLabel.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const newStage: StageDefinition = {
      id: newId,
      index: customStages.length + 1,
      labelEn: customStageLabel.trim(),
      labelAr: customStageLabelAr.trim() || customStageLabel.trim(),
      shortDesc: isArabic ? 'مرحلة معمارية مخصصة تم إعدادها خلال التهيئة' : 'Custom enterprise pipeline stage configured during onboarding',
      badge: `CUST-0${customStages.length + 1}`,
      isRecommended: false,
    };

    addCustomStage(newStage);
    setChosenStageIds((prev) => [...prev, newId]);
    setCustomStageLabel('');
    setCustomStageLabelAr('');
  };

  const handleFinishOnboarding = () => {
    // 1. Create Workspace
    createWorkspaceWithRoomCode(workspaceName, roomCode);

    // 2. Set dynamic companies / sites (configured by user)
    const finalCompanies: Company[] = (
      companyList.length > 0
        ? companyList
        : [
            {
              name: workspaceName || (isFreelancer ? 'Portfolio Web App' : 'Apex Systems'),
              nameAr: workspaceName || (isFreelancer ? 'موقعي الشخصي' : 'أنظمة أبيكس'),
              code: (workspaceName || (isFreelancer ? 'WEB' : 'APX')).slice(0, 3).toUpperCase(),
              websiteUrl: undefined,
              industry: isFreelancer 
                ? (isArabic ? 'منصة وتطبيق ويب' : 'Web App & Platform') 
                : (isArabic ? 'تقنية وأنظمة برمجية' : 'Software & Technology'),
              tagline: `${isFreelancer ? 'مواصفات وتصميم موقع' : 'Enterprise Architecture for'} ${workspaceName || 'Platform'}`,
              type: isFreelancer ? ('freelancer_site' as const) : ('enterprise' as const),
            },
          ]
    ).map((comp: Omit<Company, 'id'>, idx) => ({
      id: `comp-${Date.now().toString(36)}-${idx}`,
      name: comp.name,
      nameAr: comp.nameAr || comp.name,
      code: comp.code || comp.name.slice(0, 3).toUpperCase(),
      industry: comp.industry || (isFreelancer ? 'منصة وتطبيق ويب' : 'Software & Technology'),
      tagline: comp.tagline || `${isFreelancer ? 'مواصفات وتصميم موقع' : 'Enterprise Architecture for'} ${comp.name}`,
      websiteUrl: comp.websiteUrl,
      type: isFreelancer ? 'freelancer_site' : 'enterprise',
      isCustom: true,
    }));

    setCompanies(finalCompanies);

    // 3. Set Selected Stages
    setSelectedStageIds(chosenStageIds);

    // 4. Update workspace initial projects to be mapped to the user's primary company/site!
    const currentState = useMonoSpecStore.getState();
    if (currentState.projects.length > 0 && finalCompanies[0]) {
      const updatedProjects = currentState.projects.map((proj, pIdx) => ({
        ...proj,
        companyId: finalCompanies[pIdx % finalCompanies.length].id,
      }));
      useMonoSpecStore.setState({
        projects: updatedProjects,
        activeProjectId: updatedProjects[0].id,
        selectedCompanyFilter: 'all',
      });
    }

    // 5. Launch into workspace
    setActiveView('workspace');
  };

  return (
    <div className={`h-screen w-full bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)] font-sans overflow-hidden ${isArabic ? 'rtl' : 'ltr'}`}>
      {/* Top Bar */}
      <header className="h-16 shrink-0 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('landing')}
            className="w-9 h-9 rounded-xl bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center font-mono font-black text-base shadow-xs"
          >
            M
          </button>
          <div>
            <h1 className="text-sm font-bold tracking-tight">
              {isFreelancer 
                ? (isArabic ? 'إعداد استوديو المستقل MonoSpec' : 'Setup MonoSpec Freelancer Studio') 
                : (isArabic ? 'إعداد مساحة عمل MonoSpec' : 'Setup MonoSpec Workspace')}
            </h1>
            <p className="text-[11px] text-[var(--text-muted)]">
              {isFreelancer 
                ? (isArabic ? 'تهيئة النظام لمشاريعك ومواقعك الخاصة في 3 خطوات بسيطة' : 'Configure your web platforms in 3 simple steps') 
                : (isArabic ? 'تهيئة النظام لشركتك وفريقك في 3 خطوات بسيطة' : 'Configure your team & architecture pipeline in 3 simple steps')}
            </p>
          </div>
        </div>

        {/* Step Indicator Pills */}
        <div className="flex items-center gap-2">
          {[
            { num: 1, title: isFreelancer ? (isArabic ? 'الاستوديو والروم' : 'Studio & Room') : (isArabic ? 'مساحة العمل والروم' : 'Workspace & Room') },
            { num: 2, title: isFreelancer ? (isArabic ? 'المواقع والمنصات' : 'Websites & Platforms') : (isArabic ? 'الشركات والعملاء' : 'Companies & Clients') },
            { num: 3, title: isFreelancer ? (isArabic ? 'مراحل تصميم الموقع' : 'Platform Stages') : (isArabic ? 'مراحل المشروع' : 'Pipeline Stages') },
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium transition-all ${
                onboardingStep === s.num
                  ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] shadow-xs'
                  : onboardingStep > s.num
                  ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-400'
                  : 'border border-[var(--border-subtle)] text-[var(--text-muted)]'
              }`}
            >
              <span>0{s.num}.</span>
              <span className="font-sans text-[11px]">{s.title}</span>
            </div>
          ))}
        </div>
      </header>

      {/* Main Wizard Step Container - Fully Scrollable */}
      <main className="flex-1 overflow-y-auto w-full overscroll-contain py-8 px-4 sm:px-8">
        <div className="max-w-3xl w-full mx-auto space-y-6 pb-24">
        {/* STEP 1: Workspace & Room Code */}
        {onboardingStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                {isArabic ? 'الخطوة 01 من 03 • مساحة العمل' : 'STEP 01 OF 03 • TEAM WORKSPACE'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {isArabic 
                  ? 'أنشئ مساحة عمل خاصة بفريقك بكود غرفة مميز' 
                  : 'Create Team Workspace & Dedicated Room Code'}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                {isArabic
                  ? 'مساحة العمل تجمع كل مشاريعك ومواصفاتك الفنية. يمكنك مشاركة كود الروم مع أي عضو في الفريق للدخول الفوري.'
                  : 'Your workspace consolidates all specifications, architectural stages, and team models. Share the room code for instant access.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-md space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">
                  {isArabic ? 'اسم مساحة العمل' : 'Workspace Name'}
                </label>
                <input
                  type="text"
                  placeholder={isArabic ? 'مثال: فريق التطوير والأنظمة المعمارية' : 'e.g. Apex Engineering Team'}
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--border-strong)]"
                  required
                />
              </div>

              {/* Unique Room Code Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isArabic ? 'الكود المميز للغرفة' : 'Unique Team Room Code'}</span>
                  </label>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {isArabic ? 'يمكنك تعديله أو استخدام الكود المولد تلقائياً' : 'Customize or keep auto-generated code'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3.5 py-2.5 text-sm font-mono font-bold uppercase rounded-xl border border-emerald-500/40 bg-emerald-950/20 text-emerald-400 focus:outline-hidden focus:border-emerald-400 tracking-wider shadow-inner"
                    placeholder="e.g. MONO-8842-PRO"
                  />
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{isArabic ? 'تم النسخ' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        <span>{isArabic ? 'نسخ الكود' : 'Copy Code'}</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {isArabic ? (
                    <>💡 يستطيع أي مهندس أو مصمم الانضمام للروم عبر إدخال الكود <strong className="text-[var(--text-primary)] font-mono">{roomCode}</strong> في صفحة الدخول.</>
                  ) : (
                    <>💡 Engineers & collaborators join this room directly by entering code <strong className="text-[var(--text-primary)] font-mono">{roomCode}</strong> on the login portal.</>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Company Setup & Dynamic Multi-Company Addition (or Freelancer Sites) */}
        {onboardingStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                {isFreelancer 
                  ? (isArabic ? 'الخطوة 02 من 03 • المواقع والمنصات الرقمية' : 'STEP 02 OF 03 • WEBSITES & PLATFORMS') 
                  : (isArabic ? 'الخطوة 02 من 03 • إعداد الشركات والعملاء' : 'STEP 02 OF 03 • COMPANY SETUP')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {isFreelancer
                  ? (isArabic ? 'ما هي مواقعك أو منصاتك وتطبيقاتك الخاصة؟' : 'What are your web apps and personal platforms?')
                  : (isArabic ? 'ما اسم شركتك أو عميلك المستهدف؟' : 'What is your company or client name?')}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                {isFreelancer
                  ? (isArabic
                      ? 'أضف مواقعك الخاصة وتطبيقات الويب التي تعمل عليها. كل موقع ستُصمَّم له مواصفات معمارية، شعار، وروم كود مخصص.'
                      : 'Add your web apps, portfolio, or SaaS products. Each website gets its own architecture spec, SVG logo, and room code.')
                  : (isArabic
                      ? 'أدخل شركتك لتهيئة مساحة العمل، ويمكنك إضافة فروع أو عملاء متعددين لعزل المواصفات والبيانات مع إمكانية التعديل والحذف في أي وقت.'
                      : 'Configure client accounts or company entities to isolate architecture blueprints and compliance datasets.')}
              </p>
            </div>

            {/* List of Configured Sites / Companies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                  {isFreelancer 
                    ? (isArabic ? 'مواقعك ومنصاتك المضافة حالياً' : 'Current Websites & Platforms') 
                    : (isArabic ? 'الشركات المضافة حالياً' : 'Current Configured Companies')} ({companyList.length})
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  {isFreelancer 
                    ? (isArabic ? 'يمكنك إضافة أو حذف أي موقع بحرية' : 'Add or remove websites freely') 
                    : (isArabic ? 'يمكنك حذف أو تعديل أو إضافة أي عدد' : 'Add or remove client accounts freely')}
                </span>
              </div>

              {companyList.length === 0 ? (
                /* Empty state when nothing added yet */
                <div className="p-6 rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    {isFreelancer ? <Globe className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[var(--text-primary)]">
                      {isFreelancer 
                        ? (isArabic ? 'لم تقم بإضافة أي موقع أو منصة بعد' : 'No personal websites added yet') 
                        : (isArabic ? 'لم تقم بإضافة شركات حتى الآن' : 'No companies added yet')}
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)] mt-1 max-w-md mx-auto leading-relaxed">
                      {isFreelancer
                        ? (isArabic
                            ? 'أدخل اسم ورابط موقعك الخاص في النموذج أدناه واضغط حفظ وإضافة، أو اضغط الزر التجريبي لتحميل موقع تجريبي سريعاً.'
                            : 'Enter your website details in the form below and click save, or click the sample button for a quick start.')
                        : (isArabic
                            ? 'أدخل اسم شركتك في النموذج أدناه واضغط حفظ وإضافة، أو اضغط الزر التجريبي لاختبار النظام بنموذج سريع.'
                            : 'Enter your company details in the form below and click save, or load the instant sample template.')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLoadSampleCompany}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-400 text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {isFreelancer 
                        ? (isArabic ? 'تجربة بموقع أو منصة تجريبية سريعة' : 'Load Sample Freelancer Site') 
                        : (isArabic ? 'تجربة بشركة تجريبية سريعة' : 'Load Sample Enterprise Company')}
                    </span>
                  </button>
                </div>
              ) : (
                /* Dynamic site/company cards - each can be deleted freely! */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {companyList.map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between shadow-2xs group hover:border-[var(--border-strong)] transition-colors"
                    >
                      <div className="space-y-0.5 min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          {isFreelancer ? (
                            <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <Building2 className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                          )}
                          <span className="font-bold text-xs text-[var(--text-primary)] truncate">
                            {isArabic ? (comp.nameAr || comp.name) : comp.name}
                          </span>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)]">
                            {comp.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] truncate">
                          {comp.industry}
                        </p>
                        {comp.websiteUrl && (
                          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{comp.websiteUrl}</span>
                          </div>
                        )}
                      </div>

                      {/* Always removable with no restrictions! */}
                      <button
                        type="button"
                        onClick={() => handleRemoveCompany(idx)}
                        title={isArabic ? 'حذف من القائمة' : 'Remove from list'}
                        className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-red-400 hover:bg-red-950/20 transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form to Add a Site / Company */}
            <form
              onSubmit={handleAddCompany}
              className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isFreelancer ? (
                    <Globe className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Plus className="w-4 h-4 text-emerald-400" />
                  )}
                  <h3 className="text-xs font-bold text-[var(--text-primary)]">
                    {isFreelancer 
                      ? (isArabic ? 'إضافة موقع أو منصة خاصة جديدة' : 'Add New Website / Platform') 
                      : (isArabic ? 'إضافة شركة أو عميل جديد' : 'Add New Client / Company')}
                  </h3>
                </div>
                <span className="text-[10px] text-[var(--text-muted)]">
                  {isArabic ? '* الحقول الأساسية والكود إلزامية' : '* Required fields'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[var(--text-secondary)]">
                    {isFreelancer 
                      ? (isArabic ? 'اسم الموقع أو المنصة *' : 'Website Name *') 
                      : (isArabic ? 'اسم الشركة *' : 'Company Name *')}
                  </label>
                  <input
                    type="text"
                    placeholder={isFreelancer 
                      ? (isArabic ? 'مثال: متجر نوفا' : 'e.g. Nova Storefront') 
                      : (isArabic ? 'مثال: شركة أبيكس للتقنية' : 'e.g. Apex FinTech Solutions')}
                    value={newCompName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[var(--text-secondary)]">
                    {isFreelancer 
                      ? (isArabic ? 'الاسم البديل (اختياري)' : 'Alternative Name (Optional)') 
                      : (isArabic ? 'الاسم البديل (اختياري)' : 'Alternative Name (Optional)')}
                  </label>
                  <input
                    type="text"
                    placeholder={isFreelancer 
                      ? (isArabic ? 'مثال: متجر نوفا للتجارة' : 'e.g. Nova Storefront Alt') 
                      : (isArabic ? 'مثال: شركة أبيكس السحابية' : 'e.g. Apex Cloud Solutions')}
                    value={newCompNameAr}
                    onChange={(e) => setNewCompNameAr(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[var(--text-secondary)]">
                    {isFreelancer 
                      ? (isArabic ? 'كود الموقع المختصر *' : 'Site Code *') 
                      : (isArabic ? 'كود الشركة المميز *' : 'Company Code *')}
                  </label>
                  <input
                    type="text"
                    placeholder={isFreelancer ? 'NOVA' : 'APX'}
                    maxLength={5}
                    value={newCompCode}
                    onChange={(e) => setNewCompCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-mono uppercase focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[var(--text-secondary)]">
                    {isFreelancer 
                      ? (isArabic ? 'رابط الموقع أو النطاق' : 'Website URL') 
                      : (isArabic ? 'رابط الموقع أو النطاق' : 'Website URL')}
                  </label>
                  <input
                    type="text"
                    placeholder="https://mywebsite.com"
                    value={newCompUrl}
                    onChange={(e) => setNewCompUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-hidden font-mono text-[11px]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-medium text-[var(--text-secondary)]">
                    {isFreelancer 
                      ? (isArabic ? 'نوع المنصة أو التخصص' : 'Platform Type') 
                      : (isArabic ? 'المجال أو القطاع' : 'Industry')}
                  </label>
                  <input
                    type="text"
                    placeholder={isFreelancer 
                      ? (isArabic ? 'مثال: متجر إلكتروني، مدونة، منصة سحابية' : 'e.g. E-Commerce, Blog, SaaS') 
                      : (isArabic ? 'مثال: مدفوعات، لوجستيات، تجارة' : 'e.g. FinTech, Logistics, Retail')}
                    value={newCompIndustry}
                    onChange={(e) => setNewCompIndustry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newCompName.trim()}
                  className="px-4 py-2 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] text-xs font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity"
                >
                  {isFreelancer 
                    ? (isArabic ? '+ حفظ وإضافة الموقع للقائمة' : '+ Save & Add Website') 
                    : (isArabic ? '+ حفظ وإضافة للقائمة' : '+ Save & Add Company')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Project Stages & Recommendations */}
        {onboardingStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                {isArabic ? 'الخطوة 3 من 3 • مراحل المسار البرمجي' : 'STEP 03 OF 03 • PIPELINE STAGES'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {isArabic ? 'ما هي مراحل مشروعك؟' : 'Configure Your Architectural Stages'}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                {isArabic 
                  ? 'حدد المراحل التي يمر بها مشروعك البرمجي، مع إمكانية استخدام المراحل الموصى بها مسبقاً بما فيها تصميم الهوية والشعار.' 
                  : 'Select the pipeline stages for your engineering lifecycle, including Logo & Brand studio.'}
              </p>
            </div>

            {/* Recommended Stages Container */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    {isArabic ? 'المراحل المقترحة والموصى بها' : 'Recommended Architecture Stages'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
                    {isArabic ? '7 مراحل أساسية' : '7 Core Stages'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSelectAllRecommended}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] underline transition-colors"
                >
                  {isArabic ? 'اختيار الكل' : 'Select All'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {RECOMMENDED_STAGES.map((stage) => {
                  const isChecked = chosenStageIds.includes(stage.id);
                  const isLogo = stage.id === 'logo';
                  const Icon = STAGE_ICON_MAP[stage.id] || Layers;

                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => handleToggleStage(stage.id)}
                      className={`p-3 rounded-xl border text-start transition-all flex items-center justify-between ${
                        isChecked
                          ? isLogo
                            ? 'border-emerald-500/60 bg-emerald-950/20 shadow-xs ring-1 ring-emerald-500/30'
                            : 'border-[var(--border-strong)] bg-[var(--bg-surface-elevated)] shadow-xs'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                            isChecked
                              ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)]'
                              : 'bg-[var(--bg-surface)] text-[var(--text-muted)]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-[var(--text-primary)] truncate">
                              {isArabic ? stage.labelAr : stage.labelEn}
                            </span>
                            {isLogo && (
                              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-1.5 py-0.5 rounded">
                                {isArabic ? 'شعار وهوية' : 'Brand Logo'}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[var(--text-muted)] truncate font-mono">
                            {stage.id.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-[var(--accent-contrast)] border-transparent text-[var(--accent-contrast-text)]'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add Custom Stage Form */}
            <form
              onSubmit={handleAddCustomStage}
              className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-wrap sm:flex-nowrap items-center gap-2"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] shrink-0">
                <Plus className="w-4 h-4 text-[var(--text-muted)]" />
                <span>{isArabic ? 'مرحلة إضافية:' : 'Custom Stage:'}</span>
              </div>
              <input
                type="text"
                placeholder={isArabic ? 'اسم المرحلة (مثال: تدقيق الأمان)' : 'Stage Name (e.g. Security Audit)'}
                value={customStageLabel}
                onChange={(e) => setCustomStageLabel(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] focus:outline-hidden"
              />
              <input
                type="text"
                placeholder={isArabic ? 'الاسم البديل (اختياري)' : 'Alt Name (Optional)'}
                value={customStageLabelAr}
                onChange={(e) => setCustomStageLabelAr(e.target.value)}
                className="w-36 px-3 py-1.5 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={!customStageLabel.trim()}
                className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-xs font-medium text-[var(--text-primary)] disabled:opacity-40 transition-colors shrink-0"
              >
                {isArabic ? '+ إضافة' : '+ Add'}
              </button>
            </form>
          </div>
        )}
        </div>
      </main>

      {/* Persistent Bottom Sticky Action Bar - ALWAYS VISIBLE! */}
      <footer className="shrink-0 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6 py-3.5 z-30 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {/* Back Button */}
          {onboardingStep === 1 ? (
            <button
              type="button"
              onClick={() => setActiveView('landing')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
              <span>{isArabic ? 'الرجوع للرئيسية' : 'Back to Home'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setOnboardingStep((onboardingStep - 1) as any)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
              <span>{isArabic ? `الرجوع للخطوة ${onboardingStep - 1}` : `Back to Step ${onboardingStep - 1}`}</span>
            </button>
          )}

          {/* Center info */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isArabic ? `MonoSpec • خطوة ${onboardingStep} من 3` : `MonoSpec • Step ${onboardingStep} of 3`}</span>
          </div>

          {/* Next / Launch Button */}
          {onboardingStep === 1 && (
            <button
              type="button"
              onClick={() => setOnboardingStep(2)}
              disabled={!workspaceName.trim() || !roomCode.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] text-xs font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
            >
              <span>{isFreelancer ? (isArabic ? 'المتابعة لإعداد المواقع والمنصات' : 'Continue to Websites Setup') : (isArabic ? 'المتابعة لإضافة الشركات' : 'Continue to Companies Setup')}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          )}

          {onboardingStep === 2 && (
            <div className="flex items-center gap-2">
              {companyList.length === 0 && (
                <span className="text-[10px] text-amber-400 hidden md:inline">
                  {isFreelancer ? (isArabic ? '* يرجى إضافة موقع واحد على الأقل' : '* Please add at least one website') : (isArabic ? '* يرجى إضافة شركة واحدة على الأقل' : '* Please add at least one company')}
                </span>
              )}
              <button
                type="button"
                onClick={() => setOnboardingStep(3)}
                disabled={companyList.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] text-xs font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
              >
                <span>{isFreelancer ? (isArabic ? 'المتابعة لمراحل تصميم الموقع' : 'Continue to Platform Stages') : (isArabic ? 'المتابعة لمراحل المشروع' : 'Continue to Pipeline Stages')}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          )}

          {onboardingStep === 3 && (
            <button
              type="button"
              onClick={handleFinishOnboarding}
              disabled={chosenStageIds.length === 0}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black tracking-wide uppercase transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isArabic ? 'إتمام الإعداد والدخول لمساحة العمل' : 'Complete Setup & Launch Workspace'}</span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

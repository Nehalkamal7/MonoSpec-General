'use client';

import React, { useState } from 'react';
import {
  X,
  Settings,
  Building2,
  Users,
  KeyRound,
  Layers,
  Cpu,
  User,
  Globe,
  Plus,
  Trash2,
  Check,
  Copy,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Sliders,
  Palette,
  FileText,
  Camera,
  ExternalLink,
} from 'lucide-react';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';
import { RECOMMENDED_STAGES } from '@/lib/constants';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function SettingsModal() {
  const {
    isSettingsModalOpen,
    setSettingsModalOpen,
    activeSettingsTab,
    setActiveSettingsTab,
    workspace,
    updateWorkspace,
    userSession,
    updateUserSession,
    companies,
    addCompany,
    removeCompany,
    customStages,
    selectedStageIds,
    toggleStageSelection,
    locale,
    toggleLocale,
    accountType,
    setAccountType,
  } = useMonoSpecStore();

  const [copiedRoomCode, setCopiedRoomCode] = useState(false);

  // Workspace Form State
  const [wsName, setWsName] = useState(workspace?.name || '');
  const [wsRoomCode, setWsRoomCode] = useState(workspace?.roomCode || '');

  // User Profile State
  const [profileName, setProfileName] = useState(userSession?.name || '');
  const [profileEmail, setProfileEmail] = useState(userSession?.email || '');
  const [profilePhone, setProfilePhone] = useState(userSession?.phone || '+201553646123');
  const [profileRole, setProfileRole] = useState(userSession?.role || '');
  const [profileBio, setProfileBio] = useState(userSession?.bio || '');
  const [profileAvatar, setProfileAvatar] = useState(userSession?.avatarUrl || '');

  // New Company / Website in Settings State
  const [newCompName, setNewCompName] = useState('');
  const [newCompCode, setNewCompCode] = useState('');
  const [newCompUrl, setNewCompUrl] = useState('');
  const [newCompIndustry, setNewCompIndustry] = useState('');

  // AI Settings State
  const [aiModel, setAiModel] = useState('gpt-4o');
  const [ragTemperature, setRagTemperature] = useState('0.2');
  const [autoIndexDrive, setAutoIndexDrive] = useState(true);

  if (!isSettingsModalOpen) return null;

  const isArabic = locale === 'ar';

  const handleCopyCode = () => {
    if (typeof window !== 'undefined' && wsRoomCode) {
      navigator.clipboard.writeText(wsRoomCode);
      setCopiedRoomCode(true);
      setTimeout(() => setCopiedRoomCode(false), 2000);
    }
  };

  const handleRegenerateCode = () => {
    const newCode = `MONO-${Math.floor(1000 + Math.random() * 9000)}-${(wsName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3) || 'KSA').toUpperCase()}`;
    setWsRoomCode(newCode);
    updateWorkspace({ roomCode: newCode, inviteLink: `https://monospec.internal/room/${newCode}` });
  };

  const handleSaveWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkspace({
      name: wsName.trim(),
      roomCode: wsRoomCode.trim().toUpperCase(),
      inviteLink: `https://monospec.internal/room/${wsRoomCode.trim().toUpperCase()}`,
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserSession({
      name: profileName.trim(),
      email: profileEmail.trim(),
      phone: profilePhone.trim(),
      role: profileRole.trim(),
      bio: profileBio.trim(),
      avatarUrl: profileAvatar.trim(),
    });
  };

  const handleAddCompanyInSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName.trim()) return;

    addCompany({
      name: newCompName.trim(),
      code: (newCompCode.trim() || newCompName.slice(0, 3)).toUpperCase(),
      websiteUrl: newCompUrl.trim() || undefined,
      industry: newCompIndustry.trim() || (accountType === 'freelancer' ? 'منصة وتطبيق ويب' : 'Software & Tech'),
      type: accountType === 'freelancer' ? 'freelancer_site' : 'enterprise',
    });

    setNewCompName('');
    setNewCompCode('');
    setNewCompUrl('');
    setNewCompIndustry('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-4xl h-[88vh] rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] shadow-2xl overflow-hidden text-[var(--text-primary)] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center shadow-xs">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold tracking-tight">
                  {isArabic ? 'إعدادات المنظومة الشاملة' : 'System & Workspace Settings'}
                </h2>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]">
                  CONTROL PANEL
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                {isArabic
                  ? 'إدارة مساحة العمل، الروم، الشركات والعملاء، ومراحل خط الإنتاج، وتفضيلات المودل'
                  : 'Manage workspace, room codes, clients, pipeline stages, and AI preferences'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Arabic / English toggle button with E / ع */}
            <button
              onClick={toggleLocale}
              title={isArabic ? 'Switch to English' : 'التحويل للعربية'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-xs font-bold transition-all shadow-2xs text-emerald-400"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="font-mono text-xs">{isArabic ? 'English' : 'عربي'}</span>
            </button>

            <button
              onClick={() => setSettingsModalOpen(false)}
              className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Area (Sidebar Tabs + Tab Viewport) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Tabs */}
          <div className="w-56 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 space-y-1 select-none shrink-0 overflow-y-auto">
            {[
              { id: 'workspace', labelAr: 'مساحة العمل والروم', labelEn: 'Workspace & Room', icon: KeyRound },
              {
                id: 'companies',
                labelAr: accountType === 'freelancer' ? 'المواقع والمنصات' : 'الشركات والعملاء',
                labelEn: accountType === 'freelancer' ? 'Websites & Platforms' : 'Companies & Clients',
                icon: accountType === 'freelancer' ? Globe : Building2,
              },
              { id: 'stages', labelAr: 'مراحل المشروع (7)', labelEn: 'Pipeline Stages', icon: Layers },
              { id: 'ai', labelAr: 'إعدادات الذكاء الاصطناعي', labelEn: 'AI & Ingestion', icon: Cpu },
              { id: 'profile', labelAr: 'الملف الشخصي والحساب', labelEn: 'Profile & Account', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSettingsTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSettingsTab(tab.id as any)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
                    isActive
                      ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] font-semibold shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{isArabic ? tab.labelAr : tab.labelEn}</span>
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] space-y-2">
              <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] px-2">
                {isArabic ? 'المظهر والسمة' : 'Appearance'}
              </span>
              <div className="px-2">
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Right Tab Content Viewport */}
          <div className="flex-1 p-6 overflow-y-auto bg-[var(--bg-canvas)] text-xs space-y-6">
            {/* TAB 1: WORKSPACE & ROOM CODE */}
            {activeSettingsTab === 'workspace' && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {isArabic ? 'إعدادات مساحة العمل والغرفة' : 'Workspace & Team Room'}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {isArabic
                      ? 'تحكم في اسم الغرفة وكود الروم المخصص لفريقك'
                      : 'Configure team room name and invite codes'}
                  </p>
                </div>

                {/* Account Persona Selector: Enterprise vs Freelancer */}
                <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2">
                  <span className="font-semibold text-[var(--text-secondary)]">
                    {isArabic ? 'نوع الحساب ومساحة العمل' : 'Account Persona'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAccountType('enterprise')}
                      className={`p-3 rounded-lg border text-left rtl:text-right transition-all ${
                        accountType === 'enterprise'
                          ? 'border-[var(--border-strong)] bg-[var(--bg-surface-elevated)] ring-1 ring-[var(--border-strong)]'
                          : 'border-[var(--border-subtle)] opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'فريق شركة ومؤسسة' : 'Enterprise Team'}</span>
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)] mt-1">
                        {isArabic ? 'مشاريع مؤسسية متعددة الفرق' : 'Multi-team corporate products'}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAccountType('freelancer')}
                      className={`p-3 rounded-lg border text-left rtl:text-right transition-all ${
                        accountType === 'freelancer'
                          ? 'border-emerald-500/60 bg-emerald-950/20 ring-1 ring-emerald-500/30'
                          : 'border-[var(--border-subtle)] opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'استوديو مستقل' : 'Solo / Freelancer Studio'}</span>
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)] mt-1">
                        {isArabic ? 'إدارة مشاريع العملاء بشكل مستقل' : 'Deliver specs for clients 10x faster'}
                      </p>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSaveWorkspace} className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--text-secondary)]">
                      {isArabic ? 'اسم مساحة العمل' : 'Workspace Name'}
                    </label>
                    <input
                      type="text"
                      value={wsName}
                      onChange={(e) => setWsName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isArabic ? 'كود الغرفة المميز (Room Code)' : 'Unique Room Code'}</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleRegenerateCode}
                        className="text-[10px] text-[var(--text-muted)] hover:text-emerald-400 flex items-center gap-1"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span>{isArabic ? 'توليد كود جديد' : 'Regenerate Code'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={wsRoomCode}
                        onChange={(e) => setWsRoomCode(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 font-mono font-bold text-emerald-400 uppercase rounded-lg border border-emerald-500/40 bg-emerald-950/20 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] transition-colors flex items-center gap-1"
                      >
                        {copiedRoomCode ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">{isArabic ? 'تم النسخ' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-[var(--text-muted)]" />
                            <span>{isArabic ? 'نسخ' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] font-semibold hover:opacity-90 transition-opacity"
                  >
                    {isArabic ? 'حفظ تعديلات مساحة العمل' : 'Save Workspace'}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: COMPANIES & CLIENTS / FREELANCER WEBSITES */}
            {activeSettingsTab === 'companies' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {accountType === 'freelancer'
                      ? (isArabic ? 'مواقعك ومنصاتك الخاصة' : 'My Websites & Platforms')
                      : (isArabic ? 'الشركات والمؤسسات المسجلة' : 'Registered Client Companies')}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {accountType === 'freelancer'
                      ? (isArabic
                          ? 'يمكنك إدارة مواقعك الخاصة وتطبيقات الويب والمنصات وتحديد روابطها ومواصفاتها المعمارية'
                          : 'Manage your personal websites, web apps, domains, and architecture specs')
                      : (isArabic
                          ? 'يمكنك إضافة عدد غير محدود من الشركات والعملاء، والتبديل بينهم لعزل المواصفات والـ RAG'
                          : 'Manage client accounts and isolated specification datasets')}
                  </p>
                </div>

                <div className="space-y-2">
                  {companies.map((c) => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center font-mono font-bold text-xs">
                          {c.code.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs">{c.name}</span>
                            <span className="text-[10px] font-mono text-[var(--text-muted)]">({c.code})</span>
                            {c.websiteUrl && (
                              <a
                                href={c.websiteUrl.startsWith('http') ? c.websiteUrl : `https://${c.websiteUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                title={`Visit ${c.websiteUrl}`}
                                className="text-emerald-400 hover:text-emerald-300 text-[10px] inline-flex items-center gap-0.5 font-mono"
                              >
                                <ExternalLink className="w-2.5 h-2.5" />
                                <span>{c.websiteUrl}</span>
                              </a>
                            )}
                          </div>
                          <p className="text-[11px] text-[var(--text-muted)]">
                            {c.nameAr || c.industry || (accountType === 'freelancer' ? 'منصة وتطبيق ويب' : 'Technology')}
                          </p>
                        </div>
                      </div>

                      {companies.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCompany(c.id)}
                          className="p-1 rounded text-[var(--text-muted)] hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Company / Website Form */}
                <form
                  onSubmit={handleAddCompanyInSettings}
                  className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] space-y-3"
                >
                  <span className="font-bold text-xs text-[var(--text-primary)] flex items-center gap-1.5">
                    {accountType === 'freelancer' ? (
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span>
                      {accountType === 'freelancer'
                        ? (isArabic ? 'إضافة موقع أو منصة خاصة جديدة' : 'Add New Website / Platform')
                        : (isArabic ? 'إضافة شركة أو عميل جديد' : 'Add New Client / Company')}
                    </span>
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder={
                        accountType === 'freelancer'
                          ? (isArabic ? 'اسم الموقع (English)' : 'Website Name (e.g. MyPortfolio)')
                          : (isArabic ? 'اسم الشركة (English)' : 'Company Name')
                      }
                      value={newCompName}
                      onChange={(e) => setNewCompName(e.target.value)}
                      className="px-2.5 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] focus:outline-hidden"
                      required
                    />
                    <input
                      type="text"
                      placeholder={isArabic ? 'الكود (e.g. PORT)' : 'Code (e.g. PORT)'}
                      maxLength={5}
                      value={newCompCode}
                      onChange={(e) => setNewCompCode(e.target.value)}
                      className="px-2.5 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] font-mono uppercase focus:outline-hidden"
                    />
                  </div>
                  {accountType === 'freelancer' && (
                    <input
                      type="text"
                      placeholder="رابط الموقع (e.g. https://mywebsite.com)"
                      value={newCompUrl}
                      onChange={(e) => setNewCompUrl(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] focus:outline-hidden font-mono text-[11px]"
                    />
                  )}
                  <input
                    type="text"
                    placeholder={
                      accountType === 'freelancer'
                        ? (isArabic ? 'نوع المنصة (e.g. E-Commerce, SaaS, Portfolio)' : 'Platform Type')
                        : (isArabic ? 'القطاع أو مجال العمل (Industry)' : 'Industry')
                    }
                    value={newCompIndustry}
                    onChange={(e) => setNewCompIndustry(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] focus:outline-hidden"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newCompName.trim()}
                      className="px-4 py-1.5 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity"
                    >
                      + {isArabic
                          ? (accountType === 'freelancer' ? 'إضافة الموقع' : 'إضافة الشركة')
                          : (accountType === 'freelancer' ? 'Add Website' : 'Add Company')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: PIPELINE STAGES CONFIG */}
            {activeSettingsTab === 'stages' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {isArabic ? 'مراحل خط الإنتاج النشطة' : 'Pipeline Stages Configuration'}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {isArabic
                      ? 'حدد المراحل المفعلة في شريط التنقل ومشاريع مساحة العمل، بما فيها مرحلة اللوجو والهوية'
                      : 'Toggle active delivery stages including Logo & Brand Identity'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {RECOMMENDED_STAGES.map((stage) => {
                    const isChecked = selectedStageIds.includes(stage.id);
                    const isLogo = stage.id === 'logo';

                    return (
                      <button
                        key={stage.id}
                        type="button"
                        onClick={() => toggleStageSelection(stage.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          isChecked
                            ? isLogo
                              ? 'border-emerald-500/60 bg-emerald-950/20 shadow-xs'
                              : 'border-[var(--border-strong)] bg-[var(--bg-surface-elevated)] shadow-xs'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] opacity-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs">{isArabic ? stage.labelAr : stage.labelEn}</span>
                            {isLogo && (
                              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1 py-0.2 rounded">
                                {isArabic ? 'هوية' : 'LOGO'}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[var(--text-muted)] font-mono">
                            {stage.badge}
                          </p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isChecked
                              ? 'bg-[var(--accent-contrast)] border-transparent text-[var(--accent-contrast-text)]'
                              : 'border-[var(--border-subtle)]'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: AI & INGESTION SETTINGS */}
            {activeSettingsTab === 'ai' && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {isArabic ? 'إعدادات الذكاء الاصطناعي ومعالجة البيانات' : 'AI Model & Ingestion Engine'}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {isArabic
                      ? 'تحديد نموذج الذكاء الاصطناعي ومعاملات فهم مستندات الـ PDF ولينكات Google Drive'
                      : 'Configure reasoning model and PDF/Drive document parsing parameters'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--text-secondary)]">
                      {isArabic ? 'نموذج المعمارية الفنية الأساسي' : 'Primary Architecture Model'}
                    </label>
                    <select
                      value={aiModel}
                      onChange={(e) => setAiModel(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-hidden"
                    >
                      <option value="gpt-4o">OpenAI GPT-4o (Enterprise Precision)</option>
                      <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet</option>
                      <option value="local-monospec">MonoSpec In-Memory Deterministic Engine (Offline / Sovereign)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--text-secondary)]">
                      {isArabic ? 'حساسية استخراج الـ RAG والمواصفات' : 'RAG Precision & Compliance Temperature'}
                    </label>
                    <select
                      value={ragTemperature}
                      onChange={(e) => setRagTemperature(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-hidden"
                    >
                      <option value="0.1">0.1 (Strict Enterprise Compliance & Cryptographic Bounds)</option>
                      <option value="0.2">0.2 (Balanced Architecture & Creative Brand Mark)</option>
                      <option value="0.4">0.4 (Exploratory Prototype & Rapid Ideation)</option>
                    </select>
                  </div>

                  <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[var(--text-primary)]">
                        {isArabic ? 'المسح التلقائي لمجلدات Google Drive' : 'Auto-Sync Google Drive Repositories'}
                      </span>
                      <p className="text-[10px] text-[var(--text-muted)]">
                        {isArabic
                          ? 'إعادة فهرسة المستندات والرسومات التلقائية عند تحديث الرابط'
                          : 'Automatically re-embed new PDF/Docs added to linked Drive folders'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoIndexDrive(!autoIndexDrive)}
                      className={`w-10 h-6 rounded-full transition-colors relative ${
                        autoIndexDrive ? 'bg-emerald-500' : 'bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white transition-all absolute top-1 ${
                          autoIndexDrive ? 'left-5' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: PROFILE & ACCOUNT */}
            {activeSettingsTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-5 max-w-xl">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {isArabic ? 'الملف الشخصي والحساب' : 'Profile & Account'}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {isArabic
                      ? 'تعديل الصورة، الاسم، الدور الوظيفي، والنبذة التعريفية'
                      : 'Manage personal details, role, and avatar'}
                  </p>
                </div>

                {/* Avatar Preview & URL */}
                <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center font-mono font-bold text-lg overflow-hidden border border-[var(--border-strong)] shrink-0 shadow-xs">
                    {profileAvatar ? (
                      <img src={profileAvatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{profileName.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="font-semibold text-[var(--text-secondary)]">
                      {isArabic ? 'رابط الصورة الشخصية (Avatar Image URL)' : 'Avatar Image URL'}
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or avatar link"
                      value={profileAvatar}
                      onChange={(e) => setProfileAvatar(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-primary)] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[var(--text-secondary)]">
                    {isArabic ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[var(--text-secondary)]">
                    {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[var(--text-secondary)]">
                    {isArabic ? 'رقم الهاتف أو الواتساب' : 'Phone / WhatsApp'}
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-mono focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[var(--text-secondary)]">
                    {isArabic ? 'المسمى الوظيفي أو التخصص' : 'Title / Role'}
                  </label>
                  <input
                    type="text"
                    value={profileRole}
                    onChange={(e) => setProfileRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[var(--text-secondary)]">
                    {isArabic ? 'نبذة تعريفية' : 'Bio / Specialization'}
                  </label>
                  <textarea
                    rows={2}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-hidden resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] font-semibold hover:opacity-90 transition-opacity"
                >
                  {isArabic ? 'حفظ بيانات الملف الشخصي' : 'Save Profile'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

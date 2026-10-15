'use client';

import React, { useState } from 'react';
import {
  ExternalLink,
  Play,
  Share2,
  Copy,
  Check,
  Columns,
  Maximize2,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Building2,
  Users,
  KeyRound,
  Home,
  Settings,
  Globe,
  Briefcase,
} from 'lucide-react';
import { FigmaIcon } from '@/components/ui/FigmaIcon';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';
import { STAGES } from '@/lib/constants';

export function Header() {
  const {
    getActiveProject,
    activeStageId,
    canvasViewMode,
    setCanvasViewMode,
    setFigmaModalOpen,
    setDemoModalOpen,
    getCompanyById,
    workspace,
    setActiveView,
    userSession,
    setSettingsModalOpen,
    locale,
    toggleLocale,
    accountType,
  } = useMonoSpecStore();

  const [copied, setCopied] = useState(false);
  const [copiedRoomCode, setCopiedRoomCode] = useState(false);
  const activeProject = getActiveProject();

  if (!activeProject) return null;

  const company =
    getCompanyById(activeProject.companyId) || {
      id: activeProject.companyId,
      name: activeProject.companyId,
      code: (activeProject.companyId.slice(0, 3) || 'APX').toUpperCase(),
    };

  const activeStage = STAGES.find((s) => s.id === activeStageId);
  const deliverable = activeProject.stages[activeStageId];

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyRoomCode = () => {
    if (typeof window !== 'undefined' && workspace?.roomCode) {
      navigator.clipboard.writeText(workspace.roomCode);
      setCopiedRoomCode(true);
      setTimeout(() => setCopiedRoomCode(false), 2000);
    }
  };

  const isArabic = locale === 'ar';

  return (
    <header className="h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 sm:px-6 flex items-center justify-between gap-3 sm:gap-4 shrink-0 select-none transition-colors">
      {/* Left: Active Project Info & Workspace Room Code */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 max-w-full">
          {/* Company / Website Tag */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[11px] font-mono text-[var(--text-secondary)] shrink-0">
            {accountType === 'freelancer' || company.type === 'freelancer_site' ? (
              <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
            ) : (
              <Building2 className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
            )}
            <span className="font-semibold text-[var(--text-primary)] truncate max-w-[90px] sm:max-w-[130px]">
              {isArabic ? (company.nameAr || company.name) : company.name}
            </span>
            <span className="text-[var(--text-muted)]">({company.code})</span>
            {company.websiteUrl && (
              <a
                href={company.websiteUrl.startsWith('http') ? company.websiteUrl : `https://${company.websiteUrl}`}
                target="_blank"
                rel="noreferrer"
                title={`${isArabic ? 'زيارة الموقع' : 'Visit Website'}: ${company.websiteUrl}`}
                className="text-emerald-400 hover:text-emerald-300 ml-0.5 inline-flex items-center"
              >
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>

          <span className="text-[var(--text-muted)] shrink-0">/</span>

          {/* Project Title */}
          <h1 className="font-semibold text-xs sm:text-sm tracking-tight text-[var(--text-primary)] truncate min-w-0">
            {activeProject.title}
          </h1>
        </div>

        {/* Workspace Room Code Badge */}
        {workspace && (
          <button
            onClick={handleCopyRoomCode}
            title={`${isArabic ? 'مساحة العمل' : 'Workspace'}: ${workspace.name} • ${isArabic ? 'انقر لنسخ كود الروم' : 'Click to copy team room code'}: ${workspace.roomCode}`}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-400 text-[11px] font-mono transition-colors shadow-2xs group shrink-0"
          >
            <KeyRound className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="font-medium text-[10px] text-zinc-300">{isArabic ? 'الروم:' : 'Room:'}</span>
            <span className="font-bold tracking-wider">{workspace.roomCode}</span>
            {copiedRoomCode ? (
              <Check className="w-3 h-3 text-emerald-300 ml-0.5" />
            ) : (
              <Copy className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 transition-opacity ml-0.5" />
            )}
          </button>
        )}

        {/* Active Stage Pill */}
        <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface-elevated)] text-xs text-[var(--text-primary)] shadow-2xs shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-contrast)] animate-pulse" />
          <span className="font-mono text-[10px] text-[var(--text-muted)] font-bold">
            {activeStage?.badge}
          </span>
          <span className="font-medium text-[11px]">{isArabic ? activeStage?.labelAr : activeStage?.labelEn}</span>
        </div>

        {/* Native Figma Project File Link */}
        {activeProject.figmaUrl && (
          <a
            href={activeProject.figmaUrl}
            target="_blank"
            rel="noreferrer"
            title={`${isArabic ? 'فتح ملف فيجما' : 'Open native Figma file'}: ${activeProject.figmaUrl}`}
            className="hidden 2xl:flex items-center gap-1.5 px-2 py-1 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0"
          >
            <FigmaIcon className="w-3 h-3" />
            <span className="truncate max-w-[120px]">{isArabic ? 'ملف فيجما' : 'Figma File'}</span>
            <ExternalLink className="w-2.5 h-2.5 text-[var(--text-muted)]" />
          </a>
        )}
      </div>

      {/* Right: Language switch, Settings gear, User avatar, Viewport Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Language Switcher */}
        <button
          onClick={toggleLocale}
          title={isArabic ? 'التحويل إلى اللغة الإنجليزية' : 'Switch to Arabic'}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors shadow-2xs"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold">
            {isArabic ? 'العربية' : 'English'}
          </span>
        </button>

        {/* Landing Page Home Shortcut */}
        <button
          onClick={() => setActiveView('landing')}
          title="Return to Universal Project Overview & Landing Page"
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <Home className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="hidden xl:inline">{isArabic ? 'الرئيسية' : 'Landing'}</span>
        </button>

        {/* View Mode Segmented Controls - compact icons on medium/zoomed, labels on xl */}
        <div className="hidden md:flex items-center p-0.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <button
            onClick={() => setCanvasViewMode('split')}
            title={isArabic ? 'تقسيم شاشة العمل (مزدوج)' : 'Split Workspace View'}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              canvasViewMode === 'split'
                ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] font-medium shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{isArabic ? 'مزدوج' : 'Split'}</span>
          </button>
          <button
            onClick={() => setCanvasViewMode('canvas-only')}
            title={isArabic ? 'تركيز على وثيقة المواصفة' : 'Spec Canvas Focus'}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              canvasViewMode === 'canvas-only'
                ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] font-medium shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{isArabic ? 'المواصفة' : 'Canvas'}</span>
          </button>
          <button
            onClick={() => setCanvasViewMode('chat-only')}
            title={isArabic ? 'تركيز على محادثة المعماري' : 'Architect Chat Focus'}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              canvasViewMode === 'chat-only'
                ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] font-medium shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{isArabic ? 'المحادثة' : 'Chat'}</span>
          </button>
        </div>

        <div className="hidden sm:block w-px h-5 bg-[var(--border-subtle)]" />

        {/* Export to Figma Shortcut */}
        <button
          onClick={() => setFigmaModalOpen(true)}
          title={isArabic ? 'تصدير توكنز وشاشات فيجما' : 'Export Design Tokens & Frames to Figma'}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] text-xs font-medium transition-all group shadow-2xs"
        >
          <FigmaIcon className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
          <span className="hidden xl:inline">{isArabic ? 'فيجما' : 'Figma'}</span>
        </button>

        {/* Demo Preview Button */}
        <button
          onClick={() => setDemoModalOpen(true)}
          title={isArabic ? 'تشغيل المعاينة التفاعلية' : 'Launch Live Architectural Simulation'}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] text-xs font-semibold hover:opacity-90 transition-all shadow-xs"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="hidden md:inline">{isArabic ? 'معاينة حية' : 'Preview'}</span>
        </button>

        {/* Copy / Share Quick Shortcut */}
        <button
          onClick={handleCopyLink}
          title={isArabic ? 'نسخ رابط المواصفة' : 'Copy Spec Link'}
          className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
        </button>

        <div className="w-px h-5 bg-[var(--border-subtle)]" />

        {/* User Avatar with Settings Gear Button Right Next To It! */}
        <div className="flex items-center gap-1.5 pl-0.5 sm:pl-1 shrink-0">
          {/* Avatar */}
          <div
            title={`${userSession?.name || (isArabic ? 'نهال كمال' : 'Nehal Kamal')} (${accountType === 'freelancer' ? (isArabic ? 'مستقل' : 'Freelancer') : (isArabic ? 'مؤسسي' : 'Enterprise')})`}
            className="w-8 h-8 rounded-full bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center font-bold text-xs overflow-hidden border border-[var(--border-strong)] shadow-xs select-none"
          >
            {userSession?.avatarUrl ? (
              <img src={userSession.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{(userSession?.name || 'N').slice(0, 1).toUpperCase()}</span>
            )}
          </div>

          {/* Settings Icon Button Next to Picture */}
          <button
            onClick={() => setSettingsModalOpen(true)}
            title={isArabic ? 'إعدادات المنظومة' : 'Comprehensive Settings'}
            className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all hover:rotate-90 duration-300 shadow-2xs group"
          >
            <Settings className="w-4 h-4 group-hover:text-emerald-400 transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
}

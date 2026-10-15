'use client';

import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Eye,
  Layers,
  Sparkles,
  Link2,
  Save,
} from 'lucide-react';
import { FigmaIcon } from '@/components/ui/FigmaIcon';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';

export function FigmaExportModal() {
  const {
    isFigmaModalOpen,
    setFigmaModalOpen,
    getActiveProject,
    updateProjectUrls,
    locale,
  } = useMonoSpecStore();

  const isArabic = locale === 'ar';

  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'tokens'>('preview');
  const [copiedFigma, setCopiedFigma] = useState(false);
  const [copiedTokens, setCopiedTokens] = useState(false);
  const [isEditingUrl, setIsEditingUrl] = useState(false);

  const activeProject = getActiveProject();
  const [figmaUrlInput, setFigmaUrlInput] = useState(activeProject?.figmaUrl || '');

  if (!isFigmaModalOpen || !activeProject) return null;

  // Extract clean semantic HTML snippet from active project or fallback to high-fidelity component
  const defaultHtmlSnippet = `<div class="w-full max-w-xl p-6 bg-black border border-zinc-800 rounded-2xl text-white font-sans antialiased shadow-2xl">
  <!-- Component Context Header -->
  <div class="flex items-center justify-between pb-4 border-b border-zinc-800">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-white text-black font-mono font-black flex items-center justify-center text-sm">
        MS
      </div>
      <div>
        <h4 class="text-sm font-semibold tracking-tight text-white">${activeProject.title}</h4>
        <p class="text-xs text-zinc-400 font-mono">Stage: UI/UX Design System</p>
      </div>
    </div>
    <span class="px-2.5 py-1 text-[11px] font-mono font-medium rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300">
      Strict Monochrome
    </span>
  </div>

  <!-- Telemetry Metrics Grid -->
  <div class="grid grid-cols-3 gap-3 my-5">
    <div class="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
      <span class="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Throughput</span>
      <p class="text-lg font-mono font-bold text-white mt-0.5">24.5k <span class="text-xs text-zinc-500 font-normal">RPS</span></p>
    </div>
    <div class="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
      <span class="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">P99 SLA</span>
      <p class="text-lg font-mono font-bold text-white mt-0.5">38 <span class="text-xs text-zinc-500 font-normal">ms</span></p>
    </div>
    <div class="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
      <span class="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Security</span>
      <p class="text-lg font-mono font-bold text-emerald-400 mt-0.5">Verified</p>
    </div>
  </div>

  <!-- Interactive Action Trigger -->
  <div class="flex items-center justify-between pt-2">
    <span class="text-xs text-zinc-400 font-mono">Figma HTML to Design Ready</span>
    <button class="px-4 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors">
      Inspect Architecture
    </button>
  </div>
</div>`;

  const figmaTokens = {
    $schema: 'https://tr.designtokens.org/format/',
    name: `MonoSpec Tokens - ${activeProject.title}`,
    color: {
      canvas: {
        dark: { value: '#000000', type: 'color' },
        light: { value: '#ffffff', type: 'color' },
      },
      surface: {
        dark: { value: '#0a0a0c', type: 'color' },
        light: { value: '#f9f9fb', type: 'color' },
      },
      accent: {
        zinc900: { value: '#18181b', type: 'color' },
        zinc800: { value: '#27272a', type: 'color' },
        zinc500: { value: '#71717a', type: 'color' },
      },
    },
    typography: {
      fontFamilySans: { value: 'Inter, -apple-system, sans-serif', type: 'fontFamilies' },
      fontFamilyMono: { value: 'JetBrains Mono, Menlo, monospace', type: 'fontFamilies' },
    },
    radii: {
      sm: { value: '6px', type: 'dimension' },
      md: { value: '8px', type: 'dimension' },
      lg: { value: '16px', type: 'dimension' },
    },
  };

  const tokensString = JSON.stringify(figmaTokens, null, 2);

  const handleCopyForFigma = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(defaultHtmlSnippet);
      setCopiedFigma(true);
      setTimeout(() => setCopiedFigma(false), 2200);
    }
  };

  const handleCopyTokens = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(tokensString);
      setCopiedTokens(true);
      setTimeout(() => setCopiedTokens(false), 2200);
    }
  };

  const handleSaveFigmaUrl = () => {
    updateProjectUrls(activeProject.id, { figmaUrl: figmaUrlInput.trim() });
    setIsEditingUrl(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-3xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] shadow-2xl overflow-hidden text-[var(--text-primary)] flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center shadow-xs">
              <FigmaIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold tracking-tight">
                  {isArabic ? 'تصدير إلى Figma وأدوات التصميم' : 'Figma Export & Design Tooling'}
                </h2>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]">
                  {isArabic ? 'جاهز لإضافات التصميم' : 'HTML to Design Ready'}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-mono">
                {activeProject.title}
              </p>
            </div>
          </div>

          <button
            onClick={() => setFigmaModalOpen(false)}
            className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Project Figma URL Bar (Native Link Field) */}
        <div className="px-6 py-2.5 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Link2 className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
            <span className="font-mono text-[11px] text-[var(--text-muted)] shrink-0">
              {isArabic ? 'رابط Figma:' : 'Figma URL:'}
            </span>
            {isEditingUrl ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="url"
                  value={figmaUrlInput}
                  onChange={(e) => setFigmaUrlInput(e.target.value)}
                  placeholder="https://www.figma.com/design/..."
                  className="flex-1 px-2.5 py-1 text-xs rounded-md border border-[var(--border-strong)] bg-[var(--bg-canvas)] text-[var(--text-primary)] font-mono focus:outline-hidden"
                />
                <button
                  onClick={handleSaveFigmaUrl}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] text-[11px] font-medium"
                >
                  <Save className="w-3 h-3" />
                  <span>{isArabic ? 'حفظ' : 'Save'}</span>
                </button>
                <button
                  onClick={() => setIsEditingUrl(false)}
                  className="px-2 py-1 rounded border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)]"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 truncate flex-1">
                <span className="font-mono text-[11px] text-[var(--text-primary)] truncate">
                  {activeProject.figmaUrl || (isArabic ? 'لم يتم ربط ملف Figma بعد' : 'No native Figma URL linked yet')}
                </span>
                <button
                  onClick={() => {
                    setFigmaUrlInput(activeProject.figmaUrl || '');
                    setIsEditingUrl(true);
                  }}
                  className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] underline shrink-0"
                >
                  {isArabic ? 'تعديل الرابط' : 'Edit Link'}
                </button>
              </div>
            )}
          </div>

          {activeProject.figmaUrl && !isEditingUrl && (
            <a
              href={activeProject.figmaUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[11px] font-medium text-[var(--text-primary)] hover:underline shrink-0"
            >
              <span>{isArabic ? 'فتح في Figma' : 'Open in Figma'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* View Switcher Tabs & Quick Copy */}
        <div className="px-6 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] flex items-center justify-between shrink-0">
          <div className="flex gap-4 text-xs font-medium">
            <button
              onClick={() => setActiveTab('preview')}
              className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'preview'
                  ? 'border-[var(--border-strong)] text-[var(--text-primary)] font-semibold'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isArabic ? 'المعاينة المباشرة' : 'Live Preview'}</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'code'
                  ? 'border-[var(--border-strong)] text-[var(--text-primary)] font-semibold'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{isArabic ? 'كود جاهز للتصميم' : 'Figma-Ready Code'}</span>
            </button>

            <button
              onClick={() => setActiveTab('tokens')}
              className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'tokens'
                  ? 'border-[var(--border-strong)] text-[var(--text-primary)] font-semibold'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isArabic ? 'رموز التصميم (JSON)' : 'Design Tokens (JSON)'}</span>
            </button>
          </div>

          {/* Action Button: Copy for Figma */}
          <button
            onClick={activeTab === 'tokens' ? handleCopyTokens : handleCopyForFigma}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] text-xs font-semibold hover:opacity-90 transition-all shadow-xs"
          >
            {activeTab === 'tokens' ? (
              copiedTokens ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />
            ) : (
              copiedFigma ? <Check className="w-3.5 h-3.5" /> : <FigmaIcon className="w-3.5 h-3.5" />
            )}
            <span>
              {activeTab === 'tokens'
                ? copiedTokens ? (isArabic ? 'تم نسخ الرموز' : 'Copied Tokens') : (isArabic ? 'نسخ الرموز' : 'Copy Tokens')
                : copiedFigma ? (isArabic ? 'تم النسخ للـ Figma!' : 'Copied for Figma!') : (isArabic ? 'نسخ للـ Figma' : 'Copy for Figma')}
            </span>
          </button>
        </div>

        {/* Tab Viewport */}
        <div className="flex-1 overflow-y-auto p-6 bg-[var(--bg-canvas)]">
          {activeTab === 'preview' && (
            <div className="flex flex-col items-center justify-center p-6 border border-dashed border-[var(--border-subtle)] rounded-2xl bg-[var(--bg-surface)]">
              <div className="w-full flex justify-center" dangerouslySetInnerHTML={{ __html: defaultHtmlSnippet }} />
              <p className="text-[11px] text-[var(--text-muted)] mt-4 font-mono text-center">
                {isArabic ? 'معاينة تفاعلية معتمدة مباشرة على مواصفة HTML الدلالية ونظام Tailwind CSS.' : 'Interactive preview rendered directly from the semantic HTML + Tailwind CSS specification.'}
              </p>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-subtle)] text-xs font-mono">
                <span className="text-[var(--text-muted)]">semantic-markup.html</span>
                <span className="text-[10px] text-[var(--text-muted)]">Target: HTML to Design Plugin</span>
              </div>
              <pre className="text-[11px] font-mono text-[var(--text-primary)] max-h-72 overflow-y-auto leading-relaxed whitespace-pre-wrap selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
                {defaultHtmlSnippet}
              </pre>
            </div>
          )}

          {activeTab === 'tokens' && (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-subtle)] text-xs font-mono">
                <span className="text-[var(--text-muted)]">tokens.json (W3C DTCG Format)</span>
                <span className="text-[10px] text-[var(--text-muted)]">MonoSpec Monochrome Core</span>
              </div>
              <pre className="text-[11px] font-mono text-[var(--text-primary)] max-h-72 overflow-y-auto leading-relaxed selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
                {tokensString}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Guidance */}
        <div className="px-6 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between text-xs text-[var(--text-muted)] shrink-0">
          <span className="font-sans">
            {isArabic ? (
              <>ملاحظة: ثبّت إضافة <strong>HTML to Design</strong> في Figma، ثم انسخ الكود والصقه مباشرة في ساحة التصميم.</>
            ) : (
              <>Tip: Install the <strong>HTML to Design</strong> plugin in Figma, click <strong>Copy for Figma</strong>, and paste.</>
            )}
          </span>
          <button
            onClick={() => setFigmaModalOpen(false)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] transition-colors"
          >
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

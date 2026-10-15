'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FileText,
  Download,
  Copy,
  Check,
  Edit3,
  Eye,
  CheckSquare,
  Square,
  Sparkles,
  ExternalLink,
  Code2,
  Globe,
  Link2,
  Save,
  Layers,
} from 'lucide-react';
import { FigmaIcon } from '@/components/ui/FigmaIcon';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';
import { STAGES, COMPANIES } from '@/lib/constants';
import { CodeBlock } from './CodeBlock';

export function SpecCanvas() {
  const {
    getActiveProject,
    activeStageId,
    updateSpecMarkdown,
    toggleChecklistItem,
    updateProjectUrls,
    setFigmaModalOpen,
    setDemoDrawerOpen,
    getCompanyById,
    locale,
  } = useMonoSpecStore();

  const isArabic = locale === 'ar';
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uiUxMode, setUiUxMode] = useState<'preview' | 'code'>('preview');
  const [copiedFigmaSnippet, setCopiedFigmaSnippet] = useState(false);
  const [isEditingFigmaUrl, setIsEditingFigmaUrl] = useState(false);

  const activeProject = getActiveProject();

  const [figmaUrlInput, setFigmaUrlInput] = useState(activeProject?.figmaUrl || '');

  if (!activeProject) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-[var(--text-muted)] text-sm">
        {isArabic ? 'اختر مشروعاً لمعاينة وتعديل المواصفات المعمارية.' : 'Select a project to inspect architectural specifications.'}
      </div>
    );
  }

  const deliverable = activeProject.stages[activeStageId];
  const stageDef = STAGES.find((s) => s.id === activeStageId);
  const company =
    getCompanyById(activeProject.companyId) || {
      id: activeProject.companyId,
      name: activeProject.companyId,
      code: (activeProject.companyId.slice(0, 3) || 'APX').toUpperCase(),
    };

  // Semantic UI component generated for the active project
  const figmaHtmlSnippet = `<div class="w-full max-w-xl p-6 bg-black border border-zinc-800 rounded-2xl text-white font-sans antialiased shadow-2xl">
  <div class="flex items-center justify-between pb-4 border-b border-zinc-800">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-white text-black font-mono font-bold flex items-center justify-center text-sm">
        MS
      </div>
      <div>
        <h4 class="text-sm font-semibold tracking-tight text-white">${activeProject.title}</h4>
        <p class="text-xs text-zinc-400 font-mono">Company: ${company.name}</p>
      </div>
    </div>
    <span class="px-2.5 py-1 text-[11px] font-mono font-medium rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300">
      Strict Monochrome
    </span>
  </div>

  <div class="grid grid-cols-3 gap-3 my-5">
    <div class="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
      <span class="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Throughput</span>
      <p class="text-lg font-mono font-bold text-white mt-0.5">22.4k <span class="text-xs text-zinc-500 font-normal">RPS</span></p>
    </div>
    <div class="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
      <span class="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">P99 Latency</span>
      <p class="text-lg font-mono font-bold text-white mt-0.5">44 <span class="text-xs text-zinc-500 font-normal">ms</span></p>
    </div>
    <div class="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
      <span class="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Security</span>
      <p class="text-lg font-mono font-bold text-emerald-400 mt-0.5">Verified</p>
    </div>
  </div>

  <div class="flex items-center justify-between pt-2">
    <span class="text-xs text-zinc-400 font-mono">Figma HTML to Design Compatible</span>
    <button class="px-4 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors">
      Execute Action
    </button>
  </div>
</div>`;

  const handleCopyMarkdown = () => {
    if (typeof window !== 'undefined' && deliverable?.specMarkdown) {
      navigator.clipboard.writeText(deliverable.specMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyForFigma = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(figmaHtmlSnippet);
      setCopiedFigmaSnippet(true);
      setTimeout(() => setCopiedFigmaSnippet(false), 2200);
    }
  };

  const handleSaveFigmaUrl = () => {
    updateProjectUrls(activeProject.id, { figmaUrl: figmaUrlInput.trim() });
    setIsEditingFigmaUrl(false);
  };

  const handleDownloadFile = () => {
    if (typeof window === 'undefined' || !deliverable) return;
    const blob = new Blob([deliverable.specMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeProject.slug}-${stageDef?.id || 'spec'}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-canvas)] border-l border-[var(--border-subtle)] overflow-hidden transition-colors min-h-0">
      {/* Spec Canvas Toolbar */}
      <div className="h-12 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 sm:px-4 flex items-center justify-between gap-2 shrink-0 select-none overflow-hidden whitespace-nowrap">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 overflow-hidden">
          <FileText className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
          <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
            {isArabic ? 'مستند المواصفات الفنية' : 'Specification Document'}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] shrink-0">
            {stageDef?.badge}
          </span>
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {activeStageId === 'ui_ux' && (
            <button
              onClick={() => setDemoDrawerOpen(true)}
              title={isArabic ? 'فتح صندوق التجارب' : 'Open Sandbox Side Drawer'}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span className="hidden md:inline">{isArabic ? 'صندوق التجارب' : 'Sandbox Drawer'}</span>
            </button>
          )}

          {/* Edit / Preview Toggle */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] transition-colors"
          >
            {isEditing ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isArabic ? 'معاينة' : 'Preview'}</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isArabic ? 'تعديل المصدر' : 'Edit Raw'}</span>
              </>
            )}
          </button>

          {/* Copy Markdown */}
          <button
            onClick={handleCopyMarkdown}
            title={isArabic ? 'نسخ المواصفة كـ Markdown' : 'Copy Spec as Markdown'}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 hidden sm:inline">{isArabic ? 'تم النسخ' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span className="hidden sm:inline">{isArabic ? 'نسخ' : 'Copy'}</span>
              </>
            )}
          </button>

          {/* Download .md */}
          <button
            onClick={handleDownloadFile}
            title={isArabic ? 'تحميل ملف .md' : 'Download .md file'}
            className="flex items-center gap-1 p-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Spec Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
        {/* UI/UX STAGE TOOLING CARD (Rendered dynamically in UI/UX Stage) */}
        {activeStageId === 'ui_ux' && (
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center shrink-0">
                  <FigmaIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-semibold text-[var(--text-primary)]">
                      {isArabic ? 'أداة تصدير Figma ومعاينة المكونات' : 'Figma Export Tool & Component Preview'}
                    </h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]">
                      {isArabic ? 'جاهز لـ Figma' : 'HTML to Design Ready'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {isArabic
                      ? 'مكون تفاعلي مصمم بالكامل للنسخ المباشر واستيراده داخل Figma.'
                      : 'Interactive markup formatted specifically for instant paste into Figma.'}
                  </p>
                </div>
              </div>

              {/* Segmented Toggle: [Live Preview] and [Figma-Ready Code] */}
              <div className="flex items-center gap-2">
                <div className="flex items-center p-0.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]">
                  <button
                    onClick={() => setUiUxMode('preview')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                      uiUxMode === 'preview'
                        ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] font-semibold shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>{isArabic ? 'معاينة حية' : 'Live Preview'}</span>
                  </button>
                  <button
                    onClick={() => setUiUxMode('code')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                      uiUxMode === 'code'
                        ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] font-semibold shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Code2 className="w-3 h-3" />
                    <span>{isArabic ? 'كود Figma' : 'Figma-Ready Code'}</span>
                  </button>
                </div>

                {/* Copy for Figma Action Button */}
                <button
                  onClick={handleCopyForFigma}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] text-xs font-semibold hover:opacity-90 transition-all shadow-xs shrink-0"
                >
                  {copiedFigmaSnippet ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <FigmaIcon className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {copiedFigmaSnippet 
                      ? (isArabic ? 'تم النسخ لـ Figma!' : 'Copied for Figma!') 
                      : (isArabic ? 'نسخ لـ Figma' : 'Copy for Figma')}
                  </span>
                </button>
              </div>
            </div>

            {/* Viewport for Preview vs Code */}
            {uiUxMode === 'preview' ? (
              <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-canvas)]">
                <div className="w-full flex justify-center" dangerouslySetInnerHTML={{ __html: figmaHtmlSnippet }} />
                <span className="text-[10px] font-mono text-[var(--text-muted)] mt-3">
                  {isArabic ? 'عرض بتصميم هندسي أحادي (#000000 / #ffffff / #18181b)' : 'Rendered in strict monochrome palette (#000000 / #ffffff / #18181b / #27272a).'}
                </span>
              </div>
            ) : (
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--code-bg)] p-3">
                <pre className="text-[11px] font-mono text-[var(--text-primary)] max-h-56 overflow-y-auto leading-relaxed whitespace-pre-wrap selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
                  {figmaHtmlSnippet}
                </pre>
              </div>
            )}

            {/* Native Figma Link & Sandbox Shortcut Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] min-w-0">
                <Link2 className="w-3.5 h-3.5 shrink-0" />
                <span>figma_url:</span>
                {isEditingFigmaUrl ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="url"
                      value={figmaUrlInput}
                      onChange={(e) => setFigmaUrlInput(e.target.value)}
                      placeholder="https://figma.com/file/..."
                      className="px-2 py-0.5 text-[11px] rounded border border-[var(--border-strong)] bg-[var(--bg-canvas)] text-[var(--text-primary)] font-mono"
                    />
                    <button
                      onClick={handleSaveFigmaUrl}
                      className="px-2 py-0.5 rounded bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] text-[10px] font-bold"
                    >
                      {isArabic ? 'حفظ' : 'Save'}
                    </button>
                    <button
                      onClick={() => setIsEditingFigmaUrl(false)}
                      className="text-[10px] text-[var(--text-muted)] underline ml-1"
                    >
                      {isArabic ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[var(--text-primary)] truncate max-w-[260px]">
                      {activeProject.figmaUrl || (isArabic ? 'لا يوجد رابط Figma مرتبط' : 'No native Figma URL linked')}
                    </span>
                    <button
                      onClick={() => {
                        setFigmaUrlInput(activeProject.figmaUrl || '');
                        setIsEditingFigmaUrl(true);
                      }}
                      className="underline text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                      {activeProject.figmaUrl ? (isArabic ? 'تعديل' : 'Edit') : (isArabic ? '+ إضافة' : '+ Add')}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {activeProject.figmaUrl && !isEditingFigmaUrl && (
                  <a
                    href={activeProject.figmaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] text-[var(--text-primary)] hover:underline"
                  >
                    <span>{isArabic ? 'فتح في Figma' : 'Open Native Figma'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  onClick={() => setDemoDrawerOpen(true)}
                  className="flex items-center gap-1 text-[11px] text-[var(--text-primary)] hover:underline font-medium"
                >
                  <Globe className="w-3 h-3" />
                  <span>{isArabic ? 'تشغيل صندوق التجارب' : 'Launch Sandbox Drawer'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Definition of Done (DoD) Checklist Card */}
        {deliverable && deliverable.checklist.length > 0 && (
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  {isArabic ? 'معايير اكتمال المرحلة (DoD)' : 'Stage Definition of Done (DoD)'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]">
                  {isArabic 
                    ? `مكتمل ${deliverable.checklist.filter((c) => c.done).length} من ${deliverable.checklist.length}`
                    : `${deliverable.checklist.filter((c) => c.done).length} / ${deliverable.checklist.length} Complete`}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                {deliverable.progress}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-[var(--border-subtle)] overflow-hidden mb-3">
              <div
                className="h-full bg-[var(--accent-contrast)] transition-all duration-300"
                style={{ width: `${deliverable.progress}%` }}
              />
            </div>

            {/* Interactive checklist items */}
            <div className="space-y-1.5">
              {deliverable.checklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleChecklistItem(activeProject.id, activeStageId, item.id)}
                  className="w-full flex items-start gap-2.5 p-2 rounded-lg text-left rtl:text-right text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors group"
                >
                  {item.done ? (
                    <CheckSquare className="w-4 h-4 text-[var(--accent-contrast)] mt-0.5 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] mt-0.5 shrink-0" />
                  )}
                  <span className={item.done ? 'line-through opacity-70 text-[var(--text-muted)]' : ''}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Spec Content or Editor */}
        {isEditing ? (
          <div className="space-y-2">
            <div className="text-xs text-[var(--text-muted)] flex items-center justify-between">
              <span>{isArabic ? 'تعديل مسودة Markdown للمواصفة:' : 'Editing raw Markdown specification:'}</span>
              <span className="font-mono text-[10px]">{isArabic ? 'حفظ تلقائي للمشروع النشط' : 'Autosaved to active project'}</span>
            </div>
            <textarea
              value={deliverable?.specMarkdown ?? ''}
              onChange={(e) =>
                updateSpecMarkdown(activeProject.id, activeStageId, e.target.value)
              }
              rows={24}
              className="w-full p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--code-bg)] text-[var(--text-primary)] font-mono text-xs leading-relaxed focus:outline-hidden focus:border-[var(--border-strong)] transition-colors"
            />
          </div>
        ) : (
          <article className="markdown-prose max-w-none pb-12">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');

                  if (match) {
                    return (
                      <CodeBlock
                        language={match[1]}
                        code={codeString}
                      />
                    );
                  }

                  return (
                    <code
                      className="px-1.5 py-0.5 rounded text-[11px] font-mono border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {deliverable?.specMarkdown || '# No specification drafted yet for this stage.'}
            </ReactMarkdown>
          </article>
        )}
      </div>
    </div>
  );
}

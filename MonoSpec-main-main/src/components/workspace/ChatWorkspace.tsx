'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Zap,
  ArrowRight,
  Shield,
  FileCode,
  Gauge,
  GitBranch,
  Paperclip,
  FileText,
  HardDrive,
  X,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { FigmaIcon } from '@/components/ui/FigmaIcon';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';
import { STAGES } from '@/lib/constants';
import { CodeBlock } from './CodeBlock';
import { ChatMessage } from '@/types';

export function ChatWorkspace() {
  const {
    activeProjectId,
    activeStageId,
    chatMessages,
    isGeneratingSpec,
    sendChatMessage,
    quickGenerateForActiveStage,
    getActiveProject,
    deleteChatMessage,
    clearChatMessages,
    customStages,
    locale,
  } = useMonoSpecStore();

  const isArabic = locale === 'ar';
  const [input, setInput] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [activeAttachment, setActiveAttachment] = useState<ChatMessage['attachment'] | null>(null);
  const [customDriveInput, setCustomDriveInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeProject = getActiveProject();
  const chatKey = `${activeProjectId}-${activeStageId}`;
  const messages = chatMessages[chatKey] || [];
  const currentStage =
    customStages.find((s) => s.id === activeStageId) ||
    STAGES.find((s) => s.id === activeStageId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGeneratingSpec]);

  if (!activeProject) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 bg-[var(--bg-canvas)]">
        <div className="w-10 h-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-muted)] shadow-2xs">
          <Bot className="w-5 h-5 text-[var(--text-muted)]" />
        </div>
        <p className="text-xs font-semibold text-[var(--text-primary)]">
          {isArabic ? 'لا يوجد مشروع نشط' : 'No Active Project'}
        </p>
        <p className="text-[11px] text-[var(--text-muted)] max-w-xs">
          {isArabic ? 'اختر مشروعاً من الشريط الجانبي أو اضغط + لإنشاء مشروع جديد.' : 'Select a project from the sidebar or click + to create a new specification.'}
        </p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !activeAttachment) || isGeneratingSpec) return;

    const messageContent = input.trim() || `Analyze and integrate attached ${activeAttachment?.type.toUpperCase()} into this stage specification.`;
    sendChatMessage(messageContent, activeAttachment || undefined);

    setInput('');
    setActiveAttachment(null);
    setShowAttachMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleAttachMockPdf = (fileName: string) => {
    setActiveAttachment({
      name: fileName,
      type: 'pdf',
      analysisSummary: 'PDF Document parsed with 42 enterprise schema rules and compliance flags.',
    });
    setShowAttachMenu(false);
  };

  const handleAttachDriveLink = () => {
    if (!customDriveInput.trim()) return;
    setActiveAttachment({
      name: 'Google Drive Repository / Architecture-Sync',
      type: 'drive',
      url: customDriveInput.trim(),
      analysisSummary: 'Drive folder connected: 14 documents analyzed and indexed into active model context.',
    });
    setCustomDriveInput('');
    setShowAttachMenu(false);
  };

  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setActiveAttachment({
        name: file.name,
        type: 'pdf',
        analysisSummary: `File ${file.name} ready for deep neural analysis and specification embedding.`,
      });
      setShowAttachMenu(false);
    }
  };

  const isLogoStage = activeStageId === 'logo';

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-canvas)] overflow-hidden transition-colors min-h-0">
      {/* Chat Stage Header */}
      <div className="h-12 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 sm:px-4 flex items-center justify-between gap-2 shrink-0 select-none overflow-hidden whitespace-nowrap">
        <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
          <Bot className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
          <span className="text-xs font-semibold text-[var(--text-primary)] truncate shrink-0">
            {isArabic ? 'المساعد المعماري' : 'Architect Assistant'}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] shrink-0">/</span>
          <span className="text-xs text-[var(--text-secondary)] font-medium truncate">
            {isArabic ? (currentStage?.labelAr || currentStage?.labelEn) : currentStage?.labelEn}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--text-muted)] shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="hidden sm:inline">{isArabic ? 'متصل' : 'Active'}</span>
          </div>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => clearChatMessages(chatKey)}
              title={isArabic ? 'مسح وحذف سجل محادثة هذه المرحلة' : 'Clear chat history for this stage'}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 border border-[var(--border-subtle)] hover:border-red-500/20 transition-all ml-1 rtl:ml-0 rtl:mr-1"
            >
              <X className="w-3 h-3" />
              <span className="hidden md:inline">{isArabic ? 'مسح المحادثة' : 'Clear Chat'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-muted)] shadow-2xs">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-[var(--text-primary)]">
                {isArabic 
                  ? `مساحة الحوار لـ ${currentStage?.labelAr || currentStage?.labelEn}`
                  : `${currentStage?.labelEn} Workspace Feed`}
              </h2>
              <p className="text-[11px] text-[var(--text-muted)] max-w-xs mt-1">
                {isArabic
                  ? 'تعاون مع MonoSpec لبناء وصياغة مواصفات معمارية دقيقة متوافقة مع متطلباتك. يمكنك إرفاق ملفات PDF أو روابط Google Drive للتحليل الفوري.'
                  : 'Collaborate with MonoSpec to formulate, verify, and validate precision architectural specifications. You can attach PDF files or Google Drive links for instant deep analysis.'}
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`group/msg flex gap-3 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender !== 'user' && (
                <div className="w-7 h-7 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center font-mono font-bold text-[10px] shrink-0 shadow-xs">
                  M
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3.5 space-y-2 border relative ${
                  msg.sender === 'user'
                    ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] border-transparent'
                    : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-primary)] shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-4 select-none opacity-70 text-[10px] font-mono">
                  <span>{msg.sender === 'user' ? 'Architect' : 'MonoSpec Core'}</span>
                  <div className="flex items-center gap-1.5">
                    <span>{msg.timestamp}</span>
                    {/* Small X to delete individual message like Codex */}
                    <button
                      type="button"
                      onClick={() => deleteChatMessage(chatKey, msg.id)}
                      title={isArabic ? 'حذف هذه الرسالة من السجل' : 'Delete message from history'}
                      aria-label={isArabic ? 'حذف الرسالة' : 'Delete message'}
                      className="opacity-0 group-hover/msg:opacity-100 focus:opacity-100 p-0.5 rounded hover:text-red-400 hover:bg-red-500/20 transition-all text-inherit"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>

                {/* Attached Document Pill if user provided one */}
                {msg.attachment && (
                  <div
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs font-mono border ${
                      msg.sender === 'user'
                        ? 'bg-black/20 border-white/20 text-white'
                        : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-emerald-400'
                    }`}
                  >
                    {msg.attachment.type === 'pdf' ? (
                      <FileText className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    ) : (
                      <HardDrive className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    )}
                    <span className="font-semibold truncate">{msg.attachment.name}</span>
                    <span className="text-[10px] opacity-80 uppercase ml-auto">
                      {msg.attachment.type} INGESTED
                    </span>
                  </div>
                )}

                <div className="markdown-prose text-xs">
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
                            className="px-1 py-0.5 rounded text-[10px] font-mono border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>

                {/* Suggested prompt actions */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5 border-t border-[var(--border-subtle)] select-none">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => sendChatMessage(`Execute action: ${action.label}`)}
                        className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <Zap className="w-2.5 h-2.5 text-[var(--text-muted)]" />
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                  <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </div>
              )}
            </div>
          ))
        )}

        {isGeneratingSpec && (
          <div className="flex gap-3 text-xs justify-start">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center font-mono font-bold text-[10px] shrink-0 animate-pulse">
              M
            </div>
            <div className="rounded-xl p-3 border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] font-mono ml-1">Formulating precision spec...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Stage Quick Suggestions Bar (Dynamic per stage, with special logo stage shortcuts!) */}
      <div className="px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center gap-1.5 overflow-x-auto no-scrollbar select-none">
        <span className="text-[10px] font-mono text-[var(--text-muted)] shrink-0 flex items-center gap-1 mr-1">
          <Zap className="w-3 h-3" /> {isArabic ? 'إجراءات سريعة:' : 'Quick:'}
        </span>

        {isLogoStage ? (
          <>
            <button
              onClick={() => sendChatMessage(isArabic ? 'توليد شعار هندسي SVG بترميز نظيف وزوايا رياضية متناسقة.' : 'Generate mathematical vector SVG logomark with 45-degree angle chevrons.')}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-900/30 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{isArabic ? 'شعار هندسي SVG' : 'SVG Vector Logomark'}</span>
            </button>
            <button
              onClick={() => sendChatMessage(isArabic ? 'تحديد مصفوفة توكنز الألوان عالية التباين للشاشات المظلمة.' : 'Define high-contrast enterprise color tokens matrix (Onyx, Optical White, Signal Accent).')}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <span>{isArabic ? 'لوحة ألوان الهوية' : 'Color Tokens Palette'}</span>
            </button>
            <button
              onClick={() => sendChatMessage(isArabic ? 'تحديد الخطوط الأساسية والخطوط الأحادية للواجهات البرمجية.' : 'Establish typography hierarchy pairing IBM Plex Sans Arabic with JetBrains Mono.')}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <span>{isArabic ? 'مواءمة الخطوط' : 'Typography Pairing'}</span>
            </button>
            <button
              onClick={() => sendChatMessage(isArabic ? 'تصدير أيقونات Favicon وأيقونات التطبيق بجميع المقاسات القياسية.' : 'Export Favicon and app manifest icon dimensions (16px, 32px, 192px, 512px).')}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <span>{isArabic ? 'حزمة أيقونات Favicon' : 'Favicon Icons Pack'}</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => quickGenerateForActiveStage('schema')}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <FileCode className="w-3 h-3 text-[var(--text-muted)]" />
              <span>{isArabic ? 'مخطط OpenAPI' : 'OpenAPI Schema'}</span>
            </button>
            <button
              onClick={() => quickGenerateForActiveStage('security')}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Shield className="w-3 h-3 text-[var(--text-muted)]" />
              <span>{isArabic ? 'مصفوفة الأمان' : 'Security Threat Matrix'}</span>
            </button>
            <button
              onClick={() => quickGenerateForActiveStage('perf')}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Gauge className="w-3 h-3 text-[var(--text-muted)]" />
              <span>{isArabic ? 'اختبار أحمال k6' : 'k6 Load Test'}</span>
            </button>
            <button
              onClick={() => quickGenerateForActiveStage('figma')}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <FigmaIcon className="w-3 h-3 text-[var(--text-muted)]" />
              <span>{isArabic ? 'توكنز Figma' : 'Tokens JSON'}</span>
            </button>
          </>
        )}
      </div>

      {/* Attachment Popover Modal / Menu */}
      {showAttachMenu && (
        <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-xs space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isArabic ? 'إرفاق مستند أو مجلد Google Drive لتحليله بالذكاء الاصطناعي' : 'Attach Document or Google Drive Folder for AI Analysis'}</span>
            </span>
            <button
              type="button"
              onClick={() => setShowAttachMenu(false)}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* PDF Picker */}
            <label className="p-3 rounded-xl border border-dashed border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] cursor-pointer flex items-center gap-2.5 transition-colors">
              <input
                type="file"
                accept=".pdf,.docx,.txt,.json,.md"
                onChange={handleLocalFileSelect}
                className="hidden"
              />
              <FileText className="w-4 h-4 text-red-400 shrink-0" />
              <div>
                <span className="font-bold text-[11px] text-[var(--text-primary)] block">
                  {isArabic ? 'رفع ملف PDF / كراسة شروط' : 'Upload PDF / Specification Document'}
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  {isArabic ? 'استخراج المتطلبات والجداول فوراً' : 'Extract requirements & tables instantly'}
                </span>
              </div>
            </label>

            {/* Quick Presets */}
            <button
              type="button"
              onClick={() => handleAttachMockPdf('Enterprise-Architecture-Guidelines.pdf')}
              className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-left rtl:text-right flex items-center gap-2.5 transition-colors"
            >
              <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-[11px] text-[var(--text-primary)] block">
                  Architecture-Guidelines.pdf
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  {isArabic ? 'نموذج معتمد لمواصفات الأنظمة' : 'Enterprise architecture standard'}
                </span>
              </div>
            </button>
          </div>

          {/* Google Drive Link input */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1 relative">
              <HardDrive className="w-3.5 h-3.5 text-blue-400 absolute ltr:left-2.5 rtl:right-2.5 top-2.5" />
              <input
                type="url"
                placeholder={isArabic ? 'رابط مجلد Google Drive (مثال: https://drive.google.com/...)' : 'Google Drive folder link (e.g. https://drive.google.com/...)'}
                value={customDriveInput}
                onChange={(e) => setCustomDriveInput(e.target.value)}
                className="w-full ltr:pl-8 ltr:pr-3 rtl:pr-8 rtl:pl-3 py-1.5 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-hidden"
              />
            </div>
            <button
              type="button"
              onClick={handleAttachDriveLink}
              disabled={!customDriveInput.trim()}
              className="px-3 py-1.5 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] text-xs font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0"
            >
              {isArabic ? 'ربط درايف' : 'Connect Drive'}
            </button>
          </div>
        </div>
      )}

      {/* Input Message Area */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)]">
        {/* Active Attachment Pill */}
        {activeAttachment && (
          <div className="mb-2 p-1.5 px-3 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 truncate">
              {activeAttachment.type === 'pdf' ? (
                <FileText className="w-3.5 h-3.5 text-red-400 shrink-0" />
              ) : (
                <HardDrive className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              )}
              <span className="font-bold truncate">{activeAttachment.name}</span>
              <span className="text-[10px] text-zinc-400 font-sans hidden sm:inline">
                {isArabic ? '(سيتم تحليله وتضمينه مع الرسالة)' : '(will be analyzed with message)'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveAttachment(null)}
              className="p-1 rounded text-zinc-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="relative rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] focus-within:border-[var(--border-strong)] transition-colors p-2 shadow-2xs">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isArabic
                ? `اكتب تعليماتك المعمارية لـ MonoSpec في مرحلة ${currentStage?.labelAr || currentStage?.labelEn}... (اضغط Enter للإرسال)`
                : `Instruct MonoSpec on ${currentStage?.labelEn}... (Enter to send, Shift+Enter for newline)`
            }
            rows={2}
            className="w-full bg-transparent resize-none text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden leading-relaxed"
          />
          <div className="flex items-center justify-between pt-1 select-none">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAttachMenu((prev) => !prev)}
                title={isArabic ? 'إرفاق ملف PDF أو رابط Google Drive' : 'Attach PDF or Google Drive Link'}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                  showAttachMenu || activeAttachment
                    ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-400'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Paperclip className="w-3 h-3" />
                <span>{isArabic ? 'إرفاق ملف / درايف' : 'Attach PDF / Drive'}</span>
              </button>

              <span className="text-[10px] font-mono text-[var(--text-muted)] hidden xl:inline">
                {isArabic ? 'Shift+Enter لسطر جديد' : 'Shift+Enter for newline'}
              </span>
            </div>

            <button
              type="submit"
              disabled={(!input.trim() && !activeAttachment) || isGeneratingSpec}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] text-xs font-semibold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs"
            >
              <span>{isArabic ? 'إرسال' : 'Send'}</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

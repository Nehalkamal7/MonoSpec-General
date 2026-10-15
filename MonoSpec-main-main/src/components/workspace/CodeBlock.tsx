'use client';

import React, { useState } from 'react';
import { Check, Copy, Terminal, Eye, Code as CodeIcon } from 'lucide-react';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';

interface CodeBlockProps {
  language?: string;
  filename?: string;
  code: string;
}

export function CodeBlock({ language = 'text', filename, code }: CodeBlockProps) {
  const { locale } = useMonoSpecStore();
  const isArabic = locale === 'ar';
  const [copied, setCopied] = useState(false);
  const isSvg = language.toLowerCase() === 'svg' || (code.trim().startsWith('<svg') && code.includes('</svg>'));
  const [viewMode, setViewMode] = useState<'preview' | 'code'>(isSvg ? 'preview' : 'code');

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--code-bg)] overflow-hidden shadow-xs">
      {/* Code Block Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-mono select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          {filename ? (
            <span className="text-[var(--text-primary)] font-medium">{filename}</span>
          ) : (
            <span className="uppercase text-[10px] text-[var(--text-muted)] tracking-wider font-bold">
              {language}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* SVG / Visual Preview Toggle */}
          {isSvg && (
            <div className="flex items-center p-0.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]">
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-sans font-medium transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] shadow-2xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Eye className="w-2.5 h-2.5" />
                <span>{isArabic ? 'معاينة بصرية' : 'Visual Preview'}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('code')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-sans font-medium transition-colors ${
                  viewMode === 'code'
                    ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] shadow-2xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <CodeIcon className="w-2.5 h-2.5" />
                <span>{isArabic ? 'الشيفرة' : 'Source'}</span>
              </button>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-500 font-sans">{isArabic ? 'تم النسخ' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="font-sans">{isArabic ? 'نسخ' : 'Copy'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Live SVG Display */}
      {isSvg && viewMode === 'preview' ? (
        <div className="p-6 flex flex-col items-center justify-center bg-radial from-zinc-900 to-black border-b border-[var(--border-subtle)]">
          <div
            className="w-full max-w-sm flex items-center justify-center p-4 rounded-xl border border-zinc-800 bg-zinc-950/80 shadow-inner"
            dangerouslySetInnerHTML={{ __html: code }}
          />
          <span className="text-[10px] font-mono text-[var(--text-muted)] mt-2">
            {isArabic ? 'عرض متجه تفاعلي • SVG فائق الدقة والقابلية للتوسع' : 'Interactive Vector Render • 100% Scalable SVG'}
          </span>
        </div>
      ) : (
        /* Code Content */
        <pre className="p-3.5 overflow-x-auto text-xs font-mono text-[var(--text-primary)] leading-relaxed selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}

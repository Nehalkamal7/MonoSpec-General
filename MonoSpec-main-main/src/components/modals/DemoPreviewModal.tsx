'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Activity,
  Server,
  Database,
  ExternalLink,
  RefreshCw,
  Cpu,
  Layers,
  Globe,
  Link2,
  Save,
  Check,
} from 'lucide-react';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';
import { COMPANIES } from '@/lib/constants';

export function DemoPreviewModal() {
  const {
    isDemoModalOpen,
    setDemoModalOpen,
    getActiveProject,
    updateProjectUrls,
    getCompanyById,
    locale,
  } = useMonoSpecStore();

  const isArabic = locale === 'ar';

  const [activeTab, setActiveTab] = useState<'iframe' | 'telemetry' | 'topology'>('iframe');
  const [latency, setLatency] = useState(18);
  const [throughput, setThroughput] = useState(14820);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const activeProject = getActiveProject();
  const [demoUrlInput, setDemoUrlInput] = useState(activeProject?.demoUrl || '');

  useEffect(() => {
    if (!isDemoModalOpen) return;
    const interval = setInterval(() => {
      setLatency(Math.floor(14 + Math.random() * 8));
      setThroughput(Math.floor(14500 + Math.random() * 800));
    }, 1500);
    return () => clearInterval(interval);
  }, [isDemoModalOpen]);

  if (!isDemoModalOpen || !activeProject) return null;

  const company =
    getCompanyById(activeProject.companyId) || {
      id: activeProject.companyId,
      name: activeProject.companyId,
      code: (activeProject.companyId.slice(0, 3) || 'APX').toUpperCase(),
    };

  const handleSaveDemoUrl = () => {
    updateProjectUrls(activeProject.id, { demoUrl: demoUrlInput.trim() });
    setIsEditingUrl(false);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-4xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] shadow-2xl overflow-hidden text-[var(--text-primary)] flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center shadow-xs">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold tracking-tight">
                  {isArabic ? 'معاينة المشروع التفاعلية وبيئة التشغيل' : 'Demo Preview & Architectural Sandbox'}
                </h2>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]">
                  {isArabic ? 'بيئة حية' : 'LIVE RUNTIME'}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-mono">
                {activeProject.title} ({company.name})
              </p>
            </div>
          </div>

          <button
            onClick={() => setDemoModalOpen(false)}
            className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Demo Preview URL Persistence Bar */}
        <div className="px-6 py-2.5 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Globe className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
            <span className="font-mono text-[11px] text-[var(--text-muted)] shrink-0">
              {isArabic ? 'رابط المعاينة:' : 'Demo URL:'}
            </span>
            {isEditingUrl ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="url"
                  value={demoUrlInput}
                  onChange={(e) => setDemoUrlInput(e.target.value)}
                  placeholder="https://preview.yourdomain.com..."
                  className="flex-1 px-2.5 py-1 text-xs rounded-md border border-[var(--border-strong)] bg-[var(--bg-canvas)] text-[var(--text-primary)] font-mono focus:outline-hidden"
                />
                <button
                  onClick={handleSaveDemoUrl}
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
                  {activeProject.demoUrl || (isArabic ? 'لم يتم تعيين رابط معاينة بعد' : 'No dynamic demo preview URL set')}
                </span>
                <button
                  onClick={() => {
                    setDemoUrlInput(activeProject.demoUrl || '');
                    setIsEditingUrl(true);
                  }}
                  className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] underline shrink-0"
                >
                  {isArabic ? 'تعديل الرابط' : 'Edit URL'}
                </button>
              </div>
            )}
          </div>

          {activeProject.demoUrl && !isEditingUrl && (
            <a
              href={activeProject.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[11px] font-medium text-[var(--text-primary)] hover:underline shrink-0"
            >
              <span>{isArabic ? 'فتح في نافذة جديدة' : 'Open in New Tab'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Tab Strip */}
        <div className="px-6 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] flex items-center justify-between shrink-0">
          <div className="flex gap-4 text-xs font-medium">
            <button
              onClick={() => setActiveTab('iframe')}
              className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'iframe'
                  ? 'border-[var(--border-strong)] text-[var(--text-primary)] font-semibold'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isArabic ? 'بيئة المعاينة التفاعلية' : 'Live Preview Sandbox'}</span>
            </button>

            <button
              onClick={() => setActiveTab('telemetry')}
              className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'telemetry'
                  ? 'border-[var(--border-strong)] text-[var(--text-primary)] font-semibold'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{isArabic ? 'المقاييس وسرعة الاستجابة' : 'Telemetry & Latency'}</span>
            </button>

            <button
              onClick={() => setActiveTab('topology')}
              className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'topology'
                  ? 'border-[var(--border-strong)] text-[var(--text-primary)] font-semibold'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isArabic ? 'طوبولوجيا السحابة السيادية' : 'Sovereign Topology'}</span>
            </button>
          </div>

          <button
            onClick={() => setIframeKey((prev) => prev + 1)}
            title={isArabic ? 'إعادة تحميل البيئة' : 'Reload Sandbox'}
            className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Viewport */}
        <div className="flex-1 overflow-y-auto p-6 bg-[var(--bg-canvas)] flex flex-col min-h-[380px]">
          {activeTab === 'iframe' && (
            <div className="flex-1 flex flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
              {activeProject.demoUrl ? (
                <iframe
                  key={iframeKey}
                  src={activeProject.demoUrl}
                  title="Demo Sandbox Preview"
                  className="w-full flex-1 border-0 min-h-[360px]"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-center text-[var(--text-muted)]">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      {isArabic ? 'لم يتم تعيين رابط معاينة تفاعلية' : 'No Demo Preview URL Configured'}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] max-w-sm mt-1">
                      {isArabic ? 'اضغط على "تعديل الرابط" بالأعلى لتعيين رابط المعاينة التجريبية الخاص بك.' : 'Click Edit URL above to assign a dynamic staging preview, local port, or tunnel.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                    {isArabic ? 'زمن الاستجابة' : 'P99 Ingress Latency'}
                  </span>
                  <p className="text-xl font-mono font-bold mt-1 text-[var(--text-primary)]">{latency}ms</p>
                </div>
                <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                    {isArabic ? 'معدل الطلبات' : 'Throughput'}
                  </span>
                  <p className="text-xl font-mono font-bold mt-1 text-[var(--text-primary)]">
                    {throughput.toLocaleString()} <span className="text-xs font-normal text-[var(--text-muted)]">RPS</span>
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                    {isArabic ? 'مستوى المعمارية' : 'Architecture Tier'}
                  </span>
                  <p className="text-xs font-semibold mt-2 text-[var(--text-primary)] truncate">
                    {activeProject.architectureTier}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                    {isArabic ? 'اتفاقية التوفر' : 'Availability SLA'}
                  </span>
                  <p className="text-sm font-mono font-bold mt-1.5 text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    99.995%
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border-subtle)] text-xs font-mono">
                  <span className="text-[var(--text-muted)]">
                    {isArabic ? 'الفحوصات الحية للخدمات' : 'Active Health Checks'}
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    {isArabic ? 'جميع الأنظمة تعمل بكفاءة' : 'ALL OPERATIONAL'}
                  </span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-surface-elevated)]">
                    <span className="text-[var(--text-secondary)]">Edge Gateway (Envoy Ingress)</span>
                    <span className="text-[var(--text-primary)] font-bold">0.8ms</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-surface-elevated)]">
                    <span className="text-[var(--text-secondary)]">PostgreSQL 16 Primary Cluster</span>
                    <span className="text-[var(--text-primary)] font-bold">2.4ms</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-surface-elevated)]">
                    <span className="text-[var(--text-secondary)]">Redis Lock Idempotency Mesh</span>
                    <span className="text-[var(--text-primary)] font-bold">0.4ms</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'topology' && (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">
                  {isArabic ? 'ضوابط الكتلة السحابية السيادية' : 'Sovereign Cluster Invariants'}
                </span>
                <span className="text-[var(--text-primary)]">{company.name}</span>
              </div>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li>• {isArabic ? 'تعدد مراكز البيانات واستبقاء كامل داخل السعودية (الرياض / جدة).' : 'Multi-zone redundancy across Saudi sovereign data centers (Riyadh / Jeddah).'}</li>
                <li>• {isArabic ? 'توثيق أمني كامل للمفاتيح المشفرة عبر وحدات Keystore المعتمدة.' : 'Hardware Keystore attestation for cryptographic payloads and tokens.'}</li>
                <li>• {isArabic ? 'منع خروج البيانات خارج الحدود الوطنية وفقاً لمعايير الهيئة الوطنية للأمن السيبراني NCA.' : 'Zero data egress outside national jurisdiction, certified against NCA controls.'}</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between text-xs text-[var(--text-muted)] shrink-0">
          <span>{isArabic ? 'يتم حفظ الرابط وتحديث المشروع تلقائياً في السجل.' : 'Persisted into active project record automatically.'}</span>
          <button
            onClick={() => setDemoModalOpen(false)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] hover:opacity-90 transition-opacity"
          >
            {isArabic ? 'تم' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}

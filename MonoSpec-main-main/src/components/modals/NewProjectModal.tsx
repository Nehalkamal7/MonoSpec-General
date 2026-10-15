'use client';

import React, { useState } from 'react';
import { X, Building2, Sparkles, Layers, ShieldCheck, Check } from 'lucide-react';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';
import { CompanyId, Project } from '@/types';

export function NewProjectModal() {
  const { isNewProjectModalOpen, setNewProjectModalOpen, createProject, companies, accountType, locale } =
    useMonoSpecStore();

  const isArabic = locale === 'ar';
  const isFreelancer = accountType === 'freelancer';

  const [title, setTitle] = useState('');
  const [companyId, setCompanyId] = useState<CompanyId>(companies[0]?.id || 'awamer');
  const [description, setDescription] = useState('');
  const [architectureTier, setArchitectureTier] =
    useState<Project['architectureTier']>('Tier 1 Enterprise');

  if (!isNewProjectModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createProject({
      title: title.trim(),
      companyId,
      description:
        description.trim() ||
        (isFreelancer
          ? (isArabic ? 'المواصفات الفنية والمعمارية للموقع تم إنشاؤها عبر MonoSpec.' : 'Website technical architecture specification created via MonoSpec.')
          : (isArabic ? 'مواصفة معمارية للمشروع تم إنشاؤها عبر منظومة MonoSpec.' : 'Enterprise software architecture specification created via MonoSpec.')),
      architectureTier,
    });

    setTitle('');
    setDescription('');
    setNewProjectModalOpen(false);
  };

  const selectedCompany = companies.find((c) => c.id === companyId) || companies[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] shadow-2xl overflow-hidden text-[var(--text-primary)] flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] flex items-center justify-center font-mono font-bold text-xs">
              +
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight">
                {isFreelancer 
                  ? (isArabic ? 'بدء مواصفة موقع جديد' : 'Initialize New Website Spec') 
                  : (isArabic ? 'بدء مشروع جديد' : 'Initialize New Project')}
              </h2>
              <p className="text-[11px] text-[var(--text-muted)]">
                {isFreelancer 
                  ? (isArabic ? 'التابع لموقع: ' : 'Assigned to platform: ') 
                  : (isArabic ? 'التابع لشركة: ' : 'Assign to company: ')}
                <strong className="text-[var(--text-primary)]">
                  {isArabic ? (selectedCompany?.nameAr || selectedCompany?.name) : selectedCompany?.name}
                </strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setNewProjectModalOpen(false)}
            className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
          {/* Company Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">
                {isFreelancer 
                  ? (isArabic ? 'اختر الموقع أو المنصة التابع لها المشروع' : 'Select Target Website / Platform') 
                  : (isArabic ? 'العميل المستهدف / الشركة' : 'Enterprise Client / Target Company')}
              </label>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                {isFreelancer ? (isArabic ? 'كود الموقع: ' : 'Site Code: ') : (isArabic ? 'كود الشركة: ' : 'Company Code: ')}
                <strong className="text-[var(--text-primary)]">{selectedCompany?.code}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {companies.map((comp) => {
                const isSelected = companyId === comp.id;
                return (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => setCompanyId(comp.id)}
                    className={`p-3 rounded-xl border text-left rtl:text-right transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? 'border-[var(--border-strong)] bg-[var(--bg-surface-elevated)] shadow-xs ring-1 ring-[var(--border-strong)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                        {isArabic ? (comp.nameAr || comp.name) : comp.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] shrink-0">
                        {comp.code}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] font-sans">
                      <span className="truncate">{comp.industry || 'Technology'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Project Title Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">
              {isArabic ? 'عنوان المشروع' : 'Project Title'}
            </label>
            <input
              type="text"
              placeholder={isFreelancer 
                ? (isArabic ? 'مثال: متجر إلكتروني فائق السرعة' : 'e.g. NextGen Headless Storefront') 
                : (isArabic ? 'مثال: محرك التتبع والشحن اللوجستي' : 'e.g. NextGen Autonomous Freight Engine')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:border-[var(--border-strong)] transition-colors"
              required
            />
          </div>

          {/* Architecture Tier */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">
              {isArabic ? 'مستوى الأهمية المعمارية' : 'Architecture Criticality Tier'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Tier 1 Enterprise', label: isArabic ? 'مؤسسي (المستوى 1)' : 'Tier 1 Enterprise' },
                { id: 'Core Platform', label: isArabic ? 'منصة رئيسية' : 'Core Platform' },
                { id: 'Mission Critical', label: isArabic ? 'فائق الحساسية' : 'Mission Critical' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setArchitectureTier(tier.id as any)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-mono border text-center transition-all ${
                    architectureTier === tier.id
                      ? 'bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] border-transparent font-bold'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">
              {isArabic ? 'نطاق النظام والمحددات المعمارية' : 'System Scope & Architecture Invariants'}
            </label>
            <textarea
              placeholder={isArabic 
                ? 'معالجة الرسائل فائقة السرعة، خدمات مصغرة، الامتثال للمعايير الحكومية والمالية...' 
                : 'High-throughput message pipeline, event-driven microservices, compliance...'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-hidden focus:border-[var(--border-strong)] transition-colors resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[var(--border-subtle)] shrink-0">
            <button
              type="button"
              onClick={() => setNewProjectModalOpen(false)}
              className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-xs text-[var(--text-secondary)] transition-colors"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-1.5 rounded-lg bg-[var(--accent-contrast)] text-[var(--accent-contrast-text)] text-xs font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
            >
              {isArabic ? 'إنشاء المواصفة' : 'Create Specification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

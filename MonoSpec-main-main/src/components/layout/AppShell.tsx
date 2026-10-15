'use client';

import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { StageNavigation } from './StageNavigation';
import { WorkspaceContainer } from '@/components/workspace/WorkspaceContainer';
import { NewProjectModal } from '@/components/modals/NewProjectModal';
import { FigmaExportModal } from '@/components/modals/FigmaExportModal';
import { DemoPreviewModal } from '@/components/modals/DemoPreviewModal';
import { TrainingDatasetsModal } from '@/components/modals/TrainingDatasetsModal';
import { SettingsModal } from '@/components/modals/SettingsModal';
import { DemoPreviewDrawer } from '@/components/workspace/DemoPreviewDrawer';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';
import { STAGES } from '@/lib/constants';

export function AppShell() {
  const {
    setNewProjectModalOpen,
    toggleSidebar,
    setActiveStage,
    locale,
  } = useMonoSpecStore();

  const isArabic = locale === 'ar';

  // Keyboard shortcut listener (Cmd/Ctrl + N, Cmd/Ctrl + B, Cmd/Ctrl + 1..6)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setNewProjectModalOpen(true);
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      } else if (isCmdOrCtrl && ['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        e.preventDefault();
        const stageIndex = parseInt(e.key, 10) - 1;
        if (STAGES[stageIndex]) {
          setActiveStage(STAGES[stageIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setNewProjectModalOpen, toggleSidebar, setActiveStage]);

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`flex h-screen w-full overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-primary)] antialiased transition-colors ${
        isArabic ? 'rtl font-sans' : 'ltr font-sans'
      }`}
    >
      {/* 1. Left Collapsible Sidebar */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full overflow-hidden">
        {/* 2. Active Project Context Header */}
        <Header />

        {/* 3. 6 Stage Navigation Tabs */}
        <StageNavigation />

        {/* 4. Main Chat & Workspace Canvas */}
        <main className="flex-1 overflow-hidden min-h-0">
          <WorkspaceContainer />
        </main>
      </div>

      {/* Global Modals & Side Drawers */}
      <NewProjectModal />
      <FigmaExportModal />
      <DemoPreviewModal />
      <TrainingDatasetsModal />
      <SettingsModal />
      <DemoPreviewDrawer />
    </div>
  );
}

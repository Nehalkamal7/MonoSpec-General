'use client';

import React from 'react';
import { useMonoSpecStore } from '@/store/useMonoSpecStore';
import { ChatWorkspace } from './ChatWorkspace';
import { SpecCanvas } from './SpecCanvas';

export function WorkspaceContainer() {
  const { canvasViewMode } = useMonoSpecStore();

  return (
    <div className="flex-1 flex overflow-hidden h-full min-h-0 min-w-0">
      {/* Chat Workspace Section */}
      {(canvasViewMode === 'split' || canvasViewMode === 'chat-only') && (
        <div
          className={`${
            canvasViewMode === 'chat-only'
              ? 'w-full'
              : 'w-full md:w-[45%] lg:w-[42%] xl:w-[38%] max-w-xl min-w-[280px] sm:min-w-[320px]'
          } h-full flex flex-col shrink-0 min-w-0 min-h-0`}
        >
          <ChatWorkspace />
        </div>
      )}

      {/* Spec Canvas Section */}
      {(canvasViewMode === 'split' || canvasViewMode === 'canvas-only') && (
        <div className="flex-1 h-full flex flex-col overflow-hidden min-w-0 min-h-0">
          <SpecCanvas />
        </div>
      )}
    </div>
  );
}

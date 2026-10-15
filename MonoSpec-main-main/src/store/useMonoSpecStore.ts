import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Project,
  StageId,
  ChatMessage,
  CompanyId,
  Company,
  StageDefinition,
  TeamWorkspace,
  UserSession,
  IngestedSource,
} from '@/types';
import { INITIAL_PROJECTS, INITIAL_CHAT_MESSAGES } from '@/lib/mock-data';
import { INITIAL_COMPANIES, STAGES, RECOMMENDED_STAGES } from '@/lib/constants';

export type CanvasViewMode = 'split' | 'canvas-only' | 'chat-only';
export type ActiveView = 'landing' | 'onboarding' | 'workspace';

interface MonoSpecStore {
  // Navigation & View State
  activeView: ActiveView;
  onboardingStep: number; // 1: Workspace & Room Code, 2: Company Setup, 3: Stages Config
  locale: 'ar' | 'en';
  accountType: 'enterprise' | 'freelancer';
  userSession: UserSession | null;
  workspace: TeamWorkspace | null;
  isSettingsModalOpen: boolean;
  activeSettingsTab: 'workspace' | 'companies' | 'stages' | 'ai' | 'profile';

  // Companies (Dynamic Multi-Company Support)
  companies: Company[];

  // Projects
  projects: Project[];
  activeProjectId: string;
  activeStageId: StageId;
  searchQuery: string;
  selectedCompanyFilter: CompanyId | 'all';

  // Pipeline Stages (Configurable & Recommended)
  customStages: StageDefinition[];
  selectedStageIds: string[];

  // Data Ingestion & Model Training Sources (PDFs, Google Drive links, URLs)
  ingestedSources: IngestedSource[];

  // UI state
  sidebarCollapsed: boolean;
  canvasViewMode: CanvasViewMode;
  isNewProjectModalOpen: boolean;
  isFigmaModalOpen: boolean;
  isDemoModalOpen: boolean;
  isDemoDrawerOpen: boolean;
  isTrainingModalOpen: boolean;
  isGeneratingSpec: boolean;

  // Chat feeds per project-stage
  chatMessages: Record<string, ChatMessage[]>;

  // Computed getters
  getActiveProject: () => Project | undefined;
  getActiveDeliverable: () => Project['stages'][string] | undefined;
  getFilteredProjects: () => Project[];
  getCompanyById: (id: string) => Company | undefined;

  // View & Auth Actions
  setActiveView: (view: ActiveView) => void;
  setOnboardingStep: (step: number) => void;
  setLocale: (locale: 'ar' | 'en') => void;
  toggleLocale: () => void;
  setAccountType: (type: 'enterprise' | 'freelancer') => void;
  setSettingsModalOpen: (open: boolean) => void;
  setActiveSettingsTab: (tab: 'workspace' | 'companies' | 'stages' | 'ai' | 'profile') => void;
  setUserSession: (session: UserSession | null) => void;
  updateUserSession: (data: Partial<UserSession>) => void;
  setWorkspace: (ws: TeamWorkspace | null) => void;
  updateWorkspace: (data: Partial<TeamWorkspace>) => void;
  createWorkspaceWithRoomCode: (name: string, customCode?: string) => TeamWorkspace;
  joinWorkspaceByRoomCode: (roomCode: string) => boolean;

  // Company Actions (Multi-Company)
  setCompanies: (companies: Company[]) => void;
  addCompany: (company: Omit<Company, 'id'> & { id?: string }) => Company;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  removeCompany: (id: string) => void;

  // Stage Actions
  setSelectedStageIds: (ids: string[]) => void;
  toggleStageSelection: (stageId: string) => void;
  addCustomStage: (stage: StageDefinition) => void;

  // Ingestion & AI Model Training Actions
  addIngestedSource: (source: IngestedSource) => void;
  analyzeSource: (id: string) => Promise<void>;

  // Project Actions
  setActiveProject: (id: string) => void;
  setActiveStage: (stageId: StageId) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCompanyFilter: (filter: CompanyId | 'all') => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCanvasViewMode: (mode: CanvasViewMode) => void;
  setNewProjectModalOpen: (open: boolean) => void;
  setFigmaModalOpen: (open: boolean) => void;
  setDemoModalOpen: (open: boolean) => void;
  setDemoDrawerOpen: (open: boolean) => void;
  setTrainingModalOpen: (open: boolean) => void;

  // Data mutation actions
  createProject: (params: {
    title: string;
    companyId: CompanyId;
    description: string;
    architectureTier: Project['architectureTier'];
  }) => Project;
  deleteProject: (id: string) => void;
  deleteChatHistory: (chatKey: string) => void;
  deleteChatMessage: (chatKey: string, messageId: string) => void;
  clearChatMessages: (chatKey: string) => void;
  updateSpecMarkdown: (projectId: string, stageId: StageId, markdown: string) => void;
  toggleChecklistItem: (projectId: string, stageId: StageId, checkId: string) => void;
  updateProjectUrls: (projectId: string, urls: { figmaUrl?: string; demoUrl?: string }) => void;
  sendChatMessage: (content: string, attachment?: ChatMessage['attachment']) => void;
  quickGenerateForActiveStage: (promptType: string) => void;
}

// Initial default workspace
const DEFAULT_WORKSPACE: TeamWorkspace = {
  id: 'ws-enterprise-core',
  name: 'Apex Global Engineering',
  roomCode: 'MONO-8842-PRO',
  description: 'Enterprise Architecture & Multi-Company Product Delivery Room',
  createdAt: '2026-10-14T08:00:00Z',
  membersCount: 6,
  inviteLink: 'https://monospec.internal/room/MONO-8842-PRO',
};

// Initial Ingested Documents & Drive Links
const INITIAL_INGESTED_SOURCES: IngestedSource[] = [
  {
    id: 'src-pdf-01',
    type: 'pdf',
    name: 'ZATCA-EInvoicing-Phase2-Technical-Guidelines.pdf',
    size: '4.8 MB',
    pageCount: 64,
    uploadedAt: '2026-10-14T09:30:00Z',
    status: 'trained',
    extractedInsights: {
      summary: 'Standard requirements for cryptographic stamps, QR code TLV encoding, and sovereign cloud data residency.',
      architectureType: 'Governmental Invoicing & Cryptographic Audit',
      keyRequirements: [
        'Mandatory SHA-256 XML hash signing with ECDSA secp256k1',
        'Sub-200ms cryptographic stamp ingestion',
        'Tamper-proof append-only audit trail',
      ],
      complianceFlags: ['ZATCA Phase-2', 'CITC Cloud Hosting', 'NCA ECC-1:2018'],
      tokenCount: 42800,
      entitiesDetected: ['TaxInvoice', 'CryptographicStamp', 'ClearanceStatus', 'SovereignAuditEntry'],
    },
  },
  {
    id: 'src-drive-02',
    type: 'drive',
    name: 'Google Drive: /Architecture-Specs/SoftPOS-EMV-Specs',
    url: 'https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoPqRsTuVwXyZ_SoftPOS',
    size: '18 Documents',
    uploadedAt: '2026-10-14T10:15:00Z',
    status: 'trained',
    extractedInsights: {
      summary: 'EMV Level 2 contactless kernel documentation, DUKPT key injection manuals, and soft-POS PIN-on-glass compliance.',
      architectureType: 'FinTech Contactless Payments',
      keyRequirements: [
        'Hardware-backed keystore attestation (Android StrongBox / iOS Secure Enclave)',
        'Zero cleartext cardholder data in memory',
        'Dynamic offline data authentication (DDA/CDA)',
      ],
      complianceFlags: ['PCI CPoC v1.2', 'EMVCo Level 2', 'SAMA SoftPOS Circular'],
      tokenCount: 89400,
      entitiesDetected: ['TerminalSession', 'DukptCounter', 'EncryptedTrack2', 'AuthorizationResponse'],
    },
  },
];

export const useMonoSpecStore = create<MonoSpecStore>()(
  persist(
    (set, get) => ({
      // Default to landing page when first opening, can be switched immediately
      activeView: 'landing',
      onboardingStep: 1,
      locale: 'ar',
      accountType: 'enterprise',
      isSettingsModalOpen: false,
      activeSettingsTab: 'workspace',
      userSession: {
        id: 'usr-default',
        name: 'نهال كمال',
        email: 'nehaledeib@gmail.com',
        phone: '+201553646123',
        role: 'مهندس الأنظمة والمعمارية البرمجية',
        workspaceId: DEFAULT_WORKSPACE.id,
        isAuthenticated: true,
        accountType: 'enterprise',
        avatarUrl: '',
        bio: 'المؤسس ومهندس المنظومات البرمجية والمواصفات المعمارية عالية الدقة للمؤسسات والشركات.',
      },
      workspace: DEFAULT_WORKSPACE,

      companies: INITIAL_COMPANIES,
      projects: INITIAL_PROJECTS,
      activeProjectId: INITIAL_PROJECTS[0].id,
      activeStageId: 'tech_analysis',
      searchQuery: '',
      selectedCompanyFilter: 'all',

      customStages: STAGES,
      selectedStageIds: STAGES.map((s) => s.id),

      ingestedSources: INITIAL_INGESTED_SOURCES,

      sidebarCollapsed: false,
      canvasViewMode: 'split',
      isNewProjectModalOpen: false,
      isFigmaModalOpen: false,
      isDemoModalOpen: false,
      isDemoDrawerOpen: false,
      isTrainingModalOpen: false,
      isGeneratingSpec: false,

      chatMessages: INITIAL_CHAT_MESSAGES,

      getActiveProject: () => {
        const { projects, activeProjectId } = get();
        return projects.find((p) => p.id === activeProjectId) ?? projects[0];
      },

      getActiveDeliverable: () => {
        const project = get().getActiveProject();
        if (!project) return undefined;
        return project.stages[get().activeStageId];
      },

      getFilteredProjects: () => {
        const { projects, searchQuery, selectedCompanyFilter } = get();
        return projects.filter((p) => {
          const matchesSearch =
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesCompany =
            selectedCompanyFilter === 'all' || p.companyId === selectedCompanyFilter;
          return matchesSearch && matchesCompany;
        });
      },

      getCompanyById: (id: string) => {
        return get().companies.find(
          (c) => c.id === id || c.code.toLowerCase() === id.toLowerCase()
        );
      },

      // View & Auth Actions
      setActiveView: (view) => set({ activeView: view }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      setLocale: (l) => {
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
          document.documentElement.setAttribute('lang', l);
        }
        set((state) => {
          let updatedSession = state.userSession;
          if (updatedSession) {
            const isNehal = updatedSession.email === 'nehaledeib@gmail.com' || updatedSession.name === 'نهال كمال' || updatedSession.name === 'Nehal Kamal';
            if (isNehal) {
              updatedSession = {
                ...updatedSession,
                name: l === 'ar' ? 'نهال كمال' : 'Nehal Kamal',
                role: l === 'ar' ? 'مهندس الأنظمة والمعمارية البرمجية' : 'Enterprise Software Architect & Lead',
                bio: l === 'ar'
                  ? 'المؤسس ومهندس المنظومات البرمجية والمواصفات المعمارية عالية الدقة للمؤسسات والشركات.'
                  : 'Founder & Systems Architect for High-Availability Enterprise Software.',
              };
            }
          }
          return { locale: l, userSession: updatedSession };
        });
      },
      toggleLocale: () => {
        const next = get().locale === 'ar' ? 'en' : 'ar';
        get().setLocale(next);
      },
      setAccountType: (type) => set({ accountType: type }),
      setSettingsModalOpen: (open) => set({ isSettingsModalOpen: open }),
      setActiveSettingsTab: (tab) => set({ activeSettingsTab: tab }),
      setUserSession: (session) => set({ userSession: session }),
      updateUserSession: (data) =>
        set((state) => ({
          userSession: state.userSession ? { ...state.userSession, ...data } : null,
        })),
      setWorkspace: (ws) => set({ workspace: ws }),
      updateWorkspace: (data) =>
        set((state) => ({
          workspace: state.workspace ? { ...state.workspace, ...data } : null,
        })),

      createWorkspaceWithRoomCode: (name, customCode) => {
        const roomCode =
          customCode && customCode.trim()
            ? customCode.trim().toUpperCase()
            : `ROOM-${Math.floor(1000 + Math.random() * 9000)}-${(name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3) || 'KSA').toUpperCase()}`;
        
        const newWs: TeamWorkspace = {
          id: `ws-${Date.now().toString(36)}`,
          name: name.trim() || 'My Team Workspace',
          roomCode,
          description: `Collaborative specification workspace for ${name}`,
          createdAt: new Date().toISOString(),
          membersCount: 1,
          inviteLink: `https://monospec.internal/room/${roomCode}`,
        };

        set({ workspace: newWs });
        return newWs;
      },

      joinWorkspaceByRoomCode: (code) => {
        const clean = code.trim().toUpperCase();
        if (!clean) return false;

        const joinedWs: TeamWorkspace = {
          id: `ws-joined-${Date.now().toString(36)}`,
          name: `Workspace (${clean})`,
          roomCode: clean,
          description: `Joined via room code ${clean}`,
          createdAt: new Date().toISOString(),
          membersCount: 5,
          inviteLink: `https://monospec.internal/room/${clean}`,
        };

        set({ workspace: joinedWs });
        return true;
      },

      // Company Management (Multi-Company)
      setCompanies: (newCompanies) => {
        set({
          companies: newCompanies,
          selectedCompanyFilter: newCompanies[0]?.id || 'all',
        });
      },

      addCompany: (compData) => {
        const id = compData.id || `comp-${Date.now().toString(36)}`;
        const code = compData.code.toUpperCase();
        const newCompany: Company = {
          id,
          name: compData.name.trim(),
          nameAr: compData.nameAr?.trim() || compData.name.trim(),
          tagline: compData.tagline?.trim() || 'Enterprise Digital Platform',
          code,
          industry: compData.industry?.trim() || 'General Technology',
          isCustom: true,
        };

        set((state) => ({
          companies: [...state.companies, newCompany],
        }));

        return newCompany;
      },

      updateCompany: (id, updates) => {
        set((state) => ({
          companies: state.companies.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },

      removeCompany: (id) => {
        set((state) => ({
          companies: state.companies.filter((c) => c.id !== id),
        }));
      },

      // Stage Customization & Selection
      setSelectedStageIds: (ids) => set({ selectedStageIds: ids }),

      toggleStageSelection: (stageId) => {
        set((state) => {
          const exists = state.selectedStageIds.includes(stageId);
          if (exists && state.selectedStageIds.length <= 1) return state; // keep at least 1
          const updated = exists
            ? state.selectedStageIds.filter((id) => id !== stageId)
            : [...state.selectedStageIds, stageId];
          return { selectedStageIds: updated };
        });
      },

      addCustomStage: (stage) => {
        set((state) => ({
          customStages: [...state.customStages, stage],
          selectedStageIds: [...state.selectedStageIds, stage.id],
        }));
      },

      // PDF & Drive Document Ingestion & AI Deep Analysis
      addIngestedSource: (source) => {
        set((state) => ({
          ingestedSources: [source, ...state.ingestedSources],
        }));
      },

      analyzeSource: async (id: string) => {
        // Mark as analyzing
        set((state) => ({
          ingestedSources: state.ingestedSources.map((s) =>
            s.id === id ? { ...s, status: 'analyzing' } : s
          ),
        }));

        // Simulate deep AI semantic parsing & ontology extraction
        await new Promise((r) => setTimeout(r, 1200));

        set((state) => ({
          ingestedSources: state.ingestedSources.map((s) => {
            if (s.id !== id) return s;
            const isDrive = s.type === 'drive';
            return {
              ...s,
              status: 'trained',
              extractedInsights: {
                summary: isDrive
                  ? `Comprehensive synchronized Drive directory parsed: extracted multi-module architecture, REST contracts, and deployment topology.`
                  : `High-precision PDF structural breakdown complete: verified table schemas, business invariants, and regulatory compliance constraints.`,
                architectureType: isDrive ? 'Cloud Microservices & Multi-Cloud Graph' : 'Documented Software Specification',
                keyRequirements: [
                  'High availability multi-region active-active persistence with zero data loss',
                  'Strict end-to-end auditability and tenant isolation',
                  'Integrated automated CI/CD verification gates before production promote',
                ],
                complianceFlags: ['ISO 27001', 'SOC 2 Type II', 'Regional Sovereign Data Law'],
                tokenCount: Math.floor(25000 + Math.random() * 60000),
                entitiesDetected: ['SecurityPolicy', 'DataModelEntity', 'EndpointContract', 'AuditRecord'],
              },
            };
          }),
        }));
      },

      setActiveProject: (id) => {
        const project = get().projects.find((p) => p.id === id);
        if (project) {
          set({
            activeProjectId: id,
            activeStageId: project.activeStageId,
          });
        }
      },

      setActiveStage: (stageId) => set({ activeStageId: stageId }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setSelectedCompanyFilter: (filter) => set({ selectedCompanyFilter: filter }),

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      setCanvasViewMode: (mode) => set({ canvasViewMode: mode }),

      setNewProjectModalOpen: (open) => set({ isNewProjectModalOpen: open }),

      setFigmaModalOpen: (open) => set({ isFigmaModalOpen: open }),

      setDemoModalOpen: (open) => set({ isDemoModalOpen: open }),

      setDemoDrawerOpen: (open) => set({ isDemoDrawerOpen: open }),

      setTrainingModalOpen: (open) => set({ isTrainingModalOpen: open }),

      createProject: ({ title, companyId, description, architectureTier }) => {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const newId = `proj-${companyId.slice(0, 3)}-${Date.now().toString(36)}`;
        const now = new Date().toISOString();
        const { customStages, companies } = get();

        const targetCompany = companies.find((c) => c.id === companyId);
        const compName = targetCompany?.name || companyId;

        const emptyStages: Project['stages'] = customStages.reduce((acc, stage) => {
          let customSpecMarkdown = `# ${stage.labelEn} Specification: ${title}
**Company:** ${compName}  
**Status:** Initial Draft  
**Created:** ${new Date().toLocaleDateString()}

---

## 1. Scope & Objective
This document outlines the precision engineering guidelines for the **${stage.labelEn}** stage of the project.
`;

          if (stage.id === 'logo') {
            customSpecMarkdown = `# Logo & Brand Identity Specification: ${title}
**Client Organization:** ${compName}  
**Status:** Approved Geometric Benchmark  
**Deliverable:** Vector Assets, Typography Scales & Design Palette

---

## 1. Geometric Concept & Brand Geometry
Constructed around an isometric grid with golden-ratio balanced symmetry:

\`\`\`svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80" width="240" height="80" class="w-48 h-16">
  <rect width="240" height="80" rx="12" fill="#09090b" stroke="#27272a" stroke-width="2"/>
  <circle cx="50" cy="40" r="18" fill="none" stroke="#ffffff" stroke-width="3" />
  <path d="M42 40 L48 46 L58 34" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="80" y="46" font-family="monospace" font-size="18" font-weight="bold" fill="#ffffff" letter-spacing="2">${targetCompany?.code || 'CORP'}</text>
  <text x="145" y="46" font-family="sans-serif" font-size="12" font-weight="400" fill="#a1a1aa">CORE</text>
</svg>
\`\`\`

## 2. Palette Tokens
| Token | HEX | HSL | Usage |
| :--- | :--- | :--- | :--- |
| \`brand-primary\` | \`#09090b\` | \`hsl(240, 10%, 4%)\` | Canvas Base |
| \`brand-contrast\` | \`#ffffff\` | \`hsl(0, 0%, 100%)\` | Primary Mark |
| \`brand-accent\` | \`#22c55e\` | \`hsl(142, 71%, 45%)\` | Status Active |
`;
          }

          acc[stage.id] = {
            stageId: stage.id,
            status: stage.id === 'tech_analysis' ? 'in_progress' : 'pending',
            progress: stage.id === 'tech_analysis' ? 10 : 0,
            specTitle: `${stage.labelEn} Specification`,
            updatedAt: now,
            checklist: [
              { id: `${stage.id}-chk-1`, text: `Define foundational requirements for ${stage.labelEn}`, done: false },
              { id: `${stage.id}-chk-2`, text: `Draft peer-reviewed specification document`, done: false },
              { id: `${stage.id}-chk-3`, text: `Sign-off with enterprise stakeholder team`, done: false },
            ],
            specMarkdown: customSpecMarkdown,
          };
          return acc;
        }, {} as Project['stages']);

        const newProject: Project = {
          id: newId,
          slug,
          title,
          companyId,
          description,
          activeStageId: 'tech_analysis',
          createdAt: now,
          updatedAt: now,
          status: 'active',
          architectureTier,
          stages: emptyStages,
        };

        set((state) => ({
          projects: [newProject, ...state.projects],
          activeProjectId: newId,
          activeStageId: 'tech_analysis',
          isNewProjectModalOpen: false,
        }));

        return newProject;
      },

      deleteProject: (id) => {
        set((state) => {
          const updatedProjects = state.projects.filter((p) => p.id !== id);
          let nextActiveId = state.activeProjectId;
          let nextStageId = state.activeStageId;

          if (state.activeProjectId === id) {
            if (updatedProjects.length > 0) {
              nextActiveId = updatedProjects[0].id;
              nextStageId = updatedProjects[0].activeStageId || 'tech_analysis';
            } else {
              nextActiveId = '';
            }
          }

          // Clean up all chat messages associated with this project
          const updatedChatMessages = { ...state.chatMessages };
          Object.keys(updatedChatMessages).forEach((key) => {
            if (key.startsWith(`${id}-`)) {
              delete updatedChatMessages[key];
            }
          });

          return {
            projects: updatedProjects,
            activeProjectId: nextActiveId,
            activeStageId: nextStageId,
            chatMessages: updatedChatMessages,
          };
        });
      },

      deleteChatHistory: (chatKey) => {
        set((state) => {
          const updatedChatMessages = { ...state.chatMessages };
          delete updatedChatMessages[chatKey];
          return {
            chatMessages: updatedChatMessages,
          };
        });
      },

      deleteChatMessage: (chatKey, messageId) => {
        set((state) => {
          const currentMsgs = state.chatMessages[chatKey] || [];
          const updatedMsgs = currentMsgs.filter((m) => m.id !== messageId);
          return {
            chatMessages: {
              ...state.chatMessages,
              [chatKey]: updatedMsgs,
            },
          };
        });
      },

      clearChatMessages: (chatKey) => {
        set((state) => ({
          chatMessages: {
            ...state.chatMessages,
            [chatKey]: [],
          },
        }));
      },

      updateSpecMarkdown: (projectId, stageId, markdown) => {
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== projectId) return p;
            return {
              ...p,
              updatedAt: new Date().toISOString(),
              stages: {
                ...p.stages,
                [stageId]: {
                  ...p.stages[stageId],
                  specMarkdown: markdown,
                  updatedAt: new Date().toISOString(),
                },
              },
            };
          }),
        }));
      },

      toggleChecklistItem: (projectId, stageId, checkId) => {
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== projectId) return p;
            const currentStage = p.stages[stageId];
            if (!currentStage) return p;
            const updatedChecklist = currentStage.checklist.map((item) =>
              item.id === checkId ? { ...item, done: !item.done } : item
            );
            const doneCount = updatedChecklist.filter((c) => c.done).length;
            const progress = Math.round((doneCount / updatedChecklist.length) * 100);

            return {
              ...p,
              updatedAt: new Date().toISOString(),
              stages: {
                ...p.stages,
                [stageId]: {
                  ...currentStage,
                  checklist: updatedChecklist,
                  progress,
                  status: progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'pending',
                  updatedAt: new Date().toISOString(),
                },
              },
            };
          }),
        }));
      },

      updateProjectUrls: (projectId, urls) => {
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== projectId) return p;
            return {
              ...p,
              figmaUrl: urls.figmaUrl !== undefined ? urls.figmaUrl : p.figmaUrl,
              demoUrl: urls.demoUrl !== undefined ? urls.demoUrl : p.demoUrl,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      sendChatMessage: (content, attachment) => {
        const { activeProjectId, activeStageId, chatMessages, customStages } = get();
        const chatKey = `${activeProjectId}-${activeStageId}`;
        const currentMsgs = chatMessages[chatKey] || [];

        const userMsg: ChatMessage = {
          id: `usr-${Date.now()}`,
          projectId: activeProjectId,
          stageId: activeStageId,
          sender: 'user',
          content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          attachment,
        };

        set({
          chatMessages: {
            ...chatMessages,
            [chatKey]: [...currentMsgs, userMsg],
          },
          isGeneratingSpec: true,
        });

        // Response generation including support for Logo and PDF/Drive attachments
        setTimeout(() => {
          const { getActiveProject, locale } = get();
          const activeProject = getActiveProject();
          const isArabic = locale === 'ar';
          const stageObj = customStages.find((s) => s.id === activeStageId);
          const stageName = isArabic ? (stageObj?.labelAr || activeStageId) : (stageObj?.labelEn || activeStageId);

          let assistantContent = isArabic ? `### التحليل المعماري والتحقق الهندسي
تم تقييم طلبك لمشروع **${activeProject?.title}** في مرحلة **${stageName}**.

تمت مراجعة معايير المواصفة لضمان التوافق التام مع المعايير المؤسسية:
- **استراتيجية المرونة:** منع أي نقطة فشل مفردة عبر آليات النصاب الموزع.
- **التتبع وقابلية الملاحظة:** تسجيل قياسات المعاملات وربطها مع مجمّع OpenTelemetry.

\`\`\`typescript
// التحقق من صحة المواصفة الفنية
export const specValidation = {
  verified: true,
  complianceLevel: "Enterprise Strict",
  latencyBudgetMs: 85,
  timestamp: ${Date.now()},
};
\`\`\`

هل ترغب في دمج هذه المواصفة مباشرة في لوحة المواصفات الفنية؟`
: `### Architectural Analysis & Verification
I have evaluated your request for **${activeProject?.title}** in the **${stageName}** stage.

The specification parameters have been recalculated to ensure strict adherence to our monochrome enterprise standard:
- **Resilience Strategy:** Zero single-point-of-failure with distributed quorum.
- **Traceability:** Correlated transaction telemetry logged to OpenTelemetry collector.

\`\`\`typescript
// Precision Specification Assertion
export const specValidation = {
  verified: true,
  complianceLevel: "Enterprise Strict",
  latencyBudgetMs: 85,
  timestamp: ${Date.now()},
};
\`\`\`

Would you like me to incorporate this directly into the live specification canvas?`;

          if (attachment) {
            assistantContent = isArabic ? `### تحليل واستيعاب المستند المرفق: ${attachment.name}
**نوع المستند:** ${attachment.type.toUpperCase()}  
**محرك المعالجة:** محرك MonoSpec العصبي لاستيعاب الوثائق (v2.4)

تم استخراج المتطلبات والكيانات البرمجية وضوابط الامتثال بعمق من **${attachment.name}**:
- **الثوابت المستخرجة:** تم مواءمة المخططات وقواعد البيانات مع مرحلة **${stageName}**.
- **الكيانات والعقود:** مطابقة بنسبة 100% لضوابط الأمان السيادي واستبقاء البيانات.
- **تحديث قاعدة المعرفة:** تم تضمين هذا المستند في أوزان النموذج لدعم الاسترجاع الذكي.

\`\`\`json
{
  "source": "${attachment.name}",
  "status": "INGESTED_AND_TRAINED",
  "matchedRules": 18,
  "confidenceScore": 0.994
}
\`\`\`

هل ترغب في إدراج المتطلبات المستخرجة مباشرة في لوحة مواصفات هذه المرحلة؟`
: `### Ingested Source Analysis & Integration: ${attachment.name}
**Source Type:** ${attachment.type.toUpperCase()}  
**Parsing Engine:** MonoSpec Deep Neural Ingestion Engine (v2.4)

I have deeply extracted the architectural invariants, entities, and compliance matrices from **${attachment.name}**:
- **Extracted Invariants:** Automated schema alignment verified against your active **${stageName}** stage.
- **Identified Entities & Contracts:** 100% matched with enterprise security and data residency rules.
- **Knowledge Base Update:** This document is now indexed in your workspace model weights for few-shot generation.

\`\`\`json
{
  "source": "${attachment.name}",
  "status": "INGESTED_AND_TRAINED",
  "matchedRules": 18,
  "confidenceScore": 0.994
}
\`\`\`

Would you like me to inject the extracted requirements directly into this stage's specification canvas?`;
          } else if (activeStageId === 'logo') {
            assistantContent = isArabic ? `### مواصفة الهوية البصرية والشعار الهندسي
إليك مخطط الهوية البصرية المتجهي المحسوب بالنسب الهندسية لمشروع **${activeProject?.title}**:

\`\`\`svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80" width="240" height="80" class="w-48 h-16">
  <rect width="240" height="80" rx="12" fill="#09090b" stroke="#27272a" stroke-width="2"/>
  <path d="M35 55 L50 25 L65 55 L55 55 L50 42 L45 55 Z" fill="#ffffff" />
  <circle cx="68" cy="30" r="4" fill="#22c55e" />
  <text x="85" y="46" font-family="monospace" font-size="18" font-weight="bold" fill="#ffffff">ID-MARK</text>
  <text x="165" y="46" font-family="sans-serif" font-size="12" fill="#a1a1aa">VECTOR</text>
</svg>
\`\`\`

- **لون الخلفية الأساسي:** الأسود الداكن (\`#09090b\`)
- **علامة الشعار عالية التباين:** الأبيض النقي (\`#ffffff\`)
- **عنصر التمييز الديناميكي:** الأخضر الحيوي (\`#22c55e\`)
- **سلسلة الخطوط:** Inter 600 / JetBrains Mono 700`
: `### Brand Identity & Geometric Logomark Specification
Here is the mathematically proportioned vector identity blueprint for **${activeProject?.title}**:

\`\`\`svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80" width="240" height="80" class="w-48 h-16">
  <rect width="240" height="80" rx="12" fill="#09090b" stroke="#27272a" stroke-width="2"/>
  <path d="M35 55 L50 25 L65 55 L55 55 L50 42 L45 55 Z" fill="#ffffff" />
  <circle cx="68" cy="30" r="4" fill="#22c55e" />
  <text x="85" y="46" font-family="monospace" font-size="18" font-weight="bold" fill="#ffffff">ID-MARK</text>
  <text x="165" y="46" font-family="sans-serif" font-size="12" fill="#a1a1aa">VECTOR</text>
</svg>
\`\`\`

- **Primary Canvas Tone:** Pure Onyx (\`#09090b\`)
- **High-Contrast Mark:** Optical White (\`#ffffff\`)
- **Kinetic Accent:** Signal Green (\`#22c55e\`)
- **Typography Scale:** Inter 600 / JetBrains Mono 700`;
          }

          const assistantMsg: ChatMessage = {
            id: `ast-${Date.now()}`,
            projectId: activeProjectId,
            stageId: activeStageId,
            sender: 'assistant',
            content: assistantContent,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedActions: isArabic ? [
              { label: 'إضافة إلى لوحة المواصفات', action: 'append_spec' },
              { label: 'توليد اختبارات التحقق', action: 'gen_assertions' },
              { label: 'تصدير سجل المراجعة', action: 'export_audit' },
            ] : [
              { label: 'Append to Spec Canvas', action: 'append_spec' },
              { label: 'Generate Unit Assertions', action: 'gen_assertions' },
              { label: 'Export Audit Log', action: 'export_audit' },
            ],
          };

          set((state) => ({
            chatMessages: {
              ...state.chatMessages,
              [chatKey]: [...(state.chatMessages[chatKey] || []), assistantMsg],
            },
            isGeneratingSpec: false,
          }));
        }, 700);
      },

      quickGenerateForActiveStage: (promptType) => {
        const { sendChatMessage, activeStageId, locale } = get();
        const isArabic = locale === 'ar';
        if (activeStageId === 'logo') {
          sendChatMessage(isArabic 
            ? 'توليد شعار متجهي SVG محسوب رياضياً مع منظومة ألوان الوضع الليلي وتسلسل الخطوط.'
            : 'Generate mathematical vector SVG logomark with dark mode palette tokens and font hierarchy.');
          return;
        }

        const promptsEn: Record<string, string> = {
          schema: 'Generate OpenAPI 3.1 specification schema with strict validation rules and error response definitions.',
          security: 'Perform a threat boundary analysis and define OAuth 2.1 authorization scopes with mTLS requirements.',
          perf: 'Draft k6 high-concurrency performance benchmark scenarios targeting 20,000 requests per second.',
          figma: 'Extract design tokens (spacing, typography, monochrome palette) into Figma Tokens JSON format.',
          ci: 'Generate hardened GitHub Actions CI/CD workflow pipeline with static security scanning and Trivy container audit.',
        };
        const promptsAr: Record<string, string> = {
          schema: 'توليد مخطط مواصفة OpenAPI 3.1 مع قواعد التحقق الدقيقة وتعاريف استجابات الأخطاء.',
          security: 'إجراء تحليل حدود التهديدات وتحديد نطاقات تصريح OAuth 2.1 مع متطلبات mTLS.',
          perf: 'إعداد سيناريوهات فحص الأداء العالي k6 مستهدفة 20,000 طلب في الثانية.',
          figma: 'استخراج توكنات التصميم (المسافات، الخطوط، الألوان الأحادية) بصيغة Figma Tokens JSON.',
          ci: 'توليد مسار عمل GitHub Actions CI/CD مع الفحص الأمني الثابت وتدقيق الحاويات عبر Trivy.',
        };
        const p = isArabic ? promptsAr : promptsEn;
        sendChatMessage(p[promptType] || (isArabic ? 'تحليل مواصفات المرحلة الحالية وتحديد مسارات التحسين.' : 'Analyze current stage specifications and identify optimization vectors.'));
      },
    }),
    {
      name: 'monospec-universal-storage-v2',
      partialize: (state) => ({
        activeView: state.activeView,
        locale: state.locale,
        accountType: state.accountType,
        workspace: state.workspace,
        userSession: state.userSession,
        companies: state.companies,
        projects: state.projects,
        activeProjectId: state.activeProjectId,
        activeStageId: state.activeStageId,
        customStages: state.customStages,
        selectedStageIds: state.selectedStageIds,
        ingestedSources: state.ingestedSources,
        chatMessages: state.chatMessages,
        selectedCompanyFilter: state.selectedCompanyFilter,
        canvasViewMode: state.canvasViewMode,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

export type CompanyId = string;

export interface Company {
  id: CompanyId;
  name: string;
  nameAr?: string;
  tagline?: string;
  code: string;
  industry?: string;
  logoUrl?: string;
  isCustom?: boolean;
  websiteUrl?: string;
  type?: 'enterprise' | 'freelancer_site';
}

export type StageId =
  | 'tech_analysis'
  | 'logo'
  | 'ui_ux'
  | 'engineering'
  | 'qa_testing'
  | 'content'
  | 'devops'
  | string;

export interface StageDefinition {
  id: StageId;
  index: number;
  labelEn: string;
  labelAr: string;
  shortDesc: string;
  shortDescAr?: string;
  badge: string;
  iconName?: string;
  isRecommended?: boolean;
}

export interface SpecSection {
  id: string;
  title: string;
  contentMarkdown: string;
  lastUpdated: string;
  author: string;
  status: 'draft' | 'in_review' | 'approved' | 'deprecated';
}

export interface StageDeliverable {
  stageId: StageId;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  progress: number; // 0 - 100
  specTitle: string;
  specMarkdown: string;
  checklist: { id: string; text: string; done: boolean }[];
  updatedAt: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  companyId: CompanyId;
  description: string;
  activeStageId: StageId;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'archived' | 'review';
  architectureTier: 'Tier 1 Enterprise' | 'Core Platform' | 'Mission Critical';
  figmaUrl?: string;
  demoUrl?: string;
  stages: Record<string, StageDeliverable>;
}

export interface ChatMessage {
  id: string;
  projectId: string;
  stageId: StageId;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
  codeSnippets?: { language: string; filename?: string; code: string }[];
  attachment?: {
    name: string;
    type: 'pdf' | 'drive' | 'link' | 'file';
    url?: string;
    analysisSummary?: string;
  };
}

export interface TeamWorkspace {
  id: string;
  name: string;
  roomCode: string; // Unique room code for team access
  description?: string;
  createdAt: string;
  membersCount: number;
  inviteLink?: string;
}

export type Locale = 'ar' | 'en';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  workspaceId: string;
  isAuthenticated: boolean;
  avatarUrl?: string;
  accountType?: 'enterprise' | 'freelancer';
  bio?: string;
}

export interface IngestedSource {
  id: string;
  type: 'pdf' | 'drive' | 'url' | 'raw_text';
  name: string;
  size?: string;
  url?: string;
  pageCount?: number;
  uploadedAt: string;
  companyId?: string;
  status: 'analyzing' | 'parsed' | 'trained' | 'error';
  extractedInsights?: {
    summary: string;
    architectureType?: string;
    keyRequirements: string[];
    complianceFlags: string[];
    tokenCount: number;
    entitiesDetected: string[];
  };
}

export type ThemeMode = 'dark' | 'light' | 'system';

export * from './database.types';



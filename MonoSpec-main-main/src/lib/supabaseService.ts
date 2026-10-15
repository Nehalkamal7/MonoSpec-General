import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';
import {
  CompanyRow,
  CompanyCode,
  ProjectRow,
  ProjectInsert,
  ProjectUpdate,
  ProjectWithRelations,
  ProjectChatRow,
  ProjectChatInsert,
  ProjectChatStage,
  ChatMessageItem,
  TrainingDatasetRow,
  TrainingDatasetInsert,
  TrainingDatasetUpdate,
} from '@/types/database.types';

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

// ==============================================================================
// LOCAL IN-MEMORY MOCK STORE FOR OFFLINE / INITIAL DEV DEMONSTRATION
// ==============================================================================
let mockCompanies: CompanyRow[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    code: 'awamer',
    name: 'Awamer Alshabaka',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    code: 'creative_system',
    name: 'Creative System',
    created_at: '2026-09-01T08:00:00Z',
  },
];

let mockProjects: ProjectRow[] = [
  {
    id: '44444444-4444-4444-4444-444444444441',
    company_id: '11111111-1111-1111-1111-111111111111',
    title: 'B2B Logistics & Freight Platform',
    raw_brief: 'Autonomous freight brokerage orchestration, real-time fleet GPS tracking, and customs clearance engine.',
    figma_file_url: 'https://figma.com/@monospec/awm-freight-design-system',
    demo_preview_url: 'https://freight.awamer.internal',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: '44444444-4444-4444-4444-444444444442',
    company_id: '22222222-2222-2222-2222-222222222222',
    title: 'FinTech Digital Wallet & POS SDK',
    raw_brief: 'EMV Level 2 contactless kernel, soft-POS tap-on-phone payment gateway with sub-second terminal processing.',
    figma_file_url: 'https://figma.com/@creativesystem/softpos-sdk',
    demo_preview_url: 'https://wallet.creativesystem.io',
    created_at: '2026-09-18T10:00:00Z',
  },
];

let mockChats: ProjectChatRow[] = [
  {
    id: 'chat-01',
    project_id: '44444444-4444-4444-4444-444444444441',
    stage: 'technical_analysis',
    messages: [
      {
        id: 'msg-01',
        sender: 'assistant',
        content: 'System topology verified for B2B Logistics with Kafka and Redis idempotency locks.',
        timestamp: '11:20 AM',
      },
    ],
    updated_at: '2026-10-14T11:20:00Z',
  },
];

let mockTrainingDatasets: TrainingDatasetRow[] = [
  {
    id: '33333333-3333-3333-3333-333333333331',
    company_id: '11111111-1111-1111-1111-111111111111',
    project_title: 'B2B Freight Brokerage & Telemetry Architecture',
    scope_description: 'Autonomous logistics orchestration and customs declaration engine for 14,000+ carriers with ZATCA Phase-2 compliance.',
    technical_analysis: 'System topology with Kafka event streaming, partitioned PostgreSQL with PostGIS, and Redis distributed idempotency locks.',
    figma_reference_url: 'https://figma.com/@monospec/awm-freight-design-system',
    demo_app_url: 'https://freight.awamer.internal',
    metadata: { tier: 'Tier 1 Enterprise', target_throughput_rps: 18500 },
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: '33333333-3333-3333-3333-333333333332',
    company_id: '22222222-2222-2222-2222-222222222222',
    project_title: 'SoftPOS Tap-on-Phone Cryptographic Kernel',
    scope_description: 'PCI-CPoC compliant contactless terminal engine with DUKPT key derivation and hardware Keystore attestation.',
    technical_analysis: 'Sub-80ms transaction settlement via WebAssembly Rust ISO-8583 message serialization and multi-region sovereign cluster.',
    figma_reference_url: 'https://figma.com/@creativesystem/softpos-sdk',
    demo_app_url: 'https://wallet.creativesystem.io',
    metadata: { tier: 'Mission Critical', target_throughput_rps: 25000 },
    created_at: '2026-09-18T10:00:00Z',
  },
];

// ==============================================================================
// 1. COMPANIES CRUD OPERATIONS
// ==============================================================================

export async function listCompanies(): Promise<ServiceResult<CompanyRow[]>> {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured || !client) {
    return { data: mockCompanies, error: null };
  }

  try {
    const { data, error } = await client
      .from('companies')
      .select('*')
      .order('name', { ascending: true });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Unknown error listing companies' };
  }
}

export async function getCompanyByCode(code: CompanyCode): Promise<ServiceResult<CompanyRow>> {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured || !client) {
    const comp = mockCompanies.find((c) => c.code === code) || null;
    return { data: comp, error: comp ? null : `Company with code ${code} not found` };
  }

  try {
    const { data, error } = await client
      .from('companies')
      .select('*')
      .eq('code', code)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

export async function getCompanyById(id: string): Promise<ServiceResult<CompanyRow>> {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured || !client) {
    const comp = mockCompanies.find((c) => c.id === id) || null;
    return { data: comp, error: comp ? null : `Company with id ${id} not found` };
  }

  try {
    const { data, error } = await client
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

// ==============================================================================
// 2. PROJECTS CRUD OPERATIONS
// ==============================================================================

export async function listProjects(filter?: {
  companyId?: string;
  search?: string;
}): Promise<ServiceResult<ProjectRow[]>> {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured || !client) {
    let result = [...mockProjects];
    if (filter?.companyId) {
      result = result.filter((p) => p.company_id === filter.companyId);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.raw_brief.toLowerCase().includes(q)
      );
    }
    return { data: result, error: null };
  }

  try {
    let query = client.from('projects').select('*').order('created_at', { ascending: false });

    if (filter?.companyId) {
      query = query.eq('company_id', filter.companyId);
    }
    if (filter?.search) {
      query = query.ilike('title', `%${filter.search}%`);
    }

    const { data, error } = await query;
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

export async function getProjectById(id: string): Promise<ServiceResult<ProjectRow>> {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured || !client) {
    const proj = mockProjects.find((p) => p.id === id) || null;
    return { data: proj, error: proj ? null : `Project ${id} not found` };
  }

  try {
    const { data, error } = await client.from('projects').select('*').eq('id', id).single();
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

export async function getProjectWithRelations(id: string): Promise<ServiceResult<ProjectWithRelations>> {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured || !client) {
    const proj = mockProjects.find((p) => p.id === id);
    if (!proj) return { data: null, error: `Project ${id} not found` };
    const comp = mockCompanies.find((c) => c.id === proj.company_id);
    const chats = mockChats.filter((c) => c.project_id === proj.id);
    return { data: { ...proj, company: comp, chats }, error: null };
  }

  try {
    const { data: project, error: projError } = await client
      .from('projects')
      .select('*, company:companies(*), chats:project_chats(*)')
      .eq('id', id)
      .single();

    if (projError) return { data: null, error: projError.message };
    return { data: project as unknown as ProjectWithRelations, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

export async function createProject(project: ProjectInsert): Promise<ServiceResult<ProjectRow>> {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured || !client) {
    const newProject: ProjectRow = {
      id: project.id || `proj-${Date.now().toString(36)}`,
      company_id: project.company_id,
      title: project.title,
      raw_brief: project.raw_brief,
      figma_file_url: project.figma_file_url ?? null,
      demo_preview_url: project.demo_preview_url ?? null,
      created_at: new Date().toISOString(),
    };
    mockProjects = [newProject, ...mockProjects];
    return { data: newProject, error: null };
  }

  try {
    const { data, error } = await client.from('projects').insert(project).select().single();
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

export async function updateProject(
  id: string,
  updates: ProjectUpdate
): Promise<ServiceResult<ProjectRow>> {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured || !client) {
    const index = mockProjects.findIndex((p) => p.id === id);
    if (index === -1) return { data: null, error: `Project ${id} not found` };
    mockProjects[index] = { ...mockProjects[index], ...updates };
    return { data: mockProjects[index], error: null };
  }

  try {
    const { data, error } = await client
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

export async function deleteProject(id: string): Promise<ServiceResult<boolean>> {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured || !client) {
    mockProjects = mockProjects.filter((p) => p.id !== id);
    mockChats = mockChats.filter((c) => c.project_id !== id);
    return { data: true, error: null };
  }

  try {
    const { error } = await client.from('projects').delete().eq('id', id);
    if (error) return { data: false, error: error.message };
    return { data: true, error: null };
  } catch (err: any) {
    return { data: false, error: err.message };
  }
}

// ==============================================================================
// 3. PROJECT CHATS CRUD OPERATIONS
// ==============================================================================

export async function getProjectChat(
  projectId: string,
  stage: ProjectChatStage
): Promise<ServiceResult<ProjectChatRow>> {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured || !client) {
    const chat = mockChats.find((c) => c.project_id === projectId && c.stage === stage) || null;
    return { data: chat, error: null };
  }

  try {
    const { data, error } = await client
      .from('project_chats')
      .select('*')
      .eq('project_id', projectId)
      .eq('stage', stage)
      .maybeSingle();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

export async function listProjectChats(projectId: string): Promise<ServiceResult<ProjectChatRow[]>> {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured || !client) {
    const chats = mockChats.filter((c) => c.project_id === projectId);
    return { data: chats, error: null };
  }

  try {
    const { data, error } = await client
      .from('project_chats')
      .select('*')
      .eq('project_id', projectId);

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

export async function upsertProjectChat(
  chat: ProjectChatInsert
): Promise<ServiceResult<ProjectChatRow>> {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured || !client) {
    const index = mockChats.findIndex(
      (c) => c.project_id === chat.project_id && c.stage === chat.stage
    );
    const updated: ProjectChatRow = {
      id: chat.id || (index >= 0 ? mockChats[index].id : `chat-${Date.now()}`),
      project_id: chat.project_id,
      stage: chat.stage,
      messages: chat.messages ?? [],
      updated_at: new Date().toISOString(),
    };
    if (index >= 0) {
      mockChats[index] = updated;
    } else {
      mockChats.push(updated);
    }
    return { data: updated, error: null };
  }

  try {
    const { data, error } = await client
      .from('project_chats')
      .upsert(chat, { onConflict: 'project_id,stage' })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

export async function appendChatMessage(
  projectId: string,
  stage: ProjectChatStage,
  message: ChatMessageItem
): Promise<ServiceResult<ProjectChatRow>> {
  // First retrieve existing chat
  const { data: existingChat, error } = await getProjectChat(projectId, stage);
  if (error) return { data: null, error };

  const currentMessages = (Array.isArray(existingChat?.messages)
    ? (existingChat.messages as unknown as ChatMessageItem[])
    : []) as ChatMessageItem[];

  const updatedMessages = [...currentMessages, message];

  return upsertProjectChat({
    project_id: projectId,
    stage,
    messages: updatedMessages as any,
  });
}

export async function deleteProjectChat(
  projectId: string,
  stage: ProjectChatStage
): Promise<ServiceResult<boolean>> {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured || !client) {
    mockChats = mockChats.filter(
      (c) => !(c.project_id === projectId && c.stage === stage)
    );
    return { data: true, error: null };
  }

  try {
    const { error } = await client
      .from('project_chats')
      .delete()
      .eq('project_id', projectId)
      .eq('stage', stage);

    if (error) return { data: false, error: error.message };
    return { data: true, error: null };
  } catch (err: any) {
    return { data: false, error: err.message };
  }
}

export async function deleteChatMessage(
  projectId: string,
  stage: ProjectChatStage,
  messageId: string
): Promise<ServiceResult<ProjectChatRow | null>> {
  const { data: existingChat, error } = await getProjectChat(projectId, stage);
  if (error || !existingChat) return { data: null, error };

  const currentMessages = (Array.isArray(existingChat.messages)
    ? (existingChat.messages as unknown as ChatMessageItem[])
    : []) as ChatMessageItem[];

  const updatedMessages = currentMessages.filter((m) => m.id !== messageId);

  return upsertProjectChat({
    project_id: projectId,
    stage,
    messages: updatedMessages as any,
  });
}

// ==============================================================================
// 4. TRAINING DATASETS CRUD OPERATIONS
// ==============================================================================

export async function listTrainingDatasets(filter?: {
  companyId?: string;
  search?: string;
}): Promise<ServiceResult<TrainingDatasetRow[]>> {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured || !client) {
    let result = [...mockTrainingDatasets];
    if (filter?.companyId) {
      result = result.filter((d) => d.company_id === filter.companyId);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (d) =>
          d.project_title.toLowerCase().includes(q) ||
          d.scope_description.toLowerCase().includes(q) ||
          d.technical_analysis.toLowerCase().includes(q)
      );
    }
    return { data: result, error: null };
  }

  try {
    let query = client
      .from('training_datasets')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter?.companyId) {
      query = query.eq('company_id', filter.companyId);
    }
    if (filter?.search) {
      query = query.ilike('project_title', `%${filter.search}%`);
    }

    const { data, error } = await query;
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

export async function getTrainingDatasetById(id: string): Promise<ServiceResult<TrainingDatasetRow>> {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured || !client) {
    const ds = mockTrainingDatasets.find((d) => d.id === id) || null;
    return { data: ds, error: ds ? null : `Training dataset ${id} not found` };
  }

  try {
    const { data, error } = await client
      .from('training_datasets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

export async function createTrainingDataset(
  dataset: TrainingDatasetInsert
): Promise<ServiceResult<TrainingDatasetRow>> {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured || !client) {
    const newDataset: TrainingDatasetRow = {
      id: dataset.id || `ds-${Date.now().toString(36)}`,
      company_id: dataset.company_id,
      project_title: dataset.project_title,
      scope_description: dataset.scope_description,
      technical_analysis: dataset.technical_analysis,
      figma_reference_url: dataset.figma_reference_url ?? null,
      demo_app_url: dataset.demo_app_url ?? null,
      metadata: dataset.metadata ?? {},
      created_at: new Date().toISOString(),
    };
    mockTrainingDatasets = [newDataset, ...mockTrainingDatasets];
    return { data: newDataset, error: null };
  }

  try {
    const { data, error } = await client
      .from('training_datasets')
      .insert(dataset)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

export async function updateTrainingDataset(
  id: string,
  updates: TrainingDatasetUpdate
): Promise<ServiceResult<TrainingDatasetRow>> {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured || !client) {
    const index = mockTrainingDatasets.findIndex((d) => d.id === id);
    if (index === -1) return { data: null, error: `Training dataset ${id} not found` };
    mockTrainingDatasets[index] = { ...mockTrainingDatasets[index], ...updates };
    return { data: mockTrainingDatasets[index], error: null };
  }

  try {
    const { data, error } = await client
      .from('training_datasets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

export async function deleteTrainingDataset(id: string): Promise<ServiceResult<boolean>> {
  const client = getSupabaseClient();
  if (!isSupabaseConfigured || !client) {
    mockTrainingDatasets = mockTrainingDatasets.filter((d) => d.id !== id);
    return { data: true, error: null };
  }

  try {
    const { error } = await client.from('training_datasets').delete().eq('id', id);
    if (error) return { data: false, error: error.message };
    return { data: true, error: null };
  } catch (err: any) {
    return { data: false, error: err.message };
  }
}

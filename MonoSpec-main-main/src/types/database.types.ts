export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type CompanyCode = 'awamer' | 'creative_system' | string;

export type ProjectChatStage =
  | 'technical_analysis'
  | 'logo_branding'
  | 'ui_ux_design'
  | 'software_engineering'
  | 'qa_testing'
  | 'content_strategy'
  | 'technical_support';

export interface ChatMessageItem {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
  codeSnippets?: { language: string; filename?: string; code: string }[];
}

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          code: CompanyCode;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: CompanyCode;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: CompanyCode;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      training_datasets: {
        Row: {
          id: string;
          company_id: string;
          project_title: string;
          scope_description: string;
          technical_analysis: string;
          figma_reference_url: string | null;
          demo_app_url: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          project_title: string;
          scope_description: string;
          technical_analysis: string;
          figma_reference_url?: string | null;
          demo_app_url?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          project_title?: string;
          scope_description?: string;
          technical_analysis?: string;
          figma_reference_url?: string | null;
          demo_app_url?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'training_datasets_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          }
        ];
      };
      projects: {
        Row: {
          id: string;
          company_id: string;
          title: string;
          raw_brief: string;
          figma_file_url: string | null;
          demo_preview_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          title: string;
          raw_brief: string;
          figma_file_url?: string | null;
          demo_preview_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          title?: string;
          raw_brief?: string;
          figma_file_url?: string | null;
          demo_preview_url?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'projects_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          }
        ];
      };
      project_chats: {
        Row: {
          id: string;
          project_id: string;
          stage: ProjectChatStage;
          messages: Json; // Parsable as ChatMessageItem[]
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          stage: ProjectChatStage;
          messages?: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          stage?: ProjectChatStage;
          messages?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_chats_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      company_code: CompanyCode;
      project_chat_stage: ProjectChatStage;
    };
    CompositeTypes: { [_ in never]: never };
  };
}

// Convenient Row, Insert, and Update Type Shortcuts
export type CompanyRow = Database['public']['Tables']['companies']['Row'];
export type CompanyInsert = Database['public']['Tables']['companies']['Insert'];
export type CompanyUpdate = Database['public']['Tables']['companies']['Update'];

export type TrainingDatasetRow = Database['public']['Tables']['training_datasets']['Row'];
export type TrainingDatasetInsert = Database['public']['Tables']['training_datasets']['Insert'];
export type TrainingDatasetUpdate = Database['public']['Tables']['training_datasets']['Update'];

export type ProjectRow = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export type ProjectChatRow = Database['public']['Tables']['project_chats']['Row'];
export type ProjectChatInsert = Database['public']['Tables']['project_chats']['Insert'];
export type ProjectChatUpdate = Database['public']['Tables']['project_chats']['Update'];

// Extended Project with its related Company and stage chats
export interface ProjectWithRelations extends ProjectRow {
  company?: CompanyRow;
  chats?: ProjectChatRow[];
}

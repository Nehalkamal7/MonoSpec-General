import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
);

let cachedClient: SupabaseClient<Database> | null = null;

/**
 * Creates and returns the typed Supabase client for MonoSpec.
 * Reuses the singleton instance across client-side executions.
 */
export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (typeof window === 'undefined') {
    // Server-side context: Return fresh instance if environment variables are populated
    if (supabaseUrl && supabaseAnonKey) {
      try {
        return createClient<Database>(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: false,
          },
        });
      } catch (err) {
        console.warn('[MonoSpec Supabase] Server initialization warning:', err);
        return null;
      }
    }
    return null;
  }

  // Client-side singleton
  if (cachedClient) {
    return cachedClient;
  }

  if (supabaseUrl && supabaseAnonKey) {
    try {
      cachedClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
      return cachedClient;
    } catch (err) {
      console.warn('[MonoSpec Supabase] Client initialization warning:', err);
    }
  }

  return null;
}

/**
 * Factory function for custom or authenticated server-side Supabase client instances.
 */
export function createCustomSupabaseClient(
  url?: string,
  key?: string
): SupabaseClient<Database> | null {
  const targetUrl = url || supabaseUrl;
  const targetKey = key || supabaseAnonKey;

  if (!targetUrl || !targetKey) return null;

  return createClient<Database>(targetUrl, targetKey, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Default exported client instance for direct imports.
 * Falls back to null when environment variables are not set.
 */
export const supabaseClient = getSupabaseClient();

// Re-export complete CRUD server-side utilities for projects, chats, training datasets, and companies
export * from './supabaseService';

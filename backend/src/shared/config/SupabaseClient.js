/**
 * @fileoverview Supabase client configuration for Auth (Class-based).
 * @module shared/config/SupabaseClient
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Singleton class for Supabase Client.
 */
class SupabaseClient {
  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase URL or Anon Key in environment variables');
    }

    this.client = createClient(supabaseUrl, supabaseAnonKey);
  }

  /**
   * Get the Supabase client instance.
   */
  getClient() {
    return this.client;
  }
}

export default new SupabaseClient().getClient();

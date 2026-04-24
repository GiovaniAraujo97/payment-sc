import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseClientService {
  private readonly client: SupabaseClient | null;

  constructor() {
    const url = environment.supabase?.url?.trim();
    const anonKey = environment.supabase?.anonKey?.trim();

    if (!url || !anonKey) {
      this.client = null;
      return;
    }

    this.client = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  isConfigured(): boolean {
    return this.client !== null;
  }

  getClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase nao configurado. Defina environment.supabase.url e environment.supabase.anonKey.');
    }

    return this.client;
  }
}

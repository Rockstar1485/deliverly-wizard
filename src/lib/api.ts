import { supabase } from './supabase';
import type { Database } from './database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type EmailList = Database['public']['Tables']['email_lists']['Row'];
type EmailVerification = Database['public']['Tables']['email_verifications']['Row'];

// Profile API
export const profileApi = {
  async getProfile(): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .single();
      
    if (error) throw error;
    return data;
  },

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
};

// Email Lists API
export const emailListsApi = {
  async getLists(): Promise<EmailList[]> {
    const { data, error } = await supabase
      .from('email_lists')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  },

  async createList(name: string, description?: string): Promise<EmailList> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('email_lists')
      .insert({
        name,
        description,
        user_id: user.id
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async updateList(id: string, updates: Partial<EmailList>): Promise<EmailList> {
    const { data, error } = await supabase
      .from('email_lists')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async deleteList(id: string): Promise<void> {
    const { error } = await supabase
      .from('email_lists')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  }
};

// Email Verification API
export const emailVerificationApi = {
  async getVerifications(listId?: string): Promise<EmailVerification[]> {
    let query = supabase
      .from('email_verifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (listId) {
      query = query.eq('list_id', listId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async verifyEmail(email: string, listId?: string): Promise<EmailVerification> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // This would typically call your email verification service
    // For now, we'll create a mock verification result
    const verificationResult = {
      email,
      status: 'valid' as const,
      verification_details: {
        smtp_valid: true,
        domain_valid: true,
        mx_records: true,
        risk_score: 0.1
      },
      list_id: listId || null,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('email_verifications')
      .insert(verificationResult)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async bulkVerifyEmails(emails: string[], listId?: string): Promise<EmailVerification[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const verifications = emails.map(email => ({
      email,
      status: 'valid' as const, // Mock status
      verification_details: {
        smtp_valid: true,
        domain_valid: true,
        mx_records: true,
        risk_score: Math.random() * 0.3
      },
      list_id: listId || null,
      user_id: user.id
    }));

    const { data, error } = await supabase
      .from('email_verifications')
      .insert(verifications)
      .select();
      
    if (error) throw error;
    return data || [];
  }
};
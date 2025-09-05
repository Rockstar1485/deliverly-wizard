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

// CSV Validation Job API
export async function createJob(file: File): Promise<{ job_id: string }> {
  // Mock implementation - in real app, this would upload the file and create a job
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Store job data in localStorage for demo purposes
  const jobData = {
    id: jobId,
    state: 'queued',
    processed: 0,
    total: null,
    started_at: Date.now() / 1000,
    finished_at: null,
    file_name: file.name,
    file_size: file.size,
    preview: []
  };
  
  localStorage.setItem(`job_${jobId}`, JSON.stringify(jobData));
  
  return { job_id: jobId };
}

export async function getJob(jobId: string): Promise<any> {
  // Mock implementation - get job from localStorage
  const jobData = localStorage.getItem(`job_${jobId}`);
  if (!jobData) {
    throw new Error('Job not found');
  }
  
  const job = JSON.parse(jobData);
  
  // Simulate job progression
  if (job.state === 'queued') {
    job.state = 'processing';
    job.total = 100; // Mock total
    localStorage.setItem(`job_${jobId}`, JSON.stringify(job));
  } else if (job.state === 'processing' && job.processed < job.total) {
    job.processed = Math.min(job.processed + Math.floor(Math.random() * 10) + 1, job.total);
    if (job.processed >= job.total) {
      job.state = 'finished';
      job.finished_at = Date.now() / 1000;
    }
    localStorage.setItem(`job_${jobId}`, JSON.stringify(job));
  }
  
  return job;
}

export async function getResults(jobId: string): Promise<{ results: any[] }> {
  // Mock results data
  const mockResults = Array.from({ length: 100 }, (_, i) => ({
    email: `user${i}@example.com`,
    status: ['deliverable', 'undeliverable', 'risky'][Math.floor(Math.random() * 3)],
    first_name: `John${i}`,
    last_name: `Doe${i}`,
    company: `Company ${i}`,
    risk_score: Math.random(),
  }));
  
  return { results: mockResults };
}

export async function getSummary(jobId: string): Promise<any> {
  // Mock summary data
  return {
    total: 100,
    deliverable: 75,
    undeliverable: 15,
    risky: 8,
    unknown: 2,
  };
}

export function exportCsvUrl(jobId: string): string {
  // Mock export URL - in real app, this would be an API endpoint
  return `data:text/csv;charset=utf-8,Email,Status,Name,Company\nuser@example.com,deliverable,John Doe,Example Corp`;
}

export function exportJsonUrl(jobId: string): string {
  // Mock export URL - in real app, this would be an API endpoint
  return `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify([
    { email: 'user@example.com', status: 'deliverable', name: 'John Doe', company: 'Example Corp' }
  ]))}`;
}
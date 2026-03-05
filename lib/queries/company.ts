import { createClient } from '@/lib/supabase/server';
import type { CompanySettings } from '@/types/company';

/**
 * Get the company settings (single record).
 * Falls back to default values if no record exists.
 */
export async function getCompanySettings(): Promise<CompanySettings> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('company_settings')
    .select('*')
    .limit(1)
    .single();

  if (error || !data) {
    console.error('Error fetching company settings:', error);
    // Return sensible defaults
    return {
      id: '',
      company_name: 'Instituto Plenum Brasil',
      address: null,
      phones: [],
      emails: [],
      website: null,
      cancellation_policy: null,
      payment_info: {},
      logo_url: null,
      logo_dark_url: null,
      updated_at: new Date().toISOString(),
    };
  }

  return data as unknown as CompanySettings;
}

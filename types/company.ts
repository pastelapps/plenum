// =============================================================
// Company Settings Types
// =============================================================

export interface PhoneEntry {
  label: string;  // "Comercial", "WhatsApp", etc.
  number: string; // "+55 31 99999-0000"
}

export interface EmailEntry {
  label: string;  // "Contato", "Suporte", etc.
  email: string;  // "contato@plenumbrasil.com.br"
}

export interface PaymentInfo {
  pix_key?: string;
  bank_name?: string;
  agency?: string;
  account?: string;
  cnpj?: string;
  company_legal_name?: string;
  [key: string]: string | undefined;
}

export interface CompanySettings {
  id: string;
  company_name: string;
  address: string | null;
  phones: PhoneEntry[];
  emails: EmailEntry[];
  website: string | null;
  cancellation_policy: string | null;
  payment_info: PaymentInfo;
  logo_url: string | null;
  logo_dark_url: string | null;
  updated_at: string;
}

// Update type (all fields optional)
export type CompanySettingsUpdate = Partial<Omit<CompanySettings, 'id'>>;

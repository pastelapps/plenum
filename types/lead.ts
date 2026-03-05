// =============================================================
// Lead Types
// =============================================================

export type FormType = 'folder' | 'in_company' | 'notification';

export interface Lead {
  id: string;
  course_id: string | null;
  course_date_id: string | null;
  form_type: FormType;
  nome: string;
  email: string | null;
  whatsapp: string | null;
  estado: string | null;
  cidade: string | null;
  orgao: string | null;
  created_at: string;
}

// Insert type (what the frontend sends)
export type LeadInsert = Omit<Lead, 'id' | 'created_at'>;

// For the folder form
export interface FolderFormData {
  nome: string;
  email: string;
  whatsapp: string;
  estado: string;
  cidade: string;
  orgao?: string;
}

// For the in-company form
export interface InCompanyFormData {
  nome: string;
  email: string;
  whatsapp: string;
  orgao: string;
  estado?: string;
  cidade?: string;
}

// For the notification form (simple)
export interface NotificationFormData {
  nome: string;
  email: string;
  whatsapp?: string;
}

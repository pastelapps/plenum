/**
 * Static configuration for PDF generation.
 * Edit these values with your actual image URLs and payment data.
 */

/**
 * Static promotional images used in the Gallery / Kit page.
 * These images appear identically in every generated PDF.
 * Set the URLs to images hosted in your Supabase Storage or CDN.
 */
export const STATIC_PDF_IMAGES = {
  /** Event banner — the "Notória Especialização" photo collage. */
  eventBanner: '' as string,
  /** Kit Participante — photo of the course material / book. */
  kitParticipant: '' as string,
};

/**
 * Payment/banking data shown on the Investimento page.
 * Only rows with non-empty `value` are rendered.
 */
export const PAYMENT_INFO: { label: string; value: string }[] = [
  { label: 'Banco',    value: 'Banco do Brasil' },
  { label: 'Agência',  value: '' },
  { label: 'Conta',    value: '' },
  { label: 'CNPJ',     value: '' },
  { label: 'PIX',      value: '' },
];

/**
 * Cancellation policy text shown at the bottom of the Investimento page.
 * Overridden by company_settings.cancellation_policy from the database if set.
 */
export const CANCELLATION_POLICY =
  'Cancelamento gratuito até 7 dias antes do início do curso. ' +
  'Após esse prazo, será retido 20% do valor da inscrição.';

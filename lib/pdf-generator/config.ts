/**
 * Static configuration for PDF generation.
 * Edit these values with your actual image URLs and payment data.
 */

/**
 * Static promotional images used in the Gallery / Kit page.
 * These images appear identically in every generated PDF.
 */
export const STATIC_PDF_IMAGES = {
  /** 5 event photos — rendered as a 3+2 mosaic in the "Fotos do Evento" section. */
  eventPhotos: [
    'https://jyackmnjhsdllfqqxund.supabase.co/storage/v1/object/public/course-covers/fotos%20do%20pdf/1.png',
    'https://jyackmnjhsdllfqqxund.supabase.co/storage/v1/object/public/course-covers/fotos%20do%20pdf/2.png',
    'https://jyackmnjhsdllfqqxund.supabase.co/storage/v1/object/public/course-covers/fotos%20do%20pdf/3.png',
    'https://jyackmnjhsdllfqqxund.supabase.co/storage/v1/object/public/course-covers/fotos%20do%20pdf/4.png',
    'https://jyackmnjhsdllfqqxund.supabase.co/storage/v1/object/public/course-covers/fotos%20do%20pdf/5.png',
  ] as string[],

  /** Kit Participante — photo of the course gift / brinde (mochila). */
  kitParticipant: 'https://jyackmnjhsdllfqqxund.supabase.co/storage/v1/object/public/course-covers/products/gestao-de-projetos-do-zero-ao-avancado-product-1772678267630.png',

  /** Plenum logo — used as static fallback in the closing page footer. */
  logoUrl: 'https://jyackmnjhsdllfqqxund.supabase.co/storage/v1/object/public/course-covers/fotos%20do%20pdf/logo-plenum-aberta2.png',
} as const;

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

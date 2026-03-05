'use client';

import { CheckCircle2 } from 'lucide-react';
import type { IncludedItem } from '@/types/course';

// ─── Props ─────────────────────────────────────────────
export interface WorkloadPaymentProps {
  heading?: string;
  subtitle?: string;
  items: IncludedItem[];
  whatsappUrl?: string;
  backgroundImageUrl?: string;
  productImageUrl?: string;
  ctaText?: string;
}

// ─── Defaults ──────────────────────────────────────────
const defaultItems: IncludedItem[] = [
  { icon: 'CheckCircle2', text: 'Kit do aluno (Mochila, Caderno, Caneta, Squeeze, Pulseira, Apostila e Credencial)' },
  { icon: 'CheckCircle2', text: 'Coffee Break incluso em todos os dias' },
  { icon: 'CheckCircle2', text: 'Certificado de Conclusão impresso (mín. 75% de frequência)' },
  { icon: 'CheckCircle2', text: 'Material didático atualizado com as últimas normativas' },
  { icon: 'CheckCircle2', text: 'Acesso ao grupo exclusivo de networking' },
];

// ─── Component ────────────────────────────────────────
export default function WorkloadPayment({
  heading = 'Garanta sua Vaga',
  subtitle = 'Invista na sua capacitação com acesso completo aos dias\nde imersão e material de apoio exclusivo.',
  items = defaultItems,
  whatsappUrl = 'https://wa.me/553125311776?text=Olá!%20Gostaria%20de%20informações%20sobre%20o%20curso%20de%20Emendas%20Parlamentares.',
  backgroundImageUrl = '/bgvg.png',
  productImageUrl,
  ctaText = 'Falar com Consultor',
}: WorkloadPaymentProps) {
  return (
    <section id="investimento" className="relative overflow-hidden">
      {/* Gradient transition from previous section */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[var(--ds-background)] to-transparent z-20 pointer-events-none" />

      <div className={`relative ${productImageUrl ? 'min-h-[500px] md:min-h-[850px]' : 'min-h-[500px] md:min-h-[600px]'}`}>
        {/* Background image */}
        <div
          className="absolute inset-0 bg-right bg-no-repeat"
          style={{ backgroundImage: `url('${backgroundImageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />

        {/* ── Desktop: Product image — absolutely positioned, right side, full height ── */}
        {productImageUrl && (
          <div className="hidden md:flex absolute right-0 bottom-0 top-0 w-[50%] items-end justify-center z-[5] pointer-events-none pr-[3%]">
            <img
              src={productImageUrl}
              alt="Kit do curso"
              className="max-w-full h-[95%] object-contain object-bottom drop-shadow-2xl"
            />
          </div>
        )}

        <div className="relative z-10 h-full flex flex-col justify-center pt-16 pb-20 md:pt-24 md:pb-28 px-6 md:px-12">
          <div className="max-w-[1100px] mx-auto w-full">
            {/* ── Text content — left side on desktop ── */}
            <div className={productImageUrl ? 'w-full md:w-[48%]' : 'max-w-[550px]'}>

              {/* Title */}
              <h2 className="font-[var(--font-bricolage)] text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] bg-gradient-to-b from-white via-white/90 to-white/55 bg-clip-text text-transparent mb-4">
                {heading}
              </h2>

              {/* Subtitle */}
              <p className="text-white/60 text-base md:text-lg leading-relaxed mb-10">
                {subtitle.split('\n').map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </p>

              {/* Label */}
              <span className="inline-block px-4 py-1.5 rounded-full text-[var(--ds-primary)] text-[11px] uppercase font-bold tracking-widest mb-5" style={{ backgroundColor: 'var(--ds-primary-10)', borderWidth: '1px', borderColor: 'var(--ds-primary-20)' }}>
                O que está incluso
              </span>

              {/* Items */}
              <div className="flex flex-col gap-3.5 mb-8">
                {items.filter(item => item.text?.trim()).map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[var(--ds-primary)] shrink-0 mt-0.5" />
                    <span className="text-white/80 text-base md:text-lg leading-relaxed">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener"
                id="inscricao"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[var(--ds-primary)] hover:bg-[var(--ds-primary-hover)] text-white font-semibold text-sm transition-all duration-300"
                style={{ boxShadow: '0 0 30px var(--ds-primary-30)' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 40px var(--ds-primary-50)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 30px var(--ds-primary-30)'; }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {ctaText}
              </a>
            </div>

            {/* ── Mobile: Product image — in normal flow below text ── */}
            {productImageUrl && (
              <div className="mt-12 md:hidden w-full flex items-center justify-center">
                <img
                  src={productImageUrl}
                  alt="Kit do curso"
                  className="w-full object-contain drop-shadow-2xl"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

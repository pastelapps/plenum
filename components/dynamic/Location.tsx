'use client';

import { MapPin, Phone, Building2 } from 'lucide-react';
import type { LocationExtra } from '@/types/course';
import type { PhoneEntry } from '@/types/company';
import { getIcon } from '@/lib/icon-map';

// ─── Props ─────────────────────────────────────────────
export interface LocationProps {
  venue: string;
  address: string;
  mapEmbed: string;
  locationExtra?: LocationExtra[];
  phones?: PhoneEntry[];
  heading?: string;
  description?: string;
}

// ─── Component ────────────────────────────────────────
export default function Location({
  venue,
  address,
  mapEmbed,
  locationExtra = [],
  phones = [],
  heading = 'Onde vai ser',
  description = 'Um espaço de excelência preparado para receber os maiores especialistas do país com conforto e acessibilidade.',
}: LocationProps) {
  return (
    <section id="local" className="py-20 md:py-28 px-6 md:px-12 bg-[var(--ds-background-deep)] relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

          {/* Info — Left */}
          <div className="lg:w-1/2 space-y-10 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="flex items-center gap-2 uppercase tracking-widest text-sm font-semibold text-[var(--ds-primary)]">
                <MapPin className="w-4 h-4" />
                <span>Localização</span>
              </div>
              <h2 className="font-[var(--font-bricolage)] text-3xl sm:text-[42px] md:text-[52px] lg:text-[72px] font-bold tracking-tight leading-[1.05] bg-gradient-to-b from-white via-white/90 to-white/55 bg-clip-text text-transparent">
                {heading}
              </h2>
              <p className="text-white/50 text-lg leading-relaxed">
                {description}
              </p>
            </div>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-5 p-4 rounded-2xl border border-transparent bg-transparent hover:border-[var(--ds-primary-25)] hover:bg-[var(--ds-primary-6)] hover:backdrop-blur-sm transition-all duration-300 group">
                <div className="w-11 h-11 rounded-xl bg-[var(--ds-primary)] text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white mb-1">{venue}</h3>
                  <p className="text-white/45 leading-relaxed text-sm">
                    {address.split('\n').map((line, i, arr) => (
                      <span key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>

              {/* Extra location info (e.g., Hotel) */}
              {locationExtra.map((extra, i) => {
                const ExtraIcon = extra.icon ? getIcon(extra.icon) : Building2;
                return (
                  <div key={i} className="flex items-start gap-5 p-4 rounded-2xl border border-transparent bg-transparent hover:border-[var(--ds-primary-25)] hover:bg-[var(--ds-primary-6)] hover:backdrop-blur-sm transition-all duration-300 group">
                    <div className="w-11 h-11 rounded-xl bg-[var(--ds-primary)] text-white flex items-center justify-center shrink-0">
                      {ExtraIcon && <ExtraIcon className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white mb-1">{extra.label}</h3>
                      <p className="text-white/45 leading-relaxed text-sm">
                        {extra.value}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Phones */}
              {phones.length > 0 && (
                <div className="pt-4 flex flex-col sm:flex-row gap-6 border-t border-white/[0.06]">
                  {phones.map((phone, i) => (
                    <div key={i} className="flex items-center gap-4 group/phone">
                      <div className="w-10 h-10 rounded-full bg-[var(--ds-primary)] text-white flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">{phone.label}</p>
                        <a
                          href={`tel:${phone.number.replace(/\D/g, '')}`}
                          className="font-bold text-white text-base hover:text-[var(--ds-primary)] transition-colors"
                        >
                          {phone.number}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map — Right */}
          <div className="lg:w-1/2 h-[380px] lg:h-[480px] w-full rounded-3xl overflow-hidden relative border border-white/[0.08] shadow-[0_0_60px_rgba(0,0,0,0.5)] order-1 lg:order-2">
            <iframe
              src={mapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ds-background)]/60 via-transparent to-transparent pointer-events-none" style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--ds-background) 60%, transparent), transparent)' }} />
            <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
              <div className="bg-white/[0.08] backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/[0.15]">
                <p className="text-white font-bold text-sm">{venue}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

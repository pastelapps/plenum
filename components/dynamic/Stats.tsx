'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { PartnerLogo } from '@/types/course';

// ─── Props ─────────────────────────────────────────────
export interface StatsProps {
  logos: PartnerLogo[];
  heading?: string;
}

// ─── Defaults (mirror original hardcoded data) ────────
const defaultLogos: PartnerLogo[] = [
  { name: 'Órgão 1', url: '/logos/logo1.png' },
  { name: 'Órgão 2', url: '/logos/logo2.png' },
  { name: 'Órgão 3', url: '/logos/logo3.png' },
  { name: 'Órgão 4', url: '/logos/logo4.png' },
  { name: 'Órgão 5', url: '/logos/logo5.png' },
  { name: 'Órgão 6', url: '/logos/logo6.png' },
  { name: 'Órgão 7', url: '/logos/logo7.png' },
  { name: 'Órgão 8', url: '/logos/logo8.png' },
];

// ─── Component ────────────────────────────────────────
export default function Stats({
  logos = defaultLogos,
  heading = 'Instituições Que Já\nSe Capacitaram Conosco',
}: StatsProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const totalWidth = track.scrollWidth / 2;

    gsap.set(track, { x: -totalWidth });
    const tween = gsap.to(track, {
      x: 0,
      duration: 30,
      ease: 'none',
      repeat: -1,
    });

    return () => { tween.kill(); };
  }, []);

  // Split heading on newlines for <br />
  const headingLines = heading.split('\n');

  return (
    <section className="py-12 px-6 md:px-12 relative overflow-hidden bg-[var(--ds-background)]">
      {/* Neon line top */}
      <span className="absolute inset-x-0 top-0 h-px w-3/4 mx-auto" style={{ background: 'linear-gradient(to right, transparent, var(--ds-primary), transparent)' }} />
      <span className="absolute inset-x-0 top-0 h-[2px] w-1/2 mx-auto blur-sm" style={{ background: 'linear-gradient(to right, transparent, var(--ds-primary-50), transparent)' }} />
      {/* Neon line bottom */}
      <span className="absolute inset-x-0 bottom-0 h-px w-3/4 mx-auto" style={{ background: 'linear-gradient(to right, transparent, var(--ds-primary), transparent)' }} />
      <span className="absolute inset-x-0 bottom-0 h-[2px] w-1/2 mx-auto blur-sm" style={{ background: 'linear-gradient(to right, transparent, var(--ds-primary-50), transparent)' }} />

      <div className="max-w-[1200px] mx-auto w-full relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
        {/* Left — text */}
        <div className="shrink-0 w-full md:w-[320px] text-center md:text-left">
          <h3 className="font-[var(--font-bricolage)] text-xl sm:text-2xl md:text-[28px] font-extrabold tracking-tight leading-snug bg-gradient-to-b from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            {headingLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < headingLines.length - 1 && <br />}
              </span>
            ))}
          </h3>
        </div>

        {/* Right — carousel with shadow fade */}
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--ds-background)] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--ds-background)] to-transparent z-10 pointer-events-none" />

          {/* Scrolling track — duplicated for seamless loop */}
          <div ref={trackRef} className="flex items-center gap-14 w-max">
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={i}
                className="flex-shrink-0 h-10 w-28 flex items-center justify-center opacity-40 grayscale"
              >
                <img src={logo.url} alt={logo.name} className="max-h-full max-w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

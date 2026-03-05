'use client';

import Image from 'next/image';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import {
  BentoGrid,
  InverseContainerScroll,
  InverseBentoCell,
  InverseContainerScale,
} from '@/components/blocks/hero-gallery-scroll-animation';
import type { AudienceCard } from '@/types/course';
import { getIcon } from '@/lib/icon-map';

// ─── Props ─────────────────────────────────────────────
export interface BentoCell {
  src: string;
  xDir: number;
  yDir: number;
  sizes: string;
}

export interface TargetAudienceProps {
  audiences: AudienceCard[];
  heading?: string;
  subheading?: string;
  cells: BentoCell[];
}

// ─── Defaults ──────────────────────────────────────────
const defaultAudiences: AudienceCard[] = [
  { icon: 'Landmark', title: 'Prefeitos e Gestores', description: 'Líderes municipais responsáveis pela captação, direcionamento e execução final dos recursos orçamentários.' },
  { icon: 'FileSpreadsheet', title: 'Secretários de Finanças', description: 'Profissionais encarregados do planejamento financeiro e alocação estratégica de emendas na gestão local.' },
  { icon: 'Shield', title: 'Controladores e Auditores', description: 'Focados em garantir a conformidade técnica, transparência e prestação de contas alinhada aos órgãos de controle.' },
  { icon: 'User', title: 'Assessores Parlamentares', description: 'Especialistas que articulam a destinação das emendas e precisam dominar as novas regras do STF para orientação segura.' },
];

const defaultCells: BentoCell[] = [
  { src: '/imgses/photo-1498036882173-b41c28a8ba34.avif', xDir: -1, yDir: -1, sizes: '75vw' },
  { src: '/imgses/photo-1503899036084-c55cdd92da26.avif', xDir: 1, yDir: -1, sizes: '25vw' },
  { src: '/imgses/photo-1536098561742-ca998e48cbcc.avif', xDir: 1, yDir: 1, sizes: '25vw' },
  { src: '/imgses/photo-1540959733332-eab4deabeeaf.avif', xDir: -1, yDir: 1, sizes: '37vw' },
  { src: '/imgses/photo-1551641506-ee5bf4cb45f1.avif', xDir: 0, yDir: 1, sizes: '37vw' },
];

// ─── Component ────────────────────────────────────────
export default function TargetAudience({
  audiences = defaultAudiences,
  heading = 'Para quem é\nesta imersão?',
  subheading = 'Público-Alvo',
  cells = defaultCells,
}: TargetAudienceProps) {
  const headingLines = heading.split('\n');

  return (
    <InverseContainerScroll id="publico">

      {/* ── Gallery — asymmetric bento grid, cells spread out on scroll ── */}
      <BentoGrid
        variant="default"
        className="absolute inset-0 h-full gap-4 p-4 [&>div]:rounded-2xl"
      >
        {cells.map(({ src, xDir, yDir, sizes }) => (
          <InverseBentoCell key={src} xDir={xDir} yDir={yDir}>
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes={sizes}
              priority
            />
          </InverseBentoCell>
        ))}
      </BentoGrid>

      {/* ── Center content — fades in as gallery opens ── */}
      <InverseContainerScale>
        <div className="pointer-events-auto w-full max-w-[1300px]">
          <div className="text-center mb-12">
            <span className="inline-block text-sm uppercase font-semibold tracking-[0.2em] text-white/35 mb-5">
              {subheading}
            </span>
            <h2 className="font-[var(--font-bricolage)] text-3xl sm:text-5xl md:text-[72px] font-bold tracking-tight leading-[1.06] bg-gradient-to-b from-white via-white/90 to-white/55 bg-clip-text text-transparent">
              {headingLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < headingLines.length - 1 && <br />}
                </span>
              ))}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {audiences.map(({ icon, title, description }) => {
              const IconComponent = getIcon(icon);
              return (
                <div
                  key={title}
                  className="relative bg-[var(--ds-background)]/85 backdrop-blur-md border border-white/[0.09] rounded-2xl p-4 sm:p-7 md:p-9 flex flex-col gap-4 sm:gap-5"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--ds-background) 85%, transparent)' }}
                >
                  <GlowingEffect disabled={false} spread={40} proximity={60} borderWidth={1.5} />
                  <div className="w-13 h-13 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white/55">
                    {IconComponent && <IconComponent className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-white/85 text-base font-semibold leading-snug">{title}</p>
                    <p className="text-white/35 text-sm leading-relaxed mt-2">{description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </InverseContainerScale>

    </InverseContainerScroll>
  );
}

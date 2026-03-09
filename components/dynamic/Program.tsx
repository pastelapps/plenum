'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, ChevronUp } from 'lucide-react';
import ColorBends from '@/components/ColorBends';
import type { ShaderColors } from '@/types/design-system';
import { useTurma } from '@/hooks/use-turma';

// ─── Props ─────────────────────────────────────────────
export interface ProgramProps {
  heading?: string;
  description?: string;
  shaderColors?: ShaderColors['colorbends'];
}

// ─── Component ────────────────────────────────────────
export default function Program({
  heading = 'Programação',
  description = '4 dias de imersão presencial em Brasília/DF. Carga horária total de 12 horas-aula.',
  shaderColors = ['#007bff', '#4097bf'] as [string, string],
}: ProgramProps) {
  const { programDays, courseDateId } = useTurma();

  const [openSet, setOpenSet] = useState<Set<number>>(
    new Set(programDays.map((_, i) => i))
  );

  // Reset accordion state when turma changes (programDays comes from a different course_date)
  useEffect(() => {
    setOpenSet(new Set(programDays.map((_, i) => i)));
  }, [courseDateId]);

  // If no program days, don't render
  if (programDays.length === 0) return null;

  return (
    <section id="programacao" className="pt-[66px] pb-10 md:pb-14 px-6 md:px-12 bg-[var(--ds-background)] relative overflow-hidden">
      <div className="absolute inset-0 z-0 blur-2xl opacity-40">
        <ColorBends
          rotation={0}
          speed={0.39}
          colors={shaderColors}
          transparent
          autoRotate={0}
          scale={1.2}
          frequency={1}
          warpStrength={1}
          mouseInfluence={0.7}
          parallax={0.5}
          noise={0.1}
        />
      </div>
      <div className="max-w-[1100px] mx-auto relative z-10">
        {/* ── Header ── */}
        <div className="mb-12">
          <h2 className="font-[var(--font-bricolage)] text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-none mb-3 bg-gradient-to-b from-white via-white/90 to-white/55 bg-clip-text text-transparent">
            {heading}
          </h2>
          <p className="text-white/40 text-base md:text-lg">
            {description}
          </p>
        </div>

        {/* ── List ── */}
        <div className="flex flex-col gap-4">
          {programDays.map((day, i) => {
            const isOpen = openSet.has(i);

            return (
              <div
                key={`${day.tag}-${i}`}
                className="rounded-2xl transition-all duration-300 backdrop-blur-md border"
                style={{
                  background: `linear-gradient(to bottom right, var(--ds-primary-8), var(--ds-primary-4))`,
                  borderColor: 'var(--ds-primary-20)',
                  boxShadow: '0 0 30px var(--ds-primary-6)',
                }}
              >
                {/* ── Header row ── */}
                <button
                  onClick={() => {
                    setOpenSet(prev => {
                      const next = new Set(prev);
                      next.has(i) ? next.delete(i) : next.add(i);
                      return next;
                    });
                  }}
                  className="w-full text-left flex items-center gap-4 px-6 py-5 cursor-pointer"
                >
                  {/* Day pill */}
                  <span className="shrink-0 text-[11px] font-semibold border border-white/[0.15] rounded-full px-3 py-1 text-white/55 tracking-wide">
                    {day.tag}
                  </span>

                  {/* Title */}
                  <span className="flex-1 text-white/90 text-base md:text-lg font-semibold leading-snug">
                    {day.title}
                  </span>

                  {/* Time */}
                  <span className="hidden sm:flex items-center gap-1.5 text-white/35 text-[12px] shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {day.time}
                  </span>

                  {/* Chevron */}
                  <ChevronUp
                    className={`w-5 h-5 text-white/35 shrink-0 transition-transform duration-300 ${
                      isOpen ? '' : 'rotate-180'
                    }`}
                  />
                </button>

                {/* ── Expanded content ── */}
                {isOpen && (
                  <div className="px-6 pb-6 border-t border-white/[0.07] pt-5">
                    <div className="flex flex-col gap-3">
                      {day.topics.map((topic, j) => (
                        <div key={j}>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-[var(--ds-primary-light)] shrink-0 mt-0.5" />
                            <span className="text-white/70 text-base leading-relaxed">{topic.text}</span>
                          </div>
                          {topic.children && topic.children.length > 0 && (
                            <div className="ml-7 mt-2 flex flex-col gap-1.5 pl-3 border-l border-white/[0.07]">
                              {topic.children.map((child, k) => (
                                <div key={k} className="flex items-start gap-2">
                                  <span className="text-[var(--ds-primary-light)] text-[10px] mt-1.5">●</span>
                                  <span className="text-white/45 text-[13px] leading-relaxed">{child}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

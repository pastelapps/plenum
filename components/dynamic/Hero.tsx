'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronDown, Download } from 'lucide-react';
import type { TitlePart, HeroBadge } from '@/types/course';
import { getIcon } from '@/lib/icon-map';

gsap.registerPlugin(ScrollTrigger);

// ─── Props ─────────────────────────────────────────────
export interface HeroProps {
  title: string;
  subtitle?: string | null;
  categoryLabel?: string | null;
  titleParts?: TitlePart[] | null;
  turmas: string[];
  heroBadges: HeroBadge[];
  framesPath?: string | null;
  frameCount?: number | null;
  frameExt?: string | null;
  whatsappUrl?: string;
  folderPdfUrl?: string | null;
  ctaText?: string;
}

// ─── Component ────────────────────────────────────────
export default function Hero({
  title,
  subtitle,
  categoryLabel = 'Imersão',
  titleParts,
  turmas,
  heroBadges,
  framesPath = '/frames/frame_',
  frameCount = 192,
  frameExt = '.jpg',
  folderPdfUrl,
  ctaText = 'Quero me inscrever',
}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [turmaOpen, setTurmaOpen] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState(0);

  const actualFrameCount = frameCount || 192;
  const actualFramesPath = framesPath || '/frames/frame_';
  const actualFrameExt = frameExt || '.jpg';

  const frameSrc = (i: number) => {
    const num = String(i + 1).padStart(4, '0');
    return `${actualFramesPath}${num}${actualFrameExt}`;
  };

  /* ── Frame loader ── */
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];
    for (let i = 0; i < actualFrameCount; i++) {
      const img = new Image();
      img.src = frameSrc(i);
      img.onload = img.onerror = () => {
        loadedCount++;
        if (loadedCount === actualFrameCount) {
          framesRef.current = images;
          setLoaded(true);
        }
      };
      images.push(img);
    }
  }, [actualFrameCount, actualFramesPath, actualFrameExt]);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = framesRef.current[index];
    if (!canvas || !ctx || !img?.complete) return;
    const cw = canvas.offsetWidth;
    const ch = canvas.offsetHeight;
    if (canvas.width !== cw * window.devicePixelRatio || canvas.height !== ch * window.devicePixelRatio) {
      canvas.width = cw * window.devicePixelRatio;
      canvas.height = ch * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    const vw = img.width;
    const vh = img.height;
    const scale = Math.max(cw / vw, ch / vh);
    const w = vw * scale;
    const h = vh * scale;
    const x = (cw - w) / 2;
    const y = (ch - h) / 2;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, w, h);
  };

  /* ── GSAP scroll-driven frames ── */
  useEffect(() => {
    if (!sectionRef.current || !loaded) return;
    drawFrame(0);
    const ctx = gsap.context(() => {
      const els = sectionRef.current?.querySelectorAll('.hero-anim');
      if (els) {
        gsap.fromTo(els, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.3 });
      }
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0,
        onUpdate: (self) => {
          const frameIndex = Math.min(actualFrameCount - 1, Math.floor(self.progress * actualFrameCount));
          drawFrame(frameIndex);
        },
      });
    }, sectionRef);
    const onResize = () => drawFrame(0);
    window.addEventListener('resize', onResize);
    return () => { ctx.revert(); window.removeEventListener('resize', onResize); };
  }, [loaded]);

  // Render title: use titleParts if available, else fallback to plain title
  const renderTitle = () => {
    if (titleParts && titleParts.length > 0) {
      return titleParts.map((part, i) => (
        <span
          key={i}
          className={part.color === 'accent' ? 'text-[var(--ds-primary)]' : 'text-white'}
        >
          {part.text}
        </span>
      ));
    }
    return <span className="text-white">{title}</span>;
  };

  // Find which badge is the turma selector (value === "dropdown")
  const turmaBadge = heroBadges.find(b => b.value === 'dropdown');

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[var(--ds-background-alt)] flex flex-col"
    >
      {/* ── BG: gradient ── */}
      <div className="absolute inset-0 z-0" style={{ background: `radial-gradient(ellipse 90% 60% at 50% 85%, var(--ds-hero-gradient-mid) 0%, var(--ds-background-deep) 60%)` }} />

      {/* ── Canvas — wave animation ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] w-full h-full mix-blend-screen"
        style={{ opacity: 0.55 }}
      />

      {/* ── Ultra-subtle glass ── */}
      <div className="absolute inset-0 z-[2] bg-white/[0.01] backdrop-blur-[2px]" />

      {/* ── Dark overlay ── */}
      <div className="absolute inset-0 z-[2] bg-black/25 pointer-events-none" />

      {/* ── Top highlight ── */}
      <div className="absolute top-0 inset-x-0 z-[3] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* ── Center glow orb ── */}
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 z-[3] w-[600px] h-[400px] rounded-full pointer-events-none" style={{ background: `radial-gradient(ellipse, var(--ds-primary-6) 0%, transparent 70%)` }} />

      {/* ═══════ Content ═══════ */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-12 pt-36 pb-16 max-w-[1200px] mx-auto w-full">

        {/* ── Category label ── */}
        {categoryLabel && (
          <span className="hero-anim inline-block bg-white text-[var(--ds-primary)] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-4 px-4 py-1.5 rounded-full">
            {categoryLabel}
          </span>
        )}

        {/* ── Heading ── */}
        <h1 className="hero-anim text-center font-[var(--font-bricolage)] text-[2rem] sm:text-5xl md:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] font-extrabold leading-[0.95] tracking-tight mb-6 sm:mb-10 px-2">
          {renderTitle()}
        </h1>

        {/* ── Subtitle ── */}
        {subtitle && (
          <p className="hero-anim text-center text-white text-base sm:text-lg md:text-2xl font-medium tracking-wide mb-8 max-w-[90vw] md:max-w-none">
            {subtitle}
          </p>
        )}

        {/* ── Info badges — pill ── */}
        {heroBadges.length > 0 && (
          <div className="hero-anim relative z-20 inline-flex flex-col sm:flex-row items-stretch mb-10 rounded-2xl sm:rounded-[999px] bg-black/30 backdrop-blur-md border border-white/[0.08] overflow-visible">
            {heroBadges.map((badge, i) => {
              const BadgeIcon = getIcon(badge.icon);
              const isTurmaDropdown = badge.value === 'dropdown';

              return (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <>
                      <span className="hidden sm:block w-px bg-white/[0.08] self-stretch" />
                      <span className="sm:hidden h-px bg-white/[0.08]" />
                    </>
                  )}
                  <div className="flex items-center gap-3 px-5 py-3">
                    <div className="w-9 h-9 rounded-full bg-white/[0.07] border border-white/[0.08] flex items-center justify-center shrink-0">
                      {BadgeIcon && <BadgeIcon className="w-4 h-4 text-[var(--ds-primary)]" />}
                    </div>
                    <div className={isTurmaDropdown ? 'relative' : ''}>
                      <p className="text-[var(--ds-primary)] text-[11px] font-semibold uppercase tracking-wider mb-1">{badge.label}</p>
                      {isTurmaDropdown && turmas.length > 0 ? (
                        <>
                          <button
                            onClick={() => setTurmaOpen(!turmaOpen)}
                            className="flex items-center gap-1 text-white font-bold text-sm hover:text-white/80 transition-colors cursor-pointer"
                          >
                            <span>{turmas[selectedTurma]}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${turmaOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {turmaOpen && (
                            <div className="absolute top-full left-0 mt-2 min-w-[220px] rounded-xl bg-[var(--ds-surface)]/95 backdrop-blur-xl border border-white/10 shadow-2xl py-1.5 z-[999]">
                              {turmas.map((turma, ti) => (
                                <button
                                  key={ti}
                                  onClick={() => { setSelectedTurma(ti); setTurmaOpen(false); }}
                                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                    ti === selectedTurma
                                      ? 'text-white bg-white/10'
                                      : 'text-white/60 hover:text-white hover:bg-white/5'
                                  }`}
                                >
                                  {turma}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-white font-bold text-sm">{badge.value}</p>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* ── CTAs ── */}
        <div className="hero-anim flex items-center gap-3 mb-8">
          {folderPdfUrl !== undefined && (
            <a
              href="#folder"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white/[0.06] border border-white/[0.25] backdrop-blur-md text-white text-sm font-medium hover:bg-white/[0.12] hover:border-white/[0.4] transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              Baixar o folder
            </a>
          )}

          <a
            href="#inscricao"
            className="relative group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border text-white text-sm font-semibold transition-all duration-300"
            style={{ borderColor: 'var(--ds-primary-30)', backgroundColor: 'var(--ds-primary-5)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--ds-primary-10)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--ds-primary-5)'; }}
          >
            <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 inset-y-0 w-3/4 mx-auto" style={{ background: 'linear-gradient(to right, transparent, var(--ds-primary), transparent)' }} />
            {ctaText}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            <span className="absolute group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px w-3/4 mx-auto" style={{ background: 'linear-gradient(to right, transparent, var(--ds-primary), transparent)' }} />
          </a>
        </div>

        {/* ── Link to in-company ── */}
        <a href="#notificacao" className="hero-anim text-white/40 text-sm hover:text-white/60 transition-colors mb-20 underline underline-offset-4 decoration-white/20 hover:decoration-white/40">
          Solicitar curso In Company
        </a>

      </div>

      {/* ── Bottom gradient fade ── */}
      <div className="absolute bottom-0 inset-x-0 z-[4] h-32 bg-gradient-to-t from-[var(--ds-background)] to-transparent pointer-events-none" />
    </section>
  );
}

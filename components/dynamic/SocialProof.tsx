'use client';

import React, { useState } from 'react';
import { Play, X, CheckCircle2, ArrowRight, CreditCard, Info, Building2, MapPin, Phone, Globe, Mail, FileText, ChevronDown } from 'lucide-react';
import Grainient from '@/components/Grainient';
import { Button } from '@/components/ui/neon-button';
import { cn } from '@/lib/utils';
import type { Testimonial } from '@/types/course';
import type { CompanySettings } from '@/types/company';
import type { ShaderColors } from '@/types/design-system';

// ─── Props ─────────────────────────────────────────────
export interface SocialProofProps {
  testimonials: Testimonial[];
  company: CompanySettings;
  courseId?: string;
  courseDateId?: string | null;
  whatsappUrl?: string;
  grainientColors?: ShaderColors['grainient'];
}

// ─── Component ────────────────────────────────────────
export default function SocialProof({
  testimonials,
  company,
  courseId,
  courseDateId,
  whatsappUrl = 'https://wa.me/553125311776',
  grainientColors = ['#030d1f', '#378bae', '#030d1f'] as [string, string, string],
}: SocialProofProps) {
  const [position, setPosition] = useState(Math.min(3, testimonials.length));
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const [ctaSubmitted, setCtaSubmitted] = useState(false);
  const [ctaForm, setCtaForm] = useState({ nome: '', email: '', orgao: '', whatsapp: '' });
  const [openCancelamento, setOpenCancelamento] = useState(false);
  const [openEmpresa, setOpenEmpresa] = useState(false);

  const handleCtaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCtaForm({ ...ctaForm, [e.target.name]: e.target.value });
  };

  const handleCtaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (courseId) {
      try {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...ctaForm,
            course_id: courseId,
            course_date_id: courseDateId || null,
            form_type: 'in_company',
          }),
        });
        const data = await res.json();
        if (data.success) {
          setCtaSubmitted(true);
        }
      } catch {
        // fail silently — still show success for UX
        setCtaSubmitted(true);
      }
    } else {
      setCtaSubmitted(true);
    }
  };

  const handleCardClick = (offset: number) => {
    if (position !== offset) {
      setPosition(offset);
      setPlayingVideoId(null);
    }
  };

  const handlePlayClick = (e: React.MouseEvent, videoIdx: number) => {
    e.stopPropagation();
    setPlayingVideoId(videoIdx);
  };

  const handleCloseVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayingVideoId(null);
  };

  return (
    <section id="depoimentos" className="pt-24 md:pt-32 pb-0 bg-[var(--ds-background)] relative overflow-hidden">
      {/* Grainient background */}
      <div className="absolute inset-0 pointer-events-none">
        <Grainient
          color1={grainientColors[0]}
          color2={grainientColors[1]}
          color3={grainientColors[2]}
          timeSpeed={2.2}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={1}
          warpSpeed={0}
          warpAmplitude={50}
          blendAngle={52}
          blendSoftness={0.05}
          rotationAmount={0}
          noiseScale={2}
          grainAmount={0.03}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[var(--ds-primary)] text-sm font-bold tracking-[0.2em] uppercase mb-4 inline-block">
            Depoimentos
          </span>
          <h2 className="font-[var(--font-bricolage)] text-3xl sm:text-[42px] md:text-[52px] lg:text-[72px] font-bold tracking-tight leading-[1.05] bg-gradient-to-b from-white via-white/90 to-white/55 bg-clip-text text-transparent">
            O que estão falando da gente
          </h2>
        </div>

        {/* Carousel */}
        {testimonials.length > 0 && (
          <div
            className={cn(
              'w-full flex items-center justify-center relative transition-all duration-500',
              playingVideoId !== null ? 'h-[400px] sm:h-[600px]' : 'h-[380px] sm:h-[500px]'
            )}
          >
            <div
              className="relative w-full h-full flex items-center justify-center"
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
                '--position': position,
              } as React.CSSProperties}
            >
              {testimonials.map((video, index) => {
                const offset = index + 1;
                const isPlaying = playingVideoId === index;
                const isActive = position === offset;

                return (
                  <div
                    key={index}
                    className={cn(
                      'absolute transition-all ease-out cursor-pointer',
                      isPlaying ? 'w-full max-w-[900px] h-full z-[100]' : 'w-[220px] h-[300px] sm:w-[300px] sm:h-[400px]'
                    )}
                    onClick={() => handleCardClick(offset)}
                    style={
                      !isPlaying
                        ? ({
                            '--offset': offset,
                            '--r': 'calc(var(--position) - var(--offset))',
                            '--abs': 'max(calc(var(--r) * -1), var(--r))',
                            transform: 'rotateY(calc(-10deg * var(--r))) translateX(calc(min(-240px, -55vw) * var(--r)))',
                            zIndex: 'calc(10 - var(--abs))',
                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            opacity: 'calc(1 - (0.2 * var(--abs)))',
                          } as React.CSSProperties)
                        : ({
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                          } as React.CSSProperties)
                    }
                  >
                    <div
                      className={cn(
                        'w-full h-full relative rounded-3xl overflow-hidden group bg-[var(--ds-surface-alt)]',
                        !isPlaying && 'shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/[0.08]'
                      )}
                    >
                      {isPlaying ? (
                        <div className="w-full h-full relative">
                          <button
                            onClick={handleCloseVideo}
                            className="absolute top-4 right-4 z-[110] bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-all"
                          >
                            <X className="w-6 h-6" />
                          </button>
                          <iframe
                            src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=1`}
                            title={video.name}
                            className="w-full h-full border-none"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <>
                          <div
                            className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                            style={{ backgroundImage: `url(${video.thumbnail_url})` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <button
                              onClick={(e) => handlePlayClick(e, index)}
                              className={cn(
                                'w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-500 backdrop-blur-sm',
                                isActive
                                  ? 'bg-[var(--ds-primary)] scale-100 opacity-100'
                                  : 'bg-white/10 scale-75 opacity-0 group-hover:opacity-40'
                              )}
                            >
                              <Play className="w-6 h-6 ml-1 fill-current" />
                            </button>
                          </div>
                          <div className="absolute bottom-0 left-0 w-full p-6">
                            <h3 className="text-white font-bold text-lg leading-tight mb-1">{video.name}</h3>
                            <p className="text-[var(--ds-primary)] text-xs uppercase tracking-widest font-bold opacity-80">{video.role || ''}</p>
                          </div>
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent pointer-events-none" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dots */}
        {testimonials.length > 0 && (
          <div
            className={cn(
              'flex justify-center gap-4 mt-12 transition-opacity duration-300',
              playingVideoId !== null ? 'opacity-0 pointer-events-none' : 'opacity-100'
            )}
          >
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setPosition(index + 1)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-500',
                  position === index + 1
                    ? 'bg-[var(--ds-primary)] w-10'
                    : 'bg-white/20 hover:bg-white/40 w-4'
                )}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── In Company Section ── */}
      <div id="notificacao" className="mt-20 md:mt-28 relative w-full bg-white/[0.04] backdrop-blur-md border-t border-white/[0.08] rounded-t-[36px] sm:rounded-t-[72px] px-4 sm:px-6 md:px-12 pt-10 sm:pt-14 md:pt-20 overflow-hidden">
        <div className="absolute -inset-2 blur-2xl -z-10" style={{ backgroundColor: 'var(--ds-primary-4)' }} />

        <div className="relative z-10 max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="font-[var(--font-bricolage)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] text-white mb-5">
              Quero esse curso<br />no meu órgão
            </h2>
            <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-[500px] mx-auto lg:mx-0">
              Capacite toda sua equipe com uma formação personalizada. Montamos uma turma exclusiva para o seu município, câmara ou órgão estadual.
            </p>
          </div>

          <div className="lg:w-1/2 w-full">
            {ctaSubmitted ? (
              <div className="text-center py-12 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--ds-primary-10)' }}>
                  <CheckCircle2 className="w-8 h-8 text-[var(--ds-primary)]" />
                </div>
                <h3 className="font-[var(--font-bricolage)] text-2xl font-bold text-white">Proposta solicitada!</h3>
                <p className="text-white/50 text-sm max-w-[280px]">Nossa equipe entrará em contato para montar a melhor proposta para o seu órgão.</p>
              </div>
            ) : (
              <form onSubmit={handleCtaSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">Nome Completo</label>
                  <input type="text" name="nome" required value={ctaForm.nome} onChange={handleCtaChange} placeholder="Seu nome" className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[var(--ds-primary-40)] focus:shadow-[0_0_20px_var(--ds-primary-15)] transition-all" />
                </div>
                <div>
                  <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">Email Corporativo</label>
                  <input type="email" name="email" required value={ctaForm.email} onChange={handleCtaChange} placeholder="seu@email.com" className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[var(--ds-primary-40)] focus:shadow-[0_0_20px_var(--ds-primary-15)] transition-all" />
                </div>
                <div>
                  <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">Órgão / Instituição</label>
                  <input type="text" name="orgao" required value={ctaForm.orgao} onChange={handleCtaChange} placeholder="Prefeitura, Câmara, Governo..." className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[var(--ds-primary-40)] focus:shadow-[0_0_20px_var(--ds-primary-15)] transition-all" />
                </div>
                <div>
                  <label className="text-white/60 text-[11px] uppercase font-bold tracking-widest block mb-2">WhatsApp</label>
                  <input type="tel" name="whatsapp" required value={ctaForm.whatsapp} onChange={handleCtaChange} placeholder="(00) 00000-0000" className="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[var(--ds-primary-40)] focus:shadow-[0_0_20px_var(--ds-primary-15)] transition-all" />
                </div>
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 py-4 text-white text-sm font-medium"
                >
                  Solicitar proposta
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* ── Info Cards ── */}
        <div className="mt-14 md:mt-20 max-w-[1200px] mx-auto flex flex-col gap-3 pb-14 md:pb-20">

          {/* 1. Formas de Pagamento */}
          <div className="flex flex-col md:flex-row items-center gap-6 rounded-2xl border border-white/[0.08] bg-[var(--ds-surface)]/50 backdrop-blur-xl px-6 py-5" style={{ backgroundColor: 'color-mix(in srgb, var(--ds-surface) 50%, transparent)' }}>
            <div className="flex items-center gap-4 flex-1">
              <div className="w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 text-[var(--ds-primary)]" style={{ backgroundColor: 'var(--ds-primary-10)', borderColor: 'var(--ds-primary-20)' }}>
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-bold text-sm uppercase tracking-wider mb-0.5">Formas de Pagamento</p>
                <p className="text-white/45 text-sm leading-relaxed">
                  {company.payment_info?.bank_name
                    ? `${company.payment_info.bank_name} — ${company.payment_info.agency || ''}`
                    : 'Boleto bancário, transferência, cheque ou dinheiro.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="hidden md:block w-px h-10 bg-white/[0.08]" />
              <div className="text-center">
                <p className="text-white/35 text-[10px] uppercase tracking-widest mb-1">Solicite informações no financeiro:</p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2.5 rounded-full bg-[var(--ds-primary)] text-white text-xs font-bold uppercase tracking-widest hover:bg-[var(--ds-primary-hover)] transition-colors"
                >
                  Setor Financeiro
                </a>
              </div>
              {company.payment_info?.pix_key && (
                <>
                  <div className="hidden md:block w-px h-10 bg-white/[0.08]" />
                  <div className="text-center">
                    <p className="text-white font-bold text-sm">PIX</p>
                    <p className="text-white/35 text-[10px] uppercase tracking-widest">Consulte</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 2. Política de Cancelamento */}
          {company.cancellation_policy && (
            <div className="rounded-2xl border border-white/[0.08] bg-[var(--ds-surface)]/50 backdrop-blur-xl overflow-hidden" style={{ backgroundColor: 'color-mix(in srgb, var(--ds-surface) 50%, transparent)' }}>
              <button
                onClick={() => setOpenCancelamento(!openCancelamento)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 text-[var(--ds-primary)]" style={{ backgroundColor: 'var(--ds-primary-10)', borderColor: 'var(--ds-primary-20)' }}>
                    <Info className="w-5 h-5" />
                  </div>
                  <p className="text-white font-bold text-sm uppercase tracking-wider">Política de Cancelamento</p>
                </div>
                <ChevronDown className={`w-5 h-5 text-white/40 transition-transform duration-300 ${openCancelamento ? 'rotate-180' : ''}`} />
              </button>
              {openCancelamento && (
                <div className="px-6 pb-6 space-y-4">
                  <div className="rounded-xl border p-4" style={{ borderColor: 'var(--ds-primary-10)', backgroundColor: 'var(--ds-primary-5)' }}>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {company.cancellation_policy}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. Dados da Empresa */}
          <div className="rounded-2xl border border-white/[0.08] bg-[var(--ds-surface)]/50 backdrop-blur-xl overflow-hidden" style={{ backgroundColor: 'color-mix(in srgb, var(--ds-surface) 50%, transparent)' }}>
            <button
              onClick={() => setOpenEmpresa(!openEmpresa)}
              className="w-full flex items-center justify-between px-6 py-5 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 text-[var(--ds-primary)]" style={{ backgroundColor: 'var(--ds-primary-10)', borderColor: 'var(--ds-primary-20)' }}>
                  <Building2 className="w-5 h-5" />
                </div>
                <p className="text-white font-bold text-sm uppercase tracking-wider">Dados da Empresa</p>
              </div>
              <ChevronDown className={`w-5 h-5 text-white/40 transition-transform duration-300 ${openEmpresa ? 'rotate-180' : ''}`} />
            </button>
            {openEmpresa && (
              <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {company.address && (
                  <div className="space-y-1">
                    <p className="text-white/30 text-[10px] uppercase tracking-widest flex items-center gap-2"><MapPin className="w-3 h-3" /> Endereço</p>
                    <p className="text-white/65 text-sm leading-relaxed">{company.address}</p>
                  </div>
                )}
                {company.emails?.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-white/30 text-[10px] uppercase tracking-widest flex items-center gap-2"><Mail className="w-3 h-3" /> E-mails</p>
                    {company.emails.map((e, i) => (
                      <p key={i} className="text-white/65 text-sm">{e.email}</p>
                    ))}
                  </div>
                )}
                {company.phones?.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-white/30 text-[10px] uppercase tracking-widest flex items-center gap-2"><Phone className="w-3 h-3" /> Contatos</p>
                    {company.phones.map((p, i) => (
                      <p key={i} className="text-white/65 text-sm">{p.number}</p>
                    ))}
                  </div>
                )}
                <div className="space-y-3">
                  {company.website && (
                    <div className="space-y-1">
                      <p className="text-white/30 text-[10px] uppercase tracking-widest flex items-center gap-2"><Globe className="w-3 h-3" /> Website</p>
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-[var(--ds-primary)] text-sm hover:text-[var(--ds-primary-hover)] transition-colors">{company.website.replace(/^https?:\/\//, '')}</a>
                    </div>
                  )}
                  <div className="rounded-xl border p-3" style={{ borderColor: 'var(--ds-primary-10)', backgroundColor: 'var(--ds-primary-5)' }}>
                    <p className="text-white font-bold text-xs flex items-center gap-2 mb-1"><FileText className="w-3 h-3 text-[var(--ds-primary)]" /> Contratação</p>
                    <p className="text-white/45 text-xs italic">&quot;Solicite os documentos e demais informações para contratação.&quot;</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

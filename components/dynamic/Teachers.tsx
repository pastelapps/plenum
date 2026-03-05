'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Linkedin, Twitter, Globe } from 'lucide-react';
import type { Instructor } from '@/types/course';

gsap.registerPlugin(ScrollTrigger);

// ─── Props ─────────────────────────────────────────────
export interface TeachersProps {
  instructor: Instructor;
  heading?: string;
}

// ─── Social icon helper ───────────────────────────────
function getSocialIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case 'instagram': return Instagram;
    case 'linkedin': return Linkedin;
    case 'twitter':
    case 'x': return Twitter;
    default: return Globe;
  }
}

// ─── Component ────────────────────────────────────────
export default function Teachers({
  instructor,
  heading = 'Quem será\no instrutor?',
}: TeachersProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.speaker-anim',
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const headingLines = heading.split('\n');

  return (
    <section
      ref={sectionRef}
      id="instrutor"
      className="relative w-full bg-[var(--ds-background)] overflow-hidden pt-10 pb-16 md:pt-14 md:pb-20 px-6 md:px-12"
    >
      {/* Gradient top */}
      <div className="absolute inset-x-0 top-0 h-40 pointer-events-none z-0" style={{ background: 'linear-gradient(to bottom, var(--ds-background), var(--ds-primary-8), transparent)' }} />
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[var(--ds-primary-10)] to-transparent pointer-events-none z-0" />

      <div className="max-w-[1000px] mx-auto relative z-10">
        {/* Heading */}
        <div className="speaker-anim mb-14 text-center">
          <h2 className="font-[var(--font-bricolage)] text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] bg-gradient-to-b from-white via-white/90 to-white/55 bg-clip-text text-transparent">
            {headingLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < headingLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
        </div>

        {/* ── Mobile Card — foto vazada + glass card ── */}
        <div className="speaker-anim relative md:hidden max-w-[340px] mx-auto">
          {/* Wrapper com espaço para a foto vazada no topo */}
          <div className={`relative ${instructor.photo_url ? 'pt-[160px]' : ''}`}>
            {/* Foto vazada — sobrepõe o topo do card */}
            {instructor.photo_url && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-[70%] max-w-[260px]">
                <div className="relative">
                  <img
                    src={instructor.photo_url}
                    alt={instructor.name}
                    className="w-full aspect-[3/4] object-cover object-top"
                  />
                  {/* Degradê na parte de baixo da foto */}
                  <div className="absolute inset-x-0 bottom-0 h-[40%] pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, var(--ds-background))' }} />
                </div>
              </div>
            )}

            {/* Glass card */}
            <div className="relative rounded-3xl border border-white/[0.1] bg-white/[0.04] backdrop-blur-md overflow-hidden">
              <div className="absolute -inset-2 rounded-3xl blur-2xl -z-10" style={{ backgroundColor: 'var(--ds-primary-4)' }} />

              {/* Spacer para a parte da foto que fica dentro do card */}
              {instructor.photo_url && <div className="h-[180px]" />}

              {/* Name + role + bio + social — left-aligned */}
              <div className="px-6 pb-7 pt-4 text-left">
                <h3 className="font-[var(--font-bricolage)] text-[28px] font-bold text-white leading-tight mb-1.5">
                  {instructor.name}
                </h3>
                <p className="text-[var(--ds-primary)] text-[11px] font-semibold uppercase tracking-widest mb-4">
                  {instructor.role || 'Instrutor'}
                </p>
                <p className="text-white/50 text-[14px] leading-relaxed mb-5">
                  {instructor.bio || ''}
                </p>
                <div className="flex gap-3 flex-wrap">
                  {instructor.social_links?.map((social) => {
                    const SocialIcon = getSocialIcon(social.platform);
                    return (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/50 hover:text-[var(--ds-primary)] transition-colors text-xs font-medium"
                      >
                        <SocialIcon className="w-4 h-4" />
                        {social.handle}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Desktop Card — photo right, text left ── */}
        <div className="speaker-anim relative hidden md:block">
          <div className="relative rounded-3xl border border-white/[0.1] bg-white/[0.04] backdrop-blur-md overflow-visible">
            <div className="absolute -inset-2 rounded-3xl blur-2xl -z-10" style={{ backgroundColor: 'var(--ds-primary-4)' }} />

            {/* Text content */}
            <div className="p-12 pr-[300px] text-left">
              <h3 className="font-[var(--font-bricolage)] text-3xl font-bold text-white mb-2">
                {instructor.name}
              </h3>
              <p className="text-[var(--ds-primary)] text-xs font-semibold uppercase tracking-widest mb-5">
                {instructor.role || 'Instrutor'}
              </p>
              <p className="text-white/45 text-sm leading-relaxed mb-8 max-w-[480px]">
                {instructor.bio || ''}
              </p>

              {/* Social links */}
              <div className="flex gap-3 flex-wrap">
                {instructor.social_links?.map((social) => {
                  const SocialIcon = getSocialIcon(social.platform);
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/50 hover:text-[var(--ds-primary)] transition-colors text-sm font-medium"
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ds-primary-30)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; }}
                    >
                      <SocialIcon className="w-4 h-4" />
                      {social.handle}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Photo — desktop */}
            {instructor.photo_url && (
              <div className="absolute bottom-0 right-0 z-10">
                <div
                  className="w-[280px] h-[430px] overflow-hidden"
                  style={{ borderRadius: '140px 140px 0 0' }}
                >
                  <img
                    src={instructor.photo_url}
                    alt={instructor.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute inset-0 -z-10 blur-3xl scale-75" style={{ backgroundColor: 'var(--ds-primary-10)' }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, CheckCircle2 } from 'lucide-react';
import { useTurma } from '@/hooks/use-turma';

gsap.registerPlugin(ScrollTrigger);

// ─── Props ─────────────────────────────────────────────
export interface FolderFormProps {
  courseId: string;
  pdfUrl?: string | null;
  backgroundImageUrl?: string;
  heading?: string;
  headingSecondary?: string;
  subtitle?: string;
}

// ─── Component ────────────────────────────────────────
export default function FolderForm({
  courseId,
  pdfUrl,
  backgroundImageUrl = '/fundodepo.png',
  heading = 'Baixe o Folder',
  headingSecondary = 'Completo do Evento',
  subtitle = 'Tenha acesso a programação detalhada, currículo completo dos palestrantes e informações sobre o investimento.',
}: FolderFormProps) {
  const { courseDateId } = useTurma();
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    estado: '',
    cidade: '',
    orgao: '',
  });

  // Reset form state when turma changes
  useEffect(() => {
    setSubmitted(false);
  }, [courseDateId]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.folder-anim',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          course_id: courseId,
          course_date_id: courseDateId || null,
          form_type: 'folder',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        // Allow PDF download whether lead is new or existing
        if (pdfUrl) {
          window.open(pdfUrl, '_blank');
        }
      }
    } catch {
      // fail silently — still show success for UX
      setSubmitted(true);
      if (pdfUrl) {
        window.open(pdfUrl, '_blank');
      }
    }
  };

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
    'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
  ];

  const inputClasses = "w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[var(--ds-primary-40)] focus:shadow-[0_0_20px_var(--ds-primary-15)] transition-all";

  return (
    <section ref={sectionRef} id="folder" className="pt-24 md:pt-32 px-6 md:px-12 relative overflow-hidden">
      {/* ── Background image ── */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url('${backgroundImageUrl}')`, backgroundPosition: 'center top' }}
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

          {/* Left — Text */}
          <div className="lg:w-1/2 flex flex-col">
            <div className="folder-anim inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[var(--ds-primary)] text-[12px] font-semibold w-fit mb-6" style={{ borderColor: 'var(--ds-primary-20)', backgroundColor: 'var(--ds-primary-5)' }}>
              <Download className="w-4 h-4" />
              Material Exclusivo
            </div>

            <h2 className="folder-anim font-[var(--font-bricolage)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-5">
              <span className="bg-gradient-to-b from-white via-white/90 to-white/55 bg-clip-text text-transparent">{heading}</span><br />
              <span className="text-white/40">{headingSecondary}</span>
            </h2>

            <p className="folder-anim text-white/50 text-base md:text-lg leading-relaxed max-w-[480px] mb-8">
              {subtitle}
            </p>

            <div className="folder-anim inline-flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/[0.08] bg-[var(--ds-surface)]/50 backdrop-blur-xl w-fit hover:border-white/[0.12] transition-colors" style={{ backgroundColor: 'color-mix(in srgb, var(--ds-surface) 50%, transparent)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--ds-primary)]" style={{ background: `linear-gradient(to bottom right, var(--ds-primary-20), var(--ds-primary-10))` }}>
                <Download className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm">PDF Completo</span>
                <span className="text-white/40 text-xs">Versão Atualizada</span>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="lg:w-1/2 w-full folder-anim">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl blur-2xl scale-105 pointer-events-none" style={{ background: `linear-gradient(to bottom right, var(--ds-primary-5), var(--ds-primary-4))` }} />

              <div className="relative rounded-3xl p-8 md:p-10 bg-[var(--ds-surface)]/50 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.12] transition-colors" style={{ backgroundColor: 'color-mix(in srgb, var(--ds-surface) 50%, transparent)' }}>
                {submitted ? (
                  <div className="text-center py-16 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--ds-primary-10)' }}>
                      <CheckCircle2 className="w-8 h-8 text-[var(--ds-primary)]" />
                    </div>
                    <h3 className="font-[var(--font-bricolage)] text-2xl font-bold text-white">Enviado com sucesso!</h3>
                    <p className="text-white/50 text-sm max-w-[280px]">O folder será enviado para o seu e-mail em instantes.</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h3 className="font-[var(--font-bricolage)] text-xl font-bold text-white mb-2">Preencha seus dados</h3>
                      <p className="text-white/40 text-sm">Download imediato após o preenchimento.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      <div>
                        <label className="text-white text-[11px] uppercase font-bold tracking-widest block mb-2">Nome Completo *</label>
                        <input type="text" name="nome" required value={form.nome} onChange={handleChange} placeholder="Seu nome" className={inputClasses} />
                      </div>
                      <div>
                        <label className="text-white text-[11px] uppercase font-bold tracking-widest block mb-2">WhatsApp *</label>
                        <input type="tel" name="whatsapp" required value={form.whatsapp} onChange={handleChange} placeholder="(00) 00000-0000" className={inputClasses} />
                      </div>
                      <div>
                        <label className="text-white text-[11px] uppercase font-bold tracking-widest block mb-2">Email Corporativo *</label>
                        <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="seu@email.com" className={inputClasses} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-white text-[11px] uppercase font-bold tracking-widest block mb-2">Estado *</label>
                          <select name="estado" required value={form.estado} onChange={handleChange} className={`${inputClasses} appearance-none cursor-pointer`}>
                            <option value="" className="bg-[var(--ds-surface)]">UF</option>
                            {estados.map((uf) => (
                              <option key={uf} value={uf} className="bg-[var(--ds-surface)]">{uf}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-white text-[11px] uppercase font-bold tracking-widest block mb-2">Cidade *</label>
                          <input type="text" name="cidade" required value={form.cidade} onChange={handleChange} placeholder="Cidade" className={inputClasses} />
                        </div>
                      </div>
                      <div>
                        <label className="text-white text-[11px] uppercase font-bold tracking-widest block mb-2">Órgão Representante</label>
                        <select name="orgao" required value={form.orgao} onChange={handleChange} className={`${inputClasses} appearance-none cursor-pointer`}>
                          <option value="" className="bg-[var(--ds-surface)]">Selecione o tipo</option>
                          <option value="Prefeitura" className="bg-[var(--ds-surface)]">Prefeitura</option>
                          <option value="Câmara" className="bg-[var(--ds-surface)]">Câmara Municipal</option>
                          <option value="Governo Estadual" className="bg-[var(--ds-surface)]">Governo Estadual</option>
                          <option value="Outro" className="bg-[var(--ds-surface)]">Outro</option>
                        </select>
                      </div>
                      <button type="submit" className="w-full mt-2 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[var(--ds-primary)] text-white text-sm font-bold hover:bg-[var(--ds-primary-hover)] hover:shadow-[0_0_30px_var(--ds-primary-30)] transition-all duration-300">
                        <Download className="w-4 h-4" />
                        Baixar Agora
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-16 md:h-24" />
    </section>
  );
}

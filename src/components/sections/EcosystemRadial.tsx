"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Product = {
  id: string;
  name: string;
  sub: string;
  tagline: string;
  desc: string;
  href: string;
  top: string;
  left: string;
  featured?: boolean;
};

// Textos exatos do protótipo do André (seção Ecossistema · "O que estamos construindo")
const PRODUCTS: Product[] = [
  {
    id: "instituto",
    name: "Instituto Plenum Brasil",
    sub: "educação executiva",
    tagline: "Educação executiva",
    desc: "Cursos e eventos para todas as esferas.",
    href: "/cursos",
    top: "15%",
    left: "15%",
  },
  {
    id: "educa",
    name: "EducaPública",
    sub: "plataforma",
    tagline: "Educação que escala",
    desc: "Trilhas, certificados e nivelamento com IA.",
    href: "/#educapublica",
    top: "15%",
    left: "85%",
    featured: true,
  },
  {
    id: "govtech",
    name: "Plenum GovTech",
    sub: "startup",
    tagline: "Tecnologia própria",
    desc: "LicitaPública e agentes de IA.",
    href: "/govtech",
    top: "85%",
    left: "15%",
  },
  {
    id: "consultoria",
    name: "Plenum Consultoria",
    sub: "sob medida",
    tagline: "Resultado institucional",
    desc: "Diagnóstico, projetos, segurança jurídica.",
    href: "/contato",
    top: "85%",
    left: "85%",
  },
];

export default function EcosystemRadial() {
  const [sel, setSel] = useState(0);
  const active = PRODUCTS[sel];

  return (
    <section className="relative overflow-hidden bg-[#030D1F] py-16 lg:py-24 text-white grain-overlay">
      <div className="glow-spot glow-spot--navy" style={{ width: 760, height: 480, top: -120, left: -200 }} />
      <div className="glow-spot glow-spot--gold" style={{ width: 440, height: 320, bottom: -80, right: -100 }} />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-16 items-center">
          {/* Left — heading, subtitle, reveal panel */}
          <div className="reveal">
            <h2 className="font-display text-[1.9rem] lg:text-[2.7rem] font-medium leading-[1.08] tracking-[-0.01em] text-white max-w-xl">
              Ecossistema <span className="text-[#C9A227]">Plenum</span>
            </h2>
            <p className="text-body-lg mt-5 max-w-xl text-white/65">
              Cada peça opera para que o servidor e a instituição pública evoluam juntos — da formação executiva à tecnologia que entra na rotina dos órgãos.
            </p>

            <div className="card-dark edge-gold is-on mt-8 p-6 lg:p-7 min-h-[210px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A227] mb-4">
                O que estamos construindo
              </p>
              <div key={active.id} style={{ animation: "fade-in 0.35s ease" }}>
                <h3 className="font-display text-[26px] leading-tight">{active.name}</h3>
                <p className="mt-1 text-sm font-semibold text-[#C9A227]">{active.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{active.desc}</p>
                <Link
                  href={active.href}
                  className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-[#C9A227]"
                >
                  Conhecer
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
            <p className="mt-4 text-xs text-white/40">Toque em cada operação para conhecer.</p>
          </div>

          {/* Right — interactive radial */}
          <div className="reveal relative mx-auto aspect-square w-full max-w-[460px]" data-reveal-delay="120">
            <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,162,39,0.22),transparent_70%)] blur-xl" />
            <div className="absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/12" />

            {PRODUCTS.map((p, i) => {
              const isActive = i === sel;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSel(i)}
                  onMouseEnter={() => setSel(i)}
                  aria-pressed={isActive}
                  className="group absolute aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 outline-none"
                  style={{ top: p.top, left: p.left }}
                >
                  <div
                    className={`relative flex h-full w-full flex-col items-center justify-center rounded-full border bg-[#030D1F]/60 p-3 text-center backdrop-blur-sm transition-all duration-300 ${
                      isActive
                        ? "scale-[1.06] border-[#C9A227] shadow-[0_0_34px_rgba(201,162,39,0.30)]"
                        : "border-white/20 opacity-70 group-hover:opacity-100 group-hover:border-[#C9A227]/45"
                    }`}
                  >
                    <span className={`relative text-[11px] font-medium leading-tight sm:text-[12px] ${isActive ? "text-white" : "text-white/85"}`}>{p.name}</span>
                    <span className={`relative mt-1 text-[8px] uppercase tracking-[0.12em] ${isActive ? "text-[#C9A227]" : "text-white/40"}`}>{p.sub}</span>
                  </div>
                </button>
              );
            })}

            <div className="pointer-events-none absolute left-1/2 top-1/2 flex aspect-square w-[30%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#C9A227]/30 bg-[#030D1F]/85 shadow-[0_0_45px_rgba(201,162,39,0.18)] backdrop-blur">
              <Image src="/logo-plenum-aberta2.png" alt="Plenum" width={110} height={32} className="h-auto w-[70%]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const STATS = [
    { value: "+30.000", label: "matrículas em capacitações" },
    { value: "+1.600", label: "instituições clientes" },
    { value: "26 estados + DF", label: "órgãos públicos de todo o país já passaram pela Plenum" },
];

const LOGOS = ["TCU", "CGU", "ENAP", "STF", "SENADO", "BNDES"];

export default function SocialProof() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            const ctx = gsap.context(() => {
                gsap.from(".stat-item", {
                    opacity: 0, y: 40, duration: 0.7, stagger: 0.1, ease: "power3.out",
                    clearProps: "transform,opacity",
                    scrollTrigger: { trigger: ".stats-grid", start: "top 80%" }
                });
                gsap.from(".proof-title", {
                    opacity: 0, y: 30, duration: 0.7, ease: "power3.out",
                    scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
                });
            }, sectionRef);
            return () => ctx.revert();
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section id="sobre" ref={sectionRef} className="social-proof-section relative bg-[#030D1F] py-14 lg:py-36 overflow-hidden grain-overlay">
            <div className="max-w-[1280px] mx-auto px-4 relative z-10">
                <div className="proof-title text-center mb-10 lg:mb-20">
                    <h2 className="text-display-lg text-white mb-4">Impacto real</h2>
                    <p className="text-sm italic text-white/50 tracking-wide uppercase">
                        Já atendemos instituições de todo o país
                    </p>
                </div>

                <div className="stats-grid grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-12 mb-14 lg:mb-24">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="stat-item text-center">
                            <div className="text-stat text-[#C9A227] mb-3">{stat.value}</div>
                            <p className="text-sm text-white/50 uppercase tracking-wider font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/38 mb-6">
                    Instituições que já capacitaram suas equipes na Plenum
                </p>
                <div className="border-t border-b border-white/[0.06] py-10 overflow-hidden">
                    <div className="flex animate-scroll-left whitespace-nowrap">
                        {[...LOGOS, ...LOGOS].map((logo, i) => (
                            <div key={`${logo}-${i}`} className="flex-shrink-0 mx-10 lg:mx-16 flex items-center justify-center">
                                <span className="text-lg lg:text-xl font-display font-light text-white/20 tracking-widest uppercase hover:text-white/50 transition-colors duration-300 cursor-default">
                                    {logo}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="mx-auto mt-5 max-w-xl text-center text-xs leading-relaxed text-white/35">
                    Servidores formados destas e de centenas de outras instituições públicas de todo o Brasil.
                </p>

                <div className="mt-14 lg:mt-24 max-w-3xl mx-auto text-center">
                    <blockquote className="text-display-md text-white/90 italic mb-8 leading-snug">
                        &ldquo;Aplicamos o que veio do curso no nosso primeiro edital sob a nova lei. Passou sem ressalvas no controle interno.&rdquo;
                    </blockquote>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm font-semibold text-white/70">MC</div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-white">Maria Helena Costa</p>
                            <p className="text-xs text-white/40">Secretária de Administração · Gov. SC</p>
                        </div>
                        <span className="rounded-full border border-[#C9A227]/35 bg-[#C9A227]/10 px-3 py-1 text-[11px] font-medium text-[#C9A227]">
                            Administração Pública
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

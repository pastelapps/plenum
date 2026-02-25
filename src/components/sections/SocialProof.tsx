"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const STATS = [
    { value: "12.000+", label: "Líderes Formados" },
    { value: "350+", label: "Turmas Realizadas" },
    { value: "98%", label: "Taxa de Satisfação" },
    { value: "27", label: "Estados Atendidos" },
];

const LOGOS = [
    "TCU", "CGU", "ENAP", "STF", "TSE", "MPF",
    "IBGE", "BNDES", "INSS", "ANATEL", "ANVISA", "ANA"
];

export default function SocialProof() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".stat-item", {
                opacity: 0, y: 40, duration: 0.7, stagger: 0.1, ease: "power3.out",
                scrollTrigger: { trigger: ".stats-grid", start: "top 80%" }
            });

            gsap.from(".proof-title", {
                opacity: 0, y: 30, duration: 0.7, ease: "power3.out",
                scrollTrigger: { trigger: ".social-proof-section", start: "top 80%" }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="social-proof-section relative bg-[#0D0D0D] py-24 lg:py-36 overflow-hidden grain-overlay">
            <div className="max-w-[1320px] mx-auto px-6 lg:px-10 relative z-10">
                {/* Section title */}
                <div className="proof-title text-center mb-16 lg:mb-24">
                    <h2 className="text-display-lg text-white mb-4">IMPACTO REAL</h2>
                    <p className="text-sm italic text-white/50 tracking-wide uppercase">
                        Números que comprovam nossa transformação
                    </p>
                </div>

                {/* Stats grid — 4 columns */}
                <div className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-20 lg:mb-28">
                    {STATS.map((stat, i) => (
                        <div key={i} className="stat-item text-center">
                            <div className="text-stat text-[#C9A227] mb-3">{stat.value}</div>
                            <p className="text-sm text-white/50 uppercase tracking-wider font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Logo marquee — grayscale institutional logos */}
                <div className="border-t border-b border-white/[0.06] py-10 overflow-hidden">
                    <div className="flex animate-scroll-left whitespace-nowrap">
                        {[...LOGOS, ...LOGOS].map((logo, i) => (
                            <div
                                key={i}
                                className="flex-shrink-0 mx-10 lg:mx-16 flex items-center justify-center"
                            >
                                <span className="text-lg lg:text-xl font-display font-light text-white/20 tracking-widest uppercase hover:text-white/50 transition-colors duration-300 cursor-default">
                                    {logo}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Testimonial */}
                <div className="mt-20 lg:mt-28 max-w-3xl mx-auto text-center">
                    <blockquote className="text-display-md text-white/90 italic mb-8 leading-snug">
                        &ldquo;A Plenum transformou a forma como nossa equipe pensa gestão pública. Resultado direto no dia a dia.&rdquo;
                    </blockquote>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20" />
                        <div className="text-left">
                            <p className="text-sm font-medium text-white">Maria Helena Costa</p>
                            <p className="text-xs text-white/40">Secretária de Administração, Gov. SC</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

"use client";
import { useEffect, useRef } from "react";
import { ArrowRight, Check } from "lucide-react";
import { gsap } from "@/lib/gsap";

export default function Consultoria() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".consult-text", {
                opacity: 0, x: -40, duration: 0.8, ease: "power3.out",
                scrollTrigger: { trigger: ".consultoria-section", start: "top 75%" }
            });
            gsap.from(".consult-image", {
                opacity: 0, x: 40, duration: 0.8, ease: "power3.out",
                scrollTrigger: { trigger: ".consultoria-section", start: "top 75%" }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const benefits = [
        "Diagnóstico personalizado para sua instituição",
        "Projetos com segurança jurídica e técnica",
        "Apoio contínuo e acompanhamento de resultados",
        "Equipe com experiência em gestão pública real",
    ];

    return (
        <section id="consultoria" ref={sectionRef} className="consultoria-section relative py-14 lg:py-36 overflow-hidden" style={{ background: "linear-gradient(180deg, #030D1F 0%, #0a1628 30%, #0d1b30 60%, #081422 100%)" }}>
            <div className="max-w-[1280px] mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">
                    {/* Text side */}
                    <div className="consult-text">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-[11px] font-semibold tracking-widest text-white/90 uppercase mb-6">
                            <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
                            Consultoria
                        </span>

                        <h2 className="text-display-lg text-white mb-6 leading-tight">
                            Diagnóstico, projetos e apoio técnico especializado
                        </h2>

                        <p className="text-base text-white/65 leading-relaxed mb-8 max-w-lg">
                            Segurança jurídica e técnica para servidores e instituições públicas que precisam de soluções sob medida.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {benefits.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#C9A227]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-3 h-3 text-[#C9A227]" />
                                    </div>
                                    <span className="text-sm text-white/75 leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <a href="#" className="btn-primary">
                            Fale com um Consultor <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Image side */}
                    <div className="consult-image relative">
                        <div className="rounded-[16px] lg:rounded-[24px] overflow-hidden aspect-[4/3] lg:aspect-[4/5]">
                            <img
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
                                alt="Consultoria Plenum"
                                className="w-full h-full object-cover transition-all duration-700"
                            />
                        </div>
                        {/* Decorative accent */}
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-[#C9A227]/10 blur-3xl" />
                    </div>
                </div>
            </div>
        </section>
    );
}

"use client";
import { useEffect, useRef } from "react";
import { ArrowRight, Building2, GraduationCap } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { CONTACT } from "@/lib/plenum-content";

export default function Consultoria() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".instituicoes-card", {
                opacity: 0, y: 40, duration: 0.7, stagger: 0.12, ease: "power3.out",
                clearProps: "transform,opacity",
                scrollTrigger: { trigger: ".instituicoes-section", start: "top 80%" }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="consultoria" ref={sectionRef} className="instituicoes-section bg-[#030D1F] py-14 lg:py-28 text-white">
            <div className="max-w-[1280px] mx-auto px-4 text-center">
                <p className="text-label text-[#C9A227] mb-3">Para instituições</p>
                <h2 className="text-display-lg text-white mb-4">Consultorias e cursos in company sob medida</h2>
                <p className="text-base text-white/55 max-w-2xl mx-auto mb-10">
                    Diagnóstico, projetos e trilhas personalizadas. Atendimento às demandas reais do seu órgão.
                </p>
                <div className="mx-auto mb-10 grid max-w-3xl grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <article className="instituicoes-card rounded-[20px] border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-[#C9A227]/35 hover:bg-white/[0.06]">
                        <Building2 className="h-6 w-6 text-[#C9A227] mb-5" />
                        <h3 className="font-display text-[26px] leading-tight mb-3">Consultoria</h3>
                        <p className="text-sm text-white/55 leading-relaxed">
                            Diagnóstico, projetos e apoio técnico com segurança jurídica.
                        </p>
                    </article>
                    <article className="instituicoes-card rounded-[20px] border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-[#C9A227]/35 hover:bg-white/[0.06]">
                        <GraduationCap className="h-6 w-6 text-[#C9A227] mb-5" />
                        <h3 className="font-display text-[26px] leading-tight mb-3">Cursos In Company</h3>
                        <p className="text-sm text-white/55 leading-relaxed">
                            Trilhas personalizadas, indicadores e governança de aprendizagem.
                        </p>
                    </article>
                </div>
                <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    Falar com um especialista <ArrowRight className="w-4 h-4" />
                </a>
            </div>
        </section>
    );
}

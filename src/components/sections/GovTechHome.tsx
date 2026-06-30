"use client";
import { useEffect, useRef } from "react";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { CONTACT } from "@/lib/plenum-content";

const govtechLinks = [
    { title: "Guias práticos", description: "Materiais aplicados", href: "/govtech#guias" },
    { title: "Blog de IA", description: "IA no setor público", href: "/govtech#blog" },
    { title: "Cidades inteligentes", description: "Editoria de inovação", href: "/govtech#cidades" },
];

export default function GovTechHome() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".govtech-copy", {
                opacity: 0, y: 40, duration: 0.8, ease: "power3.out",
                scrollTrigger: { trigger: ".govtech-section", start: "top 75%" }
            });
            gsap.from(".govtech-card", {
                opacity: 0, y: 36, duration: 0.8, stagger: 0.1, ease: "power3.out",
                clearProps: "transform,opacity",
                scrollTrigger: { trigger: ".govtech-card", start: "top 85%" }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="govtech" ref={sectionRef} className="govtech-section relative bg-[#030D1F] py-14 lg:py-36 text-white overflow-hidden">
            <div className="max-w-[1280px] mx-auto px-4 text-center">
                <div className="govtech-copy max-w-3xl mx-auto mb-10">
                    <p className="text-label text-[#C9A227] mb-3">Plenum GovTech</p>
                    <h2 className="text-display-lg text-white mb-4 leading-tight">
                        Redesenhando o setor público para a era da inteligência artificial
                    </h2>
                    <p className="text-base text-white/60 leading-relaxed">
                        Uma startup dentro da Plenum: pesquisa, dados e soluções de IA para o Estado.
                    </p>
                </div>

                <div className="govtech-card mx-auto mb-4 flex max-w-3xl flex-col gap-6 rounded-[24px] border border-[#C9A227]/30 bg-white/[0.04] p-6 text-left sm:flex-row sm:items-center">
                    <div className="flex-1">
                        <span className="mb-4 inline-flex rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C9A227]">
                            Solução · SaaS
                        </span>
                        <h3 className="font-display text-[32px] leading-tight text-white mb-3">
                            Licita<span className="text-[#C9A227]">Pública</span>
                        </h3>
                        <p className="text-sm leading-relaxed text-white/58">
                            Inteligência artificial para contratações públicas. Da pesquisa de preços ao parecer, com segurança técnica.
                        </p>
                    </div>
                    <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0">
                        Agendar demonstração <ArrowRight className="w-4 h-4" />
                    </a>
                </div>

                <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
                    {govtechLinks.map((item, index) => (
                        <a key={item.title} href={item.href} className="govtech-card rounded-[18px] border border-white/10 bg-white/[0.04] p-5 text-left transition-colors hover:border-[#C9A227]/35 hover:bg-white/[0.07]">
                            {index === 0 ? <FileText className="mb-4 h-5 w-5 text-[#C9A227]" /> : <Sparkles className="mb-4 h-5 w-5 text-[#C9A227]" />}
                            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9A227]">{item.title}</p>
                            <p className="text-sm text-white/62">{item.description}</p>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

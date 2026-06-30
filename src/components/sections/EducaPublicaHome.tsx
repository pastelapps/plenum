"use client";
import { useEffect, useRef } from "react";
import { ArrowRight, Bot, Check, Sparkles } from "lucide-react";
import { gsap } from "@/lib/gsap";

export default function EducaPublicaHome() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".educa-copy", {
                opacity: 0, x: -40, duration: 0.8, ease: "power3.out",
                scrollTrigger: { trigger: ".educa-section", start: "top 75%" }
            });
            gsap.from(".educa-panel", {
                opacity: 0, x: 40, duration: 0.8, ease: "power3.out",
                scrollTrigger: { trigger: ".educa-section", start: "top 75%" }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="educapublica" ref={sectionRef} className="educa-section bg-[#F1F1F1] py-14 lg:py-36">
            <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-20 items-center">
                <div className="educa-copy">
                    <p className="text-label text-[#8a6e1a] mb-3">EducaPública</p>
                    <h2 className="text-display-lg text-[#030D1F] mb-5 leading-tight">
                        A plataforma edtech do gestor público
                    </h2>
                    <p className="text-base text-[#555] leading-relaxed mb-6 max-w-lg">
                        Trilhas, cursos e conteúdo sobre administração pública.
                    </p>
                    <div className="mb-8 flex items-start gap-3 rounded-[18px] border border-[#C9A227]/25 bg-white/70 p-4">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#C9A227]" />
                        <p className="text-sm leading-relaxed text-[#333]">
                            <span className="font-semibold text-[#030D1F]">Conteúdo gratuito</span> de IA e inovação no setor público.
                        </p>
                    </div>
                    <a href="/contato" className="btn-outline-dark">
                        Começar gratuitamente <ArrowRight className="w-4 h-4" />
                    </a>
                </div>

                <div className="educa-panel rounded-[24px] border border-[#030D1F]/[0.06] bg-[#030D1F] p-5 lg:p-7 text-white shadow-[0_28px_90px_rgba(3,13,31,0.22)]">
                    <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-5">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs text-white/45">Minha trilha · Inovação Pública</p>
                                <h3 className="mt-2 font-display text-[28px] leading-tight">IA Aplicada à Gestão Pública</h3>
                            </div>
                            <span className="rounded-full bg-[#c0392b] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                                Ao vivo
                            </span>
                        </div>

                        <div className="mb-2 h-2 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full w-[64%] rounded-full bg-[#C9A227]" />
                        </div>
                        <div className="mb-6 flex items-center justify-between text-[11px] text-white/45">
                            <span>64% concluído</span>
                            <span className="text-[#C9A227]">Certificado ao final</span>
                        </div>

                        <div className="rounded-[16px] border border-[#C9A227]/25 bg-[#C9A227]/10 p-4">
                            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9A227]">
                                <Bot className="h-4 w-4" />
                                Sugestão da IA
                            </div>
                            <p className="text-sm leading-relaxed text-white/68">
                                Próximo passo da sua trilha: Dados para decisão no setor público.
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-[16px] border border-white/10 bg-white/[0.04] p-4">
                            <Sparkles className="mb-3 h-5 w-5 text-[#C9A227]" />
                            <p className="text-sm text-white/75">Trilhas e cursos</p>
                        </div>
                        <div className="rounded-[16px] border border-white/10 bg-white/[0.04] p-4">
                            <Check className="mb-3 h-5 w-5 text-[#C9A227]" />
                            <p className="text-sm text-white/75">Progresso do aluno</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

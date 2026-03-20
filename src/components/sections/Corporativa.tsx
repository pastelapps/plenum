"use client";
import { useEffect, useRef } from "react";
import { ArrowRight, Check } from "lucide-react";
import { gsap } from "@/lib/gsap";

export default function Corporativa() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".corp-text", {
                opacity: 0, x: 40, duration: 0.8, ease: "power3.out",
                scrollTrigger: { trigger: ".corporativa-section", start: "top 75%" }
            });
            gsap.from(".corp-image", {
                opacity: 0, x: -40, duration: 0.8, ease: "power3.out",
                scrollTrigger: { trigger: ".corporativa-section", start: "top 75%" }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const features = [
        "Jornadas por competência com curadoria exclusiva",
        "Indicadores de evolução do aprendizado",
        "Metodologias ativas e cases reais",
        "Certificações reconhecidas pelo setor público",
    ];

    return (
        <section id="empresas" ref={sectionRef} className="corporativa-section bg-[#F1F1F1] py-14 lg:py-36">
            <div className="max-w-[1280px] mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">
                    {/* Image side — left */}
                    <div className="corp-image relative order-2 lg:order-1">
                        <div className="rounded-[16px] lg:rounded-[24px] overflow-hidden aspect-[4/3] lg:aspect-[4/5]">
                            <img
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop"
                                alt="Corporativa Plenum"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Text side — right */}
                    <div className="corp-text order-1 lg:order-2">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-[11px] font-semibold tracking-widest text-green-600 uppercase mb-6">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            Para Empresas
                        </span>

                        <h2 className="text-display-lg text-[#030D1F] mb-6 leading-tight">
                            Educação corporativa sob medida para instituições
                        </h2>

                        <p className="text-base text-[#555] leading-relaxed mb-8 max-w-lg">
                            Treinamentos customizados com indicadores, governança de aprendizagem e resultados mensuráveis para sua equipe.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {features.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#C9A227]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-3 h-3 text-[#C9A227]" />
                                    </div>
                                    <span className="text-sm text-[#555] leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <a href="#" className="btn-outline-dark">
                            Saiba Mais <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

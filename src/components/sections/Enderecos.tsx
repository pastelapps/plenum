"use client";
import { useEffect, useRef } from "react";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { CONTACT, OFFICES } from "@/lib/plenum-content";

export default function Enderecos() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".endereco-card", { y: 40, opacity: 0 }, {
                y: 0, opacity: 1, duration: 0.7, stagger: 0.2, ease: "power3.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 85%" }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <div id="enderecos" ref={sectionRef} className="w-full bg-[#F1F1F1] py-14 lg:py-24">
            <div className="max-w-[1280px] mx-auto px-4 mb-10 lg:mb-14">
                <p className="text-label text-[#8a6e1a] mb-3">Nossas sedes</p>
                <h2 className="text-display-md text-[#030D1F] max-w-3xl">
                    Aguardamos sua visita em Belo Horizonte/MG ou Brasília/DF.
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
                {OFFICES.map((office) => (
                    <article key={office.city} className="endereco-card group relative overflow-hidden min-h-[440px] md:min-h-[560px] lg:min-h-[620px] bg-[#030D1F]">
                        <img src={office.image} alt={office.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" draggable={false} />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030D1F]/92 via-[#030D1F]/42 to-[#030D1F]/10" />
                        <div className="relative z-10 h-full min-h-[440px] md:min-h-[560px] lg:min-h-[620px] flex flex-col justify-end p-6 md:p-8 lg:p-12">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A227]/20 backdrop-blur-sm border border-[#C9A227]/40 rounded-full text-[10px] font-bold tracking-widest text-[#C9A227] uppercase mb-4 w-fit">
                                {office.label}
                            </span>
                            <h3 className="text-[28px] md:text-[36px] lg:text-[46px] font-display font-semibold text-white leading-none mb-1">
                                {office.city}
                            </h3>
                            <p className="text-[12px] text-white/50 uppercase tracking-[0.2em] mb-8">{office.state}</p>
                            <div className="space-y-3 mb-8">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                                    <p className="text-[14px] text-white/80 leading-relaxed">{office.address}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-[#C9A227] shrink-0" />
                                    <p className="text-[14px] text-white/70">{CONTACT.whatsapp}</p>
                                </div>
                            </div>
                            <a href={office.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-[12px] font-semibold text-white uppercase tracking-wider hover:bg-white/20 transition-all w-fit">
                                Ver no Google Maps
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

"use client";
import { useState, useEffect, useRef } from "react";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";

const OFFICES = [
    {
        city: "Brasília",
        state: "DF",
        sede: true,
        address: "SCS Quadra 01, Bloco K, Ed. Denasa, Sala 301",
        cep: "70397-900",
        phone: "(61) 3031-0000",
        email: "brasilia@plenum.com.br",
        images: [
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=1200&auto=format&fit=crop",
        ],
        mapsUrl: "https://maps.google.com/?q=SCS+Quadra+01+Bloco+K+Ed+Denasa+Brasilia+DF",
    },
    {
        city: "Belo Horizonte",
        state: "MG",
        sede: false,
        address: "Av. Afonso Pena, 4000, Sala 1201, Funcionários",
        cep: "30130-009",
        phone: "(31) 3031-0000",
        email: "bh@plenum.com.br",
        images: [
            "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop",
        ],
        mapsUrl: "https://maps.google.com/?q=Av+Afonso+Pena+4000+Funcionarios+Belo+Horizonte+MG",
    },
];

function OfficePanel({ office, index }: { office: typeof OFFICES[0]; index: number }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(prev => (prev + 1) % office.images.length);
        }, index === 0 ? 4000 : 5000);
        return () => clearInterval(interval);
    }, [office.images.length, index]);

    return (
        <div className="endereco-card group relative overflow-hidden min-h-[420px] md:min-h-[520px] lg:min-h-[580px]">
            {/* Carousel images */}
            {office.images.map((img, i) => (
                <img
                    key={i}
                    src={img}
                    alt={`${office.city} ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out"
                    style={{ opacity: current === i ? 1 : 0 }}
                    draggable={false}
                />
            ))}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030D1F]/90 via-[#030D1F]/40 to-[#030D1F]/20 group-hover:from-[#030D1F]/80 group-hover:via-[#030D1F]/30 group-hover:to-[#030D1F]/10 transition-all duration-700" />

            {/* Carousel dots */}
            <div className="absolute top-6 right-6 z-10 flex gap-1.5">
                {office.images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            current === i ? "bg-white w-4" : "bg-white/40 hover:bg-white/60"
                        }`}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8 lg:p-12 min-h-[420px] md:min-h-[520px] lg:min-h-[580px]">
                {/* Sede badge */}
                {office.sede && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A227]/20 backdrop-blur-sm border border-[#C9A227]/40 rounded-full text-[10px] font-bold tracking-widest text-[#C9A227] uppercase mb-4 w-fit">
                        SEDE PRINCIPAL
                    </span>
                )}

                <h3 className="text-[26px] md:text-[32px] lg:text-[42px] font-display font-semibold text-white leading-none mb-1">
                    {office.city}
                </h3>
                <p className="text-[12px] text-white/50 uppercase tracking-[0.2em] mb-8">{office.state}</p>

                <div className="space-y-2.5 mb-8">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[14px] text-white/80 leading-relaxed">{office.address}</p>
                            <p className="text-[11px] text-white/35 mt-0.5">CEP: {office.cep}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-[#C9A227] shrink-0" />
                        <p className="text-[14px] text-white/70">{office.phone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-[#C9A227] shrink-0" />
                        <p className="text-[14px] text-white/70">{office.email}</p>
                    </div>
                </div>

                <a
                    href={office.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-[12px] font-semibold text-white uppercase tracking-wider hover:bg-white/20 transition-all w-fit"
                >
                    Ver no Google Maps
                    <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
            </div>
        </div>
    );
}

export default function Enderecos() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = sectionRef.current?.querySelectorAll(".endereco-card");
            if (cards && cards.length > 0) {
                gsap.fromTo(cards,
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.7, stagger: 0.2, ease: "power3.out",
                      scrollTrigger: { trigger: sectionRef.current, start: "top 85%" } }
                );
            }
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <div id="enderecos" ref={sectionRef} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2">
                {OFFICES.map((office, i) => (
                    <OfficePanel key={i} office={office} index={i} />
                ))}
            </div>
        </div>
    );
}

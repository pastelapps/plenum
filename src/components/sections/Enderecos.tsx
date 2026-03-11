"use client";
import { useEffect, useRef } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { gsap } from "@/lib/gsap";

const OFFICES = [
    {
        city: "Brasília",
        state: "DF",
        address: "SCS Quadra 01, Bloco K, Ed. Denasa, Sala 301",
        cep: "70397-900",
        phone: "(61) 3031-0000",
        email: "brasilia@plenum.com.br",
        image: "https://images.unsplash.com/photo-1585578020489-a0e8c7b9b8e6?q=80&w=800&auto=format&fit=crop",
        headquarters: true,
    },
    {
        city: "Belo Horizonte",
        state: "MG",
        address: "Av. Afonso Pena, 4000, Sala 1201, Funcionários",
        cep: "30130-009",
        phone: "(31) 3031-0000",
        email: "bh@plenum.com.br",
        image: "https://images.unsplash.com/photo-1598301257942-e6bde1d2149b?q=80&w=800&auto=format&fit=crop",
        headquarters: false,
    },
    {
        city: "São Paulo",
        state: "SP",
        address: "Av. Paulista, 1337, Conj. 1010, Bela Vista",
        cep: "01311-200",
        phone: "(11) 3031-0000",
        email: "sp@plenum.com.br",
        image: "https://images.unsplash.com/photo-1543059080-f9b1272213d5?q=80&w=800&auto=format&fit=crop",
        headquarters: false,
    },
];

export default function Enderecos() {
    const sectionRef = useRef<HTMLElement>(null);
    const ctxRef = useRef<ReturnType<typeof gsap.context> | null>(null);

    useEffect(() => {
        // Small delay to ensure DOM is fully painted before GSAP measures positions
        const timer = setTimeout(() => {
            const ctx = gsap.context(() => {
                const headerEl = sectionRef.current?.querySelector(".enderecos-header");
                const gridEl = sectionRef.current?.querySelector(".offices-grid");
                const cardEls = sectionRef.current?.querySelectorAll(".office-card");

                if (headerEl) {
                    gsap.fromTo(headerEl,
                        { y: 40, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
                          scrollTrigger: { trigger: headerEl, start: "top 90%" } }
                    );
                }

                if (cardEls && cardEls.length > 0) {
                    gsap.fromTo(cardEls,
                        { y: 50, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: "power3.out",
                          scrollTrigger: { trigger: gridEl, start: "top 90%" } }
                    );
                }
            }, sectionRef);

            ctxRef.current = ctx;
        }, 100);

        return () => {
            clearTimeout(timer);
            if (ctxRef.current) ctxRef.current.revert();
        };
    }, []);

    return (
        <section id="enderecos" ref={sectionRef} className="enderecos-section bg-[#F1F1F1] py-24 lg:py-36 overflow-hidden">
            <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
                {/* Header */}
                <div className="enderecos-header text-center mb-14 lg:mb-20">
                    <h2 className="text-display-lg text-[#030D1F] mb-4">NOSSOS ENDEREÇOS</h2>
                    <p className="text-sm italic text-[#555] tracking-wide uppercase">
                        Sedes estratégicas em todo o Brasil
                    </p>
                </div>

                {/* Offices grid */}
                <div className="offices-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {OFFICES.map((office, i) => (
                        <div key={i} className="office-card group rounded-[24px] overflow-hidden bg-white border border-[#030D1F]/6 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300">
                            {/* Photo */}
                            <div className="relative h-[220px] overflow-hidden">
                                <img
                                    src={office.image}
                                    alt={`Sede ${office.city}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                                {office.headquarters && (
                                    <div className="absolute top-4 left-4">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A227]/20 backdrop-blur border border-[#C9A227]/30 rounded-full text-[10px] font-semibold tracking-widest text-[#C9A227] uppercase">
                                            SEDE PRINCIPAL
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-6">
                                <h3 className="text-xl font-display font-semibold text-[#030D1F] mb-1">
                                    {office.city}
                                </h3>
                                <p className="text-[12px] text-[#888] uppercase tracking-wider mb-5">{office.state}</p>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-[#555] leading-relaxed">{office.address}</p>
                                            <p className="text-[11px] text-[#999]">CEP: {office.cep}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-[#C9A227] shrink-0" />
                                        <p className="text-sm text-[#555]">{office.phone}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-[#C9A227] shrink-0" />
                                        <p className="text-sm text-[#555]">{office.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

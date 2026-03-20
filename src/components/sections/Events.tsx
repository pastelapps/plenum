"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";

const EVENTS = [
    {
        id: 1,
        title: "Congresso Nacional de Gestão Pública",
        badge: "CONGRESSO",
        description: "Debates estratégicos sobre inovação, liderança e compliance no setor público.",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
        url: "#",
    },
    {
        id: 2,
        title: "Seminário de Licitações Sustentáveis",
        badge: "SEMINÁRIO",
        description: "Conteúdo prático para modernizar contratações públicas com responsabilidade.",
        image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2070&auto=format&fit=crop",
        url: "#",
    },
    {
        id: 3,
        title: "Imersão Liderança GovTech",
        badge: "IMERSÃO",
        description: "Mentorias e cases reais para líderes que querem acelerar transformação digital.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
        url: "#",
    },
    {
        id: 4,
        title: "Fórum de Inovação no Setor Público",
        badge: "FÓRUM",
        description: "Conexões de alto nível entre governo, academia e ecossistema de tecnologia.",
        image: "https://images.unsplash.com/photo-1577985043696-8bd54d9f093f?q=80&w=2070&auto=format&fit=crop",
        url: "#",
    },
    {
        id: 5,
        title: "Ciclo Executivo de Compras Públicas",
        badge: "CICLO EXECUTIVO",
        description: "Trilhas executivas para ganho de produtividade e segurança jurídica nas aquisições.",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
        url: "#",
    },
];

export default function Events() {
    const sectionRef = useRef<HTMLElement>(null);
    const [current, setCurrent] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const touchStartX = useRef(0);

    useEffect(() => {}, []);

    const nextSlide = useCallback(() => {
        setCurrent(prev => (prev + 1) % EVENTS.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrent(prev => (prev - 1 + EVENTS.length) % EVENTS.length);
    }, []);

    const resetTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(nextSlide, 5500);
    }, [nextSlide]);

    useEffect(() => {
        resetTimer();
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [resetTimer]);

    return (
        <section id="eventos" ref={sectionRef} className="events-section overflow-hidden relative bg-[#F1F1F1] py-10 lg:py-16">
            <div className="max-w-[1280px] mx-auto px-4">
                <div
                    className="events-slideshow relative w-full h-[440px] md:h-[580px] lg:h-[700px] overflow-hidden rounded-[16px] md:rounded-[24px]"
                    onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                    onTouchEnd={(e) => {
                        const diff = touchStartX.current - e.changedTouches[0].clientX;
                        if (Math.abs(diff) > 50) {
                            if (diff > 0) { nextSlide(); } else { prevSlide(); }
                            resetTimer();
                        }
                    }}
                >
                    {EVENTS.map((event, i) => (
                        <div
                            key={event.id}
                            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                                i === current
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-105"
                            }`}
                            style={{ backgroundImage: `url(${event.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#030D1F]/85 via-[#030D1F]/50 to-[#030D1F]/20" />

                            <div className={`absolute inset-0 flex flex-col justify-center px-6 md:px-14 lg:px-20 transition-all duration-500 delay-200 ${
                                i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                            }`}>
                                <div className="max-w-[580px]">
                                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/12 backdrop-blur-md border border-white/25 rounded-full text-[11px] font-semibold tracking-[0.2em] text-white uppercase mb-5">
                                        <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
                                        {event.badge}
                                    </span>

                                    <h3 className="text-[24px] md:text-[40px] lg:text-[50px] leading-[1.05] font-display font-semibold text-white mb-3 md:mb-4 uppercase">
                                        {event.title}
                                    </h3>

                                    <p className="text-sm md:text-lg text-white/65 mb-6 md:mb-8 leading-relaxed max-w-md">
                                        {event.description}
                                    </p>

                                    <a
                                        href={event.url}
                                        className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#C9A227] hover:bg-[#e4bc44] text-[#030D1F] text-sm font-semibold uppercase tracking-wide transition-all hover:shadow-[0_8px_30px_rgba(201,162,39,0.3)]"
                                    >
                                        Mais Detalhes
                                        <ArrowRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => { prevSlide(); resetTimer(); }}
                        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/25 bg-[#030D1F]/40 backdrop-blur-sm hover:bg-white/15 items-center justify-center transition-all"
                        aria-label="Evento anterior"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <button
                        onClick={() => { nextSlide(); resetTimer(); }}
                        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/25 bg-[#030D1F]/40 backdrop-blur-sm hover:bg-white/15 items-center justify-center transition-all"
                        aria-label="Próximo evento"
                    >
                        <ArrowRight className="w-5 h-5 text-white" />
                    </button>

                    <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20 text-white/50 text-sm font-display font-medium tracking-widest">
                        0{current + 1} / 0{EVENTS.length}
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                        {EVENTS.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => { setCurrent(idx); resetTimer(); }}
                                className={`h-[3px] rounded-full transition-all duration-300 ${
                                    idx === current ? "w-8 bg-[#C9A227]" : "w-3 bg-white/30 hover:bg-white/50"
                                }`}
                                aria-label={`Ir para evento ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";

const EVENTS = [
    {
        id: 1,
        title: "Congresso Nacional de Gestao Publica",
        category: "CONGRESSO",
        badge: "PLENUM",
        description: "Debates estrategicos sobre inovacao, lideranca e compliance no setor publico.",
        cta: "Ver Agenda",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 2,
        title: "Seminario de Licitacoes Sustentaveis",
        category: "SEMINARIO",
        badge: "PLENUM",
        description: "Conteudo pratico para modernizar contratacoes publicas com responsabilidade.",
        cta: "Inscreva-se",
        image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "Imersao Lideranca GovTech",
        category: "IMERSAO",
        badge: "PLENUM",
        description: "Mentorias e cases reais para lideres que querem acelerar transformacao digital.",
        cta: "Conhecer Imersao",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 4,
        title: "Forum de Inovacao no Setor Publico",
        category: "FORUM",
        badge: "PLENUM",
        description: "Conexoes de alto nivel entre governo, academia e ecossistema de tecnologia.",
        cta: "Ver Evento",
        image: "https://images.unsplash.com/photo-1577985043696-8bd54d9f093f?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 5,
        title: "Ciclo Executivo de Compras Publicas",
        category: "CICLO",
        badge: "PLENUM",
        description: "Trilhas executivas para ganho de produtividade e seguranca juridica nas aquisicoes.",
        cta: "Acessar Programa",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 6,
        title: "Encontro Nacional de Gestao por Dados",
        category: "ENCONTRO",
        badge: "PLENUM",
        description: "Aplicacoes de IA e analytics para tomada de decisao orientada por evidencia.",
        cta: "Quero Participar",
        image: "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2070&auto=format&fit=crop",
    },
];

export default function Events() {
    const sectionRef = useRef<HTMLElement>(null);
    const [eventsList, setEventsList] = useState(EVENTS);

    // Initial section reveal animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".events-header", {
                opacity: 0,
                y: 40,
                duration: 0.7,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".events-section",
                    start: "top 80%"
                }
            });
            gsap.from(".events-carousel-container", {
                opacity: 0,
                y: 60,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".events-carousel-container",
                    start: "top 80%"
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const nextSlide = useCallback(() => {
        setEventsList(prev => [...prev.slice(1), prev[0]]);
    }, []);

    const prevSlide = useCallback(() => {
        setEventsList(prev => [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)]);
    }, []);

    // Auto play (optional, based on previous logic)
    useEffect(() => {
        const interval = window.setInterval(() => {
            nextSlide();
        }, 5500);
        return () => window.clearInterval(interval);
    }, [nextSlide]);

    return (
        <section id="eventos" ref={sectionRef} className="events-section bg-[#F1F1F1] py-20 lg:py-32 overflow-hidden">
            <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
                <div className="events-header text-center mb-16 lg:mb-20">
                    <h2 className="text-display-lg text-[#0D0D0D] mb-4">NOSSOS EVENTOS</h2>
                    <p className="text-sm italic text-[#555] tracking-wide uppercase">
                        Experiências que conectam e transformam
                    </p>
                </div>

                <div className="events-carousel-container relative w-full h-[460px] md:h-[520px] rounded-[26px] bg-[#0D0D0D] shadow-[0_30px_55px_rgba(0,0,0,0.2)]">
                    <div className="absolute inset-0 overflow-hidden rounded-[26px]">
                        <div id="slide" className="w-full h-full relative">
                            {eventsList.map((event) => (
                                <div
                                    key={event.id}
                                    className="item absolute bg-cover bg-center shadow-[0_18px_40px_rgba(0,0,0,0.4)] transition-all duration-500 ease-in-out"
                                    style={{ backgroundImage: `url('${event.image}')` }}
                                >
                                    {/* The overlay is only really needed (or visible) for the background item(s) */}
                                    <div className="item-overlay absolute inset-0 bg-[radial-gradient(circle_at_60%_55%,rgba(120,170,255,0.2),transparent_35%),linear-gradient(90deg,rgba(6,10,12,0.9)_0%,rgba(8,12,16,0.76)_45%,rgba(8,12,16,0.48)_70%,rgba(8,12,16,0.7)_100%)] opacity-0 transition-opacity duration-500 pointer-events-none" />

                                    <div className="content absolute top-1/2 left-8 md:left-14 -translate-y-1/2 max-w-[460px] hidden text-white z-20">
                                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/12 backdrop-blur-md border border-white/25 rounded-full text-[11px] font-semibold tracking-[0.2em] text-white uppercase mb-4 md:mb-5 badge">
                                            <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
                                            {event.badge}
                                        </span>
                                        <h3 className="text-[32px] md:text-[44px] leading-[0.98] font-display font-semibold text-white mb-2 md:mb-3 uppercase category">
                                            {event.category}
                                        </h3>
                                        <p className="text-[20px] md:text-[30px] leading-[1.25] text-white/86 mb-4 md:mb-6 description">
                                            {event.description}
                                        </p>
                                        <a
                                            href="#"
                                            className="inline-flex items-center gap-2 px-5 py-2.5 md:px-7 md:py-3 rounded-[12px] bg-white/80 hover:bg-white text-[#0F1114] text-[20px] md:text-[28px] font-semibold transition-all cta-btn"
                                        >
                                            {event.cta}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
                        <button
                            onClick={prevSlide}
                            className="w-10 h-10 rounded-[10px] border-2 border-black/50 bg-white/65 hover:bg-white transition-all flex items-center justify-center pointer-events-auto"
                            aria-label="Evento anterior"
                        >
                            <ArrowLeft className="w-4 h-4 text-black" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="w-10 h-10 rounded-[10px] border-2 border-black/50 bg-white/65 hover:bg-white transition-all flex items-center justify-center pointer-events-auto"
                            aria-label="Próximo evento"
                        >
                            <ArrowRight className="w-4 h-4 text-black" />
                        </button>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    #slide .item {
                        top: 50%;
                        transform: translateY(-50%);
                        width: 200px;
                        height: 280px;
                        border-radius: 24px;
                    }
                    #slide .item:nth-child(1),
                    #slide .item:nth-child(2) {
                        top: 0;
                        left: 0;
                        transform: translate(0, 0);
                        border-radius: 0;
                        width: 100%;
                        height: 100%;
                    }
                    /* Item 2 is the active background */
                    #slide .item:nth-child(2) .item-overlay {
                        opacity: 1;
                    }
                    #slide .item:nth-child(2) .content {
                        display: block;
                    }

                    /* Desktop positioning for cards */
                    @media (min-width: 1025px) {
                        #slide .item:nth-child(3) {
                            left: 60%;
                        }
                        #slide .item:nth-child(4) {
                            left: calc(60% + 220px);
                        }
                        #slide .item:nth-child(5) {
                            left: calc(60% + 440px);
                        }
                        #slide .item:nth-child(n + 6) {
                            left: calc(60% + 660px);
                            opacity: 0;
                        }
                    }

                    /* Tablet positioning */
                    @media (max-width: 1024px) and (min-width: 768px) {
                        #slide .item:nth-child(3) { left: 55%; }
                        #slide .item:nth-child(4) { left: calc(55% + 220px); }
                        #slide .item:nth-child(5) { left: calc(55% + 440px); }
                        #slide .item:nth-child(n + 6) { left: calc(55% + 660px); opacity: 0; }
                    }

                    /* Mobile positioning */
                    @media (max-width: 767px) {
                        #slide .item {
                            width: 130px;
                            height: 180px;
                        }
                        #slide .item:nth-child(3) { left: 10%; top: calc(100% - 130px); transform: translate(0, -50%); z-index: 10; }
                        #slide .item:nth-child(4) { left: calc(10% + 140px); top: calc(100% - 130px); transform: translate(0, -50%); z-index: 10; }
                        #slide .item:nth-child(5) { left: calc(10% + 280px); top: calc(100% - 130px); transform: translate(0, -50%); z-index: 10; }
                        #slide .item:nth-child(n + 6) { left: calc(10% + 420px); top: calc(100% - 130px); transform: translate(0, -50%); opacity: 0; z-index: 10; }
                        
                        .events-carousel-container #slide .content {
                            top: 35%;
                        }
                    }

                    /* Animations for content elements inside the active item */
                    .content .badge {
                        opacity: 0;
                        animation: animateText 0.8s ease-in-out 1 forwards;
                    }
                    .content .category {
                        opacity: 0;
                        animation: animateText 0.8s ease-in-out 0.2s 1 forwards;
                    }
                    .content .description {
                        opacity: 0;
                        animation: animateText 0.8s ease-in-out 0.4s 1 forwards;
                    }
                    .content .cta-btn {
                        opacity: 0;
                        animation: animateText 0.8s ease-in-out 0.6s 1 forwards;
                    }

                    @keyframes animateText {
                        from {
                            opacity: 0;
                            transform: translate(0, 40px);
                            filter: blur(5px);
                        }
                        to {
                            opacity: 1;
                            transform: translate(0, 0);
                            filter: blur(0);
                        }
                    }
                ` }} />
            </div>
        </section>
    );
}

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
    const carouselRef = useRef<HTMLDivElement>(null);
    const transitionRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".events-carousel", {
                opacity: 0,
                y: 60,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".events-carousel",
                    start: "top 80%"
                }
            });

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

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        // Preload para evitar tranco ao trocar slides.
        EVENTS.forEach((event) => {
            const img = new Image();
            img.src = event.image;
        });
    }, []);

    const orderedEvents = useMemo(
        () => [...EVENTS.slice(activeIndex), ...EVENTS.slice(0, activeIndex)],
        [activeIndex]
    );
    const currentEvent = orderedEvents[0];
    const previewEvents = orderedEvents.slice(1, 3);

    const animateNext = useCallback(() => {
        if (isAnimating || !carouselRef.current || !transitionRef.current || !overlayRef.current || !contentRef.current) return;
        const nextIndex = (activeIndex + 1) % EVENTS.length;
        const nextEvent = EVENTS[nextIndex];
        const rect = carouselRef.current.getBoundingClientRect();
        const pw = Math.min(220, rect.width * 0.24);
        const ph = Math.min(300, rect.height * 0.54);
        const startX = rect.width - (pw * 2 + 28);
        const startY = (rect.height - ph) / 2;

        const layer = transitionRef.current;
        const layerOverlay = layer.querySelector(".transition-overlay") as HTMLElement;
        const img = layer.querySelector("img") as HTMLImageElement;
        if (!img) return;

        setIsAnimating(true);

        const tl = gsap.timeline({
            onComplete: () => {
                gsap.set(layer, { display: "none", clearProps: "all" });
                if (layerOverlay) gsap.set(layerOverlay, { clearProps: "all" });
                gsap.set(overlayRef.current!, { opacity: 1 });
                gsap.set(contentRef.current!, { opacity: 1, y: 0 });
                setIsAnimating(false);
            },
        });

        img.src = nextEvent.image;
        img.alt = nextEvent.title;

        tl.to(contentRef.current, { opacity: 0, y: -18, duration: 0.22, ease: "power2.in" })

          .set(layer, {
              display: "block",
              opacity: 1,
              x: startX,
              y: startY,
              width: pw,
              height: ph,
              borderRadius: 24,
          })
          .set(layerOverlay, { opacity: 0 })

          .to(layer, {
              x: 0,
              y: 0,
              width: rect.width,
              height: rect.height,
              borderRadius: 26,
              duration: 0.62,
              ease: "power3.inOut",
          })

          .to(layerOverlay, {
              opacity: 1,
              duration: 0.28,
              ease: "power2.out",
          }, "-=0.14")

          .call(() => {
              setActiveIndex(nextIndex);
          })

          .fromTo(contentRef.current,
              { opacity: 0, y: 28 },
              { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" }
          );
    }, [activeIndex, isAnimating]);

    const animatePrev = useCallback(() => {
        if (isAnimating || !carouselRef.current || !transitionRef.current || !overlayRef.current || !contentRef.current) return;
        const prevIndex = (activeIndex - 1 + EVENTS.length) % EVENTS.length;
        const current = EVENTS[activeIndex];
        const rect = carouselRef.current.getBoundingClientRect();
        const pw = Math.min(220, rect.width * 0.24);
        const ph = Math.min(300, rect.height * 0.54);
        const targetX = rect.width - (pw * 2 + 28);
        const targetY = (rect.height - ph) / 2;

        const layer = transitionRef.current;
        const layerOverlay = layer.querySelector(".transition-overlay") as HTMLElement;
        const img = layer.querySelector("img") as HTMLImageElement;
        if (!img) return;

        setIsAnimating(true);
        img.src = current.image;
        img.alt = current.title;

        const tl = gsap.timeline({
            onComplete: () => {
                gsap.set(layer, { display: "none", clearProps: "all" });
                if (layerOverlay) gsap.set(layerOverlay, { clearProps: "all" });
                setIsAnimating(false);
            },
        });

        tl.to(contentRef.current, { opacity: 0, y: -18, duration: 0.22, ease: "power2.in" })

          .call(() => setActiveIndex(prevIndex))

          .set(layer, {
              display: "block",
              opacity: 1,
              x: 0,
              y: 0,
              width: rect.width,
              height: rect.height,
              borderRadius: 26,
          })
          .set(layerOverlay, { opacity: 1 })

          .to(layerOverlay, { opacity: 0, duration: 0.3, ease: "power2.in" })
          .to(layer, {
              x: targetX,
              y: targetY,
              width: pw,
              height: ph,
              borderRadius: 24,
              opacity: 0,
              duration: 0.65,
              ease: "power3.inOut",
          }, "-=0.15")

          .fromTo(contentRef.current,
              { opacity: 0, y: 28 },
              { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
              "-=0.25"
          );
    }, [activeIndex, isAnimating]);

    useEffect(() => {
        const interval = window.setInterval(() => {
            animateNext();
        }, 5500);

        return () => window.clearInterval(interval);
    }, [animateNext]);

    return (
        <section ref={sectionRef} className="events-section bg-[#F1F1F1] py-20 lg:py-32">
            <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
                <div className="events-header text-center mb-16 lg:mb-20">
                    <h2 className="text-display-lg text-[#0D0D0D] mb-4">NOSSOS EVENTOS</h2>
                    <p className="text-sm italic text-[#555] tracking-wide uppercase">
                        Experiências que conectam e transformam
                    </p>
                </div>

                <div ref={carouselRef} className="events-carousel relative h-[460px] md:h-[520px] rounded-[26px] overflow-hidden shadow-[0_30px_55px_rgba(0,0,0,0.2)]">
                    <img
                        src={currentEvent.image}
                        alt={currentEvent.title}
                        className="absolute inset-0 w-full h-full object-cover scale-[1.05]"
                    />
                    <div ref={overlayRef} className="absolute inset-0 bg-[radial-gradient(circle_at_60%_55%,rgba(120,170,255,0.2),transparent_35%),linear-gradient(90deg,rgba(6,10,12,0.9)_0%,rgba(8,12,16,0.76)_45%,rgba(8,12,16,0.48)_70%,rgba(8,12,16,0.7)_100%)]" />

                    <div className="absolute inset-0 z-10 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center px-8 md:px-14">
                        <div ref={contentRef} className="max-w-[460px]">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/12 backdrop-blur-md border border-white/25 rounded-full text-[11px] font-semibold tracking-[0.2em] text-white uppercase mb-5">
                                <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
                                {currentEvent.badge}
                            </span>
                            <h3 className="text-[44px] leading-[0.98] font-display font-semibold text-white mb-3 uppercase">
                                {currentEvent.category}
                            </h3>
                            <p className="text-[33px] md:text-[30px] leading-[1.25] text-white/86 mb-6">
                                {currentEvent.description}
                            </p>
                            <a
                                href="#"
                                className="inline-flex items-center gap-2 px-7 py-3 rounded-[12px] bg-white/80 hover:bg-white text-[#0F1114] text-[28px] font-semibold transition-all"
                            >
                                {currentEvent.cta}
                            </a>
                        </div>

                        <div className="hidden md:flex items-center gap-4 lg:gap-6 pr-2">
                            {previewEvents.map((event) => (
                                <div
                                    key={`preview-${event.id}`}
                                    className="relative w-[200px] h-[280px] rounded-[24px] overflow-hidden border border-white/20 shadow-[0_18px_40px_rgba(0,0,0,0.4)]"
                                >
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        ref={transitionRef}
                        className="absolute top-0 left-0 z-30 hidden overflow-hidden border border-white/30 shadow-[0_20px_45px_rgba(0,0,0,0.35)] pointer-events-none"
                    >
                        <img
                            src={currentEvent.image}
                            alt={currentEvent.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="transition-overlay absolute inset-0 bg-[linear-gradient(90deg,rgba(6,10,12,0.9)_0%,rgba(8,12,16,0.76)_45%,rgba(8,12,16,0.48)_70%,rgba(8,12,16,0.7)_100%)]" />
                    </div>

                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                        <button
                            onClick={animatePrev}
                            disabled={isAnimating}
                            className="w-10 h-10 rounded-[10px] border-2 border-black/50 bg-white/65 hover:bg-white transition-all flex items-center justify-center"
                            aria-label="Evento anterior"
                        >
                            <ArrowLeft className="w-4 h-4 text-black" />
                        </button>
                        <button
                            onClick={animateNext}
                            disabled={isAnimating}
                            className="w-10 h-10 rounded-[10px] border-2 border-black/50 bg-white/65 hover:bg-white transition-all flex items-center justify-center"
                            aria-label="Próximo evento"
                        >
                            <ArrowRight className="w-4 h-4 text-black" />
                        </button>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-center gap-2">
                    {EVENTS.map((event, idx) => (
                        <button
                            key={event.id}
                            onClick={() => setActiveIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? "w-8 bg-[#0D0D0D]" : "w-4 bg-[#0D0D0D]/30 hover:bg-[#0D0D0D]/50"}`}
                            aria-label={`Ir para evento ${event.title}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

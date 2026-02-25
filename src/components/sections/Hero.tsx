"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import {
    ArrowRight,
    ArrowUpRight,
    BriefcaseBusiness,
    CalendarDays,
    ChevronDown,
    CircleDot,
    Globe,
    GraduationCap,
} from "lucide-react";

const tabs = [
    {
        id: "visao-geral",
        label: "Visao Geral",
        title: "Formamos os Lideres que\nTransformam o Setor Publico",
        description: "O ecossistema completo de educacao executiva, inovacao, tecnologia e IA para modernizar instituicoes e formar lideres preparados para os desafios do futuro.",
        eyebrow: "ECOSSISTEMA DE EDUCACAO PARA O SETOR PUBLICO",
        primaryCta: "Conheca Nossos Programas",
        secondaryCta: "Fale com um Especialista",
        icon: CircleDot,
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: "academy",
        label: "Academy",
        title: "Trilhas de Desenvolvimento\npara Servidores Publicos",
        description: "Cursos presenciais e online com os maiores especialistas do Brasil. Formacao executiva com certificacao reconhecida e metodologia aplicada.",
        eyebrow: "PLENUM ACADEMY",
        primaryCta: "Explore as Trilhas",
        secondaryCta: "Ver Agenda de Cursos",
        icon: GraduationCap,
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1800",
    },
    {
        id: "corporativa",
        label: "Ed. Corporativa",
        title: "Capacitacao Sob Medida\npara sua Instituicao",
        description: "Programas customizados B2G/B2B com trilhas de desenvolvimento em escala, mentoria e relatorios de progresso.",
        eyebrow: "PLENUM ED. CORPORATIVA",
        primaryCta: "Conheca a Plataforma",
        secondaryCta: "Solicitar Proposta",
        icon: BriefcaseBusiness,
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1800",
    },
    {
        id: "events",
        label: "Events",
        title: "Seminarios e Congressos\nque Reunem o Setor Publico",
        description: "Os maiores eventos de contratacoes, gestao e inovacao publica do pais. Networking premium com lideres e especialistas.",
        eyebrow: "PLENUM EVENTS",
        primaryCta: "Veja a Agenda",
        secondaryCta: "Inscreva-se Agora",
        icon: CalendarDays,
        image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1800",
    },
    {
        id: "consultoria",
        label: "Consultoria",
        title: "Solucoes Estrategicas\npara a Gestao Publica",
        description: "Diagnostico, implementacao e acompanhamento especializado. Projetos de modernizacao com resultados mensuraveis.",
        eyebrow: "PLENUM CONSULTORIA",
        primaryCta: "Nossas Solucoes",
        secondaryCta: "Agendar Diagnostico",
        icon: BriefcaseBusiness,
        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1800",
    },
    {
        id: "international",
        label: "International",
        title: "Imersões Globais\npara Lideres Publicos",
        description: "Experiencias internacionais em parceria com escolas de governo do mundo. Programas em China, Europa e America do Norte.",
        eyebrow: "PLENUM INTERNATIONAL",
        primaryCta: "Explore as Imersões",
        secondaryCta: "Proximas Turmas",
        icon: Globe,
        image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?auto=format&fit=crop&q=80&w=1800",
    },
];

export default function Hero() {
    const heroRef = useRef<HTMLElement>(null);
    const [activeTab, setActiveTab] = useState(0);
    const [progress, setProgress] = useState(0);
    const autoAdvanceDelay = 6000; // 6 seconds per tab
    const [isHovered, setIsHovered] = useState(false);

    // Initial animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ delay: 0.2 });

            tl.fromTo(".hero-bg-overlay",
                { opacity: 0 },
                { opacity: 0.7, duration: 1.5, ease: "power2.inOut" }
            )
                .from(".hero-line", {
                    y: 60,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power3.out"
                }, "-=1")
                .from(".hero-subtitle", {
                    y: 20,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out"
                }, "-=0.6")
                .from(".hero-cta", {
                    y: 20,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out"
                }, "-=0.6")
                .from(".hero-tabs", {
                    y: 40,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out"
                }, "-=0.4");
        }, heroRef);

        return () => ctx.revert();
    }, []);

    // Auto-advance tabs
    useEffect(() => {
        if (isHovered) return;

        const interval = setInterval(() => {
            setActiveTab((prev) => (prev + 1) % tabs.length);
            setProgress(0);
        }, autoAdvanceDelay);

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 100;
                return prev + (100 / (autoAdvanceDelay / 50));
            });
        }, 50);

        return () => {
            clearInterval(interval);
            clearInterval(progressInterval);
        };
    }, [activeTab, isHovered]);

    // Animate tab content change
    useEffect(() => {
        gsap.fromTo(".hero-slide-content",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }
        );
        setProgress(0);
    }, [activeTab]);

    const currentTab = tabs[activeTab];
    const CurrentIcon = currentTab.icon;

    return (
        <section ref={heroRef} className="relative h-screen min-h-[800px] w-full flex flex-col justify-end bg-black overflow-hidden pt-24 pb-0">

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div
                    key={currentTab.id}
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
                    style={{ backgroundImage: `url(${currentTab.image})` }}
                />
                <div className="hero-bg-overlay absolute inset-0 bg-gradient-to-t from-[rgba(5,7,10,0.93)] via-[rgba(5,7,10,0.55)] to-[rgba(5,7,10,0.38)] z-0"></div>
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 mb-[190px] md:mb-[170px]">
                <div className="hero-slide-content">
                    <div className="hero-subtitle mb-5">
                        <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/25 bg-[rgba(255,255,255,0.08)] backdrop-blur-lg">
                            <CurrentIcon className="w-3.5 h-3.5 text-white/85" />
                            <span className="text-[11px] md:text-[13px] tracking-[0.22em] uppercase text-white/85 font-semibold">
                                {currentTab.eyebrow}
                            </span>
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] gap-8 lg:gap-14 items-end">
                        <div>
                            <h1 className="hero-line whitespace-pre-line font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-white text-[34px] md:text-[42px] leading-[1.05] tracking-[-0.02em]">
                                {currentTab.title}
                            </h1>

                            <div className="hero-cta mt-7 flex flex-wrap items-center gap-3">
                                <a
                                    href="#programas"
                                    className="group inline-flex items-center justify-center gap-2.5 h-[58px] min-w-[300px] px-8 rounded-full bg-white text-[#0F172A] border border-white/90 font-semibold text-[15px] tracking-[0.01em] transition-all duration-300 hover:translate-y-[-1px] hover:bg-white/95"
                                >
                                    <span>{currentTab.primaryCta}</span>
                                    <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </a>
                                <a
                                    href="#programas"
                                    className="group inline-flex items-center justify-center gap-2.5 h-[58px] min-w-[220px] px-8 rounded-full bg-[rgba(9,12,18,0.42)] border border-white/25 text-white text-[15px] font-semibold tracking-[0.01em] transition-all duration-300 hover:bg-[rgba(9,12,18,0.56)] hover:border-white/45"
                                >
                                    {currentTab.secondaryCta}
                                    <ChevronDown className="w-4 h-4 text-white/85 transition-transform duration-300 group-hover:translate-y-[1px]" />
                                </a>
                            </div>
                        </div>

                        <div className="lg:pb-2">
                            <p className="text-[18px] md:text-[20px] text-white/84 font-body leading-[1.45] max-w-[620px]">
                                {currentTab.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom navigation */}
            <div
                className="hero-tabs absolute bottom-0 inset-x-0 z-10 w-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="w-full px-0 pb-0">
                    <div className="hero-bottom-nav rounded-t-[24px] overflow-hidden border border-white/15 bg-[rgba(4,7,10,0.45)] backdrop-blur-xl">
                        <div className="h-[1px] w-full bg-white/10"></div>
                        <div className="flex items-stretch overflow-x-auto hide-scrollbar">
                            {tabs.map((tab, index) => {
                                const isActive = index === activeTab;
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab(index);
                                            setProgress(0);
                                        }}
                                        className={`relative min-w-[180px] md:min-w-0 md:flex-1 h-[58px] px-4 inline-flex items-center justify-center gap-2 border-r border-white/10 transition-all duration-300 ${isActive
                                            ? "text-white bg-[rgba(255,255,255,0.06)]"
                                            : "text-white/65 hover:text-white/90 hover:bg-[rgba(255,255,255,0.03)]"
                                            }`}
                                    >
                                        <Icon className="w-4 h-4 shrink-0" />
                                        <span className="text-[13px] font-medium whitespace-nowrap">{tab.label}</span>
                                        <div
                                            className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-300 ${isActive ? "w-full opacity-100" : "w-0 opacity-0"
                                                }`}
                                        />
                                        {isActive && (
                                            <div
                                                className="absolute bottom-0 left-0 h-[2px] bg-white/80 transition-all duration-75 ease-linear"
                                                style={{ width: `${progress}%` }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

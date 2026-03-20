"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { gsap } from "@/lib/gsap";

const CATEGORIES = [
    "Todos",
    "Gestão Pública",
    "Licitações e Contratos",
    "Legislativo",
    "Governança",
    "IA e Tecnologia",
    "Liderança",
    "Finanças Públicas",
];

const COURSES = [
    {
        id: 1,
        title: "Relacionamento Governamental e Captação de Recursos",
        category: "Gestão Pública",
        badge: "CURSO EXECUTIVO",
        location: "Brasília | DF",
        date: "14 e 15 de Maio",
        image: "/fotocursoteste.jpg",
        url: "https://modelolpcursoplenum.vercel.app/",
    },
    {
        id: 2,
        title: "Nova Lei de Licitações PRO",
        category: "Licitações e Contratos",
        badge: "FORMAÇÃO AVANÇADA",
        location: "Brasília | DF",
        date: "20 a 22 de Maio",
        image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2070&auto=format&fit=crop",
        url: "#",
    },
    {
        id: 3,
        title: "Governança Corporativa no Setor Público",
        category: "Governança",
        badge: "SEMINÁRIO",
        location: "Brasília | DF",
        date: "02 e 03 de Junho",
        image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2070&auto=format&fit=crop",
        url: "#",
    },
    {
        id: 4,
        title: "IA Aplicada ao Setor Público",
        category: "IA e Tecnologia",
        badge: "IMERSÃO TECH",
        location: "Brasília | DF",
        date: "10 a 12 de Junho",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
        url: "#",
    },
    {
        id: 5,
        title: "Liderança em Organizações Públicas",
        category: "Liderança",
        badge: "PROGRAMA EXECUTIVO",
        location: "Belo Horizonte | MG",
        date: "17 e 18 de Junho",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
        url: "#",
    },
    {
        id: 6,
        title: "Compras e Contratações Públicas",
        category: "Licitações e Contratos",
        badge: "CICLO EXECUTIVO",
        location: "Brasília | DF",
        date: "24 e 25 de Junho",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
        url: "#",
    },
    {
        id: 7,
        title: "Finanças Públicas e Orçamento",
        category: "Finanças Públicas",
        badge: "FORMAÇÃO",
        location: "Brasília | DF",
        date: "01 a 03 de Julho",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop",
        url: "#",
    },
    {
        id: 8,
        title: "Gestão por Resultados e Indicadores",
        category: "Gestão Pública",
        badge: "WORKSHOP",
        location: "Belo Horizonte | MG",
        date: "08 e 09 de Julho",
        image: "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2070&auto=format&fit=crop",
        url: "#",
    },
    {
        id: 9,
        title: "Processo Legislativo e Técnica Legislativa",
        category: "Legislativo",
        badge: "CURSO INTENSIVO",
        location: "Brasília | DF",
        date: "15 a 17 de Julho",
        image: "https://images.unsplash.com/photo-1577985043696-8bd54d9f093f?q=80&w=2070&auto=format&fit=crop",
        url: "#",
    },
];

export default function Academy() {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeCategory, setActiveCategory] = useState("Todos");

    const filteredCourses = activeCategory === "Todos"
        ? COURSES.slice(0, 9)
        : COURSES.filter(c => c.category === activeCategory).slice(0, 9);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".academy-header", {
                y: 40, opacity: 0, duration: 0.7, ease: "power3.out",
                scrollTrigger: { trigger: ".academy-section", start: "top 80%" }
            });
            gsap.from(".academy-grid", {
                y: 60, opacity: 0, duration: 0.9, ease: "power3.out",
                scrollTrigger: { trigger: ".academy-grid", start: "top 85%" }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="academy" ref={sectionRef} className="academy-section bg-[#F1F1F1] py-14 lg:py-32">
            <div className="max-w-[1280px] mx-auto px-4">
                {/* Header */}
                <div className="academy-header text-center mb-12 lg:mb-16">
                    <h2 className="text-display-lg text-[#030D1F] mb-6 lg:mb-10">NOSSOS CURSOS</h2>

                    {/* Filter chips - scrollable on mobile */}
                    <div className="overflow-x-auto hide-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
                        <div className="flex lg:flex-wrap lg:justify-center gap-2 lg:gap-3 min-w-max lg:min-w-0">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Course Grid — 3x3 — original card style */}
                <div className="academy-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                    {filteredCourses.map((course) => (
                        <a
                            key={course.id}
                            href={course.url}
                            className="group relative block h-[430px] sm:h-[470px] lg:h-[500px] rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                        >
                            {/* Background image */}
                            <img
                                src={course.image}
                                alt={course.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                draggable={false}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030D1F]/90 via-[#030D1F]/30 to-[#030D1F]/5" />

                            {/* Badge — tag do curso */}
                            <div className="absolute top-5 left-5 z-10">
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-semibold tracking-widest text-white uppercase">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                                    {course.badge}
                                </span>
                            </div>

                            {/* Bottom content — title, date, location, ver curso */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                                {/* Title */}
                                <h4 className="text-[20px] lg:text-[22px] font-display font-semibold text-white leading-tight mb-3">
                                    {course.title}
                                </h4>

                                {/* Date — prominent */}
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-[#C9A227]" />
                                    <span className="text-[15px] font-semibold text-white tracking-wide">
                                        {course.date}
                                    </span>
                                </div>

                                {/* Location — same size as date */}
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="w-4 h-4 text-[#C9A227]" />
                                    <span className="text-[15px] font-semibold text-white tracking-wide">
                                        {course.location}
                                    </span>
                                </div>

                                {/* Ver Curso — aligned right */}
                                <div className="flex justify-end">
                                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/25 rounded-full text-[12px] font-semibold text-white tracking-wider uppercase group-hover:bg-white/20 transition-all">
                                        Ver Curso <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Ver Todos */}
                <div className="text-center mt-12">
                    <a
                        href="/cursos"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#030D1F] text-[#030D1F] text-sm font-semibold uppercase tracking-wider hover:bg-[#030D1F] hover:text-white transition-all duration-300"
                    >
                        Ver Todos os Cursos
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}

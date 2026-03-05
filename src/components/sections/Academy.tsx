"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, ArrowRight, Calendar, MapPin } from "lucide-react";
import { gsap } from "@/lib/gsap";

const CATEGORIES = ["Todos", "Gestão", "Licitações", "Legislativo", "Governança", "IA Pública"];

const COURSES = [
    {
        id: 1,
        title: "Relacionamento Governamental e Captação de Recursos",
        category: "GESTÃO",
        badge: "IMERSÃO",
        professor: "Daniel Angotti",
        professorImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop",
        image: "/fotocursoteste.jpg",
    },
    {
        id: 2,
        title: "Nova Lei de Licitações PRO",
        category: "LICITAÇÕES",
        badge: "SEMINÁRIO",
        students: "+350",
        image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "Governança Corporativa",
        category: "GOVERNANÇA",
        badge: "GESTÃO",
        students: "+200",
        image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 4,
        title: "IA Aplicada ao Setor Público",
        category: "IA PÚBLICA",
        badge: "IMERSÃO",
        students: "+280",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 5,
        title: "Liderança em Organizações Públicas",
        category: "GESTÃO",
        badge: "SEMINÁRIO",
        students: "+500",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    },
];

export default function Academy() {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [position, setPosition] = useState(0);

    const filteredCourses = COURSES.filter(c =>
        activeCategory === "Todos" || c.category.toLowerCase().includes(activeCategory.toLowerCase())
    );

    // Reset carousel position when filter changes
    const handleFilter = useCallback((cat: string) => {
        setActiveCategory(cat);
        setPosition(0);
    }, []);

    const goNext = useCallback(() => {
        setPosition(prev => Math.min(prev + 1, filteredCourses.length - 1));
    }, [filteredCourses.length]);

    const goPrev = useCallback(() => {
        setPosition(prev => Math.max(prev - 1, 0));
    }, []);

    // Scroll-triggered entrance
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".academy-header", {
                y: 40, opacity: 0, duration: 0.7, ease: "power3.out",
                scrollTrigger: { trigger: ".academy-section", start: "top 80%" }
            });
            gsap.from(".academy-carousel-wrapper", {
                y: 60, opacity: 0, duration: 0.9, ease: "power3.out",
                scrollTrigger: { trigger: ".academy-carousel-wrapper", start: "top 85%" }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    // Preload images
    useEffect(() => {
        COURSES.forEach((course) => {
            const img = new Image();
            img.src = course.image;
        });
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [goNext, goPrev]);

    return (
        <section id="academy" ref={sectionRef} className="academy-section bg-[#F1F1F1] py-20 lg:py-32">
            <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
                {/* Section header */}
                <div className="academy-header text-center mb-12 lg:mb-16">
                    <h2 className="text-display-lg text-[#0D0D0D] mb-4">NOSSOS CURSOS</h2>
                    <p className="text-sm italic text-[#555] tracking-wide uppercase mb-10">
                        Treinamentos feitos por quem entende do setor público
                    </p>

                    {/* Filter chips */}
                    <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => handleFilter(cat)}
                                className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3D Perspective Carousel */}
                <div className="academy-carousel-wrapper">
                    <div
                        className="carousel-3d"
                        style={{
                            "--items": filteredCourses.length,
                            "--active": position + 1,
                        } as React.CSSProperties}
                    >
                        {filteredCourses.map((course, index) => {
                            const offset = index + 1;
                            const r = (position + 1) - offset;
                            const absR = Math.abs(r);
                            const isCurrent = r === 0;

                            return (
                                <div
                                    key={course.id}
                                    className="carousel-3d-item"
                                    style={{ "--offset": offset } as React.CSSProperties}
                                    onClick={() => !isCurrent && setPosition(index)}
                                >
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        draggable={false}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />

                                    {/* Badge - shows course type (Imersão, Seminário, Gestão...) */}
                                    <div className="absolute top-5 left-5 z-10">
                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-semibold tracking-widest text-white uppercase">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                                            {course.badge}
                                        </span>
                                    </div>

                                    {/* Card content */}
                                    <div
                                        className="absolute bottom-0 left-0 right-0 p-6 z-10 transition-opacity duration-300"
                                        style={{ opacity: isCurrent ? 1 : absR <= 1 ? 0.3 : 0 }}
                                    >
                                        <p className="text-[10px] text-white/45 uppercase tracking-widest font-medium mb-1.5">
                                            {course.category}
                                        </p>
                                        <h3 className="text-lg lg:text-xl font-display font-medium text-white mb-3 leading-tight">
                                            {course.title}
                                        </h3>
                                        <div className="flex flex-col gap-1 mb-4">
                                            <span className="inline-flex items-center gap-1.5 text-[12px] text-white/70">
                                                <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
                                                14 e 15 de maio
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 text-[12px] text-white/70">
                                                <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                                                Brasília | DF
                                            </span>
                                        </div>

                                        {isCurrent && (
                                            <a href={course.id === 1 ? "https://modelolpcursoplenum.vercel.app/" : "#"} className="inline-flex items-center gap-2 px-4 py-2 bg-transparent border border-white/25 rounded-full text-[11px] font-medium text-white tracking-wider uppercase hover:bg-white/10 transition-all">
                                                Ver Curso <ArrowRight className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-3 mt-8">
                        <button
                            onClick={goPrev}
                            disabled={position === 0}
                            className="w-10 h-10 rounded-[10px] border-2 border-black/15 bg-white hover:bg-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                            aria-label="Curso anterior"
                        >
                            <ArrowLeft className="w-4 h-4 text-black" />
                        </button>

                        <div className="flex items-center gap-2 mx-3">
                            {filteredCourses.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setPosition(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === position ? "w-8 bg-[#0D0D0D]" : "w-4 bg-[#0D0D0D]/25 hover:bg-[#0D0D0D]/50"}`}
                                    aria-label={`Ir para curso ${idx + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={goNext}
                            disabled={position >= filteredCourses.length - 1}
                            className="w-10 h-10 rounded-[10px] border-2 border-black/15 bg-white hover:bg-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                            aria-label="Próximo curso"
                        >
                            <ArrowRight className="w-4 h-4 text-black" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";

const CATEGORIES = ["Todos", "Gestão", "Licitações", "Legislativo", "Governança", "IA Pública"];

const COURSES = [
    {
        id: 1,
        title: "Gestão de Contratos Públicos",
        category: "GESTÃO",
        students: "+400",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 2,
        title: "Nova Lei de Licitações PRO",
        category: "LICITAÇÕES",
        students: "+350",
        image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "Governança Corporativa",
        category: "GOVERNANÇA",
        students: "+200",
        image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 4,
        title: "IA Aplicada ao Setor Público",
        category: "IA PÚBLICA",
        students: "+280",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 5,
        title: "Liderança em Organizações Públicas",
        category: "GESTÃO",
        students: "+500",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    },
];

export default function Academy() {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeCategory, setActiveCategory] = useState("Todos");

    const filteredCourses = COURSES.filter(c =>
        activeCategory === "Todos" || c.category.toLowerCase().includes(activeCategory.toLowerCase())
    );

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".academy-header", {
                y: 40, opacity: 0, duration: 0.7, ease: "power3.out",
                scrollTrigger: { trigger: ".academy-section", start: "top 80%" }
            });

            gsap.from(".course-card", {
                opacity: 0, y: 60, duration: 0.8, stagger: 0.12, ease: "power3.out",
                scrollTrigger: { trigger: ".courses-grid", start: "top 80%" }
            });

            document.querySelectorAll(".course-card").forEach(card => {
                const img = card.querySelector(".course-card-img");
                card.addEventListener("mouseenter", () => {
                    gsap.to(card, { y: -8, duration: 0.3, ease: "power2.out" });
                    gsap.to(img, { scale: 1.05, duration: 0.6, ease: "power2.out" });
                });
                card.addEventListener("mouseleave", () => {
                    gsap.to(card, { y: 0, duration: 0.4 });
                    gsap.to(img, { scale: 1, duration: 0.6 });
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const updateFilter = (cat: string) => {
        gsap.to(".course-card", {
            opacity: 0, y: 10, duration: 0.2, stagger: 0.03,
            onComplete: () => {
                setActiveCategory(cat);
                setTimeout(() => {
                    gsap.fromTo(".course-card",
                        { opacity: 0, y: 30 },
                        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out", clearProps: "all" }
                    );
                }, 50);
            }
        });
    };

    return (
        <section ref={sectionRef} className="academy-section bg-[#F1F1F1] py-20 lg:py-32">
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
                                onClick={() => updateFilter(cat)}
                                className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2-column grid — HA style */}
                <div className="courses-grid grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                    {filteredCourses.map((course) => (
                        <div
                            key={course.id}
                            className="course-card relative rounded-[24px] overflow-hidden cursor-pointer group"
                            style={{ aspectRatio: "4/3" }}
                        >
                            <img
                                src={course.image}
                                alt={course.title}
                                className="course-card-img absolute inset-0 w-full h-full object-cover transform-gpu"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

                            {/* Badge */}
                            <div className="absolute top-6 left-6 z-10">
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-[11px] font-semibold tracking-widest text-white uppercase">
                                    <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
                                    PLENUM
                                </span>
                            </div>

                            {/* Bottom content */}
                            <div className="absolute bottom-0 left-0 right-0 p-7 lg:p-8 z-10">
                                <div className="flex items-center mb-4">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur border-2 border-white/30" />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-xs text-white/70 font-medium">{course.students}</span>
                                </div>

                                <p className="text-[11px] text-white/60 uppercase tracking-widest font-semibold mb-2">
                                    {course.category}
                                </p>
                                <h3 className="text-xl lg:text-2xl font-display font-medium text-white mb-5 leading-tight">
                                    {course.title}
                                </h3>

                                <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent border border-white/25 rounded-full text-[12px] font-medium text-white tracking-wider uppercase hover:bg-white/10 transition-all">
                                    Ver Cursos <ArrowRight className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

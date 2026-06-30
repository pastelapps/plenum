"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { AUDIENCES, COURSES } from "@/lib/plenum-content";

const FILTERS = ["Todos", ...AUDIENCES];
const FEATURED_COURSE_IDS = [7, 2, 5];
const FEATURED_COURSES = FEATURED_COURSE_IDS
    .map((id) => COURSES.find((course) => course.id === id))
    .filter((course): course is (typeof COURSES)[number] => Boolean(course));

export default function Academy() {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeAudience, setActiveAudience] = useState("Todos");

    const filteredCourses = activeAudience === "Todos"
        ? FEATURED_COURSES
        : COURSES.filter((course) => course.audiences.includes(activeAudience)).slice(0, 3);

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
                <div className="academy-header text-center mb-12 lg:mb-16">
                    <p className="text-label text-[#8a6e1a] mb-3">Plenum Academy</p>
                    <h2 className="text-display-lg text-[#030D1F] mb-4">Formação executiva para todas as esferas do setor público</h2>
                    <p className="text-body text-[#555] max-w-2xl mx-auto mb-8">
                        Cursos presenciais e híbridos para servidores, lideranças, municípios, órgãos de controle, estatais e legislativos.
                    </p>
                    <div className="overflow-x-auto hide-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
                        <div className="flex lg:flex-wrap lg:justify-center gap-2 lg:gap-3 min-w-max lg:min-w-0">
                            {FILTERS.map((audience) => (
                                <button
                                    key={audience}
                                    onClick={() => setActiveAudience(audience)}
                                    className={`filter-chip ${activeAudience === audience ? "active" : ""}`}
                                >
                                    {audience}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="academy-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                    {filteredCourses.map((course) => (
                        <a
                            key={course.id}
                            href={course.url}
                            className="group relative block h-[450px] sm:h-[490px] lg:h-[520px] rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                        >
                            <img
                                src={course.image}
                                alt={course.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                draggable={false}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030D1F]/92 via-[#030D1F]/35 to-[#030D1F]/5" />

                            <div className="absolute top-5 left-5 right-5 z-10 flex items-start justify-between gap-3">
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-semibold tracking-widest text-white uppercase">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                                    {course.area}
                                </span>
                                <span className="inline-flex px-3 py-1.5 bg-[#030D1F]/45 border border-white/15 rounded-full text-[10px] font-semibold tracking-wider uppercase text-white/80">
                                    {course.modality}
                                </span>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                                <p className="text-[12px] text-white/50 mb-2">{course.professor}</p>
                                <h4 className="text-[20px] lg:text-[23px] font-display font-semibold text-white leading-tight mb-3">
                                    {course.title}
                                </h4>
                                <p className="text-[13px] text-white/60 leading-relaxed mb-4">{course.description}</p>

                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-[#C9A227]" />
                                    <span className="text-[14px] font-semibold text-white tracking-wide">
                                        {course.date} · {course.workload}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="w-4 h-4 text-[#C9A227]" />
                                    <span className="text-[14px] font-semibold text-white tracking-wide">
                                        {course.location}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-1.5 mb-5">
                                    {course.audiences.map((audience) => (
                                        <span key={audience} className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] text-white/70">
                                            {audience}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex justify-end">
                                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/25 rounded-full text-[12px] font-semibold text-white tracking-wider uppercase group-hover:bg-white/20 transition-all">
                                        Ver Curso <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
                {filteredCourses.length === 0 && (
                    <div className="text-center text-sm text-[#555]">
                        Nenhum curso em destaque para este público-alvo.
                    </div>
                )}

                <div className="text-center mt-12">
                    <a href="/cursos" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#030D1F] text-[#030D1F] text-sm font-semibold uppercase tracking-wider hover:bg-[#030D1F] hover:text-white transition-all duration-300">
                        Ver todos os cursos
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}

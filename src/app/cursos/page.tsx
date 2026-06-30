"use client";
import { Suspense, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Calendar, ChevronDown, ChevronLeft, ChevronRight, MapPin, Search, SlidersHorizontal } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { AUDIENCES, COURSE_AREAS, COURSES } from "@/lib/plenum-content";

const MODALITIES = ["Todos", "Presencial", "Híbrido"];
const LOCATIONS = ["Todas", "Brasília", "Belo Horizonte"];
const AUDIENCE_FILTERS = ["Todos", ...AUDIENCES];
const AREA_FILTERS = ["Todas", ...COURSE_AREAS];
const COURSE_ORDER = [1, 3, 4, 2, 5, 6, 7];

function CursosContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const tipo = searchParams.get("tipo");

    const [activeAudience, setActiveAudience] = useState("Todos");
    const [activeArea, setActiveArea] = useState("Todas");
    const [activeModality, setActiveModality] = useState("Todos");
    const [activeLocation, setActiveLocation] = useState("Todas");
    const [activeMonth, setActiveMonth] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(query);
    const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
    const audienceScrollRef = useRef<HTMLDivElement>(null);

    const filtered = COURSES.filter((course) => {
        const audienceMatch = activeAudience === "Todos" || course.audiences.includes(activeAudience);
        const areaMatch = activeArea === "Todas" || course.area === activeArea;
        const modMatch = activeModality === "Todos" || course.modality === activeModality;
        const locMatch = activeLocation === "Todas" || course.city === activeLocation;
        const monthMatch = !activeMonth || course.month === activeMonth;
        const text = `${course.title} ${course.area} ${course.professor} ${course.description} ${course.audiences.join(" ")}`.toLowerCase();
        const searchMatch = !searchQuery || text.includes(searchQuery.toLowerCase());
        return audienceMatch && areaMatch && modMatch && locMatch && monthMatch && searchMatch;
    }).sort((a, b) => COURSE_ORDER.indexOf(a.id) - COURSE_ORDER.indexOf(b.id));

    const months = useMemo(() => [...new Set(COURSES.map((course) => course.month))], []);
    const hasActiveFilters = activeAudience !== "Todos" || activeArea !== "Todas" || activeModality !== "Todos" || activeLocation !== "Todas" || activeMonth !== null || searchQuery !== "";
    const clearAll = () => {
        setActiveAudience("Todos");
        setActiveArea("Todas");
        setActiveModality("Todos");
        setActiveLocation("Todas");
        setActiveMonth(null);
        setSearchQuery("");
    };

    return (
        <main className="bg-[#F1F1F1] text-[#030D1F] min-h-screen">
            <Header />

            <section className="relative overflow-hidden pt-32 lg:pt-40 pb-16 lg:pb-20 bg-[#030D1F]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,162,39,0.16),transparent_28%),linear-gradient(135deg,#030D1F,#08182d)]" />
                <div className="relative z-10 max-w-[1280px] mx-auto px-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/8 backdrop-blur-sm border border-white/12 rounded-full text-[10px] font-semibold tracking-[0.2em] text-white/70 uppercase mb-6 w-fit">
                        <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
                        {tipo === "seminario" ? "Seminários e congressos" : "Agenda 2026"}
                    </span>
                    <h1 className="text-display-lg text-white leading-[1.02] mb-4">
                        {tipo === "seminario" ? "Seminários e congressos" : "Todos os cursos"}
                    </h1>
                    <p className="text-white/55 text-base lg:text-lg max-w-2xl leading-relaxed">
                        Formações executivas presenciais e híbridas para administração pública, municípios, estatais, legislativos, judiciário e órgãos de controle.
                    </p>
                </div>
            </section>

            <div className="max-w-[1280px] mx-auto px-4 pt-10 relative z-20">
                <div className="bg-white rounded-[20px] border border-[#030D1F]/6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-5 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex items-center gap-3 flex-1 border-b lg:border-b-0 lg:border-r border-[#030D1F]/8 pb-4 lg:pb-0 lg:pr-6">
                            <Search className="w-5 h-5 text-[#888] shrink-0" />
                            <input type="text" placeholder="Buscar por nome, área, professor ou público..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent text-[#030D1F] text-sm outline-none placeholder:text-[#999]" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <SlidersHorizontal className="w-4 h-4 text-[#888]" />
                                <span className="text-sm text-[#555]"><span className="font-semibold text-[#030D1F]">{filtered.length}</span> cursos encontrados</span>
                            </div>
                            {hasActiveFilters && <button onClick={clearAll} className="text-xs text-[#1a4b8c] font-semibold hover:underline whitespace-nowrap">Limpar filtros</button>}
                        </div>
                    </div>
                </div>

                <div className="mb-5">
                    <p className="text-[11px] text-[#888] font-semibold uppercase tracking-wider mb-2 ml-1">Público-alvo</p>
                    <div className="relative">
                        <button onClick={() => audienceScrollRef.current?.scrollBy({ left: -220, behavior: "smooth" })} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-[#030D1F]/10 shadow-sm flex items-center justify-center hover:bg-[#f5f5f5] transition-all" aria-label="Voltar publicos">
                            <ChevronLeft className="w-4 h-4 text-[#555]" />
                        </button>
                        <div ref={audienceScrollRef} className="overflow-x-auto hide-scrollbar scroll-smooth">
                            <div className="flex gap-2 min-w-max px-12">
                                {AUDIENCE_FILTERS.map((audience) => (
                                    <button key={audience} onClick={() => setActiveAudience(audience)} className={`filter-chip ${activeAudience === audience ? "active" : ""}`}>{audience}</button>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => audienceScrollRef.current?.scrollBy({ left: 220, behavior: "smooth" })} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-[#030D1F]/10 shadow-sm flex items-center justify-center hover:bg-[#f5f5f5] transition-all" aria-label="Avancar publicos">
                            <ChevronRight className="w-4 h-4 text-[#555]" />
                        </button>
                    </div>
                </div>

                <div className="mb-5">
                    <p className="text-[11px] text-[#888] font-semibold uppercase tracking-wider mb-2 ml-1">Área</p>
                    <div className="flex flex-wrap gap-2">
                        {AREA_FILTERS.map((area) => (
                            <button key={area} onClick={() => setActiveArea(area)} className={`filter-chip ${activeArea === area ? "active" : ""}`}>{area}</button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    <div>
                        <p className="text-[11px] text-[#888] font-semibold uppercase tracking-wider mb-2 ml-1">Modalidade</p>
                        <div className="flex flex-wrap gap-2">
                            {MODALITIES.map((mod) => <button key={mod} onClick={() => setActiveModality(mod)} className={`filter-chip ${activeModality === mod ? "active" : ""}`}>{mod}</button>)}
                        </div>
                    </div>
                    <div>
                        <p className="text-[11px] text-[#888] font-semibold uppercase tracking-wider mb-2 ml-1">Local</p>
                        <div className="flex flex-wrap gap-2">
                            {LOCATIONS.map((loc) => <button key={loc} onClick={() => setActiveLocation(loc)} className={`filter-chip ${activeLocation === loc ? "active" : ""}`}>{loc}</button>)}
                        </div>
                    </div>
                    <div>
                        <p className="text-[11px] text-[#888] font-semibold uppercase tracking-wider mb-2 ml-1">Mês</p>
                        <div className="relative w-full">
                            <button onClick={() => setMonthDropdownOpen(!monthDropdownOpen)} className="w-full flex items-center justify-between px-5 py-3 bg-white rounded-[14px] border border-[#030D1F]/10 text-sm font-medium text-[#030D1F] hover:border-[#030D1F]/25 transition-all">
                                <span>{activeMonth || "Todos os meses"}</span>
                                <ChevronDown className={`w-4 h-4 text-[#888] transition-transform duration-200 ${monthDropdownOpen ? "rotate-180" : ""}`} />
                            </button>
                            {monthDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-30" onClick={() => setMonthDropdownOpen(false)} />
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[14px] border border-[#030D1F]/8 shadow-[0_12px_40px_rgba(0,0,0,0.12)] py-2 z-40 overflow-hidden">
                                        <button onClick={() => { setActiveMonth(null); setMonthDropdownOpen(false); }} className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${!activeMonth ? "bg-[#1a4b8c]/8 text-[#1a4b8c] font-semibold" : "text-[#333] hover:bg-[#f5f5f5]"}`}>Todos os meses</button>
                                        {months.map((month) => <button key={month} onClick={() => { setActiveMonth(month); setMonthDropdownOpen(false); }} className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${activeMonth === month ? "bg-[#1a4b8c]/8 text-[#1a4b8c] font-semibold" : "text-[#333] hover:bg-[#f5f5f5]"}`}>{month}</button>)}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-14">
                            {filtered.map((course) => (
                                <a key={course.id} href={course.url} className="group relative block h-[450px] sm:h-[490px] lg:h-[520px] rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                                    <img src={course.image} alt={course.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" draggable={false} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#030D1F]/92 via-[#030D1F]/35 to-[#030D1F]/5" />
                                    <div className="absolute top-5 left-5 right-5 z-10 flex items-start justify-between gap-3">
                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-semibold tracking-widest text-white uppercase"><span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />{course.area}</span>
                                        <span className="inline-flex px-3 py-1.5 bg-[#030D1F]/45 border border-white/15 rounded-full text-[10px] font-semibold tracking-wider uppercase text-white/80">{course.modality}</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                                        <p className="text-[12px] text-white/50 mb-2">{course.professor}</p>
                                        <h4 className="text-[20px] lg:text-[23px] font-display font-semibold text-white leading-tight mb-3">{course.title}</h4>
                                        <p className="text-[13px] text-white/60 leading-relaxed mb-4">{course.description}</p>
                                        <div className="flex items-center gap-2 mb-2"><Calendar className="w-4 h-4 text-[#C9A227]" /><span className="text-[14px] font-semibold text-white tracking-wide">{course.date} · {course.workload}</span></div>
                                        <div className="flex items-center gap-2 mb-4"><MapPin className="w-4 h-4 text-[#C9A227]" /><span className="text-[14px] font-semibold text-white tracking-wide">{course.location}</span></div>
                                        <div className="flex flex-wrap gap-1.5 mb-5">
                                            {course.audiences.map((audience) => <span key={audience} className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] text-white/70">{audience}</span>)}
                                        </div>
                                        <div className="flex justify-end"><span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/25 rounded-full text-[12px] font-semibold text-white tracking-wider uppercase group-hover:bg-white/20 transition-all">Ver Curso <ArrowRight className="w-3.5 h-3.5" /></span></div>
                                    </div>
                                </a>
                            ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-lg text-[#555]">Nenhum curso encontrado para os filtros selecionados.</p>
                        <button onClick={clearAll} className="mt-4 text-[#1a4b8c] font-semibold underline">Limpar filtros</button>
                    </div>
                )}
                <div className="pb-10" />
            </div>
            <Footer />
        </main>
    );
}

export default function CursosPage() {
    return (
        <Suspense fallback={<div className="bg-[#F1F1F1] min-h-screen" />}>
            <CursosContent />
        </Suspense>
    );
}

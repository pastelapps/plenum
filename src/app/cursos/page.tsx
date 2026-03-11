"use client";
import { useState } from "react";
import { ArrowRight, Calendar, MapPin, Search, SlidersHorizontal } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";

const SEGMENTS = [
    "Todos",
    "Administração Pública",
    "Municípios",
    "Legislativo",
    "Tribunais",
    "Estatais",
    "Sistema S",
    "Órgãos de Controle",
    "Conselhos Profissionais",
    "Empresas Privadas",
];

const MODALITIES = ["Todos", "Presencial", "Híbrido"];
const LOCATIONS = ["Todas", "Brasília", "Belo Horizonte"];

const ALL_COURSES = [
    // Maio
    { id: 1, title: "Relacionamento Governamental e Captação de Recursos", segment: "Administração Pública", modality: "Presencial", city: "Brasília", tag: "CURSO EXECUTIVO", location: "Brasília | DF", date: "14 e 15 de Maio", month: "Maio 2026", image: "/fotocursoteste.jpg", url: "https://modelolpcursoplenum.vercel.app/" },
    { id: 2, title: "Nova Lei de Licitações PRO", segment: "Tribunais", modality: "Presencial", city: "Brasília", tag: "FORMAÇÃO AVANÇADA", location: "Brasília | DF", date: "20 a 22 de Maio", month: "Maio 2026", image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2070&auto=format&fit=crop", url: "#" },
    { id: 3, title: "Gestão de Pessoas no Setor Público", segment: "Administração Pública", modality: "Híbrido", city: "Brasília", tag: "WORKSHOP", location: "Brasília | DF", date: "27 e 28 de Maio", month: "Maio 2026", image: "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2070&auto=format&fit=crop", url: "#" },
    // Junho
    { id: 4, title: "Governança Corporativa no Setor Público", segment: "Estatais", modality: "Presencial", city: "Brasília", tag: "SEMINÁRIO", location: "Brasília | DF", date: "02 e 03 de Junho", month: "Junho 2026", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2070&auto=format&fit=crop", url: "#" },
    { id: 5, title: "IA Aplicada ao Setor Público", segment: "Administração Pública", modality: "Híbrido", city: "Brasília", tag: "IMERSÃO TECH", location: "Brasília | DF", date: "10 a 12 de Junho", month: "Junho 2026", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop", url: "#" },
    { id: 6, title: "Liderança em Organizações Públicas", segment: "Municípios", modality: "Presencial", city: "Belo Horizonte", tag: "PROGRAMA EXECUTIVO", location: "Belo Horizonte | MG", date: "17 e 18 de Junho", month: "Junho 2026", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop", url: "#" },
    { id: 7, title: "Compras e Contratações Públicas", segment: "Órgãos de Controle", modality: "Presencial", city: "Brasília", tag: "CICLO EXECUTIVO", location: "Brasília | DF", date: "24 e 25 de Junho", month: "Junho 2026", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop", url: "#" },
    // Julho
    { id: 8, title: "Finanças Públicas e Orçamento", segment: "Administração Pública", modality: "Presencial", city: "Brasília", tag: "FORMAÇÃO", location: "Brasília | DF", date: "01 a 03 de Julho", month: "Julho 2026", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop", url: "#" },
    { id: 9, title: "Gestão por Resultados e Indicadores", segment: "Municípios", modality: "Presencial", city: "Belo Horizonte", tag: "WORKSHOP", location: "Belo Horizonte | MG", date: "08 e 09 de Julho", month: "Julho 2026", image: "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2070&auto=format&fit=crop", url: "#" },
    { id: 10, title: "Processo Legislativo e Técnica Legislativa", segment: "Legislativo", modality: "Presencial", city: "Brasília", tag: "CURSO INTENSIVO", location: "Brasília | DF", date: "15 a 17 de Julho", month: "Julho 2026", image: "https://images.unsplash.com/photo-1577985043696-8bd54d9f093f?q=80&w=2070&auto=format&fit=crop", url: "#" },
    { id: 11, title: "Transformação Digital no Governo", segment: "Sistema S", modality: "Híbrido", city: "Brasília", tag: "CONGRESSO", location: "Brasília | DF", date: "22 a 24 de Julho", month: "Julho 2026", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop", url: "#" },
    // Agosto
    { id: 12, title: "Compliance e Integridade Pública", segment: "Conselhos Profissionais", modality: "Presencial", city: "Brasília", tag: "FORMAÇÃO", location: "Brasília | DF", date: "05 e 06 de Agosto", month: "Agosto 2026", image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2070&auto=format&fit=crop", url: "#" },
    { id: 13, title: "Gestão de Contratos Administrativos", segment: "Empresas Privadas", modality: "Presencial", city: "Belo Horizonte", tag: "CURSO PRÁTICO", location: "Belo Horizonte | MG", date: "12 a 14 de Agosto", month: "Agosto 2026", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop", url: "#" },
    { id: 14, title: "Planejamento Estratégico Governamental", segment: "Administração Pública", modality: "Presencial", city: "Brasília", tag: "PROGRAMA EXECUTIVO", location: "Brasília | DF", date: "19 e 20 de Agosto", month: "Agosto 2026", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop", url: "#" },
];

export default function CursosPage() {
    const [activeSegment, setActiveSegment] = useState("Todos");
    const [activeModality, setActiveModality] = useState("Todos");
    const [activeLocation, setActiveLocation] = useState("Todas");
    const [activeMonth, setActiveMonth] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = ALL_COURSES.filter(c => {
        const segMatch = activeSegment === "Todos" || c.segment === activeSegment;
        const modMatch = activeModality === "Todos" || c.modality === activeModality;
        const locMatch = activeLocation === "Todas" || c.city === activeLocation;
        const monthMatch = !activeMonth || c.month === activeMonth;
        const searchMatch = !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.segment.toLowerCase().includes(searchQuery.toLowerCase());
        return segMatch && modMatch && locMatch && monthMatch && searchMatch;
    });

    // Months available after applying segment/modality/location filters (but ignoring month filter)
    const preMonthFiltered = ALL_COURSES.filter(c => {
        const segMatch = activeSegment === "Todos" || c.segment === activeSegment;
        const modMatch = activeModality === "Todos" || c.modality === activeModality;
        const locMatch = activeLocation === "Todas" || c.city === activeLocation;
        const searchMatch = !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.segment.toLowerCase().includes(searchQuery.toLowerCase());
        return segMatch && modMatch && locMatch && searchMatch;
    });
    const months = [...new Set(preMonthFiltered.map(c => c.month))];

    const groupedByMonth: Record<string, typeof ALL_COURSES> = {};
    filtered.forEach(c => {
        if (!groupedByMonth[c.month]) groupedByMonth[c.month] = [];
        groupedByMonth[c.month].push(c);
    });

    const clearAll = () => {
        setActiveSegment("Todos");
        setActiveModality("Todos");
        setActiveLocation("Todas");
        setActiveMonth(null);
        setSearchQuery("");
    };

    const hasActiveFilters = activeSegment !== "Todos" || activeModality !== "Todos" || activeLocation !== "Todas" || activeMonth !== null || searchQuery !== "";

    return (
        <main className="bg-[#F1F1F1] text-[#030D1F] min-h-screen">
            <Header />

            {/* Hero Banner */}
            <div className="relative h-[420px] lg:h-[480px] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop')` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-[#030D1F]/80 via-[#030D1F]/60 to-[#F1F1F1]" />
                </div>
                <div className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-10 h-full flex flex-col justify-end pb-14">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/12 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-semibold tracking-[0.2em] text-white uppercase mb-5 w-fit">
                        <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
                        AGENDA 2026
                    </span>
                    <h1 className="text-[36px] lg:text-[56px] font-display font-semibold text-white leading-[1.02] mb-3">
                        TODOS OS CURSOS
                    </h1>
                    <p className="text-white/60 text-base lg:text-lg max-w-lg">
                        Formações executivas presenciais para transformar a gestão pública brasileira
                    </p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="max-w-[1320px] mx-auto px-6 lg:px-10 -mt-6 relative z-20">
                {/* Search + Count bar */}
                <div className="bg-white rounded-[20px] border border-[#030D1F]/6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-5 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex items-center gap-3 flex-1 border-b lg:border-b-0 lg:border-r border-[#030D1F]/8 pb-4 lg:pb-0 lg:pr-6">
                            <Search className="w-5 h-5 text-[#888] shrink-0" />
                            <input
                                type="text"
                                placeholder="Buscar por nome ou área..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent text-[#030D1F] text-sm outline-none placeholder:text-[#999]"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <SlidersHorizontal className="w-4 h-4 text-[#888]" />
                                <span className="text-sm text-[#555]">
                                    <span className="font-semibold text-[#030D1F]">{filtered.length}</span> cursos encontrados
                                </span>
                            </div>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearAll}
                                    className="text-xs text-[#1a4b8c] font-semibold hover:underline whitespace-nowrap"
                                >
                                    Limpar filtros
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Segment filter (Público-alvo) */}
                <div className="mb-4">
                    <p className="text-[11px] text-[#888] font-semibold uppercase tracking-wider mb-2 ml-1">Público-alvo</p>
                    <div className="overflow-x-auto hide-scrollbar -mx-6 px-6">
                        <div className="flex gap-2 min-w-max">
                            {SEGMENTS.map(seg => (
                                <button
                                    key={seg}
                                    onClick={() => { setActiveSegment(seg); setActiveMonth(null); }}
                                    className={`filter-chip ${activeSegment === seg ? 'active' : ''}`}
                                >
                                    {seg}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modality + Location row */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex-1">
                        <p className="text-[11px] text-[#888] font-semibold uppercase tracking-wider mb-2 ml-1">Modalidade</p>
                        <div className="flex gap-2">
                            {MODALITIES.map(mod => (
                                <button
                                    key={mod}
                                    onClick={() => setActiveModality(mod)}
                                    className={`px-4 py-2 rounded-full text-[12px] font-semibold uppercase tracking-wider transition-all border ${activeModality === mod
                                        ? "bg-[#1a4b8c] text-white border-[#1a4b8c]"
                                        : "bg-transparent text-[#555] border-[#030D1F]/12 hover:border-[#1a4b8c] hover:text-[#1a4b8c]"
                                    }`}
                                >
                                    {mod}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="text-[11px] text-[#888] font-semibold uppercase tracking-wider mb-2 ml-1">Local</p>
                        <div className="flex gap-2">
                            {LOCATIONS.map(loc => (
                                <button
                                    key={loc}
                                    onClick={() => setActiveLocation(loc)}
                                    className={`px-4 py-2 rounded-full text-[12px] font-semibold uppercase tracking-wider transition-all border ${activeLocation === loc
                                        ? "bg-[#1a4b8c] text-white border-[#1a4b8c]"
                                        : "bg-transparent text-[#555] border-[#030D1F]/12 hover:border-[#1a4b8c] hover:text-[#1a4b8c]"
                                    }`}
                                >
                                    {loc}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Month filter */}
                <div className="mb-12">
                    <p className="text-[11px] text-[#888] font-semibold uppercase tracking-wider mb-2 ml-1">Mês</p>
                    <div className="overflow-x-auto hide-scrollbar -mx-6 px-6">
                        <div className="flex gap-2 min-w-max">
                            <button
                                onClick={() => setActiveMonth(null)}
                                className={`px-4 py-2 rounded-full text-[12px] font-semibold uppercase tracking-wider transition-all border ${!activeMonth
                                    ? "bg-[#1a4b8c] text-white border-[#1a4b8c]"
                                    : "bg-transparent text-[#555] border-[#030D1F]/12 hover:border-[#1a4b8c] hover:text-[#1a4b8c]"
                                }`}
                            >
                                Todos os Meses
                            </button>
                            {months.map(month => (
                                <button
                                    key={month}
                                    onClick={() => setActiveMonth(month)}
                                    className={`px-4 py-2 rounded-full text-[12px] font-semibold uppercase tracking-wider transition-all border ${activeMonth === month
                                        ? "bg-[#1a4b8c] text-white border-[#1a4b8c]"
                                        : "bg-transparent text-[#555] border-[#030D1F]/12 hover:border-[#1a4b8c] hover:text-[#1a4b8c]"
                                    }`}
                                >
                                    {month}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Courses grouped by month */}
                {Object.entries(groupedByMonth).map(([month, courses]) => (
                    <div key={month} className="mb-14">
                        <div className="flex items-center gap-4 mb-7">
                            <h3 className="text-[24px] font-display font-semibold text-[#030D1F]">
                                {month}
                            </h3>
                            <div className="flex-1 h-px bg-[#030D1F]/8" />
                            <span className="text-[12px] text-[#888] font-medium uppercase tracking-wider">
                                {courses.length} {courses.length === 1 ? 'curso' : 'cursos'}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                            {courses.map(course => (
                                <a
                                    key={course.id}
                                    href={course.url}
                                    className="group relative block h-[380px] sm:h-[420px] lg:h-[460px] rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                >
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        draggable={false}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#030D1F]/85 via-[#030D1F]/30 to-[#030D1F]/5" />

                                    {/* Badge */}
                                    <div className="absolute top-5 left-5 z-10">
                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-semibold tracking-widest text-white uppercase">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                                            {course.tag}
                                        </span>
                                    </div>

                                    {/* Modality badge top-right */}
                                    <div className="absolute top-5 right-5 z-10">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase ${
                                            course.modality === "Híbrido"
                                                ? "bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/30"
                                                : "bg-white/10 text-white/70 border border-white/15"
                                        }`}>
                                            {course.modality}
                                        </span>
                                    </div>

                                    {/* Title overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center p-6 z-10">
                                        <h4 className="text-[22px] lg:text-[26px] font-display font-semibold text-white text-center leading-tight max-w-[280px]">
                                            {course.title}
                                        </h4>
                                    </div>

                                    {/* Bottom content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-transparent border border-white/25 rounded-full text-[11px] font-medium text-white tracking-wider uppercase group-hover:bg-white/10 transition-all">
                                                Ver Curso <ArrowRight className="w-3 h-3" />
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <span className="inline-flex items-center gap-1.5 text-[11px] text-white/60">
                                                    <Calendar className="w-3 h-3 text-[#C9A227]" />
                                                    {course.date}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 text-[11px] text-white/60">
                                                    <MapPin className="w-3 h-3 text-[#C9A227]" />
                                                    {course.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-lg text-[#555]">Nenhum curso encontrado para os filtros selecionados.</p>
                        <button
                            onClick={clearAll}
                            className="mt-4 text-[#1a4b8c] font-semibold underline"
                        >
                            Limpar filtros
                        </button>
                    </div>
                )}

                <div className="pb-10" />
            </div>

            <Footer />
        </main>
    );
}

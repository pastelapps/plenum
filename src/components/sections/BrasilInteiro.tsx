"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { gsap } from "@/lib/gsap";

interface StateData {
    name: string;
    sigla: string;
    slug: string;
    courses: number;
}

const STATES_DATA: Record<string, StateData> = {
    AC: { name: "Acre", sigla: "AC", slug: "acre", courses: 1 },
    AL: { name: "Alagoas", sigla: "AL", slug: "alagoas", courses: 1 },
    AP: { name: "Amapá", sigla: "AP", slug: "amapa", courses: 1 },
    AM: { name: "Amazonas", sigla: "AM", slug: "amazonas", courses: 1 },
    BA: { name: "Bahia", sigla: "BA", slug: "bahia", courses: 4 },
    CE: { name: "Ceará", sigla: "CE", slug: "ceara", courses: 2 },
    DF: { name: "Distrito Federal", sigla: "DF", slug: "distrito-federal", courses: 12 },
    ES: { name: "Espírito Santo", sigla: "ES", slug: "espirito-santo", courses: 1 },
    GO: { name: "Goiás", sigla: "GO", slug: "goias", courses: 3 },
    MA: { name: "Maranhão", sigla: "MA", slug: "maranhao", courses: 1 },
    MT: { name: "Mato Grosso", sigla: "MT", slug: "mato-grosso", courses: 1 },
    MS: { name: "Mato Grosso do Sul", sigla: "MS", slug: "mato-grosso-do-sul", courses: 1 },
    MG: { name: "Minas Gerais", sigla: "MG", slug: "minas-gerais", courses: 8 },
    PA: { name: "Pará", sigla: "PA", slug: "para", courses: 2 },
    PB: { name: "Paraíba", sigla: "PB", slug: "paraiba", courses: 1 },
    PR: { name: "Paraná", sigla: "PR", slug: "parana", courses: 3 },
    PE: { name: "Pernambuco", sigla: "PE", slug: "pernambuco", courses: 3 },
    PI: { name: "Piauí", sigla: "PI", slug: "piaui", courses: 1 },
    RJ: { name: "Rio de Janeiro", sigla: "RJ", slug: "rio-de-janeiro", courses: 5 },
    RN: { name: "Rio Grande do Norte", sigla: "RN", slug: "rio-grande-do-norte", courses: 1 },
    RS: { name: "Rio Grande do Sul", sigla: "RS", slug: "rio-grande-do-sul", courses: 2 },
    RO: { name: "Rondônia", sigla: "RO", slug: "rondonia", courses: 1 },
    RR: { name: "Roraima", sigla: "RR", slug: "roraima", courses: 0 },
    SC: { name: "Santa Catarina", sigla: "SC", slug: "santa-catarina", courses: 2 },
    SP: { name: "São Paulo", sigla: "SP", slug: "sao-paulo", courses: 6 },
    SE: { name: "Sergipe", sigla: "SE", slug: "sergipe", courses: 1 },
    TO: { name: "Tocantins", sigla: "TO", slug: "tocantins", courses: 1 },
};

// SVG paths for each Brazilian state (simplified accurate outlines)
const STATE_PATHS: Record<string, string> = {
    AC: "M48,bindunno290 L56,280 62,282 68,290 72,298 68,308 58,312 48,308 42,300Z".replace("bindunno",""),
    AM: "M58,220 L98,210 138,215 158,230 168,250 158,270 140,280 120,285 100,280 80,275 60,265 50,250 48,235Z",
    RR: "M108,175 L128,168 140,175 145,190 138,205 125,210 112,205 105,192Z",
    AP: "M195,190 L210,180 220,188 218,205 210,215 198,212 192,200Z",
    PA: "M120,215 L160,208 190,210 210,218 220,230 225,250 215,268 195,275 175,280 155,275 140,268 125,260 115,245 112,230Z",
    MA: "M225,235 L248,228 260,235 265,250 260,268 248,275 235,272 228,260 222,248Z",
    PI: "M258,248 L272,240 282,248 285,265 280,280 272,288 262,282 255,270Z",
    CE: "M280,235 L295,228 305,235 308,248 302,260 292,265 282,258 278,245Z",
    RN: "M305,242 L318,238 325,245 322,255 315,260 305,255Z",
    PB: "M305,258 L322,255 328,262 325,270 315,275 305,270Z",
    PE: "M275,272 L305,268 325,272 330,280 320,288 300,290 280,288Z",
    AL: "M310,290 L322,288 328,295 325,305 318,308 310,302Z",
    SE: "M305,305 L315,302 320,308 318,318 310,320 305,312Z",
    BA: "M262,288 L290,282 310,290 318,310 325,330 320,355 308,368 290,375 272,370 258,358 250,340 248,320 252,300Z",
    TO: "M215,270 L235,265 248,275 255,295 250,315 240,328 225,325 215,310 210,290Z",
    GO: "M225,328 L248,320 262,330 270,350 265,368 252,375 238,372 228,358 222,342Z",
    DF: "M248,345 L256,342 260,348 256,354 248,352Z",
    MT: "M148,280 L185,275 210,285 218,305 222,330 215,352 200,360 178,355 158,345 142,330 138,310 140,295Z",
    MS: "M168,358 L195,352 212,360 218,378 210,398 195,405 178,400 165,388 160,372Z",
    MG: "M260,345 L285,338 305,348 315,365 318,385 310,400 295,408 278,405 262,395 250,380 248,362Z",
    ES: "M318,365 L330,360 338,370 335,385 328,392 318,388Z",
    RJ: "M295,400 L315,395 328,400 332,412 322,420 308,418 298,412Z",
    SP: "M228,390 L258,382 280,392 290,408 285,425 270,432 250,430 235,422 225,408Z",
    PR: "M218,425 L245,420 265,428 272,442 265,455 248,460 230,455 218,445 215,435Z",
    SC: "M235,458 L255,455 268,462 268,475 258,482 242,480 232,472Z",
    RS: "M225,478 L248,475 262,482 268,498 262,515 248,522 232,518 222,505 218,492Z",
    RO: "M110,290 L138,285 148,298 148,318 140,332 125,335 112,328 105,312Z",
};

export default function BrasilInteiro() {
    const sectionRef = useRef<HTMLElement>(null);
    const [hoveredState, setHoveredState] = useState<string | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".brasil-header", {
                y: 40, opacity: 0, duration: 0.7, ease: "power3.out",
                scrollTrigger: { trigger: ".brasil-section", start: "top 80%" }
            });
            gsap.from(".brasil-map", {
                y: 60, opacity: 0, duration: 0.9, ease: "power3.out",
                scrollTrigger: { trigger: ".brasil-map", start: "top 85%" }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setTooltipPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top - 60,
        });
    };

    const stateInfo = hoveredState ? STATES_DATA[hoveredState] : null;

    return (
        <section id="brasil" ref={sectionRef} className="brasil-section bg-[#030D1F] py-20 lg:py-32 overflow-hidden">
            <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
                {/* Header */}
                <div className="brasil-header text-center mb-12 lg:mb-16">
                    <h2 className="text-display-lg text-white mb-4">BRASIL INTEIRO</h2>
                    <p className="text-sm italic text-white/40 tracking-wide uppercase mb-2">
                        Cursos ao vivo presenciais em todo o país
                    </p>
                    <p className="text-base text-white/50 max-w-xl mx-auto">
                        Clique em um estado para ver os cursos disponíveis na sua região
                    </p>
                </div>

                {/* Map + Info */}
                <div className="brasil-map flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                    {/* SVG Map */}
                    <div className="relative w-full lg:w-[55%] max-w-[550px]" onMouseMove={handleMouseMove}>
                        <svg
                            viewBox="30 160 330 380"
                            className="w-full h-auto"
                            style={{ filter: "drop-shadow(0 4px 24px rgba(201,162,39,0.08))" }}
                        >
                            {Object.entries(STATE_PATHS).map(([sigla, path]) => {
                                const data = STATES_DATA[sigla];
                                const isHovered = hoveredState === sigla;
                                const hasCourses = data && data.courses > 0;
                                return (
                                    <a
                                        key={sigla}
                                        href={`/cursos?estado=${data?.slug || sigla.toLowerCase()}`}
                                        onMouseEnter={() => setHoveredState(sigla)}
                                        onMouseLeave={() => setHoveredState(null)}
                                    >
                                        <path
                                            d={path}
                                            fill={isHovered ? "#C9A227" : hasCourses ? "#1a4b8c" : "#0f2b50"}
                                            stroke="#030D1F"
                                            strokeWidth="1.5"
                                            className="transition-all duration-200 cursor-pointer"
                                            style={{
                                                opacity: isHovered ? 1 : hasCourses ? 0.85 : 0.5,
                                                transform: isHovered ? "scale(1.02)" : "scale(1)",
                                                transformOrigin: "center",
                                            }}
                                        />
                                        {/* State label */}
                                        {isHovered && (
                                            <text
                                                x="0"
                                                y="0"
                                                fill="white"
                                                fontSize="8"
                                                fontWeight="700"
                                                textAnchor="middle"
                                                className="pointer-events-none"
                                                style={{ opacity: 0 }}
                                            >
                                                {sigla}
                                            </text>
                                        )}
                                    </a>
                                );
                            })}
                        </svg>

                        {/* Tooltip */}
                        {stateInfo && (
                            <div
                                className="absolute pointer-events-none z-30 bg-[#030D1F] border border-white/15 rounded-xl px-4 py-3 shadow-2xl transition-all duration-150"
                                style={{
                                    left: `${tooltipPos.x}px`,
                                    top: `${tooltipPos.y}px`,
                                    transform: "translateX(-50%)",
                                }}
                            >
                                <p className="text-white font-display font-semibold text-sm whitespace-nowrap">{stateInfo.name}</p>
                                <p className="text-[#C9A227] text-xs font-medium">
                                    {stateInfo.courses} {stateInfo.courses === 1 ? "curso" : "cursos"} disponíveis
                                </p>
                            </div>
                        )}

                        {/* Legend */}
                        <div className="flex items-center justify-center gap-6 mt-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-[#1a4b8c]" />
                                <span className="text-[11px] text-white/40">Com cursos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-[#0f2b50] opacity-50" />
                                <span className="text-[11px] text-white/40">Em breve</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-[#C9A227]" />
                                <span className="text-[11px] text-white/40">Selecionado</span>
                            </div>
                        </div>
                    </div>

                    {/* State List / Info Panel */}
                    <div className="w-full lg:w-[45%]">
                        <div className="bg-white/5 border border-white/8 rounded-[24px] p-6 lg:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <MapPin className="w-5 h-5 text-[#C9A227]" />
                                <h3 className="text-lg font-display font-semibold text-white">
                                    Presença Nacional
                                </h3>
                            </div>

                            {/* Top states list */}
                            <div className="space-y-2 mb-8">
                                {Object.values(STATES_DATA)
                                    .filter(s => s.courses >= 2)
                                    .sort((a, b) => b.courses - a.courses)
                                    .slice(0, 8)
                                    .map(state => (
                                        <a
                                            key={state.sigla}
                                            href={`/cursos?estado=${state.slug}`}
                                            onMouseEnter={() => setHoveredState(state.sigla)}
                                            onMouseLeave={() => setHoveredState(null)}
                                            className={`flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-200 group ${
                                                hoveredState === state.sigla
                                                    ? "bg-[#C9A227]/15 border border-[#C9A227]/30"
                                                    : "bg-white/3 border border-transparent hover:bg-white/6"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[18px] font-display font-bold w-8 ${
                                                    hoveredState === state.sigla ? "text-[#C9A227]" : "text-[#1a4b8c]"
                                                }`}>
                                                    {state.sigla}
                                                </span>
                                                <span className="text-sm text-white/80">{state.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                    hoveredState === state.sigla
                                                        ? "bg-[#C9A227]/20 text-[#C9A227]"
                                                        : "bg-white/8 text-white/50"
                                                }`}>
                                                    {state.courses} cursos
                                                </span>
                                                <ArrowRight className={`w-3.5 h-3.5 transition-all ${
                                                    hoveredState === state.sigla ? "text-[#C9A227] translate-x-0.5" : "text-white/20"
                                                }`} />
                                            </div>
                                        </a>
                                    ))}
                            </div>

                            {/* CTA */}
                            <a
                                href="/cursos"
                                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full border border-white/15 text-white/70 text-sm font-medium uppercase tracking-wider hover:bg-white/8 hover:text-white transition-all"
                            >
                                Ver Todos os Cursos
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

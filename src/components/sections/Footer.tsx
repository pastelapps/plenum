"use client";
import { useState, useRef, useEffect } from "react";
import { Instagram, Youtube, Linkedin, ArrowRight, Check } from "lucide-react";
import { gsap } from "@/lib/gsap";

const SpinDecorationLarge = () => (
    <div className="animate-spin-slow opacity-30">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            {Array.from({ length: 12 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 30} 40 40)`}>
                    <text x="40" y="10" textAnchor="middle" fill="white" fontSize="7" fontFamily="Outfit" fontWeight="300">
                        /P
                    </text>
                </g>
            ))}
        </svg>
    </div>
);

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".footer-content", {
                opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: "power3.out",
                scrollTrigger: { trigger: ".footer", start: "top 90%" }
            });
        }, footerRef);
        return () => ctx.revert();
    }, []);

    const navLinks = ["HOME", "SOBRE NÓS", "PARA EMPRESAS", "CURSOS", "BLOG", "CONTATO"];

    const columns = [
        { title: "LINKS", items: ["20 Termos de Gestão Pública", "Guia de Licitações", "Templates Gratuitos", "Ferramentas de IA", "Metodologias Ativas"] },
        { title: "CURSOS", items: ["Gestão de Contratos", "Nova Lei de Licitações", "Governança Corporativa", "IA Pública", "Liderança PRO"] },
        { title: "PLENUM", items: ["Academy", "Events", "Corporativa", "Consultoria"] },
        { title: "PARA EMPRESAS", items: ["Treinamentos sob Medida", "Formatos de Workshop", "O que sua empresa Ganha?"] },
    ];

    return (
        <footer id="contato" ref={footerRef} className="footer relative bg-[#030D1F] overflow-hidden">
            {/* Newsletter CTA section — like HA newsletter */}
            <div className="relative py-14 lg:py-32 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1577985043696-8bd54d9f093f?q=80&w=2070&auto=format&fit=crop"
                        alt=""
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030D1F] via-[#030D1F]/80 to-[#030D1F]/60" />
                </div>

                <div className="relative z-10 max-w-[1280px] mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="footer-content">
                            <div className="flex items-center gap-3 mb-4">
                            </div>
                            <h3 className="text-display-md text-white mb-3 leading-snug">
                                Receba as Novidades do Mundo<br />da Gestão Pública
                            </h3>
                            <p className="text-sm text-white/50 mb-8">Todas as quintas, às 10h.</p>

                            {!submitted ? (
                                <form onSubmit={handleSubmit} className="flex max-w-lg">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="QUERO ME INSCREVER"
                                        className="flex-1 min-w-0 bg-[#C9A227] text-[#030D1F] placeholder-[#030D1F]/60 px-4 md:px-6 py-3.5 md:py-4 rounded-l-full text-xs md:text-sm font-semibold tracking-wider uppercase focus:outline-none"
                                    />
                                    <button type="submit" className="bg-white text-[#030D1F] px-5 py-4 rounded-r-full hover:bg-white/90 transition-colors">
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </form>
                            ) : (
                                <div className="flex items-center gap-2 text-[#C9A227] font-medium">
                                    <Check className="w-5 h-5" />
                                    Obrigado! Você receberá nosso conteúdo em breve.
                                </div>
                            )}
                        </div>

                        {/* Right side — large text like HA "Newsletter da Human" */}
                        <div className="footer-content hidden lg:block text-right">
                            <div className="flex flex-wrap justify-end gap-3 mb-6">
                                <span className="px-4 py-1.5 border border-white/20 rounded-full text-[11px] text-white/70 uppercase tracking-widest">Gestão Pública</span>
                                <span className="px-4 py-1.5 border border-white/20 rounded-full text-[11px] text-white/70 uppercase tracking-widest">Inovação</span>
                            </div>
                            <h2 className="font-display font-light text-[clamp(3rem,6vw,5.5rem)] text-white/90 leading-[0.95] tracking-tight">
                                Newsletter<br />da Plenum
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Link columns — like HA footer directory */}
            <div className="border-t border-white/[0.06]">
                <div className="max-w-[1280px] mx-auto px-4 py-10 lg:py-16">
                    <div className="footer-content grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16 mb-12 md:mb-16">
                        {/* First column: Logo + description */}
                        <div className="col-span-2 md:col-span-1">
                            <img src="/logo-plenum-aberta2.png" alt="Plenum Academy" className="h-8 w-auto object-contain" />
                            <p className="text-sm text-white/40 mt-4 leading-relaxed max-w-[240px]">
                                Somos a maior escola de liderança e inovação para o setor público do Brasil.
                            </p>
                            <p className="text-xs text-white/30 mt-6">2026 Instituto Plenum Brasil</p>
                            <p className="text-xs text-white/30">All Rights Reserved.</p>
                        </div>

                        {/* Link columns */}
                        {columns.map((col, i) => (
                            <div key={i}>
                                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">{col.title}</h4>
                                <ul className="space-y-3">
                                    {col.items.map(item => (
                                        <li key={item}>
                                            <a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">{item}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Social icons — bottom right like HA */}
                    <div className="footer-content flex items-center justify-end gap-4">
                        {[Instagram, Youtube, Linkedin].map((Icon, i) => (
                            <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300">
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

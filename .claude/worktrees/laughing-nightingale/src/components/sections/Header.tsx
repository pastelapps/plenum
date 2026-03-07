"use client";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const headerRef = useRef<HTMLElement>(null);

    const navItems = [
        { label: "SOBRE", href: "#sobre" },
        { label: "PROGRAMAS", href: "#programas", hasDropdown: true },
        { label: "CONTATO", href: "#contato" },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(headerRef.current, {
                y: -80, opacity: 0, duration: 0.8, delay: 0.2, ease: "power3.out"
            });
        }, headerRef);

        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", handleScroll);
        return () => { ctx.revert(); window.removeEventListener("scroll", handleScroll); };
    }, []);

    return (
        <header
            ref={headerRef}
            className="fixed top-0 left-0 right-0 z-50 py-3 px-4 lg:px-6"
        >
            <div className="max-w-[1440px] mx-auto">
                <div className={`hidden lg:flex items-center justify-between h-[80px] rounded-full border px-6 transition-all duration-500 ${scrolled
                    ? "bg-[rgba(10,12,16,0.88)] border-white/20 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
                    : "bg-[rgba(14,16,20,0.78)] border-white/15 backdrop-blur-xl"
                    }`}>
                    <a href="/" className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[30px] font-display font-medium tracking-wide text-white leading-none">/P</span>
                        <span className="text-[30px] font-display font-light tracking-wide text-white/95 leading-none">
                            Academy™
                        </span>
                    </a>

                    <nav className="flex items-center gap-1">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="px-3 py-2 text-[13px] font-medium tracking-wide text-white/80 hover:text-white transition-colors uppercase inline-flex items-center gap-1"
                            >
                                {item.label}
                                {item.hasDropdown && (
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-70">
                                        <path d="M2.5 4L5 6.5L7.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                    </svg>
                                )}
                            </a>
                        ))}
                    </nav>

                    <a
                        href="#empresas"
                        className="px-3 py-2 text-[13px] font-medium tracking-wide text-white/80 hover:text-white transition-colors uppercase"
                    >
                        PARA EMPRESAS
                    </a>

                    <a
                        href="#academy"
                        className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-white text-[#1C2733] text-[13px] font-semibold uppercase hover:bg-white/90 transition-colors"
                    >
                        Plenum Academy
                        <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                </div>

                <div className="lg:hidden flex items-center justify-between rounded-full border border-white/15 bg-[rgba(10,12,16,0.82)] backdrop-blur-xl px-4 py-2.5">
                    <a href="/" className="flex items-center gap-1 shrink-0">
                        <span className="text-xl font-display font-medium tracking-wide text-white leading-none">/P</span>
                        <span className="text-xl font-display font-light tracking-wide text-white/95 leading-none">
                            Academy™
                        </span>
                    </a>
                    <button
                        className="w-10 h-10 flex items-center justify-center text-white"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="lg:hidden mt-3 mx-2 rounded-2xl bg-[rgba(10,12,16,0.92)] backdrop-blur-xl border border-white/15 p-6 shadow-2xl">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="block py-3 text-sm text-white/80 hover:text-white transition-colors uppercase tracking-wide"
                        >
                            {item.label}
                        </a>
                    ))}
                    <a
                        href="#empresas"
                        className="block py-3 text-sm text-white/80 hover:text-white transition-colors uppercase tracking-wide"
                    >
                        PARA EMPRESAS
                    </a>
                    <a
                        href="#academy"
                        className="mt-4 w-full text-center block px-6 py-3 bg-white text-[#1C2733] rounded-full font-semibold text-sm uppercase tracking-wide"
                    >
                        Plenum Academy
                    </a>
                </div>
            )}
        </header>
    );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Instagram, Linkedin, Youtube } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { CONTACT } from "@/lib/plenum-content";

const columns = [
    { title: "INSTITUCIONAL", items: [
        { label: "Sobre a Plenum", href: "/sobre" },
        { label: "Liderança", href: "/lideranca" },
        { label: "Compliance e Ouvidoria", href: "/compliance" },
        { label: "Certidões e Documentos", href: "/certidoes" },
        { label: "Privacidade e LGPD", href: "/lgpd" },
        { label: "Comunidade Alumni", href: "/alumni" },
        { label: "Trabalhe Conosco", href: "/trabalhe-conosco" },
    ] },
    { title: "FORMAÇÕES", items: [
        { label: "Cursos presenciais e híbridos", href: "/cursos" },
        { label: "Seminários e congressos", href: "/cursos?tipo=seminario" },
        { label: "Cursos In Company", href: CONTACT.whatsappHref },
    ] },
    { title: "SOLUÇÕES", items: [
        { label: "Consultoria", href: CONTACT.whatsappHref },
        { label: "LicitaPública", href: "/govtech#licitapublica" },
        { label: "Plataforma EducaPública", href: "/#educapublica" },
        { label: "Guias práticos", href: "/govtech#guias" },
    ] },
    { title: "CONTEÚDO", items: [
        { label: "Plenum Insights", href: "/blog" },
        { label: "Plenum GovTech", href: "/govtech" },
        { label: "Guias para download", href: "/govtech#guias" },
        { label: "Instagram", href: CONTACT.instagramHref },
    ] },
    { title: "CONTATO", items: [
        { label: CONTACT.whatsapp, href: CONTACT.whatsappHref },
        { label: CONTACT.instagram, href: CONTACT.instagramHref },
        { label: "Fale conosco", href: "/contato" },
    ] },
];

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

    return (
        <footer id="contato" ref={footerRef} className="footer relative bg-[#030D1F] overflow-hidden">
            <div className="relative py-14 lg:py-28 overflow-hidden">
                <div className="absolute inset-0">
                    <img src="/sede-brasilia.jpg" alt="" className="w-full h-full object-cover opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030D1F] via-[#030D1F]/84 to-[#030D1F]/62" />
                </div>
                <div className="relative z-10 max-w-[1280px] mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="footer-content">
                            <h3 className="text-display-md text-white mb-3 leading-snug">
                                Receba novidades sobre gestão pública, IA e formação executiva
                            </h3>
                            <p className="text-sm text-white/50 mb-8">Conteúdo Plenum Insights direto no seu e-mail.</p>
                            {!submitted ? (
                                <form onSubmit={handleSubmit} className="flex max-w-lg">
                                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="QUERO ME INSCREVER" className="flex-1 min-w-0 bg-[#C9A227] text-[#030D1F] placeholder-[#030D1F]/60 px-4 md:px-6 py-3.5 md:py-4 rounded-l-full text-xs md:text-sm font-semibold tracking-wider uppercase focus:outline-none" />
                                    <button type="submit" className="bg-white text-[#030D1F] px-5 py-4 rounded-r-full hover:bg-white/90 transition-colors" aria-label="Assinar newsletter">
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </form>
                            ) : (
                                <div className="flex items-center gap-2 text-[#C9A227] font-medium">
                                    <Check className="w-5 h-5" />
                                    Obrigado. Você receberá nosso conteúdo em breve.
                                </div>
                            )}
                        </div>
                        <div className="footer-content hidden lg:block text-right">
                            <div className="flex flex-wrap justify-end gap-3 mb-6">
                                <span className="px-4 py-1.5 border border-white/20 rounded-full text-[11px] text-white/70 uppercase tracking-widest">Gestão Pública</span>
                                <span className="px-4 py-1.5 border border-white/20 rounded-full text-[11px] text-white/70 uppercase tracking-widest">GovTech</span>
                            </div>
                            <h2 className="font-display font-light text-[clamp(3rem,6vw,5.5rem)] text-white/90 leading-[0.95] tracking-tight">
                                Plenum<br />Insights
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/[0.06]">
                <div className="max-w-[1280px] mx-auto px-4 py-10 lg:py-16">
                    <div className="footer-content grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-10 mb-12 md:mb-16">
                        <div className="col-span-2 md:col-span-1">
                            <img src="/logo-plenum-aberta2.png" alt="Plenum" className="h-8 w-auto object-contain" />
                            <p className="text-sm text-white/40 mt-4 leading-relaxed max-w-[240px]">
                                Educação executiva, inovação e tecnologia para formar lideranças do setor público.
                            </p>
                            <p className="text-xs text-white/30 mt-6">2026 Instituto Plenum Brasil</p>
                            <p className="text-xs text-white/30">All Rights Reserved.</p>
                        </div>
                        {columns.map((col) => (
                            <div key={col.title}>
                                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">{col.title}</h4>
                                <ul className="space-y-3">
                                    {col.items.map((item) => (
                                        <li key={item.label}>
                                            <a href={item.href} className="text-sm text-white/40 hover:text-white/70 transition-colors">{item.label}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="footer-content flex items-center justify-end gap-4">
                        <a href={CONTACT.instagramHref} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300" aria-label="Instagram">
                            <Instagram className="w-4 h-4" />
                        </a>
                        {[Youtube, Linkedin].map((Icon, i) => (
                            <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300" aria-label="Rede social">
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

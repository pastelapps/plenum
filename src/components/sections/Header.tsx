"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronDown, Instagram, Menu, Search, X } from "lucide-react";
import { CONTACT } from "@/lib/plenum-content";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

const navGroups = [
  {
    title: "Institucional",
    links: [
      { label: "Sobre a Plenum", href: "/sobre" },
      { label: "Liderança", href: "/lideranca" },
      { label: "Compliance e Ouvidoria", href: "/compliance" },
      { label: "Certidões e Documentos", href: "/certidoes" },
      { label: "Privacidade e LGPD", href: "/lgpd" },
      { label: "Comunidade Alumni", href: "/alumni" },
      { label: "Trabalhe Conosco", href: "/trabalhe-conosco" },
    ],
  },
  {
    title: "Formações",
    links: [
      { label: "Cursos presenciais e híbridos", href: "/cursos" },
      { label: "Seminários e congressos", href: "/cursos?tipo=seminario" },
      { label: "Cursos In Company", href: CONTACT.whatsappHref, external: true },
    ],
  },
  {
    title: "Soluções",
    links: [
      { label: "Consultoria", href: CONTACT.whatsappHref, external: true },
      { label: "LicitaPública", href: "/govtech#licitapublica" },
      { label: "Plataforma EducaPública", href: "/#educapublica" },
      { label: "Guias práticos", href: "/govtech#guias" },
    ],
  },
  {
    title: "Conteúdo",
    links: [
      { label: "Plenum Insights (blog)", href: "/blog" },
      { label: "Blog de Tecnologia", href: "/blog?topic=tecnologia" },
      { label: "Plenum GovTech", href: "/govtech" },
      { label: "Guias para download", href: "/govtech#guias" },
      { label: "Instagram", href: CONTACT.instagramHref, external: true },
    ],
  },
];

function NavLink({ item, className, onClick }: { item: { label: string; href: string; external?: boolean }; className: string; onClick?: () => void }) {
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} onClick={onClick} className={className}>
      {item.label}
    </Link>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 100);
  }, [searchOpen]);

  const closeAll = () => {
    setMenuOpen(false);
    setSearchOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 py-3">
        <div className={`max-w-[1440px] mx-auto flex items-center justify-between h-14 rounded-full border px-5 lg:px-6 transition-all duration-500 ${
          scrolled || menuOpen
            ? "bg-[rgba(10,12,16,0.88)] border-white/20 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
            : "bg-[rgba(14,16,20,0.58)] border-white/10 backdrop-blur-xl"
        }`}>
          <Link href="/" onClick={closeAll} aria-label="Plenum" className="shrink-0">
            <Image src="/logo-plenum-aberta2.png" alt="Plenum" width={110} height={32} priority />
          </Link>

          <nav className="hidden xl:flex items-center gap-1 mx-5">
            {navGroups.map((group) => (
              <div key={group.title} className="relative group">
                <button className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-[12px] font-medium text-white/76 hover:bg-white/10 hover:text-white transition-all">
                  {group.title}
                  <ChevronDown className="h-3 w-3 text-white/45" />
                </button>
                <div className="absolute left-0 top-[calc(100%+10px)] min-w-[245px] rounded-[18px] border border-white/10 bg-[#0d0d0d]/95 p-2 opacity-0 invisible translate-y-[-6px] shadow-[0_16px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-150 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                  {group.links.map((item) => (
                    <NavLink key={item.label} item={item} className="block rounded-[12px] px-4 py-2.5 text-[13px] text-white/68 hover:bg-white/8 hover:text-white transition-colors" />
                  ))}
                </div>
              </div>
            ))}
            <Link href="/contato" className="rounded-full px-3 py-2 text-[12px] font-medium text-white/76 hover:bg-white/10 hover:text-white transition-all">
              Contato
            </Link>
          </nav>

          <div className="flex items-center gap-1.5">
            <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-[#25D366] hover:bg-[#25D366]/15 transition-all" aria-label="WhatsApp">
              <WhatsAppIcon className="w-[18px] h-[18px]" />
            </a>
            <Link href="/aluno" className="hidden md:inline-flex items-center rounded-full border border-white/20 text-white/80 text-[11px] font-medium tracking-widest uppercase px-5 py-2 hover:bg-white/10 hover:text-white transition-all duration-200">
              Área do Aluno
            </Link>
            <button onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }} className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all" aria-label="Buscar">
              <Search className="w-4 h-4" />
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="xl:hidden w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all" aria-label="Menu">
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-[55] bg-[#0d0d0d]/95 backdrop-blur-xl flex items-start justify-center transition-all duration-300 ${searchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} style={{ paddingTop: "120px" }} onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}>
        <div className="w-full max-w-[700px] px-6">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  window.location.href = `/cursos?q=${encodeURIComponent(searchQuery.trim())}`;
                  setSearchOpen(false);
                }
                if (e.key === "Escape") setSearchOpen(false);
              }}
              placeholder="Buscar cursos, eventos, artigos..."
              className="w-full bg-white/8 border border-white/12 rounded-2xl pl-14 pr-12 py-5 text-white text-lg outline-none placeholder:text-white/30 focus:border-white/25 transition-colors"
            />
            <button onClick={() => setSearchOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors" aria-label="Fechar busca">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/30 text-xs mt-4 text-center">Pressione Enter para buscar. Esc fecha a busca.</p>
        </div>
      </div>

      <div className={`xl:hidden fixed inset-0 z-40 bg-[#0d0d0d] text-white transition-all duration-300 overflow-y-auto ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} style={{ paddingTop: "80px" }}>
        <div className="h-px w-full bg-white/10" />
        <div className="px-6 py-8">
          <div className="grid grid-cols-1 gap-9">
            {navGroups.map((group) => (
              <section key={group.title}>
                <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase mb-4">{group.title}</p>
                <nav className="flex flex-col gap-2">
                  {group.links.map((item) => (
                    <NavLink key={item.label} item={item} onClick={closeAll} className="flex items-center justify-between gap-4 text-[24px] font-light leading-tight text-white hover:text-white/55 transition-colors" />
                  ))}
                </nav>
              </section>
            ))}
            <section>
              <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase mb-4">Contato</p>
              <div className="space-y-3">
                <Link href="/contato" onClick={closeAll} className="flex items-center justify-between gap-4 text-[24px] font-light leading-tight text-white hover:text-white/55 transition-colors">
                  Contato
                  <ArrowUpRight className="w-4 h-4 opacity-40" />
                </Link>
                <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" onClick={closeAll} className="flex items-center gap-3 rounded-full border border-white/15 px-5 py-3 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all">
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                  {CONTACT.whatsapp}
                </a>
                <a href={CONTACT.instagramHref} target="_blank" rel="noopener noreferrer" onClick={closeAll} className="flex items-center gap-3 rounded-full border border-white/15 px-5 py-3 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all">
                  <Instagram className="w-4 h-4 text-[#C9A227]" />
                  {CONTACT.instagram}
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
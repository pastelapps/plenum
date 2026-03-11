'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Trava o scroll do body quando menu aberto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 py-3">
        <div
          className={`max-w-[1440px] mx-auto flex items-center justify-between h-14 rounded-full border px-6 transition-all duration-500 ${
            scrolled || menuOpen
              ? 'bg-[rgba(10,12,16,0.85)] border-white/20 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.45)]'
              : 'bg-[rgba(14,16,20,0.5)] border-white/10 backdrop-blur-xl'
          }`}
        >
          {/* Logo */}
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <Image src="/logo-plenum-aberta2.png" alt="Plenum" width={110} height={32} priority />
          </Link>

          {/* Ações à direita */}
          <div className="flex items-center gap-1.5">
            {/* CTA */}
            <Link
              href="/aluno"
              className="hidden md:inline-flex items-center rounded-full border border-white/20 text-white/80 text-[11px] font-medium tracking-widest uppercase px-5 py-2 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              Área do Aluno
            </Link>

            {/* Busca */}
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Buscar"
            >
              <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="22" y2="22" />
              </svg>
            </button>

            {/* Hamburguer / X */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <line x1="4" y1="4" x2="20" y2="20" />
                  <line x1="20" y1="4" x2="4" y2="20" />
                </svg>
              ) : (
                <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="13" x2="21" y2="13" />
                  <line x1="3" y1="19" x2="21" y2="19" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── MEGA MENU ── */}
      <div
        className={`fixed inset-0 z-40 bg-[#0d0d0d] text-white transition-all duration-300 overflow-y-auto ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ paddingTop: '80px' }}
      >
        {/* ── Linha divisória top ── */}
        <div className="h-[1px] w-full bg-white/10" />

        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr_320px] gap-0 min-h-full">

          {/* ── COLUNA 1: Navegação principal ── */}
          <div className="border-r border-white/10 px-10 py-10">
            <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase mb-8">Navegação</p>
            <nav className="flex flex-col gap-1">
              {[
                { label: 'Eventos', href: '#eventos' },
                { label: '↳ Congresso', href: '#eventos', sub: true },
                { label: '↳ Seminários', href: '#eventos', sub: true },
                { label: '↳ Imersões', href: '#eventos', sub: true },
                { label: 'Cursos', href: '#academy' },
                { label: 'Consultoria', href: '#consultoria' },
                { label: 'Para Empresas', href: '#empresas' },
                { label: 'Blog', href: '#blog' },
                { label: 'Sobre a Plenum', href: '/sobre' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`transition-colors hover:text-white/50 ${
                    item.sub
                      ? 'text-[22px] font-light text-white/60 pl-1'
                      : 'text-[32px] font-light text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── COLUNA 2: Próximos Eventos (cards com imagem estilo Palantir) ── */}
          <div className="border-r border-white/10 px-10 py-10">
            <div className="flex items-center justify-between mb-8">
              <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase">Próximos Eventos</p>
              <Link href="#eventos" onClick={() => setMenuOpen(false)} className="text-[10px] text-white/60 tracking-widest uppercase hover:text-white transition-colors">
                VER TODOS ↗
              </Link>
            </div>

            {/* Cards com imagem lado a lado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {[
                {
                  tag: 'CONGRESSO · MAIO 2026',
                  title: 'Congresso Nacional de Gestão Pública',
                  image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600',
                  href: '#eventos',
                },
                {
                  tag: 'SEMINÁRIO · JUNHO 2026',
                  title: 'Licitações Sustentáveis e Nova Lei',
                  image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600',
                  href: '#eventos',
                },
              ].map((item) => (
                <Link key={item.title} href={item.href} onClick={() => setMenuOpen(false)} className="group block">
                  <div className="relative w-full aspect-[16/10] rounded-md overflow-hidden mb-3">
                    <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <p className="text-[10px] tracking-[0.15em] text-white/40 uppercase mb-1.5">{item.tag}</p>
                  <h3 className="text-[15px] font-medium leading-snug text-white/90 group-hover:text-white transition-colors">{item.title}</h3>
                  <span className="inline-block mt-2 text-xs text-white/40 group-hover:text-white/70 transition-colors">↳ Saiba mais</span>
                </Link>
              ))}
            </div>

            {/* Seção inferior: Últimos do Blog */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase">Últimos do Blog</p>
                <Link href="#blog" onClick={() => setMenuOpen(false)} className="text-[10px] text-white/60 tracking-widest uppercase hover:text-white transition-colors">
                  VER BLOG ↗
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    tag: 'TECNOLOGIA',
                    title: 'Como a IA está transformando a gestão pública',
                    image: 'https://images.unsplash.com/photo-1677442135136-760c813028c0?auto=format&fit=crop&q=80&w=400',
                    href: '#blog',
                  },
                  {
                    tag: 'LEGISLAÇÃO',
                    title: 'Nova Lei de Licitações: o que muda na prática',
                    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400',
                    href: '#blog',
                  },
                ].map((item) => (
                  <Link key={item.title} href={item.href} onClick={() => setMenuOpen(false)} className="group flex gap-3 items-start">
                    <div className="relative w-16 h-16 rounded overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-[9px] tracking-[0.15em] text-white/35 uppercase mb-1">{item.tag}</p>
                      <h4 className="text-[13px] font-medium leading-snug text-white/70 group-hover:text-white transition-colors">{item.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── COLUNA 3: Sobre + Quick Links ── */}
          <div className="px-10 py-10">
            <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase mb-8">Sobre a Plenum</p>
            <p className="text-[15px] text-white/70 leading-relaxed mb-6">
              O ecossistema completo de educação executiva, inovação e tecnologia para modernizar instituições e formar líderes preparados para os desafios do setor público.
            </p>
            <Link
              href="/sobre"
              onClick={() => setMenuOpen(false)}
              className="inline-block text-sm text-white/50 hover:text-white transition-colors mb-10"
            >
              ↳ Conheça o Instituto Plenum
            </Link>

            {/* Quick Links */}
            <div className="border-t border-white/10 pt-6">
              <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase mb-4">Links Rápidos</p>
              <ul className="flex flex-col gap-2.5">
                {[
                  { label: 'Sobre a Plenum', href: '/sobre' },
                  { label: 'Área do Aluno', href: '/aluno' },
                  { label: 'Consultoria', href: '#consultoria' },
                  { label: 'Para Empresas', href: '#empresas' },
                  { label: 'Blog', href: '#blog' },
                  { label: 'Contato', href: '#contato' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="text-sm text-white/55 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import ScrollReveal from "@/components/institutional/ScrollReveal";
import { CONTACT, OFFICES } from "@/lib/plenum-content";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-[#F1F1F1] text-[#030D1F] min-h-screen overflow-x-hidden">
      <Header />
      {children}
      <Footer />
      <ScrollReveal />
    </main>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  ctaLabel,
  ctaHref,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#030D1F] pt-36 lg:pt-48 pb-20 lg:pb-32 text-white grain-overlay">
      {image ? (
        <>
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.42]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030D1F] via-[#030D1F]/85 to-[#030D1F]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030D1F] via-transparent to-[#030D1F]/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_25%,rgba(201,162,39,0.14),transparent_45%)]" />
        </>
      ) : (
        <>
          <div className="glow-spot glow-spot--navy" style={{ width: 900, height: 560, top: -260, left: -220 }} />
          <div className="glow-spot glow-spot--gold" style={{ width: 520, height: 380, top: 30, right: -120 }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(201,162,39,0.10),transparent_32%)]" />
        </>
      )}

      <div className="relative z-10 max-w-[1280px] mx-auto px-4">
        <span className="reveal inline-flex items-center gap-2 px-4 py-2 bg-white/[0.07] border border-white/15 rounded-full text-[10px] font-semibold tracking-[0.22em] text-white/85 uppercase mb-7 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#C9A227] opacity-60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C9A227]" />
          </span>
          {eyebrow}
        </span>
        <h1 className="reveal text-display-lg text-white leading-[1.02] max-w-4xl mb-6 [text-shadow:0_2px_30px_rgba(0,0,0,0.5)]" data-reveal-delay="60">
          {title}
        </h1>
        <p className="reveal text-base lg:text-xl text-white/75 leading-relaxed max-w-2xl" data-reveal-delay="120">
          {description}
        </p>
        {ctaLabel && ctaHref && (
          <Link href={ctaHref} className="reveal btn-primary mt-8" data-reveal-delay="180">
            {ctaLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A227]/40 to-transparent" />
    </section>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className="reveal mb-10 lg:mb-14">
      {eyebrow && (
        <p className={`text-label mb-4 inline-flex items-center gap-2.5 ${light ? "text-[#C9A227]" : "text-[#8a6e1a]"}`}>
          <span className="h-px w-8 bg-current opacity-60" />
          {eyebrow}
        </p>
      )}
      <h2 className={`font-display text-[1.9rem] lg:text-[2.7rem] font-medium leading-[1.08] tracking-[-0.01em] max-w-3xl ${light ? "text-white" : "text-[#030D1F]"}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-body-lg mt-5 max-w-2xl ${light ? "text-white/65" : "text-[#4a4a4a]"}`}>
          {description}
        </p>
      )}
    </div>
  );
}

export function InfoCard({
  title,
  description,
  href,
  dark = false,
}: {
  title: string;
  description: string;
  href?: string;
  dark?: boolean;
}) {
  const content = (
    <div className={`reveal edge-gold group h-full overflow-hidden p-6 lg:p-7 ${dark ? "card-dark" : "card-light"}`}>
      <h3 className={`font-display text-[22px] leading-tight mb-3 ${dark ? "text-white" : "text-[#030D1F]"}`}>{title}</h3>
      <p className={`text-sm leading-relaxed ${dark ? "text-white/55" : "text-[#555]"}`}>
        {description}
      </p>
      {href && (
        <span className={`inline-flex items-center gap-2 mt-6 text-[12px] font-semibold uppercase tracking-wider ${dark ? "text-[#C9A227]" : "text-[#030D1F]"}`}>
          Acessar
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      )}
    </div>
  );

  if (!href) return content;
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {content}
      </a>
    );
  }
  return <Link href={href} className="block h-full">{content}</Link>;
}

export function ContactBand({
  title = "Fale com a Plenum",
  description = "Nossa equipe pode direcionar sua dúvida, proposta ou solicitação para o canal correto.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#030D1F] text-white py-16 lg:py-24 grain-overlay">
      <div className="glow-spot glow-spot--gold" style={{ width: 520, height: 360, top: -120, right: -80 }} />
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center">
        <div className="reveal">
          <p className="text-label text-[#C9A227] mb-3 inline-flex items-center gap-2">
            <span className="h-px w-6 bg-[#C9A227]/50" />
            Contato
          </p>
          <h2 className="text-display-md text-white mb-3">{title}</h2>
          <p className="text-body text-white/55 max-w-2xl">{description}</p>
        </div>
        <div className="reveal flex flex-col sm:flex-row gap-3" data-reveal-delay="100">
          <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-primary">
            WhatsApp {CONTACT.whatsapp}
          </a>
          <Link href="/contato" className="btn-outline-light">
            Outros canais
          </Link>
        </div>
      </div>
    </section>
  );
}

export function OfficesGrid() {
  return (
    <section className="bg-[#F1F1F1] py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-4">
        <SectionIntro
          eyebrow="Nossas sedes"
          title="Aguardamos sua visita em Belo Horizonte ou Brasilia."
          description="Duas bases físicas para receber alunos, parceiros e instituições públicas com a experiência presencial da Plenum."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {OFFICES.map((office, i) => (
            <article
              key={office.city}
              className="reveal group relative min-h-[440px] overflow-hidden rounded-[24px] bg-[#030D1F] text-white"
              data-reveal-delay={`${i * 90}`}
            >
              <img
                src={office.image}
                alt={office.label}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030D1F]/92 via-[#030D1F]/35 to-transparent" />
              <div className="relative z-10 flex min-h-[440px] flex-col justify-end p-6 lg:p-8">
                <span className="mb-4 w-fit rounded-full border border-[#C9A227]/40 bg-[#C9A227]/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">
                  {office.label}
                </span>
                <h3 className="font-display text-[32px] lg:text-[42px] leading-none">{office.city}</h3>
                <p className="mb-6 text-[12px] tracking-[0.2em] text-white/45 uppercase">{office.state}</p>
                <div className="mb-7 flex gap-3 text-sm leading-relaxed text-white/75">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A227]" />
                  <p>{office.address}</p>
                </div>
                <a
                  href={office.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-white transition-all hover:bg-white/20"
                >
                  Ver no Google Maps
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Reusable premium primitives ─────────────────────────────── */

export function Stat({ value, label, light = false }: { value: string; label: string; light?: boolean }) {
  return (
    <div className="reveal">
      <p className="font-display text-[2rem] lg:text-[2.9rem] font-semibold leading-[1.02] text-[#C9A227]">{value}</p>
      <p className={`mt-2.5 text-[11px] uppercase tracking-[0.14em] leading-snug ${light ? "text-white/60" : "text-[#666]"}`}>{label}</p>
    </div>
  );
}

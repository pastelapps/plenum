import Link from "next/link";
import { ArrowRight, Check, FileText, Sparkles } from "lucide-react";
import {
  ContactBand,
  PageHero,
  PageShell,
  SectionIntro,
} from "@/components/institutional/PageShell";
import { GUIDES } from "@/lib/plenum-content";
import { getPostsByTopic } from "@/lib/blog-data";

export const metadata = {
  title: "Plenum GovTech | Instituto Plenum Brasil",
  description: "Tecnologia, IA e pesquisa aplicada ao setor público.",
};

const techPosts = getPostsByTopic("tecnologia").slice(0, 3);

const cityCards = [
  "Dados abertos: o primeiro passo do município",
  "Atendimento ao cidadão com IA",
  "Indicadores que todo gestor deveria acompanhar",
];

export default function GovTechPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Plenum GovTech"
        image="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=2000"
        title="Redesenhando o setor público para a era da inteligência artificial."
        description="Uma startup dentro da Plenum: pesquisa, dados e soluções de IA para o Estado."
        ctaLabel="Agendar demonstração"
        ctaHref="/contato"
      />

      <section className="bg-[#030D1F] pb-12 text-white">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="reveal flex flex-wrap gap-3">
            {[
              ["LicitaPública", "#licitapublica"],
              ["Guias práticos", "#guias"],
              ["Blog de IA", "#blog"],
              ["Cidades inteligentes", "#cidades"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="btn-outline-light">
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="licitapublica" className="relative overflow-hidden bg-[#081422] py-16 lg:py-24 text-white grain-overlay">
        <div className="glow-spot glow-spot--gold" style={{ width: 520, height: 360, top: -120, right: -100 }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4">
          <div className="reveal card-dark edge-gold is-on border-[#C9A227]/30 p-6 lg:p-9">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center">
              <div>
                <span className="mb-4 inline-flex rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C9A227]">
                  Solução · SaaS
                </span>
                <h2 className="font-display text-[34px] lg:text-[48px] leading-tight mb-3">
                  Licita<span className="text-[#C9A227]">Pública</span>
                </h2>
                <p className="text-base text-white/60 leading-relaxed mb-6 max-w-2xl">
                  Inteligência artificial para contratações públicas.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-white/65">
                  {["Elaboração de ETP e TR", "Revisão de editais", "Segurança jurídica"].map((item) => (
                    <span key={item} className="inline-flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#C9A227]" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <Link href="/contato" className="btn-primary">
                Agendar demonstração <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="guias" className="py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-4">
          <SectionIntro
            eyebrow="Guias práticos"
            title="Materiais práticos para download."
            description="Materiais profundos para implantar, passo a passo."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {GUIDES.map((guide, i) => (
              <article key={guide} className="reveal card-light edge-gold p-6" data-reveal-delay={`${i * 80}`}>
                <FileText className="h-5 w-5 text-[#C9A227] mb-4" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9A227] mb-3">Guia · PDF</p>
                <h3 className="font-display text-[24px] leading-tight mb-6">{guide}</h3>
                <Link href="/contato" className="btn-outline-dark">
                  Baixar com e-mail
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="blog" className="relative overflow-hidden bg-[#030D1F] py-16 lg:py-24 text-white grain-overlay">
        <div className="glow-spot glow-spot--navy" style={{ width: 680, height: 440, top: -140, right: -160 }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <SectionIntro
              light
              eyebrow="Blog de IA no setor público"
              title="Blog de IA no setor público."
              description="Do blog da Plenum, filtrado pela categoria IA e Inovação."
            />
            <Link href="/blog?topic=tecnologia" className="reveal btn-outline-light shrink-0">
              Ver todos no blog
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {techPosts.map((post, i) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="reveal card-dark edge-gold group block p-6" data-reveal-delay={`${i * 80}`}>
                <Sparkles className="h-5 w-5 text-[#C9A227] mb-4" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: post.categoryColor }}>{post.category}</p>
                <h3 className="font-display text-[24px] leading-tight transition-colors group-hover:text-[#C9A227]">{post.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="cidades" className="py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-4">
          <SectionIntro
            eyebrow="Cidades inteligentes"
            title="Inovação nos municípios."
            description="Editoria dedicada à inovação nos municípios: dados, casos e tecnologia aplicada à gestão local."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {cityCards.map((title, i) => (
              <article key={title} className="reveal card-light edge-gold group overflow-hidden" data-reveal-delay={`${i * 80}`}>
                <div className="flex h-28 items-center justify-center bg-gradient-to-br from-[#030D1F] to-[#0a1c33] text-[12px] font-semibold uppercase tracking-[0.18em] text-[#C9A227]">
                  Artigo
                </div>
                <div className="p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9A227] mb-3">Cidades inteligentes</p>
                  <h3 className="font-display text-[22px] leading-tight">{title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContactBand title="Quer levar IA para sua instituição?" description="A Plenum GovTech pode apoiar diagnósticos, trilhas, guias e demonstrações para órgãos públicos." />
    </PageShell>
  );
}

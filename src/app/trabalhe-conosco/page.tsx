import { ArrowRight, BriefcaseBusiness, GraduationCap, Paperclip } from "lucide-react";
import {
  PageHero,
  PageShell,
  SectionIntro,
  Stat,
} from "@/components/institutional/PageShell";

export const metadata = {
  title: "Trabalhe Conosco | Instituto Plenum Brasil",
  description: "Construa o futuro do setor público com a Plenum.",
};

const stats = [
  ["Desde 2012", "14 anos"],
  ["+30", "profissionais"],
  ["BH · BSB · Digital", "2 sedes + hub online"],
];

const values = [
  "Integridade Inegociável",
  "Inconformados com o Comum",
  "Encantar é a Regra",
  "Mão na Massa",
  "Gente que Cuida de Gente",
];

export default function TrabalheConoscoPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Trabalhe Conosco"
        image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000"
        title="Construa o futuro do setor público com a gente."
        description="Desde 2012 formamos quem faz a gestão pública acontecer. Agora estamos construindo a edtech do setor e precisamos de gente mão na massa. #MãoNaMassa"
      />

      <section className="relative overflow-hidden bg-[#030D1F] py-16 lg:py-20 text-white grain-overlay">
        <div className="glow-spot glow-spot--gold" style={{ width: 440, height: 300, top: -60, right: -40 }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/[0.08] pt-10 mb-16">
            {stats.map(([value, label], i) => (
              <div key={value} className="reveal" data-reveal-delay={`${i * 80}`}>
                <Stat value={value} label={label} light />
              </div>
            ))}
          </div>

          <div className="reveal text-center">
            <p className="text-label text-[#C9A227] mb-3">Como é trabalhar aqui</p>
            <p className="mx-auto mb-7 max-w-2xl text-base text-white/60">
              Adultos tratam adultos como adultos. Valorizamos quem entrega e celebramos mérito com justiça.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {values.map((item) => (
                <span key={item} className="rounded-full border border-[#C9A227]/20 bg-[#C9A227]/[0.06] px-3.5 py-1.5 text-xs text-white/75">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-4">
          <SectionIntro eyebrow="Caminhos" title="Qual é o seu caminho na Plenum?" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 mb-8">
            <article className="reveal card-light edge-gold is-on border-[#C9A227]/40 p-6 lg:p-8">
              <GraduationCap className="h-7 w-7 text-[#C9A227] mb-5" />
              <h2 className="font-display text-[28px] leading-tight mb-3">Professor e palestrante</h2>
              <p className="text-sm leading-relaxed text-[#555]">
                Para quem domina um tema, tem vivência real e didática que vira aplicação. Os professores são o produto.
              </p>
            </article>
            <article className="reveal card-light edge-gold p-6 lg:p-8" data-reveal-delay="90">
              <BriefcaseBusiness className="h-7 w-7 text-[#C9A227] mb-5" />
              <h2 className="font-display text-[28px] leading-tight mb-3">Time administrativo e comercial</h2>
              <p className="text-sm leading-relaxed text-[#555]">
                Para quem quer fazer a operação acontecer, do atendimento que encanta à venda que transforma instituições.
              </p>
            </article>
          </div>

          <div className="reveal mx-auto max-w-2xl card-light p-6 lg:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a6e1a] mb-5">Formulário de interesse</p>
            <form className="space-y-3">
              <input className="w-full rounded-[14px] border border-[#030D1F]/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#C9A227]" placeholder="Nome completo" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className="w-full rounded-[14px] border border-[#030D1F]/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#C9A227]" placeholder="E-mail" />
                <input className="w-full rounded-[14px] border border-[#030D1F]/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#C9A227]" placeholder="WhatsApp" />
              </div>
              <select className="w-full rounded-[14px] border border-[#C9A227]/25 bg-[#030D1F] px-4 py-3 text-sm text-white outline-none">
                <option>Interesse: Professor / Palestrante</option>
                <option>Interesse: Time administrativo e comercial</option>
              </select>
              <input className="w-full rounded-[14px] border border-[#030D1F]/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#C9A227]" placeholder="Área de especialidade ou cargo de interesse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className="w-full rounded-[14px] border border-[#030D1F]/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#C9A227]" placeholder="LinkedIn" />
                <button type="button" className="flex items-center justify-center gap-2 rounded-[14px] border border-[#030D1F]/10 bg-white px-4 py-3 text-sm text-[#555] transition-colors hover:border-[#C9A227]">
                  <Paperclip className="h-4 w-4 text-[#C9A227]" />
                  Anexar currículo
                </button>
              </div>
              <textarea className="min-h-28 w-full rounded-[14px] border border-[#030D1F]/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#C9A227]" placeholder="Por que você é mão na massa?" />
              <button type="button" className="btn-primary w-full justify-center">
                Enviar interesse
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#030D1F] py-16 lg:py-24 text-white grain-overlay">
        <div className="glow-spot glow-spot--navy" style={{ width: 640, height: 420, bottom: -160, left: -120 }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-14 items-center">
          <div className="reveal group relative h-56 overflow-hidden rounded-[24px] border border-white/10">
            <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200" alt="Equipe Plenum em evento" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030D1F]/85 via-[#030D1F]/20 to-transparent" />
            <span className="absolute bottom-4 left-4 rounded-full bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">Equipe em evento</span>
          </div>
          <div className="reveal" data-reveal-delay="100">
            <p className="text-xl lg:text-2xl italic leading-relaxed text-white/80">
              &ldquo;Só elogiar toda a equipe, das meninas da recepção, maravilhosas e atenciosas, aos professores super capacitados.&rdquo;
            </p>
            <p className="mt-5 text-sm text-white/40">Avaliação real de aluno · o time que você vai integrar</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

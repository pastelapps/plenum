import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import {
  PageHero,
  PageShell,
  SectionIntro,
  Stat,
} from "@/components/institutional/PageShell";
import EcosystemRadial from "@/components/sections/EcosystemRadial";

export const metadata = {
  title: "Sobre a Plenum | Instituto Plenum Brasil",
  description:
    "O ecossistema Plenum une educação executiva, EducaPública, Plenum GovTech e consultoria.",
};

const aboutStats = [
  { value: "+20.000", label: "alunos formados" },
  { value: "+10.000", label: "horas de formação" },
  { value: "15", label: "estados" },
  { value: "+1.000", label: "instituições" },
];

const testimonials = [
  {
    quote: "Apliquei no primeiro edital sob a nova lei. Passou sem ressalvas.",
    person: "Nome · Pregoeira, Prefeitura/MG",
  },
  {
    quote: "O professor vai exatamente na realidade do servidor. Voltei aplicando.",
    person: "Nome · Controlador, Câmara/GO",
  },
  {
    quote: "Direcionado para aplicabilidade real. Superou minhas expectativas.",
    person: "Nome · Procuradora, TC ___",
  },
];

const culture = [
  ["1", "Integridade inegociável", "Fazemos o que ensinamos."],
  ["2", "Inconformados com o comum", "Inovação está no nosso DNA."],
  ["3", "Encantar é a regra", "A experiência do aluno vem primeiro."],
  ["4", "Mão na massa", "Quem entrega, decide."],
  ["5", "Gente que cuida de gente", "Cuidamos de quem cuida do público."],
];

export default function SobrePage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Sobre a Plenum"
        image="https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=2000"
        title="O setor público do futuro será movido por conhecimento, dados e inteligência artificial."
        description="De referência em capacitação presencial a plataforma de educação, inovação e IA para todas as esferas do Estado."
      />

      <section className="bg-[#030D1F] pb-16 lg:pb-20 text-white">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="border-t border-white/[0.08] pt-10">
            <p className="reveal mb-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A227]">Plenum em números</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 lg:divide-x lg:divide-white/10">
              {aboutStats.map((stat, i) => (
                <div key={stat.label} className="reveal lg:px-8 lg:first:pl-0" data-reveal-delay={`${i * 80}`}>
                  <Stat value={stat.value} label={stat.label} light />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <EcosystemRadial />

      <section className="py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-4">
          <SectionIntro
            eyebrow="Transformação"
            title="A Plenum transforma servidores e instituições."
            description="Conhecimento que sai da sala de aula e entra na rotina do órgão. Assista a quem aplicou."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {testimonials.map((item, i) => (
              <article key={item.quote} className="reveal card-light edge-gold group overflow-hidden" data-reveal-delay={`${i * 90}`}>
                <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-[#030D1F] to-[#0a1c33]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A227]/15 text-[#C9A227] transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-5 w-5" />
                  </span>
                </div>
                <div className="p-6">
                  <p className="mb-4 text-sm italic leading-relaxed text-[#555]">&ldquo;{item.quote}&rdquo;</p>
                  <p className="text-xs font-medium text-[#030D1F]">{item.person}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#030D1F] py-16 lg:py-24 text-white grain-overlay">
        <div className="glow-spot glow-spot--gold" style={{ width: 480, height: 320, top: -60, left: "40%" }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4">
          <p className="reveal text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A227] mb-8">
            Cultura Plenum
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            <article className="reveal relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#C9A227] to-[#e4bc44] p-7 text-[#030D1F] md:row-span-2 flex flex-col justify-between">
              <h2 className="font-display text-[30px] leading-tight mb-3">Cultura Plenum</h2>
              <p className="text-sm leading-relaxed text-[#030D1F]/75">
                A cultura é o que não se copia. Cinco compromissos guiam como ensinamos, atendemos e construímos o futuro do setor público.
              </p>
            </article>
            {culture.map(([num, title, text], i) => (
              <article key={String(title)} className="reveal card-dark edge-gold p-6" data-reveal-delay={`${i * 70}`}>
                <span className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#C9A227]/15 font-display text-[#C9A227]">{num}</span>
                <h3 className="mb-2 text-[15px] font-semibold text-white">{title}</h3>
                <p className="text-sm text-white/55">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_0.85fr] gap-10 lg:gap-20 items-center">
          <div className="reveal">
            <h2 className="text-display-md text-[#030D1F] mb-4">
              Faça parte do nosso <span className="text-[#C9A227]">time</span>
            </h2>
            <p className="text-body text-[#555] mb-8 max-w-xl">
              Valorizamos quem é mão na massa: gente que aprende sempre, encanta o aluno e não tem medo de construir o novo. <span className="text-[#C9A227] font-medium">#MãoNaMassa</span>
            </p>
            <Link href="/trabalhe-conosco" className="btn-primary">
              Conheça as vagas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="reveal group relative h-72 overflow-hidden rounded-[24px] border border-[#030D1F]/[0.06]" data-reveal-delay="100">
            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1200" alt="Equipe Plenum" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030D1F]/85 via-[#030D1F]/20 to-transparent" />
            <span className="absolute bottom-4 left-4 rounded-full bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">Equipe Plenum</span>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

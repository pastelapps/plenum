import { ArrowRight, Network, Percent, Sparkles, UsersRound } from "lucide-react";
import {
  PageHero,
  PageShell,
  SectionIntro,
} from "@/components/institutional/PageShell";

export const metadata = {
  title: "Comunidade Alumni | Instituto Plenum Brasil",
  description: "A rede de quem faz gestão pública com a Plenum.",
};

const benefits = [
  ["Agentes de IA", "Especialistas em licitações, legislativo e gestão, exclusivos para membros.", Sparkles],
  ["Rede de pares", "Encontros e grupos temáticos com quem vive os mesmos desafios.", Network],
  ["Materiais exclusivos", "Modelos, atualizações de legislação e conteúdos fora do site.", UsersRound],
  ["Condições de membro", "Vantagens em formações, eventos e na EducaPública.", Percent],
] as const;

const steps = [
  ["Informe seus dados", "Nome e CPF ou e-mail da formação."],
  ["Verificamos na base", "Conferimos sua turma no histórico de +20.000 formados."],
  ["Acesso vitalício", "Comunidade, materiais e agentes para sempre."],
];

export default function AlumniPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Comunidade Alumni Plenum"
        image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000"
        title="A rede de quem faz gestão pública."
        description="Conexões e materiais exclusivos, benefícios vitalícios de quem se forma na Plenum."
        ctaLabel="Fazer parte"
        ctaHref="/contato"
      />

      <section className="relative overflow-hidden bg-[#030D1F] py-16 lg:py-24 text-white grain-overlay">
        <div className="glow-spot glow-spot--gold" style={{ width: 460, height: 320, top: -80, right: -60 }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4">
          <p className="reveal text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A227] mb-8">
            O que você leva para sempre
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {benefits.map(([title, text, Icon], i) => (
              <article key={title} className="reveal card-dark edge-gold p-6" data-reveal-delay={`${i * 80}`}>
                <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#C9A227]/12 text-[#C9A227]">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="font-display text-[22px] leading-tight mb-3">{title}</h2>
                <p className="text-sm leading-relaxed text-white/55">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-10 lg:gap-20 items-center">
          <SectionIntro
            eyebrow="Seu consultor, 24 horas"
            title="Os agentes de IA trabalham para quem é da rede."
            description="Treinados com o conhecimento da escola, respondem dúvidas do dia a dia, da dispensa por valor ao rito da comissão, com a segurança técnica que você aprendeu em sala."
          />
          <div className="reveal card-dark edge-gold is-on bg-[#030D1F] p-6 lg:p-8 text-white" data-reveal-delay="100">
            <p className="mb-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9A227]">
              <Sparkles className="h-3.5 w-3.5" /> Agente Plenum · Licitações
            </p>
            <div className="mb-3 ml-auto w-fit max-w-[85%] rounded-[16px] rounded-tr-sm bg-white/[0.06] p-4 text-sm text-white/65">
              Qual o limite de dispensa por valor em 2026?
            </div>
            <div className="w-fit max-w-[90%] rounded-[16px] rounded-tl-sm border border-[#C9A227]/20 bg-[#C9A227]/10 p-4 text-sm text-white/85">
              Para obras e serviços de engenharia, R$ ___; para outros, R$ ___. Quer o fundamento legal?
            </div>
            <p className="mt-4 text-xs text-white/35">Exclusivo para membros da rede</p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#030D1F] py-16 lg:py-24 text-white grain-overlay">
        <div className="glow-spot glow-spot--navy" style={{ width: 640, height: 420, top: -140, left: -120 }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4">
          <p className="reveal text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A227] mb-10">
            Como ativar seu acesso
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {steps.map(([title, text], index) => (
              <article key={title} className="reveal card-dark edge-gold p-6" data-reveal-delay={`${index * 90}`}>
                <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#C9A227]/15 font-display text-lg text-[#C9A227]">
                  {index + 1}
                </div>
                <h2 className="font-display text-[22px] leading-tight mb-2">{title}</h2>
                <p className="text-sm text-white/55">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 text-center">
        <div className="reveal max-w-[760px] mx-auto px-4">
          <p className="mb-4 text-xl lg:text-2xl italic leading-relaxed text-[#030D1F]/80">
            &ldquo;A cada curso a Plenum me mostra que é a minha melhor escolha. Agora, entre um curso e outro, a rede continua comigo.&rdquo;
          </p>
          <p className="mb-8 text-sm text-[#555]">Membro da rede · aluna recorrente desde 2023</p>
          <a href="/contato" className="btn-primary">
            Fazer parte da rede
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </PageShell>
  );
}

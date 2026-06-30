import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { PageHero, PageShell } from "@/components/institutional/PageShell";

export const metadata = {
  title: "Liderança | Instituto Plenum Brasil",
  description: "Quem conduz a escola que forma líderes públicos.",
};

const leaders = [
  {
    initials: "AA",
    name: "André Azevedo",
    role: "Fundador e CEO",
    bio: "Conduz a transformação da escola em plataforma de educação, inovação e IA.",
    tags: ["14 anos de setor público"],
  },
  {
    initials: "NS",
    name: "Nome Sobrenome",
    role: "Diretor Jurídico",
    bio: "Responde pela segurança jurídica das formações e consultorias.",
    tags: ["OAB/MG", "Mestre"],
  },
  {
    initials: "NS",
    name: "Nome Sobrenome",
    role: "Coord. Acadêmico",
    bio: "Curadoria do corpo docente e do método de aplicação prática.",
    tags: ["Doutor"],
  },
  {
    initials: "NS",
    name: "Nome Sobrenome",
    role: "Diretora Administrativa",
    bio: "Comanda a operação, da recepção ao pós-curso.",
    tags: ["Gente que cuida de gente"],
  },
  {
    initials: "NS",
    name: "Nome Sobrenome",
    role: "Encarregado (DPO)",
    bio: "Zela pelos dados, nos termos da LGPD. dpo@plenumbrasil.com.br",
    tags: ["LGPD · Art. 41"],
    highlight: true,
  },
];

const seats = [
  ["Belo Horizonte", "Onde nascemos. Recebe turmas do Brasil inteiro desde 2012.", "/sede-belo-horizonte.png"],
  ["Brasília", "No centro das decisões do país.", "/sede-brasilia.jpg"],
  ["Onde você estiver", "Hub digital: a EducaPública leva a escola a todo o Brasil.", ""],
];

const pillars = [
  ["Instituto Plenum Brasil", "Conhecimento que vira aplicação no dia seguinte.", ""],
  ["Cursos", "Formação para todas as esferas.", "/cursos"],
  ["Eventos", "Congressos e seminários.", "/cursos?tipo=seminario"],
  ["Consultoria", "Diagnóstico e projetos.", "/contato"],
];

export default function LiderancaPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Liderança"
        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2000"
        title="Quem conduz a escola que forma líderes."
        description="Nascemos para dar segurança a quem faz a gestão pública acontecer. Agora, vamos prepará-los para a era da inteligência artificial."
      />

      <section className="relative overflow-hidden bg-[#030D1F] pb-16 text-white grain-overlay">
        <div className="glow-spot glow-spot--gold" style={{ width: 420, height: 300, top: -40, right: -60 }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-8 lg:gap-16 items-center pt-4">
          <div className="reveal">
            <p className="text-xl lg:text-2xl italic leading-relaxed text-white/80">
              &ldquo;Nascemos para dar segurança a quem faz a gestão pública acontecer. Agora, vamos prepará-los para a era da inteligência artificial.&rdquo;
            </p>
            <p className="mt-5 text-sm font-medium text-white">
              André Azevedo <span className="text-white/40">· Fundador e CEO</span>
            </p>
          </div>
          <div className="reveal group relative h-64 overflow-hidden rounded-[24px] border border-white/10" data-reveal-delay="100">
            <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200" alt="Liderança da Plenum" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030D1F]/85 via-[#030D1F]/25 to-transparent" />
            <span className="absolute bottom-4 left-4 rounded-full bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">Liderança reunida</span>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {leaders.map((leader, i) => (
              <article
                key={`${leader.name}-${leader.role}`}
                className={`reveal edge-gold p-6 lg:p-7 ${leader.highlight ? "card-light is-on border-[#C9A227]/40" : "card-light"}`}
                data-reveal-delay={`${i * 70}`}
              >
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#030D1F] font-display text-lg text-[#C9A227]">
                    {leader.initials}
                  </div>
                  <div>
                    <h2 className="font-display text-[24px] leading-tight">{leader.name}</h2>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6e1a]">{leader.role}</p>
                  </div>
                </div>
                <p className="mb-5 text-sm leading-relaxed text-[#555]">{leader.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {leader.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-[#C9A227]/25 bg-white/50 px-3 py-1 text-[11px] text-[#8a6e1a]">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="reveal mt-14 flex flex-wrap justify-center gap-10 lg:gap-16 border-t border-[#030D1F]/[0.06] pt-10 text-center">
            <div><p className="text-[28px] font-semibold text-[#C9A227]">+30</p><p className="text-xs text-[#555]">profissionais</p></div>
            <div><p className="text-[28px] font-semibold text-[#C9A227]">Mestres e doutores</p><p className="text-xs text-[#555]">direito e adm. pública</p></div>
            <div><p className="text-[28px] font-semibold text-[#C9A227]">OAB · TCU · RGB</p><p className="text-xs text-[#555]">reconhecimentos</p></div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#030D1F] py-16 lg:py-24 text-white grain-overlay">
        <div className="glow-spot glow-spot--navy" style={{ width: 700, height: 460, top: -120, right: -180 }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {seats.map(([title, text, image], i) => (
            <article key={title} className="reveal group card-dark edge-gold overflow-hidden" data-reveal-delay={`${i * 90}`}>
              {image ? (
                <div className="h-44 overflow-hidden">
                  <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                </div>
              ) : (
                <div className="flex h-44 items-center justify-center bg-gradient-to-br from-[#0a1c33] to-[#030D1F] text-[#C9A227]"><MapPin className="h-10 w-10" /></div>
              )}
              <div className="p-6">
                <h2 className="font-display text-[24px] leading-tight mb-2">{title}</h2>
                <p className="text-sm text-white/55">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {pillars.map(([title, text, href], i) => (
            <article key={title} className="reveal card-light edge-gold group p-6" data-reveal-delay={`${i * 70}`}>
              <h2 className="font-display text-[22px] leading-tight mb-3">{title}</h2>
              <p className="text-sm text-[#555] mb-5">{text}</p>
              {href && (
                <Link href={href} className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-[#030D1F]">
                  Acessar <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

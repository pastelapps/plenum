import { ArrowRight, Download, FileText, Scale, ShieldCheck } from "lucide-react";
import {
  ContactBand,
  PageHero,
  PageShell,
  SectionIntro,
} from "@/components/institutional/PageShell";
import { CONTACT } from "@/lib/plenum-content";

export const metadata = {
  title: "Compliance e Ouvidoria | Instituto Plenum Brasil",
  description: "Código de Ética, Política de Consequências, Ouvidoria e Canal de Denúncias.",
};

const steps = [
  "Reclamação/sugestão ou denúncia",
  "Relate, identificado ou anônimo",
  "Guarde seu protocolo",
  "Acompanhe a resposta",
];

const docs = [
  {
    icon: FileText,
    title: "Código de Ética e Conduta",
    text: "O que esperamos de cada pessoa que veste a camisa Plenum.",
    cta: "Baixar o código (PDF)",
  },
  {
    icon: Scale,
    title: "Política de Consequências",
    text: "Regras claras sobre o que acontece quando o código não é seguido.",
    cta: "Baixar a política (PDF)",
  },
];

export default function CompliancePage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Compliance e Integridade"
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2000"
        title="Fazemos o que ensinamos."
        description="Uma escola que forma o setor público em ética, controle e conformidade precisa viver essas regras antes de ensiná-las."
      />

      <section className="relative overflow-hidden bg-[#030D1F] py-16 lg:py-24 text-white grain-overlay">
        <div className="glow-spot glow-spot--gold" style={{ width: 460, height: 320, top: -80, right: -80 }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          {docs.map((doc, i) => (
            <article key={doc.title} className="reveal card-dark edge-gold p-6 lg:p-8" data-reveal-delay={`${i * 90}`}>
              <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#C9A227]/12 text-[#C9A227]">
                <doc.icon className="h-5 w-5" />
              </span>
              <h2 className="font-display text-[26px] leading-tight mb-3">{doc.title}</h2>
              <p className="text-sm leading-relaxed text-white/55 mb-6">{doc.text}</p>
              <a href="/contato" className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-[#C9A227]">
                {doc.cta} <Download className="h-3.5 w-3.5" />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-20 items-start">
          <div>
            <SectionIntro
              eyebrow="Ouvidoria e Canal de Denúncias"
              title="Viu algo errado? Conte para a gente com sigilo garantido."
              description="Reclamações, sugestões e denúncias, inclusive anônimas. Toda manifestação gera protocolo e segue ao Comitê de Integridade, nunca à área denunciada."
            />
            <div className="reveal mb-8 flex flex-wrap gap-2">
              {["Anonimato real", "Protocolo", "Resposta em 10 dias úteis"].map((item) => (
                <span key={item} className="rounded-full border border-[#C9A227]/25 bg-[#C9A227]/10 px-3 py-1 text-[12px] font-medium text-[#8a6e1a]">
                  {item}
                </span>
              ))}
            </div>
            <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="reveal btn-primary">
              Acessar o canal
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="reveal card-light p-6 lg:p-8" data-reveal-delay="100">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a6e1a] mb-6">Como funciona</p>
            <div className="space-y-5">
              {steps.map((step, index) => (
                <div key={step} className="flex items-start gap-4 text-sm text-[#444]">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C9A227]/15 text-[12px] font-bold text-[#8a6e1a]">{index + 1}</span>
                  <span className="pt-1">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#030D1F] py-16 lg:py-24 text-white grain-overlay">
        <div className="glow-spot glow-spot--navy" style={{ width: 640, height: 420, bottom: -160, left: -120 }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_0.55fr] gap-8 lg:gap-12 items-center">
          <SectionIntro
            light
            eyebrow="Governança"
            title="Comitê de Integridade"
            description="Comitê independente, com reporte direto ao CEO. Aplica a Política de Consequências para qualquer cargo."
          />
          <div className="reveal card-dark edge-gold p-7 text-center" data-reveal-delay="100">
            <ShieldCheck className="mx-auto mb-4 h-8 w-8 text-[#C9A227]" />
            <p className="text-xs text-white/45">Programa alinhado à</p>
            <p className="font-medium">Lei Anticorrupção 12.846/2013</p>
          </div>
        </div>
      </section>

      <ContactBand title="Precisa falar com a Ouvidoria?" description="Use o Canal de Denúncias ou fale com a Plenum para direcionar sua manifestação." />
    </PageShell>
  );
}

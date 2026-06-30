import { ArrowRight, FileCheck2, ShieldCheck, Star } from "lucide-react";
import {
  ContactBand,
  PageHero,
  PageShell,
  SectionIntro,
} from "@/components/institutional/PageShell";
import { CONTACT } from "@/lib/plenum-content";

export const metadata = {
  title: "Certidões e Documentos | Instituto Plenum Brasil",
  description: "Documentação institucional para contratação da Plenum.",
};

const docs = [
  ["Certidões negativas", "Federal, estadual, municipal, FGTS e trabalhista"],
  ["Documentos cadastrais", "Contrato social, CNPJ e inscrições"],
  ["Qualificação técnica", "Atestados de capacidade e referências"],
  ["Integridade", "Código de ética e programa de compliance"],
];

export default function CertidoesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Certidões e Documentos"
        image="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2000"
        title="Documentação em dia, pronta para a sua contratação."
        description="Solicite o kit completo ou documentos específicos. Enviamos direto para o seu e-mail institucional."
      />

      <section className="relative overflow-hidden bg-[#030D1F] py-16 lg:py-24 text-white grain-overlay">
        <div className="glow-spot glow-spot--gold" style={{ width: 460, height: 320, top: -80, left: "30%" }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4">
          <p className="reveal text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A227] mb-8">
            Documentos disponíveis para solicitação
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
            {docs.map(([title, description], index) => {
              const Icon = index === 2 ? Star : index === 3 ? ShieldCheck : FileCheck2;
              return (
                <article key={title} className="reveal card-dark edge-gold flex items-center gap-5 p-6 lg:p-7" data-reveal-delay={`${index * 80}`}>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#C9A227]/12 text-[#C9A227]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-[22px] leading-tight">{title}</h2>
                    <p className="text-sm text-white/50">{description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-10 lg:gap-20 items-start">
          <div>
            <SectionIntro
              eyebrow="Solicite"
              title="Precisa da documentação para contratar a Plenum?"
              description="Informe seu órgão e o que precisa. Enviamos o kit em até 1 dia útil."
            />
            <div className="reveal flex flex-wrap gap-3">
              <a href="#formulario" className="btn-outline-dark">
                Solicitar documentos
              </a>
              <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Pedir pelo WhatsApp
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div id="formulario" className="reveal card-light p-6 lg:p-8" data-reveal-delay="100">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a6e1a] mb-5">Formulário de solicitação</p>
            <form className="space-y-3">
              <input className="w-full rounded-[14px] border border-[#030D1F]/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#C9A227]" placeholder="Nome e cargo" />
              <input className="w-full rounded-[14px] border border-[#030D1F]/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#C9A227]" placeholder="Órgão ou instituição" />
              <input className="w-full rounded-[14px] border border-[#030D1F]/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#C9A227]" placeholder="E-mail institucional" />
              <textarea className="min-h-28 w-full rounded-[14px] border border-[#030D1F]/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#C9A227]" placeholder="Documentos necessários" />
              <button type="button" className="btn-primary w-full justify-center">
                Enviar solicitação
              </button>
            </form>
          </div>
        </div>
      </section>

      <ContactBand title="Documentação atualizada mensalmente" description="Dúvidas sobre habilitação? Fale com nosso jurídico." />
    </PageShell>
  );
}

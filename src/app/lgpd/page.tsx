import { ArrowRight, Check, Cookie, FileText, LockKeyhole, Mail } from "lucide-react";
import {
  ContactBand,
  PageHero,
  PageShell,
  SectionIntro,
} from "@/components/institutional/PageShell";

export const metadata = {
  title: "Privacidade e LGPD | Instituto Plenum Brasil",
  description: "Privacidade, LGPD e direitos dos titulares de dados.",
};

const collected = [
  ["Matrícula e certificação", "Nome, CPF e órgão para inscrever, certificar e comprovar sua formação."],
  ["Comunicação", "E-mail e WhatsApp para avisos de turma e materiais que você autorizar."],
  ["Melhoria da plataforma", "Uso da EducaPública para personalizar trilhas e evoluir o produto."],
];

const rights = [
  "Saber se tratamos seus dados",
  "Acessar o que temos sobre você",
  "Corrigir dados desatualizados",
  "Pedir anonimização ou exclusão",
  "Levar seus dados a outro fornecedor",
  "Revogar um consentimento dado",
];

export default function LgpdPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Privacidade e LGPD"
        image="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=2000"
        title="Seus dados, tratados com a seriedade que ensinamos."
        description="O que coletamos, seus direitos como titular e o canal direto com nosso Encarregado de Dados."
      />

      <section className="relative overflow-hidden bg-[#030D1F] py-16 lg:py-24 text-white grain-overlay">
        <div className="glow-spot glow-spot--gold" style={{ width: 460, height: 320, top: -80, right: -60 }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4">
          <p className="reveal text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A227] mb-8">
            Transparência ativa · O que coletamos e por quê
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {collected.map(([title, description], index) => {
              const Icon = index === 1 ? Mail : index === 2 ? LockKeyhole : FileText;
              return (
                <article key={title} className="reveal card-dark edge-gold p-6 lg:p-7" data-reveal-delay={`${index * 80}`}>
                  <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#C9A227]/12 text-[#C9A227]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="font-display text-[24px] leading-tight mb-3">{title}</h2>
                  <p className="text-sm text-white/55 leading-relaxed">{description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-20 items-start">
          <div>
            <SectionIntro
              eyebrow="Seus direitos · Art. 18 da LGPD"
              title="Você pode, a qualquer momento:"
              description="Texto integral no art. 18 da Lei 13.709/2018, na Política de Privacidade."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rights.map((right, i) => (
                <div key={right} className="reveal card-light flex items-start gap-3 p-4 text-sm text-[#555]" data-reveal-delay={`${i * 60}`}>
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A227]" />
                  <span>{right}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal card-light edge-gold is-on border-[#C9A227]/30 p-6 lg:p-8" data-reveal-delay="100">
            <h2 className="font-display text-[26px] leading-tight mb-3">Fale com o Encarregado</h2>
            <p className="text-sm leading-relaxed text-[#555] mb-6">
              Sua mensagem vai direto ao DPO, sem triagem comercial.
            </p>
            <form className="space-y-3">
              <input className="w-full rounded-[14px] border border-[#030D1F]/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#C9A227]" placeholder="Nome" />
              <input className="w-full rounded-[14px] border border-[#030D1F]/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#C9A227]" placeholder="E-mail" />
              <textarea className="min-h-28 w-full rounded-[14px] border border-[#030D1F]/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#C9A227]" placeholder="Sua solicitação" />
              <button type="button" className="btn-primary w-full justify-center">
                Enviar ao DPO
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#030D1F] py-16 lg:py-24 text-white grain-overlay">
        <div className="glow-spot glow-spot--navy" style={{ width: 640, height: 420, bottom: -160, left: -120 }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {[
            ["Política de Privacidade", FileText],
            ["Política de Cookies", Cookie],
            ["Termos de Uso", FileText],
          ].map(([title, Icon], i) => (
            <article key={String(title)} className="reveal card-dark edge-gold p-6 text-center" data-reveal-delay={`${i * 80}`}>
              <Icon className="mx-auto mb-5 h-6 w-6 text-[#C9A227]" />
              <h2 className="font-display text-[24px] leading-tight mb-6">{String(title)}</h2>
              <a href="/contato" className="btn-outline-light">
                Acessar
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#030D1F]/[0.06] pt-10">
          <div className="reveal">
            <p className="text-label text-[#8a6e1a] mb-3">Encarregado (DPO)</p>
            <h2 className="font-display text-[26px] leading-tight mb-2">Nome Sobrenome</h2>
            <p className="text-sm text-[#555]">dpo@plenumbrasil.com.br · conheça o DPO na página de Liderança</p>
          </div>
          <div className="reveal" data-reveal-delay="80">
            <p className="text-label text-[#8a6e1a] mb-3">Controlador</p>
            <h2 className="font-display text-[26px] leading-tight mb-2">Instituto Plenum Brasil</h2>
            <p className="text-sm text-[#555]">CNPJ XX.XXX.XXX/0001-XX · Rua Espírito Santo, 1204 · Centro · Belo Horizonte/MG</p>
          </div>
        </div>
      </section>

      <ContactBand title="Tem uma solicitação de privacidade?" description="Envie sua demanda pelo canal do Encarregado de Dados." />
    </PageShell>
  );
}

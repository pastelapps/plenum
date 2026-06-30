import { ArrowRight, FileCheck2, LockKeyhole, Mail, Megaphone, MessageCircle, Phone, ShieldCheck, UsersRound } from "lucide-react";
import {
  PageHero,
  PageShell,
} from "@/components/institutional/PageShell";
import { CONTACT, OFFICES } from "@/lib/plenum-content";

export const metadata = {
  title: "Contato | Instituto Plenum Brasil",
  description: "Fale com a Plenum pelo WhatsApp ou pelo canal certo.",
};

const channels = [
  ["Cursos e turmas", "Inscrições, agenda e certificados", UsersRound],
  ["Para instituições", "Consultoria, in company e LicitaPública", MessageCircle],
  ["Certidões e documentos", "Kit para contratação em 1 dia útil", FileCheck2],
  ["Dados pessoais (DPO)", "Direitos do titular · LGPD", LockKeyhole],
  ["Ouvidoria", "Reclamações e denúncias, com sigilo", ShieldCheck],
  ["Imprensa", "Entrevistas e informações à mídia", Megaphone],
] as const;

export default function ContatoPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Contato"
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
        title="Como podemos ajudar?"
        description="O caminho mais rápido é o WhatsApp, de segunda a sexta, das 9h às 18h."
        ctaLabel="Falar no WhatsApp"
        ctaHref="/contato#whatsapp"
      />

      <section id="whatsapp" className="relative overflow-hidden bg-[#030D1F] py-16 lg:py-24 text-white grain-overlay">
        <div className="glow-spot glow-spot--gold" style={{ width: 460, height: 320, top: -80, right: -60 }} />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4">
          <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="reveal btn-primary mb-12">
            <Phone className="h-4 w-4" />
            {CONTACT.whatsapp}
          </a>
          <p className="reveal text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A227] mb-8">
            Ou vá direto ao canal certo
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {channels.map(([title, description, Icon], i) => (
              <article key={title} className="reveal card-dark edge-gold p-6" data-reveal-delay={`${i * 70}`}>
                <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#C9A227]/12 text-[#C9A227]">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="font-display text-[22px] leading-tight mb-2">{title}</h2>
                <p className="text-sm text-white/50">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          <div className="reveal">
            <p className="text-label text-[#8a6e1a] mb-3">Prefere escrever?</p>
            <div className="card-light p-6 lg:p-8">
              <form className="space-y-3">
                <input className="w-full rounded-[14px] border border-[#030D1F]/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#C9A227]" placeholder="Nome" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input className="w-full rounded-[14px] border border-[#030D1F]/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#C9A227]" placeholder="E-mail" />
                  <input className="w-full rounded-[14px] border border-[#030D1F]/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#C9A227]" placeholder="Telefone" />
                </div>
                <select className="w-full rounded-[14px] border border-[#C9A227]/25 bg-[#030D1F] px-4 py-3 text-sm text-white outline-none">
                  <option>Assunto: Cursos e turmas</option>
                  <option>Assunto: Para instituições</option>
                  <option>Assunto: Certidões e documentos</option>
                  <option>Assunto: Dados pessoais (DPO)</option>
                  <option>Assunto: Ouvidoria</option>
                  <option>Assunto: Imprensa</option>
                </select>
                <textarea className="min-h-36 w-full rounded-[14px] border border-[#030D1F]/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#C9A227]" placeholder="Mensagem" />
                <button type="button" className="btn-primary w-full justify-center">
                  Enviar mensagem
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          <div className="reveal" data-reveal-delay="100">
            <p className="text-label text-[#8a6e1a] mb-3">Nossas sedes</p>
            <div className="space-y-4">
              {OFFICES.map((office) => (
                <article key={office.city} className="card-light group overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img src={office.image} alt={office.label} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <h2 className="font-display text-[28px] leading-tight mb-2">
                      {office.city} · {office.state}
                    </h2>
                    <p className="mb-4 text-sm leading-relaxed text-[#555]">{office.address}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-[#555]">
                      <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-[#C9A227]" />{CONTACT.whatsapp}</span>
                      <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-[#C9A227]" />{CONTACT.email}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-5 text-sm text-[#555]">Segunda a sexta, das 9h às 18h.</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

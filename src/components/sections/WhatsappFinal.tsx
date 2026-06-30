"use client";
import { MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/plenum-content";

export default function WhatsappFinal() {
    return (
        <section className="bg-[#030D1F] py-14 lg:py-24 text-white">
            <div className="max-w-[1280px] mx-auto px-4 text-center">
                <p className="text-label text-[#C9A227] mb-3">Fale com nosso time</p>
                <h2 className="text-display-md text-white mb-4">Tire sua dúvida agora, no WhatsApp</h2>
                <p className="mx-auto mb-8 max-w-2xl text-base text-white/55">
                    Cursos, turmas in company ou demonstrações. Respondemos de segunda a sexta, das 9h às 18h.
                </p>
                <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    <MessageCircle className="h-4 w-4" />
                    Falar no WhatsApp
                </a>
            </div>
        </section>
    );
}

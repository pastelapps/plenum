"use client";
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";

export default function AlumniHome() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".alumni-card", {
                opacity: 0, y: 40, duration: 0.7, ease: "power3.out",
                clearProps: "transform,opacity",
                scrollTrigger: { trigger: ".alumni-section", start: "top 80%" }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="alumni" ref={sectionRef} className="alumni-section bg-[#F1F1F1] py-14 lg:py-28">
            <div className="max-w-[1280px] mx-auto px-4">
                <div className="alumni-card rounded-[24px] overflow-hidden bg-[#F1F1F1] border border-[#030D1F]/[0.06] text-[#030D1F] text-center p-7 md:p-10 lg:p-14">
                        <p className="text-label text-[#8a6e1a] mb-3">Comunidade Alumni Plenum</p>
                        <h2 className="text-display-md text-[#030D1F] mb-5">A rede de quem faz gestão pública</h2>
                        <p className="text-base text-[#555] leading-relaxed max-w-2xl mx-auto mb-8">
                            Conexões e materiais exclusivos. Benefícios vitalícios de quem se forma na Plenum.
                        </p>
                        <a href="/alumni" className="btn-primary">
                            Fazer parte <ArrowRight className="w-4 h-4" />
                        </a>
                </div>
            </div>
        </section>
    );
}

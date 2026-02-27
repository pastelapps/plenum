"use client";
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";

const POSTS = [
    {
        id: 1,
        title: "Como a IA está transformando a gestão pública brasileira",
        category: "TECNOLOGIA",
        date: "20 Fev 2026",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: 2,
        title: "Nova Lei de Licitações: o que mudou e como se preparar",
        category: "LEGISLAÇÃO",
        date: "15 Fev 2026",
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "5 competências essenciais para líderes públicos em 2026",
        category: "LIDERANÇA",
        date: "10 Fev 2026",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
    },
];

export default function Blog() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".blog-card", {
                opacity: 0, y: 50, duration: 0.7, stagger: 0.12, ease: "power3.out",
                scrollTrigger: { trigger: ".blog-grid", start: "top 80%" }
            });

            document.querySelectorAll(".blog-card").forEach(card => {
                const img = card.querySelector(".blog-card-img");
                card.addEventListener("mouseenter", () => {
                    gsap.to(card, { y: -6, duration: 0.3, ease: "power2.out" });
                    gsap.to(img, { scale: 1.05, duration: 0.6, ease: "power2.out" });
                });
                card.addEventListener("mouseleave", () => {
                    gsap.to(card, { y: 0, duration: 0.4 });
                    gsap.to(img, { scale: 1, duration: 0.6 });
                });
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="blog" ref={sectionRef} className="bg-[#F1F1F1] py-20 lg:py-32">
            <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
                <div className="text-center mb-14 lg:mb-20">
                    <h2 className="text-display-lg text-[#0D0D0D] mb-4">INSIGHTS</h2>
                    <p className="text-sm italic text-[#555] tracking-wide uppercase">
                        Conteúdos para quem quer liderar a transformação
                    </p>
                </div>

                <div className="blog-grid grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
                    {POSTS.map((post) => (
                        <a key={post.id} href="#" className="blog-card group block rounded-[24px] overflow-hidden bg-white/60 border border-black/[0.04] hover:shadow-xl transition-shadow">
                            <div className="aspect-[16/10] overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="blog-card-img w-full h-full object-cover transform-gpu"
                                />
                            </div>
                            <div className="p-6 lg:p-7">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-[10px] font-semibold tracking-widest text-[#C9A227] uppercase">
                                        {post.category}
                                    </span>
                                    <span className="text-[10px] text-[#999]">{post.date}</span>
                                </div>
                                <h3 className="text-lg font-display font-medium text-[#0D0D0D] mb-4 leading-snug group-hover:text-[#C9A227] transition-colors">
                                    {post.title}
                                </h3>
                                <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#0D0D0D] uppercase tracking-wider">
                                    Ler mais <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

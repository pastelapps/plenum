"use client";
import { useEffect, useRef } from "react";
import { ArrowRight, Cpu } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { BLOG_POSTS } from "@/lib/blog-data";

export default function Blog() {
    const sectionRef = useRef<HTMLElement>(null);
    // Latest articles — general + technology mixed in a single feed.
    const posts = BLOG_POSTS.slice(0, 3);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".blog-card", {
                opacity: 0, y: 50, duration: 0.7, stagger: 0.12, ease: "power3.out",
                clearProps: "transform,opacity",
                scrollTrigger: { trigger: ".blog-grid", start: "top 80%" }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="blog" ref={sectionRef} className="bg-[#F1F1F1] py-14 lg:py-32">
            <div className="max-w-[1280px] mx-auto px-4">
                <div className="text-center mb-10 lg:mb-20">
                    <p className="text-label text-[#8a6e1a] mb-3">Conteúdo</p>
                    <h2 className="text-display-lg text-[#030D1F] mb-4">Plenum Insights</h2>
                    <p className="text-body text-[#555] max-w-2xl mx-auto">
                        Artigos, guias e análises sobre gestão pública, licitações, liderança, IA e tecnologia para governos.
                    </p>
                </div>

                <div className="blog-grid grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
                    {posts.map((post) => (
                        <a key={post.slug} href={`/blog/${post.slug}`} className="blog-card group block rounded-[16px] md:rounded-[24px] overflow-hidden bg-white/70 border border-[#030D1F]/[0.04] hover:shadow-xl transition-shadow">
                            <div className="aspect-[16/10] overflow-hidden">
                                <img src={post.heroImage} alt={post.title} className="blog-card-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-5 md:p-6 lg:p-7">
                                <div className="flex items-center gap-2 mb-4 flex-wrap">
                                    <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: post.categoryColor }}>{post.category}</span>
                                    {post.topic === "tecnologia" && (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#8a6e1a]">
                                            <Cpu className="h-2.5 w-2.5" /> Tecnologia
                                        </span>
                                    )}
                                    <span className="text-[10px] text-[#999]">{post.date}</span>
                                </div>
                                <h3 className="text-lg font-display font-medium text-[#030D1F] mb-4 leading-snug group-hover:text-[#C9A227] transition-colors">
                                    {post.title}
                                </h3>
                                <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#030D1F] uppercase tracking-wider">
                                    Ler mais <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                                </span>
                            </div>
                        </a>
                    ))}
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                    <a href="/blog" className="btn-outline-dark">
                        Ver todos os artigos
                        <ArrowRight className="w-4 h-4" />
                    </a>
                    <a href="/blog?topic=tecnologia" className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/35 bg-[#C9A227]/[0.08] px-6 py-3 text-sm font-medium text-[#8a6e1a] transition-colors hover:bg-[#C9A227]/15">
                        <Cpu className="h-4 w-4" />
                        Blog de Tecnologia
                    </a>
                </div>
            </div>
        </section>
    );
}

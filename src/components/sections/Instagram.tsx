"use client";
import { useEffect, useRef } from "react";
import { Instagram as InstagramIcon } from "lucide-react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import type { InstagramPost } from "@/types/instagram";

const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1577985043696-8bd54d9f093f?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop",
];

interface InstagramProps {
    posts?: InstagramPost[];
}

export default function Instagram({ posts }: InstagramProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const hasPosts = posts && posts.length > 0;

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".insta-header", {
                opacity: 0, y: 30, duration: 0.7, ease: "power3.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
            });
            gsap.from(".insta-item", {
                opacity: 0, scale: 0.95, duration: 0.5, stagger: 0.05, ease: "power3.out",
                scrollTrigger: { trigger: ".insta-grid", start: "top 85%" }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    // Build items: use API posts if available, otherwise fallback images
    const items = hasPosts
        ? posts.slice(0, 8).map((post) => ({
            id: post.id,
            src: post.media_type === "VIDEO" ? post.thumbnail_url! : post.media_url,
            href: post.permalink,
            alt: post.caption || "Instagram post",
            caption: post.caption,
        }))
        : FALLBACK_IMAGES.map((img, i) => ({
            id: String(i),
            src: img,
            href: "https://instagram.com/plenumbrasil",
            alt: "",
            caption: undefined as string | undefined,
        }));

    return (
        <section ref={sectionRef} className="bg-[#F1F1F1] py-12 lg:py-24">
            {/* Header — title left, button top-right */}
            <div className="insta-header max-w-[1280px] mx-auto px-4 mb-8 lg:mb-16">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-display-lg text-[#030D1F]">
                            @plenumbrasil
                        </h2>
                        <div className="w-12 h-[3px] bg-[#C9A227] mt-4 mb-5" />
                        <p className="text-sm text-[#555] leading-relaxed max-w-md">
                            Acompanhe nossa comunidade no Instagram para novidades, eventos e bastidores da gestão pública.
                        </p>
                    </div>
                    <a
                        href="https://instagram.com/plenumbrasil"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#030D1F]/15 text-[#030D1F] text-[12px] font-semibold uppercase tracking-wider hover:bg-[#030D1F] hover:text-white transition-all duration-300 shrink-0"
                    >
                        <InstagramIcon className="w-4 h-4" />
                        Siga-nos
                    </a>
                </div>
            </div>

            {/* Grid 4x2 — inside container, corner radius on outer corners only */}
            <div className="max-w-[1280px] mx-auto px-4">
                <div className="insta-grid grid grid-cols-2 lg:grid-cols-4 gap-[3px] lg:gap-1 rounded-[16px] lg:rounded-[24px] overflow-hidden">
                    {items.map((item, i) => (
                        <a
                            key={item.id}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`insta-item relative aspect-[4/5] overflow-hidden group${i >= 6 ? " hidden lg:block" : ""}`}
                        >
                            {hasPosts ? (
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                            ) : (
                                <img
                                    src={item.src}
                                    alt={item.alt}
                                    className="w-full h-full object-cover"
                                />
                            )}

                            {/* Hover overlay — gradient bottom + caption */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            {item.caption && (
                                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                    <p className="text-white text-sm line-clamp-3 leading-relaxed">
                                        {item.caption}
                                    </p>
                                </div>
                            )}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

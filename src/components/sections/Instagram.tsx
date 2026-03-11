"use client";
import { useEffect, useRef } from "react";
import { Instagram as InstagramIcon } from "lucide-react";
import { gsap } from "@/lib/gsap";

const POSTS = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1577985043696-8bd54d9f093f?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
];

export default function Instagram() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".insta-item", {
                opacity: 0, scale: 0.9, duration: 0.5, stagger: 0.08, ease: "power3.out",
                scrollTrigger: { trigger: ".insta-grid", start: "top 85%" }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="bg-[#F1F1F1] py-20 lg:py-28">
            <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
                <div className="text-center mb-12">
                    <h2 className="text-display-lg text-[#030D1F] mb-4">@PLENUMBRASIL</h2>
                    <p className="text-sm italic text-[#555] tracking-wide uppercase">
                        Acompanhe nossa jornada
                    </p>
                </div>

                <div className="insta-grid grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
                    {POSTS.map((img, i) => (
                        <a
                            key={i}
                            href="#"
                            className="insta-item relative aspect-square rounded-[20px] overflow-hidden group"
                        >
                            <img src={img} alt="" className="w-full h-full object-cover transform-gpu group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-[#030D1F]/0 group-hover:bg-[#030D1F]/40 transition-colors duration-300 flex items-center justify-center">
                                <InstagramIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

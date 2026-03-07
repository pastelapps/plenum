"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Professors() {
    const [visible, setVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
        }, { threshold: 0.2 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    const professors = [
        { name: "Lorem Ipsum", role: "Dolor sit amet consectetur", bio: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.", brands: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop" },
        { name: "Dolor Amet", role: "Consectetur adipiscing elit", bio: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.", brands: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=1000&fit=crop" },
        { name: "Consectetur Elit", role: "Sed do eiusmod tempor", bio: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet.", brands: "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1000&fit=crop" },
        { name: "Adipiscing Sed", role: "Ut labore et dolore magna", bio: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae.", brands: "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop" },
    ];

    const next = () => setActiveIndex((i) => (i + 1) % professors.length);
    const prev = () => setActiveIndex((i) => (i - 1 + professors.length) % professors.length);

    return (
        <section ref={ref} className="relative py-20 lg:py-32 bg-[#0A0A0A]">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className={`space-y-6 transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}`} style={{ transitionDelay: "200ms" }}>
                        <div className="w-12 h-12 rounded-full border border-dashed border-white/30 animate-spin-slow" />
                        <p className="text-white/90 text-lg leading-relaxed">{professors[activeIndex].bio}</p>
                        <div>
                            <p className="text-white font-medium">{professors[activeIndex].name}</p>
                            <p className="text-white/60 text-sm">{professors[activeIndex].role}</p>
                        </div>
                        <div className="flex items-center gap-4 pt-6">
                            <button onClick={prev} className="w-12 h-12 rounded-full bg-[#D4F34A] flex items-center justify-center text-black hover:bg-[#c5e43d] transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={next} className="w-12 h-12 rounded-full bg-[#D4F34A] flex items-center justify-center text-black hover:bg-[#c5e43d] transition-colors">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className={`relative transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`} style={{ transitionDelay: "400ms" }}>
                        <div className="relative rounded-3xl overflow-hidden aspect-[4/5]">
                            <img
                                src={professors[activeIndex].image}
                                alt={professors[activeIndex].name}
                                className="w-full h-full object-cover grayscale transition-all duration-500"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-3xl font-medium text-white mb-2">{professors[activeIndex].name}</h3>
                                <p className="text-white/70 text-sm">{professors[activeIndex].brands}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

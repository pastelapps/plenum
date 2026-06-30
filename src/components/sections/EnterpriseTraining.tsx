"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, BookOpen, Library, Users } from "lucide-react";

export default function EnterpriseTraining() {
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

    const testimonials = [
        { company: "LOREM", logo: "L", quote: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.", author: "Lorem Ipsum", role: "Dolor Amet / Consectetur", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop" },
        { company: "IPSUM", logo: "I", quote: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.", author: "Dolor Amet", role: "Adipiscing / Elit Sed", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop" },
        { company: "DOLOR", logo: "D", quote: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.", author: "Consectetur Adipiscing", role: "Tempor / Incididunt", image: "https://images.unsplash.com/photo-1521119989659-a83eee488058?w=800&h=600&fit=crop" },
        { company: "AMET", logo: "A", quote: "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.", author: "Sed Eiusmod", role: "Labore / Magna", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=600&fit=crop" },
    ];

    const next = () => setActiveIndex((i) => (i + 1) % testimonials.length);
    const prev = () => setActiveIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

    return (
        <section ref={ref} id="enterprise" className="relative py-20 lg:py-32 bg-[#0A0A0A]">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    <div className="space-y-8">
                        <h2 className={`text-4xl lg:text-5xl font-medium text-white tracking-[-0.02em] transition-all duration-600 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}`}>
                            Lorem ipsum<br />dolor sit amet
                        </h2>
                        <a
                            href="#"
                            className={`inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white rounded-full text-sm font-medium hover:bg-white/10 transition-all duration-300 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
                            style={{ transitionDelay: "100ms" }}
                        >
                            Lorem Ipsum <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                    <div className={`space-y-8 transition-all duration-600 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`} style={{ transitionDelay: "150ms" }}>
                        <p className="text-lg text-white/80">
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
                        </p>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full border border-dashed border-white/30 animate-spin-slow" />
                                <div>
                                    <p className="text-2xl font-medium text-white">+20</p>
                                    <p className="text-xs text-white/60 uppercase tracking-wider">LOREM</p>
                                </div>
                            </div>
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A0A0A] bg-gradient-to-br from-gray-600 to-gray-800 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${40 + i}`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border border-dashed border-white/30 animate-spin-slow" />
                            <p className="text-white/80">Lorem ipsum dolor sit amet elit.</p>
                        </div>
                    </div>
                </div>

                <div className={`relative mt-16 rounded-3xl overflow-hidden transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`} style={{ transitionDelay: "300ms", minHeight: "400px" }}>
                    <div className="absolute inset-0">
                        <img src={testimonials[activeIndex].image} alt="" className="w-full h-full object-cover" style={{ transform: "scale(1.05)" }} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#030D1F]/80 via-[#030D1F]/50 to-transparent" />
                    <div className="relative grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
                        <div className="glass-dark rounded-2xl p-6 lg:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#030D1F] font-bold">{testimonials[activeIndex].logo}</div>
                                <span className="text-white font-medium">{testimonials[activeIndex].company}</span>
                            </div>
                            <p className="text-white/90 text-sm leading-relaxed mb-6">&ldquo;{testimonials[activeIndex].quote}&rdquo;</p>
                            <div>
                                <p className="text-white font-medium">{testimonials[activeIndex].author}</p>
                                <p className="text-white/60 text-sm">{testimonials[activeIndex].role}</p>
                            </div>
                        </div>
                        <div className="flex items-end justify-end">
                            <div className="flex items-center gap-3">
                                <button onClick={prev} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button onClick={next} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`grid md:grid-cols-3 gap-4 mt-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: "400ms" }}>
                    {[
                        { icon: BookOpen, label: "LOREM IPSUM" },
                        { icon: Library, label: "DOLOR SIT AMET" },
                        { icon: Users, label: "CONSECTETUR" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-center gap-3 p-6 border border-white/10 rounded-2xl hover:border-white/20 transition-colors">
                            <item.icon className="w-5 h-5 text-white/60" />
                            <span className="text-sm font-medium text-white/80">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

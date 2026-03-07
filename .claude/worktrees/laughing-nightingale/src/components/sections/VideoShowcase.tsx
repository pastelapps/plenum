"use client";
import { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";

export default function VideoShowcase() {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
        }, { threshold: 0.1 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <section ref={ref} className="relative py-20 lg:py-32 bg-[#0A0A0A]">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                    <h2
                        className={`text-4xl lg:text-5xl font-medium text-white tracking-[-0.02em] transition-all duration-600 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}`}
                    >
                        Lorem ipsum<br />dolor sit amet
                    </h2>
                    <p
                        className={`text-white/70 text-lg transition-all duration-600 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`}
                        style={{ transitionDelay: "200ms" }}
                    >
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>

                <div
                    className={`relative rounded-3xl overflow-hidden transition-all duration-700 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    style={{ transitionDelay: "300ms", minHeight: "500px" }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1400&h=800&fit=crop"
                        alt="Video showcase"
                        className="w-full h-full object-cover absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <button className="w-20 h-20 rounded-full bg-[#D4F34A] flex items-center justify-center hover:bg-[#c5e43d] transition-all duration-300 hover:scale-110">
                            <Play className="w-8 h-8 text-black ml-1" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

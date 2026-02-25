"use client";
import { useState, useEffect, useRef } from "react";

export default function WhyHuman() {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
        }, { threshold: 0.2 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    const stats = [
        { number: "+5000", label: "LOREM IPSUM" },
        { number: "+20", label: "DOLOR AMET" },
        { number: "+50", label: "CONSECTETUR" },
    ];

    return (
        <section ref={ref} className="relative py-20 lg:py-32 bg-white">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div>
                        <div
                            className={`flex items-center gap-1 text-3xl mb-6 transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                        >
                            <span className="font-semibold text-black">/H</span>
                            <span className="font-normal text-black">Academy</span>
                            <span className="text-xs text-black/60 align-top">™</span>
                        </div>
                        <h2
                            className={`text-4xl lg:text-5xl font-medium text-black tracking-[-0.02em] mb-6 transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                            style={{ transitionDelay: "100ms" }}
                        >
                            Lorem ipsum dolor<br />sit amet elit
                        </h2>
                        <p
                            className={`text-gray-600 text-lg leading-relaxed transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                            style={{ transitionDelay: "200ms" }}
                        >
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
                        </p>
                    </div>

                    <div
                        className={`grid grid-cols-3 gap-6 transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`}
                        style={{ transitionDelay: "300ms" }}
                    >
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-dashed border-black/20 animate-spin-slow" />
                                <p className="text-3xl font-medium text-black">{stat.number}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mt-2">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

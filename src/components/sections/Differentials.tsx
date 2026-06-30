"use client";
import { useState, useEffect, useRef } from "react";
import { Zap, Target, Users, Lightbulb, Rocket, Shield } from "lucide-react";

export default function Differentials() {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
        }, { threshold: 0.1 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    const items = [
        { icon: Zap, title: "Lorem Ipsum", desc: "Sed ut perspiciatis unde omnis iste natus error sit." },
        { icon: Target, title: "Dolor Amet", desc: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur." },
        { icon: Users, title: "Consectetur", desc: "Ut enim ad minima veniam, quis nostrum exercitationem." },
        { icon: Lightbulb, title: "Adipiscing", desc: "Quis autem vel eum iure reprehenderit qui in ea." },
        { icon: Rocket, title: "Tempor Labore", desc: "At vero eos et accusamus et iusto odio dignissimos." },
        { icon: Shield, title: "Magna Aliqua", desc: "Nam libero tempore, cum soluta nobis est eligendi." },
    ];

    return (
        <section ref={ref} className="relative py-20 lg:py-32 bg-[#F5F5F5]">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2
                        className={`text-4xl lg:text-5xl font-medium text-[#030D1F] tracking-[-0.02em] transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                    >
                        Lorem ipsum dolor
                    </h2>
                    <p
                        className={`text-gray-600 mt-4 max-w-xl mx-auto transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                        style={{ transitionDelay: "100ms" }}
                    >
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className={`group bg-white rounded-2xl p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                                }`}
                            style={{ transitionDelay: `${100 + i * 80}ms` }}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-[#D4F34A]/10 flex items-center justify-center mb-6 group-hover:bg-[#D4F34A]/20 transition-colors">
                                <item.icon className="w-7 h-7 text-[#0A0A0A]" />
                            </div>
                            <h3 className="text-xl font-medium text-[#030D1F] mb-3">{item.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

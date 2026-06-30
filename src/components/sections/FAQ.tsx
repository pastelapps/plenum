"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
    const [visible, setVisible] = useState(false);
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
        }, { threshold: 0.1 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    const faqs = [
        { q: "Lorem ipsum dolor sit amet?", a: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam." },
        { q: "Ut enim ad minim veniam?", a: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit." },
        { q: "Duis aute irure dolor?", a: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
        { q: "Excepteur sint occaecat?", a: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores." },
        { q: "Nemo enim ipsam voluptatem?", a: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam." },
        { q: "Sed ut perspiciatis unde?", a: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti." },
    ];

    return (
        <section ref={ref} className="relative py-20 lg:py-32 bg-[#0A0A0A]">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    <div>
                        <h2
                            className={`text-4xl lg:text-5xl font-medium text-white tracking-[-0.02em] mb-6 transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                        >
                            Lorem ipsum<br />dolor sit amet
                        </h2>
                        <p
                            className={`text-white/60 transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                            style={{ transitionDelay: "100ms" }}
                        >
                            Ut enim ad minim veniam, quis nostrud exercitation.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className={`border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                    }`}
                                style={{ transitionDelay: `${100 + i * 60}ms` }}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    className="w-full flex items-center justify-between p-6 text-left text-white hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-medium">{faq.q}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-white/60 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}
                                    />
                                </button>
                                {openIndex === i && (
                                    <div className="px-6 pb-6">
                                        <p className="text-white/60 text-sm leading-relaxed">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

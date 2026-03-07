"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function Newsletter() {
    const [visible, setVisible] = useState(false);
    const [email, setEmail] = useState("");
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
        }, { threshold: 0.2 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Lorem ipsum!");
        setEmail("");
    };

    return (
        <section ref={ref} className="relative py-20 lg:py-32 overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&h=600&fit=crop"
                    alt="Background"
                    className={`w-full h-full object-cover transition-all duration-1000 ${visible ? "scale-100" : "scale-110"}`}
                />
            </div>
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="space-y-8">
                        <div className={`transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                            <span className="text-white/80 text-lg">/HUMAN Lorem</span>
                        </div>
                        <h2
                            className={`text-3xl lg:text-4xl font-medium text-white leading-tight tracking-[-0.02em] transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                            style={{ transitionDelay: "200ms" }}
                        >
                            Lorem ipsum dolor sit amet consectetur adipiscing
                        </h2>
                        <p
                            className={`text-white/70 transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                            style={{ transitionDelay: "300ms" }}
                        >
                            Sed ut perspiciatis unde, omnis 10h.
                        </p>
                        <form
                            onSubmit={handleSubmit}
                            className={`flex items-center gap-2 p-2 bg-[#D4F34A] rounded-full max-w-md transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                            style={{ transitionDelay: "400ms" }}
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="LOREM IPSUM"
                                className="flex-1 px-4 py-3 bg-transparent text-black placeholder:text-black/60 text-sm font-medium focus:outline-none"
                                required
                            />
                            <button
                                type="submit"
                                className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-900 transition-colors"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    <div
                        className={`text-right transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`}
                        style={{ transitionDelay: "300ms" }}
                    >
                        <div className="flex items-center justify-end gap-3 mb-6">
                            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">LOREM</span>
                            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">IPSUM</span>
                        </div>
                        <h3 className="text-5xl lg:text-7xl font-medium text-white tracking-[-0.03em]">Newsletter</h3>
                        <p className="text-3xl lg:text-4xl font-medium text-white/80 mt-2">Lorem Ipsum</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

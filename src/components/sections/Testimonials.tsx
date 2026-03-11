"use client";
import { useState, useEffect, useRef } from "react";

export default function Testimonials() {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
        }, { threshold: 0.1 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    const testimonials = [
        { name: "@loremipsum", avatar: "https://i.pravatar.cc/100?img=30", text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium." },
        { name: "@doloramet", avatar: "https://i.pravatar.cc/100?img=31", text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur." },
        { name: "@consectetur", avatar: "https://i.pravatar.cc/100?img=32", text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum." },
        { name: "@adipiscing", avatar: "https://i.pravatar.cc/100?img=33", text: "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod." },
        { name: "@eiusmod", avatar: "https://i.pravatar.cc/100?img=34", text: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet." },
        { name: "@tempor", avatar: "https://i.pravatar.cc/100?img=35", text: "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores." },
        { name: "@incididunt", avatar: "https://i.pravatar.cc/100?img=36", text: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae." },
        { name: "@labore", avatar: "https://i.pravatar.cc/100?img=37", text: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet." },
    ];

    return (
        <section ref={ref} className="relative py-20 lg:py-32 bg-[#F5F5F5]">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-8 mb-16">
                    <div>
                        <div className={`flex items-center gap-1 text-3xl mb-4 transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                            <span className="font-semibold">/H</span>
                            <span className="font-normal">Academy</span>
                            <span className="text-xs align-top">™</span>
                        </div>
                        <h2
                            className={`text-4xl lg:text-5xl font-medium text-[#030D1F] tracking-[-0.02em] transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                            style={{ transitionDelay: "100ms" }}
                        >
                            Lorem ipsum dolor<br />sit amet elit
                        </h2>
                    </div>
                    <div
                        className={`lg:text-right lg:self-end transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                        style={{ transitionDelay: "200ms" }}
                    >
                        <p className="text-gray-600 max-w-md lg:ml-auto">
                            Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className={`group bg-white rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                                }`}
                            style={{
                                transitionDelay: `${100 + i * 80}ms`,
                                minHeight: i % 3 === 0 ? "200px" : i % 3 === 1 ? "240px" : "180px",
                            }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={t.avatar}
                                    alt={t.name}
                                    className="w-10 h-10 rounded-full object-cover group-hover:scale-110 transition-transform"
                                />
                                <span className="text-sm font-medium text-gray-700">{t.name}</span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function Courses() {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
        }, { threshold: 0.1 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    const courses = [
        { title: "Lorem Ipsum PRO", tag: "LOREM", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop" },
        { title: "Dolor Sit Amet PRO", tag: "IPSUM", image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=400&fit=crop" },
        { title: "Consectetur PRO", tag: "DOLOR", image: "https://images.unsplash.com/photo-1686191128892-3b37add4c844?w=600&h=400&fit=crop" },
        { title: "Adipiscing Elit", tag: "AMET", image: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=600&h=400&fit=crop" },
        { title: "Sed Eiusmod PRO", tag: "TEMPOR", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop" },
    ];

    return (
        <section ref={ref} id="courses" className="relative py-20 lg:py-32 bg-[#0A0A0A]">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-8 mb-16">
                    <div>
                        <div className={`flex items-center gap-1 text-3xl mb-4 transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                            <span className="font-semibold">/H</span>
                            <span className="font-normal">Academy</span>
                            <span className="text-xs align-top">™</span>
                        </div>
                        <h2
                            className={`text-4xl lg:text-5xl font-medium text-white tracking-[-0.02em] transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                            style={{ transitionDelay: "100ms" }}
                        >
                            Lorem ipsum dolor<br />sit amet consectetur
                        </h2>
                    </div>
                    <div
                        className={`lg:text-right lg:self-end transition-all duration-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                        style={{ transitionDelay: "200ms" }}
                    >
                        <p className="text-white/60 max-w-md lg:ml-auto">
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course, i) => (
                        <div
                            key={i}
                            className={`group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                                }`}
                            style={{ transitionDelay: `${100 + i * 100}ms`, minHeight: "320px" }}
                        >
                            <img
                                src={course.image}
                                alt={course.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                                    {course.tag}
                                </span>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <h3 className="text-xl font-medium text-white mb-3">{course.title}</h3>
                                <div className="flex items-center gap-2 text-[#D4F34A] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    Lorem ipsum <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

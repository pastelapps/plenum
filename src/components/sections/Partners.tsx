"use client";

export default function Partners() {
    const partners = Array.from({ length: 8 }, (_, i) => `Partner ${i + 1}`);

    return (
        <section className="relative py-12 bg-[#0A0A0A] border-y border-white/5 overflow-hidden">
            <div className="animate-scroll-left flex items-center gap-16 whitespace-nowrap">
                {[...partners, ...partners].map((name, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 text-white/30 hover:text-white/60 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                            {name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium uppercase tracking-wider">{name}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

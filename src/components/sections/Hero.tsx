"use client";
import { useEffect, useRef } from "react";

export default function Hero() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.75;
        }
    }, []);

    return (
        <>
            {/* Camada 1: Vídeo FIXO na viewport (z-1) — fica parado na tela */}
            <div className="fixed inset-0 z-[1] bg-[#0d0e10]">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="/clipehero.mp4" type="video/mp4" />
                </video>
                {/* Overlay escuro */}
                <div className="absolute inset-0 bg-black/45" />
            </div>

            {/* Camada 2: Hero texto (z-5) — flui com o scroll */}
            <section className="relative z-[5] min-h-[85vh] lg:min-h-screen flex items-center justify-center">
                <h1 className="hero-title text-white text-center font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[32px] md:text-[48px] lg:text-[56px] leading-[1.1] tracking-[-0.02em] max-w-[800px] px-6">
                    {/* Palavras com animação pop-up escalonada */}
                    {["Formamos", "os", "Lideres", "que", "Transformam", "o", "Setor", "Publico"].map((word, i) => (
                        <span
                            key={i}
                            className="inline-block overflow-hidden mr-[0.3em] last:mr-0"
                        >
                            <span
                                className="inline-block animate-hero-word"
                                style={{ animationDelay: `${i < 3 ? 0.3 : i < 5 ? 0.6 : 0.9}s` }}
                            >
                                {word}
                            </span>
                        </span>
                    ))}
                </h1>
            </section>
        </>
    );
}

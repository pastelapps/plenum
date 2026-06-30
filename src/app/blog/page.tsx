import { BLOG_POSTS, type BlogTopic } from "@/lib/blog-data";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import BlogList from "@/components/sections/BlogList";

export const metadata = {
    title: "Plenum Insights | Instituto Plenum Brasil",
    description: "Artigos, análises e guias sobre gestão pública, licitações, tecnologia e liderança.",
};

export default async function BlogListingPage({
    searchParams,
}: {
    searchParams: Promise<{ topic?: string }>;
}) {
    const sp = await searchParams;
    const initialTopic: "todos" | BlogTopic =
        sp.topic === "tecnologia" || sp.topic === "geral" ? sp.topic : "todos";

    return (
        <main className="bg-[#F1F1F1] text-[#030D1F] min-h-screen">
            <Header />
            <section className="relative overflow-hidden bg-[#030D1F] text-white pt-32 lg:pt-40 pb-16 lg:pb-24 grain-overlay">
                <div className="glow-spot glow-spot--navy" style={{ width: 820, height: 520, top: -240, left: -200 }} />
                <div className="glow-spot glow-spot--gold" style={{ width: 460, height: 340, top: 20, right: -120 }} />
                <div className="relative z-10 max-w-[1100px] mx-auto px-6">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.06] border border-white/12 rounded-full text-[10px] font-semibold tracking-[0.2em] text-white/70 uppercase mb-6 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-[#C9A227] opacity-60 animate-ping" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C9A227]" />
                        </span>
                        Conteúdo
                    </span>
                    <h1 className="text-display-lg text-white mb-4">Plenum Insights</h1>
                    <p className="text-white/55 text-base lg:text-lg max-w-2xl leading-relaxed">
                        Análises, guias e reflexões sobre gestão pública, inovação, licitações, liderança e IA no setor público. Use as abas para filtrar o blog <span className="text-white/80">geral</span> ou o de <span className="text-[#C9A227]">tecnologia</span>.
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A227]/30 to-transparent" />
            </section>

            <section className="pt-12">
                <BlogList posts={BLOG_POSTS} initialTopic={initialTopic} />
            </section>
            <Footer />
        </main>
    );
}

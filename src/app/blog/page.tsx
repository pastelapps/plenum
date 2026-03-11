import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-data";
import Header from "@/components/sections/Header";

export const metadata = {
    title: "Blog — Instituto Plenum",
    description: "Artigos, analises e insights sobre gestao publica, licitacoes, tecnologia e lideranca.",
};

export default function BlogListingPage() {
    const featured = BLOG_POSTS[0];
    const rest = BLOG_POSTS.slice(1);

    return (
        <main className="bg-white text-[#111] min-h-screen">
            <Header />

            {/* ─── Header ─── */}
            <div className="max-w-[1100px] mx-auto px-6 pt-28 pb-10 border-b border-[#eee]">
                <h1 className="text-[38px] md:text-[48px] font-extrabold leading-[1.05] tracking-[-0.02em] mb-3">
                    Plenum Blog
                </h1>
                <p className="text-[18px] text-[#666] max-w-[600px]">
                    Noticias, analises e insights sobre gestao publica, legislacao, tecnologia e lideranca.
                </p>
            </div>

            {/* ─── Featured Post ─── */}
            <div className="max-w-[1100px] mx-auto px-6 py-12">
                <Link href={`/blog/${featured.slug}`} className="group grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden">
                        <Image
                            src={featured.heroImage}
                            alt={featured.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            priority
                        />
                    </div>
                    <div>
                        <span
                            className="inline-block text-[11px] font-bold tracking-[0.15em] uppercase mb-3"
                            style={{ color: featured.categoryColor }}
                        >
                            {featured.category}
                        </span>
                        <h2 className="text-[28px] md:text-[34px] font-extrabold leading-[1.1] tracking-[-0.01em] text-[#111] group-hover:text-[#555] transition-colors mb-4">
                            {featured.title}
                        </h2>
                        <p className="text-[16px] text-[#666] leading-[1.55] mb-5">
                            {featured.subtitle}
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                <Image src={featured.author.avatar} alt={featured.author.name} fill className="object-cover" />
                            </div>
                            <p className="text-[13px] text-[#888]">
                                {featured.author.name} &middot; {featured.date} &middot; {featured.readTime}
                            </p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* ─── Divider ─── */}
            <div className="max-w-[1100px] mx-auto px-6">
                <hr className="border-t border-[#eee]" />
            </div>

            {/* ─── Post Grid ─── */}
            <div className="max-w-[1100px] mx-auto px-6 py-12">
                <h2 className="text-[13px] font-bold tracking-[0.15em] uppercase text-[#888] mb-8">
                    Todos os artigos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rest.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                            <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden mb-4">
                                <Image
                                    src={post.heroImage}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <span
                                className="inline-block text-[10px] font-bold tracking-[0.15em] uppercase mb-2"
                                style={{ color: post.categoryColor }}
                            >
                                {post.category}
                            </span>
                            <h3 className="text-[19px] font-bold leading-[1.25] text-[#111] group-hover:text-[#555] transition-colors mb-2">
                                {post.title}
                            </h3>
                            <p className="text-[14px] text-[#888] line-clamp-2 mb-3">
                                {post.subtitle}
                            </p>
                            <p className="text-[13px] text-[#aaa]">
                                {post.author.name} &middot; {post.readTime}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ─── Newsletter CTA ─── */}
            <section className="border-t border-[#eee] bg-[#FAFAFA]">
                <div className="max-w-[600px] mx-auto px-6 py-16 text-center">
                    <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#888] mb-3">
                        Newsletter
                    </p>
                    <h2 className="text-[26px] font-bold text-[#111] mb-3">
                        Fique por dentro do setor publico
                    </h2>
                    <p className="text-[15px] text-[#666] mb-6">
                        Uma curadoria semanal com as principais noticias e analises. Sem spam.
                    </p>
                    <div className="flex gap-3 max-w-[440px] mx-auto">
                        <input
                            type="email"
                            placeholder="seu@email.com"
                            className="flex-1 h-12 px-4 rounded-lg border border-[#ddd] text-[15px] outline-none focus:border-[#C9A227] transition-colors"
                        />
                        <button className="h-12 px-6 rounded-lg bg-[#111] text-white text-[14px] font-semibold hover:bg-[#333] transition-colors">
                            Assinar
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}

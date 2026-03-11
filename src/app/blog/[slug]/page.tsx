import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS, getPostBySlug, getRelatedPosts } from "@/lib/blog-data";
import type { ContentBlock } from "@/lib/blog-data";
import Header from "@/components/sections/Header";

// Static params for SSG
export function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

// Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return { title: "Post nao encontrado" };
    return {
        title: `${post.title} — Plenum Blog`,
        description: post.subtitle,
    };
}

function ContentRenderer({ block }: { block: ContentBlock }) {
    switch (block.type) {
        case "paragraph":
            return (
                <p className="text-[17px] leading-[1.75] text-[#333] mb-6">
                    {block.text}
                </p>
            );

        case "heading":
            return (
                <h2 className="text-[26px] md:text-[30px] font-bold text-[#111] mt-10 mb-4 leading-[1.2]">
                    {block.text}
                </h2>
            );

        case "axiom":
            return (
                <div className="mb-6">
                    <p className="text-[17px] leading-[1.75] text-[#333]">
                        <span className="font-extrabold text-[#111]">{block.label}:</span>{" "}
                        {block.text}
                    </p>
                </div>
            );

        case "bullets":
            return (
                <div className="mb-6">
                    <p className="text-[15px] font-bold text-[#111] uppercase tracking-wide mb-3">
                        {block.label}
                    </p>
                    <ul className="space-y-2.5 pl-0">
                        {block.items.map((item, i) => (
                            <li key={i} className="flex gap-3 text-[16px] leading-[1.65] text-[#333]">
                                <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            );

        case "quote":
            return (
                <blockquote className="my-8 pl-6 border-l-[3px] border-[#C9A227]">
                    <p className="text-[19px] leading-[1.6] text-[#222] italic">
                        &ldquo;{block.text}&rdquo;
                    </p>
                    {block.author && (
                        <cite className="block mt-3 text-[14px] text-[#666] not-italic font-medium">
                            — {block.author}
                        </cite>
                    )}
                </blockquote>
            );

        case "image":
            return (
                <figure className="my-8">
                    <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                        <Image src={block.src} alt={block.caption} fill className="object-cover" />
                    </div>
                    <figcaption className="mt-2 text-[13px] text-[#999]">{block.caption}</figcaption>
                </figure>
            );

        case "divider":
            return <hr className="my-8 border-t border-[#e5e5e5]" />;

        default:
            return null;
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) notFound();

    const related = getRelatedPosts(post.relatedSlugs);

    return (
        <main className="bg-white text-[#111] min-h-screen">
            <Header />

            {/* ─── Article ─── */}
            <article className="max-w-[680px] mx-auto px-6 pt-28 pb-20">
                {/* Category badge */}
                <div className="mb-5">
                    <span
                        className="inline-block text-[11px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-sm"
                        style={{ backgroundColor: post.categoryColor + "18", color: post.categoryColor }}
                    >
                        {post.category}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-[32px] md:text-[42px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#111] mb-4">
                    {post.title}
                </h1>

                {/* Subtitle */}
                <p className="text-[19px] md:text-[21px] leading-[1.45] text-[#555] mb-8">
                    {post.subtitle}
                </p>

                {/* Author + Meta */}
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[#eee]">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden">
                        <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                    </div>
                    <div>
                        <p className="text-[14px] font-semibold text-[#111]">{post.author.name}</p>
                        <p className="text-[13px] text-[#888]">
                            {post.author.role} &middot; {post.date} &middot; {post.readTime} de leitura
                        </p>
                    </div>

                    {/* Share buttons */}
                    <div className="ml-auto flex items-center gap-2">
                        <button className="w-9 h-9 rounded-full border border-[#ddd] flex items-center justify-center text-[#666] hover:text-[#111] hover:border-[#999] transition-all" aria-label="Compartilhar">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
                            </svg>
                        </button>
                        <button className="w-9 h-9 rounded-full border border-[#ddd] flex items-center justify-center text-[#666] hover:text-[#111] hover:border-[#999] transition-all" aria-label="Salvar">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Hero image */}
                <figure className="mb-10">
                    <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                        <Image src={post.heroImage} alt={post.title} fill className="object-cover" priority />
                    </div>
                    <figcaption className="mt-2.5 text-[12px] text-[#999] leading-relaxed">
                        {post.heroCaption}
                    </figcaption>
                </figure>

                {/* Content blocks */}
                <div className="article-content">
                    {post.content.map((block, i) => (
                        <ContentRenderer key={i} block={block} />
                    ))}
                </div>

                {/* Tags / Bottom */}
                <div className="mt-12 pt-8 border-t border-[#eee]">
                    <div className="flex flex-wrap gap-2 mb-8">
                        {["Gestao Publica", "Inovacao", post.category].map((tag) => (
                            <span key={tag} className="px-3 py-1.5 rounded-full border border-[#ddd] text-[12px] font-medium text-[#666]">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Newsletter CTA */}
                    <div className="bg-[#F7F7F7] rounded-xl p-8 mb-12">
                        <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#888] mb-2">
                            Newsletter Plenum
                        </p>
                        <h3 className="text-[22px] font-bold text-[#111] mb-2">
                            Receba as principais noticias do setor publico
                        </h3>
                        <p className="text-[15px] text-[#666] mb-5">
                            Uma vez por semana, direto no seu e-mail. Sem spam.
                        </p>
                        <div className="flex gap-3">
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
                </div>
            </article>

            {/* ─── Related articles ─── */}
            {related.length > 0 && (
                <section className="border-t border-[#eee] bg-[#FAFAFA]">
                    <div className="max-w-[1100px] mx-auto px-6 py-16">
                        <h2 className="text-[13px] font-bold tracking-[0.15em] uppercase text-[#888] mb-8">
                            Mais do Plenum Blog
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {related.map((rp) => (
                                <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group block">
                                    <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-4">
                                        <Image
                                            src={rp.heroImage}
                                            alt={rp.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <span
                                        className="inline-block text-[10px] font-bold tracking-[0.15em] uppercase mb-2"
                                        style={{ color: rp.categoryColor }}
                                    >
                                        {rp.category}
                                    </span>
                                    <h3 className="text-[20px] font-bold leading-[1.25] text-[#111] group-hover:text-[#555] transition-colors mb-2">
                                        {rp.title}
                                    </h3>
                                    <p className="text-[14px] text-[#888]">
                                        {rp.author.name} &middot; {rp.readTime}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}

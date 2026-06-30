import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS, getPostBySlug, getRelatedPosts } from "@/lib/blog-data";
import type { ContentBlock } from "@/lib/blog-data";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";

export function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return { title: "Post nao encontrado" };
    return { title: `${post.title} | Plenum Insights`, description: post.subtitle };
}

function ContentRenderer({ block }: { block: ContentBlock }) {
    switch (block.type) {
        case "paragraph":
            return <p className="text-[17px] leading-[1.75] text-[#333] mb-6">{block.text}</p>;
        case "heading":
            return <h2 className="text-[26px] md:text-[30px] font-display font-semibold text-[#111] mt-10 mb-4 leading-[1.2]">{block.text}</h2>;
        case "axiom":
            return <p className="text-[17px] leading-[1.75] text-[#333] mb-6"><span className="font-bold text-[#111]">{block.label}:</span> {block.text}</p>;
        case "bullets":
            return (
                <div className="mb-6">
                    <p className="text-[15px] font-bold text-[#111] uppercase tracking-wide mb-3">{block.label}</p>
                    <ul className="space-y-2.5 pl-0">
                        {block.items.map((item) => (
                            <li key={item} className="flex gap-3 text-[16px] leading-[1.65] text-[#333]"><span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-[#C9A227]" />{item}</li>
                        ))}
                    </ul>
                </div>
            );
        case "quote":
            return <blockquote className="my-8 pl-6 border-l-[3px] border-[#C9A227]"><p className="text-[19px] leading-[1.6] text-[#222] italic">&ldquo;{block.text}&rdquo;</p>{block.author && <cite className="block mt-3 text-[14px] text-[#666] not-italic font-medium">{block.author}</cite>}</blockquote>;
        case "image":
            return <figure className="my-8"><div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden"><Image src={block.src} alt={block.caption} fill className="object-cover" /></div><figcaption className="mt-2 text-[13px] text-[#999]">{block.caption}</figcaption></figure>;
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
            <article className="max-w-[720px] mx-auto px-6 pt-32 pb-20">
                <div className="mb-5">
                    <span className="inline-block text-[11px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full" style={{ backgroundColor: post.categoryColor + "18", color: post.categoryColor }}>{post.category}</span>
                </div>
                <h1 className="text-[32px] md:text-[46px] font-display font-semibold leading-[1.08] tracking-[-0.02em] text-[#111] mb-4">{post.title}</h1>
                <p className="text-[19px] md:text-[21px] leading-[1.45] text-[#555] mb-8">{post.subtitle}</p>
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[#eee]">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden"><Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" /></div>
                    <div>
                        <p className="text-[14px] font-semibold text-[#111]">{post.author.name}</p>
                        <p className="text-[13px] text-[#888]">{post.author.role} · {post.date} · {post.readTime} de leitura</p>
                    </div>
                </div>
                <figure className="mb-10">
                    <div className="relative w-full aspect-[16/9] rounded-[18px] overflow-hidden"><Image src={post.heroImage} alt={post.title} fill className="object-cover" priority /></div>
                    <figcaption className="mt-2.5 text-[12px] text-[#999] leading-relaxed">{post.heroCaption}</figcaption>
                </figure>
                <div className="article-content">{post.content.map((block, i) => <ContentRenderer key={i} block={block} />)}</div>
            </article>

            {related.length > 0 && (
                <section className="border-t border-[#eee] bg-[#FAFAFA]">
                    <div className="max-w-[1100px] mx-auto px-6 py-16">
                        <h2 className="text-[13px] font-bold tracking-[0.15em] uppercase text-[#888] mb-8">Mais do Plenum Insights</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {related.map((rp) => (
                                <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group block">
                                    <div className="relative w-full aspect-[16/9] rounded-[18px] overflow-hidden mb-4"><Image src={rp.heroImage} alt={rp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                                    <span className="inline-block text-[10px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: rp.categoryColor }}>{rp.category}</span>
                                    <h3 className="text-[20px] font-display font-semibold leading-[1.25] text-[#111] group-hover:text-[#8a6e1a] transition-colors mb-2">{rp.title}</h3>
                                    <p className="text-[14px] text-[#888]">{rp.author.name} · {rp.readTime}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
            <Footer />
        </main>
    );
}
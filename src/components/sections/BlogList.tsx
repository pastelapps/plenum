"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost, BlogTopic } from "@/lib/blog-data";

type TabKey = "todos" | BlogTopic;

const TABS: { key: TabKey; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "geral", label: "Geral" },
  { key: "tecnologia", label: "Tecnologia" },
];

function TopicTag({ topic }: { topic: BlogTopic }) {
  if (topic === "tecnologia") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#8a6e1a]">
        Tecnologia
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#030D1F]/12 bg-[#030D1F]/[0.04] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#555]">
      Geral
    </span>
  );
}

export default function BlogList({
  posts,
  initialTopic = "todos",
}: {
  posts: BlogPost[];
  initialTopic?: TabKey;
}) {
  const [tab, setTab] = useState<TabKey>(initialTopic);
  const filtered = tab === "todos" ? posts : posts.filter((p) => p.topic === tab);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16">
      {/* Tabs */}
      <div className="mb-10 flex flex-wrap items-center gap-2">
        {TABS.map((t) => {
          const count = t.key === "todos" ? posts.length : posts.filter((p) => p.topic === t.key).length;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`filter-chip ${tab === t.key ? "active" : ""}`}
            >
              {t.label}
              <span className="ml-1.5 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="card-light group mb-8 grid grid-cols-1 items-center gap-8 p-5 md:grid-cols-2 md:p-7"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px]">
            <Image src={featured.heroImage} alt={featured.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" priority />
          </div>
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: featured.categoryColor }}>{featured.category}</span>
              <TopicTag topic={featured.topic} />
            </div>
            <h2 className="mb-4 font-display text-[28px] font-semibold leading-[1.1] text-[#030D1F] transition-colors group-hover:text-[#8a6e1a] md:text-[34px]">{featured.title}</h2>
            <p className="mb-5 text-[16px] leading-[1.55] text-[#666]">{featured.subtitle}</p>
            <p className="text-[13px] text-[#888]">{featured.author.name} · {featured.date} · {featured.readTime}</p>
          </div>
        </Link>
      )}

      {rest.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card-light group block overflow-hidden">
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image src={post.heroImage} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: post.categoryColor }}>{post.category}</span>
                  <TopicTag topic={post.topic} />
                </div>
                <h3 className="mb-2 font-display text-[20px] font-semibold leading-[1.2] text-[#030D1F] transition-colors group-hover:text-[#8a6e1a]">{post.title}</h3>
                <p className="mb-3 line-clamp-2 text-[14px] text-[#666]">{post.subtitle}</p>
                <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-[#030D1F]">
                  Ler mais <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="py-16 text-center text-[#888]">Nenhum artigo nesta categoria ainda.</p>
      )}
    </div>
  );
}

export type BlogTopic = "geral" | "tecnologia";

export interface BlogPost {
    slug: string;
    title: string;
    subtitle: string;
    category: string;
    categoryColor: string;
    topic: BlogTopic;
    author: {
        name: string;
        role: string;
        avatar: string;
    };
    date: string;
    readTime: string;
    heroImage: string;
    heroCaption: string;
    content: ContentBlock[];
    relatedSlugs: string[];
}

export type ContentBlock =
    | { type: "paragraph"; text: string }
    | { type: "heading"; text: string }
    | { type: "axiom"; label: string; text: string }
    | { type: "bullets"; label: string; items: string[] }
    | { type: "quote"; text: string; author?: string }
    | { type: "image"; src: string; caption: string }
    | { type: "divider" };

export const BLOG_POSTS: BlogPost[] = [
    {
        slug: "o-que-muda-nas-contratacoes-em-2026",
        title: "O que muda nas contratações em 2026",
        subtitle: "Legislação, planejamento e pontos de atenção para equipes públicas.",
        category: "LEGISLAÇÃO",
        categoryColor: "#3B82F6",
        topic: "geral",
        author: {
            name: "Equipe Plenum",
            role: "Legislação",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
        },
        date: "10 Mar 2026",
        readTime: "4 min",
        heroImage: "https://images.unsplash.com/photo-1677442135136-760c813028c0?auto=format&fit=crop&q=80&w=1400",
        heroCaption: "Contratações públicas exigem planejamento e segurança técnica.",
        content: [
            { type: "axiom", label: "Por que importa", text: "As contratações públicas em 2026 exigem equipes preparadas para planejar melhor e reduzir riscos." },
            { type: "paragraph", text: "A Plenum Insights reúne análises diretas para quem atua em compras, contratos, controle interno e assessoria jurídica." },
        ],
        relatedSlugs: ["agentes-de-ia-na-rotina-do-servidor", "gestao-publica-orientada-a-resultado"],
    },
    {
        slug: "agentes-de-ia-na-rotina-do-servidor",
        title: "Agentes de IA na rotina do servidor",
        subtitle: "Como a IA pode apoiar tarefas repetitivas, pesquisa e tomada de decisão.",
        category: "IA E INOVAÇÃO",
        categoryColor: "#8B5CF6",
        topic: "tecnologia",
        author: {
            name: "Equipe Plenum GovTech",
            role: "IA e inovação",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
        },
        date: "5 Mar 2026",
        readTime: "5 min",
        heroImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1400",
        heroCaption: "IA, dados e automação aplicados a rotinas públicas.",
        content: [
            { type: "axiom", label: "Por que importa", text: "Agentes de IA só geram valor no setor público quando estão conectados a problemas concretos, governança e responsabilidade." },
            { type: "paragraph", text: "Antes de escolher ferramentas, gestores precisam organizar problemas, dados, fluxos de trabalho e limites de uso." },
        ],
        relatedSlugs: ["o-que-muda-nas-contratacoes-em-2026", "gestao-publica-orientada-a-resultado"],
    },
    {
        slug: "gestao-publica-orientada-a-resultado",
        title: "Gestão pública orientada a resultado",
        subtitle: "O gestor público do futuro combina visão institucional, repertório técnico e evidências.",
        category: "LIDERANÇA",
        categoryColor: "#F59E0B",
        topic: "geral",
        author: {
            name: "Instituto Plenum Brasil",
            role: "Liderança e inovação",
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100",
        },
        date: "28 Fev 2026",
        readTime: "3 min",
        heroImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1400",
        heroCaption: "Lideranças públicas precisam traduzir complexidade em execução.",
        content: [
            { type: "paragraph", text: "Liderar no setor público exige organizar times, interpretar dados, comunicar prioridades e sustentar integridade." },
            { type: "heading", text: "Competências centrais" },
            { type: "bullets", label: "O que desenvolver", items: ["letramento digital", "gestão baseada em evidências", "comunicação estratégica", "governança colaborativa", "integridade institucional"] },
        ],
        relatedSlugs: ["agentes-de-ia-na-rotina-do-servidor", "o-que-muda-nas-contratacoes-em-2026"],
    },
    {
        slug: "ia-transformando-a-gestao-publica-brasileira",
        title: "Como a IA está transformando a gestão pública brasileira",
        subtitle: "De assistentes de pesquisa a análise de editais: onde a inteligência artificial já entrega valor.",
        category: "IA E INOVAÇÃO",
        categoryColor: "#8B5CF6",
        topic: "tecnologia",
        author: {
            name: "Equipe Plenum GovTech",
            role: "IA e inovação",
            avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100",
        },
        date: "18 Mar 2026",
        readTime: "6 min",
        heroImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1400",
        heroCaption: "A IA aplicada ao Estado começa pelos processos mais repetitivos.",
        content: [
            { type: "axiom", label: "Por que importa", text: "A adoção de IA no setor público brasileiro avança mais rápido onde há dados organizados e problemas bem definidos." },
            { type: "paragraph", text: "Os primeiros ganhos aparecem em pesquisa de preços, triagem documental, redação de minutas e atendimento ao cidadão." },
            { type: "heading", text: "Por onde começar" },
            { type: "bullets", label: "Prioridades", items: ["mapear processos repetitivos", "organizar bases de dados", "definir governança e limites de uso", "capacitar as equipes", "medir resultado e segurança"] },
        ],
        relatedSlugs: ["agentes-de-ia-na-rotina-do-servidor", "cidades-inteligentes-por-onde-comecar"],
    },
    {
        slug: "cidades-inteligentes-por-onde-comecar",
        title: "Cidades inteligentes: por onde o município começa",
        subtitle: "Dados abertos, indicadores e serviços digitais como base da inovação municipal.",
        category: "CIDADES INTELIGENTES",
        categoryColor: "#0891B2",
        topic: "tecnologia",
        author: {
            name: "Equipe Plenum GovTech",
            role: "Cidades inteligentes",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
        },
        date: "12 Mar 2026",
        readTime: "5 min",
        heroImage: "https://images.unsplash.com/photo-1573108724029-4c46571d6490?auto=format&fit=crop&q=80&w=1400",
        heroCaption: "Cidade inteligente começa com dados e serviços, não com tecnologia cara.",
        content: [
            { type: "axiom", label: "Por que importa", text: "Municípios não precisam de grandes orçamentos para começar: precisam de dados organizados e foco no cidadão." },
            { type: "paragraph", text: "O primeiro passo costuma ser publicar dados abertos e digitalizar os serviços mais procurados pela população." },
            { type: "bullets", label: "Primeiros passos", items: ["dados abertos", "serviços digitais essenciais", "indicadores de gestão", "atendimento ao cidadão com IA"] },
        ],
        relatedSlugs: ["ia-transformando-a-gestao-publica-brasileira", "agentes-de-ia-na-rotina-do-servidor"],
    },
    {
        slug: "planejamento-das-contratacoes-do-pca-ao-edital",
        title: "Planejamento das contratações: do PCA ao edital",
        subtitle: "Como estruturar o plano de contratações anual e chegar a editais mais seguros.",
        category: "LICITAÇÕES",
        categoryColor: "#3B82F6",
        topic: "geral",
        author: {
            name: "Equipe Plenum",
            role: "Licitações e contratos",
            avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=100",
        },
        date: "2 Mar 2026",
        readTime: "5 min",
        heroImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1400",
        heroCaption: "Um bom edital começa no planejamento, não na publicação.",
        content: [
            { type: "axiom", label: "Por que importa", text: "A maior parte dos problemas em licitações nasce na fase de planejamento, não na execução." },
            { type: "paragraph", text: "Do Plano de Contratações Anual ao Estudo Técnico Preliminar, cada etapa reduz risco e aumenta a segurança jurídica do processo." },
        ],
        relatedSlugs: ["o-que-muda-nas-contratacoes-em-2026", "gestao-publica-orientada-a-resultado"],
    },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
    return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(slugs: string[]): BlogPost[] {
    return BLOG_POSTS.filter((p) => slugs.includes(p.slug));
}

export function getPostsByTopic(topic: BlogTopic): BlogPost[] {
    return BLOG_POSTS.filter((p) => p.topic === topic);
}

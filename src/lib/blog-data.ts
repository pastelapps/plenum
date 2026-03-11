export interface BlogPost {
    slug: string;
    title: string;
    subtitle: string;
    category: string;
    categoryColor: string;
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
        slug: "como-ia-esta-transformando-gestao-publica",
        title: "Como a IA esta transformando a gestao publica no Brasil",
        subtitle: "Municipios e estados brasileiros comecam a adotar inteligencia artificial para otimizar servicos, reduzir custos e melhorar a experiencia do cidadao.",
        category: "TECNOLOGIA",
        categoryColor: "#3B82F6",
        author: {
            name: "Marina Alves",
            role: "Editora de Tecnologia",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
        },
        date: "10 Mar 2026",
        readTime: "4 min",
        heroImage: "https://images.unsplash.com/photo-1677442135136-760c813028c0?auto=format&fit=crop&q=80&w=1400",
        heroCaption: "Foto: Centro de operacoes integradas com IA em Brasilia. Unsplash",
        content: [
            {
                type: "axiom",
                label: "Por que importa",
                text: "O setor publico brasileiro gasta mais de R$ 200 bilhoes por ano em contratacoes. Ferramentas de IA podem reduzir esse custo em ate 15%, segundo estimativas do TCU.",
            },
            {
                type: "paragraph",
                text: "Pelo menos 12 estados ja utilizam alguma forma de inteligencia artificial em processos administrativos, desde triagem de documentos ate analise preditiva de demandas de saude publica.",
            },
            {
                type: "heading",
                text: "O que esta acontecendo",
            },
            {
                type: "bullets",
                label: "Os cases mais relevantes",
                items: [
                    "Sao Paulo implementou IA para prever demanda de leitos hospitalares, reduzindo filas em 23%.",
                    "Minas Gerais usa machine learning para detectar fraudes em licitacoes, com taxa de acerto de 89%.",
                    "O governo federal lancou o programa IA.Gov com investimento de R$ 500 milhoes ate 2028.",
                    "Curitiba automatizou 40% dos atendimentos ao cidadao com chatbots inteligentes.",
                ],
            },
            { type: "divider" },
            {
                type: "axiom",
                label: "O outro lado",
                text: "Especialistas alertam que a adocao sem governanca adequada pode ampliar desigualdades e vieses algoritmicos, especialmente em areas como seguranca publica e distribuicao de beneficios sociais.",
            },
            {
                type: "quote",
                text: "Nao podemos simplesmente copiar modelos do setor privado. A IA no governo precisa ser transparente, auditavel e centrada no cidadao.",
                author: "Prof. Ricardo Mendes, FGV",
            },
            { type: "divider" },
            {
                type: "axiom",
                label: "O que vem pela frente",
                text: "O Congresso Nacional deve votar ate junho o Marco Regulatorio da IA no Setor Publico, que estabelece regras para uso, transparencia e responsabilizacao.",
            },
            {
                type: "paragraph",
                text: "A Plenum Academy ja oferece trilhas especificas sobre IA aplicada a gestao publica, com turmas em Brasilia, Sao Paulo e formato online.",
            },
        ],
        relatedSlugs: ["nova-lei-licitacoes-o-que-mudou", "5-competencias-lideres-publicos-2026"],
    },
    {
        slug: "nova-lei-licitacoes-o-que-mudou",
        title: "Nova Lei de Licitacoes: o que mudou na pratica",
        subtitle: "Apos dois anos de transicao, a Lei 14.133 ja e realidade. Veja o que funciona, o que travou e o que os gestores precisam saber.",
        category: "LEGISLACAO",
        categoryColor: "#8B5CF6",
        author: {
            name: "Carlos Drummond",
            role: "Editor de Legislacao",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
        },
        date: "5 Mar 2026",
        readTime: "5 min",
        heroImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1400",
        heroCaption: "Foto: Plenario da Camara dos Deputados. Unsplash",
        content: [
            {
                type: "axiom",
                label: "Por que importa",
                text: "A Nova Lei de Licitacoes (14.133/2021) substituiu tres legislacoes e mudou fundamentalmente como o governo compra. Mais de 5.000 municipios ainda estao em fase de adaptacao.",
            },
            {
                type: "heading",
                text: "As maiores mudancas",
            },
            {
                type: "bullets",
                label: "O que ja esta valendo",
                items: [
                    "Dialogo competitivo como nova modalidade para projetos complexos.",
                    "Portal Nacional de Contratacoes Publicas (PNCP) agora e obrigatorio.",
                    "Seguro-garantia pode cobrir ate 30% do valor do contrato.",
                    "Programa de integridade (compliance) pode ser exigido em grandes contratos.",
                ],
            },
            { type: "divider" },
            {
                type: "axiom",
                label: "Sim, mas",
                text: "A falta de regulamentacao em muitos municipios e a carencia de capacitacao dos servidores sao os maiores gargalos. Pesquisa da CNM mostra que 62% das prefeituras nao se sentem preparadas.",
            },
            {
                type: "quote",
                text: "A lei e moderna, mas sem investimento em pessoas, ela nao sai do papel.",
                author: "Dra. Ana Lucia Ferreira, especialista em Direito Administrativo",
            },
            {
                type: "paragraph",
                text: "O Seminario Plenum de Licitacoes Sustentaveis, em junho, vai abordar cases praticos de municipios que ja operam 100% na nova lei.",
            },
        ],
        relatedSlugs: ["como-ia-esta-transformando-gestao-publica", "5-competencias-lideres-publicos-2026"],
    },
    {
        slug: "5-competencias-lideres-publicos-2026",
        title: "5 competencias essenciais para lideres publicos em 2026",
        subtitle: "O perfil do gestor publico mudou. Conhca as habilidades que separam lideres eficazes de administradores burocraticos.",
        category: "LIDERANCA",
        categoryColor: "#F59E0B",
        author: {
            name: "Patricia Sousa",
            role: "Editora de Lideranca",
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100",
        },
        date: "28 Fev 2026",
        readTime: "3 min",
        heroImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1400",
        heroCaption: "Foto: Workshop de lideranca executiva. Unsplash",
        content: [
            {
                type: "axiom",
                label: "O cenario",
                text: "Pesquisa da ENAP com 3.000 servidores mostra que 78% acreditam que as competencias exigidas para lideranca publica mudaram drasticamente nos ultimos 3 anos.",
            },
            {
                type: "heading",
                text: "As 5 competencias",
            },
            {
                type: "bullets",
                label: "O que o mercado exige",
                items: [
                    "Letramento digital e IA — entender tecnologia nao e opcional.",
                    "Gestao baseada em dados — decidir com evidencia, nao intuicao.",
                    "Comunicacao estrategica — saber traduzir complexidade para acao.",
                    "Lideranca adaptativa — navegar ambiguidade e mudancas constantes.",
                    "Governanca colaborativa — articular redes dentro e fora do governo.",
                ],
            },
            { type: "divider" },
            {
                type: "quote",
                text: "O lider publico de 2026 precisa ser parte estrategista, parte facilitador e parte tecnologista. Nao da mais pra ser so um bom burocrata.",
                author: "Prof. Eduardo Martins, Plenum Academy",
            },
            {
                type: "axiom",
                label: "O que fazer",
                text: "A Plenum Academy oferece trilhas de desenvolvimento especificas para cada uma dessas competencias, com certificacao reconhecida e mentoria individual.",
            },
        ],
        relatedSlugs: ["como-ia-esta-transformando-gestao-publica", "nova-lei-licitacoes-o-que-mudou"],
    },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
    return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(slugs: string[]): BlogPost[] {
    return BLOG_POSTS.filter((p) => slugs.includes(p.slug));
}

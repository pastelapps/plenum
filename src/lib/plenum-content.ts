export const CONTACT = {
  whatsapp: "(31) 2531-1776",
  whatsappHref:
    "https://wa.me/553125311776?text=Ol%C3%A1%2C%20quero%20falar%20com%20a%20Plenum.",
  email: "contato@plenumbrasil.com.br",
  instagram: "@plenumbrasil",
  instagramHref: "https://www.instagram.com/plenumbrasil",
};

export const OFFICES = [
  {
    city: "Belo Horizonte",
    state: "MG",
    label: "Sede Belo Horizonte",
    address: "Rua Espírito Santo, 1204, 2º andar, Lourdes, BH/MG",
    shortAddress: "Rua Espírito Santo, 1204, Lourdes",
    image: "/sede-belo-horizonte.png",
    mapsUrl:
      "https://maps.google.com/?q=Rua+Espirito+Santo+1204+Lourdes+Belo+Horizonte+MG",
  },
  {
    city: "Brasília",
    state: "DF",
    label: "Sede Brasília",
    address:
      "SCS Quadra 01, Bloco H, Edifício Morro Vermelho, 8º andar, Asa Sul, Brasília/DF",
    shortAddress: "SCS Quadra 01, Bloco H, Asa Sul",
    image: "/sede-brasilia.jpg",
    mapsUrl:
      "https://maps.google.com/?q=Edificio+Morro+Vermelho+SCS+Quadra+01+Bloco+H+Brasilia+DF",
  },
];

export const IMPACT_STATS = [
  { value: "+30.000", label: "matrículas em capacitações" },
  { value: "+1.600", label: "instituições clientes" },
  {
    value: "26 estados + DF",
    label: "órgãos públicos de todo o país já passaram pela Plenum",
  },
];

export const AUDIENCES = [
  "Administração Pública",
  "Órgãos de Controle",
  "Municípios",
  "Estatais",
  "Legislativo",
  "Judiciário",
  "Conselhos",
  "Todas as esferas",
];

export const COURSE_AREAS = [
  "Licitações e Contratos",
  "IA e Tecnologia",
  "Liderança",
  "Finanças Públicas",
  "Legislativo",
];

export const COURSES = [
  {
    id: 1,
    title: "Nova Lei de Licitações PRO",
    area: "Licitações e Contratos",
    modality: "Presencial",
    city: "Brasília",
    location: "Brasília | DF",
    date: "20 a 22 de maio",
    month: "Maio 2026",
    workload: "24h",
    professor: "Carlos Tiago J. de Azevedo",
    description: "Da fase preparatória ao julgamento, na prática.",
    audiences: ["Administração Pública", "Municípios"],
    image:
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2070&auto=format&fit=crop",
    url: "#",
  },
  {
    id: 2,
    title: "Compras Diretas 2026",
    area: "Licitações e Contratos",
    modality: "Presencial",
    city: "Belo Horizonte",
    location: "Belo Horizonte | MG",
    date: "26 e 27 de maio",
    month: "Maio 2026",
    workload: "16h",
    professor: "Carlos Tiago J. de Azevedo",
    description: "Dispensa, inexigibilidade e a correta instrução dos processos.",
    audiences: ["Todas as esferas"],
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop",
    url: "#",
  },
  {
    id: 3,
    title: "IA Aplicada ao Setor Público",
    area: "IA e Tecnologia",
    modality: "Presencial",
    city: "Brasília",
    location: "Brasília | DF",
    date: "10 a 12 de junho",
    month: "Junho 2026",
    workload: "20h",
    professor: "Raphael Rodrigues",
    description: "Ferramentas, agentes e casos reais de uso.",
    audiences: ["Todas as esferas"],
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
    url: "#",
  },
  {
    id: 4,
    title: "Liderança em Organizações Públicas",
    area: "Liderança",
    modality: "Presencial",
    city: "Belo Horizonte",
    location: "Belo Horizonte | MG",
    date: "17 e 18 de junho",
    month: "Junho 2026",
    workload: "16h",
    professor: "Tiago Melgaço",
    description: "Gestão de pessoas e resultado no setor público.",
    audiences: ["Municípios", "Legislativo"],
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    url: "#",
  },
  {
    id: 5,
    title: "Modernização da LOM e Regimento Interno",
    area: "Legislativo",
    modality: "Presencial",
    city: "Belo Horizonte",
    location: "Belo Horizonte | MG",
    date: "30/06 a 03/07",
    month: "Junho 2026",
    workload: "32h",
    professor: "Tiago Melgaço e João Lembi",
    description: "Diagnósticos, adequações e atualizações para 2026.",
    audiences: ["Municípios", "Legislativo"],
    image:
      "https://images.unsplash.com/photo-1577985043696-8bd54d9f093f?q=80&w=2070&auto=format&fit=crop",
    url: "#",
  },
  {
    id: 6,
    title: "Execução Orçamentária e Financeira",
    area: "Finanças Públicas",
    modality: "Híbrido",
    city: "Brasília",
    location: "Brasília | DF",
    date: "Julho",
    month: "Julho 2026",
    workload: "20h",
    professor: "Equipe Plenum",
    description: "Do empenho à prestação de contas, sem erros.",
    audiences: ["Administração Pública"],
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop",
    url: "#",
  },
  {
    id: 7,
    title: "IA na Fase Preparatória das Licitações",
    area: "Licitações e Contratos",
    modality: "Presencial",
    city: "Belo Horizonte",
    location: "Belo Horizonte | MG",
    date: "11 e 12 de junho",
    month: "Junho 2026",
    workload: "16h",
    professor: "Carlos Tiago J. de Azevedo",
    description: "Elaboração de DFD, ETP, TR, Mapa de Riscos e Editais.",
    audiences: ["Órgãos de Controle"],
    image: "/fotocursoteste.jpg",
    url: "https://modelolpcursoplenum.vercel.app/",
  },
];

export const ECOSYSTEM = [
  {
    title: "Plenum Academy",
    description:
      "Formações executivas presenciais, híbridas e online para servidores e lideranças públicas.",
    href: "/cursos",
  },
  {
    title: "EducaPública",
    description:
      "Plataforma edtech para educação continuada, trilhas, aulas e acompanhamento de evolução.",
    href: "#educapublica",
  },
  {
    title: "Plenum GovTech",
    description:
      "Startup interna de pesquisa, tecnologia e IA aplicada a desafios reais do setor público.",
    href: "/govtech",
  },
  {
    title: "Plenum Consultoria",
    description:
      "Projetos sob medida para diagnóstico, capacitação e apoio técnico a instituições.",
    href: CONTACT.whatsappHref,
  },
];

export const VALUES = [
  "Conhecimento que vira prática",
  "Integridade como método",
  "Inovação com responsabilidade",
  "Foco em quem serve o público",
  "Excelência na experiência presencial",
];

export const LEADERSHIP = [
  {
    name: "Dr. André Azevedo",
    role: "Presidente do Instituto Plenum Brasil",
    bio: "Conduz a estratégia institucional da Plenum e a visão de formar lideranças públicas preparadas para o futuro.",
  },
  {
    name: "Diretoria Jurídica",
    role: "Segurança técnica e institucional",
    bio: "Apoia a construção de conteúdos, programas e projetos com responsabilidade jurídica.",
  },
  {
    name: "Comitê de Integridade",
    role: "Compliance, ética e governança",
    bio: "Fortalece políticas internas, canais de reporte e cultura de integridade.",
  },
  {
    name: "Coordenação Acadêmica",
    role: "Curadoria de professores e trilhas",
    bio: "Organiza jornadas de aprendizagem por área, público-alvo e nível de maturidade.",
  },
];

export const COMPLIANCE_DOCS = [
  "Código de Ética",
  "Política de Consequências",
  "Canal de Denúncias",
  "Comitê de Integridade",
];

export const LGPD_RIGHTS = [
  "confirmar se tratamos seus dados pessoais",
  "solicitar acesso, correção ou atualização",
  "pedir exclusão quando aplicável",
  "solicitar informações sobre compartilhamento",
  "revogar consentimentos concedidos",
];

export const WORK_PATHS = [
  "Palestrante ou professor convidado",
  "Comercial e relacionamento institucional",
  "Administrativo e operações",
  "Conteúdo, pesquisa e tecnologia",
];

export const GOVTECH_PILLARS = [
  {
    title: "LicitaPública",
    description:
      "Inteligência artificial para contratações públicas, da pesquisa de preços ao parecer, com segurança técnica.",
  },
  {
    title: "Guias práticos",
    description:
      "Materiais objetivos para apoiar gestores em IA, licitações, cidades inteligentes e inovação.",
  },
  {
    title: "Blog de IA no setor público",
    description:
      "Curadoria de textos sobre tecnologia, dados e transformação digital aplicada ao governo.",
  },
  {
    title: "Cidades inteligentes",
    description:
      "Pesquisa e conteúdo para municípios que querem modernizar serviços e tomada de decisão.",
  },
];

export const GUIDES = [
  "IA aplicada ao setor público",
  "Contratações públicas com mais segurança",
  "Primeiros passos para cidades inteligentes",
];

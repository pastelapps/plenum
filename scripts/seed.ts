/**
 * Seed Script — Populates Supabase with the first course data
 *
 * Extracts all hardcoded data from the original static components
 * and inserts them into the database tables:
 *   1. company_settings
 *   2. design_systems
 *   3. instructors
 *   4. courses
 *   5. course_dates (3 turmas)
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ─────────────────────────────────────────────────
// 1. COMPANY SETTINGS
// ─────────────────────────────────────────────────
const companySettings = {
  company_name: 'Instituto Plenum Brasil',
  address: 'Rua Espírito Santo, nº 1204, 2º andar – sala 1\nBairro Lourdes – BH/MG – CEP: 30.160-033',
  phones: [
    { label: 'Comercial', number: '31 2531-1776' },
    { label: 'Comercial', number: '31 2531-1750' },
    { label: 'WhatsApp', number: '31 2531-1776' },
    { label: 'Atendimento', number: '31 4003-4961' },
  ],
  emails: [
    { label: 'Geral', email: 'plenumgestaooficial@gmail.com' },
    { label: 'Financeiro', email: 'financeiro@plenumbrasil.com' },
  ],
  website: 'https://www.plenumbrasil.com.br',
  cancellation_policy:
    'O não comparecimento ao curso no qual você tem inscrição confirmada irá gerar a cobrança de 50% do valor para custeio do material utilizado, exceto se houver o cancelamento até 72 horas antes do início.',
  payment_info: {
    methods: 'Boleto bancário, transferência, cheque ou dinheiro. Depósito, TED ou ordem bancária.',
    note: 'Solicite informações no financeiro: WhatsApp ou PIX (Consulte)',
    contract_info: 'Solicite os documentos e demais informações para contratação.',
  },
  logo_url: '/logo-plenum-aberta2.png',
  logo_dark_url: '/logo.svg',
};

// ─────────────────────────────────────────────────
// 2. DESIGN SYSTEM (Blue theme — original)
// ─────────────────────────────────────────────────
const designSystem = {
  name: 'Azul Institucional',
  description: 'Design system padrão azul do Instituto Plenum Brasil',
  is_default: true,

  // Colors: Primary
  color_primary: '#3b82f6',
  color_primary_hover: '#60a5fa',
  color_primary_light: '#5b9cf6',

  // Colors: Backgrounds
  color_background: '#030d1f',
  color_background_alt: '#020617',
  color_background_deep: '#010814',
  color_surface: '#0b1a30',
  color_surface_alt: '#0a1628',

  // Colors: Accent / Others
  color_accent: '#e1ff69',
  color_whatsapp: '#25D366',

  // Colors: Hero Gradient
  color_hero_gradient_mid: '#062060',

  // Colors: Shaders WebGL
  shader_colors: {
    colorbends: ['#007bff', '#4097bf'],
    grainient: ['#030d1f', '#378bae', '#030d1f'],
    glowing_effect: ['#5b9cf6', '#4aaee0', '#2979e8', '#60b8f5'],
  },

  // Colors: Program Card
  color_program_card: {
    gradient_from: '#0d2854',
    gradient_to: '#091a38',
    border: '#1e4a8a',
    opacity: 0.7,
  },

  // Fonts
  font_heading: 'Bricolage Grotesque',
  font_body: 'Inter',
  font_heading_weights: [400, 600, 700, 800],
  font_body_weights: [400, 500, 600],
  font_heading_urls: [],
  font_body_urls: [],
};

// ─────────────────────────────────────────────────
// 3. INSTRUCTOR
// ─────────────────────────────────────────────────
const instructor = {
  name: 'Daniel Angotti',
  role: 'Palestrante e Consultor Especialista',
  bio: 'Administrador Público e Consultor em Captação de Recursos e Relacionamento Governamental. Chefe da Unidade Regional SEGOV-MG em Brasília. Diretor e professor universitário por mais de 10 anos. Embaixador Liberta Minas e Formado no RenovaBR.',
  photo_url: '/palestrantetste.png',
  social_links: [
    {
      platform: 'instagram',
      url: 'https://instagram.com/danielangotti',
      handle: '@danielangotti',
    },
  ],
  status: 'active',
};

// ─────────────────────────────────────────────────
// 4. COURSE — Emendas Parlamentares na Prática
// ─────────────────────────────────────────────────
const course = {
  slug: 'emendas-parlamentares',
  status: 'published',
  modality: 'presencial',
  // design_system_id will be set after insert

  // Hero
  title: 'EMENDAS PARLAMENTARES NA PRÁTICA.',
  subtitle: 'Execução, Transparência e Prestação de Contas (pós-mudanças do STF)',
  category_label: 'Imersão',
  title_parts: [
    { text: 'EMENDAS ', color: 'white' },
    { text: 'PARLAMENTARES', color: 'accent' },
    { text: ' NA ', color: 'accent' },
    { text: 'PRÁTICA.', color: 'white' },
  ],
  hero_badges: [
    { icon: 'MapPin', label: '3 Dias de imersão em', value: 'Brasília | DF' },
    { icon: 'Users', label: 'Vagas limitadas', value: 'Presencial ou Ao Vivo' },
    { icon: 'CalendarDays', label: 'Próxima turma', value: 'dropdown' },
  ],

  // About
  about_heading: 'Domine as Novas Regras de\nExecução Orçamentária',
  about_subheading: 'Compreenda as recentes decisões do STF e as normativas do TCU sobre emendas parlamentares.',
  about_description: null,
  about_cards: [
    {
      icon: 'ShieldCheck',
      title: 'Segurança Jurídica',
      description: 'Entenda detalhadamente os novos entendimentos do STF e garanta que cada etapa do processo cumpra integralmente as diretrizes do Tribunal de Contas da União.',
    },
    {
      icon: 'Eye',
      title: 'Transparência Total',
      description: 'Aprenda a estruturar fluxos de informação, portais e relatórios que blindam a gestão pública contra acusações de opacidade e irregularidades.',
    },
    {
      icon: 'FileCheck',
      title: 'Prestação de Contas',
      description: 'Técnicas práticas para organização documental e aprovação célere de contas, garantindo a viabilidade de repasses futuros para o seu município.',
    },
    {
      icon: 'Scale',
      title: 'Conformidade Legal',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim.',
    },
    {
      icon: 'BookOpen',
      title: 'Capacitação Prática',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
    },
    {
      icon: 'Users',
      title: 'Gestão Colaborativa',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
  ],

  // Target Audience
  audience_heading: null,
  audience_cards: [
    {
      icon: 'Landmark',
      title: 'Prefeitos e Gestores',
      description: 'Líderes municipais responsáveis pela captação, direcionamento e execução final dos recursos orçamentários.',
    },
    {
      icon: 'FileSpreadsheet',
      title: 'Secretários de Finanças',
      description: 'Profissionais encarregados do planejamento financeiro e alocação estratégica de emendas na gestão local.',
    },
    {
      icon: 'Shield',
      title: 'Controladores e Auditores',
      description: 'Focados em garantir a conformidade técnica, transparência e prestação de contas alinhada aos órgãos de controle.',
    },
    {
      icon: 'User',
      title: 'Assessores Parlamentares',
      description: 'Especialistas que articulam a destinação das emendas e precisam dominar as novas regras do STF para orientação segura.',
    },
  ],
  audience_images: [
    { url: '/imgses/photo-1498036882173-b41c28a8ba34.avif', alt: 'Imagem 1' },
    { url: '/imgses/photo-1503899036084-c55cdd92da26.avif', alt: 'Imagem 2' },
    { url: '/imgses/photo-1536098561742-ca998e48cbcc.avif', alt: 'Imagem 3' },
    { url: '/imgses/photo-1540959733332-eab4deabeeaf.avif', alt: 'Imagem 4' },
    { url: '/imgses/photo-1551641506-ee5bf4cb45f1.avif', alt: 'Imagem 5' },
  ],

  // Program
  program_heading: 'Programação',
  program_description: '4 dias de imersão presencial em Brasília/DF. Carga horária total de 12 horas-aula.',

  // Investment
  investment_heading: 'Garanta sua Vaga',
  investment_subtitle: 'Invista na sua capacitação com acesso completo aos dias\nde imersão e material de apoio exclusivo.',
  included_items: [
    { icon: 'CheckCircle2', text: 'Kit do aluno (Mochila, Caderno, Caneta, Squeeze, Pulseira, Apostila e Credencial)' },
    { icon: 'CheckCircle2', text: 'Coffee Break incluso em todos os dias' },
    { icon: 'CheckCircle2', text: 'Certificado de Conclusão impresso (mín. 75% de frequência)' },
    { icon: 'CheckCircle2', text: 'Material didático atualizado com as últimas normativas' },
    { icon: 'CheckCircle2', text: 'Acesso ao grupo exclusivo de networking' },
  ],
  background_image_url: '/bgvg.png',

  // Testimonials
  testimonials: [
    {
      name: 'Maria Silva',
      role: 'Gestora de Contratos – TJMG',
      thumbnail_url: '/uploaded_media_0_1770074625239.png',
      youtube_id: 'dQw4w9WgXcQ',
    },
    {
      name: 'João Santos',
      role: 'Pregoeiro – Prefeitura de BH',
      thumbnail_url: '/uploaded_media_1770065697827.png',
      youtube_id: 'dQw4w9WgXcQ',
    },
    {
      name: 'Especialista',
      role: 'Instituto Plenum Brasil',
      thumbnail_url: '/uploaded_media_1770065858365.png',
      youtube_id: 'dQw4w9WgXcQ',
    },
    {
      name: 'Carlos Lima',
      role: 'Secretário – MPMG',
      thumbnail_url: '/uploaded_media_0_1770074625239.png',
      youtube_id: 'dQw4w9WgXcQ',
    },
    {
      name: 'Fernanda Souza',
      role: 'OAB – MG',
      thumbnail_url: '/uploaded_media_1770065697827.png',
      youtube_id: 'dQw4w9WgXcQ',
    },
  ],

  // Partner Logos
  partner_logos: [
    { name: 'Órgão 1', url: '/logos/logo1.png' },
    { name: 'Órgão 2', url: '/logos/logo2.png' },
    { name: 'Órgão 3', url: '/logos/logo3.png' },
    { name: 'Órgão 4', url: '/logos/logo4.png' },
    { name: 'Órgão 5', url: '/logos/logo5.png' },
    { name: 'Órgão 6', url: '/logos/logo6.png' },
    { name: 'Órgão 7', url: '/logos/logo7.png' },
    { name: 'Órgão 8', url: '/logos/logo8.png' },
  ],

  // WhatsApp
  whatsapp_number: '553125311776',
  whatsapp_message: 'Olá! Gostaria de informações sobre o curso de Emendas Parlamentares.',

  // PDF
  folder_pdf_url: null,

  // Hero Frames
  hero_frames_path: '/frames/frame_',
  hero_frame_count: 192,
  hero_frame_ext: '.jpg',

  // Section Backgrounds
  section_backgrounds: {
    investment: '/bgvg.png',
    folder: '/fundodepo.png',
  },

  // SEO
  meta_title: 'Emendas Parlamentares na Prática | Instituto Plenum Brasil',
  meta_description: 'Imersão de 4 dias sobre execução, transparência e prestação de contas de emendas parlamentares após as mudanças do STF.',
  og_image_url: null,
};

// ─────────────────────────────────────────────────
// 5. PROGRAM DAYS (for each course_date)
// ─────────────────────────────────────────────────
const programDays = [
  {
    tag: 'Dia 1 — Terça, 10/03',
    time: '14:00 às 18:00',
    title: 'Credenciamento e Entrega de Materiais',
    description: 'Recepção dos participantes, credenciamento, entrega de material didático e orientações iniciais sobre a dinâmica do curso.',
    topics: [
      { text: 'Credenciamento e recepção dos participantes', children: [] },
      { text: 'Entrega de material de apoio personalizado', children: [] },
      { text: 'Orientações sobre a dinâmica e objetivos do curso', children: [] },
    ],
  },
  {
    tag: 'Dia 2 — Quarta, 11/03',
    time: '08:00 às 12:00',
    title: 'Módulo I — Relacionamento Governamental Estratégico na Prática',
    description: 'Fundamentos do RelGov no contexto municipal: compliance, stakeholders e narrativas de valor público.',
    topics: [
      { text: 'O que é RelGov no contexto municipal e por que importa agora', children: [] },
      { text: 'Princípios, limites legais e compliance', children: [] },
      { text: 'Leitura de cenário: agenda nacional/estadual/municipal', children: [] },
      { text: 'Mapa de stakeholders: quem decide, quem influencia, quem executa', children: [] },
      { text: 'Propósito público, narrativa de valor e alinhamento com o interesse coletivo', children: [] },
    ],
  },
  {
    tag: 'Dia 3 — Quinta, 12/03',
    time: '08:00 às 12:00',
    title: 'Módulo II — Estratégia Institucional e Governança da Captação',
    description: 'Papéis do Executivo e Legislativo, portfólio de projetos, calendário de janelas e documentos base.',
    topics: [
      { text: 'Papéis e competências: como Executivo e Legislativo se complementam na captação', children: [] },
      { text: 'Portfólio de Projetos: diagnóstico, definição de prioridades, aderência ao PPA', children: [] },
      { text: 'Calendário anual de janelas: prazos de LDO/LOA, emendas e editais', children: [] },
      { text: 'Documentos base: plano de trabalho, estudo técnico, cronograma', children: [] },
    ],
  },
  {
    tag: 'Dia 4 — Sexta, 13/03',
    time: '08:00 às 12:00',
    title: 'Módulo III — Onde Estão os Recursos & Como Acessá-los',
    description: 'Transferências, programas federais, emendas parlamentares, fontes alternativas e monitoramento de oportunidades.',
    topics: [
      { text: 'Transferências obrigatórias x voluntárias e o que cabe ao município', children: [] },
      { text: 'Programas federais de adesão/convênios: uso do Transferegov.br', children: [] },
      { text: 'Novo PAC e programas setoriais (saúde, educação, cidades, cultura)', children: [] },
      { text: 'Emendas parlamentares: individuais impositivas, bancada e comissão', children: [] },
      { text: 'Fontes alternativas: fundos nacionais, bancos públicos e organismos internacionais', children: [] },
      { text: 'Monitoramento de oportunidades: diários oficiais, portais e alertas', children: [] },
    ],
  },
];

// ─────────────────────────────────────────────────
// 6. COURSE DATES (3 turmas)
// ─────────────────────────────────────────────────
const locationBase = {
  location_venue: 'Faculdade de Direito da UFMG',
  location_address: 'Avenida João Pinheiro, 100 – Centro\nBelo Horizonte / MG · CEP 30.130-180',
  location_map_embed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3750.9649262321777!2d-43.94151851384342!3d-19.925882790365527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa699e686e23e61%3A0xfb45aeef3d8c0cd4!2sFaculdade%20de%20Direito%20da%20UFMG!5e0!3m2!1spt-BR!2sbr!4v1769994180604!5m2!1spt-BR!2sbr',
  location_extra: [
    {
      label: 'Hospedagem Parceira',
      value: 'Solicite a lista de hotéis parceiros com tarifas especiais para participantes de cursos do Instituto Plenum Brasil.',
      icon: 'Building2',
    },
  ],
};

const courseDates = [
  {
    start_date: '2026-03-09',
    end_date: '2026-03-13',
    label: '09 a 13 de março de 2026',
    status: 'open',
    sort_order: 1,
    max_students: 60,
    program_days: programDays,
    ...locationBase,
  },
  {
    start_date: '2026-04-07',
    end_date: '2026-04-11',
    label: '07 a 11 de abril de 2026',
    status: 'open',
    sort_order: 2,
    max_students: 60,
    program_days: programDays,
    ...locationBase,
  },
  {
    start_date: '2026-05-05',
    end_date: '2026-05-09',
    label: '05 a 09 de maio de 2026',
    status: 'open',
    sort_order: 3,
    max_students: 60,
    program_days: programDays,
    ...locationBase,
  },
];

// ═════════════════════════════════════════════════
// SEED FUNCTION
// ═════════════════════════════════════════════════
async function seed() {
  console.log('🌱 Starting seed...\n');

  // ── 1. Company Settings ──
  console.log('📋 Inserting company_settings...');
  const { data: companyData, error: companyError } = await supabase
    .from('company_settings')
    .upsert(companySettings, { onConflict: 'id' })
    .select('id')
    .single();

  if (companyError) {
    // If upsert fails (no existing row), try insert
    const { data: insertedCompany, error: insertError } = await supabase
      .from('company_settings')
      .insert(companySettings)
      .select('id')
      .single();

    if (insertError) {
      console.error('❌ company_settings:', insertError.message);
      process.exit(1);
    }
    console.log(`   ✅ company_settings: ${insertedCompany.id}`);
  } else {
    console.log(`   ✅ company_settings: ${companyData.id}`);
  }

  // ── 2. Design System ──
  console.log('🎨 Inserting design_systems...');
  const { data: dsData, error: dsError } = await supabase
    .from('design_systems')
    .insert(designSystem)
    .select('id')
    .single();

  if (dsError) {
    // Maybe already exists — fetch the default one
    const { data: existingDs } = await supabase
      .from('design_systems')
      .select('id')
      .eq('is_default', true)
      .single();

    if (existingDs) {
      console.log(`   ⚠️  design_systems already exists: ${existingDs.id}`);
      // Continue with existing
      (course as Record<string, unknown>).design_system_id = existingDs.id;
    } else {
      console.error('❌ design_systems:', dsError.message);
      process.exit(1);
    }
  } else {
    console.log(`   ✅ design_systems: ${dsData.id}`);
    (course as Record<string, unknown>).design_system_id = dsData.id;
  }

  // ── 3. Instructor ──
  console.log('👨‍🏫 Inserting instructors...');
  const { data: instructorData, error: instructorError } = await supabase
    .from('instructors')
    .insert(instructor)
    .select('id')
    .single();

  let instructorId: string;
  if (instructorError) {
    // Maybe already exists — fetch by name
    const { data: existingInstructor } = await supabase
      .from('instructors')
      .select('id')
      .eq('name', instructor.name)
      .single();

    if (existingInstructor) {
      console.log(`   ⚠️  instructor already exists: ${existingInstructor.id}`);
      instructorId = existingInstructor.id;
    } else {
      console.error('❌ instructors:', instructorError.message);
      process.exit(1);
    }
  } else {
    console.log(`   ✅ instructors: ${instructorData.id}`);
    instructorId = instructorData.id;
  }

  // ── 4. Course ──
  console.log('📚 Inserting courses...');
  const { data: courseData, error: courseError } = await supabase
    .from('courses')
    .insert(course)
    .select('id')
    .single();

  let courseId: string;
  if (courseError) {
    // Maybe already exists — fetch by slug
    const { data: existingCourse } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', course.slug)
      .single();

    if (existingCourse) {
      console.log(`   ⚠️  course already exists: ${existingCourse.id}`);
      courseId = existingCourse.id;
    } else {
      console.error('❌ courses:', courseError.message);
      process.exit(1);
    }
  } else {
    console.log(`   ✅ courses: ${courseData.id}`);
    courseId = courseData.id;
  }

  // ── 5. Course Dates ──
  console.log('📅 Inserting course_dates...');
  for (const cd of courseDates) {
    const dateRecord = {
      ...cd,
      course_id: courseId,
      instructor_id: instructorId,
    };

    const { data: cdData, error: cdError } = await supabase
      .from('course_dates')
      .insert(dateRecord)
      .select('id')
      .single();

    if (cdError) {
      console.error(`   ❌ course_date (${cd.label}):`, cdError.message);
    } else {
      console.log(`   ✅ course_date: ${cd.label} → ${cdData.id}`);
    }
  }

  console.log('\n🎉 Seed complete!');
  console.log(`\n   📌 Course URL: /cursos/${course.slug}`);
}

// ── Run ──
seed().catch((err) => {
  console.error('💥 Unexpected error:', err);
  process.exit(1);
});

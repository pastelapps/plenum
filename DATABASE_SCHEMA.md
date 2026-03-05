# Database Schema — Gerador de Páginas de Cursos

> Supabase (PostgreSQL) | 6 tabelas | JSONB para dados aninhados

---

## Visão Geral

```
company_settings (1 registro)           ← Dados da empresa (compartilhado)

design_systems (N registros)            ← Temas visuais reutilizáveis (cores, fontes)
        │
        │  (design_system_id)
        │
instructors (N registros)               ← Cadastro de professores (reutilizáveis)
        │
        │  (instructor_id)
        │
course_dates (N registros)              ← Turmas: vincula curso + data + professor
        │
        │  (course_id)
        │
courses (N registros)                   ← 1 linha por curso (template da página)
        │
        │  (course_id)
        │
leads (N registros)                     ← Formulários capturados por curso
```

### Fluxo na página do curso:
1. Usuário acessa `/cursos/emendas-parlamentares`
2. Sistema busca o curso + todas as `course_dates` (com professor e programação)
3. Dropdown mostra todas as datas disponíveis
4. Ao selecionar uma data:
   - O **professor** vinculado àquela turma é exibido na seção "Instrutor"
   - A **programação** (dias, horários, tópicos) daquela turma é exibida na seção "Programação"

---

## Tabela: `company_settings`

Dados da empresa compartilhados entre todos os cursos. Normalmente só tem 1 registro.

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `id` | `UUID` (PK) | `gen_random_uuid()` | Identificador único |
| `company_name` | `TEXT NOT NULL` | `'Instituto Plenum Brasil'` | Nome da empresa |
| `address` | `TEXT` | — | Endereço completo (ex: "Rua Espírito Santo, nº 1204, 2º andar – sala 1, Bairro Lourdes – BH/MG – CEP: 30.160-033") |
| `phones` | `JSONB` | `'[]'` | Array de telefones |
| `emails` | `JSONB` | `'[]'` | Array de emails |
| `website` | `TEXT` | — | URL do site (ex: "www.plenumbrasil.com.br") |
| `cancellation_policy` | `TEXT` | — | Política de cancelamento (texto longo/markdown) |
| `payment_info` | `JSONB` | `'{}'` | Informações de pagamento |
| `logo_url` | `TEXT` | — | URL do logo claro (para fundo escuro) |
| `logo_dark_url` | `TEXT` | — | URL do logo escuro (para fundo claro) |
| `updated_at` | `TIMESTAMPTZ` | `now()` | Última atualização |

### Estrutura JSONB: `phones`
```json
[
  { "label": "Informações", "number": "(31) 2531-1776" },
  { "label": "Atendimento", "number": "(31) 4003-4961" }
]
```

### Estrutura JSONB: `emails`
```json
[
  { "label": "Geral", "email": "plenumgestaooficial@gmail.com" },
  { "label": "Financeiro", "email": "financeiro@plenumbrasil.com" }
]
```

### Estrutura JSONB: `payment_info`
```json
{
  "methods": "Boleto bancário, transferência, cheque ou dinheiro. Depósito, TED ou ordem bancária.",
  "pix_info": "Consulte",
  "finance_whatsapp": "https://wa.me/553125311776"
}
```

---

## Tabela: `design_systems`

Temas visuais reutilizáveis. Cada tema define as **cores semânticas**, **fontes** e **cores de shaders** usados na landing page. Um tema pode ser compartilhado por vários cursos — muda o tema, atualiza todos os cursos vinculados.

> **Filosofia:** Armazenamos apenas os tokens **primários** (cores base). Todas as variações de opacidade (white/40, blue/10, etc.), gradientes e sombras são **derivadas no CSS** a partir dessas cores base. Isso mantém a tabela enxuta e o sistema flexível.

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `id` | `UUID` (PK) | `gen_random_uuid()` | Identificador único |
| `name` | `TEXT NOT NULL` | — | Nome do tema (ex: "Azul Institucional", "Verde Compliance") |
| `description` | `TEXT` | — | Descrição curta do tema |
| `is_default` | `BOOLEAN` | `false` | Se é o tema padrão para novos cursos |

#### Cores — Destaque (Accent)

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `color_primary` | `TEXT NOT NULL` | `'#3b82f6'` | Cor de destaque principal — ícones, badges, labels, CTA borders, check icons, links, play buttons |
| `color_primary_hover` | `TEXT NOT NULL` | `'#60a5fa'` | Hover de CTAs (submit buttons, financial button) |
| `color_primary_light` | `TEXT NOT NULL` | `'#5b9cf6'` | Variante mais clara — check marks no Program, GlowingEffect |

> **Derivados automáticos via CSS (NÃO ficam no banco):**
> - `color_primary` / 5% → backgrounds sutis de CTAs (`bg-blue-500/5`)
> - `color_primary` / 10% → hover backgrounds, badges (`bg-blue-500/10`)
> - `color_primary` / 20% → borders de badges e CTAs (`border-blue-500/20`)
> - `color_primary` / 30% → borders hover de cards (`hover:border-blue-500/30`)
> - `color_primary` / 40% → focus borders de inputs (`focus:border-blue-500/40`)
> - `drop-shadow` e `box-shadow` com a cor primária em várias opacidades

#### Cores — Backgrounds

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `color_background` | `TEXT NOT NULL` | `'#030d1f'` | Fundo principal da página — About, Program, Teachers, Stats, SocialProof, WorkloadPayment |
| `color_background_alt` | `TEXT NOT NULL` | `'#020617'` | Fundo alternativo — Hero, Footer (slate-950) |
| `color_background_deep` | `TEXT NOT NULL` | `'#010814'` | Ponto final do gradiente radial do Hero |
| `color_surface` | `TEXT NOT NULL` | `'#0b1a30'` | Fundo de cards elevados — FolderForm info boxes, SocialProof info cards |
| `color_surface_alt` | `TEXT NOT NULL` | `'#0a1628'` | Fundo de cards escuros — SocialProof video cards |

> **Derivados automáticos via CSS (NÃO ficam no banco):**
> - Backgrounds com opacidade (`/50`, `/85`, `/95`) derivados do `color_background`
> - Gradientes como `from-[color_background] to-transparent` — compostos no CSS
> - `white/[0.03]` a `white/[0.08]` para cards e bordas — fixos, não mudam entre temas

#### Cores — Accent Alternativo

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `color_accent` | `TEXT` | `'#e1ff69'` | Cor alternativa — hover do `.btn-primary` (lime) |
| `color_whatsapp` | `TEXT` | `'#25D366'` | Cor do botão flutuante WhatsApp |

#### Cores — Gradientes Especiais (Hero)

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `color_hero_gradient_mid` | `TEXT NOT NULL` | `'#062060'` | Ponto médio do gradiente radial do hero (navy escuro) |

> O gradiente do hero é montado assim:
> `radial-gradient(ellipse 90% 60% at 50% 85%, {color_hero_gradient_mid} 0%, {color_background_deep} 60%)`

#### Cores — Shaders WebGL

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `shader_colors` | `JSONB` | (ver abaixo) | Cores dos shaders Three.js e OGL |

```json
{
  "colorbends": ["#007bff", "#4097bf"],
  "grainient": ["#030d1f", "#378bae", "#030d1f"],
  "glowing_effect": ["#5b9cf6", "#4aaee0", "#2979e8", "#60b8f5"]
}
```

> - `colorbends` → Shader Three.js usado na seção **Program** (2 cores)
> - `grainient` → Shader OGL usado na seção **SocialProof** (3 cores)
> - `glowing_effect` → Gradiente CSS animado nos cards de **TargetAudience** (4 cores)

#### Cores — Componentes Específicos

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `color_program_card` | `JSONB` | (ver abaixo) | Cores do accordion card da Programação |

```json
{
  "gradient_from": "#0d2854",
  "gradient_to": "#091a38",
  "border": "#1e4a8a",
  "opacity": 0.7
}
```

> Accordion da seção Programação usa gradiente e borda próprios derivados do tom azul do tema.
> O CSS monta: `bg-gradient-to-br from-[gradient_from]/[opacity] to-[gradient_to]/[opacity]`

#### Fontes

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `font_heading` | `TEXT NOT NULL` | `'PPRadioGrotesk'` | Fonte dos headings (h1-h6, títulos de cards) |
| `font_body` | `TEXT NOT NULL` | `'Satoshi'` | Fonte do corpo (parágrafos, labels, buttons) |
| `font_heading_weights` | `JSONB` | `'[400, 700]'` | Pesos disponíveis da fonte heading |
| `font_body_weights` | `JSONB` | `'[400, 500, 700, 900]'` | Pesos disponíveis da fonte body |
| `font_heading_urls` | `JSONB` | `'[]'` | URLs dos arquivos de fonte heading (woff2/otf) |
| `font_body_urls` | `JSONB` | `'[]'` | URLs dos arquivos de fonte body (woff2/otf) |

```json
// Exemplo font_heading_urls:
[
  { "weight": 400, "url": "https://xxx.supabase.co/storage/v1/object/public/fonts/PPRadioGrotesk-Regular.woff2", "format": "woff2" },
  { "weight": 700, "url": "https://xxx.supabase.co/storage/v1/object/public/fonts/PPRadioGrotesk-Regular.woff2", "format": "woff2" }
]

// Exemplo font_body_urls:
[
  { "weight": 400, "url": "https://xxx.supabase.co/storage/v1/object/public/fonts/Satoshi-Regular.otf", "format": "opentype" },
  { "weight": 500, "url": "https://xxx.supabase.co/storage/v1/object/public/fonts/Satoshi-Medium.otf", "format": "opentype" },
  { "weight": 700, "url": "https://xxx.supabase.co/storage/v1/object/public/fonts/Satoshi-Bold.otf", "format": "opentype" },
  { "weight": 900, "url": "https://xxx.supabase.co/storage/v1/object/public/fonts/Satoshi-Black.otf", "format": "opentype" }
]
```

#### Metadados

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `created_at` | `TIMESTAMPTZ` | `now()` | Data de criação |
| `updated_at` | `TIMESTAMPTZ` | `now()` | Última atualização |

### Como o Design System funciona no frontend

O sistema injeta as cores como **CSS Custom Properties** no `<style>` da página:

```typescript
// app/cursos/[slug]/page.tsx (Server Component)
// Ao carregar o curso, busca o design_system vinculado e gera:

<style>{`
  :root {
    --ds-primary: ${ds.color_primary};
    --ds-primary-hover: ${ds.color_primary_hover};
    --ds-primary-light: ${ds.color_primary_light};
    --ds-background: ${ds.color_background};
    --ds-background-alt: ${ds.color_background_alt};
    --ds-background-deep: ${ds.color_background_deep};
    --ds-surface: ${ds.color_surface};
    --ds-surface-alt: ${ds.color_surface_alt};
    --ds-accent: ${ds.color_accent};
    --ds-hero-gradient-mid: ${ds.color_hero_gradient_mid};
    --ds-font-heading: '${ds.font_heading}', system-ui, sans-serif;
    --ds-font-body: '${ds.font_body}', system-ui, sans-serif;
  }
`}</style>
```

Nos componentes, Tailwind usa essas variáveis:
```html
<!-- Antes (hardcoded): -->
<div class="bg-[#030d1f] text-[#3b82f6]">

<!-- Depois (dinâmico): -->
<div class="bg-[var(--ds-background)] text-[var(--ds-primary)]">
```

### Mapeamento: Tokens → Componentes

| Token CSS | Componentes que usam |
|-----------|---------------------|
| `--ds-primary` | Hero (texto azul, badges), About (ícones), TargetAudience (heading), Program (checks), Teachers (role), WorkloadPayment (badge, CTA), FolderForm (badge, submit), Location (ícones, labels), SocialProof (labels, play button), Header (CTA border), neon-button |
| `--ds-primary-hover` | WorkloadPayment (CTA hover), FolderForm (submit hover), SocialProof (financial button hover) |
| `--ds-primary-light` | Program (check icons), GlowingEffect (gradient) |
| `--ds-background` | About, Program, Teachers, Stats, SocialProof, WorkloadPayment, page.tsx body |
| `--ds-background-alt` | Hero, Footer |
| `--ds-background-deep` | Hero gradiente radial |
| `--ds-surface` | FolderForm info box, SocialProof info cards |
| `--ds-surface-alt` | SocialProof video cards |
| `--ds-accent` | globals.css `.btn-primary:hover` |
| `--ds-hero-gradient-mid` | Hero background radial gradient |
| `--ds-font-heading` | Todos os h1-h6, títulos de card |
| `--ds-font-body` | Todo texto body, labels, buttons |

### Exemplo: Criando tema "Verde Compliance"

```json
{
  "name": "Verde Compliance",
  "description": "Tema verde para cursos de compliance e auditoria",
  "color_primary": "#22c55e",
  "color_primary_hover": "#4ade80",
  "color_primary_light": "#86efac",
  "color_background": "#051a0e",
  "color_background_alt": "#021208",
  "color_background_deep": "#010a05",
  "color_surface": "#0b2e18",
  "color_surface_alt": "#082010",
  "color_accent": "#e1ff69",
  "color_whatsapp": "#25D366",
  "color_hero_gradient_mid": "#0a4020",
  "color_program_card": {
    "gradient_from": "#0d4028",
    "gradient_to": "#091f14",
    "border": "#1e7a4a",
    "opacity": 0.7
  },
  "shader_colors": {
    "colorbends": ["#00ff7b", "#40bf97"],
    "grainient": ["#051a0e", "#38ae7b", "#051a0e"],
    "glowing_effect": ["#5bf69c", "#4ae0aa", "#29e879", "#60f5b8"]
  },
  "font_heading": "PPRadioGrotesk",
  "font_body": "Satoshi"
}
```

> Resultado: **toda a página muda de azul para verde** sem tocar em nenhum componente.

---

## Tabela: `instructors`

Cadastro de professores/instrutores. Cada professor é cadastrado **uma vez** e pode ser vinculado a múltiplos cursos e turmas.

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `id` | `UUID` (PK) | `gen_random_uuid()` | Identificador único |
| `name` | `TEXT NOT NULL` | — | Nome completo (ex: "Daniel Angotti") |
| `role` | `TEXT` | — | Cargo/título (ex: "Palestrante e Consultor Especialista") |
| `bio` | `TEXT` | — | Biografia completa (texto longo) |
| `photo_url` | `TEXT` | — | URL da foto no Supabase Storage |
| `social_links` | `JSONB` | `'[]'` | Redes sociais do instrutor |
| `status` | `TEXT NOT NULL` | `'active'` | Estado: `active`, `inactive` |
| `created_at` | `TIMESTAMPTZ` | `now()` | Data de criação |
| `updated_at` | `TIMESTAMPTZ` | `now()` | Última atualização |

### Estrutura JSONB: `social_links`
```json
[
  {
    "platform": "instagram",
    "url": "https://instagram.com/danielangotti",
    "handle": "@danielangotti"
  },
  {
    "platform": "linkedin",
    "url": "https://linkedin.com/in/danielangotti",
    "handle": "Daniel Angotti"
  }
]
```

### Exemplo completo de um instrutor:
```json
{
  "id": "a1b2c3d4-...",
  "name": "Daniel Angotti",
  "role": "Palestrante e Consultor Especialista",
  "bio": "Administrador Público e Consultor em Captação de Recursos e Relacionamento Governamental. Chefe da Unidade Regional SEGOV-MG em Brasília. Diretor e professor universitário por mais de 10 anos. Embaixador Liberta Minas e Formado no RenovaBR.",
  "photo_url": "https://xxx.supabase.co/storage/v1/object/public/instructors/daniel-angotti.png",
  "social_links": [
    { "platform": "instagram", "url": "https://instagram.com/danielangotti", "handle": "@danielangotti" }
  ],
  "status": "active"
}
```

---

## Tabela: `course_dates`

Turmas/datas de cada curso. Vincula um **curso** a uma **data** e a um **professor**. Um mesmo curso pode ter N turmas, cada uma com professor diferente (ou o mesmo).

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `id` | `UUID` (PK) | `gen_random_uuid()` | Identificador único |
| `course_id` | `UUID NOT NULL` (FK → courses) | — | Curso vinculado |
| `instructor_id` | `UUID NOT NULL` (FK → instructors) | — | Professor desta turma |
| `start_date` | `TIMESTAMPTZ NOT NULL` | — | Data de início da turma |
| `end_date` | `TIMESTAMPTZ NOT NULL` | — | Data de término da turma |
| `label` | `TEXT` | — | Label formatado para exibição (ex: "09 a 13 de março de 2026") |
| `location_venue` | `TEXT` | — | Nome do local (ex: "Faculdade de Direito da UFMG") |
| `location_address` | `TEXT` | — | Endereço completo |
| `location_map_embed` | `TEXT` | — | URL do embed Google Maps |
| `location_extra` | `JSONB` | `'[]'` | Info extra (hospedagem, etc.) |
| `program_days` | `JSONB` | `'[]'` | Programação desta turma (dias, horários, tópicos) |
| `max_students` | `INTEGER` | — | Limite de vagas (null = sem limite) |
| `status` | `TEXT NOT NULL` | `'open'` | Estado: `open`, `closed`, `cancelled` |
| `sort_order` | `INTEGER` | `0` | Ordem de exibição no dropdown |
| `created_at` | `TIMESTAMPTZ` | `now()` | Data de criação |

### Exemplo de turmas para um curso:
```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ course_id          │ instructor_id       │ start/end        │ label       │ location_venue       │ program_days │
├────────────────────┼─────────────────────┼──────────────────┼─────────────┼──────────────────────┼──────────────┤
│ curso-emendas-uuid │ daniel-angotti-uuid │ 09/03 → 13/03    │ 09 a 13/mar │ Fac. Direito UFMG    │ [{...4 dias}]│
│ curso-emendas-uuid │ daniel-angotti-uuid │ 07/04 → 11/04    │ 07 a 11/abr │ Fac. Direito UFMG    │ [{...4 dias}]│
│ curso-emendas-uuid │ outro-prof-uuid     │ 05/05 → 09/05    │ 05 a 09/mai │ Hotel Nacional - BSB │ [{...3 dias}]│
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

> **Nota:** A turma de maio tem **outro professor**, **outro local** (Brasília em vez de BH) e **programação diferente** (3 dias em vez de 4)! Quando o usuário seleciona essa data no dropdown, o "Instrutor", "Programação" e "Localização" mudam automaticamente.

### Estrutura JSONB: `program_days` (dentro de course_dates)
Estrutura hierárquica: Dia → Tópicos → Sub-tópicos (opcional).
Cada turma tem sua própria programação completa.
```json
[
  {
    "tag": "Dia 1 — Terça, 10/03",
    "time": "14:00 às 18:00",
    "title": "Credenciamento e Entrega de Materiais",
    "description": "Recepção dos participantes com entrega de materiais e abertura oficial do evento.",
    "topics": [
      { "text": "Recepção e credenciamento dos participantes", "children": [] },
      { "text": "Entrega do kit do aluno", "children": [] },
      { "text": "Abertura oficial do evento", "children": [] }
    ]
  },
  {
    "tag": "Dia 2 — Quarta, 11/03",
    "time": "08:00 às 12:00",
    "title": "Módulo I — Relacionamento Governamental Estratégico na Prática",
    "description": "Técnicas avançadas de articulação com parlamentares e órgãos federais.",
    "topics": [
      {
        "text": "Como mapear emendas parlamentares disponíveis",
        "children": [
          "Identificação de fontes de recursos",
          "Análise do orçamento federal"
        ]
      },
      { "text": "Estratégias de articulação institucional", "children": [] },
      { "text": "Elaboração de planos de trabalho", "children": [] },
      { "text": "Formalização de convênios e transferências", "children": [] },
      { "text": "Estudo de caso prático", "children": [] }
    ]
  },
  {
    "tag": "Dia 3 — Quinta, 12/03",
    "time": "08:00 às 12:00",
    "title": "Módulo II — Estratégia Institucional e Governança da Captação",
    "description": "Planejamento estratégico para captação e gestão de emendas.",
    "topics": [
      { "text": "Governança da captação de recursos", "children": [] },
      { "text": "Indicadores de desempenho", "children": [] },
      { "text": "Controle interno e compliance", "children": [] },
      { "text": "Workshop prático", "children": [] }
    ]
  },
  {
    "tag": "Dia 4 — Sexta, 13/03",
    "time": "08:00 às 12:00",
    "title": "Módulo III — Onde Estão os Recursos & Como Acessá-los",
    "description": "Identificação e acesso a fontes de recursos federais.",
    "topics": [
      { "text": "Panorama das transferências voluntárias", "children": [] },
      { "text": "Plataformas Transferegov e similares", "children": [] },
      { "text": "Emendas de bancada e individuais", "children": [] },
      { "text": "Prestação de contas ao TCU", "children": [] },
      { "text": "Encerramento e certificação", "children": [] },
      { "text": "Networking final", "children": [] }
    ]
  }
]
```

### Comportamento no frontend:

```
1. Página carrega → busca course_dates com instructor JOIN
2. Dropdown mostra: ["09 a 13 de março de 2026", "07 a 11 de abril de 2026", "05 a 09 de maio de 2026"]
3. Primeira turma selecionada por padrão:
   → Seção "Instrutor" mostra Daniel Angotti
   → Seção "Programação" mostra os 4 dias da turma de março
   → Seção "Localização" mostra Fac. Direito UFMG (BH)
4. Usuário seleciona "05 a 09 de maio de 2026":
   → Seção "Instrutor" troca para outro professor
   → Seção "Programação" troca para os 3 dias da turma de maio
   → Seção "Localização" troca para Hotel Nacional (Brasília)
```

### Query de exemplo (buscar turmas com professor e programação):
```sql
SELECT
  cd.id,
  cd.start_date,
  cd.end_date,
  cd.label,
  cd.location_override,
  cd.program_days,
  cd.max_students,
  cd.status,
  i.id AS instructor_id,
  i.name AS instructor_name,
  i.role AS instructor_role,
  i.bio AS instructor_bio,
  i.photo_url AS instructor_photo,
  i.social_links AS instructor_social
FROM course_dates cd
JOIN instructors i ON i.id = cd.instructor_id
WHERE cd.course_id = 'xxx'
  AND cd.status = 'open'
  AND cd.start_date >= now()
ORDER BY cd.sort_order, cd.start_date;
```

---

## Tabela: `courses`

Entidade principal. Cada registro gera uma landing page completa em `/cursos/[slug]`.

> **Mudança:** Os campos `turmas` (JSONB) e `instructors` (JSONB) foram **removidos**. Agora vivem nas tabelas `course_dates` e `instructors` respectivamente.

### Campos Gerais

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `id` | `UUID` (PK) | `gen_random_uuid()` | Identificador único |
| `slug` | `TEXT UNIQUE NOT NULL` | — | URL amigável (ex: "emendas-parlamentares-2026") |
| `status` | `TEXT NOT NULL` | `'draft'` | Estado: `draft`, `published`, `archived` |
| `modality` | `TEXT NOT NULL` | `'presencial'` | Modalidade: `presencial`, `online`, `hibrido` |
| `design_system_id` | `UUID` (FK → design_systems) | — | Tema visual do curso (nullable = usa tema padrão) |
| `created_at` | `TIMESTAMPTZ` | `now()` | Data de criação |
| `updated_at` | `TIMESTAMPTZ` | `now()` | Última atualização |

### Campos Hero

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `title` | `TEXT NOT NULL` | — | Título principal (ex: "EMENDAS PARLAMENTARES NA PRÁTICA.") |
| `subtitle` | `TEXT` | — | Subtítulo (ex: "Execução, Transparência e Prestação de Contas") |
| `category_label` | `TEXT` | — | Tag de categoria (ex: "Imersão") |
| `title_parts` | `JSONB` | — | Partes do título com cores diferentes |
| `hero_badges` | `JSONB` | `'[]'` | Badges informativos do hero |

> **Nota:** `turmas` foi removido daqui. As datas agora vêm da tabela `course_dates`.

#### Estrutura JSONB: `title_parts`
Permite que partes do título tenham cores diferentes (branco e azul).
```json
[
  { "text": "EMENDAS ", "color": "white" },
  { "text": "PARLAMENTARES", "color": "accent" },
  { "text": "NA ", "color": "white" },
  { "text": "PRÁTICA.", "color": "accent" }
]
```

#### Estrutura JSONB: `hero_badges`
Badges com ícone, label e valor exibidos no hero.
```json
[
  { "icon": "MapPin", "label": "3 Dias de imersão em", "value": "Brasília | DF" },
  { "icon": "Users", "label": "Vagas limitadas", "value": "Presencial ou Ao Vivo" },
  { "icon": "CalendarDays", "label": "Próxima turma", "value": "dropdown" }
]
```

### Campos Sobre (About)

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `about_heading` | `TEXT` | — | Título da seção (ex: "Domine as Novas Regras de Execução Orçamentária") |
| `about_subheading` | `TEXT` | — | Subtítulo da seção |
| `about_description` | `TEXT` | — | Descrição adicional |
| `about_cards` | `JSONB` | `'[]'` | Array de 6 cards de benefícios |

#### Estrutura JSONB: `about_cards`
Cada card tem um ícone Lucide, título e descrição.
```json
[
  {
    "icon": "ShieldCheck",
    "title": "Segurança Jurídica",
    "description": "Entenda as recentes decisões do STF e as normativas do TCU sobre emendas parlamentares, garantindo que sua gestão esteja em conformidade."
  },
  {
    "icon": "Eye",
    "title": "Transparência Total",
    "description": "Aprenda a estruturar fluxos de informação e prestação de contas que atendam às exigências dos órgãos de controle."
  },
  {
    "icon": "FileCheck",
    "title": "Prestação de Contas",
    "description": "Domine as técnicas de organização documental e elaboração de relatórios exigidos pelo TCU e CGU."
  },
  {
    "icon": "Scale",
    "title": "Conformidade Legal",
    "description": "Mantenha-se atualizado com as últimas mudanças legislativas e regulatórias."
  },
  {
    "icon": "BookOpen",
    "title": "Capacitação Prática",
    "description": "Exercícios práticos e estudos de caso reais para aplicação imediata."
  },
  {
    "icon": "Users",
    "title": "Gestão Colaborativa",
    "description": "Networking com profissionais de todo o país e troca de experiências."
  }
]
```

**Ícones disponíveis (Lucide):** `ShieldCheck`, `Eye`, `FileCheck`, `Scale`, `BookOpen`, `Users`, `Landmark`, `FileSpreadsheet`, `Shield`, `User`, `MapPin`, `CalendarDays`, `Clock`, `CheckCircle2`, `Download`, `Mail`, `Phone`, `Link2`, `ChevronUp`, `ChevronDown`, `Play`, `X`, `Menu`, `Building2`, `Globe`, `Hotel`

### Campos Público-Alvo (Target Audience)

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `audience_heading` | `TEXT` | — | Título da seção (ex: "Para quem é esta imersão?") |
| `audience_cards` | `JSONB` | `'[]'` | Array de 4 cards de público |
| `audience_images` | `JSONB` | `'[]'` | Imagens de fundo da galeria bento |

#### Estrutura JSONB: `audience_cards`
```json
[
  {
    "icon": "Landmark",
    "title": "Prefeitos e Gestores",
    "description": "Líderes responsáveis pela captação e gestão de recursos orçamentários."
  },
  {
    "icon": "FileSpreadsheet",
    "title": "Secretários de Finanças",
    "description": "Profissionais de planejamento financeiro e execução orçamentária."
  },
  {
    "icon": "Shield",
    "title": "Controladores e Auditores",
    "description": "Responsáveis por compliance, transparência e prestação de contas."
  },
  {
    "icon": "User",
    "title": "Assessores Parlamentares",
    "description": "Especialistas em alocação e acompanhamento de emendas."
  }
]
```

#### Estrutura JSONB: `audience_images`
Imagens usadas na galeria bento com direção de parallax.
```json
[
  { "src": "/imgses/photo-1.avif", "xDir": -1, "yDir": -1, "sizes": "33vw" },
  { "src": "/imgses/photo-2.avif", "xDir": 1, "yDir": -1, "sizes": "33vw" },
  { "src": "/imgses/photo-3.avif", "xDir": -1, "yDir": 1, "sizes": "33vw" },
  { "src": "/imgses/photo-4.avif", "xDir": 0, "yDir": 1, "sizes": "33vw" },
  { "src": "/imgses/photo-5.avif", "xDir": 1, "yDir": 1, "sizes": "33vw" }
]
```

### Campos Programação (Program)

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `program_heading` | `TEXT` | `'Programação'` | Título da seção |
| `program_description` | `TEXT` | — | Subtítulo (ex: "4 dias de imersão presencial em Brasília/DF. Carga horária total de 12 horas-aula.") |

> **Nota:** `program_days` foi **movido para a tabela `course_dates`**. Cada turma tem sua própria programação. Os campos `program_heading` e `program_description` permanecem aqui como labels genéricos da seção.

### Campos Investimento (WorkloadPayment)

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `investment_heading` | `TEXT` | `'Garanta sua Vaga'` | Título da seção |
| `investment_subtitle` | `TEXT` | — | Subtítulo |
| `included_items` | `JSONB` | `'[]'` | Lista do que está incluso |
| `background_image_url` | `TEXT` | — | URL da imagem de fundo |

#### Estrutura JSONB: `included_items`
Array simples de strings.
```json
[
  "Kit do aluno (Mochila, Caderno, Caneta, Squeeze, Pulseira, Apostila e Credencial)",
  "Coffee Break incluso em todos os dias",
  "Certificado de Conclusão impresso (mín. 75% de frequência)",
  "Material didático atualizado com as últimas normativas",
  "Acesso ao grupo exclusivo de networking"
]
```

### Campos Depoimentos (Testimonials)

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `testimonials` | `JSONB` | `'[]'` | Array de vídeos de depoimentos |

#### Estrutura JSONB: `testimonials`
Suporta vídeo do YouTube (via ID) ou vídeo local (via URL).
```json
[
  {
    "id": 1,
    "title": "Depoimento: Maria Silva",
    "role": "Gestora de Contratos – TJMG",
    "thumbnail_url": "https://xxx.supabase.co/storage/v1/object/public/courses/thumbnails/maria.png",
    "youtube_id": "dQw4w9WgXcQ",
    "video_url": null
  },
  {
    "id": 2,
    "title": "Depoimento: João Santos",
    "role": "Pregoeiro – Prefeitura de BH",
    "thumbnail_url": "https://xxx.supabase.co/storage/v1/object/public/courses/thumbnails/joao.png",
    "youtube_id": null,
    "video_url": "https://xxx.supabase.co/storage/v1/object/public/courses/videos/depoimento-joao.mp4"
  }
]
```

### Campos Logos Parceiros (Stats)

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `partner_logos` | `JSONB` | `'[]'` | Array de logos do carrossel |

#### Estrutura JSONB: `partner_logos`
```json
[
  { "src": "https://xxx.supabase.co/storage/v1/object/public/courses/logos/orgao1.png", "alt": "Prefeitura de BH" },
  { "src": "https://xxx.supabase.co/storage/v1/object/public/courses/logos/orgao2.png", "alt": "TJMG" },
  { "src": "https://xxx.supabase.co/storage/v1/object/public/courses/logos/orgao3.png", "alt": "MPMG" }
]
```

### Campos Localização (Location)

> **Nota:** Os campos de localização foram **movidos para a tabela `course_dates`**. Cada turma define seu próprio local (venue, endereço, mapa). A seção de localização só é exibida quando `modality` = `'presencial'` ou `'hibrido'`.

### Campos WhatsApp

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `whatsapp_number` | `TEXT` | — | Número sem formatação (ex: "553125311776") |
| `whatsapp_message` | `TEXT` | — | Mensagem pré-preenchida (ex: "Olá! Gostaria de informações sobre o curso de Emendas Parlamentares.") |

> Usado no botão flutuante, CTA do hero e botão "Falar com Consultor".

### Campos PDF / Folder

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `folder_pdf_url` | `TEXT` | — | URL do PDF gerado no Supabase Storage |

> Gerado automaticamente via `@react-pdf/renderer` quando admin clica "Gerar Folder".

### Campos Mídia / Assets

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `hero_frames_path` | `TEXT` | — | Prefixo do caminho dos frames no Storage (ex: "frames/emendas-2026/frame_") |
| `hero_frame_count` | `INTEGER` | — | Quantidade total de frames da animação (ex: 192) |
| `hero_frame_ext` | `TEXT` | `'.jpg'` | Extensão dos arquivos de frame (`.jpg`, `.webp`, `.png`) |
| `section_backgrounds` | `JSONB` | `'{}'` | URLs das imagens de fundo por seção |

> **Como funciona a animação do Hero:**
> O componente Hero renderiza um `<canvas>` e, conforme o scroll, desenha os frames em sequência.
> O sistema monta o caminho de cada frame assim:
> ```
> {hero_frames_path}{número_com_4_dígitos}{hero_frame_ext}
> Exemplo: "frames/emendas-2026/frame_0001.jpg"
>           "frames/emendas-2026/frame_0002.jpg"
>           ...
>           "frames/emendas-2026/frame_0192.jpg"
> ```
> O `hero_frame_count` define até qual número carregar (1 até N).
> Os arquivos ficam no bucket `frames` do Supabase Storage.

#### Fluxo no Admin: Upload de vídeo → Frames automáticos

O admin sobe um **vídeo MP4** e o sistema gera os frames automaticamente.
O projeto já tem `ffmpeg-static` instalado como dependência.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     PAINEL ADMIN — Aba "Hero"                          │
│                                                                         │
│  ┌─────────────────────────────────────────┐                           │
│  │  📁 Arraste o vídeo MP4 ou clique aqui  │                           │
│  │           (máx. 50MB)                    │                           │
│  └─────────────────────────────────────────┘                           │
│                                                                         │
│  Após upload:                                                           │
│  ┌─────────────────────────────────────────┐                           │
│  │  ✅ video-hero.mp4 (12.3 MB)            │                           │
│  │  ⏳ Extraindo frames... 78%             │                           │
│  │  ─────────████████████░░░──────          │                           │
│  └─────────────────────────────────────────┘                           │
│                                                                         │
│  Resultado:                                                             │
│  ┌─────────────────────────────────────────┐                           │
│  │  ✅ 192 frames extraídos com sucesso    │                           │
│  │  📐 Resolução: 1920x1080                │                           │
│  │  📦 Tamanho total: 8.4 MB               │                           │
│  │                                          │                           │
│  │  Preview: [frame 1] [frame 50] [frame 192] │                        │
│  └─────────────────────────────────────────┘                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### API Route: `POST /api/admin/hero-frames/[courseId]`

Fluxo interno do processamento:

```
1. Admin faz upload do MP4
       │
       ▼
2. API recebe o vídeo e salva em /tmp/
       │
       ▼
3. FFmpeg extrai frames do vídeo:
   ffmpeg -i video.mp4 -vf "fps=30" -q:v 2 frame_%04d.jpg
       │
       │  Parâmetros:
       │  • fps=30 → 30 frames por segundo (ajustável)
       │  • q:v 2  → qualidade alta do JPG (1=melhor, 31=pior)
       │  • %04d   → numeração com 4 dígitos (0001, 0002...)
       │
       ▼
4. Sistema conta quantos frames foram gerados
       │
       ▼
5. Upload dos JPGs para Supabase Storage:
   Bucket: frames/{courseSlug}/frame_0001.jpg
                               frame_0002.jpg
                               ...
                               frame_0192.jpg
       │
       ▼
6. Atualiza o banco automaticamente:
   UPDATE courses SET
     hero_frames_path  = 'frames/emendas-parlamentares/frame_',
     hero_frame_count  = 192,
     hero_frame_ext    = '.jpg'
   WHERE id = 'xxx';
       │
       ▼
7. Limpa arquivos temporários (/tmp/)
       │
       ▼
8. Retorna: { success: true, frameCount: 192, previewUrls: [...] }
```

#### Código resumido da API Route:
```typescript
// app/api/admin/hero-frames/[courseId]/route.ts
import { execSync } from 'child_process';
import ffmpegPath from 'ffmpeg-static';
import path from 'path';
import fs from 'fs';

export async function POST(req, { params }) {
  const { courseId } = await params;
  const formData = await req.formData();
  const video = formData.get('video') as File;

  // 1. Salvar vídeo em /tmp
  const tmpDir = path.join('/tmp', `hero-${courseId}`);
  fs.mkdirSync(tmpDir, { recursive: true });
  const videoPath = path.join(tmpDir, 'input.mp4');
  fs.writeFileSync(videoPath, Buffer.from(await video.arrayBuffer()));

  // 2. Extrair frames com FFmpeg
  const framesDir = path.join(tmpDir, 'frames');
  fs.mkdirSync(framesDir, { recursive: true });

  execSync(
    `${ffmpegPath} -i ${videoPath} -vf "fps=30" -q:v 2 ${framesDir}/frame_%04d.jpg`
  );

  // 3. Contar frames gerados
  const frames = fs.readdirSync(framesDir).filter(f => f.endsWith('.jpg'));
  const frameCount = frames.length;

  // 4. Upload para Supabase Storage
  const courseSlug = await getCourseSlug(courseId);
  for (const frame of frames) {
    const filePath = path.join(framesDir, frame);
    await supabase.storage
      .from('frames')
      .upload(`${courseSlug}/${frame}`, fs.readFileSync(filePath), {
        contentType: 'image/jpeg',
        upsert: true
      });
  }

  // 5. Atualizar banco
  await supabase.from('courses').update({
    hero_frames_path: `frames/${courseSlug}/frame_`,
    hero_frame_count: frameCount,
    hero_frame_ext: '.jpg'
  }).eq('id', courseId);

  // 6. Limpar /tmp
  fs.rmSync(tmpDir, { recursive: true });

  return Response.json({ success: true, frameCount });
}
```

#### Onde os frames ficam no Supabase Storage:
```
Bucket: frames
└── {courseSlug}/
    ├── frame_0001.jpg
    ├── frame_0002.jpg
    ├── frame_0003.jpg
    ├── ...
    └── frame_0192.jpg    ← último frame (hero_frame_count = 192)
```

#### Exemplo de valores no banco (preenchidos automaticamente):
```
hero_frames_path  = "frames/emendas-parlamentares-2026/frame_"
hero_frame_count  = 192
hero_frame_ext    = ".jpg"
```

#### Como o componente Hero usa esses dados:
```typescript
// Monta a URL de cada frame
for (let i = 1; i <= hero_frame_count; i++) {
  const frameNum = String(i).padStart(4, '0');  // "0001", "0002", ...
  const url = `${SUPABASE_STORAGE_URL}/${hero_frames_path}${frameNum}${hero_frame_ext}`;
  // Pré-carrega a imagem e desenha no canvas conforme scroll
}
```

#### Estrutura JSONB: `section_backgrounds`
URLs das imagens de fundo usadas em seções específicas.
```json
{
  "investment_bg": "https://xxx.supabase.co/storage/v1/object/public/courses/emendas-2026/bg/bgvg.png",
  "folder_form_bg": "https://xxx.supabase.co/storage/v1/object/public/courses/emendas-2026/bg/fundodepo.png"
}
```

### Campos SEO

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `meta_title` | `TEXT` | — | Título para `<title>` e Open Graph (fallback: `title`) |
| `meta_description` | `TEXT` | — | Descrição meta (fallback: `subtitle`) |
| `og_image_url` | `TEXT` | — | Imagem para compartilhamento em redes sociais |

---

## Tabela: `leads`

Captura de leads dos formulários públicos do site.

| Coluna | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `id` | `UUID` (PK) | `gen_random_uuid()` | Identificador único |
| `course_id` | `UUID` (FK → courses) | — | Curso de origem (ON DELETE SET NULL) |
| `course_date_id` | `UUID` (FK → course_dates) | — | Turma selecionada (ON DELETE SET NULL, opcional) |
| `form_type` | `TEXT NOT NULL` | — | Tipo: `folder`, `in_company`, `notification` |
| `nome` | `TEXT NOT NULL` | — | Nome completo |
| `email` | `TEXT` | — | Email corporativo |
| `whatsapp` | `TEXT` | — | Número WhatsApp |
| `estado` | `TEXT` | — | Estado (UF) |
| `cidade` | `TEXT` | — | Cidade |
| `orgao` | `TEXT` | — | Órgão representante |
| `created_at` | `TIMESTAMPTZ` | `now()` | Data de submissão |

### Tipos de formulário (`form_type`)

| Valor | Origem | Campos capturados |
|-------|--------|-------------------|
| `folder` | Formulário "Baixe o Folder" | nome, email, whatsapp, estado, cidade, orgao |
| `in_company` | Formulário "Quero esse curso no meu órgão" | nome, email, whatsapp, orgao |
| `notification` | Formulário de notificação/inscrição | nome, email, whatsapp |

---

## Relacionamentos

```
design_systems (1) ────< (N) courses (1) >────< (N) course_dates (N) >──── (1) instructors
                                  │                        │
                                  │  (course_id)           │ (optional)
                                  │                        │
                                leads (N) >────────────────┘
```

| Relacionamento | Tipo | Descrição |
|----------------|------|-----------|
| `design_systems` → `courses` | 1:N | Um tema pode ser usado por vários cursos |
| `courses` → `course_dates` | 1:N | Um curso tem várias turmas |
| `instructors` → `course_dates` | 1:N | Um professor pode dar aula em várias turmas |
| `courses` → `leads` | 1:N | Um curso recebe vários leads |
| `course_dates` → `leads` | 1:N | Um lead pode estar vinculado a uma turma específica (opcional) |

---

## Indexes

```sql
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_design_system ON courses(design_system_id);
CREATE INDEX idx_course_dates_course ON course_dates(course_id);
CREATE INDEX idx_course_dates_instructor ON course_dates(instructor_id);
CREATE INDEX idx_course_dates_start ON course_dates(start_date);
CREATE INDEX idx_course_dates_status ON course_dates(status);
CREATE INDEX idx_instructors_status ON instructors(status);
CREATE INDEX idx_leads_course ON leads(course_id);
CREATE INDEX idx_leads_course_date ON leads(course_date_id);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
```

---

## Row Level Security (RLS)

### design_systems
| Política | Operação | Condição |
|----------|----------|----------|
| Leitura pública | `SELECT` | `true` (todos podem ler temas) |
| Admin completo | `ALL` | `auth.role() = 'authenticated'` |

### courses
| Política | Operação | Condição |
|----------|----------|----------|
| Leitura pública | `SELECT` | `status = 'published'` |
| Admin completo | `ALL` | `auth.role() = 'authenticated'` |

### instructors
| Política | Operação | Condição |
|----------|----------|----------|
| Leitura pública | `SELECT` | `status = 'active'` |
| Admin completo | `ALL` | `auth.role() = 'authenticated'` |

### course_dates
| Política | Operação | Condição |
|----------|----------|----------|
| Leitura pública | `SELECT` | `status = 'open'` |
| Admin completo | `ALL` | `auth.role() = 'authenticated'` |

### leads
| Política | Operação | Condição |
|----------|----------|----------|
| Insert público | `INSERT` | `true` (qualquer visitante pode submeter) |
| Admin completo | `ALL` | `auth.role() = 'authenticated'` |

### company_settings
| Política | Operação | Condição |
|----------|----------|----------|
| Leitura pública | `SELECT` | `true` |
| Admin completo | `ALL` | `auth.role() = 'authenticated'` |

---

## SQL Completo para Criação

```sql
-- ============================================================
-- 1. COMPANY SETTINGS
-- ============================================================
CREATE TABLE company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL DEFAULT 'Instituto Plenum Brasil',
  address TEXT,
  phones JSONB DEFAULT '[]',
  emails JSONB DEFAULT '[]',
  website TEXT,
  cancellation_policy TEXT,
  payment_info JSONB DEFAULT '{}',
  logo_url TEXT,
  logo_dark_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 2. INSTRUCTORS (cadastro de professores)
-- ============================================================
CREATE TABLE instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  photo_url TEXT,
  social_links JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 3. DESIGN SYSTEMS (temas visuais reutilizáveis)
-- ============================================================
CREATE TABLE design_systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,

  -- Cores: Destaque (Accent)
  color_primary TEXT NOT NULL DEFAULT '#3b82f6',
  color_primary_hover TEXT NOT NULL DEFAULT '#60a5fa',
  color_primary_light TEXT NOT NULL DEFAULT '#5b9cf6',

  -- Cores: Backgrounds
  color_background TEXT NOT NULL DEFAULT '#030d1f',
  color_background_alt TEXT NOT NULL DEFAULT '#020617',
  color_background_deep TEXT NOT NULL DEFAULT '#010814',
  color_surface TEXT NOT NULL DEFAULT '#0b1a30',
  color_surface_alt TEXT NOT NULL DEFAULT '#0a1628',

  -- Cores: Accent Alternativo
  color_accent TEXT DEFAULT '#e1ff69',
  color_whatsapp TEXT DEFAULT '#25D366',

  -- Cores: Hero Gradient
  color_hero_gradient_mid TEXT NOT NULL DEFAULT '#062060',

  -- Cores: Shaders WebGL
  shader_colors JSONB DEFAULT '{"colorbends":["#007bff","#4097bf"],"grainient":["#030d1f","#378bae","#030d1f"],"glowing_effect":["#5b9cf6","#4aaee0","#2979e8","#60b8f5"]}',

  -- Cores: Program accordion card
  color_program_card JSONB DEFAULT '{"gradient_from":"#0d2854","gradient_to":"#091a38","border":"#1e4a8a","opacity":0.7}',

  -- Fontes
  font_heading TEXT NOT NULL DEFAULT 'PPRadioGrotesk',
  font_body TEXT NOT NULL DEFAULT 'Satoshi',
  font_heading_weights JSONB DEFAULT '[400, 700]',
  font_body_weights JSONB DEFAULT '[400, 500, 700, 900]',
  font_heading_urls JSONB DEFAULT '[]',
  font_body_urls JSONB DEFAULT '[]',

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Garantir que só exista um tema padrão por vez
CREATE UNIQUE INDEX idx_design_systems_default
  ON design_systems (is_default) WHERE is_default = true;

-- ============================================================
-- 4. COURSES (template da página)
-- ============================================================
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  modality TEXT NOT NULL DEFAULT 'presencial'
    CHECK (modality IN ('presencial', 'online', 'hibrido')),
  design_system_id UUID REFERENCES design_systems(id) ON DELETE SET NULL,

  -- Hero
  title TEXT NOT NULL,
  subtitle TEXT,
  category_label TEXT,
  title_parts JSONB,
  hero_badges JSONB DEFAULT '[]',

  -- Sobre
  about_heading TEXT,
  about_subheading TEXT,
  about_description TEXT,
  about_cards JSONB DEFAULT '[]',

  -- Público-alvo
  audience_heading TEXT,
  audience_cards JSONB DEFAULT '[]',
  audience_images JSONB DEFAULT '[]',

  -- Programação (labels da seção; program_days fica em course_dates)
  program_heading TEXT DEFAULT 'Programação',
  program_description TEXT,

  -- Investimento
  investment_heading TEXT DEFAULT 'Garanta sua Vaga',
  investment_subtitle TEXT,
  included_items JSONB DEFAULT '[]',
  background_image_url TEXT,

  -- Depoimentos
  testimonials JSONB DEFAULT '[]',

  -- Logos parceiros
  partner_logos JSONB DEFAULT '[]',

  -- Localização: movido para course_dates (cada turma tem seu local)

  -- WhatsApp
  whatsapp_number TEXT,
  whatsapp_message TEXT,

  -- PDF
  folder_pdf_url TEXT,

  -- Mídia / Hero Frames
  hero_frames_path TEXT,
  hero_frame_count INTEGER,
  hero_frame_ext TEXT DEFAULT '.jpg',
  section_backgrounds JSONB DEFAULT '{}',

  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 5. COURSE_DATES (turmas: curso + data + professor)
-- ============================================================
CREATE TABLE course_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES instructors(id) ON DELETE RESTRICT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  label TEXT,
  location_venue TEXT,
  location_address TEXT,
  location_map_embed TEXT,
  location_extra JSONB DEFAULT '[]',
  program_days JSONB DEFAULT '[]',
  max_students INTEGER,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'closed', 'cancelled')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 6. LEADS
-- ============================================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  course_date_id UUID REFERENCES course_dates(id) ON DELETE SET NULL,
  form_type TEXT NOT NULL
    CHECK (form_type IN ('folder', 'in_company', 'notification')),
  nome TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT,
  estado TEXT,
  cidade TEXT,
  orgao TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 7. INDEXES
-- ============================================================
-- design_systems: unique default já criado acima (idx_design_systems_default)
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_design_system ON courses(design_system_id);
CREATE INDEX idx_course_dates_course ON course_dates(course_id);
CREATE INDEX idx_course_dates_instructor ON course_dates(instructor_id);
CREATE INDEX idx_course_dates_start ON course_dates(start_date);
CREATE INDEX idx_course_dates_status ON course_dates(status);
CREATE INDEX idx_instructors_status ON instructors(status);
CREATE INDEX idx_leads_course ON leads(course_id);
CREATE INDEX idx_leads_course_date ON leads(course_date_id);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

-- ============================================================
-- 8. ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE design_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- Design Systems
CREATE POLICY "Public can read design systems"
  ON design_systems FOR SELECT
  USING (true);

CREATE POLICY "Admins full access design systems"
  ON design_systems FOR ALL
  USING (auth.role() = 'authenticated');

-- Courses
CREATE POLICY "Public can read published courses"
  ON courses FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins full access courses"
  ON courses FOR ALL
  USING (auth.role() = 'authenticated');

-- Instructors
CREATE POLICY "Public can read active instructors"
  ON instructors FOR SELECT
  USING (status = 'active');

CREATE POLICY "Admins full access instructors"
  ON instructors FOR ALL
  USING (auth.role() = 'authenticated');

-- Course Dates
CREATE POLICY "Public can read open course dates"
  ON course_dates FOR SELECT
  USING (status = 'open');

CREATE POLICY "Admins full access course dates"
  ON course_dates FOR ALL
  USING (auth.role() = 'authenticated');

-- Leads
CREATE POLICY "Public can insert leads"
  ON leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins full access leads"
  ON leads FOR ALL
  USING (auth.role() = 'authenticated');

-- Company Settings
CREATE POLICY "Public can read settings"
  ON company_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins full access settings"
  ON company_settings FOR ALL
  USING (auth.role() = 'authenticated');
```

---

## Queries Úteis

### Buscar curso completo com design system, turmas, professores, programação e local
```sql
SELECT
  c.*,
  -- Design System (tema visual)
  row_to_json(ds.*) AS design_system,
  json_agg(
    json_build_object(
      'id', cd.id,
      'start_date', cd.start_date,
      'end_date', cd.end_date,
      'label', cd.label,
      'location_venue', cd.location_venue,
      'location_address', cd.location_address,
      'location_map_embed', cd.location_map_embed,
      'location_extra', cd.location_extra,
      'program_days', cd.program_days,
      'max_students', cd.max_students,
      'status', cd.status,
      'instructor', json_build_object(
        'id', i.id,
        'name', i.name,
        'role', i.role,
        'bio', i.bio,
        'photo_url', i.photo_url,
        'social_links', i.social_links
      )
    ) ORDER BY cd.sort_order, cd.start_date
  ) AS dates
FROM courses c
LEFT JOIN design_systems ds ON ds.id = c.design_system_id
LEFT JOIN course_dates cd ON cd.course_id = c.id AND cd.status = 'open'
LEFT JOIN instructors i ON i.id = cd.instructor_id
WHERE c.slug = 'emendas-parlamentares-2026'
  AND c.status = 'published'
GROUP BY c.id, ds.id;
```

### Listar próximas turmas abertas (todas)
```sql
SELECT
  cd.*,
  c.title AS course_title,
  c.slug AS course_slug,
  i.name AS instructor_name
FROM course_dates cd
JOIN courses c ON c.id = cd.course_id AND c.status = 'published'
JOIN instructors i ON i.id = cd.instructor_id
WHERE cd.status = 'open'
  AND cd.start_date >= now()
ORDER BY cd.start_date;
```

### Listar cursos de um professor
```sql
SELECT DISTINCT
  c.title,
  c.slug,
  cd.label,
  cd.start_date
FROM course_dates cd
JOIN courses c ON c.id = cd.course_id AND c.status = 'published'
WHERE cd.instructor_id = 'xxx-instructor-uuid'
  AND cd.status = 'open'
ORDER BY cd.start_date;
```

### Contar leads por curso e turma
```sql
SELECT
  c.title,
  cd.label AS turma,
  l.form_type,
  COUNT(*) AS total
FROM leads l
LEFT JOIN courses c ON c.id = l.course_id
LEFT JOIN course_dates cd ON cd.id = l.course_date_id
GROUP BY c.title, cd.label, l.form_type
ORDER BY total DESC;
```

---

## Supabase Storage (Buckets)

| Bucket | Acesso | Conteúdo |
|--------|--------|----------|
| `courses` | Público (leitura) | Thumbnails, backgrounds, logos, vídeos por curso |
| `instructors` | Público (leitura) | Fotos dos professores |
| `pdfs` | Público (leitura) | PDFs de folder gerados automaticamente |
| `frames` | Público (leitura) | Sequências de frames para animação do hero |
| `fonts` | Público (leitura) | Arquivos de fontes customizadas (woff2, otf) |

### Estrutura de pastas no Storage
```
instructors/
  daniel-angotti.png
  outro-professor.png

courses/
  {courseId}/
    thumbnails/
      depoimento-maria.png
    backgrounds/
      bgvg.png
      fundodepo.png
    logos/
      orgao1.png
      orgao2.png
    videos/
      depoimento-joao.mp4

pdfs/
  {courseId}/
    folder.pdf

fonts/
  PPRadioGrotesk-Regular.woff2
  Satoshi-Regular.otf
  Satoshi-Medium.otf
  Satoshi-Bold.otf
  Satoshi-Black.otf

frames/
  {courseId}/
    frame_0001.jpg
    frame_0002.jpg
    ...
    frame_0192.jpg
```

> **Nota:** Fotos de instrutores ficam no bucket `instructors/` (separado de cursos) porque o mesmo professor pode ser usado em múltiplos cursos.

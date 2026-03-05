# Plano de Implementacao — Sistema Multi-Agentes
# Gerador Dinamico de Paginas de Cursos

> Versao: 1.0
> Data: 2026-03-03
> Arquiteto: Claude (Opus)

---

## Indice

1. [Visao Geral da Arquitetura](#1-visao-geral-da-arquitetura)
2. [Regra de Ouro](#2-regra-de-ouro)
3. [Time de Agentes](#3-time-de-agentes)
4. [Mapa de Dependencias](#4-mapa-de-dependencias)
5. [Fases de Execucao](#5-fases-de-execucao)
6. [Detalhamento por Agente](#6-detalhamento-por-agente)
7. [Checklist de Validacao](#7-checklist-de-validacao)
8. [Glossario de Arquivos](#8-glossario-de-arquivos)

---

## 1. Visao Geral da Arquitetura

### Antes (Atual)
```
app/page.tsx ──> [Header, Hero, About, ..., Footer]  (tudo hardcoded)
```

### Depois (Novo)
```
app/page.tsx ──> INTOCADO (template estatico original)

app/cursos/[slug]/page.tsx ──> Server Component
    │
    ├── Busca curso + design_system + turmas do Supabase
    ├── Injeta CSS Custom Properties (design system)
    └── Renderiza componentes com PROPS dinamicas
         │
         ├── components/dynamic/Header.tsx     (recebe props)
         ├── components/dynamic/Hero.tsx       (recebe props)
         ├── components/dynamic/About.tsx      (recebe props)
         ├── ...todos os 12 componentes...
         └── components/dynamic/Footer.tsx     (recebe props)

app/admin/** ──> Painel administrativo (protegido por auth)
    │
    ├── /admin/login
    ├── /admin (dashboard)
    ├── /admin/cursos/novo
    ├── /admin/cursos/[id]
    ├── /admin/instrutores
    ├── /admin/design-systems
    ├── /admin/leads
    └── /admin/configuracoes
```

### Stack Completa

| Camada | Tecnologia | Status |
|--------|-----------|--------|
| Frontend | Next.js 15.4 + React 19 + TS 5.9 | Existente |
| Styling | Tailwind CSS v4 + shadcn/ui | Existente |
| Animacoes | GSAP + Framer Motion + Three.js + OGL | Existente (intocado) |
| Backend | Supabase (PostgreSQL + Auth + Storage) | Novo |
| PDF | @react-pdf/renderer | Novo |
| Video | ffmpeg-static (ja instalado) | Existente |

---

## 2. Regra de Ouro

> **NENHUM arquivo existente sera modificado.**
>
> A pagina atual (`app/page.tsx` e todos os `components/*.tsx`) permanece 100% intacta como template estatico de referencia.
>
> Todos os componentes dinamicos serao **copias refatoradas** em `components/dynamic/`, recebendo dados via props em vez de hardcoded.

Isso garante:
- Zero risco de quebrar o site atual
- O site original funciona como "preview" para o time de design
- Rollback instantaneo (basta remover a pasta `dynamic/`)
- Comparacao lado a lado durante desenvolvimento

---

## 3. Time de Agentes

### Diagrama Organizacional

```
                    ┌─────────────────────────┐
                    │   AGENTE ORQUESTRADOR    │
                    │   (Maestro)              │
                    │                          │
                    │   Responsabilidades:      │
                    │   - Coordena execucao    │
                    │   - Valida entregas      │
                    │   - Resolve conflitos    │
                    │   - Roda testes finais   │
                    └────────────┬────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
    ╔═══════════╗          ╔═══════════╗          ╔═══════════╗
    ║  FASE 1   ║          ║  FASE 2   ║          ║  FASE 3   ║
    ║ Fundacao  ║          ║ Dinamico  ║          ║  Admin    ║
    ╚═══════════╝          ╚═══════════╝          ╚═══════════╝
          │                      │                      │
    ┌─────┴─────┐          ┌─────┴─────┐          ┌─────┴─────┐
    │           │          │           │          │           │
 [AG-01]    [AG-02]    [AG-03]    [AG-04]    [AG-05]    [AG-06]
 Database   Types &    Dynamic    Dynamic    Admin      Admin
 Engineer   Infra      Pages     Components  Auth &     Forms &
                                             Layout     CRUD
                                                │
                                           ┌────┴────┐
                                           │         │
                                        [AG-07]   [AG-08]
                                        PDF Gen   Seed &
                                                  Migration
```

### Catalogo de Agentes

| ID | Nome | Responsabilidade | Depende de |
|----|------|-----------------|------------|
| **AG-00** | **Maestro (Orquestrador)** | Coordena tudo, valida entregas, resolve conflitos, testes E2E | — |
| **AG-01** | **Database Engineer** | Cria tabelas, RLS, indexes, storage buckets no Supabase | — |
| **AG-02** | **Types & Infra** | TypeScript types, Supabase clients, middleware, env, dependencias | AG-01 |
| **AG-03** | **Dynamic Pages** | Rota `app/cursos/[slug]/page.tsx`, APIs, ISR, SEO | AG-02 |
| **AG-04** | **Dynamic Components** | Copia e refatora os 12 componentes para `components/dynamic/` | AG-02 |
| **AG-05** | **Admin Auth & Layout** | Login, sidebar, layout protegido, navegacao | AG-02 |
| **AG-06** | **Admin Forms & CRUD** | Formularios de curso, instrutor, design system, leads | AG-05 |
| **AG-07** | **PDF Generator** | Template React PDF, API route, integracao com admin | AG-02 |
| **AG-08** | **Seed & Migration** | Extrai dados hardcoded atuais e insere como primeiro curso | AG-01, AG-02 |

---

## 4. Mapa de Dependencias

```
FASE 1: Fundacao (paralelo)
═══════════════════════════
  AG-01 ─────────────────────────┐
  (Database)                     │
                                 ├──> Checkpoint 1: "Banco pronto"
  AG-02 ─────────────────────────┘
  (Types & Infra)    depende de AG-01

FASE 2: Core Dinamico (paralelo apos Fase 1)
══════════════════════════════════════════════
  AG-03 ─────────────────────────┐
  (Dynamic Pages)                │
                                 ├──> Checkpoint 2: "Pagina dinamica funciona"
  AG-04 ─────────────────────────┘
  (Dynamic Components)

FASE 3: Admin + Extras (paralelo apos Fase 1)
══════════════════════════════════════════════
  AG-05 ──> AG-06 ───────────────┐
  (Auth)    (CRUD)               │
                                 ├──> Checkpoint 3: "Admin funciona"
  AG-07 ─────────────────────────┘
  (PDF)

FASE 4: Finalizacao (sequencial)
════════════════════════════════
  AG-08 ──> AG-00
  (Seed)    (Validacao Final)
            └──> Checkpoint 4: "Sistema completo"
```

> **Nota:** Fases 2 e 3 podem rodar em PARALELO pois sao independentes.

---

## 5. Fases de Execucao

### FASE 0 — Pre-requisitos (Manual)
- [x] Criar projeto no Supabase
- [x] Obter credenciais (URL, anon key, service key)
- [x] Configurar `.env.local`
- [x] Documentar schema (`DATABASE_SCHEMA.md`)
- [ ] Aprovar este plano de implementacao

---

### FASE 1 — Fundacao

#### Etapa 1.1: AG-01 (Database Engineer)
**Objetivo:** Banco de dados 100% funcional no Supabase.

**Tarefas:**
1. Executar SQL de criacao das 6 tabelas:
   - `company_settings`
   - `design_systems`
   - `instructors`
   - `courses`
   - `course_dates`
   - `leads`
2. Criar todos os indexes
3. Configurar Row Level Security (RLS) para todas as tabelas
4. Criar Storage buckets:
   - `courses` (publico)
   - `instructors` (publico)
   - `pdfs` (publico)
   - `frames` (publico)
   - `fonts` (publico)
5. Configurar politicas de acesso dos buckets
6. Criar usuario admin no Supabase Auth (email/senha)
7. Inserir registro inicial em `company_settings`
8. Inserir design system padrao ("Azul Institucional")

**Entregaveis:**
- Todas as tabelas criadas e acessiveis
- RLS ativo e testado
- Buckets configurados
- 1 usuario admin criado
- 1 company_settings populado
- 1 design_system padrao inserido

**Validacao:**
```sql
-- Deve retornar 6 tabelas
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Deve retornar o design system padrao
SELECT name, color_primary FROM design_systems WHERE is_default = true;
```

---

#### Etapa 1.2: AG-02 (Types & Infra)
**Objetivo:** Infraestrutura TypeScript + Supabase clients prontos.

**Depende de:** AG-01 (precisa conhecer o schema final)

**Tarefas:**
1. Instalar dependencias:
   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   ```
2. Criar types completos:
   ```
   types/
   ├── course.ts         # Course, CourseDate, Instructor, DesignSystem, etc.
   ├── company.ts        # CompanySettings
   ├── lead.ts           # Lead
   └── database.ts       # Database types gerados (Supabase CLI ou manual)
   ```
3. Criar Supabase clients:
   ```
   lib/supabase/
   ├── client.ts         # createBrowserClient (para forms, admin client-side)
   └── server.ts         # createServerClient (para SSR, API routes)
   ```
4. Criar utility de icones:
   ```
   lib/icon-map.ts       # Mapeia string "ShieldCheck" -> componente Lucide
   ```
5. Criar middleware de autenticacao:
   ```
   middleware.ts          # Protege /admin/* (exceto /admin/login)
   ```
6. Atualizar `next.config.ts`:
   - Adicionar dominio Supabase em `remotePatterns`
7. Criar utilitario de design system:
   ```
   lib/design-system.ts  # Funcao que gera CSS vars a partir do DesignSystem
   ```

**Entregaveis:**
- Todos os types compilando (`npx tsc --noEmit` sem erros)
- Clients de Supabase funcionais
- Middleware protegendo `/admin/*`
- icon-map com todos os icones usados
- Funcao `generateCSSVars(ds: DesignSystem)` → string de CSS

**Validacao:**
```bash
npx tsc --noEmit  # Zero erros
```

---

### FASE 2 — Core Dinamico

#### Etapa 2.1: AG-04 (Dynamic Components)
**Objetivo:** Criar versoes dinamicas dos 12 componentes em `components/dynamic/`.

**Depende de:** AG-02 (types prontos)

**Regras:**
1. **Copiar** cada componente de `components/` para `components/dynamic/`
2. **Adicionar interface de Props** com todos os dados que antes eram hardcoded
3. **Substituir valores hardcoded** por props
4. **Substituir cores hardcoded** por CSS Custom Properties (`var(--ds-primary)`, etc.)
5. **Manter TODAS as animacoes** (GSAP, Motion, Three.js, OGL) intactas
6. **Defaults opcionais** — se uma prop nao for passada, usa o valor original

**Ordem de refatoracao (menor → maior complexidade):**

| # | Componente Original | Componente Dinamico | Complexidade | Props principais |
|---|--------------------|--------------------|-------------|-----------------|
| 1 | `Stats.tsx` | `dynamic/Stats.tsx` | Baixa | `logos[]`, `heading` |
| 2 | `WorkloadPayment.tsx` | `dynamic/WorkloadPayment.tsx` | Baixa | `items[]`, `heading`, `whatsapp` |
| 3 | `About.tsx` | `dynamic/About.tsx` | Baixa | `cards[]`, `heading`, `subheading` |
| 4 | `Footer.tsx` | `dynamic/Footer.tsx` | Baixa | `company`, `designSystem` |
| 5 | `TargetAudience.tsx` | `dynamic/TargetAudience.tsx` | Media | `cards[]`, `images[]`, `heading` |
| 6 | `Program.tsx` | `dynamic/Program.tsx` | Media | `days[]`, `heading`, `description`, `shaderColors` |
| 7 | `Teachers.tsx` | `dynamic/Teachers.tsx` | Media | `instructor` (objeto completo) |
| 8 | `Location.tsx` | `dynamic/Location.tsx` | Media | `venue`, `address`, `mapEmbed`, `phones[]` |
| 9 | `FolderForm.tsx` | `dynamic/FolderForm.tsx` | Media | `courseId`, `pdfUrl`, `courseName` |
| 10 | `SocialProof.tsx` | `dynamic/SocialProof.tsx` | Alta | `videos[]`, `company`, `paymentInfo`, `shaderColors` |
| 11 | `Header.tsx` | `dynamic/Header.tsx` | Media | `navItems[]`, `logoUrl`, `ctaText` |
| 12 | `Hero.tsx` | `dynamic/Hero.tsx` | Alta | `title`, `titleParts[]`, `turmas[]`, `badges[]`, `framesConfig` |

**Entregaveis:**
- 12 componentes em `components/dynamic/`
- Cada um com interface de Props tipada
- Todas as animacoes funcionando
- Cores via CSS Custom Properties

**Validacao:**
```bash
npx tsc --noEmit  # Zero erros nos componentes dynamic/
```

---

#### Etapa 2.2: AG-03 (Dynamic Pages)
**Objetivo:** Rota dinamica + APIs + SEO.

**Depende de:** AG-02 (clients), AG-04 (componentes dinamicos)

**Tarefas:**

1. **Criar rota dinamica:**
   ```
   app/cursos/[slug]/page.tsx      # Server Component principal
   app/cursos/[slug]/layout.tsx    # Layout com CSS vars do design system
   ```

   ```typescript
   // app/cursos/[slug]/page.tsx (pseudo-codigo)
   export default async function CoursePage({ params }) {
     const { slug } = await params;

     // 1. Busca curso + design system + turmas + company
     const course = await getCourseBySlug(slug);
     const designSystem = await getDesignSystem(course.design_system_id);
     const company = await getCompanySettings();
     const turmas = await getCourseDates(course.id);

     // 2. Renderiza componentes com props
     return (
       <>
         <DesignSystemProvider designSystem={designSystem}>
           <DynamicHeader ... />
           <DynamicHero course={course} turmas={turmas} />
           <DynamicAbout cards={course.about_cards} ... />
           <DynamicProgram turmas={turmas} ... />
           <DynamicTeachers turmas={turmas} />
           ...
           <DynamicFooter company={company} />
         </DesignSystemProvider>
       </>
     );
   }
   ```

2. **ISR (Incremental Static Regeneration):**
   ```typescript
   export const revalidate = 3600; // 1 hora

   export async function generateStaticParams() {
     // Pre-gera paginas de cursos publicados
     const courses = await getPublishedCourses();
     return courses.map(c => ({ slug: c.slug }));
   }
   ```

3. **SEO dinamico:**
   ```typescript
   export async function generateMetadata({ params }) {
     const course = await getCourseBySlug(params.slug);
     return {
       title: course.meta_title || course.title,
       description: course.meta_description || course.subtitle,
       openGraph: { images: [course.og_image_url] }
     };
   }
   ```

4. **API Routes:**
   ```
   app/api/leads/route.ts              # POST — salva lead
   app/api/revalidate/route.ts         # POST — revalida pagina (chamado pelo admin)
   app/api/admin/hero-frames/[courseId]/route.ts  # POST — video -> frames
   ```

5. **Design System Provider:**
   ```
   components/dynamic/DesignSystemProvider.tsx
   ```
   Componente que injeta `<style>` com CSS Custom Properties e `@font-face` dinamicos.

6. **Funcoes de data fetching:**
   ```
   lib/queries/
   ├── courses.ts        # getCourseBySlug, getPublishedCourses
   ├── course-dates.ts   # getCourseDates
   ├── company.ts        # getCompanySettings
   └── design-system.ts  # getDesignSystem, getDefaultDesignSystem
   ```

**Entregaveis:**
- Rota `/cursos/[slug]` funcionando com dados do Supabase
- ISR configurado
- SEO dinamico
- API de leads recebendo e salvando
- API de revalidacao
- API de hero frames (video → JPGs)
- DesignSystemProvider injetando CSS vars

**Validacao:**
```
1. Acessar /cursos/emendas-parlamentares → pagina renderiza
2. Todas as animacoes funcionam
3. Formularios submetem leads para o Supabase
4. Mudar design system no banco → cores mudam na pagina
```

---

### FASE 3 — Painel Admin (paralela a Fase 2)

#### Etapa 3.1: AG-05 (Admin Auth & Layout)
**Objetivo:** Estrutura base do admin com autenticacao.

**Depende de:** AG-02 (Supabase clients, middleware)

**Tarefas:**

1. **Login:**
   ```
   app/admin/login/page.tsx    # Formulario email/senha
   ```

2. **Layout protegido:**
   ```
   app/admin/layout.tsx        # Sidebar + topbar + auth check
   ```

3. **Componentes de layout:**
   ```
   components/admin/
   ├── AdminSidebar.tsx        # Navegacao lateral
   ├── AdminTopbar.tsx         # Header com user info + logout
   └── AdminLayout.tsx         # Wrapper com sidebar + content area
   ```

4. **Navegacao do admin:**
   ```
   /admin              → Dashboard (lista de cursos + stats rapidos)
   /admin/cursos       → Lista de cursos
   /admin/cursos/novo  → Criar curso
   /admin/cursos/[id]  → Editar curso
   /admin/instrutores  → CRUD de instrutores
   /admin/design-systems → CRUD de temas visuais
   /admin/leads        → Visualizar leads (filtros)
   /admin/configuracoes → Dados da empresa
   ```

5. **UI:**
   - shadcn/ui (ja configurado)
   - Tema claro para area admin
   - Sidebar colapsavel
   - Breadcrumbs
   - Todo em portugues

**Entregaveis:**
- Login funcional com Supabase Auth
- Layout admin com sidebar e navegacao
- Rotas protegidas (redirect se nao autenticado)
- Dashboard basico com lista de cursos

---

#### Etapa 3.2: AG-06 (Admin Forms & CRUD)
**Objetivo:** Formularios completos para gerenciar todo o conteudo.

**Depende de:** AG-05 (layout admin pronto)

**Tarefas:**

1. **Componentes reutilizaveis:**
   ```
   components/admin/
   ├── JsonArrayEditor.tsx     # Editor generico de arrays JSONB (add/remove/reorder)
   ├── ImageUploader.tsx       # Upload para Supabase Storage com preview
   ├── IconPicker.tsx          # Dropdown de icones Lucide com busca
   ├── ColorPicker.tsx         # Seletor de cor hex com preview
   ├── RichTextEditor.tsx      # Editor de texto (bio, politica, etc.)
   └── StatusBadge.tsx         # Badge visual de status (draft/published/etc.)
   ```

2. **Formulario de Curso (11 abas):**
   ```
   app/admin/cursos/[id]/page.tsx
   components/admin/course-form/
   ├── GeneralTab.tsx          # slug, titulo, modalidade, status, design system
   ├── HeroTab.tsx             # title_parts, badges, upload video/frames
   ├── AboutTab.tsx            # heading, 6 cards (icon picker + texto)
   ├── AudienceTab.tsx         # 4 cards + imagens parallax
   ├── ProgramTab.tsx          # Vinculado as turmas (read-only aqui, edita em turmas)
   ├── DatesTab.tsx            # CRUD de turmas (data, professor, local, programacao)
   ├── InvestmentTab.tsx       # Itens inclusos, heading
   ├── TestimonialsTab.tsx     # Videos com thumbnail upload
   ├── MediaTab.tsx            # Logos parceiros, backgrounds, hero frames
   ├── WhatsAppTab.tsx         # Numero, mensagem
   └── SeoTab.tsx              # Meta title, description, OG image
   ```

3. **CRUD de Instrutores:**
   ```
   app/admin/instrutores/page.tsx        # Lista
   app/admin/instrutores/novo/page.tsx   # Criar
   app/admin/instrutores/[id]/page.tsx   # Editar
   ```

4. **CRUD de Design Systems:**
   ```
   app/admin/design-systems/page.tsx        # Lista com preview visual
   app/admin/design-systems/novo/page.tsx   # Criar (color pickers)
   app/admin/design-systems/[id]/page.tsx   # Editar com preview ao vivo
   ```

5. **Visualizador de Leads:**
   ```
   app/admin/leads/page.tsx    # Tabela com filtros por curso, turma, tipo, data
   ```

6. **Configuracoes da Empresa:**
   ```
   app/admin/configuracoes/page.tsx  # Form unico (company_settings)
   ```

7. **Acoes pos-save:**
   - Ao publicar/editar um curso → chama API de revalidacao
   - Ao gerar folder → chama API de PDF
   - Ao subir video → chama API de hero-frames

**Entregaveis:**
- Formulario completo de curso com 11 abas
- CRUD de instrutores
- CRUD de design systems (com preview de cores)
- Visualizador de leads com filtros
- Editor de configuracoes da empresa
- Upload de imagens funcionando
- Revalidacao automatica pos-edicao

---

#### Etapa 3.3: AG-07 (PDF Generator)
**Objetivo:** Geracao automatica de folder PDF do curso.

**Depende de:** AG-02 (types, Supabase client)

**Tarefas:**

1. Instalar dependencia:
   ```bash
   npm install @react-pdf/renderer
   ```

2. Criar template PDF:
   ```
   components/pdf/CoursePdfTemplate.tsx
   ```
   Conteudo do PDF:
   - Logo da empresa
   - Titulo e subtitulo do curso
   - Programacao completa
   - Dados do instrutor
   - Local e datas
   - Informacoes de investimento
   - Contato e WhatsApp

3. Criar API route:
   ```
   app/api/pdf/[courseId]/route.ts  # GET → gera PDF e salva no Storage
   ```

4. Integrar com admin:
   - Botao "Gerar Folder PDF" na tela de edicao do curso
   - Apos gerar → salva URL em `courses.folder_pdf_url`
   - Lead que baixa folder recebe esse PDF

**Entregaveis:**
- Template PDF profissional
- API que gera e salva no Storage
- Botao no admin para gerar/regenerar
- URL do PDF acessivel publicamente

---

### FASE 4 — Finalizacao

#### Etapa 4.1: AG-08 (Seed & Migration)
**Objetivo:** Popular banco com dados reais do curso atual.

**Depende de:** AG-01 (banco), AG-02 (types)

**Tarefas:**

1. Criar script de seed:
   ```
   scripts/seed.ts
   ```

2. Extrair TODOS os dados hardcoded de cada componente:
   - Hero: titulo, title_parts, badges, turmas
   - About: heading, 6 cards com icones
   - TargetAudience: heading, 4 cards, imagens
   - Program: 4 dias com topicos e sub-topicos
   - Teachers: Daniel Angotti (nome, role, bio, foto, instagram)
   - WorkloadPayment: heading, 5 itens inclusos
   - Location: venue, endereco, map embed
   - SocialProof: 3 videos (thumbnails, IDs)
   - Stats: logos parceiros
   - WhatsApp: numero, mensagem
   - Company: nome, endereco, telefones, politica

3. Inserir no Supabase via script:
   - 1 `company_settings`
   - 1 `design_system` ("Azul Institucional" — marcado como default)
   - 1 `instructor` (Daniel Angotti)
   - 1 `course` (Emendas Parlamentares)
   - 2-3 `course_dates` (turmas de marco, abril, maio)

4. Upload de assets para Storage:
   - Foto do instrutor
   - Thumbnails de depoimentos
   - Logos de parceiros
   - Hero frames (copiar da pasta public/)
   - Backgrounds de secoes

**Entregaveis:**
- Script `seed.ts` executavel
- Banco populado com dados reais
- Storage com todos os assets
- `/cursos/emendas-parlamentares` renderiza identico ao original

---

#### Etapa 4.2: AG-00 (Validacao Final — Maestro)
**Objetivo:** Garantir que tudo funciona perfeitamente.

**Checklist de validacao:**

```
FUNCIONAL
[ ] /cursos/emendas-parlamentares renderiza identico a app/page.tsx atual
[ ] Todas as 12 secoes aparecem corretamente
[ ] Dropdown de turmas funciona (troca professor, programacao, local)
[ ] Formulario de folder envia lead para Supabase
[ ] Formulario in-company envia lead para Supabase
[ ] Botao WhatsApp abre conversa correta
[ ] PDF folder eh gerado e baixa corretamente

ANIMACOES
[ ] Hero: canvas scroll animation (frames) funciona fluido
[ ] About: cards com entrance animation (GSAP)
[ ] TargetAudience: inverse scroll gallery (Motion)
[ ] Program: ColorBends shader (Three.js) renderiza
[ ] Program: accordion abre/fecha suave
[ ] Teachers: scroll-driven photo animation (GSAP)
[ ] SocialProof: Grainient shader (OGL) renderiza
[ ] SocialProof: 3D carousel de videos funciona
[ ] Stats: logo marquee infinito
[ ] Header: glassmorphism + deteccao light/dark

DESIGN SYSTEM
[ ] Trocar color_primary no banco → toda pagina muda de cor
[ ] Trocar font_heading → headings mudam de fonte
[ ] Cores derivadas (opacidades) funcionam corretamente
[ ] Shaders atualizam com novas cores

ADMIN
[ ] Login funciona com email/senha
[ ] Criar novo curso via formulario
[ ] Editar curso existente
[ ] Adicionar/editar instrutor
[ ] Criar novo design system (com preview)
[ ] Visualizar leads com filtros
[ ] Editar dados da empresa
[ ] Upload de imagens funciona
[ ] Upload de video → frames automaticos
[ ] Gerar PDF folder

RESPONSIVO
[ ] Mobile 375px — todas as secoes
[ ] Tablet 768px — layout adaptado
[ ] Desktop 1280px — layout completo
[ ] Desktop 1440px+ — centralizado

SEO
[ ] Meta tags dinamicas por curso
[ ] Open Graph image
[ ] Slug amigavel na URL
[ ] generateStaticParams funciona

PERFORMANCE
[ ] ISR revalida corretamente
[ ] Revalidacao on-demand funciona (admin edita → pagina atualiza)
[ ] Imagens otimizadas via next/image
[ ] Fonts carregam sem FOUT
```

---

## 6. Detalhamento por Agente

### AG-01: Database Engineer

**Arquivos que CRIA:**
```
(nenhum arquivo no projeto — trabalha diretamente no Supabase)
```

**Acoes no Supabase:**
```sql
-- Executa o SQL completo do DATABASE_SCHEMA.md
-- Cria buckets no Storage
-- Cria usuario admin no Auth
-- Insere dados iniciais (company_settings, design_system padrao)
```

**Instrucoes especificas:**
- Usar a service_role_key para operacoes administrativas
- Testar RLS acessando como anon (deve ver apenas published/active/open)
- Testar RLS acessando como authenticated (deve ver tudo)
- Verificar que ON DELETE CASCADE/RESTRICT/SET NULL funciona

---

### AG-02: Types & Infra

**Arquivos que CRIA:**
```
types/
├── course.ts
├── company.ts
├── lead.ts
├── design-system.ts
└── database.ts

lib/
├── supabase/
│   ├── client.ts
│   └── server.ts
├── queries/
│   ├── courses.ts
│   ├── course-dates.ts
│   ├── company.ts
│   └── design-system.ts
├── icon-map.ts
└── design-system.ts

middleware.ts
```

**Arquivos que MODIFICA:**
```
next.config.ts          # Adiciona Supabase em remotePatterns
package.json            # Adiciona @supabase/supabase-js, @supabase/ssr
```

---

### AG-03: Dynamic Pages

**Arquivos que CRIA:**
```
app/
├── cursos/
│   └── [slug]/
│       ├── page.tsx
│       └── layout.tsx
└── api/
    ├── leads/
    │   └── route.ts
    ├── revalidate/
    │   └── route.ts
    └── admin/
        └── hero-frames/
            └── [courseId]/
                └── route.ts

components/dynamic/
└── DesignSystemProvider.tsx
```

---

### AG-04: Dynamic Components

**Arquivos que CRIA:**
```
components/dynamic/
├── Header.tsx
├── Hero.tsx
├── About.tsx
├── TargetAudience.tsx
├── Stats.tsx
├── Program.tsx
├── Teachers.tsx
├── WorkloadPayment.tsx
├── FolderForm.tsx
├── Location.tsx
├── SocialProof.tsx
└── Footer.tsx
```

**Regra critica:** Cada componente:
1. Importa e usa os mesmos sub-componentes de animacao (ColorBends, Grainient, GlowingEffect, etc.)
2. Mantem a mesma estrutura HTML/CSS
3. Troca `#3b82f6` por `var(--ds-primary)`, `#030d1f` por `var(--ds-background)`, etc.
4. Recebe dados via props tipadas
5. Tem defaults que espelham os valores hardcoded originais

---

### AG-05: Admin Auth & Layout

**Arquivos que CRIA:**
```
app/admin/
├── layout.tsx
├── page.tsx                    # Dashboard
└── login/
    └── page.tsx

components/admin/
├── AdminSidebar.tsx
├── AdminTopbar.tsx
└── AdminLayout.tsx
```

---

### AG-06: Admin Forms & CRUD

**Arquivos que CRIA:**
```
app/admin/
├── cursos/
│   ├── page.tsx                # Lista
│   ├── novo/
│   │   └── page.tsx
│   └── [id]/
│       └── page.tsx
├── instrutores/
│   ├── page.tsx
│   ├── novo/
│   │   └── page.tsx
│   └── [id]/
│       └── page.tsx
├── design-systems/
│   ├── page.tsx
│   ├── novo/
│   │   └── page.tsx
│   └── [id]/
│       └── page.tsx
├── leads/
│   └── page.tsx
└── configuracoes/
    └── page.tsx

components/admin/
├── JsonArrayEditor.tsx
├── ImageUploader.tsx
├── IconPicker.tsx
├── ColorPicker.tsx
├── StatusBadge.tsx
└── course-form/
    ├── GeneralTab.tsx
    ├── HeroTab.tsx
    ├── AboutTab.tsx
    ├── AudienceTab.tsx
    ├── DatesTab.tsx
    ├── InvestmentTab.tsx
    ├── TestimonialsTab.tsx
    ├── MediaTab.tsx
    ├── WhatsAppTab.tsx
    └── SeoTab.tsx
```

---

### AG-07: PDF Generator

**Arquivos que CRIA:**
```
components/pdf/
└── CoursePdfTemplate.tsx

app/api/pdf/
└── [courseId]/
    └── route.ts
```

**Arquivos que MODIFICA:**
```
package.json    # Adiciona @react-pdf/renderer
```

---

### AG-08: Seed & Migration

**Arquivos que CRIA:**
```
scripts/
└── seed.ts
```

---

## 7. Checklist de Validacao

### Checkpoint 1: Banco Pronto (apos Fase 1)
```
[ ] 6 tabelas existem no Supabase
[ ] RLS ativo em todas
[ ] Buckets criados (5)
[ ] company_settings com dados
[ ] design_system padrao inserido
[ ] npx tsc --noEmit → zero erros
[ ] Supabase client conecta do browser
[ ] Supabase client conecta do server
[ ] Middleware bloqueia /admin sem auth
```

### Checkpoint 2: Pagina Dinamica (apos Fase 2)
```
[ ] /cursos/emendas-parlamentares renderiza
[ ] Design system aplica cores via CSS vars
[ ] Dropdown de turmas funciona
[ ] Todas animacoes intactas
[ ] Formularios enviam leads
[ ] app/page.tsx original continua funcionando
```

### Checkpoint 3: Admin Funciona (apos Fase 3)
```
[ ] Login/logout funciona
[ ] CRUD curso completo
[ ] CRUD instrutor completo
[ ] CRUD design system com preview
[ ] Upload de imagens
[ ] Upload video → frames
[ ] Gerar PDF
[ ] Visualizar leads
[ ] Editar empresa
```

### Checkpoint 4: Sistema Completo (apos Fase 4)
```
[ ] Seed executado com sucesso
[ ] Pagina dinamica identica a estatica
[ ] Criar novo curso pelo admin → nova URL funciona
[ ] Trocar design system → cores mudam
[ ] Responsivo em 3 breakpoints
[ ] SEO dinamico funcionando
```

---

## 8. Glossario de Arquivos

### Novos arquivos (criados)
```
TOTAL: ~55 arquivos novos

Infraestrutura (8):
  types/course.ts, company.ts, lead.ts, design-system.ts, database.ts
  lib/supabase/client.ts, server.ts
  middleware.ts

Queries & Utils (6):
  lib/queries/courses.ts, course-dates.ts, company.ts, design-system.ts
  lib/icon-map.ts
  lib/design-system.ts

Pagina Dinamica (5):
  app/cursos/[slug]/page.tsx, layout.tsx
  app/api/leads/route.ts
  app/api/revalidate/route.ts
  app/api/admin/hero-frames/[courseId]/route.ts

Componentes Dinamicos (13):
  components/dynamic/DesignSystemProvider.tsx
  components/dynamic/Header.tsx ... Footer.tsx (12 componentes)

Admin - Layout (5):
  app/admin/layout.tsx, page.tsx, login/page.tsx
  components/admin/AdminSidebar.tsx, AdminTopbar.tsx

Admin - Pages (10):
  app/admin/cursos/page.tsx, novo/page.tsx, [id]/page.tsx
  app/admin/instrutores/page.tsx, novo/page.tsx, [id]/page.tsx
  app/admin/design-systems/page.tsx, novo/page.tsx, [id]/page.tsx
  app/admin/leads/page.tsx, configuracoes/page.tsx

Admin - Componentes (16):
  components/admin/JsonArrayEditor.tsx, ImageUploader.tsx,
  IconPicker.tsx, ColorPicker.tsx, StatusBadge.tsx, AdminLayout.tsx
  components/admin/course-form/ (10 tabs)

PDF (2):
  components/pdf/CoursePdfTemplate.tsx
  app/api/pdf/[courseId]/route.ts

Seed (1):
  scripts/seed.ts
```

### Arquivos existentes MODIFICADOS (minimo)
```
next.config.ts     # +remotePatterns do Supabase
package.json       # +3 dependencias (@supabase/supabase-js, @supabase/ssr, @react-pdf/renderer)
```

### Arquivos existentes NAO TOCADOS
```
app/page.tsx               # INTOCADO
app/layout.tsx             # INTOCADO
app/globals.css            # INTOCADO
components/Hero.tsx        # INTOCADO
components/Header.tsx      # INTOCADO
components/About.tsx       # INTOCADO
components/TargetAudience.tsx  # INTOCADO
components/Stats.tsx       # INTOCADO
components/Program.tsx     # INTOCADO
components/Teachers.tsx    # INTOCADO
components/WorkloadPayment.tsx  # INTOCADO
components/FolderForm.tsx  # INTOCADO
components/Location.tsx    # INTOCADO
components/SocialProof.tsx # INTOCADO
components/Footer.tsx      # INTOCADO
components/ColorBends.tsx  # INTOCADO (importado pelos dynamic/)
components/Grainient.tsx   # INTOCADO (importado pelos dynamic/)
components/ui/*            # INTOCADO (importado pelos dynamic/)
lib/utils.ts               # INTOCADO
hooks/use-mobile.ts        # INTOCADO
```

---

## Ordem de Execucao Recomendada

```
SEMANA 1: Fundacao
├── Dia 1-2: AG-01 (Database) + AG-02 (Types & Infra) → Checkpoint 1
│
SEMANA 2-3: Core (paralelo)
├── Dia 3-5: AG-04 (Dynamic Components) — componentes 1-6
├── Dia 6-8: AG-04 (Dynamic Components) — componentes 7-12
├── Dia 5-7: AG-05 (Admin Auth & Layout)
├── Dia 8-10: AG-03 (Dynamic Pages) → Checkpoint 2
│
SEMANA 3-4: Admin + Extras (paralelo)
├── Dia 11-15: AG-06 (Admin Forms) — formularios
├── Dia 11-12: AG-07 (PDF Generator)
├── Dia 13-14: AG-08 (Seed & Migration)
│
SEMANA 4: Finalizacao
├── Dia 15-16: AG-00 (Validacao Final) → Checkpoint 3 + 4
└── Dia 17: Ajustes finais e deploy
```

---

> **Proximo passo:** Aprovar este plano e comecar a Fase 1 (AG-01 + AG-02).

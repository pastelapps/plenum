# 🛠️ AGENTE 04 — ADMIN
## Plenum 2026 | Especialista: Painel Administrativo + CMS

---

## IDENTIDADE

Você é o **Admin UI Engineer do projeto Plenum**. Sua responsabilidade é construir o painel administrativo interno: todas as telas de gestão, formulários, dashboards e ferramentas de CMS.

**Você não constrói páginas públicas. Você não mexe em API Routes.**
Você consome os endpoints `/api/admin/*` e entrega uma interface interna funcional, clara e eficiente para a equipe da Plenum operar o site sem conhecimento técnico.

**Princípio de design do painel:** funcional antes de bonito. Clareza antes de estética. O admin não precisa ser impressionante — precisa ser óbvio.

---

## SEUS ENTREGÁVEIS

```
/app/(admin)/
  layout.tsx                   ← Sidebar + top bar + auth guard
  /login/
    page.tsx                   ← Tela de login
  /dashboard/
    page.tsx                   ← Visão geral + métricas
  /professors/
    page.tsx                   ← Lista de professores
    /new/page.tsx
    /[id]/page.tsx
  /courses/
    page.tsx                   ← Lista de cursos
    /new/page.tsx
    /[id]/page.tsx             ← Editar curso + gerenciar turmas
  /events/
    page.tsx
    /new/page.tsx
    /[id]/page.tsx
  /blog/
    page.tsx
    /new/page.tsx
    /[id]/page.tsx
  /leads/
    page.tsx                   ← Leads centralizados + export
  /social-proof/
    page.tsx                   ← Contadores, logos, depoimentos
  /settings/
    page.tsx

/components/admin/
  Sidebar.tsx
  TopBar.tsx
  ProfessorForm.tsx
  CourseForm.tsx
  TurmaForm.tsx
  TurmaList.tsx                ← Lista de turmas dentro do curso
  EventForm.tsx
  BlogEditor.tsx               ← TipTap
  LeadsTable.tsx
  MetricsCard.tsx
  DashboardChart.tsx
  SortableList.tsx             ← Drag-and-drop para reordenar
  StatusBadge.tsx
  ToggleFeatured.tsx           ← Toggle inline "Destaque"
  ImageUpload.tsx              ← Uploadthing wrapper
  ColorPicker.tsx              ← Para themeColor do curso
  ConfirmDialog.tsx            ← Modal de confirmação antes de deletar
```

---

## LAYOUT DO PAINEL

```tsx
// Sidebar (lateral esquerda, fixa)
// Largura: 256px desktop, collapsível no tablet, offcanvas no mobile

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Users, label: 'Professores', href: '/admin/professors' },
  { icon: BookOpen, label: 'Cursos', href: '/admin/courses' },
  { icon: Calendar, label: 'Eventos', href: '/admin/events' },
  { icon: FileText, label: 'Blog', href: '/admin/blog' },
  { icon: UserPlus, label: 'Leads', href: '/admin/leads' },
  { icon: Star, label: 'Prova Social', href: '/admin/social-proof' },
  { icon: Settings, label: 'Configurações', href: '/admin/settings' },
]

// TopBar
// - Título da página atual
// - Nome do usuário logado + avatar inicial
// - Botão "Ver site" (abre em nova aba)
// - Botão logout
```

---

## TELA DE CURSOS — `/admin/courses/[id]`

Esta é a tela mais complexa do admin. Deve ter duas seções:

### Seção 1: Dados do Curso (conteúdo fixo)
```
Tabs dentro da página:
[Informações Gerais] [Conteúdo] [Visual] [Follow-up]

Tab "Informações Gerais":
- title
- slug (auto-gerado, editável)
- subtitle
- professor (select com foto preview)
- category (select com cor preview)
- targetPublic (multi-select com chips)
- workload
- featured (toggle)
- active (toggle)
- order (número)

Tab "Conteúdo":
- description (textarea grande)
- objectives (lista dinâmica — botão "Adicionar objetivo")
- highlights (lista dinâmica — botão "Adicionar diferencial")
- curriculum (editor de módulos/tópicos):
    [+ Adicionar Módulo]
    Módulo 1: [nome do módulo]
      Tópico 1: [texto] [×]
      Tópico 2: [texto] [×]
      [+ Adicionar tópico]

Tab "Visual":
- coverImageUrl (upload + preview)
- themeColor (color picker + preview da cor)
- folderUrl (upload PDF do folder ou link)

Tab "Follow-up":
- followUpMessage (textarea)
- Preview do e-mail que será enviado
- Variáveis disponíveis: {nome}, {curso}, {data}, {cidade}
```

### Seção 2: Turmas (ocorrências)
```
Título: "Turmas de [nome do curso]"
Subtítulo: "X turmas abertas | Y encerradas"

Lista de turmas (tabela):
Colunas: Data | Cidade | Modalidade | Status | Vagas | Leads | Ações

Ações por turma:
- ✏️ Editar (abre form lateral/modal)
- 📋 Duplicar (cria nova turma, abre form com dados preenchidos exceto data)
- 📊 Métricas (abre painel com views, downloads, leads desta turma)
- 🗑️ Arquivar

Botão principal: [+ Nova Turma]

Form de turma (modal ou slide-over):
- startDate (date picker com horário)
- endDate (date picker, opcional)
- city + state
- location (campo livre)
- modality (radio: Presencial | Híbrido | Online)
- maxSeats (número, opcional)
- price (decimal, opcional)
- priceLabel (campo livre)
- registrationUrl (URL)
- status (select)
- featured (toggle — aparece na home como destaque)
```

---

## DUPLICAR TURMA — COMPORTAMENTO ESPERADO

```
Usuário clica em "Duplicar" numa turma:
1. Modal abre com apenas 2 campos:
   - Nova data de início (required)
   - Nova data de término (opcional)
2. Todos os outros dados são copiados da turma original
3. Status é resetado para "open"
4. Ao confirmar: nova turma criada, lista atualizada
5. Toast de confirmação: "Turma duplicada! Clique para editar."
```

---

## DASHBOARD DE LEADS — `/admin/leads`

```
Filtros (topo da página):
- Curso: select (todos os cursos)
- Turma: select (filtrado pelo curso selecionado)
- Período: date range picker
- Fonte: select (folder_download | newsletter | cta | evento)

Tabela:
Colunas: Nome | E-mail | Telefone | Curso | Turma | Data | Fonte

Paginação: 50 por página

Ações:
- Botão "Exportar CSV" (aplica os filtros ativos)
- Botão "Exportar todos"
```

---

## TELA DE BLOG — `/admin/blog/[id]`

```tsx
// Layout: 2/3 editor + 1/3 sidebar de configurações

// Editor (TipTap):
// - Bold, Italic, Headings (H2, H3)
// - Listas (bullet + numbered)
// - Links
// - Imagem (via Uploadthing)
// - Blockquote

// Sidebar de configurações:
// - Status: Rascunho | Publicado | Agendado
// - publishedAt (date picker — aparece quando Publicado)
// - scheduledAt (date picker — aparece quando Agendado)
// - category (input com sugestões)
// - tags (input com chips)
// - imageUrl (upload capa)
// - excerpt (textarea, max 200 chars)
// - metaTitle (input, max 60 chars)
// - metaDesc (textarea, max 160 chars)
// - courseId (opcional — vincular ao curso)

// Botões fixos no bottom:
// [Salvar rascunho] [Publicar agora] [Ver preview]
```

---

## COMPONENTES REUTILIZÁVEIS DO ADMIN

### ToggleFeatured
```tsx
// Toggle inline na lista de cursos/eventos
// Clique → PATCH /api/admin/courses/[id] { featured: !current }
// Loading state no próprio toggle (não bloqueia a linha toda)
// Toast de confirmação
```

### SortableList (drag-and-drop)
```tsx
// Usado em: cursos, eventos, logos, depoimentos
// Biblioteca: @dnd-kit/core + @dnd-kit/sortable
// Ao soltar: PATCH /api/admin/[entity]/reorder { ids: string[] }
```

### ImageUpload
```tsx
// Wrapper do Uploadthing
// Exibe: área de drop + preview da imagem atual
// Após upload: salva URL no campo correto via react-hook-form
```

---

## CHECKLIST DE ENTREGA

```
- [ ] Todas as rotas /admin/* redirecionam para login se não autenticado
- [ ] CRUD de professores funcionando (criar, editar, desativar)
- [ ] CRUD de cursos com as 4 tabs de configuração
- [ ] Turmas: listar, criar, editar, duplicar dentro do curso
- [ ] Duplicar turma: só pede nova data, copia o resto
- [ ] Toggle "Destaque" funcionando inline sem recarregar página
- [ ] Leads: filtros + paginação + export CSV
- [ ] Blog: editor TipTap + configurações laterais
- [ ] Drag-and-drop de ordenação funcionando
- [ ] Toasts de confirmação em todas as ações
- [ ] ConfirmDialog antes de deletar qualquer item
- [ ] MASTER notificado com telas entregues
```

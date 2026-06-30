# 🎨 PLENUM — GUIA DE DESIGN VISUAL
## Inspirado em humanacademy.ai | Adaptado para o universo do setor público

> Este documento define a **linguagem visual completa** do site Plenum 2026.
> O desenvolvedor deve consultar este arquivo antes de criar qualquer componente.
> A referência é o humanacademy.ai — dark, premium, glassmorphism, gradientes vibrantes — traduzido para a autoridade e seriedade do setor público.

---

## 1. FILOSOFIA VISUAL

A Human Academy usa uma linguagem que comunica: **moderno, confiável, exclusivo**.
Para a Plenum, a tradução é: **autoridade institucional com modernidade premium**.

| Human Academy | Plenum (adaptação) |
|---|---|
| Roxo/violeta vibrante | Dourado `#C9A227` + azul institucional `#1e3a5f` |
| Criatividade, arte, IA | Liderança, resultado, transformação pública |
| Público: criativos e designers | Público: gestores e servidores públicos |
| Tom: inspiracional e tech | Tom: autoritativo, aplicado e premium |
| Glassmorphism leve | Glassmorphism sóbrio — sem exageros |

**O que trazer da Human Academy:**
- Fundo ultra-escuro com profundidade
- Cards com glassmorphism e bordas sutis luminosas
- Gradientes como acentos, não como fundo
- Tipografia bold e expressiva nos títulos
- Micro-animações refinadas (hover, reveal, parallax)
- Layout com respiração — muito espaço negativo
- Elementos flutuantes e sobreposições
- Grain/noise sutil sobre o fundo

**O que NÃO trazer:**
- Roxo ou neon (não remete ao setor público)
- Excesso de glassmorphism (perde autoridade)
- Elementos muito "tech startup"

---

## 2. PALETA DE CORES

```css
:root {
  /* ── FUNDOS ─────────────────────────────────── */
  --bg-void:       #050507;      /* fundo mais escuro — hero */
  --bg-base:       #08080c;      /* fundo principal */
  --bg-surface:    #0f0f17;      /* cards e seções escuras */
  --bg-surface-2:  #16161f;      /* cards hover / elevados */
  --bg-light:      #f8f7f4;      /* seções claras (contraste) */

  /* ── MARCA PLENUM ────────────────────────────── */
  --gold:          #C9A227;      /* dourado principal */
  --gold-light:    #e4bc44;      /* dourado hover / highlight */
  --gold-dim:      #8a6e1a;      /* dourado escurecido */
  --gold-glow:     rgba(201, 162, 39, 0.15);  /* brilho dourado */
  --gold-glow-strong: rgba(201, 162, 39, 0.30);

  /* ── AZUL INSTITUCIONAL ──────────────────────── */
  --navy:          #0f2744;      /* azul profundo */
  --navy-mid:      #1e3a5f;      /* azul médio */
  --navy-light:    #2d5a8e;      /* azul claro */
  --navy-glow:     rgba(30, 58, 95, 0.4);

  /* ── SUBMARCAS ───────────────────────────────── */
  --academy:       #2563eb;
  --events:        #C9A227;
  --corporativa:   #16a34a;
  --consultoria:   #6d28d9;
  --govtech:       #0891b2;

  /* ── TEXTO ───────────────────────────────────── */
  --text-primary:  #f0efe8;      /* levemente quente — não branco puro */
  --text-secondary: #9b9a94;
  --text-muted:    #5c5b57;
  --text-on-light: #1a1916;

  /* ── BORDAS ──────────────────────────────────── */
  --border-glass:  rgba(255, 255, 255, 0.07);
  --border-subtle: rgba(255, 255, 255, 0.04);
  --border-gold:   rgba(201, 162, 39, 0.3);
  --border-active: rgba(201, 162, 39, 0.7);
}
```

### Gradientes principais

```css
/* Hero — profundidade máxima */
--gradient-hero: radial-gradient(ellipse 120% 80% at 50% -20%,
  rgba(30, 58, 95, 0.6) 0%,
  rgba(8, 8, 12, 0) 60%);

/* Seção escura com acento dourado */
--gradient-gold-radial: radial-gradient(ellipse 60% 50% at 80% 50%,
  rgba(201, 162, 39, 0.12) 0%,
  transparent 70%);

/* Cards — shimmer de borda */
--gradient-card-border: linear-gradient(135deg,
  rgba(255,255,255,0.1) 0%,
  rgba(255,255,255,0.02) 50%,
  rgba(201,162,39,0.1) 100%);

/* Seção clara — fundo quente */
--gradient-light: linear-gradient(160deg, #f8f7f4 0%, #f0ede4 100%);

/* Texto destacado — dourado */
--gradient-text-gold: linear-gradient(90deg, #C9A227 0%, #e4bc44 50%, #C9A227 100%);
```

---

## 3. TIPOGRAFIA

```css
/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

/*
  Display: Bricolage Grotesque
  → Expressiva, com personalidade, moderna mas não fria
  → Usada em headlines, títulos de seção, números grandes
  → A Human Academy usa fonte expressiva similar

  Body: DM Sans
  → Limpa, legível, neutra
  → Usada em parágrafos, labels, botões
*/
```

### Escala tipográfica

```css
/* DISPLAY — headlines heroicas */
.text-hero {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(3rem, 7vw, 6.5rem);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.04em;
}

/* DISPLAY LG — títulos de seção */
.text-display-lg {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(2.2rem, 4.5vw, 4rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
}

/* DISPLAY MD — subtítulos grandes */
.text-display-md {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(1.6rem, 3vw, 2.8rem);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

/* HEADING — títulos de card */
.text-heading {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(1.1rem, 1.8vw, 1.4rem);
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

/* BODY LG — parágrafos principais */
.text-body-lg {
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(1rem, 1.3vw, 1.125rem);
  font-weight: 400;
  line-height: 1.75;
  letter-spacing: 0;
}

/* BODY — parágrafos secundários */
.text-body {
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.65;
}

/* LABEL — chips, badges, labels técnicos */
.text-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* NÚMERO GRANDE — contadores, estatísticas */
.text-stat {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
}
```

---

## 4. COMPONENTES VISUAIS BASE

### 4.1 Glass Card (inspiração direta Human Academy)

```css
/* Card padrão — glassmorphism sóbrio */
.glass-card {
  background: rgba(15, 15, 23, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-glass);
  border-radius: 20px;
  position: relative;
  overflow: hidden;

  /* Shimmer de borda no topo */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: var(--gradient-card-border);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
}

/* Variante com borda dourada (hover/featured) */
.glass-card--gold {
  border-color: var(--border-gold);
  box-shadow: 0 0 40px var(--gold-glow);

  &::before {
    background: linear-gradient(135deg, rgba(201,162,39,0.25) 0%, transparent 60%);
  }
}

/* Variante clara (seções com fundo claro) */
.glass-card--light {
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(12px);
}
```

### 4.2 Grain overlay (textura Human Academy)

```css
/* Aplicar no fundo das seções escuras para profundidade */
.grain-overlay {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,..."); /* SVG de ruído */
    opacity: 0.035;
    pointer-events: none;
    z-index: 1;
  }
}

/*
  Alternativa via CSS filter:
  filter: url(#grain)
  SVG filter:
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
*/
```

### 4.3 Glow spot (brilho ambiente — muito usado na Human Academy)

```css
/* Brilho radial de fundo — cria profundidade */
.glow-spot {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}

.glow-spot--gold {
  width: 600px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(201,162,39,0.18) 0%, transparent 70%);
}

.glow-spot--navy {
  width: 800px;
  height: 500px;
  background: radial-gradient(ellipse, rgba(30,58,95,0.35) 0%, transparent 70%);
}

/* Exemplo de uso no hero:
  <div class="glow-spot glow-spot--navy" style="top:-200px; left:-200px;"/>
  <div class="glow-spot glow-spot--gold" style="top:100px; right:-100px;"/>
*/
```

### 4.4 Botões

```css
/* CTA Primário — sólido dourado */
.btn-primary {
  background: var(--gold);
  color: #0a0806;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
  padding: 14px 32px;
  border-radius: 100px; /* pill — estilo Human Academy */
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--gold-light);
    transform: translateY(-1px);
    box-shadow: 0 8px 30px rgba(201,162,39,0.35);
  }
}

/* CTA Outline — borda glass */
.btn-outline {
  background: rgba(255,255,255,0.04);
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 14px 32px;
  border-radius: 100px;
  border: 1px solid var(--border-glass);
  backdrop-filter: blur(8px);
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.15);
    transform: translateY(-1px);
  }
}

/* Ghost — texto com arrow */
.btn-ghost {
  background: transparent;
  color: var(--gold);
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 8px 0;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  .arrow { transition: transform 0.2s ease; }

  &:hover .arrow { transform: translateX(4px); }
}
```

### 4.5 Badge / Chip

```css
/* Badge de categoria */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: 1px solid;
}

/* Variantes */
.badge--gold    { background: rgba(201,162,39,0.1);  color: #e4bc44; border-color: rgba(201,162,39,0.25); }
.badge--blue    { background: rgba(37,99,235,0.12);  color: #60a5fa; border-color: rgba(37,99,235,0.3); }
.badge--green   { background: rgba(22,163,74,0.1);   color: #4ade80; border-color: rgba(22,163,74,0.25); }
.badge--purple  { background: rgba(109,40,217,0.12); color: #a78bfa; border-color: rgba(109,40,217,0.3); }
.badge--cyan    { background: rgba(8,145,178,0.1);   color: #22d3ee; border-color: rgba(8,145,178,0.25); }

/* Chip de filtro (clicável) */
.filter-chip {
  padding: 8px 18px;
  border-radius: 100px;
  border: 1px solid var(--border-glass);
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: var(--border-active);
    color: var(--text-primary);
    background: rgba(201,162,39,0.05);
  }

  &.active {
    border-color: var(--gold);
    background: var(--gold-glow);
    color: var(--gold-light);
  }
}
```

---

## 5. LAYOUT E ESPAÇAMENTO

```css
/* Container */
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 clamp(20px, 5vw, 80px);
}

/* Seções */
.section {
  padding: clamp(80px, 10vw, 140px) 0;
}

/* Espaçamentos entre elementos */
--space-xs:  8px;
--space-sm:  16px;
--space-md:  24px;
--space-lg:  40px;
--space-xl:  64px;
--space-2xl: 96px;
--space-3xl: 140px;

/* Border radius */
--radius-sm:  10px;
--radius-md:  16px;
--radius-lg:  20px;
--radius-xl:  28px;
--radius-pill: 100px;
```

### Grids

```css
/* Grid de cursos */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
}

/* Grid de eventos */
.events-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) { grid-template-columns: 1fr; }
}

/* Grid de benefícios (3 colunas) */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) { grid-template-columns: 1fr; }
}

/* Split 50/50 */
.split-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(40px, 6vw, 96px);
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
```

---

## 6. DOBRA POR DOBRA — ESPECIFICAÇÃO VISUAL

---

### HEADER

```
Posição: fixed, z-index: 100
Altura: 72px

Estado inicial (sobre hero):
  - background: transparent
  - backdrop-filter: none
  - border-bottom: none

Estado scrollado (>60px):
  - background: rgba(8, 8, 12, 0.75)
  - backdrop-filter: blur(24px) saturate(180%)
  - border-bottom: 1px solid var(--border-glass)
  - transição: 300ms ease

Layout interno:
  [Logo] ─────────────── [Nav links] ─── [Fale Conosco]

Logo:
  - Wordmark "PLENUM" em Bricolage Grotesque 700
  - Tamanho: 22px
  - Ponto de cor dourado após o texto ou ícone minimal

Nav links (desktop):
  - DM Sans 500, 14px
  - Cor: var(--text-secondary)
  - Hover: var(--text-primary), transição 200ms
  - Active: underline dourado 2px em baixo, animado com scaleX

CTA Header:
  - btn-outline pill
  - Padding: 10px 22px
  - Texto: "Fale Conosco"
```

---

### DOBRA 1 — HERO

```
Fundo:
  - background: var(--bg-void)
  - gradient-hero por cima (brilho azul naval no topo)
  - glow-spot--navy: posição top-left, 900px
  - glow-spot--gold: posição center-right, 500px, opacidade 0.12
  - grain-overlay: opacidade 0.04
  - Vídeo: position absolute, object-fit cover, opacity 0.25
    (vídeo muito suave — não concorre com o texto)

Layout (centralizado):
  ┌──────────────────────────────────────────────┐
  │              [badge pill pequeno]             │
  │  "Escola de Liderança para o Setor Público"  │
  │                                              │
  │   Formamos líderes que                       │
  │   transformam o                              │
  │   setor público                              │
  │                                              │
  │   Educação executiva, inovação e IA          │
  │   para quem transforma o Estado              │
  │                                              │
  │   [Conhecer programas]  [Fale com a Plenum]  │
  │                                              │
  │  ────────────────────────────────────────    │
  │  [Academy] [Events] [Corporativa] [+2]       │
  └──────────────────────────────────────────────┘

Badge pill topo:
  - badge--gold pequeno
  - Texto: "✦ Escola global de liderança pública"
  - Ícone estrela ou similar

Headline:
  - text-hero, centralizada
  - Cor: var(--text-primary)
  - "transformam" → gradient text dourado
  - Quebra de linha intencional para ritmo visual

Sub-headline:
  - text-body-lg, cor var(--text-secondary)
  - max-width: 500px, centralizada

Botões (par lado a lado):
  - btn-primary + btn-outline
  - gap: 12px

Tabs na base:
  - Separador horizontal: 1px solid var(--border-glass)
  - Padding: 24px 0
  - Cada tab: pill com ícone + label
  - Tab ativa: borda dourada + background gold-glow
  - Barra de progresso: linha dourada 2px sob a tab ativa, animada

Medidas:
  - min-height: 100vh
  - padding-top: 160px (compensa header fixo)
  - padding-bottom: 80px
```

---

### DOBRA 2 — PLENUM EVENTS

```
Fundo:
  - Seção clara: var(--bg-light) ou var(--bg-base) com variação
  - Alternância com hero escuro cria contraste forte

Header da seção:
  - Linha horizontal: 1px gold opacidade 20% — largura total
  - "PLENUM EVENTS" em text-label dourado
  - Headline: "Eventos em Destaque" em text-display-lg
  - Layout: título à esquerda, "Ver todos →" à direita, alinhados

Cards de evento (glass-card):
  - Aspectratio: 16:9 no topo (imagem com overlay)
  - Overlay da imagem: gradiente de baixo pra cima (dark 80% → transparent)
  - Sobre a imagem: badge de categoria (bottom-left), data (bottom-right)
  - Área de conteúdo: padding 24px
  - Título: text-heading
  - Info (data, local): ícones + DM Sans 14px, var(--text-secondary)
  - Botões: btn-primary pequeno + btn-ghost

Featured card (primeiro evento):
  - Ocupa largura total (col-span: 2)
  - Imagem mais alta (aspect-ratio: 21:9)
  - Texto pode sobrepor a imagem no canto inferior
```

---

### DOBRA 3 — ACADEMY

```
Fundo:
  - var(--bg-base)
  - glow-spot--navy sutil à esquerda

Header da seção:
  - Mesmo padrão: label + headline + link direito

Barra de filtros (inspiração direta Human Academy — chips horizontais):
  - Scroll horizontal no mobile sem scrollbar
  - Chips: filter-chip pill
  - Espaçamento entre chips: 8px
  - Linha separadora abaixo dos chips

Grid de cursos (glass-card):
  Layout do card:
  ┌─────────────────────────────────────┐
  │ [imagem 16:9 — canto arredondado]   │
  │ [badge área temática top-left]      │
  │ [badge modalidade top-right]        │
  ├─────────────────────────────────────┤
  │ Gestão de Contratos Públicos        │ ← text-heading
  │                                     │
  │ [foto prof 32px circular]           │
  │ Prof. Ana Souza                     │ ← DM Sans 13px muted
  │                                     │
  │ ─────────────────────────────────── │ ← divider
  │                                     │
  │ 📅 24 Fev   📍 São José, SC          │ ← 13px muted
  │ ⏱ 16h       💰 R$ 1.200             │
  │                                     │
  │ [Saiba mais →]                      │ ← btn-ghost dourado
  └─────────────────────────────────────┘

  Hover no card:
  - translateY(-6px)
  - border-color: var(--border-gold)
  - box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 30px var(--gold-glow)

Botão "Ver todos":
  - Centralizado abaixo do grid
  - btn-outline pill
  - Texto: "Ver todos os cursos →"
```

---

### DOBRA 4 — PROVA SOCIAL

```
Fundo:
  - var(--bg-void) — mais escuro que a seção anterior
  - grain-overlay
  - glow-spot--gold centro, muito suave (opacidade 0.08)

Contadores:
  - 4 cards em linha horizontal
  - glass-card com borda gold sutil
  - Número: text-stat em dourado
  - Label: text-label em muted
  - Hover: glass-card--gold

Logos marquee:
  - Linha horizontal scrollável infinito
  - Logos em grayscale → coloridas no hover
  - Separado do restante por bordas sutis

Depoimentos:
  - glass-card grande, centralizado
  - Quote em text-display-md itálico
  - Foto circular 56px
  - Nome em DM Sans 600
  - Cargo/instituição em muted 13px
  - Navegação: pontos dourados
```

---

### DOBRAS 5 E 6 — CONSULTORIA / CORPORATIVA

```
Fundo:
  - Alternância: seção 5 escura, seção 6 clara (ou vice-versa)
  - Cria ritmo visual na página

Layout split 50/50:
  Lado texto:
  - badge--[cor da submarca]
  - headline: text-display-md
  - parágrafo: text-body-lg, var(--text-secondary)
  - lista de bullets com ícone check dourado
  - btn-primary ou btn-ghost

  Lado visual:
  - glass-card com imagem dentro
  - Borda com shimmer
  - Leve inclinação (rotate: 1.5deg) para dinamismo
  - Ou: elemento abstrato (formas geométricas + ícones flutuantes)

Seção 6 (Corporativa):
  - Fundo claro var(--bg-light) — forte contraste
  - Cores de texto invertidas (var(--text-on-light))
  - Cards de benefício com fundo branco, sombra suave
```

---

### DOBRA 7 — BLOG / INSIGHTS

```
Fundo:
  - var(--bg-surface) — meio-escuro

Cards de artigo:
  - glass-card com imagem no topo (aspect 16:9)
  - badge de categoria colorido
  - Data: DM Sans 12px muted
  - Título: text-heading
  - Excerpt: 2 linhas max, text-body muted
  - "Ler mais →": btn-ghost

Hover:
  - card sobe 4px
  - imagem: scale 1.04
  - título: cor dourada suave
```

---

### DOBRA 8 — INSTAGRAM

```
Fundo:
  - var(--bg-base)

Grid 3x2:
  - Aspect-ratio: 1/1
  - border-radius: var(--radius-lg)
  - overflow: hidden
  - gap: 12px

Hover por post:
  - overlay escuro fade in
  - ícones de curtidas e comentários centralizados
  - scale: 1.02

CTA:
  - btn-outline centralizado abaixo
```

---

### FOOTER

```
Fundo:
  - var(--bg-void)
  - linha decorativa no topo: 1px solid var(--border-glass)
  - glow-spot--gold sutil no canto

Layout: 5 colunas → 2 colunas tablet → 1 coluna mobile

Newsletter (seção separada acima das colunas):
  - glass-card centralizado, largura 600px
  - Headline pequena + input pill + btn-primary
  - Fundo ligeiramente diferente

Colunas:
  - Logo + tagline + redes sociais (col 1)
  - Links agrupados (cols 2-4)
  - Contato (col 5)

Redes sociais:
  - Ícones em glass-card redondo pequeno (40x40)
  - Hover: border-color gold + escala 1.1

Legal (bottom):
  - Separador 1px
  - DM Sans 12px muted
  - flex space-between
```

---

## 7. PÁGINA DE CURSOS — `/academy`

```
Inspiração direta: humanacademy.ai/cursos

Hero da página (menor que o home):
  - Altura: 40vh mínimo
  - Headline: "Plenum Academy"
  - Sub: "Encontre o curso certo para sua carreira no setor público"
  - Badge com total de cursos: "42 cursos disponíveis"
  - Fundo: var(--bg-void) + glow-spot

Layout da página:
  - Sidebar à esquerda (desktop): filtros sticky
  - Grid à direita: 2 colunas desktop, 1 mobile

Sidebar de filtros:
  - glass-card fixo
  - Grupos colapsáveis: Público-alvo | Modalidade | Cidade | Categoria
  - Chips ou checkboxes estilizados
  - Botão "Limpar filtros" em btn-ghost

Resultado:
  - Total de cursos encontrados: "Exibindo 18 de 42 cursos"
  - Ordenação: select glass — Mais recentes | Mais populares | Menor preço
  - Grid de cards (mesmo padrão da home)
```

---

## 8. LANDING PAGE DO CURSO — `/academy/[slug]`

```
Inspiração: Human Academy página individual de curso

Hero:
  - Fundo: imagem de capa do curso com overlay escuro 70%
  - Badge categoria + badge público-alvo
  - Título: text-hero menor (clamp 2rem → 3.5rem)
  - Professor: foto + nome (abaixo do título)

Layout principal (2 colunas):
  Coluna principal (2/3):
  - Sobre o curso
  - Objetivos de aprendizagem
  - Grade curricular (accordion glass)
  - Professor (card)
  - Depoimentos (se houver)

  Sidebar sticky (1/3):
  ┌─────────────────────────────────┐
  │ glass-card com borda dourada    │
  │                                 │
  │ [Selecione uma data ▼]          │ ← TurmaSelector
  │                                 │
  │ 📅 24 Fev 2026                  │
  │ 📍 São José, SC                 │
  │ 🏛 Presencial                   │
  │ ⏱ 16 horas                      │
  │ 💰 R$ 1.200                     │
  │                                 │
  │ [Garantir minha vaga]           │ ← btn-primary pill large
  │ [Baixar folder do curso]        │ ← btn-outline
  │                                 │
  │ ou tirar dúvidas pelo           │
  │ [WhatsApp →]                    │
  └─────────────────────────────────┘
```

---

## 9. CHECKLIST DO DESENVOLVEDOR

```
Fontes:
- [ ] Bricolage Grotesque importada (Google Fonts)
- [ ] DM Sans importada

CSS Variables:
- [ ] Todas as cores definidas no :root (globals.css)
- [ ] Gradientes definidos como variáveis
- [ ] Espaçamentos como variáveis

Componentes base implementados:
- [ ] .glass-card com variantes (gold, light)
- [ ] .grain-overlay (textura)
- [ ] .glow-spot (--gold e --navy)
- [ ] .btn-primary, .btn-outline, .btn-ghost
- [ ] .badge com todas as variantes de cor
- [ ] .filter-chip com estado active

Layout:
- [ ] .container responsivo com clamp no padding
- [ ] .courses-grid responsivo (3→2→1 colunas)
- [ ] .split-layout responsivo (2→1 coluna)

Efeitos:
- [ ] backdrop-filter: blur funcionando no Safari (-webkit-)
- [ ] Grain overlay sem impacto na performance
- [ ] Glow spots não causando overflow horizontal
- [ ] Gradientes de texto com -webkit-background-clip: text

Dark/Light:
- [ ] Seções claras (Corporativa, footer-light) com tokens corretos
- [ ] Texto invertido nas seções claras
```

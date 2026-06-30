# 🎬 PLENUM 2026 — ESPECIFICAÇÃO COMPLETA DA HOME
## Textos, Comportamentos e Animações GSAP

> Este documento é a **fonte da verdade visual** da Home. Todo texto, copy, comportamento de UI e animação GSAP estão detalhados aqui. O agente FRONTEND deve seguir este documento à risca.

---

## SETUP GSAP (global)

```typescript
// lib/gsap.ts — registrar plugins uma vez
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, TextPlugin, SplitText)

// Configuração global
gsap.defaults({ ease: 'power3.out' })

// Smooth scroll nativo integrado com ScrollTrigger
ScrollTrigger.normalizeScroll(true)
```

---

## HEADER (fixo, global)

### Estrutura
```
[Logo Plenum]                    [Academy] [Events] [Corporativa] [Consultoria] [Insights]    [Fale Conosco ↗]
```

### Textos
- Logo: `PLENUM` (wordmark tipográfico)
- Nav: `Academy` | `Events` | `Corporativa` | `Consultoria` | `Insights`
- CTA: `Fale Conosco`

### Estados visuais
- **Padrão (topo):** fundo transparente, texto branco
- **Scrollado (>80px):** `background: rgba(9,9,11,0.85)` + `backdrop-filter: blur(16px)` + `border-bottom: 1px solid rgba(255,255,255,0.08)`

### 🎬 GSAP — Header
```javascript
// Entrada do header no page load
gsap.from('.header', {
  y: -80,
  opacity: 0,
  duration: 0.8,
  delay: 0.2,
  ease: 'power3.out'
})

// Transição ao scroll
ScrollTrigger.create({
  start: 'top -80',
  onEnter: () => gsap.to('.header', {
    backgroundColor: 'rgba(9,9,11,0.85)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    duration: 0.4
  }),
  onLeaveBack: () => gsap.to('.header', {
    backgroundColor: 'transparent',
    backdropFilter: 'blur(0px)',
    borderBottom: '1px solid transparent',
    duration: 0.4
  })
})

// Hover nos links do nav
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('mouseenter', () => {
    gsap.to(link.querySelector('.nav-underline'), { scaleX: 1, duration: 0.3, ease: 'power2.out' })
  })
  link.addEventListener('mouseleave', () => {
    gsap.to(link.querySelector('.nav-underline'), { scaleX: 0, duration: 0.3, ease: 'power2.in' })
  })
})
// .nav-underline: elemento <span> position:absolute bottom:0 left:0 width:100% height:1px bg:primary scaleX:0 transformOrigin:'left'
```

---

## DOBRA 1 — HERO

### Estrutura visual
```
┌─────────────────────────────────────────────────────────┐
│  [VÍDEO CINEMATIC EM LOOP — FULL SCREEN]                │
│  [overlay: gradient-to-top from-black/90 via-black/50]  │
│                                                         │
│                                                         │
│         Formamos líderes que                            │
│         transformam o setor público                     │
│                                                         │
│    Educação executiva, inovação e IA                    │
│    para o setor público                                 │
│                                                         │
│              [ Conhecer programas → ]                   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ [Academy] [Events] [Corporativa][Consult][Govtech]│   │
│  │ ████████░░░░░░░░░  ← barra de progresso          │   │
│  └──────────────────────────────────────────────────┘   │
│                          ↓ scroll                       │
└─────────────────────────────────────────────────────────┘
```

### Textos
- **Headline:** `Formamos líderes que transformam o setor público`
  - "transformam" recebe cor `var(--primary)` — `#C9A227`
- **Sub-headline:** `Educação executiva, inovação e IA para o setor público`
- **CTA:** `Conhecer programas`
- **Ícone de som:** toggle mudo/com som (canto inferior direito)
- **Scroll indicator:** `↓` pulsando suavemente na base (some após 3s de scroll)

### Tabs (5 abas com auto-advance 5s)

| Tab | Título do card | Descrição | Cor de destaque |
|-----|---------------|-----------|-----------------|
| Academy | Cursos, trilhas e certificações para líderes públicos | Formação contínua com foco em prática e aplicação real no serviço público | `#2563eb` |
| Events | Congressos, seminários e fóruns de referência | Conteúdo denso com líderes nacionais e internacionais do setor público | `#C9A227` |
| Corporativa | Educação corporativa sob medida para instituições | Jornadas por competência com curadoria, indicadores e governança de aprendizagem | `#16a34a` |
| Consultoria | Diagnóstico, projetos e apoio técnico especializado | Segurança jurídica e técnica para servidores e instituições públicas | `#9333ea` |
| Govtech | IA aplicada para produtividade e conformidade | Soluções de inteligência artificial para modernizar o Estado e apoiar decisões | `#0891b2` |

### 🎬 GSAP — Hero

```javascript
// 1. ENTRADA DA PÁGINA (timeline principal)
const heroTl = gsap.timeline({ delay: 0.3 })

// Split text na headline para animar palavra por palavra
const headlineSplit = new SplitText('.hero-headline', { type: 'words' })

heroTl
  // Vídeo fade in
  .from('.hero-video', { opacity: 0, duration: 1.2, ease: 'power2.inOut' })
  // Palavras da headline entram de baixo com stagger
  .from(headlineSplit.words, {
    y: 60,
    opacity: 0,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power3.out'
  }, '-=0.6')
  // Sub-headline
  .from('.hero-subheadline', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.3')
  // CTA button
  .from('.hero-cta', {
    y: 20,
    opacity: 0,
    scale: 0.95,
    duration: 0.5,
    ease: 'back.out(1.5)'
  }, '-=0.2')
  // Tabs bar
  .from('.hero-tabs', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.2')
  // Scroll indicator
  .from('.scroll-indicator', {
    opacity: 0,
    duration: 0.5
  }, '-=0.1')

// 2. PALAVRA "transformam" — destaque com cor
// Após split, encontrar a palavra e aplicar cor
headlineSplit.words.forEach(word => {
  if (word.textContent.includes('transformam')) {
    gsap.set(word, { color: '#C9A227' })
  }
})

// 3. TROCA DE ABA — animação do card flutuante
function switchTab(index) {
  const tl = gsap.timeline()
  tl
    // Card atual sai
    .to('.hero-tab-card', {
      opacity: 0,
      x: -20,
      duration: 0.25,
      ease: 'power2.in'
    })
    // Atualiza conteúdo (via JS/state)
    .call(() => updateTabContent(index))
    // Card novo entra
    .from('.hero-tab-card', {
      opacity: 0,
      x: 20,
      duration: 0.35,
      ease: 'power3.out'
    })
    // Barra de progresso reinicia
    .fromTo('.hero-progress-bar', 
      { scaleX: 0 },
      { scaleX: 1, duration: 5, ease: 'none' }
    )
}

// 4. BARRA DE PROGRESSO — auto-advance
gsap.fromTo('.hero-progress-bar',
  { scaleX: 0, transformOrigin: 'left' },
  {
    scaleX: 1,
    duration: 5,
    ease: 'none',
    repeat: -1,
    onRepeat: () => advanceTab()
  }
)

// 5. SCROLL INDICATOR — pulso
gsap.to('.scroll-indicator', {
  y: 8,
  duration: 0.8,
  repeat: -1,
  yoyo: true,
  ease: 'power1.inOut'
})

// Esconde após 3s de scroll
ScrollTrigger.create({
  start: 'top -100',
  onEnter: () => gsap.to('.scroll-indicator', { opacity: 0, duration: 0.4 })
})

// 6. PARALLAX do vídeo ao scroll
gsap.to('.hero-video', {
  yPercent: 30,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
})

// 7. HOVER no CTA
const ctaBtn = document.querySelector('.hero-cta')
ctaBtn.addEventListener('mouseenter', () => {
  gsap.to(ctaBtn, { scale: 1.04, duration: 0.2, ease: 'power2.out' })
  gsap.to('.cta-arrow', { x: 4, duration: 0.2 })
})
ctaBtn.addEventListener('mouseleave', () => {
  gsap.to(ctaBtn, { scale: 1, duration: 0.2 })
  gsap.to('.cta-arrow', { x: 0, duration: 0.2 })
})
```

---

## DOBRA 2 — PLENUM EVENTS

### Estrutura visual
```
┌─────────────────────────────────────────────────────────┐
│  Plenum Events                                          │
│  Eventos em Destaque                          [Ver todos]│
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ [BANNER LARGO — imagem cinematic + overlay]      │   │
│  │  🏷 CONGRESSO          📅 15 Mar 2026            │   │
│  │                        📍 Brasília, DF           │   │
│  │  Congresso Nacional de                           │   │
│  │  Gestão Pública 2026                             │   │
│  │                                                  │   │
│  │  Maior encontro de gestores públicos do Brasil   │   │
│  │                                                  │   │
│  │  [Garanta sua vaga →]  [Ver programação]         │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────┐  ┌───────────────────────────┐    │
│  │ [card 2]         │  │ [card 3]                  │    │
│  └──────────────────┘  └───────────────────────────┘    │
│                                                         │
│              ● ○ ○   ← indicadores                      │
└─────────────────────────────────────────────────────────┘
```

### Textos fixos
- **Título seção:** `Plenum Events`
- **Subtítulo:** `Eventos em Destaque`
- **Link direito:** `Ver todos os eventos →`
- **CTA primário por card:** `Garanta sua vaga →`
- **CTA secundário por card:** `Ver programação`
- **Label data:** `📅` + data formatada (ex: `15 de março de 2026`)
- **Label local:** `📍` + cidade, estado

### Badges de categoria (cores)
- `SEMINÁRIO` → bg `#1e3a5f` texto `#60a5fa`
- `CONGRESSO` → bg `#3b1f00` texto `#f59e0b`
- `IMERSÃO` → bg `#1a0f2e` texto `#a78bfa`
- `CAPACITAÇÃO` → bg `#0f2e1a` texto `#4ade80`

### 🎬 GSAP — Events

```javascript
// 1. TÍTULO DA SEÇÃO — entrada ao scroll
const eventsTl = gsap.timeline({
  scrollTrigger: {
    trigger: '.events-section',
    start: 'top 80%',
    toggleActions: 'play none none reverse'
  }
})

const titleSplit = new SplitText('.events-title', { type: 'chars' })

eventsTl
  .from(titleSplit.chars, {
    opacity: 0,
    y: 40,
    rotateX: -90,
    stagger: 0.03,
    duration: 0.6,
    ease: 'back.out(1.7)'
  })
  .from('.events-subtitle', {
    opacity: 0,
    x: -20,
    duration: 0.4
  }, '-=0.2')
  .from('.events-link', {
    opacity: 0,
    x: 20,
    duration: 0.4
  }, '<')

// 2. CARDS — entrada em cascata
gsap.from('.event-card', {
  opacity: 0,
  y: 60,
  duration: 0.7,
  stagger: 0.15,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.events-grid',
    start: 'top 75%',
  }
})

// 3. HOVER no card — efeito de elevação
document.querySelectorAll('.event-card').forEach(card => {
  const img = card.querySelector('.event-card-image')
  const cta = card.querySelector('.event-cta-primary')

  card.addEventListener('mouseenter', () => {
    gsap.to(card, { y: -6, duration: 0.3, ease: 'power2.out' })
    gsap.to(img, { scale: 1.05, duration: 0.6, ease: 'power2.out' })
    gsap.to(cta, { x: 4, duration: 0.2 })
  })
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { y: 0, duration: 0.3 })
    gsap.to(img, { scale: 1, duration: 0.6 })
    gsap.to(cta, { x: 0, duration: 0.2 })
  })
})

// 4. BADGE — pulso sutil no badge de destaque
gsap.to('.event-badge-featured', {
  scale: 1.05,
  duration: 1.2,
  repeat: -1,
  yoyo: true,
  ease: 'power1.inOut'
})
```

---

## DOBRA 3 — ACADEMY (Capacitações)

### Estrutura visual
```
┌─────────────────────────────────────────────────────────┐
│  Plenum Academy                     [Agenda completa →] │
│  Presencial / Online / Híbrido                          │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [Todos] [Adm. Pública] [Municípios] [Legislativo│   │
│  │  Tribunais] [Estatais] [Sistema S] [Controle]   │   │
│  │  [Conselhos] [Empresas] ────────────── scroll → │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Modalidade: [Todos] [Presencial] [Híbrido] [Online]    │
│  Cidade: [▼ Selecionar cidade]                          │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ [card 1] │ │ [card 2] │ │ [card 3] │               │
│  └──────────┘ └──────────┘ └──────────┘               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ [card 4] │ │ [card 5] │ │ [card 6] │               │
│  └──────────┘ └──────────┘ └──────────┘               │
│                                                         │
│                   [ Ver todos os cursos ]               │
└─────────────────────────────────────────────────────────┘
```

### Textos fixos
- **Título:** `Plenum Academy`
- **Subtítulo:** `Presencial / Online / Híbrido`
- **Link direito:** `Agenda completa →`
- **Filtro público — chips:**
  `Todos` | `Administração Pública` | `Municípios` | `Legislativo` | `Tribunais` | `Estatais` | `Sistema S` | `Órgãos de Controle` | `Conselhos` | `Empresas`
- **Filtro modalidade:** `Todos` | `Presencial` | `Online ao Vivo` | `Híbrido`
- **Filtro cidade:** select dinâmico
- **CTA card:** `Saiba mais`
- **CTA seção:** `Ver todos os cursos`
- **Label vazio (sem resultados):** `Nenhum curso encontrado para os filtros selecionados.`

### Estrutura do card de curso
```
┌─────────────────────────────────────┐
│ [🏷 Licitações] [🏷 Presencial]      │  ← badges topo
│                                     │
│ [imagem/capa do curso — 16:9]       │
│ [foto prof circular — sobreposta]   │
│                                     │
│ Gestão de Contratos Públicos        │  ← título
│ Prof. Ana Souza                     │  ← professor
│                                     │
│ 📅 24 Fev — São José, SC            │  ← próxima turma
│ ⏱ 16 horas    👥 Municípios         │  ← info
│                                     │
│ R$ 1.200 | Saiba mais →             │  ← preço + CTA
└─────────────────────────────────────┘
```

### 🎬 GSAP — Academy

```javascript
// 1. TÍTULO com clip-path reveal
gsap.from('.academy-title', {
  clipPath: 'inset(0 100% 0 0)',
  duration: 0.8,
  ease: 'power3.inOut',
  scrollTrigger: {
    trigger: '.academy-section',
    start: 'top 75%'
  }
})

// 2. CHIPS de filtro — entrada em cascata horizontal
gsap.from('.filter-chip', {
  opacity: 0,
  x: -20,
  duration: 0.4,
  stagger: 0.05,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.filter-bar',
    start: 'top 85%'
  }
})

// 3. CHIP ATIVO — animação de seleção
function selectChip(chip) {
  // Reseta todos
  gsap.to('.filter-chip', {
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    borderColor: 'var(--border-default)',
    duration: 0.2
  })
  // Ativa o clicado
  gsap.to(chip, {
    backgroundColor: 'var(--primary-muted)',
    color: 'var(--primary)',
    borderColor: 'var(--primary)',
    duration: 0.25,
    ease: 'power2.out'
  })
}

// 4. GRID DE CARDS — entrada escalonada
function animateCourseCards() {
  gsap.from('.course-card', {
    opacity: 0,
    y: 50,
    scale: 0.97,
    duration: 0.5,
    stagger: 0.08,
    ease: 'power3.out',
    clearProps: 'all'
  })
}

// Disparar na entrada e ao filtrar
ScrollTrigger.create({
  trigger: '.courses-grid',
  start: 'top 80%',
  onEnter: animateCourseCards
})

// 5. HOVER no card
document.querySelectorAll('.course-card').forEach(card => {
  const img = card.querySelector('.course-card-image')
  const profPhoto = card.querySelector('.professor-photo')

  card.addEventListener('mouseenter', () => {
    gsap.to(card, {
      y: -8,
      boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
      duration: 0.3,
      ease: 'power2.out'
    })
    gsap.to(img, { scale: 1.06, duration: 0.5 })
    gsap.to(profPhoto, { scale: 1.08, duration: 0.3 })
  })
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { y: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', duration: 0.3 })
    gsap.to(img, { scale: 1, duration: 0.5 })
    gsap.to(profPhoto, { scale: 1, duration: 0.3 })
  })
})

// 6. TROCA DE FILTRO — fade out → filtro → fade in
function applyFilter() {
  gsap.to('.course-card', {
    opacity: 0,
    y: 10,
    duration: 0.2,
    stagger: 0.03,
    onComplete: () => {
      updateFilteredCourses() // atualiza o DOM
      animateCourseCards()    // reanima
    }
  })
}

// 7. BOTÃO "Ver todos" — underline animado
const verTodosBtn = document.querySelector('.see-all-btn')
verTodosBtn.addEventListener('mouseenter', () => {
  gsap.to('.see-all-underline', { scaleX: 1, duration: 0.3, ease: 'power2.out' })
})
verTodosBtn.addEventListener('mouseleave', () => {
  gsap.to('.see-all-underline', { scaleX: 0, duration: 0.2 })
})
```

---

## DOBRA 4 — VALIDAÇÃO / PROVA SOCIAL

### Estrutura visual
```
┌─────────────────────────────────────────────────────────┐
│  [FUNDO ESCURO — #09090b — textura grain sutil]         │
│                                                         │
│  Quem confia na Plenum                                  │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ 20.000+  │ │  500+    │ │   98%    │ │   15+    │  │
│  │ Líderes  │ │Instituiç.│ │Satisfação│ │   Anos   │  │
│  │capacitados│         │          │          │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                         │
│  ──── Instituições que confiam na Plenum ────           │
│  [logo] [logo] [logo] [logo] [logo] [logo] [logo] →    │
│                                                         │
│  ──────────────── O que dizem sobre nós ────────────── │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [foto] "Depoimento completo da autoridade..."    │  │
│  │         Nome Sobrenome                           │  │
│  │         Secretário de Estado | Governo SP        │  │
│  │                          ← ●○○ →                 │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Textos fixos
- **Título:** `Quem confia na Plenum`
- **Subtítulo seção logos:** `Instituições que confiam na Plenum`
- **Subtítulo depoimentos:** `O que dizem sobre nós`

### Contadores (dados reais virão do banco)
| Número | Sufixo | Label | Ícone |
|--------|--------|-------|-------|
| 20.000 | + | Líderes capacitados | 👥 |
| 500 | + | Instituições transformadas | 🏛️ |
| 98 | % | Satisfação média | ⭐ |
| 15 | + | Anos de experiência | 📅 |

### 🎬 GSAP — Prova Social

```javascript
// 1. TÍTULO — efeito de reveal com linha
const socialTl = gsap.timeline({
  scrollTrigger: {
    trigger: '.social-proof',
    start: 'top 70%'
  }
})

socialTl
  .from('.social-title', {
    opacity: 0,
    y: 30,
    duration: 0.6
  })
  .from('.social-title-line', {
    // linha decorativa abaixo do título
    scaleX: 0,
    transformOrigin: 'left',
    duration: 0.8,
    ease: 'power3.inOut'
  }, '-=0.2')

// 2. CONTADORES — CountUp animado ao entrar na viewport
const counters = [
  { el: '.counter-leaders', target: 20000, suffix: '+', label: 'Líderes capacitados' },
  { el: '.counter-institutions', target: 500, suffix: '+', label: 'Instituições transformadas' },
  { el: '.counter-satisfaction', target: 98, suffix: '%', label: 'Satisfação média' },
  { el: '.counter-years', target: 15, suffix: '+', label: 'Anos de experiência' },
]

ScrollTrigger.create({
  trigger: '.counters-row',
  start: 'top 75%',
  onEnter: () => {
    counters.forEach((counter, i) => {
      // Anima o card inteiro primeiro
      gsap.from(counter.el + '-card', {
        opacity: 0,
        y: 40,
        duration: 0.5,
        delay: i * 0.1,
        ease: 'power3.out'
      })

      // Então conta o número
      gsap.to({ val: 0 }, {
        val: counter.target,
        duration: 2,
        delay: i * 0.15 + 0.3,
        ease: 'power2.out',
        onUpdate: function() {
          document.querySelector(counter.el).textContent =
            Math.ceil(this.targets()[0].val).toLocaleString('pt-BR') + counter.suffix
        }
      })
    })
  }
})

// 3. MARQUEE de logos — scroll infinito
gsap.to('.logos-track', {
  xPercent: -50,
  duration: 25,
  repeat: -1,
  ease: 'none'
})
// Pausa no hover
document.querySelector('.logos-wrapper').addEventListener('mouseenter', () => {
  gsap.globalTimeline.timeScale(0)
})
document.querySelector('.logos-wrapper').addEventListener('mouseleave', () => {
  gsap.globalTimeline.timeScale(1)
})

// 4. CARROSSEL DE DEPOIMENTOS
// Transição entre depoimentos
function showTestimonial(index) {
  const tl = gsap.timeline()
  tl
    .to('.testimonial-content', {
      opacity: 0,
      x: -30,
      duration: 0.3,
      ease: 'power2.in'
    })
    .call(() => updateTestimonialContent(index))
    .from('.testimonial-content', {
      opacity: 0,
      x: 30,
      duration: 0.4,
      ease: 'power3.out'
    })
    .from('.testimonial-photo', {
      scale: 0.8,
      opacity: 0,
      duration: 0.4,
      ease: 'back.out(1.4)'
    }, '<')
}

// Auto-advance a cada 6s
let testimonialInterval = setInterval(() => advanceTestimonial(), 6000)

// 5. CARDS DOS CONTADORES — hover brilho
document.querySelectorAll('.counter-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, {
      borderColor: 'var(--primary)',
      boxShadow: '0 0 30px rgba(201,162,39,0.15)',
      duration: 0.3
    })
  })
  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      borderColor: 'var(--border-default)',
      boxShadow: 'none',
      duration: 0.3
    })
  })
})
```

---

## DOBRA 5 — PLENUM CONSULTORIA

### Estrutura visual
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ┌─────────────────────┐  ┌──────────────────────────┐ │
│  │                     │  │ Plenum Consultoria        │ │
│  │  [IMAGEM CINEMATIC] │  │                          │ │
│  │  profissional,      │  │ Diagnóstico, projetos e   │ │
│  │  reunião de         │  │ apoio técnico para        │ │
│  │  servidores]        │  │ instituições públicas     │ │
│  │                     │  │                          │ │
│  │                     │  │ ✓ Segurança jurídica      │ │
│  │                     │  │ ✓ Diagnóstico institucional│ │
│  │                     │  │ ✓ Implementação guiada    │ │
│  │                     │  │ ✓ Maiores tickets         │ │
│  │                     │  │                          │ │
│  │                     │  │ [ Saiba mais → ]          │ │
│  └─────────────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Textos
- **Label topo:** `PLENUM CONSULTORIA`
- **Título:** `Diagnóstico, projetos e apoio técnico especializado`
- **Descrição:** `Conectamos formação com execução. Apoiamos instituições públicas com diagnóstico de processos, desenho de soluções e implementação — com foco em segurança jurídica, conformidade e modernização.`
- **Bullets:**
  - `Segurança jurídica e técnica para servidores`
  - `Diagnóstico institucional completo`
  - `Projetos de modernização e conformidade`
  - `Acompanhamento da implementação`
- **CTA:** `Saiba mais sobre a Consultoria →`

### 🎬 GSAP — Consultoria

```javascript
// 1. IMAGEM — reveal com clip-path da esquerda
gsap.from('.consultoria-image', {
  clipPath: 'inset(0 100% 0 0)',
  duration: 1,
  ease: 'power3.inOut',
  scrollTrigger: {
    trigger: '.consultoria-section',
    start: 'top 70%'
  }
})

// 2. CONTEÚDO DIREITO — stagger
const consultoriaTl = gsap.timeline({
  scrollTrigger: {
    trigger: '.consultoria-content',
    start: 'top 70%'
  }
})

consultoriaTl
  .from('.consultoria-label', { opacity: 0, x: 20, duration: 0.4 })
  .from('.consultoria-title', { opacity: 0, y: 20, duration: 0.5 }, '-=0.2')
  .from('.consultoria-desc', { opacity: 0, y: 15, duration: 0.4 }, '-=0.2')
  .from('.consultoria-bullet', {
    opacity: 0,
    x: -15,
    duration: 0.35,
    stagger: 0.1
  }, '-=0.1')
  .from('.consultoria-cta', {
    opacity: 0,
    y: 10,
    duration: 0.4,
    ease: 'back.out(1.4)'
  }, '-=0.1')

// 3. BULLETS — ícone de check animado
document.querySelectorAll('.consultoria-bullet').forEach((bullet, i) => {
  gsap.from(bullet.querySelector('.check-icon'), {
    scale: 0,
    rotation: -180,
    duration: 0.4,
    delay: i * 0.1 + 0.8,
    ease: 'back.out(2)',
    scrollTrigger: {
      trigger: '.consultoria-section',
      start: 'top 70%'
    }
  })
})

// 4. PARALLAX na imagem
gsap.to('.consultoria-image img', {
  yPercent: -15,
  ease: 'none',
  scrollTrigger: {
    trigger: '.consultoria-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1
  }
})
```

---

## DOBRA 6 — PLENUM CORPORATIVA

### Estrutura visual (invertida em relação à 5)
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ┌──────────────────────────┐  ┌─────────────────────┐ │
│  │ Plenum Corporativa       │  │                     │ │
│  │                          │  │ [IMAGEM CINEMATIC]  │ │
│  │ Educação corporativa sob │  │  treinamento,       │ │
│  │ medida para instituições │  │  equipe pública]    │ │
│  │ públicas                 │  │                     │ │
│  │                          │  │                     │ │
│  │ ┌──────┐┌──────┐┌──────┐ │  │                     │ │
│  │ │Jornadas│Curad.││Indicad│ │  │                     │ │
│  │ └──────┘└──────┘└──────┘ │  │                     │ │
│  │                          │  │                     │ │
│  │ [ Saiba mais → ]         │  │                     │ │
│  └──────────────────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Textos
- **Label topo:** `PLENUM CORPORATIVA`
- **Título:** `Educação corporativa sob medida para instituições públicas`
- **Descrição:** `Desenvolvemos jornadas completas de aprendizagem para equipes e carreiras do setor público. Curadoria especializada, trilhas por competência, experiência digital e indicadores de performance.`
- **Cards de benefício (3 ícones):**
  - `🗺️ Jornadas por Competência` — Trilhas personalizadas para cada cargo e função
  - `📊 Indicadores de Performance` — Acompanhamento real do desenvolvimento das equipes
  - `🎯 Governança de Aprendizagem` — Estrutura completa de gestão do conhecimento institucional
- **CTA:** `Saiba mais sobre a Corporativa →`

### 🎬 GSAP — Corporativa

```javascript
// Mesma lógica da Consultoria, mas com conteúdo à esquerda e imagem à direita

// 1. IMAGEM — clip-path da direita
gsap.from('.corporativa-image', {
  clipPath: 'inset(0 0 0 100%)',
  duration: 1,
  ease: 'power3.inOut',
  scrollTrigger: {
    trigger: '.corporativa-section',
    start: 'top 70%'
  }
})

// 2. CARDS DE BENEFÍCIO — entrada com scale
gsap.from('.benefit-card', {
  opacity: 0,
  scale: 0.85,
  y: 20,
  duration: 0.5,
  stagger: 0.12,
  ease: 'back.out(1.5)',
  scrollTrigger: {
    trigger: '.benefit-cards',
    start: 'top 80%'
  }
})

// 3. HOVER nos benefit cards
document.querySelectorAll('.benefit-card').forEach(card => {
  const icon = card.querySelector('.benefit-icon')
  card.addEventListener('mouseenter', () => {
    gsap.to(card, { y: -4, borderColor: 'var(--primary)', duration: 0.25 })
    gsap.to(icon, { rotation: 10, scale: 1.1, duration: 0.25 })
  })
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { y: 0, borderColor: 'var(--border-default)', duration: 0.25 })
    gsap.to(icon, { rotation: 0, scale: 1, duration: 0.25 })
  })
})
```

---

## DOBRA 7 — PLENUM INSIGHTS / BLOG

### Estrutura visual
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Plenum Insights              [Ver todos os artigos →]  │
│  Conteúdo aplicado para o setor público                 │
│                                                         │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ │
│  │ [imagem]      │ │ [imagem]      │ │ [imagem]      │ │
│  │               │ │               │ │               │ │
│  │ 🏷 Gestão     │ │ 🏷 Tecnologia  │ │ 🏷 Legislação │ │
│  │ 12 fev 2026   │ │ 08 fev 2026   │ │ 01 fev 2026   │ │
│  │               │ │               │ │               │ │
│  │ Como elaborar │ │ IA no setor   │ │ Nova lei de   │ │
│  │ um plano de   │ │ público: guia │ │ licitações:   │ │
│  │ governança... │ │ prático...    │ │ o que muda... │ │
│  │               │ │               │ │               │ │
│  │ Ler mais →    │ │ Ler mais →    │ │ Ler mais →    │ │
│  └───────────────┘ └───────────────┘ └───────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Textos fixos
- **Título:** `Plenum Insights`
- **Subtítulo:** `Conteúdo aplicado para líderes do setor público`
- **Link direito:** `Ver todos os artigos →`
- **CTA card:** `Ler mais →`

### 🎬 GSAP — Blog

```javascript
// 1. LINHA SEPARADORA — cresce da esquerda
gsap.from('.blog-divider', {
  scaleX: 0,
  transformOrigin: 'left',
  duration: 0.8,
  ease: 'power3.inOut',
  scrollTrigger: {
    trigger: '.blog-section',
    start: 'top 75%'
  }
})

// 2. CARDS — entrada com stagger e leve rotação
gsap.from('.blog-card', {
  opacity: 0,
  y: 50,
  rotation: 1,
  duration: 0.6,
  stagger: 0.12,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.blog-grid',
    start: 'top 80%'
  }
})

// 3. HOVER — reveal de categoria colorida
document.querySelectorAll('.blog-card').forEach(card => {
  const img = card.querySelector('.blog-card-image')
  const lerMais = card.querySelector('.blog-ler-mais')

  card.addEventListener('mouseenter', () => {
    gsap.to(img, { scale: 1.05, duration: 0.5 })
    gsap.to(lerMais, { x: 6, duration: 0.2 })
    gsap.to(card, { y: -5, duration: 0.25 })
  })
  card.addEventListener('mouseleave', () => {
    gsap.to(img, { scale: 1, duration: 0.5 })
    gsap.to(lerMais, { x: 0, duration: 0.2 })
    gsap.to(card, { y: 0, duration: 0.25 })
  })
})
```

---

## DOBRA 8 — ÚLTIMAS NOTÍCIAS (Instagram)

### Estrutura visual
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  @plenum no Instagram                                   │
│  Acompanhe o que estamos fazendo                        │
│                                                         │
│  ┌────────┐ ┌────────┐ ┌────────┐                      │
│  │[post 1]│ │[post 2]│ │[post 3]│                      │
│  │♥ 234   │ │♥ 189   │ │♥ 412   │                      │
│  │💬 12   │ │💬 8    │ │💬 23   │                      │
│  └────────┘ └────────┘ └────────┘                      │
│  ┌────────┐ ┌────────┐ ┌────────┐                      │
│  │[post 4]│ │[post 5]│ │[post 6]│                      │
│  └────────┘ └────────┘ └────────┘                      │
│                                                         │
│            [ Seguir @plenum → ]                         │
└─────────────────────────────────────────────────────────┘
```

### Textos fixos
- **Título:** `@plenum no Instagram`
- **Subtítulo:** `Acompanhe o que estamos fazendo`
- **CTA:** `Seguir @plenum no Instagram →`

### 🎬 GSAP — Instagram

```javascript
// 1. TÍTULO com efeito typewriter
gsap.to('.instagram-handle', {
  text: '@plenum no Instagram',
  duration: 1.2,
  ease: 'none',
  scrollTrigger: {
    trigger: '.instagram-section',
    start: 'top 75%'
  }
})

// 2. GRID — entrada em espiral (da esquerda superior para direita inferior)
const postOrder = [0, 1, 3, 2, 4, 5] // ordem diagonal
gsap.from(postOrder.map(i => `.instagram-post:nth-child(${i + 1})`), {
  opacity: 0,
  scale: 0.8,
  duration: 0.45,
  stagger: 0.08,
  ease: 'back.out(1.5)',
  scrollTrigger: {
    trigger: '.instagram-grid',
    start: 'top 80%'
  }
})

// 3. HOVER — overlay com curtidas/comentários
document.querySelectorAll('.instagram-post').forEach(post => {
  const overlay = post.querySelector('.instagram-overlay')
  const stats = post.querySelector('.instagram-stats')

  post.addEventListener('mouseenter', () => {
    gsap.to(overlay, { opacity: 1, duration: 0.25 })
    gsap.from(stats, { y: 10, opacity: 0, duration: 0.25 })
  })
  post.addEventListener('mouseleave', () => {
    gsap.to(overlay, { opacity: 0, duration: 0.2 })
  })
})
```

---

## FOOTER

### Estrutura visual
```
┌─────────────────────────────────────────────────────────┐
│  [Logo]     │  Plenum       │  Academy     │ Contato    │
│  Tagline    │  Sobre        │  Events      │ Endereço   │
│             │  Consultoria  │  Blog        │ WhatsApp   │
│  [redes]    │  Corporativa  │  Insights    │ E-mail     │
│             │  GovTech      │              │            │
│─────────────────────────────────────────────────────────│
│  Newsletter: [seu e-mail...]         [Assinar →]        │
│─────────────────────────────────────────────────────────│
│  © 2026 Plenum  |  CNPJ  |  Privacidade  |  Termos     │
└─────────────────────────────────────────────────────────┘
```

### Textos fixos
- **Tagline:** `Escola global de liderança e inovação para o setor público`
- **Newsletter label:** `Receba conteúdos exclusivos sobre gestão e liderança pública`
- **Newsletter placeholder:** `Seu melhor e-mail`
- **Newsletter CTA:** `Assinar →`
- **Newsletter sucesso:** `✓ Obrigado! Você receberá nosso conteúdo em breve.`
- **Rodapé legal:** `© 2026 Plenum Brasil. Todos os direitos reservados.`

### 🎬 GSAP — Footer

```javascript
// 1. COLUNAS — entrada de baixo com stagger
gsap.from('.footer-column', {
  opacity: 0,
  y: 30,
  duration: 0.5,
  stagger: 0.1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.footer',
    start: 'top 90%'
  }
})

// 2. NEWSLETTER — animação de sucesso
function handleNewsletterSuccess() {
  gsap.timeline()
    .to('.newsletter-input', { opacity: 0, x: -20, duration: 0.3 })
    .to('.newsletter-btn', { opacity: 0, x: 20, duration: 0.3 }, '<')
    .from('.newsletter-success', {
      opacity: 0,
      scale: 0.9,
      duration: 0.4,
      ease: 'back.out(1.5)'
    })
}

// 3. LOGO — hover sutil
const footerLogo = document.querySelector('.footer-logo')
footerLogo.addEventListener('mouseenter', () => {
  gsap.to(footerLogo, { scale: 1.03, duration: 0.2 })
})
footerLogo.addEventListener('mouseleave', () => {
  gsap.to(footerLogo, { scale: 1, duration: 0.2 })
})
```

---

## ANIMAÇÕES GLOBAIS (em toda a página)

```javascript
// CURSOR CUSTOMIZADO (opcional — premium touch)
const cursor = document.querySelector('.custom-cursor')
const cursorDot = document.querySelector('.cursor-dot')

window.addEventListener('mousemove', (e) => {
  gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.6, ease: 'power3.out' })
  gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.1 })
})

// Aumenta cursor sobre links/botões
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 2.5, duration: 0.3 }))
  el.addEventListener('mouseleave', () => gsap.to(cursor, { scale: 1, duration: 0.3 }))
})

// GRAIN OVERLAY — textura estática no hero
// Implementar via canvas animado ou filtro SVG feTurbulence

// PAGE TRANSITION — ao navegar entre páginas
function pageLeave() {
  return gsap.timeline()
    .to('.page-transition-overlay', {
      clipPath: 'inset(0 0 0 0)',
      duration: 0.5,
      ease: 'power3.inOut'
    })
}

function pageEnter() {
  return gsap.timeline()
    .from('.page-transition-overlay', {
      clipPath: 'inset(0 0 0 100%)',
      duration: 0.5,
      ease: 'power3.inOut',
      delay: 0.1
    })
}
```

---

## CHECKLIST DE ANIMAÇÕES

```
Hero:
- [ ] Entrada de página (timeline principal com SplitText)
- [ ] Palavra "transformam" em cor dourada
- [ ] Auto-advance das tabs com barra de progresso
- [ ] Troca de tab com fadeIn do card
- [ ] Parallax do vídeo ao scroll
- [ ] Scroll indicator pulsando + some ao scrollar
- [ ] Hover no CTA com arrow

Events:
- [ ] Título com SplitText rotateX
- [ ] Cards em cascata ao entrar na viewport
- [ ] Hover: card sobe + imagem zoom

Academy:
- [ ] Título com clip-path reveal
- [ ] Chips de filtro em cascata horizontal
- [ ] Chip ativo com transição de cor
- [ ] Cards em stagger ao entrar
- [ ] Fade out → filtrar → fade in ao trocar filtro
- [ ] Hover: card sobe + imagem zoom + foto professor

Prova Social:
- [ ] CountUp animado nos contadores
- [ ] Hover nos counter cards com brilho dourado
- [ ] Marquee infinito dos logos
- [ ] Pausa do marquee no hover
- [ ] Transição entre depoimentos

Consultoria / Corporativa:
- [ ] Clip-path reveal na imagem
- [ ] Stagger no conteúdo textual
- [ ] Ícone check animado nos bullets
- [ ] Hover nos benefit cards com rotação do ícone
- [ ] Parallax na imagem

Blog:
- [ ] Linha separadora crescendo
- [ ] Cards com leve rotação na entrada
- [ ] Hover: imagem zoom + arrow move

Instagram:
- [ ] Typewriter no título @plenum
- [ ] Entrada em espiral nos posts
- [ ] Hover com overlay de curtidas/comentários

Footer:
- [ ] Colunas em stagger
- [ ] Animação de sucesso na newsletter

Global:
- [ ] Cursor customizado (opcional)
- [ ] Page transition overlay
```
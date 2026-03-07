# 🔌 AGENTE 06 — INTEGRATIONS
## Plenum 2026 | Especialista: Serviços Externos + Tracking + SEO

---

## IDENTIDADE

Você é o **Integrations Engineer do projeto Plenum**. Sua responsabilidade é conectar o sistema a todos os serviços externos: upload de mídia, envio de e-mail, rastreamento de analytics, pixels de conversão e SEO técnico.

**Você não escreve componentes visuais. Você não mexe no banco diretamente.**
Você entrega wrappers, helpers e configurações que os outros agentes consomem.

---

## SEUS ENTREGÁVEIS

```
/lib/
  uploadthing.ts               ← config do Uploadthing
  automation.ts                ← follow-up via Resend
  analytics.ts                 ← helpers GA4 client-side
  seo.ts                       ← helpers generateMetadata

/app/
  api/uploadthing/route.ts     ← endpoint do Uploadthing
  (site)/layout.tsx            ← Pixel + GA4 via next/script

/components/
  Analytics.tsx                ← componente com scripts de tracking
  MetaPixel.tsx                ← componente Meta Pixel
```

---

## UPLOADTHING

```typescript
// lib/uploadthing.ts
import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

export const ourFileRouter = {
  // Upload de imagem de professor
  professorImage: f({ image: { maxFileSize: '2MB' } })
    .middleware(async () => {
      // Verificar sessão admin aqui
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url }
    }),

  // Upload de capa de curso
  courseImage: f({ image: { maxFileSize: '4MB' } })
    .middleware(async () => ({ }))
    .onUploadComplete(async ({ file }) => ({ url: file.url })),

  // Upload de folder PDF
  coursePDF: f({ pdf: { maxFileSize: '8MB' } })
    .middleware(async () => ({ }))
    .onUploadComplete(async ({ file }) => ({ url: file.url })),

  // Upload de logo parceiro
  logoImage: f({ image: { maxFileSize: '1MB' } })
    .middleware(async () => ({ }))
    .onUploadComplete(async ({ file }) => ({ url: file.url })),

  // Upload de foto de autoridade/depoimento
  personImage: f({ image: { maxFileSize: '2MB' } })
    .middleware(async () => ({ }))
    .onUploadComplete(async ({ file }) => ({ url: file.url })),
}

export type OurFileRouter = typeof ourFileRouter
```

---

## RESEND — FOLLOW-UP AUTOMÁTICO

```typescript
// lib/automation.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface FollowUpParams {
  leadName: string
  leadEmail: string
  courseName: string
  turmaDate: Date
  turmaCity: string
  courseSlug: string
  folderUrl: string
  customMessage?: string | null
}

export async function sendFolderFollowUp(params: FollowUpParams) {
  const {
    leadName, leadEmail, courseName,
    turmaDate, turmaCity, courseSlug,
    folderUrl, customMessage
  } = params

  const defaultMessage = `Olá ${leadName}, obrigado pelo interesse em ${courseName}! Seu material está disponível para download.`

  const message = customMessage
    ?.replace('{nome}', leadName)
    ?.replace('{curso}', courseName)
    ?.replace('{data}', formatDate(turmaDate))
    ?.replace('{cidade}', turmaCity)
    ?? defaultMessage

  const html = buildEmailHTML({
    leadName,
    courseName,
    message,
    courseSlug,
    folderUrl,
    turmaDate,
    turmaCity,
  })

  const { data, error } = await resend.emails.send({
    from: process.env.FOLLOW_UP_SENDER ?? 'noreply@plenum.com.br',
    to: leadEmail,
    subject: `Seu material sobre ${courseName} — Plenum`,
    html,
  })

  if (error) {
    console.error('[Resend] Erro no follow-up:', error)
    // Não lança erro — follow-up não deve bloquear o download
  }

  return { success: !error }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  }).format(new Date(date))
}

function buildEmailHTML(params: {
  leadName: string
  courseName: string
  message: string
  courseSlug: string
  folderUrl: string
  turmaDate: Date
  turmaCity: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width">
    </head>
    <body style="margin:0;padding:0;background:#09090b;font-family:DM Sans,sans-serif;color:#fafafa;">
      <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
        <!-- Logo -->
        <div style="margin-bottom:32px;">
          <img src="https://plenum.com.br/logo.png" alt="Plenum" height="40">
        </div>
        
        <!-- Conteúdo -->
        <h2 style="font-size:24px;font-weight:700;margin:0 0 16px;">${params.courseName}</h2>
        <p style="color:#a1a1aa;margin:0 0 24px;line-height:1.6;">${params.message}</p>
        
        <!-- Info da turma -->
        <div style="background:#141418;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;margin-bottom:24px;">
          <p style="margin:0 0 8px;font-size:14px;color:#a1a1aa;">📅 ${formatDate(params.turmaDate)}</p>
          <p style="margin:0;font-size:14px;color:#a1a1aa;">📍 ${params.turmaCity}</p>
        </div>
        
        <!-- CTA Download -->
        <a href="${params.folderUrl}" 
           style="display:inline-block;background:#C9A227;color:#000;font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;margin-bottom:16px;">
          📄 Baixar material do curso
        </a>
        
        <!-- CTA Ver mais -->
        <br>
        <a href="https://plenum.com.br/academy/${params.courseSlug}"
           style="display:inline-block;border:1px solid rgba(255,255,255,0.2);color:#fafafa;padding:12px 24px;border-radius:10px;text-decoration:none;font-size:14px;">
          Ver detalhes do curso →
        </a>
        
        <!-- Rodapé -->
        <div style="margin-top:48px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.08);">
          <p style="font-size:12px;color:#52525b;margin:0;">
            Plenum — Escola de Liderança e Performance para o Setor Público<br>
            Para cancelar o recebimento de e-mails, clique aqui.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}
```

---

## META PIXEL + GA4

```tsx
// components/Analytics.tsx
'use client'
import Script from 'next/script'

export function Analytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID
  const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

  return (
    <>
      {/* Google Analytics 4 */}
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { page_path: window.location.pathname });
            `}
          </Script>
        </>
      )}

      {/* Meta Pixel */}
      {PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){...}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  )
}

// lib/analytics.ts — helpers client-side
export function trackCourseView(courseTitle: string, turmaCity: string) {
  if (typeof window === 'undefined') return
  // GA4
  window.gtag?.('event', 'course_view', { course_name: courseTitle, turma_city: turmaCity })
  // Meta Pixel
  window.fbq?.('track', 'ViewContent', { content_name: courseTitle })
}

export function trackFolderDownload(courseTitle: string) {
  window.gtag?.('event', 'folder_download', { course_name: courseTitle })
  window.fbq?.('track', 'Lead', { content_name: courseTitle })
}

export function trackLeadCapture(source: string, courseTitle?: string) {
  window.gtag?.('event', 'lead_capture', { source, course_name: courseTitle })
  window.fbq?.('track', 'CompleteRegistration', { content_name: courseTitle })
}

export function trackNewsletterSignup() {
  window.gtag?.('event', 'newsletter_signup')
  window.fbq?.('track', 'Subscribe')
}
```

---

## SEO — generateMetadata

```typescript
// lib/seo.ts
import { Metadata } from 'next'

const BASE_URL = 'https://plenum.com.br'
const DEFAULT_OG = `${BASE_URL}/og-default.jpg`

export function buildMetadata({
  title,
  description,
  image,
  path,
}: {
  title: string
  description: string
  image?: string
  path?: string
}): Metadata {
  const url = path ? `${BASE_URL}${path}` : BASE_URL
  const ogImage = image ?? DEFAULT_OG

  return {
    title: `${title} | Plenum`,
    description,
    metadataBase: new URL(BASE_URL),
    openGraph: {
      title: `${title} | Plenum`,
      description,
      url,
      siteName: 'Plenum',
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Plenum`,
      description,
      images: [ogImage],
    },
    alternates: { canonical: url },
  }
}

// Uso em cada page.tsx:
// export async function generateMetadata({ params }): Promise<Metadata> {
//   const course = await getCourseBySlug(params.slug)
//   return buildMetadata({
//     title: course.title,
//     description: course.subtitle ?? course.description.slice(0, 160),
//     image: course.coverImageUrl,
//     path: `/academy/${course.slug}`,
//   })
// }
```

---

## SITEMAP E ROBOTS

```typescript
// app/sitemap.ts
import { prisma } from '@/lib/db'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await prisma.course.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } })
  const posts = await prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } })

  return [
    { url: 'https://plenum.com.br', lastModified: new Date() },
    { url: 'https://plenum.com.br/academy', lastModified: new Date() },
    { url: 'https://plenum.com.br/blog', lastModified: new Date() },
    ...courses.map(c => ({ url: `https://plenum.com.br/academy/${c.slug}`, lastModified: c.updatedAt })),
    ...posts.map(p => ({ url: `https://plenum.com.br/blog/${p.slug}`, lastModified: p.updatedAt })),
  ]
}

// app/robots.ts
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin/' },
    sitemap: 'https://plenum.com.br/sitemap.xml',
  }
}
```

---

## CHECKLIST DE ENTREGA

```
- [ ] Uploadthing configurado e testado (upload de imagem funcionando)
- [ ] Resend: e-mail de follow-up enviando corretamente
- [ ] Follow-up com variáveis {nome}, {curso}, {data}, {cidade} funcionando
- [ ] E-mail template visualmente correto (testado no Litmus ou similar)
- [ ] GA4 instalado e eventos customizados disparando
- [ ] Meta Pixel instalado e evento Lead disparando no download
- [ ] generateMetadata implementado em todas as páginas públicas
- [ ] sitemap.xml gerado dinamicamente
- [ ] robots.txt bloqueando /admin/*
- [ ] .env.example com todas as variáveis documentadas
- [ ] MASTER notificado com lista de integrações ativas
```

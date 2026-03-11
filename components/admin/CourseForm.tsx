'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, ExternalLink } from 'lucide-react';
import { createCourse, updateCourse, revalidateCoursePage } from '@/lib/actions/courses';
import type { Course } from '@/types/course';
import type { UserRole } from '@/types/user-roles';

import TabGeral from './course-tabs/TabGeral';
import TabHero from './course-tabs/TabHero';
import TabSobre from './course-tabs/TabSobre';
import TabPublico from './course-tabs/TabPublico';
import TabInvestimento from './course-tabs/TabInvestimento';
import TabDepoimentos from './course-tabs/TabDepoimentos';
import TabMidias from './course-tabs/TabMidias';
import TabSeo from './course-tabs/TabSeo';

interface Props {
  course?: Course;
  designSystems: Array<{ id: string; name: string; is_default: boolean }>;
  role?: UserRole;
}

export default function CourseForm({ course, designSystems, role = 'dev' }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditing = !!course;

  // Read tab from URL params
  const urlTab = searchParams.get('tab') || 'geral';
  const [activeTab, setActiveTab] = useState(urlTab);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ── Form state ──
  // Geral
  const [slug, setSlug] = useState(course?.slug || '');
  const [title, setTitle] = useState(course?.title || '');
  const [subtitle, setSubtitle] = useState(course?.subtitle || '');
  const [categoryLabel, setCategoryLabel] = useState(course?.category_label || 'Imersão');
  const [status, setStatus] = useState<string>(course?.status || 'draft');
  const [modality, setModality] = useState<string>(course?.modality || 'presencial');
  const [designSystemId, setDesignSystemId] = useState(course?.design_system_id || '');
  const [whatsappNumber, setWhatsappNumber] = useState(course?.whatsapp_number || '');
  const [whatsappMessage, setWhatsappMessage] = useState(course?.whatsapp_message || '');

  // Hero
  const [titleParts, setTitleParts] = useState(course?.title_parts || []);
  const [heroBadges, setHeroBadges] = useState(course?.hero_badges || []);
  const [heroFramesPath, setHeroFramesPath] = useState(course?.hero_frames_path || '/frames/frame_');
  const [heroFrameCount, setHeroFrameCount] = useState(course?.hero_frame_count || 192);
  const [heroFrameExt, setHeroFrameExt] = useState(course?.hero_frame_ext || '.jpg');

  // Sobre
  const [aboutHeading, setAboutHeading] = useState(course?.about_heading || '');
  const [aboutSubheading, setAboutSubheading] = useState(course?.about_subheading || '');
  const [aboutCards, setAboutCards] = useState(course?.about_cards || []);

  // Público-Alvo
  const [audienceCards, setAudienceCards] = useState(course?.audience_cards || []);
  const [audienceImages, setAudienceImages] = useState(course?.audience_images || []);

  // Investimento
  const [investmentHeading, setInvestmentHeading] = useState(course?.investment_heading || '');
  const [investmentSubtitle, setInvestmentSubtitle] = useState(course?.investment_subtitle || '');
  const [includedItems, setIncludedItems] = useState(course?.included_items || []);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(course?.background_image_url || '');
  const [productImageUrl, setProductImageUrl] = useState(course?.product_image_url || '');

  // Depoimentos
  const [testimonials, setTestimonials] = useState(course?.testimonials || []);

  // Mídias
  const [partnerLogos, setPartnerLogos] = useState(course?.partner_logos || []);
  const [folderPdfUrl, setFolderPdfUrl] = useState(course?.folder_pdf_url || '');
  const [coverImageUrl, setCoverImageUrl] = useState(course?.cover_image_url || '');
  const [folderBgUrl, setFolderBgUrl] = useState(course?.section_backgrounds?.folder || '');

  // SEO
  const [metaTitle, setMetaTitle] = useState(course?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(course?.meta_description || '');
  const [ogImageUrl, setOgImageUrl] = useState(course?.og_image_url || '');

  // ── Save ──
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const data: Record<string, unknown> = {
      slug,
      title,
      subtitle: subtitle || null,
      category_label: categoryLabel || null,
      status,
      modality,
      design_system_id: designSystemId || null,
      whatsapp_number: whatsappNumber || null,
      whatsapp_message: whatsappMessage || null,
      title_parts: titleParts.length > 0 ? titleParts : null,
      hero_badges: heroBadges,
      hero_frames_path: heroFramesPath || null,
      hero_frame_count: heroFrameCount || null,
      hero_frame_ext: heroFrameExt || null,
      about_heading: aboutHeading || null,
      about_subheading: aboutSubheading || null,
      about_cards: aboutCards,
      audience_cards: audienceCards,
      audience_images: audienceImages,
      investment_heading: investmentHeading || null,
      investment_subtitle: investmentSubtitle || null,
      included_items: includedItems,
      background_image_url: backgroundImageUrl || null,
      product_image_url: productImageUrl || null,
      testimonials,
      partner_logos: partnerLogos,
      folder_pdf_url: folderPdfUrl || null,
      cover_image_url: coverImageUrl || null,
      section_backgrounds: {
        ...(course?.section_backgrounds || {}),
        folder: folderBgUrl || undefined,
      },
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      og_image_url: ogImageUrl || null,
    };

    if (isEditing && course) {
      const result = await updateCourse(course.id, data);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Curso atualizado com sucesso!' });
        if (course.status === 'published') {
          await revalidateCoursePage(slug);
        }
        router.refresh();
      }
    } else {
      const result = await createCourse(data);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else if (result.data) {
        setMessage({ type: 'success', text: 'Curso criado com sucesso!' });
        router.push(`/admin/cursos/${result.data.id}`);
      }
    }

    setSaving(false);
  };

  return (
    <div className="space-y-4">
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="sobre">Sobre</TabsTrigger>
            <TabsTrigger value="publico">Público</TabsTrigger>
            <TabsTrigger value="investimento">Investimento</TabsTrigger>
            <TabsTrigger value="depoimentos">Depoimentos</TabsTrigger>
            {role === 'dev' && <TabsTrigger value="midias">Mídias</TabsTrigger>}
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 shrink-0">
            {isEditing && course?.status === 'published' && (
              <Button variant="outline" size="sm" asChild>
                <a href={`/cursos/${slug}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-1" /> Ver Página
                </a>
              </Button>
            )}
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>

        <TabsContent value="geral">
          <TabGeral
            slug={slug} setSlug={setSlug}
            title={title} setTitle={setTitle}
            subtitle={subtitle} setSubtitle={setSubtitle}
            categoryLabel={categoryLabel} setCategoryLabel={setCategoryLabel}
            status={status} setStatus={setStatus}
            modality={modality} setModality={setModality}
            designSystemId={designSystemId} setDesignSystemId={setDesignSystemId}
            whatsappNumber={whatsappNumber} setWhatsappNumber={setWhatsappNumber}
            whatsappMessage={whatsappMessage} setWhatsappMessage={setWhatsappMessage}
            designSystems={designSystems}
            role={role}
          />
        </TabsContent>

        <TabsContent value="hero">
          <TabHero
            titleParts={titleParts} setTitleParts={setTitleParts}
            heroBadges={heroBadges} setHeroBadges={setHeroBadges}
            heroFramesPath={heroFramesPath} setHeroFramesPath={setHeroFramesPath}
            heroFrameCount={heroFrameCount} setHeroFrameCount={setHeroFrameCount}
            heroFrameExt={heroFrameExt} setHeroFrameExt={setHeroFrameExt}
            role={role}
          />
        </TabsContent>

        <TabsContent value="sobre">
          <TabSobre
            aboutHeading={aboutHeading} setAboutHeading={setAboutHeading}
            aboutSubheading={aboutSubheading} setAboutSubheading={setAboutSubheading}
            aboutCards={aboutCards} setAboutCards={setAboutCards}
          />
        </TabsContent>

        <TabsContent value="publico">
          <TabPublico
            audienceCards={audienceCards} setAudienceCards={setAudienceCards}
            audienceImages={audienceImages} setAudienceImages={setAudienceImages}
            role={role}
          />
        </TabsContent>

        <TabsContent value="investimento">
          <TabInvestimento
            investmentHeading={investmentHeading} setInvestmentHeading={setInvestmentHeading}
            investmentSubtitle={investmentSubtitle} setInvestmentSubtitle={setInvestmentSubtitle}
            includedItems={includedItems} setIncludedItems={setIncludedItems}
            backgroundImageUrl={backgroundImageUrl} setBackgroundImageUrl={setBackgroundImageUrl}
            productImageUrl={productImageUrl} setProductImageUrl={setProductImageUrl}
            courseSlug={slug}
            role={role}
          />
        </TabsContent>

        <TabsContent value="depoimentos">
          <TabDepoimentos
            testimonials={testimonials} setTestimonials={setTestimonials}
          />
        </TabsContent>

        <TabsContent value="midias">
          <TabMidias
            partnerLogos={partnerLogos} setPartnerLogos={setPartnerLogos}
            folderPdfUrl={folderPdfUrl} setFolderPdfUrl={setFolderPdfUrl}
            coverImageUrl={coverImageUrl} setCoverImageUrl={setCoverImageUrl}
            folderBgUrl={folderBgUrl} setFolderBgUrl={setFolderBgUrl}
            courseSlug={slug}
            courseId={course?.id}
          />
        </TabsContent>

        <TabsContent value="seo">
          <TabSeo
            metaTitle={metaTitle} setMetaTitle={setMetaTitle}
            metaDescription={metaDescription} setMetaDescription={setMetaDescription}
            ogImageUrl={ogImageUrl} setOgImageUrl={setOgImageUrl}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

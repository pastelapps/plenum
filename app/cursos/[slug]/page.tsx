import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCourseBySlug, getPublishedCourses } from '@/lib/queries/courses';
import { getCompanySettings } from '@/lib/queries/company';
import { getShaderColors } from '@/lib/design-system';

import DesignSystemProvider from '@/components/dynamic/DesignSystemProvider';
import Header from '@/components/dynamic/Header';
import Hero from '@/components/dynamic/Hero';
import About from '@/components/dynamic/About';
import TargetAudience from '@/components/dynamic/TargetAudience';
import Stats from '@/components/dynamic/Stats';
import Program from '@/components/dynamic/Program';
import Teachers from '@/components/dynamic/Teachers';
import WorkloadPayment from '@/components/dynamic/WorkloadPayment';
import FolderForm from '@/components/dynamic/FolderForm';
import Location from '@/components/dynamic/Location';
import SocialProof from '@/components/dynamic/SocialProof';
import Footer from '@/components/dynamic/Footer';

// ─── ISR ───────────────────────────────────────────────
export const revalidate = 3600; // Revalidate every hour

// ─── Static params (pre-build published courses) ──────
export async function generateStaticParams() {
  const courses = await getPublishedCourses();
  return courses.map((course) => ({ slug: course.slug }));
}

// ─── Dynamic metadata ─────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: 'Curso não encontrado' };

  return {
    title: course.meta_title || `${course.title} | Instituto Plenum Brasil`,
    description: course.meta_description || course.subtitle || '',
    openGraph: {
      title: course.meta_title || course.title,
      description: course.meta_description || course.subtitle || '',
      images: course.og_image_url ? [{ url: course.og_image_url }] : [],
    },
  };
}

// ─── Page ─────────────────────────────────────────────
export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [course, company] = await Promise.all([
    getCourseBySlug(slug),
    getCompanySettings(),
  ]);

  if (!course || course.status !== 'published') {
    notFound();
  }

  const designSystem = course.design_system;
  if (!designSystem) {
    notFound();
  }

  // Derive data from course + dates
  const shaderColors = getShaderColors(designSystem);

  // Get turma labels from course_dates
  const turmaLabels = course.dates
    .filter((d) => d.status === 'open')
    .map((d) => d.label || `${new Date(d.start_date).toLocaleDateString('pt-BR')} a ${new Date(d.end_date).toLocaleDateString('pt-BR')}`);

  // Get program days from first open course_date (or first available)
  const activeCourseDate = course.dates.find((d) => d.status === 'open') || course.dates[0];
  const programDays = activeCourseDate?.program_days || [];

  // Get first instructor
  const instructor = activeCourseDate?.instructor;

  // Build WhatsApp URL
  const whatsappUrl = course.whatsapp_number
    ? `https://wa.me/${course.whatsapp_number.replace(/\D/g, '')}${course.whatsapp_message ? `?text=${encodeURIComponent(course.whatsapp_message)}` : ''}`
    : 'https://wa.me/553125311776';

  // Location info from active course date
  const locationVenue = activeCourseDate?.location_venue || '';
  const locationAddress = activeCourseDate?.location_address || '';
  const locationMapEmbed = activeCourseDate?.location_map_embed || '';
  const locationExtra = activeCourseDate?.location_extra || [];

  return (
    <DesignSystemProvider designSystem={designSystem}>
      <main className="min-h-screen w-full flex flex-col relative" style={{ backgroundColor: 'var(--ds-background)' }}>
        <Header
          logoUrl={company.logo_url || '/logo-plenum-aberta2.png'}
          logoDarkUrl={company.logo_dark_url || '/logo.svg'}
        />

        <Hero
          title={course.title}
          subtitle={course.subtitle}
          categoryLabel={course.category_label}
          titleParts={course.title_parts}
          turmas={turmaLabels}
          heroBadges={course.hero_badges}
          framesPath={course.hero_frames_path}
          frameCount={course.hero_frame_count}
          frameExt={course.hero_frame_ext}
          folderPdfUrl={course.folder_pdf_url}
          ctaText="Quero me inscrever"
        />

        <About
          cards={course.about_cards}
          heading={course.about_heading || undefined}
          subheading={course.about_subheading || undefined}
        />

        <TargetAudience
          audiences={course.audience_cards}
          cells={course.audience_images?.map((img, i) => ({
            src: img.url,
            xDir: i === 0 ? -1 : i <= 2 ? 1 : i === 3 ? -1 : 0,
            yDir: i <= 1 ? -1 : 1,
            sizes: i === 0 ? '75vw' : i <= 2 ? '25vw' : '37vw',
          })) || []}
        />

        <div className="mt-[100px]" />

        <Stats logos={course.partner_logos} />

        {programDays.length > 0 && (
          <Program
            days={programDays}
            heading={course.program_heading || undefined}
            description={course.program_description || undefined}
            shaderColors={shaderColors.colorbends}
          />
        )}

        {/* Blur transition between Program and Teachers — only when Program exists */}
        {programDays.length > 0 && (
          <div className="relative h-0 overflow-visible pointer-events-none z-20">
            <div
              className="absolute inset-x-0 -top-16 h-32 backdrop-blur-2xl"
              style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 60%, transparent 100%)' }}
            />
          </div>
        )}

        {instructor && (
          <Teachers instructor={instructor} />
        )}

        <WorkloadPayment
          heading={course.investment_heading || undefined}
          subtitle={course.investment_subtitle || undefined}
          items={course.included_items}
          whatsappUrl={whatsappUrl}
          backgroundImageUrl={course.background_image_url || undefined}
          productImageUrl={course.product_image_url || undefined}
        />

        <FolderForm
          courseId={course.id}
          courseDateId={activeCourseDate?.id}
          pdfUrl={course.folder_pdf_url}
          backgroundImageUrl={course.section_backgrounds?.folder || undefined}
        />

        {/* Location — only render for presencial/hibrido */}
        {course.modality !== 'online' && locationVenue && locationMapEmbed && (
          <Location
            venue={locationVenue}
            address={locationAddress}
            mapEmbed={locationMapEmbed}
            locationExtra={locationExtra}
            phones={company.phones}
          />
        )}

        <SocialProof
          testimonials={course.testimonials}
          company={company}
          courseId={course.id}
          courseDateId={activeCourseDate?.id}
          whatsappUrl={whatsappUrl}
          grainientColors={shaderColors.grainient}
        />

        <Footer
          company={company}
          logoUrl={company.logo_url || '/logo-plenum-aberta2.png'}
        />

        {/* WhatsApp floating button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_4px_30px_rgba(37,211,102,0.6)] hover:scale-110 transition-all duration-300"
          style={{ backgroundColor: 'var(--ds-whatsapp, #25D366)' }}
          aria-label="Falar pelo WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </main>
    </DesignSystemProvider>
  );
}

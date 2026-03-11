import { createClient } from '@supabase/supabase-js';
import type {
  CourseData,
  CourseDateData,
  InstructorData,
  DesignSystemData,
  CompanyData,
} from './types.ts';

interface FetchResult {
  course: CourseData;
  courseDate: CourseDateData;
  instructors: InstructorData[];
  ds: DesignSystemData;
  company: CompanyData;
}

function ts(): string {
  return new Date().toISOString();
}

/**
 * Fetch all data needed to generate the PDF.
 * Uses SERVICE_ROLE_KEY to bypass RLS.
 */
export async function fetchPdfData(
  courseId: string,
  courseDateId: string,
): Promise<FetchResult> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  console.log(`[${ts()}] [DATA] Creating admin client (URL: ${supabaseUrl})`);
  const supabase = createClient(supabaseUrl, serviceKey);

  // Fetch course
  console.log(`[${ts()}] [DATA] Fetching course id=${courseId}...`);
  const { data: course, error: courseErr } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();

  if (courseErr || !course) {
    console.error(`[${ts()}] [DATA] ✗ Course fetch FAILED:`, courseErr?.message || 'No data returned');
    throw new Error(`Course not found: ${courseErr?.message || courseId}`);
  }
  console.log(`[${ts()}] [DATA] ✓ Course: "${course.title}" (slug: ${course.slug})`);

  // Fetch course date (turma)
  console.log(`[${ts()}] [DATA] Fetching course_date id=${courseDateId}...`);
  const { data: courseDate, error: dateErr } = await supabase
    .from('course_dates')
    .select('*')
    .eq('id', courseDateId)
    .single();

  if (dateErr || !courseDate) {
    console.error(`[${ts()}] [DATA] ✗ Course date fetch FAILED:`, dateErr?.message || 'No data returned');
    throw new Error(`Course date not found: ${dateErr?.message || courseDateId}`);
  }
  console.log(`[${ts()}] [DATA] ✓ Course date: ${courseDate.start_date} → ${courseDate.end_date} (label: "${courseDate.label}")`);
  console.log(`[${ts()}] [DATA]   instructor_ids: ${JSON.stringify(courseDate.instructor_ids)}`);
  console.log(`[${ts()}] [DATA]   program_days: ${courseDate.program_days?.length || 0} days`);
  console.log(`[${ts()}] [DATA]   location_venue: ${courseDate.location_venue || 'NULL'}`);

  // Fetch instructors from the turma's instructor_ids
  const instructorIds: string[] = courseDate.instructor_ids || [];
  let instructors: InstructorData[] = [];
  if (instructorIds.length > 0) {
    console.log(`[${ts()}] [DATA] Fetching ${instructorIds.length} instructors...`);
    const { data: instructorRows, error: instErr } = await supabase
      .from('instructors')
      .select('id, name, role, bio, photo_url')
      .in('id', instructorIds);

    if (instErr) {
      console.warn(`[${ts()}] [DATA] ⚠ Instructors fetch warning:`, instErr.message);
    }
    instructors = (instructorRows || []) as InstructorData[];
    console.log(`[${ts()}] [DATA] ✓ ${instructors.length} instructors: ${instructors.map(i => `"${i.name}" (photo: ${i.photo_url ? 'yes' : 'no'})`).join(', ')}`);
  } else {
    console.log(`[${ts()}] [DATA] ⊘ No instructor_ids on this turma`);
  }

  // Fetch design system
  let ds: DesignSystemData;
  if (course.design_system_id) {
    console.log(`[${ts()}] [DATA] Fetching design_system id=${course.design_system_id}...`);
    const { data: dsRow, error: dsErr } = await supabase
      .from('design_systems')
      .select('*')
      .eq('id', course.design_system_id)
      .single();

    if (dsErr) console.warn(`[${ts()}] [DATA] ⚠ Design system error:`, dsErr.message);
    ds = dsRow as DesignSystemData;
  } else {
    console.log(`[${ts()}] [DATA] No design_system_id, fetching default...`);
    const { data: dsRow, error: dsErr } = await supabase
      .from('design_systems')
      .select('*')
      .eq('is_default', true)
      .single();

    if (dsErr) console.warn(`[${ts()}] [DATA] ⚠ Default DS error:`, dsErr.message);
    ds = dsRow as DesignSystemData;
  }

  if (!ds) {
    console.error(`[${ts()}] [DATA] ✗ No design system found!`);
    throw new Error('No design system found');
  }
  console.log(`[${ts()}] [DATA] ✓ Design system: primary=${ds.color_primary}, bg=${ds.color_background}, heading="${ds.font_heading}", body="${ds.font_body}"`);
  console.log(`[${ts()}] [DATA]   font_heading_urls: ${ds.font_heading_urls?.length || 0}, font_body_urls: ${ds.font_body_urls?.length || 0}`);

  // Fetch company settings
  console.log(`[${ts()}] [DATA] Fetching company_settings...`);
  const { data: companyRow, error: compErr } = await supabase
    .from('company_settings')
    .select('*')
    .limit(1)
    .single();

  if (compErr) console.warn(`[${ts()}] [DATA] ⚠ Company settings warning:`, compErr.message);

  const company: CompanyData = companyRow || {
    company_name: 'Instituto Plenum Brasil',
    logo_url: null,
    logo_dark_url: null,
    phones: [],
    emails: [],
    website: null,
    address: null,
  };
  console.log(`[${ts()}] [DATA] ✓ Company: "${company.company_name}", logo=${company.logo_url || 'NULL'}, website=${company.website || 'NULL'}`);

  console.log(`[${ts()}] [DATA] ✓ All data fetched successfully`);
  return {
    course: course as CourseData,
    courseDate: courseDate as CourseDateData,
    instructors,
    ds,
    company: company as CompanyData,
  };
}

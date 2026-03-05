import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * On-demand revalidation endpoint.
 * Called from admin panel after editing a course.
 *
 * POST /api/revalidate
 * Body: { slug: string, secret: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, secret } = body;

    // Validate secret (use SUPABASE_SERVICE_ROLE_KEY as revalidation secret)
    const expectedSecret = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Invalid revalidation secret' },
        { status: 401 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: 'Missing slug parameter' },
        { status: 400 }
      );
    }

    // Revalidate the specific course page
    revalidatePath(`/cursos/${slug}`);

    // Also revalidate homepage (if it lists courses)
    revalidatePath('/');

    return NextResponse.json({
      revalidated: true,
      slug,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Revalidation error:', err);
    return NextResponse.json(
      { error: 'Error revalidating' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      course_id,
      course_date_id,
      form_type,
      nome,
      email,
      whatsapp,
      estado,
      cidade,
      orgao,
    } = body;

    // Validate required fields
    if (!course_id || !form_type || !nome || !email) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: course_id, form_type, nome, email' },
        { status: 400 }
      );
    }

    // Validate form_type
    if (!['folder', 'in_company', 'notification'].includes(form_type)) {
      return NextResponse.json(
        { error: 'form_type inválido. Use: folder, in_company ou notification' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // ── Check if lead already exists for this course + email ──
    const { data: existing } = await supabase
      .from('leads')
      .select('id, created_at')
      .eq('course_id', course_id)
      .eq('email', email)
      .limit(1)
      .maybeSingle();

    if (existing) {
      // Lead already exists — just return success so frontend allows PDF download
      return NextResponse.json(
        { success: true, existing: true, lead_id: existing.id },
        { status: 200 }
      );
    }

    // ── Create new lead ──
    const lead = {
      course_id,
      course_date_id: course_date_id || null,
      form_type,
      nome,
      email,
      whatsapp: whatsapp || null,
      estado: estado || null,
      cidade: cidade || null,
      orgao: orgao || null,
    };

    const { data: newLead, error } = await supabase
      .from('leads')
      .insert(lead as any)
      .select('id')
      .single();

    if (error) {
      console.error('Error inserting lead:', error);
      return NextResponse.json(
        { error: 'Erro ao salvar dados. Tente novamente.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, existing: false, lead_id: (newLead as any)?.id },
      { status: 201 }
    );
  } catch (err) {
    console.error('Leads API error:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

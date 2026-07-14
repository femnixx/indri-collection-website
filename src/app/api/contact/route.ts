import { NextResponse } from 'next/server';
import { supabaseData } from '@/lib/supabaseClient';

export async function GET() {
  const { data, error } = await supabaseData
    .from('contact_info')
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

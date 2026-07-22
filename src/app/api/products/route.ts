import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
export const dynamic = 'force-dynamic';
export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // image_url is already a visitable URL stored in the database
  return NextResponse.json(data);
}

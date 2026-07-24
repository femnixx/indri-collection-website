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
  const productsWithUrls = data.map((product) => {
    if (product.image_url) {
      const isFullUrl = product.image_url.startsWith('http');
      if (isFullUrl) return product;

      const { data: publicUrlData } = supabase.storage
        .from('products')
        .getPublicUrl(product.image_url);

      return { ...product, image_url: publicUrlData.publicUrl };
    }
    return product;
  });
  return NextResponse.json(productsWithUrls);
}

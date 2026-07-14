import { NextResponse } from 'next/server';
import { supabaseData } from '@/lib/supabaseClient';
export const dynamic = 'force-dynamic';
export async function GET() {
  const { data, error } = await supabaseData
    .from('products')
    .select('*, categories(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const productsWithUrls = data.map((product) => {
    if (product.image_url) {
      const { data: publicUrlData } = supabaseData.storage
        .from('product-images') 
        .getPublicUrl(product.image_url);

      return { ...product, image_url: publicUrlData.publicUrl };
    }
    return product;
  });
  return NextResponse.json(productsWithUrls);
}

import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`; 

    // Upload ke bucket 'product-images'
    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (error) throw error;

    // Dapetin URL publiknya
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    // Return using the correct data.publicUrl property
    return NextResponse.json({ success: true, url: data.publicUrl, filename: fileName });
  } catch (error: any) {
    console.error("[UPLOAD API ERROR]:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (error) throw error;

    // Dapetin URL publiknya
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return NextResponse.json({ success: true, url: imageUrl, filename: fileName });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


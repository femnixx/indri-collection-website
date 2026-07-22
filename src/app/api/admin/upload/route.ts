import { NextResponse } from 'next/server';
import { saveFile } from '@/lib/fileUpload';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string | null;
    const productName = formData.get('productName') as string | null;

    if (!file) return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });

    const fileExt = file.name.split('.').pop();
    // If a product name is provided, use it as the filename (sanitized).
    // Otherwise fall back to a timestamp + random string.
    const fileName = productName
      ? `${productName.replace(/\s+/g, '_').toLowerCase()}.${fileExt}`
      : `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const folderName = (folder || 'uncategorized').replace(/\s+/g, '_').toLowerCase();

    const buffer = Buffer.from(await file.arrayBuffer());
    const imageUrl = saveFile(folderName, buffer, fileName);

    return NextResponse.json({ success: true, url: imageUrl, filename: fileName });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

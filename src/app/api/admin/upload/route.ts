import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseServer";

async function isUserAdmin(userId: string) {
  const supabaseAdmin = createSupabaseAdminClient();
  const { data: admin } = await supabaseAdmin
    .from("admins")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  
  return admin?.role === "admin";
}

export async function POST(req: Request) {
  // 1. Authorize: Middleware provides x-user-id, we check if they are admin
  const userId = req.headers.get("x-user-id");
  if (!userId || !(await isUserAdmin(userId))) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'File tidak ditemukan' }, { status: 400 });
    }

    // 2. Use Admin Client to bypass Storage RLS
    const supabaseAdmin = createSupabaseAdminClient();
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`; 

    // Upload to 'products' bucket
    const { error: uploadError } = await supabaseAdmin.storage
      .from('products')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('products')
      .getPublicUrl(fileName);

    return NextResponse.json({ success: true, url: publicUrlData.publicUrl });
  } catch (error: any) {
    console.error("[UPLOAD ERROR]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
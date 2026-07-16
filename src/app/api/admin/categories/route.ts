import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { categoryService } from "@/services/categoryService";
import { categorySchema } from "@/validations/categorySchema";

async function validateAdminRole(supabase: any) {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return { isValid: false, status: 401, error: "Unauthorized: Sesi tidak valid atau telah berakhir." };
  }

  const userRole = user.app_metadata?.role || user.user_metadata?.role;
  if (userRole !== "admin") {
    return { isValid: false, status: 403, error: "Forbidden: Anda tidak memiliki akses admin." };
  }

  return { isValid: true, user };
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const auth = await validateAdminRole(supabase);
    if (!auth.isValid) return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });

    const json = await request.json();
    const parseResult = categorySchema.safeParse(json);
    if (!parseResult.success) return NextResponse.json({ error: parseResult.error.flatten().fieldErrors }, { status: 400 });

    // 1. Add category to database
    const data = await categoryService.addCategory(parseResult.data);
    
    // 2. Initialize folder in Supabase Storage with a dummy file
    const folderName = data.name.replace(/\s+/g, '_').toLowerCase();
    const { error: storageError } = await supabase.storage
      .from('products')
      .upload(`${folderName}/.keep`, new Blob([''], { type: 'text/plain' }));

    if (storageError) {
      console.error("Storage init error:", storageError);
      // Optional: If storage fails, you may want to delete the DB record here
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal membuat folder." }, { status: 500 });
  }
}
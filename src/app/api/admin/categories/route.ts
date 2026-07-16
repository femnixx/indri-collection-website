import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { categoryService } from "@/services/categoryService";
import { categorySchema } from "@/validations/categorySchema";

async function validateAdminRole(supabase: any) {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return { isValid: false, status: 401, error: "Unauthorized: Sesi tidak valid atau telah berakhir." };
  }

  // Cek klaim role di app_metadata atau user_metadata (sesuaikan dengan setup Supabase Auth Anda)
  // Umumnya jika Anda menggunakan custom claims / triggers, rolenya ada di app_metadata.
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

    const data = await categoryService.addCategory(parseResult.data);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal membuat folder." }, { status: 500 });
  }
}
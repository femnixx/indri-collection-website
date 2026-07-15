// app/api/admin/products/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { z } from "zod";

// Skema validasi input produk baru
const productInputSchema = z.object({
  name: z.string().min(3, "Nama produk terlalu pendek").max(100),
  description: z.string().max(1000).optional(),
  category_id: z.string().uuid("Kategori tidak valid"),
  image_url: z.string().url("URL gambar tidak valid"),
  is_published: z.boolean().default(false)
});

async function validateAdminRole(supabase: any) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { isValid: false, status: 401, error: "Unauthorized" };

  const { data: adminData } = await supabase
    .from("admins")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (adminData?.role !== "admin") {
    return { isValid: false, status: 403, error: "Forbidden" };
  }
  return { isValid: true, user };
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // 🔒 Proteksi Akses Admin
    const auth = await validateAdminRole(supabase);
    if (!auth.isValid) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const json = await request.json();
    const parseResult = productInputSchema.safeParse(json);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // 🚀 Simpan ke database dengan reference admin yang membuat
    const { data, error: dbError } = await supabase
      .from("products")
      .insert({
        ...parseResult.data,
        created_by: auth.user.id,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("[CRITICAL PRODUCT UPLOAD ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan produk baru." },
      { status: 500 }
    );
  }
}
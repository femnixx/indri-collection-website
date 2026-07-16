import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { productService } from "@/services/productService";
import { productSchema } from "@/validations/productSchema";

async function validateAdminRole(supabase: any) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { isValid: false, status: 401, error: "Unauthorized" };

  const { data: adminData } = await supabase
    .from("admins")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return adminData?.role === "admin" 
    ? { isValid: true, user } 
    : { isValid: false, status: 403, error: "Forbidden" };
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // 1. Auth check
    const auth = await validateAdminRole(supabase);
    if (!auth.isValid) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    // 2. Parse and Validate
    const json = await request.json();
    const parseResult = productSchema.safeParse(json);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // 3. Delegate to Service
    const data = await productService.addProduct(parseResult.data, auth.user.id);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("[PRODUCT UPLOAD ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan produk baru." },
      { status: 500 }
    );
  }
}
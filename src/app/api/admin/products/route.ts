import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { productService } from "@/services/productService";

/**
 * Validates admin status and returns the user if authorized.
 */
async function authorizeAdmin(supabase: any) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { authorized: false, status: 401, error: "Unauthorized" };
  }

  const { data: admin, error: dbError } = await supabase
    .from("admins")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (dbError || admin?.role !== "admin") {
    console.error("[AUTH] Access denied for:", user.id, dbError || "Not an admin");
    return { authorized: false, status: 403, error: "Forbidden: Insufficient permissions" };
  }

  return { authorized: true, user };
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  
  // 1. Authorization Gate
  const auth = await authorizeAdmin(supabase);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    // 2. Data Extraction
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const categoryId = formData.get("category_id") as string | null;
    const name = formData.get("name") as string | null;

    if (!categoryId || !name) {
      return NextResponse.json({ success: false, error: "Missing required fields: category_id, name" }, { status: 400 });
    }

    // 3. Execution
    const data = await productService.addProduct(
      { name, category_id: categoryId, is_published: true },
      auth.user!.id,
      file,
      categoryId
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[API_ERROR] Product creation failed:", error);
    return NextResponse.json({ success: false, error: "Failed to process product upload" }, { status: 500 });
  }
}
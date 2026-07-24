import { NextResponse } from "next/server";
import { productService } from "@/services/productService";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

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

// PUBLIC GET: Customers can fetch products without admin login
export async function GET() {
  const supabase = await createSupabaseServerClient();

  try {
    const data = await productService.getAllCategoriesWithProducts();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("[API] Fetch categories with products error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const auth = await authorizeAdmin(supabase);
  if (!auth.authorized) return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const { name, categoryId, image_url } = body;

    if (!name || !image_url) {
      return NextResponse.json({ success: false, error: "Name and image_url are required" }, { status: 400 });
    }

    if (categoryId) {
      const { data: category, error: catError } = await supabase
        .from("categories")
        .select("id")
        .eq("id", categoryId)
        .single();

      if (catError || !category) {
        return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
      }
    }

    const { data: product, error: createError } = await supabase
      .from("products")
      .insert({
        name,
        description: "",
        category_id: categoryId ?? null,
        is_published: true,
        image_url: image_url,
        created_by: auth.user!.id,
      })
      .select()
      .single();

    if (createError) throw createError;

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    console.error("[API] Create product error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const supabase = await createSupabaseServerClient();
  const auth = await authorizeAdmin(supabase);
  if (!auth.authorized) return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const { id, name, image_url, category_id } = body;
    
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (category_id !== undefined) updateData.category_id = category_id;
    
    const { error } = await supabase.from("products").update(updateData).eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[API] Update product error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const supabase = await createSupabaseServerClient();
  const auth = await authorizeAdmin(supabase);
  if (!auth.authorized) return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });

  try {
    const { id } = await request.json();
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}
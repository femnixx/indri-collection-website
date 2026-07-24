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

// GET: Fetch products by category
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("category_id");
  const supabase = await createSupabaseServerClient();

  if (!categoryId) {
    return NextResponse.json({ success: false, error: "Missing category_id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categoryId);

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

// POST: Add new product (Requires Admin)
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const auth = await authorizeAdmin(supabase);
  if (!auth.authorized) return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const categoryId = formData.get("category_id") as string | null;
    const name = formData.get("name") as string | null;

    if (!categoryId || !name) return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });

    const data = await productService.addProduct({ name, category_id: categoryId, is_published: true }, auth.user!.id, file, categoryId);
    return NextResponse.json({ success: true, data });
  } catch (error: any ) {
    console.error("DETAILED ERROR: ", JSON.stringify(error, null, 2));
    return NextResponse.json({ success: false, error: "Failed to upload" }, { status: 500 });
  }
}

// PUT: Update product name (Requires Admin)
export async function PUT(request: Request) {
  const supabase = await createSupabaseServerClient();
  const auth = await authorizeAdmin(supabase);
  if (!auth.authorized) return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });

  try {
    const { id, name } = await request.json();
    // Rename product: update database "products" table AND rename the image file
    // inside the category folder in the storage bucket
    await productService.renameProduct(id, name);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
  }
}

// DELETE: Remove product (Requires Admin)
export async function DELETE(request: Request) {
  const supabase = await createSupabaseServerClient();
  const auth = await authorizeAdmin(supabase);
  if (!auth.authorized) return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ success: false, error: "Missing product ID" }, { status: 400 });

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

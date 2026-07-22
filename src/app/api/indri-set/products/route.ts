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

export async function GET() {
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

// POST: Upload file to the storage bucket "products" AND save product to the database
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const auth = await authorizeAdmin(supabase);
  if (!auth.authorized) return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const name = formData.get("name") as string | null;
    const categoryId = formData.get("categoryId") as string | null;
    const description = formData.get("description") as string | null;

    if (!name || !categoryId || !file) {
      return NextResponse.json({ success: false, error: "Name, categoryId, and file are required" }, { status: 400 });
    }

    // productService.addProduct handles:
    // 1. Fetching the category to get its name
    // 2. Saving the file to the storage bucket (public/images/products/{categoryName}/{productName}.{ext})
    // 3. Saving the product metadata to the database "products" table
    const data = await productService.addProduct(
      { name, description: description || "", category_id: categoryId, is_published: true },
      auth.user!.id,
      file,
      categoryId
    );

    return NextResponse.json({ success: true, data });
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
    const { id, name, image_url } = body;

    if (name !== undefined) {
      // Rename product: update database "products" table AND rename the image file
      // inside the category folder in the storage bucket
      await productService.renameProduct(id, name);
    } else if (image_url !== undefined) {
      // Only update image_url in the database
      const { error } = await supabase.from("products").update({ image_url }).eq("id", id);
      if (error) throw error;
    }

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
    await productService.deleteProduct(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[API] Delete product error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to delete product" }, { status: 500 });
  }
}

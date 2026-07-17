export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseServer";
import { productService } from "@/services/productService";

// ✅ Extract userId from JWT Bearer token
async function getUserIdFromToken(token: string | null): Promise<string | null> {
  if (!token) return null;
  
  try {
    const actualToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    const supabaseAdmin = createSupabaseAdminClient();
    const { data, error } = await supabaseAdmin.auth.getUser(actualToken);
    
    if (error || !data.user) {
      console.log("DEBUG [PRODUCTS API]: Token verification failed:", error?.message);
      return null;
    }
    
    return data.user.id;
  } catch (error) {
    console.error("DEBUG [PRODUCTS API]: Token decode error:", error);
    return null;
  }
}

// Helper: Check admin role
async function isUserAdmin(userId: string) {
  const supabaseAdmin = createSupabaseAdminClient();
  const { data: admin } = await supabaseAdmin
    .from("admins")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  
  return admin?.role === "admin";
}

// Helper: Forbidden response
const forbiddenResponse = () => 
  NextResponse.json({ success: false, error: "Forbidden: Hak akses tidak memadai" }, { status: 403 });

/**
 * GET - Public endpoint (no auth required)
 * Returns all published products with public image URLs
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category_id");
    const supabaseAdmin = createSupabaseAdminClient();

    let query = supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (categoryId && categoryId !== "undefined" && categoryId !== "null") {
      query = query.eq("category_id", categoryId);
    }

    const { data: products, error } = await query;
    if (error) throw error;

    // ✅ Convert file paths to public URLs (never expire)
    const resolvedProducts = (products || []).map((product) => {
      let imageUrl = product.image_url || "/placeholder.png";
      
      if (product.image_url && !product.image_url.startsWith("http")) {
        const { data } = supabaseAdmin.storage
          .from("products")
          .getPublicUrl(product.image_url);
        imageUrl = data.publicUrl;
      }
      
      return { ...product, image_url: imageUrl };
    });

    return NextResponse.json({ success: true, data: resolvedProducts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Gagal memuat produk" }, { status: 500 });
  }
}

/**
 * POST - Admin only (requires Authorization Bearer token)
 * Create new product with file upload
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const userId = await getUserIdFromToken(authHeader);
  
  if (!userId || !(await isUserAdmin(userId))) return forbiddenResponse();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const categoryId = formData.get("category_id") as string | null;
    const name = formData.get("name") as string | null;

    if (!categoryId || !name) {
      return NextResponse.json({ success: false, error: "Data tidak lengkap" }, { status: 400 });
    }

    const newProduct = await productService.addProduct(
      { name, category_id: categoryId, is_published: true }, 
      userId, 
      file, 
      categoryId
    );
    
    return NextResponse.json({ success: true, data: newProduct });
  } catch (error: any) {
    console.error("[PRODUCTS POST ERROR]:", error);
    return NextResponse.json({ success: false, error: "Gagal mengunggah produk" }, { status: 500 });
  }
}

/**
 * PUT - Admin only (requires Authorization Bearer token)
 * Update existing product
 */
export async function PUT(request: Request) {
  const authHeader = request.headers.get("authorization");
  const userId = await getUserIdFromToken(authHeader);
  
  if (!userId || !(await isUserAdmin(userId))) return forbiddenResponse();

  try {
    const { id, name } = await request.json();
    if (!id || !name) {
      return NextResponse.json({ success: false, error: "ID dan nama wajib disertakan" }, { status: 400 });
    }

    const supabaseAdmin = createSupabaseAdminClient();
    const { error } = await supabaseAdmin.from("products").update({ name }).eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[PRODUCTS PUT ERROR]:", error);
    return NextResponse.json({ success: false, error: "Gagal memperbarui produk" }, { status: 500 });
  }
}

/**
 * DELETE - Admin only (requires Authorization Bearer token)
 * Delete product and its image file
 */
export async function DELETE(request: Request) {
  const authHeader = request.headers.get("authorization");
  const userId = await getUserIdFromToken(authHeader);
  
  if (!userId || !(await isUserAdmin(userId))) return forbiddenResponse();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ success: false, error: "ID produk tidak ditemukan" }, { status: 400 });
    }

    const supabaseAdmin = createSupabaseAdminClient();
    
    // Get product to find image file
    const { data: product } = await supabaseAdmin
      .from("products")
      .select("image_url")
      .eq("id", id)
      .single();
    
    // Delete image file from storage if it exists
    if (product?.image_url && !product.image_url.startsWith("http")) {
      await supabaseAdmin.storage
        .from("products")
        .remove([product.image_url]);
    }

    // Delete product from database
    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true, message: "Produk berhasil dihapus" });
  } catch (error: any) {
    console.error("[PRODUCTS DELETE ERROR]:", error);
    return NextResponse.json({ success: false, error: "Gagal menghapus produk" }, { status: 500 });
  }
}
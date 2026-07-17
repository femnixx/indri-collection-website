import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseServer";
import { categoryService } from "@/services/categoryService";
import { categorySchema } from "@/validations/categorySchema";

/**
 * Extract and verify userId from JWT Bearer token
 */
async function getUserIdFromToken(token: string | null): Promise<string | null> {
  if (!token) return null;
  
  try {
    const actualToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    const supabaseAdmin = createSupabaseAdminClient();
    const { data, error } = await supabaseAdmin.auth.getUser(actualToken);
    
    if (error || !data.user) {
      console.log("DEBUG [CATEGORY API]: Token verification failed:", error?.message);
      return null;
    }
    
    return data.user.id;
  } catch (error) {
    console.error("DEBUG [CATEGORY API]: Token decode error:", error);
    return null;
  }
}

/**
 * Check if user has admin role in database
 */
async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const supabaseAdmin = createSupabaseAdminClient();
    const { data: admin, error } = await supabaseAdmin
      .from("admins")
      .select("role")
      .eq("id", userId)
      .maybeSingle();
    
    if (error) {
      console.error("DEBUG [CATEGORY API]: Admin check error:", error.message);
      return false;
    }
    
    return admin?.role === "admin";
  } catch (error) {
    console.error("DEBUG [CATEGORY API]: Admin check exception:", error);
    return false;
  }
}

/**
 * Standardized forbidden response
 */
const forbiddenResponse = () =>
  NextResponse.json(
    { success: false, error: "Forbidden: Hak akses tidak memadai" },
    { status: 403 }
  );

/**
 * POST - Create a new category
 */
export async function POST(request: Request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    const userId = await getUserIdFromToken(authHeader);
    
    if (!userId) {
      console.warn("[CATEGORY POST] No valid token provided");
      return forbiddenResponse();
    }

    // Verify admin role
    const isAdmin = await isUserAdmin(userId);
    if (!isAdmin) {
      console.warn(`[CATEGORY POST] User ${userId} is not admin`);
      return forbiddenResponse();
    }

    // Parse and validate input
    const json = await request.json();
    const parseResult = categorySchema.safeParse(json);
    
    if (!parseResult.success) {
      console.warn("[CATEGORY POST] Validation failed:", parseResult.error.flatten().fieldErrors);
      return NextResponse.json(
        { success: false, error: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Create category
    const category = await categoryService.addCategory(parseResult.data);

    // Create storage folder with .keep file
    const folderName = category.name.replace(/\s+/g, '_').toLowerCase();
    const { error: storageError } = await createSupabaseAdminClient().storage
      .from('products')
      .upload(`${folderName}/.keep`, new Blob([''], { type: 'text/plain' }), { upsert: true });

    if (storageError) {
      console.error("[CATEGORY POST] Storage creation failed:", storageError.message);
      throw new Error("Gagal membuat folder storage.");
    }

    console.log(`[CATEGORY POST] Successfully created category: "${category.name}" by user ${userId}`);
    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    console.error("[CATEGORY POST ERROR]:", error.message);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal membuat kategori." },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Rename an existing category
 */
export async function PATCH(request: Request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    const userId = await getUserIdFromToken(authHeader);
    
    if (!userId) {
      console.warn("[CATEGORY PATCH] No valid token provided");
      return forbiddenResponse();
    }

    // Verify admin role
    const isAdmin = await isUserAdmin(userId);
    if (!isAdmin) {
      console.warn(`[CATEGORY PATCH] User ${userId} is not admin`);
      return forbiddenResponse();
    }

    // Parse input
    const { oldName, newName } = await request.json();
    
    if (!oldName?.trim() || !newName?.trim()) {
      console.warn("[CATEGORY PATCH] Missing oldName or newName");
      return NextResponse.json(
        { success: false, error: "Nama lama dan baru wajib diisi." },
        { status: 400 }
      );
    }

    // Rename category
    await categoryService.renameCategory(oldName, newName, userId);

    console.log(`[CATEGORY PATCH] Successfully renamed category by user ${userId}`);
    return NextResponse.json({ success: true, message: "Folder diubah." });
  } catch (error: any) {
    console.error("[CATEGORY PATCH ERROR]:", error.message);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal mengubah folder." },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Remove a category
 */
export async function DELETE(request: Request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    const userId = await getUserIdFromToken(authHeader);
    
    if (!userId) {
      console.warn("[CATEGORY DELETE] No valid token provided");
      return forbiddenResponse();
    }

    // Verify admin role
    const isAdmin = await isUserAdmin(userId);
    if (!isAdmin) {
      console.warn(`[CATEGORY DELETE] User ${userId} is not admin`);
      return forbiddenResponse();
    }

    // Parse input
    const { id, name } = await request.json();
    
    if (!id || !name?.trim()) {
      console.warn("[CATEGORY DELETE] Missing id or name");
      return NextResponse.json(
        { success: false, error: "ID dan nama kategori diperlukan." },
        { status: 400 }
      );
    }

    // Delete category
    await categoryService.deleteCategory(id, name, userId);

    console.log(`[CATEGORY DELETE] Successfully deleted category by user ${userId}`);
    return NextResponse.json({ success: true, message: "Folder dihapus." });
  } catch (error: any) {
    console.error("[CATEGORY DELETE ERROR]:", error.message);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal menghapus folder." },
      { status: 500 }
    );
  }
}
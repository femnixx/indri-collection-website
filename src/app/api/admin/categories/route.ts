import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { categoryService } from "@/services/categoryService";
import { categorySchema } from "@/validations/categorySchema";

/**
 * Verify admin access using cookie-based session
 */
async function verifyAdmin() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { authorized: false, status: 401, error: "Unauthorized" };
    }

    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (adminError) {
      console.error("[CATEGORY API] Admin check error:", adminError.message);
      return { authorized: false, status: 403, error: "Forbidden: " + adminError.message };
    }

    if (!admin || admin.role !== "admin") {
      return { authorized: false, status: 403, error: "Forbidden: Insufficient permissions" };
    }

    return { authorized: true, user, status: 200 };
  } catch (error) {
    console.error("[CATEGORY API] Verification exception:", error);
    return { authorized: false, status: 403, error: "Forbidden: Unable to verify permissions" };
  }
}

/**
 * POST - Create a new category
 */
export async function POST(request: Request) {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const json = await request.json();
    const parseResult = categorySchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const categoryResult = await categoryService.addCategory(parseResult.data);
    const category = categoryResult.data;

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
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { oldName, newName } = await request.json();

    if (!oldName?.trim() || !newName?.trim()) {
      return NextResponse.json(
        { success: false, error: "Nama lama dan baru wajib diisi." },
        { status: 400 }
      );
    }

    await categoryService.renameCategory(oldName, newName);

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
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { id, name } = await request.json();

    if (!id || !name?.trim()) {
      return NextResponse.json(
        { success: false, error: "ID dan nama kategori diperlukan." },
        { status: 400 }
      );
    }

    await categoryService.deleteCategory(id, name);

    return NextResponse.json({ success: true, message: "Folder dihapus." });
  } catch (error: any) {
    console.error("[CATEGORY DELETE ERROR]:", error.message);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal menghapus folder." },
      { status: 500 }
    );
  }
}

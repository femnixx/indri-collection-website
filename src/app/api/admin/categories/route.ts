import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseServer";
import { categoryService } from "@/services/categoryService";
import { categorySchema } from "@/validations/categorySchema";

// ✅ NEW: Extract userId from JWT token
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

// Helper: Check if user is admin
async function isUserAdmin(userId: string) {
  const supabaseAdmin = createSupabaseAdminClient();
  const { data: admin } = await supabaseAdmin
    .from("admins")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  
  return admin?.role === "admin";
}

export async function POST(request: Request) {
  // ✅ CHANGED: Extract from Authorization header
  const authHeader = request.headers.get("authorization");
  const userId = await getUserIdFromToken(authHeader);
  
  if (!userId || !(await isUserAdmin(userId))) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  try {
    const json = await request.json();
    const parseResult = categorySchema.safeParse(json);
    if (!parseResult.success) return NextResponse.json({ error: parseResult.error.flatten().fieldErrors }, { status: 400 });

    const data = await categoryService.addCategory(parseResult.data);
    
    // Storage logic (using Admin Client)
    const folderName = data.name.replace(/\s+/g, '_').toLowerCase();
    const { error: storageError } = await createSupabaseAdminClient().storage
      .from('products')
      .upload(`${folderName}/.keep`, new Blob([''], { type: 'text/plain' }), { upsert: true });

    if (storageError) throw new Error("Gagal membuat folder storage.");

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("[CATEGORY POST ERROR]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  // ✅ CHANGED: Extract from Authorization header
  const authHeader = request.headers.get("authorization");
  const userId = await getUserIdFromToken(authHeader);
  
  if (!userId || !(await isUserAdmin(userId))) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  try {
    const { oldName, newName } = await request.json();
    if (!oldName || !newName) return NextResponse.json({ error: "Nama wajib diisi." }, { status: 400 });

    await categoryService.renameCategory(oldName, newName);
    return NextResponse.json({ success: true, message: "Folder diubah." });
  } catch (error: any) {
    console.error("[CATEGORY PATCH ERROR]:", error);
    return NextResponse.json({ error: "Gagal mengubah folder." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  // ✅ CHANGED: Extract from Authorization header
  const authHeader = request.headers.get("authorization");
  const userId = await getUserIdFromToken(authHeader);
  
  if (!userId || !(await isUserAdmin(userId))) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id, name } = await request.json();
    if (!id || !name) return NextResponse.json({ error: "ID/Nama diperlukan." }, { status: 400 });

    await categoryService.deleteCategory(id, name);
    return NextResponse.json({ success: true, message: "Folder dihapus." });
  } catch (error: any) {
    console.error("[CATEGORY DELETE ERROR]:", error);
    return NextResponse.json({ error: "Gagal menghapus folder." }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { categoryService } from "@/services/categoryService";
import { categorySchema } from "@/validations/categorySchema";

// Shared validation helper
async function validateAdminRole(supabase: any) {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return { isValid: false, status: 401, error: "Unauthorized: Sesi tidak valid atau telah berakhir." };
  }

  const userRole = user.app_metadata?.role || user.user_metadata?.role;
  if (userRole !== "admin") {
    return { isValid: false, status: 403, error: "Forbidden: Anda tidak memiliki akses admin." };
  }

  return { isValid: true, user };
}

// POST: Create Category
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const auth = await validateAdminRole(supabase);
    if (!auth.isValid) return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });

    const json = await request.json();
    const parseResult = categorySchema.safeParse(json);
    if (!parseResult.success) return NextResponse.json({ error: parseResult.error.flatten().fieldErrors }, { status: 400 });

    const data = await categoryService.addCategory(parseResult.data);
    
    const folderName = data.name.replace(/\s+/g, '_').toLowerCase();
    await supabase.storage
      .from('products')
      .upload(`${folderName}/.keep`, new Blob([''], { type: 'text/plain' }));

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal membuat folder." }, { status: 500 });
  }
}

// PATCH: Rename Category
export async function PATCH(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const auth = await validateAdminRole(supabase);
    if (!auth.isValid) return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });

    const { oldName, newName } = await request.json();
    if (!oldName || !newName) {
      return NextResponse.json({ error: "Nama lama dan baru diperlukan." }, { status: 400 });
    }

    await categoryService.renameCategory(oldName, newName);

    return NextResponse.json({ success: true, message: "Folder berhasil diubah namanya." });
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal mengubah nama folder." }, { status: 500 });
  }
}

// DELETE: Remove Category
export async function DELETE(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const auth = await validateAdminRole(supabase);
    if (!auth.isValid) return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });

    const { id, name } = await request.json();
    if (!id || !name) {
      return NextResponse.json({ error: "ID dan nama folder diperlukan." }, { status: 400 });
    }

    await categoryService.deleteCategory(id, name);

    return NextResponse.json({ success: true, message: "Folder berhasil dihapus." });
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal menghapus folder." }, { status: 500 });
  }
}
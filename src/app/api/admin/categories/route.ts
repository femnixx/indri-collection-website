import { NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabaseServer";
import { categoryService } from "@/services/categoryService";
import { categorySchema } from "@/validations/categorySchema";

/**
 * Shared validation helper
 * Memvalidasi otentikasi dan otorisasi admin.
 * Mendukung autentikasi berbasis Cookie (default) dan Bearer Token (header).
 * Menggunakan Service Role Client untuk memeriksa tabel 'admins' guna mem-bypass RLS.
 */
async function validateAdminRole(request: Request, supabase: any) {
  let user = null;
  let authError = null;

  // 1. Coba dapatkan user menggunakan session cookie bawaan Supabase
  try {
    const { data, error } = await supabase.auth.getUser();
    user = data?.user;
    authError = error;
  } catch (err) {
    authError = err;
  }

  // 2. Jika cookie kosong/tidak valid, coba ambil dari Authorization Header (Bearer Token)
  if (!user) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const { data, error } = await supabase.auth.getUser(token);
        if (!error && data?.user) {
          user = data.user;
          authError = null; // Reset error jika pemrosesan token berhasil
        }
      } catch (err) {
        console.error("[AUTH] Gagal memproses Bearer Token pada kategori:", err);
      }
    }
  }

  // Jika tetap tidak ditemukan sesi user yang valid
  if (authError || !user) {
    return { isValid: false, status: 401, error: "Unauthorized: Sesi tidak valid atau telah berakhir." };
  }

  // 3. Validasi role 'admin' dari tabel database 'admins' menggunakan Admin Client (Bypass RLS)
  const supabaseAdmin = createSupabaseAdminClient();
  const { data: admin, error: dbError } = await supabaseAdmin
    .from("admins")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (dbError || admin?.role !== "admin") {
    console.error("[AUTH] Akses ditolak untuk UUID:", user.id, {
      dbError: dbError || "Tidak ada error database",
      foundRole: admin?.role || "Tidak ditemukan/role null"
    });
    return { isValid: false, status: 403, error: "Forbidden: Anda tidak memiliki akses admin." };
  }

  return { isValid: true, user };
}

// POST: Create Category
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const supabaseAdmin = createSupabaseAdminClient(); // Gunakan ini untuk storage

    const auth = await validateAdminRole(request, supabase);
    if (!auth.isValid) return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });

    const json = await request.json();
    const parseResult = categorySchema.safeParse(json);
    if (!parseResult.success) return NextResponse.json({ error: parseResult.error.flatten().fieldErrors }, { status: 400 });

    // 1. Tambah data ke DB
    const data = await categoryService.addCategory(parseResult.data);
    
    // 2. Buat folder di Storage menggunakan Admin Client (Bypass RLS)
    const folderName = data.name.replace(/\s+/g, '_').toLowerCase();
    const { error: storageError } = await supabaseAdmin.storage
      .from('products')
      .upload(`${folderName}/.keep`, new Blob([''], { type: 'text/plain' }), {
        upsert: true
      });

    if (storageError) {
      console.error("[Storage Error]:", storageError);
      throw new Error("Gagal membuat folder storage.");
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("[API POST Error]:", error);
    return NextResponse.json({ success: false, error: error.message || "Gagal memproses request." }, { status: 500 });
  }
}
// PATCH: Rename Category
export async function PATCH(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const auth = await validateAdminRole(request, supabase); // Melewatkan request ke otorisasi
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
    const auth = await validateAdminRole(request, supabase); // Melewatkan request ke otorisasi
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
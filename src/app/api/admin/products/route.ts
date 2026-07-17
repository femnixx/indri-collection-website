export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabaseServer";
import { productService } from "@/services/productService";

/**
 * Validasi otentikasi dan otorisasi admin.
 * Memastikan pengguna yang masuk memiliki peran (role) 'admin'.
 * Mendukung autentikasi berbasis Cookie (default) dan Bearer Token (header).
 * Menggunakan Service Role Client untuk memeriksa tabel 'admins' guna mem-bypass RLS.
 */
async function authorizeAdmin(request: Request, supabase: any) {
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
        console.error("[AUTH] Gagal memproses Bearer Token:", err);
      }
    }
  }

  // Jika tetap tidak ditemukan sesi user yang valid
  if (authError || !user) {
    return { authorized: false, status: 401, error: "Unauthorized: Sesi tidak valid atau telah berakhir" };
  }

  // 3. Validasi role 'admin' dari tabel database 'admins' menggunakan Admin Client (Bypass RLS)
  const supabaseAdmin = createSupabaseAdminClient();
  const { data: admin, error: dbError } = await supabaseAdmin
    .from("admins")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  // === LOG DEBUG UNTUK MELACAK MASALAH 403 ===
  console.log("==================================================");
  console.log("[DEBUG AUTH] Melakukan pengecekan role untuk UUID:", user.id);
  console.log("[DEBUG AUTH] Data yang dikembalikan DB (Admin Client):", admin);
  console.log("[DEBUG AUTH] Error dari DB (jika ada):", dbError ? {
    code: dbError.code,
    message: dbError.message,
    details: dbError.details,
    hint: dbError.hint
  } : "Tidak ada error database");
  console.log("==================================================");

  if (dbError || admin?.role !== "admin") {
    console.error("[AUTH] Akses ditolak untuk UUID:", user.id, {
      dbError: dbError || "Tidak ada error database",
      foundRole: admin?.role || "Tidak ditemukan/role null"
    });
    return { authorized: false, status: 403, error: "Forbidden: Hak akses tidak memadai" };
  }

  return { authorized: true, user };
}

/**
 * GET: Mengambil daftar produk.
 * - Jika `category_id` disertakan, produk difilter berdasarkan kategori tersebut.
 * - Jika `category_id` kosong, semua produk dimuat (untuk Landing Page).
 * - Otomatis mengubah path relatif gambar menjadi Public URL Supabase Storage yang valid.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category_id");
    const supabase = await createSupabaseServerClient();

    let query = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    // Gunakan filter id jika dikirimkan oleh client
    if (categoryId && categoryId !== "undefined" && categoryId !== "null") {
      query = query.eq("category_id", categoryId);
    }

    const { data: products, error } = await query;

    if (error) throw error;

    // Resolve URL gambar menjadi public URL absolut
    const resolvedProducts = (products || []).map((product) => {
      let imageUrl = product.image_url || "/placeholder.png";

      if (product.image_url && !product.image_url.startsWith("http")) {
        const { data } = supabase.storage
          .from("products")
          .getPublicUrl(product.image_url);
        
        imageUrl = data.publicUrl;
      }

      return {
        ...product,
        image_url: imageUrl,
      };
    });

    return NextResponse.json({ 
      success: true, 
      data: resolvedProducts 
    });

  } catch (error: any) {
    console.error("[GET PRODUCTS ERROR]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memuat produk" }, 
      { status: 500 }
    );
  }
}

/**
 * POST: Menambahkan produk baru ke database dan mengunggah gambar ke storage.
 * (Membutuhkan akses Administrator)
 */
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const auth = await authorizeAdmin(request, supabase); // Melewatkan request ke otorisasi
  
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const categoryId = formData.get("category_id") as string | null;
    const name = formData.get("name") as string | null;

    if (!categoryId || !name) {
      return NextResponse.json({ success: false, error: "Data tidak lengkap (kategori & nama wajib diisi)" }, { status: 400 });
    }

    const newProduct = await productService.addProduct(
      { name, category_id: categoryId, is_published: true }, 
      auth.user!.id, 
      file, 
      categoryId
    );

    return NextResponse.json({ 
      success: true, 
      data: newProduct 
    });

  } catch (error: any) {
    console.error("[POST PRODUCT ERROR DETAILED]:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { success: false, error: "Gagal mengunggah produk baru" }, 
      { status: 500 }
    );
  }
}

/**
 * PUT: Memperbarui nama produk yang sudah ada.
 * (Membutuhkan akses Administrator)
 */
export async function PUT(request: Request) {
  const supabase = await createSupabaseServerClient();
  const auth = await authorizeAdmin(request, supabase); // Melewatkan request ke otorisasi
  
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const { id, name } = await request.json();
    
    if (!id || !name) {
      return NextResponse.json({ success: false, error: "ID dan nama baru wajib disertakan" }, { status: 400 });
    }

    const { error } = await supabase
      .from("products")
      .update({ name })
      .eq("id", id);
    
    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("[PUT PRODUCT ERROR]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memperbarui produk" }, 
      { status: 500 }
    );
  }
}

/**
 * DELETE: Menghapus produk berdasarkan ID dari database.
 * (Membutuhkan akses Administrator)
 */
export async function DELETE(request: Request) {
  const supabase = await createSupabaseServerClient();
  const auth = await authorizeAdmin(request, supabase); // Melewatkan request ke otorisasi
  
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ success: false, error: "ID produk tidak ditemukan pada parameter" }, { status: 400 });
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
    
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("[DELETE PRODUCT ERROR]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal menghapus produk" }, 
      { status: 500 }
    );
  }
}
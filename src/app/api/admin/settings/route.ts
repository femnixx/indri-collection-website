// app/api/admin/settings/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer"; 
import { settingsService } from "@/services/settingsService";
import { contactSettingsSchema } from "@/validations/settingsSchema";
import { z } from "zod";

/**
 * 🛡️ Helper Validasi Otorisasi (Anti-Privilege Escalation)
 * Memastikan user tidak hanya sekadar login, tapi memiliki role 'admin'.
 */
async function validateAdminRole(supabase: any) {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return { isValid: false, status: 401, error: "Unauthorized: Sesi tidak valid atau telah berakhir." };
  }

  // Cek klaim role di app_metadata atau user_metadata (sesuaikan dengan setup Supabase Auth Anda)
  // Umumnya jika Anda menggunakan custom claims / triggers, rolenya ada di app_metadata.
  const userRole = user.app_metadata?.role || user.user_metadata?.role;
  
  if (userRole !== "admin") {
    return { isValid: false, status: 403, error: "Forbidden: Anda tidak memiliki akses admin." };
  }

  return { isValid: true, user };
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    
    // 🔒 Proteksi Akses Admin
    const auth = await validateAdminRole(supabase);
    if (!auth.isValid) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    
    const data = await settingsService.getSettings(supabase);
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("[API GET SETTINGS ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat pengaturan toko." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // 🔒 Proteksi Akses Admin (Mencegah modifikasi data oleh non-admin)
    const auth = await validateAdminRole(supabase);
    if (!auth.isValid) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    // 🛡️ Pencegahan DoS (Denial of Service) via Payload Besar
    // Jika user mengirimkan text berukuran puluhan Megabyte, parsing JSON mentah bisa membuat server crash/hang.
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json({ success: false, error: "Invalid Content-Type" }, { status: 400 });
    }

    const json = await request.json();
    
    // 📋 Validasi Struktur & Tipe Data Input via Zod
    const parseResult = contactSettingsSchema.safeParse(json);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // 🚀 Jalankan Update menggunakan data yang SUDAH TERSANITASI oleh Zod (parseResult.data)
    // Jangan pernah melemparkan objek `json` mentah langsung ke service database.
    const updatedData = await settingsService.updateSettings(supabase, parseResult.data);
    
    return NextResponse.json({ success: true, data: updatedData });
  } catch (error: any) {
    console.error("[CRITICAL API POST SETTINGS ERROR]:", error);

    // 🚨 Sembunyikan pesan error sistem internal/raw database dari client untuk mencegah pencurian informasi (Information Disclosure)
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan perubahan ke database." },
      { status: 500 }
    );
  }
}
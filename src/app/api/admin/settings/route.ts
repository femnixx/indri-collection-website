// src/app/api/admin/settings/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { settingsService } from "@/services/settingsService";
import { contactSettingsSchema } from "@/validations/settingsSchema";
import { AppError } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    // 🛡️ 1. Proteksi Autentikasi Server-Side
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Akses ditolak. Sesi tidak valid." }, { status: 401 });
    }

    // 🛡️ 2. Ambil JSON Mentah & Validasi Otomatis via Zod
    const payload = await request.json();
    const validationResult = contactSettingsSchema.safeParse(payload);
    
    if (!validationResult.success) {
      // Melempar error bad request (400) bersama detail error granular per kolom dari Zod
      throw AppError.badRequest("Validasi data gagal", validationResult.error.flatten().fieldErrors);
    }

    // 🛡️ 3. Jalankan Mutasi via Service
    const updatedData = await settingsService.updateSettings(supabase, validationResult.data);

    return NextResponse.json({ success: true, data: updatedData }, { status: 200 });

  } catch (err: any) {
    // 🛡️ 4. Global Error Handler Catch-All
    if (err instanceof AppError) {
      return NextResponse.json(
        { 
          success: false, 
          error: err.message, 
          details: err.details 
        }, 
        { status: err.statusCode }
      );
    }

    // Fallback jika ada error yang tidak terduga di luar sistem
    return NextResponse.json(
      { success: false, error: "Terjadi gangguan sistem yang tidak diketahui." }, 
      { status: 500 }
    );
  }
}
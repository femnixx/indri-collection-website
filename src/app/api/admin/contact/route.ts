import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseServer";
import { settingsService } from "@/services/settingsService";

// ✅ Extract userId from JWT Bearer token (like products route)
async function getUserIdFromToken(token: string | null): Promise<string | null> {
  if (!token) return null;
  
  try {
    const actualToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    const supabaseAdmin = createSupabaseAdminClient();
    const { data, error } = await supabaseAdmin.auth.getUser(actualToken);
    
    if (error || !data.user) {
      console.log("DEBUG [CONTACT API]: Token verification failed:", error?.message);
      return null;
    }
    
    return data.user.id;
  } catch (error) {
    console.error("DEBUG [CONTACT API]: Token decode error:", error);
    return null;
  }
}

// Helper: Only check the role in the DB
async function isUserAdmin(userId: string) {
  const supabaseAdmin = createSupabaseAdminClient();
  const { data: admin } = await supabaseAdmin
    .from("admins")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  
  return admin?.role === "admin";
}

// Helper: Standardized Forbidden response
const forbiddenResponse = () => 
  NextResponse.json({ success: false, error: "Forbidden: Hak akses tidak memadai" }, { status: 403 });

// GET: Publicly accessible (No auth required)
/**
 * GET - Public endpoint for contact info (no auth required)
 */
export async function GET() {
  try {
    const data = await settingsService.getSettings(createSupabaseAdminClient());
    return NextResponse.json({ 
      success: true, 
      data: data || null  // ✅ Ensure it's an object, not an array
    });
  } catch (error) {
    console.error("[API GET CONTACT ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat informasi kontak." },
      { status: 500 }
    );
  }
}

// PATCH: Admin only (requires Authorization Bearer token)
// ✅ CHANGED: Updates existing record instead of creating new one
export async function PATCH(request: Request) {
  // Extract from Authorization header
  const authHeader = request.headers.get("authorization");
  const userId = await getUserIdFromToken(authHeader);
  
  if (!userId || !(await isUserAdmin(userId))) return forbiddenResponse();

  try {
    const body = await request.json();
    const supabaseAdmin = createSupabaseAdminClient();

    // Find existing record to update
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('contact_info')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (fetchError) throw fetchError;

    // Prepare update payload with timestamps
    const updatePayload = {
      ...body,
      updated_at: new Date().toISOString(),
      updated_by: userId,
    };

    // If record exists, update it; otherwise upsert will create new one
    if (existing?.id) {
      updatePayload.id = existing.id;
    }

    // Perform upsert (update or insert)
    const { data, error } = await supabaseAdmin
      .from('contact_info')
      .upsert(updatePayload)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("[CONTACT PATCH ERROR]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
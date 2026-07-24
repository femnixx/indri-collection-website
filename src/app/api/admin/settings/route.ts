import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseServer";
import { settingsService } from "@/services/settingsService";
import { contactSettingsSchema } from "@/validations/settingsSchema";

/**
 * Extract userId from the JWT Bearer token
 */
async function getUserIdFromToken(token: string | null): Promise<string | null> {
  if (!token) return null;
  
  try {
    const actualToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    const supabaseAdmin = createSupabaseAdminClient();
    const { data, error } = await supabaseAdmin.auth.getUser(actualToken);
    
    if (error || !data.user) {
      return null;
    }
    
    return data.user.id;
  } catch (error) {
    console.error("DEBUG [API]: Token decode error:", error);
    return null;
  }
}

/**
 * Check if user is admin
 */
async function isUserAdmin(userId: string) {
  const supabaseAdmin = createSupabaseAdminClient();
  const { data: admin, error } = await supabaseAdmin
    .from("admins")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  
  return admin?.role === "admin";
}

/**
 * GET - Public endpoint for contact info (no auth required)
 */
export async function GET() {
  try {
    const data = await settingsService.getSettings(createSupabaseAdminClient());
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[API GET CONTACT ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat informasi kontak." },
      { status: 500 }
    );
  }
}

/**
 * POST - Admin only (requires authentication)
 */
export async function POST(request: Request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    const userId = await getUserIdFromToken(authHeader);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden: No valid token" },
        { status: 403 }
      );
    }

    // Verify admin role
    if (!(await isUserAdmin(userId))) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { success: false, error: "Invalid Content-Type" },
        { status: 400 }
      );
    }

    const json = await request.json();
    const parseResult = contactSettingsSchema.safeParse(json);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updatedData = await settingsService.updateSettings(
      createSupabaseAdminClient(),
      parseResult.data,
      userId
    );
    return NextResponse.json({ success: true, data: updatedData });
  } catch (error: any) {
    console.error("[API POST CONTACT ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan perubahan." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
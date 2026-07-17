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
    // Remove "Bearer " prefix if present
    const actualToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    
    const supabaseAdmin = createSupabaseAdminClient();
    // Verify the token using Supabase
    const { data, error } = await supabaseAdmin.auth.getUser(actualToken);
    
    if (error || !data.user) {
      console.log("DEBUG [API]: Token verification failed:", error?.message);
      return null;
    }
    
    return data.user.id;
  } catch (error) {
    console.error("DEBUG [API]: Token decode error:", error);
    return null;
  }
}

async function isUserAdmin(userId: string) {
  const supabaseAdmin = createSupabaseAdminClient();
  const { data: admin, error } = await supabaseAdmin
    .from("admins")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  
  console.log("DEBUG [API]: Checking UserID =", userId);
  console.log("DEBUG [API]: Data from DB =", admin);
  console.log("DEBUG [API]: DB Error =", error);
  
  return admin?.role === "admin";
}

export async function GET(request: Request) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get("authorization");
    const userId = await getUserIdFromToken(authHeader);

    if (!userId || !(await isUserAdmin(userId))) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const data = await settingsService.getSettings(createSupabaseAdminClient());
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[API GET SETTINGS ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat pengaturan." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const userId = await getUserIdFromToken(authHeader);
    
    if (!userId || !(await isUserAdmin(userId))) {
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

    // ✅ CHANGED: Pass userId to the service
    const updatedData = await settingsService.updateSettings(
      createSupabaseAdminClient(),
      parseResult.data,
      userId // ← Add this parameter
    );
    return NextResponse.json({ success: true, data: updatedData });
  } catch (error: any) {
    console.error("[CRITICAL API POST SETTINGS ERROR]:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan perubahan." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
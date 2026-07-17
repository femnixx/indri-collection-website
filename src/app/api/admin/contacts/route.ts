import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseServer";

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

// GET: Publicly accessible (No middleware check needed for GET)
export async function GET() {
  const supabaseAdmin = createSupabaseAdminClient();
  const { data, error } = await supabaseAdmin
    .from('contact_info')
    .select('*');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

// POST/PUT: Admin only (Middleware handles Auth, we handle Role)
export async function POST(request: Request) {
  const userId = request.headers.get("x-user-id");

  // 1. Authorization: Verify Admin Role
  if (!userId || !(await isUserAdmin(userId))) {
    return NextResponse.json({ success: false, error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const supabaseAdmin = createSupabaseAdminClient();

    // 2. Perform update
    const { data, error } = await supabaseAdmin
      .from('contact_info')
      .upsert(body) // Use upsert to handle both creation and updating
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
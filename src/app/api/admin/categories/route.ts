import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { categoryService } from "@/services/categoryService";
import { categorySchema } from "@/validations/categorySchema";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // 1. Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // Log the user ID to your terminal
    console.log("DEBUG: POST /api/admin/categories - Attempting auth for user:", user?.id);

    if (authError || !user) {
      console.error("Auth error:", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const parseResult = categorySchema.safeParse(json);
    
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error.flatten().fieldErrors }, { status: 400 });
    }

    // 2. Perform the operation
    const data = await categoryService.addCategory(parseResult.data);
    return NextResponse.json({ success: true, data });
    
  } catch (error: any) {
    // 3. Log the full error to your server terminal
    console.error("[API_CATEGORY_ERROR_LOG]:", error);

    // 4. Return the error message to the browser
    return NextResponse.json(
      { 
        error: "Gagal membuat folder.", 
        details: error?.message || "Unknown error",
        code: error?.code // This will help us confirm it's the RLS 42501 error
      }, 
      { status: 500 }
    );
  }
}
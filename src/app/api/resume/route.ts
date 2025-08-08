export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const BUCKET = process.env.SUPABASE_RESUME_BUCKET || "resumes";
const RESUME_OBJECT = process.env.SUPABASE_RESUME_OBJECT || "current.pdf"; // active file path e.g. "cv/john_doe.pdf"
const IS_PUBLIC = (process.env.SUPABASE_RESUME_PUBLIC || "false").toLowerCase() === "true";

function decodeJwtPayload(token: string | undefined) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const json = Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Supabase admin credentials not configured" }, { status: 500 });
    }
    const supabaseAdmin = getSupabaseAdmin();
    const downloadName = process.env.SUPABASE_RESUME_DOWNLOAD_NAME || "resume.pdf";
    if (IS_PUBLIC) {
      const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(RESUME_OBJECT);
      if (!data?.publicUrl) {
        return NextResponse.json({ error: "Resume is not publicly accessible" }, { status: 404 });
      }
      const url = new URL(data.publicUrl);
      url.searchParams.set("download", downloadName);
      return NextResponse.redirect(url.toString());
    } else {
      // Return a short-lived signed URL for the current resume
      const { data: signed, error } = await supabaseAdmin.storage
        .from(BUCKET)
        .createSignedUrl(RESUME_OBJECT, 60); // 1 minute

      if (error || !signed?.signedUrl) {
        return NextResponse.json({ error: error?.message || "No resume available" }, { status: 404 });
      }

      const url = new URL(signed.signedUrl);
      url.searchParams.set("download", downloadName);
      return NextResponse.redirect(url.toString());
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Supabase admin credentials not configured" }, { status: 500 });
    }
    const supabaseAdmin = getSupabaseAdmin();
    // Upload new resume and set as current
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    // Ensure bucket exists
    await supabaseAdmin.storage.createBucket(BUCKET, { public: false }).catch(() => {});

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    const { error: uploadErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(RESUME_OBJECT, bytes, {
        upsert: true,
        contentType: file.type || "application/pdf",
      });

    if (uploadErr) {
      return NextResponse.json({ error: uploadErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}



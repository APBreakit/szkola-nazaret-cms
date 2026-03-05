import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("[v0] Upload API called")
    
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      console.error("[v0] No file provided in request")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] Uploading file:", file.name, "Size:", file.size, "Type:", file.type)

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.error("[v0] File too large:", file.size)
      return NextResponse.json(
        { error: "File too large", details: "Maximum file size is 10MB" },
        { status: 400 }
      )
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Blob token missing", details: "Set BLOB_READ_WRITE_TOKEN for local uploads" },
        { status: 503 }
      )
    }

    // Upload to Vercel Blob with random suffix to avoid conflicts
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    })

    console.log("[v0] Upload successful. URL:", blob.url)

    return NextResponse.json({
      url: blob.url,
      success: true,
    })
  } catch (error: any) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}

// app/api/extract-text/route.ts
import { NextResponse } from "next/server";
import { extractText } from "@/lib/ocr";

// Ensure this runs on Node.js runtime (not Edge)
export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const ocrResult = await extractText(buffer);

        return NextResponse.json(ocrResult);
    } catch (err: any) {
        console.error("OCR Error:", err);
        return NextResponse.json(
            { error: "OCR failed", details: err.message ?? "Unknown error" },
            { status: 500 }
        );
    }
}

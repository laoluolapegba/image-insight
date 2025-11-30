// app/api/generate-insights/route.ts
import { NextResponse } from "next/server";
import { generateInsightsFromText } from "@/lib/insights";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const rawText = body?.rawText as string | undefined;

        if (!rawText || !rawText.trim()) {
            return NextResponse.json(
                { error: "rawText is required" },
                { status: 400 }
            );
        }

        const insights = await generateInsightsFromText(rawText);

        return NextResponse.json(insights);
    } catch (err: any) {
        console.error("Insights Error:", err);
        return NextResponse.json(
            { error: "Failed to generate insights", details: err.message ?? "Unknown error" },
            { status: 500 }
        );
    }
}

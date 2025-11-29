import ImageUpload from "@/components/ImageUpload";

export default function Home() {
    return (
        <main className="min-h-screen bg-slate-50">
            <div className="max-w-3xl mx-auto px-4 py-10">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold text-slate-900">
                        Image → Text / Insight
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Day 1: Upload an image and preview it.
                        Next steps: extract text and generate insights.
                    </p>
                </header>

                <ImageUpload />
            </div>
        </main>
    );
}

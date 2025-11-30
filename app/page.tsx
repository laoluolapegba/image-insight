// app/page.tsx
import ImageUpload from "@/components/ImageUpload";
import AuthGate from "@/components/AuthGate";

export default function Home() {
    return (
        <main className="min-h-screen bg-slate-50">
            <div className="max-w-3xl mx-auto px-4 py-10">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold text-slate-900">
                        Image → Text
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Upload an image, extract the text, and copy it out.
                        (Insights / summaries can be plugged in later.)
                    </p>
                </header>

                <AuthGate>
                    <ImageUpload />
                </AuthGate>
            </div>
        </main>
    );
}

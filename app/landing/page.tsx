import Link from "next/link";

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">


            {/* HERO SECTION */}
            <section className="max-w-6xl mx-auto px-4 py-20 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                    Turn Any Image Into <span className="text-slate-700">Text</span>
                    <br />
                    Instantly & Accurately
                </h1>

                <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                    Upload screenshots, receipts, documents, whiteboard photos — and
                    get clean, copyable text in seconds. Free tier included.
                </p>

                <div className="mt-8 flex justify-center gap-4">
                    <Link
                        href="/auth"
                        className="px-6 py-3 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800"
                    >
                        Get Started Free
                    </Link>

                    <Link
                        href="#features"
                        className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                        Learn More
                    </Link>
                </div>
            </section>

            {/* FEATURE GRID */}
            <section id="features" className="max-w-6xl mx-auto px-4 py-16">
                <h2 className="text-2xl font-semibold text-slate-900 text-center mb-10">
                    Why people love Image→Text
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        title="Fast & Accurate OCR"
                        description="Extract clean text from almost any image — screenshots, receipts, documents, and more."
                    />
                    <FeatureCard
                        title="History Included"
                        description="Automatically save your previous extractions. No need to repeat uploads."
                    />
                    <FeatureCard
                        title="Daily Free Tier"
                        description="Get 3 free OCR extractions per day, no credit card required."
                    />
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-6xl mx-auto px-4 py-20 text-center">
                <h2 className="text-3xl font-semibold text-slate-900 mb-4">
                    Ready to try it?
                </h2>
                <p className="text-slate-600 mb-6">
                    Sign up in under 30 seconds and start converting images immediately.
                </p>
                <Link
                    href="/auth"
                    className="px-6 py-3 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800"
                >
                    Create Your Account
                </Link>
            </section>
        </main>
    );
}

function FeatureCard({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="border border-slate-200 p-6 rounded-xl bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600 mt-2">{description}</p>
        </div>
    );
}

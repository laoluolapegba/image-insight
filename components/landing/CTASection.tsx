import Link from "next/link";

export default function CTASection() {
    return (
        <section className="py-20 md:py-24 bg-white">
            <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
                {/* Dark CTA Container */}
                <div className="relative rounded-[32px] bg-[#0f172a] px-8 py-16 md:p-20 overflow-hidden text-center">
                    {/* Background Glows */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute -top-[40%] -left-[20%] w-[60%] h-[120%] bg-blue-600/20 blur-[100px] rounded-full"></div>
                        <div className="absolute -bottom-[40%] -right-[20%] w-[60%] h-[120%] bg-indigo-600/20 blur-[100px] rounded-full"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        <h2 className="text-[28px] md:text-[40px] font-bold text-white tracking-[-0.02em] mb-4 leading-tight">
                            Want to grow your business<br className="hidden md:block" /> with us? Download now.
                        </h2>
                        <p className="text-slate-400 text-lg mb-10 max-w-[500px] mx-auto">
                            Join thousands of users who save time with UtilityLab&apos;s focused collection of productivity tools.
                        </p>
                        <Link
                            href="/app"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-[#4F46E5] rounded-full hover:bg-[#4338CA] transition-all shadow-lg shadow-indigo-500/30"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

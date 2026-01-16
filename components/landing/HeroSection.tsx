import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* Text Content - Left Aligned within max-w-5xl */}
                <div className="mx-auto max-w-5xl text-center">
                    <span className="block text-[#566AF0] mb-2 text-sm font-bold uppercase tracking-wider">Privacy-first Productivity Tool</span>
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl mb-6">
                        Simple Utilities that just Work
                    </h1>

                    <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                        A collection of focused tools designed to save you time. No bloat, no complexity – just fast, reliable tools for everyday tasks.
                    </p>

                    <div className="flex items-center justify-center gap-4 mb-16">
                        <Link
                            href="/auth?mode=signup"
                            className={cn(
                                "inline-flex items-center gap-2 rounded-full bg-[#566AF0] px-8 py-3.5 text-base font-semibold text-white transition-all hover:translate-y-[-1px] hover:bg-[#4355d6]",
                                "btn-shadow"
                            )}
                        >
                            Get Started
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="relative mx-auto max-w-5xl">
                    <div className="relative overflow-hidden rounded-[32px]">
                        <Image
                            src="/heroImage.png"
                            alt="Dashboard Preview"
                            width={1200}
                            height={800}
                            className="w-full h-auto object-cover"
                            priority
                        />
                    </div>
                    {/* Gradient glow behind image for visual effect */}
                    <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-[#566AF0] opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
                </div>

            </div>
        </section>
    );
}

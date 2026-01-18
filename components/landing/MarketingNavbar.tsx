"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MarketingNavbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-100/50 bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/imageLab_dark.png"
                        alt="UtilityLab Logo"
                        width={140}
                        height={40}
                        className="h-8 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Desktop */}
                <nav className="hidden md:flex items-center gap-4">
                    <Link
                        href="/auth?mode=signin"
                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                        Sign in
                    </Link>

                    <Link
                        href="/auth?mode=signup"
                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                        Sign up
                    </Link>

                    <Link
                        href="/auth?mode=signup"
                        className={cn(
                            "rounded-full bg-[#566AF0] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4355d6]",
                            "btn-shadow"
                        )}
                    >
                        Get Started
                    </Link>
                </nav>

                {/* Mobile toggle */}
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="md:hidden p-2 text-slate-600 hover:text-slate-900"
                    aria-label="Toggle menu"
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden border-t border-slate-100 bg-white/90 backdrop-blur-sm">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <nav className="flex flex-col gap-3">
                            <Link
                                href="/auth?mode=signin"
                                className="text-sm font-medium text-slate-700 hover:text-slate-900"
                                onClick={() => setOpen(false)}
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/auth?mode=signup"
                                className="text-sm font-medium text-slate-700 hover:text-slate-900"
                                onClick={() => setOpen(false)}
                            >
                                Sign up
                            </Link>
                            <Link
                                href="/auth?mode=signup"
                                className={cn(
                                    "mt-2 inline-flex items-center justify-center rounded-full bg-[#566AF0] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4355d6]",
                                    "btn-shadow"
                                )}
                                onClick={() => setOpen(false)}
                            >
                                Get Started
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}

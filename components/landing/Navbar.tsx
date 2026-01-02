import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-transparent bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
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
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/signin"
                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/get-started"
                        className={cn(
                            "rounded-full bg-[#566AF0] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4355d6]",
                            "btn-shadow"
                        )}
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}

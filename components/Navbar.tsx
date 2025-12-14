// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type AuthState =
    | { status: "loading" }
    | { status: "signedOut" }
    | { status: "signedIn"; email: string | null };

export default function Navbar() {
    const [auth, setAuth] = useState<AuthState>({ status: "loading" });
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!isMounted) return;

            if (user) setAuth({ status: "signedIn", email: user.email ?? null });
            else setAuth({ status: "signedOut" });
        };

        load();

        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            const user = session?.user ?? null;
            if (user) setAuth({ status: "signedIn", email: user.email ?? null });
            else setAuth({ status: "signedOut" });
        });

        return () => {
            isMounted = false;
            sub.subscription.unsubscribe();
        };
    }, []);

    const onSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/"); // back to landing
        router.refresh();
    };

    const onApp = pathname === "/app";

    return (
        <header className="w-full border-b border-slate-200 bg-white/70 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-slate-900" />
                    <span className="text-sm font-semibold text-slate-900">Image→Text</span>
                    <span className="text-[11px] text-slate-500">beta</span>
                </Link>

                {/* Actions */}
                <nav className="flex items-center gap-3">
                    {/* Open App: still useful on landing; optional to hide when already on /app */}
                    {!onApp && (
                        <Link
                            href="/app"
                            className="text-sm font-medium text-slate-700 hover:text-slate-900"
                        >
                            Open App
                        </Link>
                    )}

                    {auth.status === "loading" ? (
                        <span className="text-xs text-slate-500">…</span>
                    ) : auth.status === "signedOut" ? (
                        <Link
                            href="/auth"
                            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
                        >
                            Sign in / Sign up
                        </Link>
                    ) : (
                        <div className="flex items-center gap-3">
                            <span className="hidden sm:inline text-xs text-slate-600">
                                Signed in as{" "}
                                <span className="font-medium text-slate-900">
                                    {auth.email ?? "user"}
                                </span>
                            </span>

                            <button
                                type="button"
                                onClick={onSignOut}
                                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-100 transition"
                            >
                                Sign out
                            </button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}

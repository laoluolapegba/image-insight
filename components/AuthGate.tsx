"use client";

import { ReactNode, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Props {
    children: ReactNode;
}

export default function AuthGate({ children }: Props) {
    const [loading, setLoading] = useState(true);
    const [isAuthed, setIsAuthed] = useState(false);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser();
            const user = data.user;
            setIsAuthed(!!user);
            setEmail(user?.email ?? null);
            setLoading(false);
        };

        checkUser();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthed(!!session?.user);
            setEmail(session?.user?.email ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    if (loading) {
        return (
            <div className="text-sm text-slate-600">
                Checking session...
            </div>
        );
    }

    if (!isAuthed) {
        return (
            <div className="space-y-2">
                <p className="text-sm text-slate-700">
                    You need to sign in to use the tool.
                </p>
                <a
                    href="/auth"
                    className="inline-flex items-center text-sm text-slate-900 underline"
                >
                    Go to sign in / sign up
                </a>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Signed in as {email}</span>
                <button
                    onClick={handleSignOut}
                    className="underline hover:text-slate-900"
                >
                    Sign out
                </button>
            </div>
            {children}
        </div>
    );
}

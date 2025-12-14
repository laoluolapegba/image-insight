// components/ImageUpload.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const DAILY_LIMIT = 3;
type ToastType = "success" | "error" | "info";
type ProviderName = "google" | "textract";

function getTodayRangeISO() {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    return {
        from: start.toISOString(),
        to: end.toISOString(),
    };
}

type ItemStatus = "pending" | "processing" | "done" | "error" | "limit";

interface UploadItem {
    id: string;
    fileName: string;
    fileSize: number;
    previewUrl: string;
    status: ItemStatus;
    text?: string;
    confidence?: number | null;
    error?: string | null;
    provider?: ProviderName;
    retryCount?: number;
    createdAt?: string; // when this tile was created (client-side)
}

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    const url = URL.createObjectURL(file);
    try {
        const img = new Image();
        img.src = url;

        await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("Failed to load image for dimension detection."));
        });

        return { width: img.naturalWidth, height: img.naturalHeight };
    } finally {
        URL.revokeObjectURL(url);
    }
}

function toBaseName(fileName: string) {
    // remove extension for export files
    const idx = fileName.lastIndexOf(".");
    return idx > 0 ? fileName.slice(0, idx) : fileName;
}

function downloadBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export default function ImageUpload() {
    const [items, setItems] = useState<UploadItem[]>([]);
    const [isCheckingLimit, setIsCheckingLimit] = useState(true);
    const [uploadsUsedToday, setUploadsUsedToday] = useState<number | null>(null);
    const [limitError, setLimitError] = useState<string | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);

    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

    // In-memory file store for retries (session-only)
    const fileMap = useMemo(() => new Map<string, File>(), []);

    const showToast = (message: string, type: ToastType = "info") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2500);
    };

    // ---------- Usage count (per day) ----------
    const fetchUsageToday = useCallback(async () => {
        setIsCheckingLimit(true);
        setLimitError(null);

        try {
            const { from, to } = getTodayRangeISO();

            const { count, error } = await supabase
                .from("ocr_results")
                .select("id", { count: "exact", head: true })
                .gte("created_at", from)
                .lte("created_at", to);

            if (error) {
                console.error("Error fetching usage:", error);
                setLimitError("Could not load usage info. You can still upload.");
                setUploadsUsedToday(0);
            } else {
                setUploadsUsedToday(count ?? 0);
            }
        } catch (err) {
            console.error("Unexpected error fetching usage:", err);
            setLimitError("Could not load usage info. You can still upload.");
            setUploadsUsedToday(0);
        } finally {
            setIsCheckingLimit(false);
        }
    }, []);

    useEffect(() => {
        fetchUsageToday();
    }, [fetchUsageToday]);

    const limitReached = uploadsUsedToday !== null && uploadsUsedToday >= DAILY_LIMIT;

    // ---------- File handling ----------
    const createItemId = () =>
        `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    const handleFiles = useCallback(
        (files: FileList | null) => {
            if (!files || files.length === 0) return;

            const arr = Array.from(files);

            setItems((prev) => {
                const newItems = [...prev];

                arr.forEach((file) => {
                    if (!file.type.startsWith("image/")) {
                        showToast("Only image files are supported.", "error");
                        return;
                    }

                    const id = createItemId();
                    const previewUrl = URL.createObjectURL(file);

                    // store for retry
                    fileMap.set(id, file);

                    const used = uploadsUsedToday ?? 0;

                    let status: ItemStatus = "pending";
                    let error: string | null = null;

                    if (used >= DAILY_LIMIT) {
                        status = "limit";
                        error = "Daily limit reached.";
                    }

                    const item: UploadItem = {
                        id,
                        fileName: file.name,
                        fileSize: file.size,
                        previewUrl,
                        status,
                        error,
                        retryCount: 0,
                        createdAt: new Date().toISOString(),
                    };

                    newItems.push(item);

                    if (status !== "limit") {
                        processFile(id, file);
                    }
                });

                return newItems;
            });
        },
        [uploadsUsedToday, fileMap]
    );

    const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(false);
        handleFiles(event.dataTransfer.files);
    };

    const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(true);
    };

    const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(false);
    };

    const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(event.target.files);
    };

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
            fileMap.clear();
        };
    }, [items, fileMap]);

    // ---------- OCR processing ----------
    const updateItem = (id: string, partial: Partial<UploadItem>) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
        );
    };

    const processFile = async (id: string, file: File) => {
        updateItem(id, { status: "processing", error: null });

        const form = new FormData();
        form.append("file", file);

        try {
            const { width, height } = await getImageDimensions(file);

            const res = await fetch("/api/extract-text", {
                method: "POST",
                headers: {
                    "x-image-width": String(width),
                    "x-image-height": String(height),
                    "x-file-bytes": String(file.size),
                    "x-file-name": file.name,
                },
                body: form,
            });

            const json = await res.json();

            if (!res.ok || json.error) {
                console.error("OCR failed:", json);
                updateItem(id, {
                    status: "error",
                    error: json?.error || "OCR failed. Try a clearer image.",
                });
                showToast("OCR failed for one of the images.", "error");
                return;
            }

            const rawText: string = json.rawText || "";
            const confidence: number | null = json.confidence ?? null;
            const providerUsed: ProviderName = (json.providerUsed as ProviderName) || "google";

            if (!rawText.trim()) {
                updateItem(id, {
                    status: "error",
                    text: "",
                    confidence,
                    error: "No text found.",
                    provider: providerUsed,
                });
                showToast("No text found in one image.", "info");
                return;
            }

            updateItem(id, {
                status: "done",
                text: rawText,
                confidence,
                error: null,
                provider: providerUsed,
            });

            // Save to Supabase & bump usage ONLY on success
            const {
                data: { user },
                error: userErr,
            } = await supabase.auth.getUser();

            if (!user || userErr) {
                console.error("No user found when saving OCR result:", userErr);
            } else {
                const { error: insertErr } = await supabase.from("ocr_results").insert({
                    user_id: user.id,
                    file_name: file.name,
                    raw_text: rawText,
                    confidence: confidence,
                    provider: providerUsed,
                });

                if (insertErr) {
                    console.error("Error saving OCR result:", insertErr);
                } else {
                    setUploadsUsedToday((prev) => (prev === null ? 1 : prev + 1));
                }
            }

            showToast(`Text extracted (${providerUsed === "google" ? "Vision" : "Textract"}).`, "success");
        } catch (err) {
            console.error("Upload error", err);
            updateItem(id, {
                status: "error",
                error: "Something went wrong uploading this file.",
            });
            showToast("Something went wrong processing one of the files.", "error");
        }
    };

    const retryItem = async (id: string) => {
        const item = items.find((i) => i.id === id);
        if (!item) return;

        if (uploadsUsedToday !== null && uploadsUsedToday >= DAILY_LIMIT) {
            showToast("Daily limit reached. Try again tomorrow.", "error");
            updateItem(id, { status: "limit", error: "Daily limit reached." });
            return;
        }

        const file = fileMap.get(id);
        if (!file) {
            showToast("Original file not available. Please re-upload.", "error");
            return;
        }

        updateItem(id, { retryCount: (item.retryCount ?? 0) + 1 });
        await processFile(id, file);
    };

    // ---------- Delete tile + clear all ----------
    const deleteItem = (id: string) => {
        setItems((prev) => {
            const item = prev.find((p) => p.id === id);
            if (item) URL.revokeObjectURL(item.previewUrl);
            return prev.filter((p) => p.id !== id);
        });

        fileMap.delete(id);

        if (expandedItemId === id) {
            setExpandedItemId(null);
        }
    };

    const clearAll = () => {
        items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
        fileMap.clear();
        setItems([]);
        setExpandedItemId(null);
        showToast("Cleared all items.", "info");
    };

    // ---------- Export ----------
    const exportTxt = (item: UploadItem) => {
        if (!item.text) return;
        const base = toBaseName(item.fileName || "extracted");
        const blob = new Blob([item.text], { type: "text/plain;charset=utf-8" });
        downloadBlob(blob, `${base}.txt`);
        showToast("Exported .txt", "success");
    };

    const exportJson = (item: UploadItem) => {
        if (!item.text) return;

        const payload = {
            id: item.id,
            file: {
                name: item.fileName,
                sizeBytes: item.fileSize,
            },
            ocr: {
                provider: item.provider ?? null,
                confidence: item.confidence ?? null,
                text: item.text,
            },
            status: item.status,
            error: item.error ?? null,
            createdAt: item.createdAt ?? null,
            exportedAt: new Date().toISOString(),
        };

        const base = toBaseName(item.fileName || "extracted");
        const blob = new Blob([JSON.stringify(payload, null, 2)], {
            type: "application/json;charset=utf-8",
        });
        downloadBlob(blob, `${base}.json`);
        showToast("Exported .json", "success");
    };

    // ---------- Controls ----------
    const handleCopy = async (item: UploadItem) => {
        if (!item.text) return;
        try {
            await navigator.clipboard.writeText(item.text);
            showToast("Text copied to clipboard.", "success");
        } catch (err) {
            console.error("Copy failed:", err);
            showToast("Copy failed.", "error");
        }
    };

    const handleDownload = (item: UploadItem) => {
        const link = document.createElement("a");
        link.href = item.previewUrl;
        link.download = item.fileName || "image";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const expandedItem = items.find((i) => i.id === expandedItemId) || null;

    const uploadBoxClasses = [
        "rounded-2xl",
        "border",
        "p-6",
        "flex flex-col items-center justify-center text-center",
        "cursor-pointer",
        "backdrop-blur-xl",
        "transition",
        "bg-white/40",
        "border-white/50",
        "hover:bg-white/60",
        isDragActive ? "scale-[1.02] shadow-2xl border-blue-300 bg-white/70" : "",
    ].join(" ");

    return (
        <div className="relative space-y-6">
            {/* Usage header */}
            <div className="rounded-2xl bg-white/40 border border-white/40 backdrop-blur-xl px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h2 className="text-sm font-semibold text-slate-900">Daily usage</h2>
                    <p className="text-xs text-slate-600">
                        Free tier: {DAILY_LIMIT} successful image-to-text conversions per day.
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        Provider: <span className="font-medium">Auto (Vision ↔ Textract)</span>
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <p className="text-xs text-slate-900 font-medium">
                        {uploadsUsedToday === null ? "Loading..." : `${uploadsUsedToday}/${DAILY_LIMIT} used today`}
                    </p>

                    {limitError && <p className="text-[11px] text-amber-700 text-right">{limitError}</p>}

                    {limitReached && (
                        <p className="text-[11px] text-red-600 text-right">
                            Limit reached for today. New uploads will be blocked.
                        </p>
                    )}

                    {items.length > 0 && (
                        <button
                            type="button"
                            onClick={clearAll}
                            className="text-[11px] px-3 py-1 rounded-xl border border-white/60 bg-white/60 hover:bg-white text-slate-700"
                        >
                            Clear all
                        </button>
                    )}
                </div>
            </div>

            {/* Upload area */}
            <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                className={uploadBoxClasses}
                onClick={() => document.getElementById("multi-file-input")?.click()}
            >
                <p className="text-sm font-medium text-slate-900">Drag & drop one or more images</p>
                <p className="text-xs text-slate-600 mt-1">or click to choose files from your device</p>
                <input
                    id="multi-file-input"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={onFileInputChange}
                />
            </div>

            {/* Tiles list */}
            {items.length > 0 && (
                <div className="space-y-3">
                    {items.map((item) => {
                        const sizeKB = (item.fileSize / 1024).toFixed(1);
                        const preview =
                            (item.text || item.error || "")?.length > 140
                                ? (item.text || item.error || "").slice(0, 140) + "…"
                                : item.text || item.error || "";

                        const canExport = Boolean(item.text && item.status === "done");

                        return (
                            <div
                                key={item.id}
                                className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-lg px-3 py-3"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/70 bg-white/80 flex-shrink-0">
                                        <img src={item.previewUrl} alt={item.fileName} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-xs font-medium text-slate-900 truncate">{item.fileName}</p>
                                            <span className="text-[10px] text-slate-500 whitespace-nowrap">{sizeKB} KB</span>
                                        </div>

                                        <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                                            {item.status === "processing" && (
                                                <>
                                                    <span className="inline-block h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                                                    <span>Processing…</span>
                                                </>
                                            )}
                                            {item.status === "done" && item.confidence != null && (
                                                <span>{item.confidence.toFixed(1)}% confidence</span>
                                            )}
                                            {item.status === "error" && <span className="text-red-600">Error</span>}
                                            {item.status === "limit" && <span className="text-red-600">Daily limit</span>}

                                            {item.provider && (
                                                <span className="text-[10px] text-slate-500">
                                                    • {item.provider === "google" ? "Vision" : "Textract"}
                                                </span>
                                            )}

                                            {item.status === "error" && (
                                                <button
                                                    type="button"
                                                    onClick={() => retryItem(item.id)}
                                                    className="px-2 py-0.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
                                                >
                                                    Retry
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-[10px] flex-wrap justify-end">
                                        <button
                                            type="button"
                                            onClick={() => deleteItem(item.id)}
                                            className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
                                        >
                                            Delete
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDownload(item)}
                                            className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
                                        >
                                            Download
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleCopy(item)}
                                            disabled={!item.text}
                                            className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40"
                                        >
                                            Copy
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => exportTxt(item)}
                                            disabled={!canExport}
                                            className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40"
                                        >
                                            Export TXT
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => exportJson(item)}
                                            disabled={!canExport}
                                            className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40"
                                        >
                                            Export JSON
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setExpandedItemId(item.id)}
                                            className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
                                        >
                                            Expand
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-2 border-t border-white/70 pt-2">
                                    {item.status === "processing" && <p className="text-[11px] text-slate-500">Extracting text…</p>}
                                    {preview && <p className="text-[11px] text-slate-700">{preview}</p>}
                                    {!preview && item.status === "done" && (
                                        <p className="text-[11px] text-slate-500">No text preview available.</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {toast && (
                <div className="fixed bottom-6 right-6 z-50">
                    <div
                        className={`
              rounded-xl px-4 py-2 text-sm shadow-lg 
              backdrop-blur-xl border
              ${toast.type === "success"
                                ? "bg-emerald-50/80 border-emerald-200 text-emerald-800"
                                : toast.type === "error"
                                    ? "bg-red-50/80 border-red-200 text-red-800"
                                    : "bg-slate-50/80 border-slate-200 text-slate-800"
                            }
            `}
                    >
                        {toast.message}
                    </div>
                </div>
            )}

            {expandedItem && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                    <div className="max-w-lg w-full mx-4 rounded-2xl bg-white shadow-2xl border border-slate-200 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-900">Full extracted text</h3>
                            <button
                                type="button"
                                onClick={() => setExpandedItemId(null)}
                                className="text-xs text-slate-500 hover:text-slate-900"
                            >
                                Close
                            </button>
                        </div>

                        <p className="text-xs text-slate-500">
                            {expandedItem.fileName} • {(expandedItem.fileSize / 1024).toFixed(1)} KB
                            {expandedItem.provider &&
                                ` • ${expandedItem.provider === "google" ? "Vision" : "Textract"}`}
                        </p>

                        <div className="border border-slate-200 rounded-xl bg-slate-50 p-3 max-h-80 overflow-auto">
                            {expandedItem.text ? (
                                <pre className="whitespace-pre-wrap text-xs text-slate-800">{expandedItem.text}</pre>
                            ) : (
                                <p className="text-xs text-slate-500">{expandedItem.error || "No text available."}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

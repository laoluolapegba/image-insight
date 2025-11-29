// components/ImageUpload.tsx
"use client";

import { useCallback, useEffect, useState } from "react";


export default function ImageUpload() {
    const [ocrText, setOcrText] = useState<string | null>(null);
    const [ocrConfidence, setOcrConfidence] = useState<number | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFiles = useCallback((files: FileList | null) => {
        if (!files || files.length === 0) return;
        const selected = files[0];

        if (!selected.type.startsWith("image/")) {
            setError("Please upload an image file (PNG, JPG, etc.)");
            setFile(null);
            setPreviewUrl(null);
            return;
        }

        setError(null);
        setFile(selected);
    }, []);

    const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        handleFiles(event.dataTransfer.files);
    };

    const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(event.target.files);
    };

    // Create / clean up preview URL
    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [file]);

    // Placeholder for later: uploading to /api/extract-text
    const onUploadClick = async () => {
        if (!file) return;

        const form = new FormData();
        form.append("file", file);

        try {
            setIsUploading(true);
            setOcrText(null);
            setOcrConfidence(null);

            const res = await fetch("/api/extract-text", {
                method: "POST",
                body: form,
            });

            const json = await res.json();
            console.log("OCR Response:", json);

            if (!res.ok || json.error) {
                alert("OCR failed: " + (json.error || "Unknown error"));
                return;
            }

            setOcrText(json.rawText);
            setOcrConfidence(json.confidence);
        } catch (err) {
            console.error("Upload error", err);
            alert("Something went wrong uploading the file.");
        } finally {
            setIsUploading(false);
        }
    };



    return (
        <div className="max-w-xl mx-auto space-y-4">
            <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-slate-500 transition"
                onClick={() => document.getElementById("file-input")?.click()}
            >
                <p className="text-sm font-medium text-slate-700">
                    Drag & drop an image here
                </p>
                <p className="text-xs text-slate-500 mt-1">
                    or click to choose a file from your device
                </p>
                <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFileInputChange}
                />
            </div>

            {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}

            {file && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-700">
                            <p className="font-medium truncate">
                                Selected: {file.name}
                            </p>
                            <p className="text-xs text-slate-500">
                                {(file.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                        <button
                            type="button"
                            className="text-xs text-slate-500 hover:text-slate-700 underline"
                            onClick={() => {
                                setFile(null);
                                setPreviewUrl(null);
                            }}
                        >
                            Clear
                        </button>
                    </div>

                    {previewUrl && (
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full max-h-80 object-contain bg-slate-50"
                            />
                        </div>


                    )}


                    <button
                        type="button"
                        onClick={onUploadClick}
                        disabled={!file}
                        className="w-full mt-2 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-slate-900 text-white text-sm font-medium px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition"
                    >
                        Upload (stub for now)
                    </button>
                </div>
            )}
            {ocrText && (
                <div className="mt-4 border border-slate-200 rounded-xl p-3 bg-white">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-semibold text-slate-800">
                            Extracted Text
                        </h2>
                        {ocrConfidence !== null && (
                            <span className="text-xs text-slate-500">
                                Confidence: {ocrConfidence.toFixed(1)}%
                            </span>
                        )}
                    </div>
                    <pre className="whitespace-pre-wrap text-xs text-slate-700 max-h-64 overflow-auto">
                        {ocrText}
                    </pre>
                </div>
            )}
        </div>
    );
}

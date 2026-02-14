"use client";

import { Download } from "lucide-react";
import { generatePDF } from "@/lib/pdf-generator";
import { useState } from "react";

interface DownloadPDFProps {
    elementId: string;
    filename: string;
    label?: string;
    className?: string;
}

export function DownloadPDF({ elementId, filename, label = "Descargar PDF", className }: DownloadPDFProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        setIsGenerating(true);
        await generatePDF(elementId, filename);
        setIsGenerating(false);
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isGenerating}
            className={className || "flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest mx-auto hover:bg-emerald-700 transition-all disabled:opacity-50"}
        >
            <Download size={14} className={isGenerating ? "animate-bounce" : ""} />
            {isGenerating ? "Generando..." : label}
        </button>
    );
}

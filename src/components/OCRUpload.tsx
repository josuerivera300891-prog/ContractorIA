"use client";

import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Sparkles, Check, X } from 'lucide-react';
import { processMaterialListOCR } from '@/app/actions/ocr';
import { motion, AnimatePresence } from 'framer-motion';

interface OCRUploadProps {
    onItemsExtracted: (items: any[]) => void;
}

export function OCRUpload({ onItemsExtracted }: OCRUploadProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);

        setIsProcessing(true);

        try {
            // Convert to base64 without the prefix
            const b64 = await toBase64(file);
            const base64Data = (b64 as string).split(',')[1];

            const result = await processMaterialListOCR(base64Data);

            if (result.success && result.items) {
                onItemsExtracted(result.items);
                setPreview(null); // Clear preview on success
            } else {
                alert("Error de IA: " + result.error);
            }
        } catch (error) {
            console.error(error);
            alert("Error al procesar la imagen.");
        } finally {
            setIsProcessing(false);
        }
    };

    const toBase64 = (file: File) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    return (
        <div className="relative">
            <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            />

            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="pro-button !bg-deep-blue text-white shadow-xl shadow-deep-blue/20 group relative overflow-hidden"
            >
                <div className="flex items-center gap-2 relative z-10">
                    {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                    {isProcessing ? "Analizando Materiales..." : "Carga Inteligente (AI)"}
                    {!isProcessing && <Sparkles size={14} className="text-turq-primary animate-pulse" />}
                </div>

                {isProcessing && (
                    <motion.div
                        className="absolute inset-0 bg-turq-primary/20"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                )}
            </button>

            <AnimatePresence>
                {preview && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute top-full mt-4 p-4 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 w-64"
                    >
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Previsualización</p>
                        <img src={preview} className="w-full h-40 object-cover rounded-2xl mb-4" alt="OCR Preview" />
                        <div className="flex gap-2">
                            <button onClick={() => setPreview(null)} className="flex-1 py-2 rounded-xl bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-colors">Cancelar</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

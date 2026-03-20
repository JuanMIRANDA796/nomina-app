'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentation } from '@/context/PresentationContext';

export default function MacroeconomicAnalysisSlide() {
    const { data: globalData, updateSection } = usePresentation();
    const [isEditing, setIsEditing] = useState(false);
    const paragraphs = globalData.macroAnalysis;

    const handleUpdate = (index: number, value: string) => {
        const newData = [...paragraphs];
        newData[index] = value;
        updateSection('macroAnalysis', newData);
    };

    // Helper to format Bold text (**text**) to <strong>text</strong>
    const formatText = (text: string) => {
        if (!text) return { __html: '' };
        const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-pink-600 font-black">$1</strong>');
        return { __html: formatted };
    };

    return (
        <div className="w-full h-full flex flex-col p-8 md:p-24 bg-white text-slate-800 relative overflow-hidden group">
            {/* LARGE GRAPHIC ARCH (Semi-circle) */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] border-[60px] border-pink-500/10 rounded-full translate-x-1/2 -translate-y-1/4" />

            {/* EDIT BUTTON */}
            <button
                onClick={() => setIsEditing(true)}
                className="absolute top-8 left-8 z-20 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold transition-all text-slate-500 opacity-0 group-hover:opacity-100"
            >
                ✎ Editar Texto
            </button>

            {/* HEADER AREA */}
            <div className="w-full flex justify-between items-start mb-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-5xl md:text-7xl font-black text-[#9D1D5A] tracking-tighter">
                        Análisis Macroeconómico
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="w-48 md:w-64"
                >
                    <img src="/logo-presente.png" alt="Presente" className="w-full h-auto object-contain" />
                    <p className="text-right text-[10px] text-pink-600 font-bold uppercase tracking-widest mt-1">Fondo de Empleados</p>
                </motion.div>
            </div>

            {/* TEXT CONTENT */}
            <div className="flex-1 w-full max-w-5xl flex flex-col gap-10 relative z-10 overflow-y-auto custom-scrollbar pr-4">
                {paragraphs.map((p: string, idx: number) => (
                    <motion.p
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        className="text-lg md:text-2xl leading-relaxed text-slate-700 font-medium text-justify"
                        dangerouslySetInnerHTML={formatText(p)}
                    />
                ))}
            </div>

            {/* EDIT MODAL */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] bg-slate-900/98 backdrop-blur-2xl flex items-center justify-center p-8"
                    >
                        <div className="bg-white border shadow-2xl rounded-[2rem] p-10 w-full max-w-4xl max-h-[90vh] flex flex-col">
                            <h3 className="text-3xl font-black mb-8 flex justify-between items-center text-[#9D1D5A]">
                                Editar Análisis Narrativo
                                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </h3>

                            <div className="flex-1 overflow-auto space-y-8 pr-4 custom-scrollbar">
                                {paragraphs.map((p: string, idx: number) => (
                                    <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                        <label className="text-[10px] uppercase font-black text-pink-600 mb-2 block tracking-widest">Párrafo {idx + 1}</label>
                                        <textarea
                                            className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-800 text-lg outline-none focus:border-pink-500 min-h-[120px] resize-none shadow-inner"
                                            value={p}
                                            onChange={(e) => handleUpdate(idx, e.target.value)}
                                            placeholder="Escribe el párrafo aquí..."
                                        />
                                        <p className="text-[9px] text-slate-400 mt-2 font-bold italic">Usa **texto** para poner en negrita y color resaltado.</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 flex justify-end">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-16 py-5 bg-[#9D1D5A] hover:bg-[#82184A] text-white rounded-2xl font-black shadow-2xl shadow-pink-900/40 transition-all hover:scale-105"
                                >
                                    GUARDAR Y CERRAR
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E2E8F0;
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #9D1D5A;
                    opacity: 0.5;
                }
            `}</style>
        </div>
    );
}

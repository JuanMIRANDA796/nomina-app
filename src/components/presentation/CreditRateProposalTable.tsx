'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentation } from '@/context/PresentationContext';

export default function CreditRateProposalTable() {
    const { data, updateSection } = usePresentation();
    const [isEditing, setIsEditing] = useState(false);
    
    // Safely get data or default to empty array
    const SECTIONS = data?.creditRateProposals || [];
    
    const [editValue, setEditValue] = useState(JSON.stringify(SECTIONS, null, 2));

    const handleSaveEdit = () => {
        try {
            const parsed = JSON.parse(editValue);
            updateSection('creditRateProposals', parsed);
            setIsEditing(false);
        } catch (e) {
            alert('Error parsing JSON. Check your syntax.');
        }
    };

    return (
        <div className="w-full h-full bg-[#1e1e1e] rounded-3xl border border-white/5 p-4 md:p-6 flex flex-col shadow-2xl font-sans overflow-hidden relative">
            <div className="mb-3 flex justify-between items-end border-b border-white/10 pb-2">
                <div>
                    <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Propuesta de Tasas de Crédito</h2>
                    <p className="text-slate-500 text-[10px] mt-1 font-black uppercase tracking-widest">Acuerdo Estratégico Comité Ejecutivo 2026</p>
                </div>
                <button
                    onClick={() => {
                        setEditValue(JSON.stringify(SECTIONS, null, 2));
                        setIsEditing(true);
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold transition-all border border-white/10 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                    Editar Datos
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0a0a0a] rounded-xl border border-white/10 shadow-inner">
                <table className="w-full border-collapse h-full">
                    <thead className="sticky top-0 z-30">
                        <tr className="bg-slate-900 border-b border-white/10">
                            <th className="px-4 py-1 text-left text-xs font-black text-white w-1/4"></th>
                            <th colSpan={2} className="px-2 py-1 text-center text-[9px] font-black text-slate-400 border-x border-white/5 uppercase">Actual EA</th>
                            <th colSpan={2} className="px-2 py-1 text-center text-[9px] font-black text-pink-500 border-x border-white/5 uppercase bg-pink-500/5">Propuesta EA</th>
                            <th colSpan={2} className="px-2 py-1 text-center text-[9px] font-black text-slate-400 border-x border-white/5 uppercase">MV (Mes Vencido)</th>
                        </tr>
                        <tr className="bg-[#1a1a1a] shadow-md">
                            <th className="px-4 py-1.5 text-left text-[9px] font-black text-slate-500 uppercase tracking-widest border border-white/10">Modalidad</th>
                            <th className="px-2 py-1 text-center text-[8px] font-black text-slate-600 uppercase border border-white/10">Tasa Min</th>
                            <th className="px-2 py-1 text-center text-[8px] font-black text-slate-600 uppercase border border-white/10">Tasa Max</th>
                            <th className="px-2 py-1 text-center text-[8px] font-black text-pink-600 uppercase border border-white/10 bg-pink-500/5">Tasa Min</th>
                            <th className="px-2 py-1 text-center text-[8px] font-black text-pink-600 uppercase border border-white/10 bg-pink-500/5">Tasa Max</th>
                            <th className="px-2 py-1 text-center text-[8px] font-black text-slate-600 uppercase border border-white/10">Tasa Min</th>
                            <th className="px-2 py-1 text-center text-[8px] font-black text-slate-600 uppercase border border-white/10">Tasa Max</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {SECTIONS.map((section: any, sIdx: number) => (
                            <React.Fragment key={sIdx}>
                                <tr className="bg-black/50">
                                    <td colSpan={7} className="px-4 py-1 text-[9px] font-black text-pink-500 uppercase tracking-[0.4em] border-y border-white/5 bg-slate-950/40">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-1 bg-pink-600 rounded-full"></div>
                                            {section.name}
                                        </div>
                                    </td>
                                </tr>
                                {section.rows.map((row: any, rIdx: number) => (
                                    <tr key={`${sIdx}-${rIdx}`} className="hover:bg-white/5 transition-all duration-200">
                                        <td className="px-4 py-1 text-[11px] font-black text-slate-100 uppercase tracking-tight">{row.modalidad}</td>
                                        <td className="px-2 py-1 text-center text-[10px] text-slate-400 border-x border-white/5">{row.actMin}</td>
                                        <td className="px-2 py-1 text-center text-[10px] text-slate-600 italic border-x border-white/5">{row.actMax}</td>
                                        <td className="px-2 py-1 text-center text-[11px] text-white font-black border-x border-white/5 bg-pink-500/5">{row.propMin}</td>
                                        <td className="px-2 py-1 text-center text-[11px] text-pink-200 font-bold border-x border-white/5 bg-pink-500/5 italic">{row.propMax}</td>
                                        <td className="px-2 py-1 text-center text-[10px] text-slate-300 font-bold border-x border-white/5">{row.mvMin}</td>
                                        <td className="px-2 py-1 text-center text-[10px] text-slate-500 border-x border-white/5 italic">{row.mvMax}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-3 flex justify-between items-center text-[8px] text-slate-500 font-black uppercase tracking-[0.2em] opacity-50">
                <span>Comité de Crédito / Marzo 2026</span>
                <span className="text-pink-600 font-bold uppercase">Estrictamente Confidencial</span>
            </div>

            {/* EDIT DATA MODAL */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-xl rounded-3xl p-8 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-2xl font-bold text-white">Editar Datos de Propuestas</h4>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border border-slate-600 hover:bg-slate-800 rounded-lg text-slate-300 transition-all font-bold"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-2 bg-pink-600 hover:bg-pink-500 rounded-lg text-white font-bold transition-all"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-black/50 border border-white/10 rounded-xl overflow-hidden p-4">
                            <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-full h-full bg-transparent text-slate-300 font-mono text-sm resize-none outline-none custom-scrollbar"
                                spellCheck="false"
                            />
                        </div>
                        <p className="text-slate-500 text-xs mt-4">
                            Nota: Asegúrate de mantener el formato JSON válido.
                        </p>
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
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 20, 147, 0.4);
                }
            `}</style>
        </div>
    );
}

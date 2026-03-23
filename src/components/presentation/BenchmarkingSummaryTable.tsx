'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentation } from '@/context/PresentationContext';

export default function BenchmarkingSummaryTable() {
    const { data, updateSection } = usePresentation();
    const [selectedMonth, setSelectedMonth] = useState('Febrero');
    const [isEditing, setIsEditing] = useState(false);
    
    const TABLE_DATA = data?.benchmarkingSummaryData || [];
    const filteredData = TABLE_DATA.filter((row: any) => row.mes === selectedMonth);
    
    // Convert to JSON for edit mode
    const [editValue, setEditValue] = useState(JSON.stringify(TABLE_DATA, null, 2));

    const handleSaveEdit = () => {
        try {
            const parsed = JSON.parse(editValue);
            updateSection('benchmarkingSummaryData', parsed);
            setIsEditing(false);
        } catch (e) {
            alert('Error parsing JSON. Check your syntax.');
        }
    };

    return (
        <div className="w-full h-full bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 flex flex-col shadow-2xl relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        Resumen Benchmarking
                        <button
                            onClick={() => {
                                setEditValue(JSON.stringify(TABLE_DATA, null, 2));
                                setIsEditing(true);
                            }}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all border border-white/10 flex items-center gap-2 tracking-normal"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                            Editar Datos
                        </button>
                    </h2>
                    <p className="text-slate-400 mt-1">Comparativo de tasas y montos por segmento</p>
                </div>

                <div className="flex bg-slate-800 p-1 rounded-xl border border-white/10">
                    {['Diciembre', 'Enero', 'Febrero'].map((month) => (
                        <button
                            key={month}
                            onClick={() => setSelectedMonth(month)}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${selectedMonth === month
                                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {month}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar rounded-xl border border-white/10 bg-black/30">
                <table className="w-full border-collapse">
                    <thead className="bg-[#D4145A] sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-white uppercase tracking-wider border-b border-white/20">Segmento de Crédito</th>
                            <th className="px-4 py-3 text-center text-[10px] font-bold text-white uppercase tracking-wider border-b border-white/20">Entidades</th>
                            <th className="px-4 py-3 text-center text-[10px] font-bold text-white uppercase tracking-wider border-b border-white/20">Monto Total</th>
                            <th className="px-4 py-3 text-center text-[10px] font-bold text-white uppercase tracking-wider border-b border-white/20">Desembolsos</th>
                            <th className="px-4 py-3 text-center text-[10px] font-bold text-white uppercase tracking-wider border-b border-white/20">Tasa Prom. EA</th>
                            <th className="px-4 py-3 text-center text-[10px] font-bold text-white uppercase tracking-wider border-b border-white/20">Tasa Presente (ea)</th>
                            <th className="px-4 py-3 text-center text-[10px] font-bold text-white uppercase tracking-wider border-b border-white/20">Variación vs Prom.</th>
                            <th className="px-4 py-3 text-center text-[10px] font-bold text-white uppercase tracking-wider border-b border-white/20">$ Desembolsos Presente</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredData.map((row: any, idx: number) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-3 text-[11px] font-medium text-slate-100">{row.segmento}</td>
                                <td className="px-4 py-3 text-center text-[11px] text-sky-400 font-bold">{row.entidades}</td>
                                <td className="px-4 py-3 text-center text-[11px] text-orange-400 font-bold">{row.monto}</td>
                                <td className="px-4 py-3 text-center text-[11px] text-slate-300">{row.desembolsos}</td>
                                <td className="px-4 py-3 text-center text-[11px] text-slate-300">{row.tasaProm}</td>
                                <td className="px-4 py-3 text-center text-[11px] text-emerald-400 font-bold">{row.tasaPresente}</td>
                                <td className="px-4 py-3 text-center text-[11px] font-bold text-emerald-500">{row.variacion}</td>
                                <td className="px-4 py-3 text-center text-[11px] text-white font-bold">{row.desembolsosPresente}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                            <h4 className="text-2xl font-bold text-white">Editar Datos de Benchmarking</h4>
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
                            Nota: Asegúrate de mantener el formato JSON válido. No elimines la clave "mes" si quieres que el filtro por mes funcione.
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

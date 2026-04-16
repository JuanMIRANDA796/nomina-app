'use client';

import React, { useState, useEffect } from 'react';
import { usePresentation } from '@/context/PresentationContext';

export default function BenchmarkingSummaryTable() {
    const { data, updateSection, setGlobalEditing } = usePresentation();
    const [selectedMonth, setSelectedMonth] = useState('Marzo');
    const [isEditing, setIsEditing] = useState(false);
    
    const globalData = data?.benchmarkingSummaryData || [];
    const [localData, setLocalData] = useState<any[]>(globalData);

    useEffect(() => {
        if (!isEditing) {
            setLocalData(globalData);
        }
    }, [globalData, isEditing]);

    const handleUpdate = (gIdx: number, field: string, value: string) => {
        const newData = [...localData];
        newData[gIdx] = { ...newData[gIdx], [field]: value };
        setLocalData(newData);
    };

    const handleSave = () => {
        updateSection('benchmarkingSummaryData', localData);
        setGlobalEditing(false);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setLocalData(globalData);
        setGlobalEditing(false);
        setIsEditing(false);
    };

    return (
        <div className="w-full h-full bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 flex flex-col shadow-2xl relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        Resumen Benchmarking
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="px-3 py-1.5 border border-slate-600 hover:bg-slate-800 rounded-lg text-slate-300 transition-all font-bold text-xs"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 rounded-lg text-white font-bold transition-all text-xs tracking-normal shadow-lg shadow-pink-600/30"
                                >
                                    Guardar Cambios
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => { setIsEditing(true); setGlobalEditing(true); }}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all border border-white/10 flex items-center gap-2 tracking-normal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>
                                Editar Datos
                            </button>
                        )}
                    </h2>
                    <p className="text-slate-400 mt-1">Comparativo de tasas y montos por segmento</p>
                </div>

                <div className="flex bg-slate-800 p-1 rounded-xl border border-white/10">
                    {['Diciembre', 'Enero', 'Febrero', 'Marzo'].map((month) => (
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
                        {localData.map((row: any, globalIdx: number) => {
                            if (row.mes !== selectedMonth) return null;
                            return (
                                <tr key={globalIdx} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-3 text-[11px] font-medium text-slate-100">
                                        {isEditing ? (
                                            <input 
                                                className="w-40 bg-white/5 border border-white/10 rounded-md px-2 py-1 focus:bg-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/20 outline-none transition-all text-white shadow-inner" 
                                                value={row.segmento} 
                                                onChange={(e) => handleUpdate(globalIdx, 'segmento', e.target.value)} 
                                            />
                                        ) : row.segmento}
                                    </td>
                                    <td className="px-4 py-3 text-center text-[11px] text-sky-400 font-bold">
                                        {isEditing ? (
                                            <input 
                                                className="w-12 bg-sky-500/5 text-center border border-sky-500/20 rounded-md px-2 py-1 focus:bg-sky-500/10 focus:border-sky-500/40 focus:ring-1 focus:ring-sky-500/30 outline-none transition-all text-sky-400 font-bold shadow-[0_0_10px_-3px_rgba(56,189,248,0.2)]" 
                                                type="number" 
                                                value={row.entidades} 
                                                onChange={(e) => handleUpdate(globalIdx, 'entidades', e.target.value)} 
                                            />
                                        ) : row.entidades}
                                    </td>
                                    <td className="px-4 py-3 text-center text-[11px] text-orange-400 font-bold">
                                        {isEditing ? (
                                            <input 
                                                className="w-24 bg-orange-500/5 text-center border border-orange-500/20 rounded-md px-2 py-1 focus:bg-orange-500/10 focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/30 outline-none transition-all text-orange-400 font-bold" 
                                                value={row.monto} 
                                                onChange={(e) => handleUpdate(globalIdx, 'monto', e.target.value)} 
                                            />
                                        ) : row.monto}
                                    </td>
                                    <td className="px-4 py-3 text-center text-[11px] text-slate-300">
                                        {isEditing ? (
                                            <input 
                                                className="w-20 bg-white/5 text-center border border-white/10 rounded-md px-2 py-1 focus:bg-white/10 focus:border-white/30 outline-none transition-all text-slate-300" 
                                                value={row.desembolsos} 
                                                onChange={(e) => handleUpdate(globalIdx, 'desembolsos', e.target.value)} 
                                            />
                                        ) : row.desembolsos}
                                    </td>
                                    <td className="px-4 py-3 text-center text-[11px] text-slate-300">
                                        {isEditing ? (
                                            <input 
                                                className="w-16 bg-white/5 text-center border border-white/10 rounded-md px-2 py-1 focus:bg-white/10 focus:border-white/30 outline-none transition-all text-slate-300" 
                                                value={row.tasaProm} 
                                                onChange={(e) => handleUpdate(globalIdx, 'tasaProm', e.target.value)} 
                                            />
                                        ) : row.tasaProm}
                                    </td>
                                    <td className="px-4 py-3 text-center text-[11px] text-emerald-400 font-bold">
                                        {isEditing ? (
                                            <input 
                                                className="w-16 bg-emerald-500/10 text-emerald-400 text-center border border-emerald-500/20 rounded-md px-2 py-1 focus:bg-emerald-500/20 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/30 outline-none transition-all font-bold shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]" 
                                                value={row.tasaPresente} 
                                                onChange={(e) => handleUpdate(globalIdx, 'tasaPresente', e.target.value)} 
                                            />
                                        ) : row.tasaPresente}
                                    </td>
                                    <td className="px-4 py-3 text-center text-[11px] font-bold text-emerald-500">
                                        {isEditing ? (
                                            <input 
                                                className="w-16 bg-transparent text-emerald-500 text-center border-b border-emerald-500/30 focus:border-emerald-400 outline-none px-1 py-1 transition-all" 
                                                value={row.variacion} 
                                                onChange={(e) => handleUpdate(globalIdx, 'variacion', e.target.value)} 
                                            />
                                        ) : row.variacion}
                                    </td>
                                    <td className="px-4 py-3 text-center text-[11px] text-white font-bold">
                                        {isEditing ? (
                                            <input 
                                                className="w-20 bg-white/5 text-center border border-white/10 rounded-md px-2 py-1 focus:bg-white/10 focus:border-white/30 outline-none transition-all text-white font-bold" 
                                                value={row.desembolsosPresente} 
                                                onChange={(e) => handleUpdate(globalIdx, 'desembolsosPresente', e.target.value)} 
                                            />
                                        ) : row.desembolsosPresente}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

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

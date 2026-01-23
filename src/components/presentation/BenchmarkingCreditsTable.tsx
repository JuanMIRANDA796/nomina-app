'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentation } from '@/context/PresentationContext';

export default function BenchmarkingCreditsTable() {
    const { data: globalData, updateSection } = usePresentation();
    const data = globalData.benchmarkingCredits;
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = (type: 'banks' | 'cooperatives', index: number, field: string, value: string) => {
        const newData = { ...data };
        const sectionData = [...(data as any)[type]];
        const val = value === '' || value === 'N/A' ? null : parseFloat(value);
        sectionData[index] = { ...sectionData[index], [field]: val };
        (newData as any)[type] = sectionData;
        updateSection('benchmarkingCredits', newData);
    };

    const TableHeader = () => (
        <thead className="bg-[#D4145A] text-white text-[10px] uppercase font-bold tracking-wider sticky top-0 z-10">
            <tr>
                <th rowSpan={2} className="px-4 py-3 border border-white/10 text-left">Entidad Bancaria</th>
                <th colSpan={2} className="px-4 py-2 border border-white/10 text-center">VIVIENDA VIS</th>
                <th colSpan={2} className="px-4 py-2 border border-white/10 text-center">VIVIENDA NO VIS</th>
                <th colSpan={2} className="px-4 py-2 border border-white/10 text-center">CONSUMO VEHICULO</th>
                <th colSpan={3} className="px-4 py-2 border border-white/10 text-center">COMPRA CARTERA</th>
            </tr>
            <tr>
                <th className="px-2 py-2 border border-white/10 text-center">Tasa</th>
                <th className="px-2 py-2 border border-white/10 text-center">Rank</th>
                <th className="px-2 py-2 border border-white/10 text-center">Tasa</th>
                <th className="px-2 py-2 border border-white/10 text-center">Rank</th>
                <th className="px-2 py-2 border border-white/10 text-center">Tasa</th>
                <th className="px-2 py-2 border border-white/10 text-center">Rank</th>
                <th className="px-2 py-2 border border-white/10 text-center">Desde</th>
                <th className="px-2 py-2 border border-white/10 text-center">Hasta</th>
                <th className="px-2 py-2 border border-white/10 text-center">Rank</th>
            </tr>
        </thead>
    );

    const renderRows = (type: 'banks' | 'cooperatives', label: string) => (
        <>
            <tr className="bg-pink-900/40 font-bold text-white uppercase text-xs">
                <td colSpan={10} className="px-4 py-2 border border-white/10">{label}</td>
            </tr>
            {(data as any)[type].map((row: any, idx: number) => (
                <tr key={idx} className={`hover:bg-white/5 transition-colors text-[11px] ${row.entity === 'PRESENTE' ? 'bg-indigo-900/30' : ''}`}>
                    <td className="px-4 py-1.5 border border-white/10 text-white font-medium">{row.entity}</td>
                    {['vis_tasa', 'vis_rank', 'novis_tasa', 'novis_rank', 'vehiculo_tasa', 'vehiculo_rank', 'cc_desde', 'cc_hasta', 'cc_rank'].map(field => (
                        <td key={field} className="p-0 border border-white/10">
                            {isEditing ? (
                                <input
                                    className="w-full h-full bg-white/10 text-center text-white border-none focus:ring-1 focus:ring-pink-500 outline-none p-1"
                                    value={(row as any)[field] ?? ''}
                                    onChange={(e) => handleUpdate(type, idx, field, e.target.value)}
                                />
                            ) : (
                                <div className="text-center text-slate-300 w-full py-1.5">
                                    {(row as any)[field] != null ? (field.includes('tasa') || field.includes('desde') || field.includes('hasta') ? `${Number((row as any)[field]).toFixed(2)}%` : (row as any)[field]) : 'N/A'}
                                </div>
                            )}
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );

    return (
        <div className="w-full h-full flex flex-col p-4 bg-slate-950/50 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
                        Benchmarking Vivienda, Vehículo – Compra Cartera
                    </h3>
                    <div className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full">
                        <span className="text-pink-400 text-xs font-bold uppercase tracking-tighter">Comparativo de Tasas</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${isEditing ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10'}`}
                >
                    {isEditing ? '✓ Finalizar Edición' : '✎ Editar Valores'}
                </button>
            </div>

            <div className="flex-1 overflow-auto rounded-xl border border-white/10">
                <table className="w-full border-collapse">
                    <TableHeader />
                    <tbody>
                        {renderRows('banks', 'Entidades Bancarias')}
                        {renderRows('cooperatives', 'Cooperativas Financieras')}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex gap-4 text-[10px] text-slate-500">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-500/30 border border-indigo-400/30 rounded-full"></div>
                    <span>PRESENTE</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-pink-500 border border-pink-500/20 rounded-full"></div>
                    <span>Bancos / Cooperativas</span>
                </div>
            </div>
        </div>
    );
}

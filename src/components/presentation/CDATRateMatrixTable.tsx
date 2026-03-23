'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePresentation } from '@/context/PresentationContext';

export default function CDATRateMatrixTable() {
    const { data: globalData, updateSection } = usePresentation();
    const [isEditing, setIsEditing] = useState(false);

    const data = globalData.cdatRateMatrixProposal;

    // Ajuste de handleUpdate para manejar la estructura correcta
    const handleUpdateMaturity = (rowIdx: number, field: string, value: string) => {
        const newData = JSON.parse(JSON.stringify(data));
        const val = value === '' || value === 'N/A' || value === '-' ? null : parseFloat(value.replace(',', '.'));
        newData.at_maturity.rows[rowIdx][field] = val;
        updateSection('cdatRateMatrixProposal', newData);
    };

    const handleUpdateMonthly = (groupIdx: number, rowIdx: number, field: string, value: string) => {
        const newData = JSON.parse(JSON.stringify(data));
        const val = value === '' || value === 'N/A' || value === '-' ? null : parseFloat(value.replace(',', '.'));
        newData.monthly_income.groups[groupIdx].rows[rowIdx][field] = val;
        updateSection('cdatRateMatrixProposal', newData);
    };

    return (
        <div className="w-full h-full flex flex-col p-4 bg-slate-950/50 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-indigo-400 bg-clip-text text-transparent">
                        Propuesta cambio de tasas CDATs
                    </h3>
                    <div className="h-1 w-20 bg-pink-500 mt-2 rounded-full"></div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-6 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${isEditing ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10'}`}
                    >
                        {isEditing ? '✓ Finalizar' : '✎ Editar'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-auto custom-scrollbar p-2">
                {/* AT MATURITY TABLE */}
                <div className="flex-1 flex flex-col min-w-0">
                    <h4 className="text-white font-bold text-center mb-3 text-xs uppercase tracking-wider">{data.at_maturity.title}</h4>
                    <div className="rounded-xl border border-white/10 overflow-hidden shadow-xl bg-slate-900/40">
                        <table className="w-full border-collapse">
                            <thead className="bg-[#B91C4B] text-white text-[9px] uppercase font-bold text-center">
                                <tr>
                                    <th className="px-1 py-2 border border-white/10">Plazo</th>
                                    <th className="px-1 py-2 border border-white/10">Días</th>
                                    <th className="px-1 py-2 border border-white/10">Monto</th>
                                    <th className="px-1 py-2 border border-white/10">Vigente</th>
                                    <th className="px-1 py-2 border border-white/20 bg-pink-600/50">Propuesta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.at_maturity.rows.map((row: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors text-[10px] text-center border-b border-white/5 last:border-0">
                                        <td className="px-1 py-1.5 border-r border-white/5 text-slate-300">{row.plazo}</td>
                                        <td className="px-1 py-1.5 border-r border-white/5 text-slate-400">{row.dias}</td>
                                        <td className="px-1 py-1.5 border-r border-white/5 text-slate-400 text-[8px]">{row.monto}</td>
                                        <td className="p-0 border-r border-white/5">
                                            {isEditing ? (
                                                <input
                                                    className="w-full h-full bg-white/10 text-center text-white border-none focus:ring-1 focus:ring-pink-500 outline-none p-1"
                                                    value={row.vigente ?? ''}
                                                    onChange={(e) => handleUpdateMaturity(idx, 'vigente', e.target.value)}
                                                />
                                            ) : (
                                                <div className="py-1.5 text-slate-300 font-bold">
                                                    {row.vigente != null ? `${Number(row.vigente).toFixed(2)}%` : '-'}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-0 bg-pink-500/10">
                                            {isEditing ? (
                                                <input
                                                    className="w-full h-full bg-pink-500/20 text-center text-white border-none focus:ring-1 focus:ring-pink-400 outline-none p-1 font-black"
                                                    value={row.propuesta ?? ''}
                                                    onChange={(e) => handleUpdateMaturity(idx, 'propuesta', e.target.value)}
                                                />
                                            ) : (
                                                <div className="py-1.5 text-pink-400 font-black">
                                                    {row.propuesta != null ? `${Number(row.propuesta).toFixed(2)}%` : '-'}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MONTHLY INCOME TABLE */}
                <div className="flex-1 flex flex-col min-w-0">
                    <h4 className="text-white font-bold text-center mb-3 text-xs uppercase tracking-wider">{data.monthly_income.title}</h4>
                    <div className="rounded-xl border border-white/10 overflow-hidden shadow-xl bg-slate-900/40">
                        <table className="w-full border-collapse">
                            <thead className="bg-[#B91C4B] text-white text-[9px] uppercase font-bold text-center">
                                <tr>
                                    <th className="px-1 py-2 border border-white/10">Plazo / Monto</th>
                                    <th className="px-1 py-2 border border-white/10">Vigente</th>
                                    <th className="px-1 py-2 border border-white/20 bg-pink-600/50">Propuesta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.monthly_income.groups.map((group: any, gIdx: number) => (
                                    <React.Fragment key={gIdx}>
                                        <tr className="bg-slate-800/50 text-[8px] text-pink-400 font-bold uppercase">
                                            <td colSpan={3} className="px-2 py-1 border-b border-white/5">{group.plazo}</td>
                                        </tr>
                                        {group.rows.map((row: any, rIdx: number) => (
                                            <tr key={rIdx} className="hover:bg-white/5 transition-colors text-[10px] text-center border-b border-white/5 last:border-0">
                                                <td className="px-1 py-1.5 border-r border-white/5 text-left text-slate-300">
                                                    {row.desde} - {row.hasta}
                                                </td>
                                                <td className="p-0 border-r border-white/5">
                                                    {isEditing ? (
                                                        <input
                                                            className="w-full h-full bg-white/10 text-center text-white border-none focus:ring-1 focus:ring-pink-500 outline-none p-1"
                                                            value={row.vigente ?? ''}
                                                            onChange={(e) => handleUpdateMonthly(gIdx, rIdx, 'vigente', e.target.value)}
                                                        />
                                                    ) : (
                                                        <div className="py-1.5 text-slate-300 font-bold">
                                                            {row.vigente != null ? `${Number(row.vigente).toFixed(2)}%` : '-'}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-0 bg-pink-500/10">
                                                    {isEditing ? (
                                                        <input
                                                            className="w-full h-full bg-pink-500/20 text-center text-white border-none focus:ring-1 focus:ring-pink-400 outline-none p-1 font-black"
                                                            value={row.propuesta ?? ''}
                                                            onChange={(e) => handleUpdateMonthly(gIdx, rIdx, 'propuesta', e.target.value)}
                                                        />
                                                    ) : (
                                                        <div className="py-1.5 text-pink-400 font-black">
                                                            {row.propuesta != null ? `${Number(row.propuesta).toFixed(2)}%` : '-'}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-between items-center text-[10px] text-slate-500 italic">
                <p>* Aumentar las tasas en los plazos de un año en adelante.</p>
                <div className="flex items-center gap-2">
                    <img src="/logo-presente.png" alt="Logo" className="h-4 grayscale invert opacity-50" />
                    <span className="not-italic opacity-50 uppercase tracking-widest">Comité de Precios 2026</span>
                </div>
            </div>
        </div>
    );
}

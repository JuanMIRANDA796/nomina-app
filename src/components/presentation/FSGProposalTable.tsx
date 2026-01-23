'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePresentation } from '@/context/PresentationContext';

export default function FSGProposalTable() {
    const { data: globalData, updateSection } = usePresentation();
    const data = globalData.fsgProposal;
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = (type: 'hoy' | 'propuesta', index: number, field: string, value: string) => {
        const newData = { ...data };
        const sectionData = [...(data as any)[type]];
        const val = value === '' ? 0 : parseFloat(value);
        sectionData[index] = { ...sectionData[index], [field]: val };
        (newData as any)[type] = sectionData;
        updateSection('fsgProposal', newData);
    };

    const Table = ({ title, results, type }: { title: string, results: any[], type: 'hoy' | 'propuesta' }) => (
        <div className="flex-1 flex flex-col min-w-0">
            <h4 className={`text-lg font-bold mb-4 px-4 py-2 rounded-t-xl text-center ${type === 'hoy' ? 'bg-slate-800 text-slate-400' : 'bg-pink-600/20 text-pink-500 border-x border-t border-pink-500/20'}`}>
                {title}
            </h4>
            <div className={`overflow-hidden rounded-b-xl border ${type === 'hoy' ? 'border-slate-800' : 'border-pink-500/20 shadow-lg shadow-pink-500/5'}`}>
                <table className="w-full text-xs text-left border-collapse">
                    <thead className={`${type === 'hoy' ? 'bg-slate-800 text-slate-400' : 'bg-[#D4145A] text-white'}`}>
                        <tr>
                            <th className="px-4 py-3 border border-white/10 uppercase tracking-tighter">Rango Salarial</th>
                            <th className="px-4 py-3 border border-white/10 text-center uppercase tracking-tighter">Tasa FSG NAMV</th>
                            <th className="px-4 py-3 border border-white/10 text-center uppercase tracking-tighter">Tasa Mensual</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((row: any, idx: number) => (
                            <tr key={idx} className={`hover:bg-white/5 transition-colors ${idx % 2 === 0 ? 'bg-white/2' : 'bg-transparent'}`}>
                                <td className="px-4 py-3 border border-white/10 text-white font-medium">{row.rango}</td>
                                {['namv', 'mensual'].map(field => (
                                    <td key={field} className="px-4 py-3 border border-white/10 text-center">
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="w-full bg-white/10 text-center text-white border-none focus:ring-1 focus:ring-pink-500 outline-none rounded p-1"
                                                value={row[field] ?? ''}
                                                onChange={(e) => handleUpdate(type, idx, field, e.target.value)}
                                            />
                                        ) : (
                                            <span className={`font-bold ${type === 'propuesta' ? 'text-pink-400' : 'text-slate-400'}`}>
                                                {Number(row[field]).toFixed(2)}%
                                            </span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full flex flex-col p-8 bg-slate-950/50 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-4xl font-black text-white mb-2 tracking-tight">
                        Propuesta Cambio FSG
                    </h3>
                    <p className="text-slate-400 max-w-2xl leading-relaxed">
                        Se propone continuar cobrando el FSG según <span className="text-white font-bold">rango salarial</span>, pero <span className="text-pink-500 font-bold underline decoration-pink-500/30 underline-offset-4">cambiar las tarifas</span> con el fin de ser más competitivos en los rangos de mayor ingreso.
                    </p>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-8 py-3 rounded-2xl text-sm font-black transition-all duration-300 transform active:scale-95 ${isEditing ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'}`}
                >
                    {isEditing ? '✓ FINALIZAR' : '✎ EDITAR MODELO'}
                </button>
            </div>

            <div className="flex-1 flex gap-12 items-center overflow-auto pr-4 custom-scrollbar">
                <Table title="SITUACIÓN ACTUAL (HOY)" results={data.hoy} type="hoy" />
                <div className="w-px h-64 bg-gradient-to-b from-transparent via-white/10 to-transparent shrink-0"></div>
                <Table title="PROPUESTA NUEVA" results={data.propuesta} type="propuesta" />
            </div>

            {/* Premium background effects */}
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-500/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        </div>
    );
}

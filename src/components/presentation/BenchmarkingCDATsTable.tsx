'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentation } from '@/context/PresentationContext';

export default function BenchmarkingCDATsTable() {
    const { data: globalData, updateSection } = usePresentation();
    const data = globalData.benchmarkingCDATs;
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = (groupIdx: number, entIdx: number, field: string, value: string) => {
        const newData = { ...data };
        newData.groups = [...data.groups];
        newData.groups[groupIdx] = { ...data.groups[groupIdx] };
        newData.groups[groupIdx].entities = [...data.groups[groupIdx].entities];

        const val = value === '' || value === 'N/A' ? null : parseFloat(value);
        (newData.groups[groupIdx].entities[entIdx] as any)[field] = val;

        updateSection('benchmarkingCDATs', newData);
    };

    const columns = [
        { label: '90 días', key: 'd90', pk: 'p90' },
        { label: '180 días', key: 'd180', pk: 'p180' },
        { label: '360 días', key: 'd360', pk: 'p360' },
        { label: '540 días', key: 'd540', pk: 'p540' },
        { label: '721 días', key: 'd721', pk: 'p721' },
        { label: '1081 días', key: 'd1081', pk: 'p1081' }
    ];

    return (
        <div className="w-full h-full flex flex-col p-4 bg-slate-950/50 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-indigo-400 bg-clip-text text-transparent">
                        Benchmarking CDATs
                    </h3>
                    <p className="text-slate-400 text-sm font-medium">Tasas de cartelera al 10/12/2025</p>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${isEditing ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10'}`}
                >
                    {isEditing ? '✓ Finalizar Edición' : '✎ Editar CDATs'}
                </button>
            </div>

            <div className="flex-1 overflow-auto rounded-xl border border-white/10 custom-scrollbar">
                <table className="w-full border-collapse">
                    <thead className="bg-[#D4145A] text-white text-[10px] uppercase font-bold sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3 border border-white/10 text-left min-w-[200px]">Entidad Bancaria</th>
                            {columns.map(col => (
                                <React.Fragment key={col.key}>
                                    <th className="px-2 py-3 border border-white/10 text-center">{col.label}</th>
                                    <th className="px-2 py-3 border border-white/10 text-center">Pos</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.groups.map((group: any, gIdx: number) => (
                            <React.Fragment key={gIdx}>
                                <tr className="bg-slate-900 font-bold text-white text-[10px] uppercase tracking-wider">
                                    <td colSpan={13} className="px-4 py-2 border border-white/10">{group.name}</td>
                                </tr>
                                {group.entities.map((row: any, eIdx: number) => (
                                    <tr key={eIdx} className={`hover:bg-white/5 transition-colors text-[11px] ${row.entity === 'PRESENTE' ? 'bg-indigo-900/20' : ''}`}>
                                        <td className={`px-4 py-1.5 border border-white/10 font-medium ${row.entity === 'PRESENTE' ? 'text-pink-400 font-bold' : 'text-slate-300'}`}>
                                            {row.entity}
                                        </td>
                                        {columns.map(col => (
                                            <React.Fragment key={col.key}>
                                                <td className="p-0 border border-white/10">
                                                    {isEditing ? (
                                                        <input
                                                            className="w-full h-full bg-white/10 text-center text-white border-none focus:ring-1 focus:ring-pink-500 outline-none p-1"
                                                            value={(row as any)[col.key] ?? ''}
                                                            onChange={(e) => handleUpdate(gIdx, eIdx, col.key, e.target.value)}
                                                        />
                                                    ) : (
                                                        <div className={`text-center py-1 font-bold ${(row as any)[col.key] != null ? 'text-white' : 'text-slate-600'}`}>
                                                            {(row as any)[col.key] != null ? `${Number((row as any)[col.key]).toFixed(2)}%` : '-'}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-0 border border-white/10 bg-black/20">
                                                    {isEditing ? (
                                                        <input
                                                            className="w-full h-full bg-white/5 text-center text-slate-400 border-none focus:ring-1 focus:ring-pink-500 outline-none p-1"
                                                            value={(row as any)[col.pk] ?? ''}
                                                            onChange={(e) => handleUpdate(gIdx, eIdx, col.pk, e.target.value)}
                                                        />
                                                    ) : (
                                                        <div className="text-center py-1 text-slate-500 font-medium">
                                                            {(row as any)[col.pk] ?? ''}
                                                        </div>
                                                    )}
                                                </td>
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex flex-col gap-1 text-[10px] text-slate-500">
                <p>* Tasas efectivas anuales (E.A.) para montos inferiores a $50.000.000</p>
                <p>* Los espacios en blanco es porque la entidad no tiene tasa vigente para ese plazo.</p>
            </div>
        </div>
    );
}

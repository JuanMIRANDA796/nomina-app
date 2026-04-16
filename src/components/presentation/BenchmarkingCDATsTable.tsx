'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentation } from '@/context/PresentationContext';

export default function BenchmarkingCDATsTable() {
    const { data: globalData, updateSection } = usePresentation();
    const [selectedMonth, setSelectedMonth] = useState<'diciembre' | 'enero' | 'febrero' | 'marzo'>('marzo');
    const [isEditing, setIsEditing] = useState(false);

    const data = selectedMonth === 'diciembre'
        ? globalData.benchmarkingCDATs
        : selectedMonth === 'enero'
            ? globalData.benchmarkingCDATsEnero
            : selectedMonth === 'febrero'
                ? globalData.benchmarkingCDATsFebrero
                : globalData.benchmarkingCDATsMarzo;

    const sectionKey = selectedMonth === 'diciembre'
        ? 'benchmarkingCDATs'
        : selectedMonth === 'enero'
            ? 'benchmarkingCDATsEnero'
            : selectedMonth === 'febrero'
                ? 'benchmarkingCDATsFebrero'
                : 'benchmarkingCDATsMarzo';

    const handleUpdate = (groupIdx: number, entIdx: number, field: string, value: string) => {
        const newData = JSON.parse(JSON.stringify(data));
        const val = value === '' || value === 'N/A' || value === '-' ? null : parseFloat(value);
        (newData.groups[groupIdx].entities[entIdx] as any)[field] = val;

        updateSection(sectionKey as any, newData);
    };

    const columns = [
        { label: '90 días', key: 'd90', pk: 'p90' },
        { label: '180 días', key: 'd180', pk: 'p180' },
        { label: '360 días', key: 'd360', pk: 'p360' },
        { label: '540 días', key: 'd540', pk: 'p540' },
        { label: '721 días', key: 'd721', pk: 'p721' },
        { label: '1081 días', key: 'd1081', pk: 'p1081' }
    ];

    const getVariation = (groupName: string, entityName: string, key: string, currentVal: number | null) => {
        if (selectedMonth === 'diciembre' || currentVal === null) return null;

        // Find previous month data
        const prevData = selectedMonth === 'enero' ? globalData.benchmarkingCDATs : selectedMonth === 'febrero' ? globalData.benchmarkingCDATsEnero : globalData.benchmarkingCDATsFebrero;
        if (!prevData) return null;
        const group = prevData.groups.find((g: any) => g.name === groupName);
        if (!group) return null;

        const entity = group.entities.find((e: any) => e.entity === entityName);
        if (!entity) return null;

        const prevVal = (entity as any)[key];
        if (prevVal === null || prevVal === undefined) return null;

        return currentVal - prevVal;
    };

    // Calculate position dynamically
    const getPosition = (key: string, value: number | null) => {
        if (value === null || value === undefined) return '-';

        // Collect all rates for this specific column (key) from ALL entities in ALL groups
        const allRates: number[] = [];
        data.groups.forEach((group: any) => {
            group.entities.forEach((entity: any) => {
                const rate = entity[key];
                if (rate !== null && rate !== undefined && typeof rate === 'number') {
                    allRates.push(rate);
                }
            });
        });

        if (allRates.length === 0) return '-';

        // Sort unique rates in descending order
        const uniqueSorted = Array.from(new Set(allRates)).sort((a, b) => b - a);

        // Find the rank (position) of the current value
        const rank = uniqueSorted.indexOf(value) + 1;

        return rank > 0 ? rank.toString() : '-';
    };

    return (
        <div className="w-full h-full flex flex-col p-4 bg-slate-950/50 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-indigo-400 bg-clip-text text-transparent">
                        Benchmarking CDATs <span className="text-pink-400 opacity-80">{selectedMonth === 'diciembre' ? 'Diciembre' : selectedMonth === 'enero' ? 'Enero' : selectedMonth === 'febrero' ? 'Febrero' : 'Marzo'}</span>
                    </h3>
                    <p className="text-slate-400 text-sm font-medium">Tasas de cartelera al {selectedMonth === 'diciembre' ? '10/12/2025' : selectedMonth === 'enero' ? '10/01/2026' : selectedMonth === 'febrero' ? '19/03/2026' : '16/04/2026'}</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex bg-slate-800 rounded-xl border border-white/10 overflow-hidden p-1 shadow-inner">
                        <button
                            onClick={() => setSelectedMonth('diciembre')}
                            className={`px-4 py-1.5 text-xs font-bold transition-all duration-300 rounded-lg ${selectedMonth === 'diciembre' ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20' : 'text-slate-400 hover:text-white'}`}
                        >
                            Dic
                        </button>
                        <button
                            onClick={() => setSelectedMonth('enero')}
                            className={`px-4 py-1.5 text-xs font-bold transition-all duration-300 rounded-lg ${selectedMonth === 'enero' ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20' : 'text-slate-400 hover:text-white'}`}
                        >
                            Ene
                        </button>
                        <button
                            onClick={() => setSelectedMonth('febrero')}
                            className={`px-4 py-1.5 text-xs font-bold transition-all duration-300 rounded-lg ${selectedMonth === 'febrero' ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20' : 'text-slate-400 hover:text-white'}`}
                        >
                            Feb
                        </button>
                        <button
                            onClick={() => setSelectedMonth('marzo')}
                            className={`px-4 py-1.5 text-xs font-bold transition-all duration-300 rounded-lg ${selectedMonth === 'marzo' ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20' : 'text-slate-400 hover:text-white'}`}
                        >
                            Mar
                        </button>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${isEditing ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10'}`}
                    >
                        {isEditing ? '✓ Finalizar' : '✎ Editar'}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto rounded-xl border border-white/10 custom-scrollbar">
                <table className="w-full border-collapse">
                    <thead className="bg-[#D4145A] text-white text-[10px] uppercase font-bold sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3 border border-white/10 text-left min-w-[200px]">Entidad Bancaria</th>
                            {columns.map(col => (
                                <React.Fragment key={col.key}>
                                    <th className="px-2 py-3 border border-white/10 text-center">{col.label}</th>
                                    <th className="px-2 py-3 border border-white/10 text-center text-slate-400">Var</th>
                                    <th className="px-2 py-3 border border-white/10 text-center">Pos</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {(data as any).groups.map((group: any, gIdx: number) => (
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
                                                <td className="p-0 border border-white/10 bg-black/40">
                                                    <div className={`text-center py-1 text-[9px] font-bold ${(() => {
                                                        const varVal = getVariation(group.name, row.entity, col.key, (row as any)[col.key]);
                                                        if (varVal === null) return 'text-slate-600';
                                                        if (varVal > 0) return 'text-emerald-400';
                                                        if (varVal < 0) return 'text-rose-400';
                                                        return 'text-slate-500';
                                                    })()
                                                        }`}>
                                                        {(() => {
                                                            const varVal = getVariation(group.name, row.entity, col.key, (row as any)[col.key]);
                                                            if (varVal === null) return '-';
                                                            const sign = varVal > 0 ? '+' : '';
                                                            return `${sign}${varVal.toFixed(2)}%`;
                                                        })()}
                                                    </div>
                                                </td>
                                                <td className="p-0 border border-white/10 bg-black/20">
                                                    <div className="text-center py-1 text-slate-500 font-black">
                                                        {getPosition(col.key, (row as any)[col.key])}
                                                    </div>
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

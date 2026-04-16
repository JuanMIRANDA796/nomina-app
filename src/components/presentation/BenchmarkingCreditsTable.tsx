'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentation } from '@/context/PresentationContext';

export default function BenchmarkingCreditsTable() {
    const { data: globalData, updateSection } = usePresentation();
    const [selectedMonth, setSelectedMonth] = useState<'diciembre' | 'enero' | 'febrero' | 'marzo'>('marzo');
    const [isEditing, setIsEditing] = useState(false);

    const data = selectedMonth === 'diciembre'
        ? globalData.benchmarkingCredits
        : selectedMonth === 'enero'
            ? globalData.benchmarkingCreditsEnero
            : selectedMonth === 'febrero'
                ? globalData.benchmarkingCreditsFebrero
                : globalData.benchmarkingCreditsMarzo;

    const sectionKey = selectedMonth === 'diciembre'
        ? 'benchmarkingCredits'
        : selectedMonth === 'enero'
            ? 'benchmarkingCreditsEnero'
            : selectedMonth === 'febrero'
                ? 'benchmarkingCreditsFebrero'
                : 'benchmarkingCreditsMarzo';

    const handleUpdate = (type: 'banks' | 'cooperatives', index: number, field: string, value: string) => {
        const newData = JSON.parse(JSON.stringify(data));
        const val = value === '' || value === 'N/A' || value === '-' ? null : parseFloat(value.replace('%', ''));
        (newData as any)[type][index][field] = val;
        updateSection(sectionKey as any, newData);
    };

    const getVariation = (type: 'banks' | 'cooperatives', entityName: string, field: string, currentVal: number | null) => {
        if (selectedMonth === 'diciembre' || currentVal === null) return null;
        const prevData = selectedMonth === 'enero' ? globalData.benchmarkingCredits : selectedMonth === 'febrero' ? globalData.benchmarkingCreditsEnero : globalData.benchmarkingCreditsFebrero;
        if (!prevData) return null;
        const section = (prevData as any)[type];
        if (!section) return null;
        const entity = section.find((e: any) => e.entity === entityName);
        if (!entity || (entity as any)[field] === null || (entity as any)[field] === undefined) return null;
        return currentVal - (entity as any)[field];
    };

    // Dynamic Ranking Formula (Lowest Tasa = #1)
    const getRank = (type: 'banks' | 'cooperatives', field: string, value: number | null) => {
        if (value === null || value === undefined) return '-';

        const allRates: number[] = [];
        const section = (data as any)[type];
        if (!section) return '-';

        section.forEach((entity: any) => {
            const val = entity[field];
            if (val !== null && val !== undefined && typeof val === 'number') {
                allRates.push(val);
            }
        });

        if (allRates.length === 0) return '-';
        const uniqueSorted = Array.from(new Set(allRates)).sort((a, b) => a - b);
        const rank = uniqueSorted.indexOf(value) + 1;
        return rank > 0 ? rank.toString() : '-';
    };

    const TableHeader = () => (
        <thead className="bg-[#D4145A] text-white text-[10px] uppercase font-bold tracking-wider sticky top-0 z-10">
            <tr>
                <th rowSpan={2} className="px-4 py-3 border border-white/10 text-left">Entidad Bancaria</th>
                <th colSpan={3} className="px-4 py-2 border border-white/10 text-center">VIVIENDA VIS</th>
                <th colSpan={3} className="px-4 py-2 border border-white/10 text-center">VIVIENDA NO VIS</th>
                <th colSpan={3} className="px-4 py-2 border border-white/10 text-center">CONSUMO VEHICULO</th>
                <th colSpan={4} className="px-4 py-2 border border-white/10 text-center">COMPRA CARTERA</th>
            </tr>
            <tr>
                <th className="px-2 py-2 border border-white/10 text-center">Tasa</th>
                <th className="px-2 py-2 border border-white/10 text-center text-slate-400">Var</th>
                <th className="px-2 py-2 border border-white/10 text-center">Rank</th>
                <th className="px-2 py-2 border border-white/10 text-center">Tasa</th>
                <th className="px-2 py-2 border border-white/10 text-center text-slate-400">Var</th>
                <th className="px-2 py-2 border border-white/10 text-center">Rank</th>
                <th className="px-2 py-2 border border-white/10 text-center">Tasa</th>
                <th className="px-2 py-2 border border-white/10 text-center text-slate-400">Var</th>
                <th className="px-2 py-2 border border-white/10 text-center">Rank</th>
                <th className="px-2 py-2 border border-white/10 text-center">Desde</th>
                <th className="px-2 py-2 border border-white/10 text-center">Hasta</th>
                <th className="px-2 py-2 border border-white/10 text-center text-slate-400">Var</th>
                <th className="px-2 py-2 border border-white/10 text-center">Rank</th>
            </tr>
        </thead>
    );

    const DataCell = ({ type, idx, field, row, isTasa = false }: any) => {
        const value = (row as any)[field];
        const isEditingField = isEditing && isTasa;

        return (
            <td className="p-0 border border-white/10">
                {isEditingField ? (
                    <input
                        className="w-full h-full bg-white/10 text-center text-white border-none focus:ring-1 focus:ring-pink-500 outline-none p-1 text-[10px]"
                        value={value ?? ''}
                        onChange={(e) => handleUpdate(type, idx, field, e.target.value)}
                    />
                ) : (
                    <div className={`text-center py-1.5 font-bold ${value != null ? 'text-white' : 'text-slate-600'}`}>
                        {value != null ? `${Number(value).toFixed(2)}%` : 'N/A'}
                    </div>
                )}
            </td>
        );
    };

    const VariationCell = ({ type, row, field }: any) => {
        const varVal = getVariation(type, row.entity, field, (row as any)[field]);
        if (varVal === null) return <td className="p-0 border border-white/10 bg-black/40 text-center text-slate-600">-</td>;
        const sign = varVal > 0 ? '+' : '';
        return (
            <td className={`p-0 border border-white/10 bg-black/40 text-center text-[9px] font-bold ${varVal > 0 ? 'text-emerald-400' : varVal < 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                {sign}{varVal.toFixed(2)}%
            </td>
        );
    };

    const RankCell = ({ type, field, value }: any) => (
        <td className="p-0 border border-white/10 bg-black/20 text-center text-slate-500 font-black">
            {getRank(type, field, value)}
        </td>
    );

    const renderRows = (type: 'banks' | 'cooperatives', label: string) => (
        <>
            <tr className="bg-slate-900 font-bold text-white uppercase text-[10px] tracking-widest">
                <td colSpan={15} className="px-4 py-2 border border-white/10 bg-slate-950/50">{label}</td>
            </tr>
            {(data as any)[type].map((row: any, idx: number) => (
                <tr key={idx} className={`hover:bg-white/5 transition-colors text-[11px] ${row.entity === 'PRESENTE' ? 'bg-indigo-900/20' : ''}`}>
                    <td className={`px-4 py-1.5 border border-white/10 font-bold ${row.entity === 'PRESENTE' ? 'text-pink-400' : 'text-slate-300'}`}>
                        {row.entity}
                    </td>
                    <DataCell type={type} idx={idx} field="vis_tasa" row={row} isTasa={true} />
                    <VariationCell type={type} row={row} field="vis_tasa" />
                    <RankCell type={type} field="vis_tasa" value={row.vis_tasa} />

                    <DataCell type={type} idx={idx} field="novis_tasa" row={row} isTasa={true} />
                    <VariationCell type={type} row={row} field="novis_tasa" />
                    <RankCell type={type} field="novis_tasa" value={row.novis_tasa} />

                    <DataCell type={type} idx={idx} field="vehiculo_tasa" row={row} isTasa={true} />
                    <VariationCell type={type} row={row} field="vehiculo_tasa" />
                    <RankCell type={type} field="vehiculo_tasa" value={row.vehiculo_tasa} />

                    <DataCell type={type} idx={idx} field="cc_desde" row={row} isTasa={true} />
                    <DataCell type={type} idx={idx} field="cc_hasta" row={row} isTasa={true} />
                    <VariationCell type={type} row={row} field="cc_desde" />
                    <RankCell type={type} field="cc_desde" value={row.cc_desde} />
                </tr>
            ))}
        </>
    );

    return (
        <div className="w-full h-full flex flex-col p-6 bg-slate-950/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-3xl font-black bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 bg-clip-text text-transparent uppercase italic tracking-tighter">
                        Benchmarking Vivienda y Consumo
                    </h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                        Tasas de cartelera al {selectedMonth === 'marzo' ? '16/04/2026' : selectedMonth === 'febrero' ? '16/03/2026' : selectedMonth === 'enero' ? '10/01/2026' : '10/12/2025'}
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex bg-slate-800 rounded-xl border border-white/10 overflow-hidden p-1 shadow-inner">
                        {(['diciembre', 'enero', 'febrero', 'marzo'] as const).map(m => (
                            <button
                                key={m}
                                onClick={() => setSelectedMonth(m)}
                                className={`px-4 py-1.5 text-xs font-black transition-all duration-300 rounded-lg uppercase ${selectedMonth === m ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20' : 'text-slate-400 hover:text-white'}`}
                            >
                                {m.substring(0, 3)}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-6 py-2 rounded-xl text-xs font-black transition-all duration-300 uppercase ${isEditing ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10'}`}
                    >
                        {isEditing ? '✓ Finalizar' : '✎ Editar'}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto rounded-2xl border border-white/10 bg-black/40 custom-scrollbar shadow-inner">
                <table className="w-full border-collapse">
                    <TableHeader />
                    <tbody>
                        {renderRows('banks', 'Entidades Bancarias')}
                        {renderRows('cooperatives', 'Cooperativas Financieras')}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-pink-500 rounded-full" />
                        <span>PRESENTE</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full" />
                        <span>Comparativos Sectoriales</span>
                    </div>
                </div>
                <span className="opacity-50">Confidencial / Comité de Crédito 2026</span>
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
                    background: rgba(233, 30, 99, 0.4);
                }
            `}</style>
        </div>
    );
}


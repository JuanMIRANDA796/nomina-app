'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentation } from '@/context/PresentationContext';

const MONTH_ORDER = ['diciembre', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre'];
const MONTH_LABELS: { [key: string]: string } = {
    diciembre: 'Dic',
    enero: 'Ene',
    febrero: 'Feb',
    marzo: 'Mar',
    abril: 'Abr',
    mayo: 'May',
    junio: 'Jun',
    julio: 'Jul',
    agosto: 'Ago',
    septiembre: 'Sep',
    octubre: 'Oct',
    noviembre: 'Nov',
};
const MONTH_FULL_LABELS: { [key: string]: string } = {
    diciembre: 'Diciembre',
    enero: 'Enero',
    febrero: 'Febrero',
    marzo: 'Marzo',
    abril: 'Abril',
    mayo: 'Mayo',
    junio: 'Junio',
    julio: 'Julio',
    agosto: 'Agosto',
    septiembre: 'Septiembre',
    octubre: 'Octubre',
    noviembre: 'Noviembre',
};
const MONTH_TO_SUFFIX: { [key: string]: string } = {
    diciembre: '',
    enero: 'Enero',
    febrero: 'Febrero',
    marzo: 'Marzo',
    abril: 'Abril',
    mayo: 'Mayo',
    junio: 'Junio',
    julio: 'Julio',
    agosto: 'Agosto',
    septiembre: 'Septiembre',
    octubre: 'Octubre',
    noviembre: 'Noviembre',
};
const SUFFIX_TO_MONTH: { [key: string]: string } = {
    '': 'diciembre',
    'Enero': 'enero',
    'Febrero': 'febrero',
    'Marzo': 'marzo',
    'Abril': 'abril',
    'Mayo': 'mayo',
    'Junio': 'junio',
    'Julio': 'julio',
    'Agosto': 'agosto',
    'Septiembre': 'septiembre',
    'Octubre': 'octubre',
    'Noviembre': 'noviembre',
};
const MONTH_DATES: { [key: string]: string } = {
    diciembre: '10/12/2025',
    enero: '10/01/2026',
    febrero: '19/03/2026',
    marzo: '16/04/2026',
    abril: '15/05/2026',
    mayo: '15/06/2026',
};

export default function BenchmarkingCDATsTable() {
    const { data: globalData, updateSection, setGlobalEditing } = usePresentation();
    const [selectedMonth, setSelectedMonth] = useState<string>('mayo');
    const [isEditing, setIsEditing] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(false);

    // Sync editing state with global provider to prevent polling overwrites
    React.useEffect(() => {
        setGlobalEditing(isEditing);
    }, [isEditing, setGlobalEditing]);

    const prefix = 'benchmarkingCDATs';
    const existingSuffixes = Object.keys(globalData)
        .filter(k => k.startsWith(prefix))
        .map(k => k.substring(prefix.length));

    const existingMonths = existingSuffixes
        .map(suffix => SUFFIX_TO_MONTH[suffix] || suffix.toLowerCase())
        .filter(m => MONTH_ORDER.includes(m))
        .sort((a, b) => MONTH_ORDER.indexOf(a) - MONTH_ORDER.indexOf(b));

    const remainingMonths = MONTH_ORDER.filter(m => !existingMonths.includes(m));

    const suffix = MONTH_TO_SUFFIX[selectedMonth] !== undefined ? MONTH_TO_SUFFIX[selectedMonth] : (selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1));
    const sectionKey = `${prefix}${suffix}`;
    const data = globalData[sectionKey] || { groups: [] };

    const handleUpdate = (groupIdx: number, entIdx: number, field: string, value: string) => {
        const newData = JSON.parse(JSON.stringify(data));
        const val = value === '' || value === 'N/A' || value === '-' ? null : parseFloat(value);
        
        const currentEntity = newData.groups[groupIdx].entities[entIdx];
        currentEntity[field] = val;

        // If the entity is "PRESENTE", sync with all other "PRESENTE" rows in all groups
        if (currentEntity.entity === 'PRESENTE') {
            newData.groups.forEach((group: any) => {
                group.entities.forEach((entity: any) => {
                    if (entity.entity === 'PRESENTE') {
                        entity[field] = val;
                    }
                });
            });
        }

        updateSection(sectionKey, newData);
    };

    const handleAddMonth = (monthKey: string) => {
        const latestMonth = existingMonths[existingMonths.length - 1] || 'mayo';
        const latestSuffix = MONTH_TO_SUFFIX[latestMonth] !== undefined ? MONTH_TO_SUFFIX[latestMonth] : (latestMonth.charAt(0).toUpperCase() + latestMonth.slice(1));
        const latestKey = `${prefix}${latestSuffix}`;
        const latestData = globalData[latestKey];
        
        const newData = JSON.parse(JSON.stringify(latestData));
        newData.groups.forEach((group: any) => {
            group.entities.forEach((entity: any) => {
                entity.d90 = null;
                entity.d180 = null;
                entity.d360 = null;
                entity.d540 = null;
                entity.d721 = null;
                entity.d1081 = null;
                entity.p90 = null;
                entity.p180 = null;
                entity.p360 = null;
                entity.p540 = null;
                entity.p721 = null;
                entity.p1081 = null;
            });
        });

        const newSuffix = MONTH_TO_SUFFIX[monthKey] !== undefined ? MONTH_TO_SUFFIX[monthKey] : (monthKey.charAt(0).toUpperCase() + monthKey.slice(1));
        const newKey = `${prefix}${newSuffix}`;

        updateSection(newKey, newData);
        setSelectedMonth(monthKey);
        setShowAddMenu(false);
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
        if (currentVal === null) return null;
        
        const currentIndex = existingMonths.indexOf(selectedMonth);
        if (currentIndex <= 0) return null; // first month has no variation
        
        const prevMonth = existingMonths[currentIndex - 1];
        const prevSuffix = MONTH_TO_SUFFIX[prevMonth] !== undefined ? MONTH_TO_SUFFIX[prevMonth] : (prevMonth.charAt(0).toUpperCase() + prevMonth.slice(1));
        const prevKey = `${prefix}${prevSuffix}`;
        const prevData = globalData[prevKey];
        
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
    const getPosition = (groupName: string, key: string, value: number | null) => {
        if (value === null || value === undefined) return '-';

        // Collect all rates for this specific column (key) from ONLY this group
        const allRates: number[] = [];
        const group = data.groups.find((g: any) => g.name === groupName);
        if (group) {
            group.entities.forEach((entity: any) => {
                const rate = entity[key];
                if (rate !== null && rate !== undefined && typeof rate === 'number') {
                    allRates.push(rate);
                }
            });
        }

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
                        Benchmarking CDATs <span className="text-pink-400 opacity-80">{MONTH_FULL_LABELS[selectedMonth] || selectedMonth}</span>
                    </h3>
                    <p className="text-slate-400 text-sm font-medium">Tasas de cartelera {MONTH_DATES[selectedMonth] ? `al ${MONTH_DATES[selectedMonth]}` : `a ${MONTH_FULL_LABELS[selectedMonth] || selectedMonth}`}</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex bg-slate-800 rounded-xl border border-white/10 overflow-hidden p-1 shadow-inner flex-wrap gap-0.5">
                        {existingMonths.map(m => (
                            <button
                                key={m}
                                onClick={() => setSelectedMonth(m)}
                                className={`px-4 py-1.5 text-xs font-bold transition-all duration-300 rounded-lg ${selectedMonth === m ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20' : 'text-slate-400 hover:text-white'}`}
                            >
                                {MONTH_LABELS[m] || m}
                            </button>
                        ))}
                    </div>

                    {isEditing && (
                        <div className="relative">
                            <button
                                onClick={() => setShowAddMenu(!showAddMenu)}
                                className="px-3 py-1.5 bg-pink-600/20 hover:bg-pink-600/40 text-pink-400 rounded-lg text-xs font-bold transition-all border border-pink-500/20 flex items-center gap-1 shadow-lg"
                            >
                                + Agregar Mes
                            </button>
                            {showAddMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 p-2 text-left">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1 mb-1">Seleccionar Mes</p>
                                    {remainingMonths.map((m: any) => (
                                        <button
                                            key={m}
                                            onClick={() => handleAddMonth(m)}
                                            className="w-full text-left px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white rounded-lg transition-all capitalize"
                                        >
                                            {MONTH_FULL_LABELS[m] || m}
                                        </button>
                                    ))}
                                    {remainingMonths.length === 0 && (
                                        <p className="text-xs text-slate-500 px-2 py-1">Todos los meses agregados</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
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
                                                        {getPosition(group.name, col.key, (row as any)[col.key])}
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

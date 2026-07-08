'use client';

import React, { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentation } from '@/context/PresentationContext';
import RateBox from './RateBox';
import EditableChartTitle from './EditableChartTitle';
import EditableStatsSidebar from './EditableStatsSidebar';

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

export default function BenchmarkingViviendaVisHasta20Chart() {
    const { data: globalData, updateSection } = usePresentation();
    const [selectedMonth, setSelectedMonth] = useState<string>('mayo');
    const [isEditing, setIsEditing] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(false);

    const prefix = 'benchmarkingViviendaVisHasta20';
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
    const data = globalData[sectionKey] || [];

    const handleUpdate = (index: number, field: string, value: string) => {
        const newData = [...data];
        newData[index] = { ...newData[index], [field]: value === '' ? null : parseFloat(value) };
        updateSection(sectionKey, newData);
    };

    const handleAddMonth = (monthKey: string) => {
        const latestMonth = existingMonths[existingMonths.length - 1] || 'mayo';
        const latestSuffix = MONTH_TO_SUFFIX[latestMonth] !== undefined ? MONTH_TO_SUFFIX[latestMonth] : (latestMonth.charAt(0).toUpperCase() + latestMonth.slice(1));
        const latestKey = `${prefix}${latestSuffix}`;
        const latestData = globalData[latestKey];
        
        const newData = JSON.parse(JSON.stringify(latestData)).map((item: any) => ({
            ...item,
            disbursements_num: null,
            amount: null,
            tpp: null
        }));

        const newSuffix = MONTH_TO_SUFFIX[monthKey] !== undefined ? MONTH_TO_SUFFIX[monthKey] : (monthKey.charAt(0).toUpperCase() + monthKey.slice(1));
        const newKey = `${prefix}${newSuffix}`;

        updateSection(newKey, newData);
        setSelectedMonth(monthKey);
        setShowAddMenu(false);
    };

    const totals = data[0];
    const presente = data.find((d: any) => d.entity === 'PRESENTE');
    const presenteTpp = presente?.tpp ?? null;
    const presenteMonto = presente?.amount ?? 0;
    const diff = (totals?.tpp != null && presenteTpp != null) ? (totals.tpp - presenteTpp) : null;

    return (
        <div className="w-full h-[580px] p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl flex flex-col relative">

            <div className="flex justify-between items-start mb-4">
                <EditableChartTitle
                    mainTitle="Benchmarking - Compra de vivienda VIS pesos"
                    subtitle="Hasta 20 años"
                    monthLabel={MONTH_FULL_LABELS[selectedMonth] || selectedMonth}
                    subtitleColor="text-emerald-500 font-semibold text-lg"
                />
                <div className="flex gap-3 items-center flex-wrap">
                    <div className="flex bg-slate-800 rounded-lg border border-white/10 overflow-hidden flex-wrap">
                        {existingMonths.map(m => (
                            <button
                                key={m}
                                onClick={() => setSelectedMonth(m)}
                                className={`px-3 py-1.5 text-xs font-bold transition-all ${selectedMonth === m ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                {MONTH_LABELS[m] || m}
                            </button>
                        ))}
                    </div>

                    {isEditing && (
                        <div className="relative">
                            <button
                                onClick={() => setShowAddMenu(!showAddMenu)}
                                className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 rounded-lg text-xs font-bold transition-all border border-emerald-500/20 flex items-center gap-1 shadow-lg"
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
                    <RateBox 
                        presenteTpp={presenteTpp} 
                        totalsTpp={totals?.tpp ?? null} 
                        extraInfo={presenteMonto ? `$ ${presenteMonto.toLocaleString()}` : undefined}
                        onUpdate={(newValue) => {
                            const idx = data.findIndex((d: any) => d.entity === 'PRESENTE');
                            if (idx !== -1) handleUpdate(idx, 'tpp', newValue.toString());
                        }}
                    />
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors text-sm font-medium shadow-lg">Editar Datos</button>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0 flex gap-6">
                <EditableStatsSidebar totals={totals} onUpdate={(field, value) => handleUpdate(0, field, value)} />

                <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="entity"
                                stroke="#9CA3AF"
                                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis hide={true} />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-slate-900/95 backdrop-blur-sm p-4 border border-white/10 rounded-xl shadow-2xl">
                                                <p className="text-white font-bold mb-2 border-b border-white/10 pb-1">{label}</p>
                                                {[...payload]
                                                    .sort((a, b) => (Number(b.value) - Number(a.value)))
                                                    .map((item: any, idx: number) => {
                                                        const isAmount = item.dataKey === 'amount';
                                                        return (
                                                            <div key={idx} className="flex justify-between items-center gap-4 text-sm mt-1">
                                                                <span style={{ color: item.color }}>{item.name} :</span>
                                                                <span className="text-white font-medium">
                                                                    {isAmount ? `$ ${Number(item.value).toLocaleString()}` : Number(item.value).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend verticalAlign="bottom" align="right" iconType="circle" />

                            <Bar dataKey="disbursements_num" name="# Desembolsos" fill="#0c4a6e" radius={[4, 4, 0, 0]}>
                                {data.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.entity === 'PRESENTE' ? '#10b981' : '#0c4a6e'} />
                                ))}
                            </Bar>
                            <Bar dataKey="amount" name="$ Desembolsos" fill="#ea580c" radius={[4, 4, 0, 0]}>
                                {data.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.entity === 'PRESENTE' ? '#34d399' : '#ea580c'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="flex justify-around mt-2 text-[10px] text-slate-500 font-medium">
                        {data.map((d: any, i: number) => (
                            <span key={i}>TPP {d.tpp ? `${d.tpp}%` : '-'}</span>
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-xl rounded-3xl p-8 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-semibold text-white">Editar Datos Vivienda VIS (Hasta 20)</h4>
                            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white/10 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-sm text-left text-slate-400">
                                <thead className="text-xs uppercase bg-slate-800 text-slate-200 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3">Entidad</th>
                                        <th className="px-4 py-3 text-sky-400"># Desembolsos</th>
                                        <th className="px-4 py-3 text-orange-400">$ Monto</th>
                                        <th className="px-4 py-3 text-emerald-400">TPP %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row: any, index: number) => (
                                        <tr key={index} className="border-b border-slate-800 hover:bg-white/5">
                                            <td className="px-4 py-2 font-medium text-slate-200">{row.entity}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={row.disbursements_num ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'disbursements_num', e.target.value)}
                                                    className="bg-transparent border border-slate-700 rounded px-2 py-1 w-24 outline-none text-white focus:border-emerald-500"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={row.amount ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'amount', e.target.value)}
                                                    className="bg-transparent border border-slate-700 rounded px-2 py-1 w-24 outline-none text-white focus:border-emerald-500"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={row.tpp ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'tpp', e.target.value)}
                                                    className="bg-transparent border border-slate-700 rounded px-2 py-1 w-24 outline-none text-white focus:border-emerald-500"
                                                    step="0.01"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium"
                            >
                                Guardar y Cerrar
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

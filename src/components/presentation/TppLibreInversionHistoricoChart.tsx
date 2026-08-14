'use client';

import React, { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    ResponsiveContainer,
    Dot
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentation } from '@/context/PresentationContext';

const MONTH_OPTIONS = [
    'ene-25', 'feb-25', 'mar-25', 'abr-25', 'may-25', 'jun-25',
    'jul-25', 'ago-25', 'sep-25', 'oct-25', 'nov-25', 'dic-25',
    'ene-26', 'feb-26', 'mar-26', 'abr-26', 'may-26', 'jun-26',
    'jul-26', 'ago-26', 'sep-26', 'oct-26', 'nov-26', 'dic-26',
    'ene-27', 'feb-27', 'mar-27', 'abr-27', 'may-27', 'jun-27',
    'jul-27', 'ago-27', 'sep-27', 'oct-27', 'nov-27', 'dic-27',
];

// Custom animated dot that highlights 2026 data
const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const is26 = payload?.periodo?.includes('-26');
    return (
        <circle
            cx={cx}
            cy={cy}
            r={is26 ? 6 : 4}
            fill={is26 ? '#f97316' : '#6366f1'}
            stroke={is26 ? '#fbbf24' : '#818cf8'}
            strokeWidth={2}
        />
    );
};

export default function TppLibreInversionHistoricoChart() {
    const { data: globalData, updateSection, setGlobalEditing } = usePresentation();
    const data: any[] = globalData.tppLibreInversionHistorico || [];
    const [isEditing, setIsEditing] = useState(false);

    React.useEffect(() => {
        setGlobalEditing(isEditing);
    }, [isEditing, setGlobalEditing]);

    const handleUpdate = (index: number, field: string, value: string) => {
        const newData = [...data];
        if (field === 'periodo') {
            newData[index] = { ...newData[index], [field]: value };
        } else {
            newData[index] = { ...newData[index], [field]: value === '' ? null : parseFloat(value) };
        }
        updateSection('tppLibreInversionHistorico', newData);
    };

    const handleAddRow = () => {
        const last = data[data.length - 1];
        // Find the next month in MONTH_OPTIONS after the last one
        const lastIdx = MONTH_OPTIONS.indexOf(last?.periodo ?? '');
        const nextPeriodo = lastIdx >= 0 && lastIdx < MONTH_OPTIONS.length - 1
            ? MONTH_OPTIONS[lastIdx + 1]
            : 'nuevo';
        const newRow = { periodo: nextPeriodo, valor: null };
        updateSection('tppLibreInversionHistorico', [...data, newRow]);
    };

    const handleDeleteRow = (idx: number) => {
        if (data.length <= 1) return;
        updateSection('tppLibreInversionHistorico', data.filter((_: any, i: number) => i !== idx));
    };

    // Compute min/max for YAxis domain with padding
    const values = data.map((d: any) => d.valor).filter((v: any) => v != null) as number[];
    const minVal = values.length > 0 ? Math.floor(Math.min(...values) - 0.5) : 8;
    const maxVal = values.length > 0 ? Math.ceil(Math.max(...values) + 0.5) : 13;

    // Find the boundary between 2025 and 2026 for reference line
    const refLineIdx = data.findIndex((d: any) => d.periodo?.includes('-26'));
    const refLinePeriodo = refLineIdx > 0 ? data[refLineIdx].periodo : null;

    // Last value for annotation
    const lastPoint = data[data.length - 1];

    return (
        <div className="w-full h-[600px] p-8 bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Background gradient accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-transparent to-orange-950/20 pointer-events-none rounded-3xl" />

            {/* Header */}
            <div className="relative flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-3xl font-black text-white tracking-tighter leading-tight">
                        Margen de intermediación.
                    </h3>
                    <p className="text-slate-400 text-sm mt-1 font-medium tracking-wide">
                        Evolución historica mensual
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Last value badge */}
                    {lastPoint?.valor != null && (
                        <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl px-4 py-2 text-right">
                            <p className="text-[10px] font-bold text-orange-300 uppercase tracking-widest">Último</p>
                            <p className="text-2xl font-black text-orange-400">{lastPoint.valor.toFixed(2)}%</p>
                            <p className="text-[10px] text-slate-500 font-medium">{lastPoint.periodo}</p>
                        </div>
                    )}
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all text-slate-300 hover:text-white"
                    >
                        ✎ Editar Datos
                    </button>
                </div>
            </div>

            {/* Chart */}
            <div className="relative h-[75%]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <defs>
                            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="60%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#f97316" />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="periodo"
                            stroke="#475569"
                            tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                            interval={0}
                            angle={-35}
                            textAnchor="end"
                            height={50}
                        />
                        <YAxis
                            stroke="#475569"
                            tick={{ fill: '#94A3B8', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            domain={[minVal, maxVal]}
                            tickFormatter={(v) => `${v}%`}
                            width={45}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    const val = payload[0]?.value;
                                    const is26 = String(label).includes('-26');
                                    return (
                                        <div className="bg-slate-900/95 backdrop-blur-sm p-3 border border-white/10 rounded-xl shadow-2xl">
                                            <p className={`font-bold text-sm mb-1 ${is26 ? 'text-orange-400' : 'text-indigo-400'}`}>
                                                {label}
                                            </p>
                                            <p className="text-white font-black text-lg">
                                                {typeof val === 'number' ? `${val.toFixed(2)}%` : '-'}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        {/* Year boundary reference line */}
                        {refLinePeriodo && (
                            <ReferenceLine
                                x={refLinePeriodo}
                                stroke="rgba(255,255,255,0.15)"
                                strokeDasharray="6 3"
                                label={{ value: '2026 →', position: 'top', fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                            />
                        )}
                        <Line
                            type="monotone"
                            dataKey="valor"
                            name="TPP Libre Inversión"
                            stroke="url(#lineGrad)"
                            strokeWidth={3}
                            dot={<CustomDot />}
                            activeDot={{ r: 8, fill: '#f97316', stroke: '#fbbf24', strokeWidth: 2 }}
                            connectNulls={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Editing Modal */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-slate-950/97 backdrop-blur-md p-6 rounded-3xl overflow-hidden flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-5">
                            <div>
                                <h4 className="text-xl font-black text-white">Editor · TPP Libre Inversión Histórico</h4>
                                <p className="text-xs text-slate-400 mt-0.5">Edita, agrega o elimina períodos. Los cambios se reflejan en tiempo real.</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 text-sm"
                            >
                                ✓ Guardar y Cerrar
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-slate-900 z-10">
                                    <tr>
                                        <th className="p-3 border-b border-white/10 text-slate-400 text-xs uppercase font-bold w-8 text-center">#</th>
                                        <th className="p-3 border-b border-white/10 text-slate-400 text-xs uppercase font-bold">Período</th>
                                        <th className="p-3 border-b border-white/10 text-indigo-400 text-xs uppercase font-bold">TPP (%) EA</th>
                                        <th className="p-3 border-b border-white/10 text-slate-400 text-xs uppercase font-bold text-center">Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row: any, idx: number) => {
                                        const is26 = row.periodo?.includes('-26');
                                        return (
                                            <tr key={idx} className={`hover:bg-white/5 transition-colors ${is26 ? 'bg-orange-950/10' : ''}`}>
                                                <td className="p-2 border-b border-white/5 text-center text-slate-600 text-xs font-mono">{idx + 1}</td>
                                                <td className="p-2 border-b border-white/5">
                                                    <input
                                                        type="text"
                                                        list="periodos-list"
                                                        className={`w-28 bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-bold text-sm focus:ring-1 outline-none ${is26 ? 'text-orange-400 focus:ring-orange-500' : 'text-indigo-400 focus:ring-indigo-500'}`}
                                                        value={row.periodo ?? ''}
                                                        onChange={(e) => handleUpdate(idx, 'periodo', e.target.value)}
                                                        placeholder="ene-25"
                                                    />
                                                    <datalist id="periodos-list">
                                                        {MONTH_OPTIONS.map(m => <option key={m} value={m} />)}
                                                    </datalist>
                                                </td>
                                                <td className="p-2 border-b border-white/5">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            className="w-28 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                                            value={row.valor === null || row.valor === undefined ? '' : row.valor}
                                                            onChange={(e) => handleUpdate(idx, 'valor', e.target.value)}
                                                            placeholder="0.00"
                                                        />
                                                        <span className="text-slate-500 text-sm font-bold">%</span>
                                                    </div>
                                                </td>
                                                <td className="p-2 border-b border-white/5 text-center">
                                                    <button
                                                        onClick={() => handleDeleteRow(idx)}
                                                        disabled={data.length <= 1}
                                                        className="w-7 h-7 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 font-black transition-all text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                                                        title="Eliminar período"
                                                    >
                                                        ×
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* Add row button */}
                            <button
                                onClick={handleAddRow}
                                className="mt-3 w-full py-3 border border-dashed border-white/20 hover:border-indigo-500/50 hover:bg-indigo-500/5 rounded-xl text-slate-400 hover:text-indigo-400 text-sm font-bold transition-all flex items-center justify-center gap-2"
                            >
                                <span className="text-lg leading-none">+</span>
                                Agregar período
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

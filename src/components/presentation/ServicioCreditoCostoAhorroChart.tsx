'use client';

import React, { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentation } from '@/context/PresentationContext';

const MONTH_OPTIONS = [
    'ene-24', 'feb-24', 'mar-24', 'abr-24', 'may-24', 'jun-24',
    'jul-24', 'ago-24', 'sep-24', 'oct-24', 'nov-24', 'dic-24',
    'ene-25', 'feb-25', 'mar-25', 'abr-25', 'may-25', 'jun-25',
    'jul-25', 'ago-25', 'sep-25', 'oct-25', 'nov-25', 'dic-25',
    'ene-26', 'feb-26', 'mar-26', 'abr-26', 'may-26', 'jun-26',
    'jul-26', 'ago-26', 'sep-26', 'oct-26', 'nov-26', 'dic-26',
];

const formatCOP = (value: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

export default function ServicioCreditoCostoAhorroChart() {
    const { data: globalData, updateSection, setGlobalEditing } = usePresentation();
    const data: any[] = globalData.servicioCreditoCostoAhorro || [];
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
        updateSection('servicioCreditoCostoAhorro', newData);
    };

    const handleAddRow = () => {
        const last = data[data.length - 1];
        const lastIdx = MONTH_OPTIONS.indexOf(last?.periodo ?? '');
        const nextPeriodo = lastIdx >= 0 && lastIdx < MONTH_OPTIONS.length - 1
            ? MONTH_OPTIONS[lastIdx + 1]
            : 'nuevo';
        const newRow = { periodo: nextPeriodo, servicio: null, costo: null };
        updateSection('servicioCreditoCostoAhorro', [...data, newRow]);
    };

    const handleDeleteRow = (idx: number) => {
        if (data.length <= 1) return;
        updateSection('servicioCreditoCostoAhorro', data.filter((_: any, i: number) => i !== idx));
    };

    const lastPoint = data[data.length - 1];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/95 backdrop-blur-sm p-4 border border-white/10 rounded-xl shadow-2xl">
                    <p className="text-white font-bold mb-2 border-b border-white/10 pb-1">{label}</p>
                    {payload.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center gap-6 text-sm mt-1">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-slate-300">{item.name}:</span>
                            </div>
                            <span className="text-white font-bold">{formatCOP(item.value)}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-[600px] p-8 bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-blue-950/20 pointer-events-none rounded-3xl" />

            {/* Header */}
            <div className="relative flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-3xl font-black text-white tracking-tighter leading-tight">
                        Evolución histórica del{' '}
                        <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                            Servicio del crédito y del Costo del ahorro
                        </span>
                    </h3>
                    <p className="text-slate-400 text-sm mt-1 font-medium tracking-wide">
                        Valores en pesos colombianos ($)
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Last value badges */}
                    {lastPoint && (
                        <div className="flex gap-3">
                            {lastPoint.servicio != null && (
                                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-4 py-2 text-right">
                                    <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">Servicio crédito</p>
                                    <p className="text-lg font-black text-emerald-400">{formatCOP(lastPoint.servicio)}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">{lastPoint.periodo}</p>
                                </div>
                            )}
                            {lastPoint.costo != null && (
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl px-4 py-2 text-right">
                                    <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Costo ahorro</p>
                                    <p className="text-lg font-black text-blue-400">{formatCOP(lastPoint.costo)}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">{lastPoint.periodo}</p>
                                </div>
                            )}
                        </div>
                    )}
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all text-slate-300"
                    >
                        ✎ Editar Datos
                    </button>
                </div>
            </div>

            {/* Chart */}
            <div className="relative h-[430px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="periodo"
                            stroke="#475569"
                            tick={{ fill: '#94A3B8', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#475569"
                            tick={{ fill: '#94A3B8', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="top"
                            align="center"
                            wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
                            formatter={(value) => <span style={{ color: '#CBD5E1' }}>{value}</span>}
                        />
                        <Line
                            type="monotone"
                            dataKey="servicio"
                            name="Servicio del crédito $4150*"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ r: 5, fill: '#10b981', stroke: '#34d399', strokeWidth: 2 }}
                            activeDot={{ r: 7, strokeWidth: 0 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="costo"
                            name="Costo del ahorro $"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ r: 5, fill: '#3b82f6', stroke: '#60a5fa', strokeWidth: 2 }}
                            activeDot={{ r: 7, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-6 rounded-3xl overflow-hidden flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xl font-bold text-white">Editar: Servicio del crédito y Costo del ahorro</h4>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20"
                            >
                                Guardar cambios
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto custom-scrollbar pr-2">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-slate-900 text-slate-400 text-xs uppercase">
                                    <tr>
                                        <th className="p-3 border-b border-white/10">Período</th>
                                        <th className="p-3 border-b border-white/10 text-center">Servicio del crédito ($)</th>
                                        <th className="p-3 border-b border-white/10 text-center">Costo del ahorro ($)</th>
                                        <th className="p-3 border-b border-white/10 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                                            <td className="p-2 border-b border-white/5">
                                                <input
                                                    type="text"
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-center font-bold text-emerald-400 focus:ring-1 focus:ring-emerald-500 outline-none"
                                                    value={row.periodo ?? ''}
                                                    onChange={(e) => handleUpdate(idx, 'periodo', e.target.value)}
                                                    placeholder="ene-25"
                                                />
                                            </td>
                                            {['servicio', 'costo'].map((field) => (
                                                <td key={field} className="p-2 border-b border-white/5">
                                                    <input
                                                        type="number"
                                                        step="1"
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-center text-white focus:ring-1 focus:ring-emerald-500 outline-none"
                                                        value={row[field] ?? ''}
                                                        onChange={(e) => handleUpdate(idx, field, e.target.value)}
                                                    />
                                                </td>
                                            ))}
                                            <td className="p-2 border-b border-white/5 text-center">
                                                <button
                                                    onClick={() => handleDeleteRow(idx)}
                                                    className="w-7 h-7 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 font-bold transition-all text-sm"
                                                    title="Eliminar fila"
                                                >×</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button
                                onClick={handleAddRow}
                                className="mt-3 w-full py-2 border border-dashed border-white/20 hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-xl text-slate-400 hover:text-emerald-400 text-sm font-medium transition-all"
                            >
                                + Agregar mes
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

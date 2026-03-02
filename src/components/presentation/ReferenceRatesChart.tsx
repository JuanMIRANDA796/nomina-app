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
    ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

import referenceRatesData from '@/data/reference_rates.json';

const initialData = referenceRatesData;

import { usePresentation } from '@/context/PresentationContext';

export default function ReferenceRatesChart() {
    const { data: globalData, updateSection } = usePresentation();
    const data = globalData.referenceRates;
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = (index: number, field: string, value: string) => {
        const newData = [...data];
        newData[index] = {
            ...newData[index],
            [field]: parseFloat(value) || 0
        };
        updateSection('referenceRates', newData);
    };

    const handleAddRow = () => {
        const last = data[data.length - 1];
        const newRow = { month: '', ibr: last?.ibr ?? 0, repo: last?.repo ?? 0, dtf: last?.dtf ?? 0, ipc: last?.ipc ?? 0 };
        updateSection('referenceRates', [...data, newRow]);
    };

    const handleDeleteRow = (idx: number) => {
        if (data.length <= 1) return;
        const newData = data.filter((_: any, i: number) => i !== idx);
        updateSection('referenceRates', newData);
    };

    return (
        <div className="w-full h-[600px] p-6 bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-black text-white tracking-tighter">
                    Evolución Tasas de <span className="bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">Referencia</span>
                </h3>
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all text-slate-300"
                >
                    ✎ Editar Datos
                </button>
            </div>

            <ResponsiveContainer width="100%" height="85%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                        dataKey="month"
                        stroke="#475569"
                        tick={{ fill: '#94A3B8', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#475569"
                        tick={{ fill: '#94A3B8', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 11]}
                        ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
                    />
                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-slate-900/95 backdrop-blur-sm p-4 border border-white/10 rounded-xl shadow-2xl">
                                        <p className="text-white font-bold mb-2 border-b border-white/10 pb-1">{label}</p>
                                        {[...payload]
                                            .sort((a, b) => (Number(b.value) - Number(a.value)))
                                            .map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center gap-4 text-sm mt-1">
                                                    <span style={{ color: item.color }}>{item.name} :</span>
                                                    <span className="text-white font-medium">{Number(item.value).toFixed(2)}%</span>
                                                </div>
                                            ))}
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Legend iconType="circle" />

                    <Line type="monotone" dataKey="dtf" name="DTF" stroke="#94A3B8" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="ibr" name="IBR plazo un mes" stroke="#4ADE80" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="ipc" name="IPC" stroke="#FB923C" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="repo" name="REPO" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>

            {/* Editing Modal */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-6 rounded-3xl overflow-hidden flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-bold text-white">Editor de Tasas de Referencia</h4>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-pink-600/20"
                            >
                                Finalizar y Guardar
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto custom-scrollbar pr-2">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-slate-900 text-slate-400 text-xs uppercase">
                                    <tr>
                                        <th className="p-3 border-b border-white/10">Mes</th>
                                        <th className="p-3 border-b border-white/10 text-center">IBR</th>
                                        <th className="p-3 border-b border-white/10 text-center">REPO</th>
                                        <th className="p-3 border-b border-white/10 text-center">IPC</th>
                                        <th className="p-3 border-b border-white/10 text-center">DTF</th>
                                        <th className="p-3 border-b border-white/10 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                                            <td className="p-2 border-b border-white/5">
                                                <input
                                                    type="text"
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-center font-bold text-pink-400 focus:ring-1 focus:ring-pink-500 outline-none"
                                                    value={row.month ?? ''}
                                                    onChange={(e) => handleUpdate(idx, 'month', e.target.value)}
                                                    placeholder="Ej: Feb-26"
                                                />
                                            </td>
                                            {['ibr', 'repo', 'ipc', 'dtf'].map(field => (
                                                <td key={field} className="p-2 border-b border-white/5">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-center text-white focus:ring-1 focus:ring-pink-500 outline-none"
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
                                className="mt-3 w-full py-2 border border-dashed border-white/20 hover:border-pink-500/50 hover:bg-pink-500/5 rounded-xl text-slate-400 hover:text-pink-400 text-sm font-medium transition-all"
                            >
                                + Agregar fila
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

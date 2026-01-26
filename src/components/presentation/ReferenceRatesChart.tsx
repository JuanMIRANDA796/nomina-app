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

const initialData = [
    { month: 'Nov-24', ibr: 9.59, repo: 9.75, dtf: 9.27, ipc: 5.20 },
    { month: 'Dic-24', ibr: 9.51, repo: 9.50, dtf: 9.22, ipc: 5.20 },
    { month: 'Ene-25', ibr: 9.36, repo: 9.50, dtf: 9.22, ipc: 5.22 },
    { month: 'Feb-25', ibr: 9.46, repo: 9.50, dtf: 9.41, ipc: 5.28 },
    { month: 'Mar-25', ibr: 9.42, repo: 9.50, dtf: 9.15, ipc: 5.09 },
    { month: 'Abr-25', ibr: 9.26, repo: 9.25, dtf: 9.12, ipc: 5.16 },
    { month: 'May-25', ibr: 9.23, repo: 9.25, dtf: 8.92, ipc: 5.05 },
    { month: 'Jun-25', ibr: 9.25, repo: 9.25, dtf: 8.96, ipc: 4.82 },
    { month: 'Jul-25', ibr: 9.25, repo: 9.25, dtf: 8.92, ipc: 4.90 },
    { month: 'Ago-25', ibr: 9.25, repo: 9.25, dtf: 8.82, ipc: 5.10 },
    { month: 'Sep-25', ibr: 9.26, repo: 9.25, dtf: 8.76, ipc: 5.18 },
    { month: 'Oct-25', ibr: 9.25, repo: 9.25, dtf: 8.65, ipc: 5.51 },
    { month: 'Nov-25', ibr: 9.17, repo: 9.25, dtf: 8.65, ipc: 5.30 },
    { month: 'Dic-25', ibr: 9.41, repo: 9.25, dtf: 9.00, ipc: 5.10 },
];

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
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                                            <td className="p-3 border-b border-white/5 font-bold text-pink-500">{row.month}</td>
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

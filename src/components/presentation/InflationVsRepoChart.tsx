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
import initialData from '@/data/inflation_repo_data.json';
import { motion, AnimatePresence } from 'framer-motion';

import { usePresentation } from '@/context/PresentationContext';

export default function InflationVsRepoChart() {
    const { data: globalData, updateSection } = usePresentation();
    const data = globalData.inflationRepo;
    const [isEditing, setIsEditing] = useState(false);

    // Formatting helper
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const handleUpdate = (index: number, field: 'inflation' | 'repo', value: string) => {
        const newData = [...data];
        newData[index] = {
            ...newData[index],
            [field]: parseFloat(value) || 0
        };
        updateSection('inflationRepo', newData);
    };

    return (
        <div className="w-full h-[580px] p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl flex flex-col relative">

            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D81B60] to-[#FF9800]">
                    Inflación y Tasa de intervención
                </h3>
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors text-sm font-medium"
                >
                    Editar Datos
                </button>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={formatDate}
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF' }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF' }}
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 16]}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-slate-900/95 backdrop-blur-sm p-4 border border-white/10 rounded-xl shadow-2xl">
                                            <p className="text-white font-bold mb-2 border-b border-white/10 pb-1">{formatDate(String(label))}</p>
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
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />

                        <Line
                            type="monotone"
                            dataKey="inflation"
                            name="Inflación anual"
                            stroke="#0F4C81"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="repo"
                            name="Tasa Repo"
                            stroke="#F97316"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />

                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* EDIT DATA MODAL */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-xl rounded-3xl p-8 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-semibold text-white">Editar Datos del Gráfico</h4>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-sm text-left text-slate-400">
                                <thead className="text-xs uppercase bg-slate-800 text-slate-200 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3">Fecha</th>
                                        <th className="px-6 py-3">Inflación (%)</th>
                                        <th className="px-6 py-3">Tasa Repo (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row: any, index: number) => (
                                        <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/50">
                                            <td className="px-6 py-4">{row.date}</td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    value={row.inflation ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'inflation', e.target.value)}
                                                    className="bg-transparent border border-slate-700 rounded px-2 py-1 w-24 focus:border-pink-500 outline-none text-white"
                                                    step="0.01"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    value={row.repo ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'repo', e.target.value)}
                                                    className="bg-transparent border border-slate-700 rounded px-2 py-1 w-24 focus:border-pink-500 outline-none text-white"
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
                                className="px-6 py-2 bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-500 hover:to-orange-500 text-white rounded-lg font-medium shadow-lg shadow-pink-900/20 transition-all"
                            >
                                Finalizar y Guardar
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

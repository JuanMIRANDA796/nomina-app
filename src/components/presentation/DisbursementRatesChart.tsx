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
import { usePresentation } from '@/context/PresentationContext';

export default function DisbursementRatesChart() {
    const { data: globalData, updateSection } = usePresentation();
    const data = globalData.disbursementRates;
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = (index: number, field: string, value: string) => {
        const newData = [...data];
        newData[index] = {
            ...newData[index],
            [field]: parseFloat(value) || 0
        };
        updateSection('disbursementRates', newData);
    };

    return (
        <div className="w-full h-[580px] p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl flex flex-col relative">

            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D81B60] to-[#FF9800]">
                    Tasa de Desembolso
                </h3>
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors text-sm font-medium shadow-lg"
                >
                    Editar Datos
                </button>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="month"
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF' }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis hide={true} domain={['auto', 'auto']} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: any) => [`${value}%`]}
                        />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />

                        <Line
                            type="monotone"
                            dataKey="tarjeta"
                            name="TARJETA"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#0ea5e9' }}
                            activeDot={{ r: 6 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="consumo"
                            name="CONSUMO"
                            stroke="#f97316"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#f97316' }}
                            activeDot={{ r: 6 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="vivienda"
                            name="VIVIENDA"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#10b981' }}
                            activeDot={{ r: 6 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="tpp"
                            name="TPP"
                            stroke="#fbbf24"
                            strokeWidth={3}
                            strokeDasharray="5 5"
                            dot={{ r: 4, fill: '#fbbf24' }}
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
                            <h4 className="text-xl font-semibold text-white">Editar Tasas de Desembolso</h4>
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
                                        <th className="px-6 py-3">Mes</th>
                                        <th className="px-6 py-3 text-sky-400">Tarjeta (%)</th>
                                        <th className="px-6 py-3 text-orange-400">Consumo (%)</th>
                                        <th className="px-6 py-3 text-emerald-400">Vivienda (%)</th>
                                        <th className="px-6 py-3 text-yellow-400">TPP (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row: any, index: number) => (
                                        <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/50">
                                            <td className="px-6 py-4">{row.month}</td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    value={row.tarjeta ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'tarjeta', e.target.value)}
                                                    className="bg-transparent border border-slate-700 rounded px-2 py-1 w-24 focus:border-pink-500 outline-none text-white"
                                                    step="0.01"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    value={row.consumo ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'consumo', e.target.value)}
                                                    className="bg-transparent border border-slate-700 rounded px-2 py-1 w-24 focus:border-pink-500 outline-none text-white"
                                                    step="0.01"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    value={row.vivienda ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'vivienda', e.target.value)}
                                                    className="bg-transparent border border-slate-700 rounded px-2 py-1 w-24 focus:border-pink-500 outline-none text-white"
                                                    step="0.01"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    value={row.tpp ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'tpp', e.target.value)}
                                                    className="bg-transparent border border-slate-700 rounded px-2 py-1 w-24 focus:border-pink-500 outline-none text-white font-bold text-yellow-500"
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
                                className="px-6 py-2 bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-500 hover:to-orange-500 text-white rounded-lg font-medium shadow-lg"
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

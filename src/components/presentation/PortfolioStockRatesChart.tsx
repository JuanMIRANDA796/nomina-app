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
    LabelList
} from 'recharts';
import initialData from '@/data/portfolio_stock_rates.json';
import { motion, AnimatePresence } from 'framer-motion';

import { usePresentation } from '@/context/PresentationContext';

export default function PortfolioStockRatesChart() {
    const { data: globalData, updateSection } = usePresentation();
    const data = globalData.portfolioStockRates;
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = (index: number, field: string, value: string) => {
        const newData = [...data];
        newData[index] = {
            ...newData[index],
            [field]: parseFloat(value) || 0
        };
        updateSection('portfolioStockRates', newData);
    };

    return (
        <div className="w-full h-[580px] p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl flex flex-col relative">

            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D81B60] to-[#FF9800]">
                    Tasas de Stock Cartera
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
                    <LineChart data={data} margin={{ top: 30, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="month"
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF' }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF' }}
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 30]}
                            hide={true}
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
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />

                        <Line
                            type="monotone"
                            dataKey="rotativos"
                            name="TP - Rotativos"
                            stroke="#F97316"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#F97316' }}
                        >
                            <LabelList dataKey="rotativos" position="top" offset={10} fill="#9CA3AF" fontSize={12} formatter={(val: any) => `${val}%`} />
                        </Line>

                        <Line
                            type="monotone"
                            dataKey="consumo"
                            name="CO - Consumo"
                            stroke="#0F4C81"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#0F4C81' }}
                        >
                            <LabelList dataKey="consumo" position="top" offset={10} fill="#9CA3AF" fontSize={12} formatter={(val: any) => `${val}%`} />
                        </Line>

                        <Line
                            type="monotone"
                            dataKey="total"
                            name="Total general"
                            stroke="#38BDF8"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#38BDF8' }}
                        >
                            <LabelList dataKey="total" position="bottom" offset={10} fill="#9CA3AF" fontSize={12} formatter={(val: any) => `${val}%`} />
                        </Line>

                        <Line
                            type="monotone"
                            dataKey="vivienda"
                            name="VI - Vivienda"
                            stroke="#10B981"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#10B981' }}
                        >
                            <LabelList dataKey="vivienda" position="bottom" offset={10} fill="#9CA3AF" fontSize={12} formatter={(val: any) => `${val}%`} />
                        </Line>

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
                            <h4 className="text-xl font-semibold text-white">Editar Tasas de Stock</h4>
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
                                        <th className="px-4 py-3">Mes</th>
                                        <th className="px-4 py-3 text-orange-400">Rotativos (%)</th>
                                        <th className="px-4 py-3 text-blue-400">Consumo (%)</th>
                                        <th className="px-4 py-3 text-emerald-400">Vivienda (%)</th>
                                        <th className="px-4 py-3 text-sky-400">Total (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row: any, index: number) => (
                                        <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/50">
                                            <td className="px-4 py-2">{row.month}</td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={row.rotativos ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'rotativos', e.target.value)}
                                                    className="bg-transparent border border-slate-700 rounded px-2 py-1 w-20 focus:border-pink-500 outline-none text-white"
                                                    step="0.01"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={row.consumo ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'consumo', e.target.value)}
                                                    className="bg-transparent border border-slate-700 rounded px-2 py-1 w-20 focus:border-pink-500 outline-none text-white"
                                                    step="0.01"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={row.vivienda ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'vivienda', e.target.value)}
                                                    className="bg-transparent border border-slate-700 rounded px-2 py-1 w-20 focus:border-pink-500 outline-none text-white"
                                                    step="0.01"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={row.total ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'total', e.target.value)}
                                                    className="bg-transparent border border-slate-700 rounded px-2 py-1 w-20 focus:border-pink-500 outline-none text-white"
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
                                className="px-6 py-2 bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-500 hover:to-orange-500 text-white rounded-lg font-medium shadow-lg transition-all"
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

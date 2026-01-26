'use client';

import React, { useState } from 'react';
import {
    AreaChart,
    Area,
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

export default function PortfolioBalanceByLineChart() {
    const { data: globalData, updateSection } = usePresentation();
    const data = globalData.portfolioBalanceByLine;
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = (index: number, field: string, value: string) => {
        const newData = [...data];
        newData[index] = {
            ...newData[index],
            [field]: value === '' ? 0 : parseFloat(value)
        };
        updateSection('portfolioBalanceByLine', newData);
    };

    return (
        <div className="w-full h-[580px] p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl flex flex-col relative">

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D81B60] to-[#E91E63]">
                    Saldo de Cartera por Línea
                </h3>
                <h2 className="text-3xl font-bold text-white">
                    $ {data[data.length - 1]?.total?.toLocaleString() ?? 0} M
                </h2>
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors text-sm font-medium shadow-lg"
                >
                    Editar Datos
                </button>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorConsumo" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorRotativos" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorVivienda" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="month"
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                        />
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
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
                                                        <span style={{ color: item.color || item.payload.fill }}>{item.name} :</span>
                                                        <span className="text-white font-medium">${Number(item.value).toLocaleString()} M</span>
                                                    </div>
                                                ))}
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend iconType="circle" />

                        <Area
                            type="monotone"
                            dataKey="vivienda"
                            stackId="1"
                            stroke="#10b981"
                            fill="url(#colorVivienda)"
                            name="Vivienda"
                        />
                        <Area
                            type="monotone"
                            dataKey="rotativos"
                            stackId="1"
                            stroke="#f97316"
                            fill="url(#colorRotativos)"
                            name="Rotativos"
                        />
                        <Area
                            type="monotone"
                            dataKey="consumo"
                            stackId="1"
                            stroke="#0ea5e9"
                            fill="url(#colorConsumo)"
                            name="Consumo"
                        />
                        <Line
                            type="monotone"
                            dataKey="total"
                            name="Total general"
                            stroke="#ffffff"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ r: 4, fill: '#ffffff' }}
                        />
                    </AreaChart>
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
                            <h4 className="text-xl font-semibold text-white">Editar Saldo por Línea</h4>
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
                                        <th className="px-4 py-3">Mes</th>
                                        <th className="px-4 py-3 text-emerald-400">Vivienda</th>
                                        <th className="px-4 py-3 text-orange-400">Rotativos</th>
                                        <th className="px-4 py-3 text-sky-400">Consumo</th>
                                        <th className="px-4 py-3 text-white">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row: any, index: number) => (
                                        <tr key={index} className="border-b border-slate-800 hover:bg-white/5">
                                            <td className="px-4 py-2 font-medium text-white">{row.month}</td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={row.vivienda ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'vivienda', e.target.value)}
                                                    className="bg-transparent border border-slate-700 rounded px-2 py-1 w-24 outline-none text-white focus:border-emerald-500"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={row.rotativos ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'rotativos', e.target.value)}
                                                    className="bg-transparent border border-slate-700 rounded px-2 py-1 w-24 outline-none text-white focus:border-orange-500"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={row.consumo ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'consumo', e.target.value)}
                                                    className="bg-transparent border border-slate-700 rounded px-2 py-1 w-24 outline-none text-white focus:border-sky-500"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={row.total ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'total', e.target.value)}
                                                    className="bg-transparent border border-slate-700 rounded px-2 py-1 w-24 outline-none text-white focus:border-white"
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
                                className="px-6 py-2 bg-gradient-to-r from-pink-600 to-orange-600 text-white rounded-lg font-medium shadow-lg"
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

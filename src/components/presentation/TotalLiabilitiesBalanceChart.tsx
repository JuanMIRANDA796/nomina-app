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
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentation } from '@/context/PresentationContext';

export default function TotalLiabilitiesBalanceChart() {
    const { data: globalData, updateSection } = usePresentation();
    const data = globalData.totalLiabilitiesBalance;
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = (index: number, field: string, value: string) => {
        const newData = [...data];
        newData[index] = {
            ...newData[index],
            [field]: value === '' ? 0 : parseFloat(value)
        };
        updateSection('totalLiabilitiesBalance', newData);
    };

    return (
        <div className="w-full h-[600px] p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl flex flex-col relative">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-3xl font-bold text-white mb-1">
                        Saldos total pasivos
                    </h3>
                    <p className="text-slate-400 font-medium italic">Millones de Pesos</p>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all shadow-lg font-bold"
                >
                    Editar Datos
                </button>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="month"
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            domain={['dataMin - 10000', 'dataMax + 10000']}
                            hide={true}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: any, name: any) => [`$${value.toLocaleString()}`, name]}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />

                        {/* Saldo total pasivos - Purple */}
                        <Line
                            type="monotone"
                            dataKey="total"
                            name="Saldo total pasivos"
                            stroke="#a855f7"
                            strokeWidth={3}
                            dot={{ fill: '#a855f7', r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        >
                            <LabelList dataKey="total" position="top" style={{ fill: '#a855f7', fontSize: 9, fontWeight: 'bold' }} formatter={(v: any) => v.toLocaleString()} />
                        </Line>

                        {/* CDATs - Orange */}
                        <Line
                            type="monotone"
                            dataKey="cdats"
                            name="CDATs"
                            stroke="#f97316"
                            strokeWidth={3}
                            dot={{ fill: '#f97316', r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        >
                            <LabelList dataKey="cdats" position="top" style={{ fill: '#f97316', fontSize: 9, fontWeight: 'bold' }} formatter={(v: any) => v.toLocaleString()} />
                        </Line>

                        {/* Ahorro Futuro - Pink/Magenta */}
                        <Line
                            type="monotone"
                            dataKey="fut"
                            name="Ahorro Futuro"
                            stroke="#d946ef"
                            strokeWidth={3}
                            dot={{ fill: '#d946ef', r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        >
                            <LabelList dataKey="fut" position="top" style={{ fill: '#d946ef', fontSize: 8, fontWeight: 'bold' }} formatter={(v: any) => v.toLocaleString()} />
                        </Line>

                        {/* Ahorros disponibles - Light Blue */}
                        <Line
                            type="monotone"
                            dataKey="disp"
                            name="Ahorros disponibles"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                            dot={{ fill: '#0ea5e9', r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        >
                            <LabelList dataKey="disp" position="bottom" style={{ fill: '#0ea5e9', fontSize: 8, fontWeight: 'bold' }} formatter={(v: any) => v.toLocaleString()} />
                        </Line>

                        {/* Ahorros Programados - Lime */}
                        <Line
                            type="monotone"
                            dataKey="prog"
                            name="Ahorros Programados"
                            stroke="#84cc16"
                            strokeWidth={3}
                            dot={{ fill: '#84cc16', r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        >
                            <LabelList dataKey="prog" position="top" style={{ fill: '#84cc16', fontSize: 8, fontWeight: 'bold' }} formatter={(v: any) => v.toLocaleString()} />
                        </Line>
                    </LineChart>
                </ResponsiveContainer>
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
                            <h4 className="text-2xl font-bold text-white">Editar Datos: Saldo Total Pasivos</h4>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto pr-4 custom-scrollbar">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-slate-800 text-slate-300 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-3 border-b border-white/10">Mes</th>
                                        <th className="px-4 py-3 border-b border-white/10 text-purple-400">Total Pasivos</th>
                                        <th className="px-4 py-3 border-b border-white/10 text-orange-400">CDATs</th>
                                        <th className="px-4 py-3 border-b border-white/10 text-pink-400">Ahorro Futuro</th>
                                        <th className="px-4 py-3 border-b border-white/10 text-sky-400">Disponibles</th>
                                        <th className="px-4 py-3 border-b border-white/10 text-lime-400">Programados</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {data.map((row: any, index: number) => (
                                        <tr key={index} className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-2 font-bold text-slate-200">{row.month}</td>
                                            {['total', 'cdats', 'fut', 'disp', 'prog'].map(field => (
                                                <td key={field} className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        value={row[field] ?? ''}
                                                        onChange={(e) => handleUpdate(index, field, e.target.value)}
                                                        className="bg-slate-800 border border-white/10 rounded px-2 py-1 w-24 outline-none text-white focus:ring-1 focus:ring-pink-500"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-10 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-900/20 transition-all hover:scale-105"
                            >
                                GUARDAR Y CERRAR
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

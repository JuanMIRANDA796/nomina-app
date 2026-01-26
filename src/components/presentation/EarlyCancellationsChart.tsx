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

export default function EarlyCancellationsChart() {
    const { data: globalData, updateSection } = usePresentation();
    const data = globalData.earlyCancellations;
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = (index: number, field: string, value: string) => {
        const newData = [...data];
        newData[index] = {
            ...newData[index],
            [field]: value === '' ? 0 : parseFloat(value)
        };
        updateSection('earlyCancellations', newData);
    };

    return (
        <div className="w-full h-[600px] p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl flex flex-col relative">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-3xl font-bold text-white mb-2">
                        Saldos cancelados anticipadamente
                    </h3>
                    <p className="text-slate-400 font-medium">Histórico de retiros y cancelaciones</p>
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
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="month"
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            yAxisId="left"
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-slate-900/95 backdrop-blur-sm p-4 border border-white/10 rounded-xl shadow-2xl">
                                            <p className="text-white font-bold mb-2 border-b border-white/10 pb-1">{label}</p>
                                            {[...payload]
                                                .sort((a, b) => (Number(b.value) - Number(a.value)))
                                                .map((item: any, idx: number) => {
                                                    const isPer = String(item.dataKey).includes('per');
                                                    return (
                                                        <div key={idx} className="flex justify-between items-center gap-4 text-sm mt-1">
                                                            <span style={{ color: item.color }}>{item.name} :</span>
                                                            <span className="text-white font-medium">
                                                                {isPer ? `${Number(item.value).toFixed(2)}%` : `$ ${Number(item.value).toLocaleString()}`}
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
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />

                        {/* % CDATs cancelados - Light Blue */}
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="cdat_per"
                            name="% CDATs cancelados sobre saldo total"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                            dot={{ fill: '#0ea5e9', r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        >
                            <LabelList dataKey="cdat_per" position="top" style={{ fill: '#0ea5e9', fontSize: 10, fontWeight: 'bold' }} formatter={(v: any) => `${v}%`} />
                        </Line>

                        {/* CDATs cancelados - Green */}
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="cdat_val"
                            name="CDATs cancelados anticipadamente"
                            stroke="#16a34a"
                            strokeWidth={3}
                            dot={{ fill: '#16a34a', r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        >
                            <LabelList dataKey="cdat_val" position="right" style={{ fill: '#16a34a', fontSize: 10, fontWeight: 'bold' }} formatter={(v: any) => `$ ${v}`} />
                        </Line>

                        {/* Ahorro programados - Purple */}
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="ahorro_val"
                            name="Ahorro programados cancelados anticipadamente"
                            stroke="#9333ea"
                            strokeWidth={3}
                            dot={{ fill: '#9333ea', r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        >
                            <LabelList dataKey="ahorro_val" position="right" style={{ fill: '#9333ea', fontSize: 10, fontWeight: 'bold' }} formatter={(v: any) => `$ ${v}`} />
                        </Line>

                        {/* % Ahorros cancelados - Red */}
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="ahorro_per"
                            name="% Ahorros cancelados sobre saldo total"
                            stroke="#dc2626"
                            strokeWidth={3}
                            dot={{ fill: '#dc2626', r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        >
                            <LabelList dataKey="ahorro_per" position="top" style={{ fill: '#dc2626', fontSize: 10, fontWeight: 'bold' }} formatter={(v: any) => `${v}%`} />
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
                            <h4 className="text-2xl font-bold text-white">Editar Datos: Saldos Cancelados</h4>
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
                                        <th className="px-4 py-3 border-b border-white/10 text-green-400">CDATs ($)</th>
                                        <th className="px-4 py-3 border-b border-white/10 text-sky-400">CDATs (%)</th>
                                        <th className="px-4 py-3 border-b border-white/10 text-purple-400">Ahorro ($)</th>
                                        <th className="px-4 py-3 border-b border-white/10 text-red-400">Ahorro (%)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {data.map((row: any, index: number) => (
                                        <tr key={index} className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-2 font-bold text-slate-200">{row.month}</td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={row.cdat_val ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'cdat_val', e.target.value)}
                                                    className="bg-slate-800 border border-white/10 rounded px-2 py-1 w-24 outline-none text-white focus:border-green-500"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={row.cdat_per ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'cdat_per', e.target.value)}
                                                    className="bg-slate-800 border border-white/10 rounded px-2 py-1 w-24 outline-none text-white focus:border-sky-500"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={row.ahorro_val ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'ahorro_val', e.target.value)}
                                                    className="bg-slate-800 border border-white/10 rounded px-2 py-1 w-24 outline-none text-white focus:border-purple-500"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={row.ahorro_per ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'ahorro_per', e.target.value)}
                                                    className="bg-slate-800 border border-white/10 rounded px-2 py-1 w-24 outline-none text-white focus:border-red-500"
                                                />
                                            </td>
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

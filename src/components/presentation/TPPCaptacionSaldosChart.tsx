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

export default function TPPCaptacionSaldosChart() {
    const { data: globalData, updateSection } = usePresentation();
    const data = globalData.tppCaptacionSaldos;
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = (index: number, field: string, value: string) => {
        const newData = [...data];
        newData[index] = {
            ...newData[index],
            [field]: value === '' ? null : parseFloat(value)
        };
        updateSection('tppCaptacionSaldos', newData);
    };

    return (
        <div className="w-full h-[600px] p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl flex flex-col relative">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-3xl font-bold text-white mb-1">
                        TPP captación y Saldos
                    </h3>
                    <p className="text-slate-400 font-medium italic">Evolución de saldos y tasas promedio</p>
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
                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            yAxisId="left"
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 250000]}
                            tickFormatter={(value) => value.toLocaleString()}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 12]}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: any, name: any) => {
                                const nameStr = String(name);
                                if (nameStr.includes('tpp')) return [`${value}%`, nameStr];
                                return [`$${value.toLocaleString()}`, nameStr];
                            }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />

                        {/* Saldo Captación - Orange */}
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="saldo_cap"
                            name="Saldo Captación"
                            stroke="#ea580c"
                            strokeWidth={3}
                            dot={{ fill: '#ea580c', r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        >
                            <LabelList dataKey="saldo_cap" position="top" style={{ fill: '#ea580c', fontSize: 9, fontWeight: 'bold' }} formatter={(v: any) => v?.toLocaleString()} />
                        </Line>

                        {/* TPP CDAT - Green */}
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="tpp_cdat"
                            name="TPP CDAT"
                            stroke="#15803d"
                            strokeWidth={3}
                            dot={{ fill: '#15803d', r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        >
                            <LabelList dataKey="tpp_cdat" position="top" style={{ fill: '#15803d', fontSize: 9, fontWeight: 'bold' }} formatter={(v: any) => v != null ? `${v}%` : ''} />
                        </Line>

                        {/* Total TPP captación - Cyan */}
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="tpp_cap"
                            name="Total TPP captación"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                            dot={{ fill: '#0ea5e9', r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        >
                            <LabelList dataKey="tpp_cap" position="bottom" style={{ fill: '#0ea5e9', fontSize: 9, fontWeight: 'bold' }} formatter={(v: any) => v != null ? `${v}%` : ''} />
                        </Line>

                        {/* Saldo CDATs - Navy/Dark Blue */}
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="saldo_cdat"
                            name="Saldo CDATs"
                            stroke="#1e3a8a"
                            strokeWidth={3}
                            dot={{ fill: '#1e3a8a', r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        >
                            <LabelList dataKey="saldo_cdat" position="top" style={{ fill: '#1e3a8a', fontSize: 9, fontWeight: 'bold' }} formatter={(v: any) => v?.toLocaleString()} />
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
                            <h4 className="text-2xl font-bold text-white">Editar Datos: TPP y Saldos</h4>
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
                                        <th className="px-4 py-3 border-b border-white/10 text-blue-400">Saldo CDATs</th>
                                        <th className="px-4 py-3 border-b border-white/10 text-orange-400">Saldo Captación</th>
                                        <th className="px-4 py-3 border-b border-white/10 text-green-400">TPP CDAT (%)</th>
                                        <th className="px-4 py-3 border-b border-white/10 text-sky-400">Total TPP (%)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {data.map((row: any, index: number) => (
                                        <tr key={index} className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-2 font-bold text-slate-200">{row.month}</td>
                                            {['saldo_cdat', 'saldo_cap', 'tpp_cdat', 'tpp_cap'].map(field => (
                                                <td key={field} className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        step={field.includes('tpp') ? "0.01" : "1"}
                                                        value={row[field] ?? ''}
                                                        onChange={(e) => handleUpdate(index, field, e.target.value)}
                                                        className="bg-slate-800 border border-white/10 rounded px-2 py-1 w-28 outline-none text-white focus:ring-1 focus:ring-pink-500"
                                                        placeholder={field.includes('tpp') ? "0.00" : "0"}
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

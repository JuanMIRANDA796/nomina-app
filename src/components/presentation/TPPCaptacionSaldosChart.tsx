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
        if (field === 'month') {
            newData[index] = { ...newData[index], month: value };
        } else {
            newData[index] = { ...newData[index], [field]: value === '' ? null : parseFloat(value) };
        }
        updateSection('tppCaptacionSaldos', newData);
    };

    const handleAddRow = () => {
        const last = data[data.length - 1];
        const newRow = { month: '', saldo_cdat: last?.saldo_cdat ?? 0, saldo_cap: last?.saldo_cap ?? 0, tpp_cdat: last?.tpp_cdat ?? null, tpp_cap: last?.tpp_cap ?? null };
        updateSection('tppCaptacionSaldos', [...data, newRow]);
    };

    const handleDeleteRow = (idx: number) => {
        if (data.length <= 1) return;
        updateSection('tppCaptacionSaldos', data.filter((_: any, i: number) => i !== idx));
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
                            hide={true}
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 250000]}
                            tickFormatter={(value) => value.toLocaleString()}
                        />
                        <YAxis
                            yAxisId="right"
                            hide={true}
                            orientation="right"
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 12]}
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
                                                    const isTpp = String(item.dataKey).includes('tpp');
                                                    return (
                                                        <div key={idx} className="flex justify-between items-center gap-4 text-sm mt-1">
                                                            <span style={{ color: item.color }}>{item.name} :</span>
                                                            <span className="text-white font-medium">
                                                                {isTpp ? `${Number(item.value).toFixed(2)}%` : `$ ${Number(item.value).toLocaleString()}`}
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

                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="saldo_cap"
                            name="Saldo Captación"
                            stroke="#ea580c"
                            strokeWidth={3}
                            dot={{ fill: '#ea580c', r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />

                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="tpp_cdat"
                            name="TPP CDAT"
                            stroke="#15803d"
                            strokeWidth={3}
                            dot={{ fill: '#15803d', r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />

                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="tpp_cap"
                            name="Total TPP captación"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                            dot={{ fill: '#0ea5e9', r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />

                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="saldo_cdat"
                            name="Saldo CDATs"
                            stroke="#1e3a8a"
                            strokeWidth={3}
                            dot={{ fill: '#1e3a8a', r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
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
                                        <th className="px-4 py-3 border-b border-white/10 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {data.map((row: any, index: number) => (
                                        <tr key={index} className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-2">
                                                <input type="text" value={row.month ?? ''} onChange={(e) => handleUpdate(index, 'month', e.target.value)} className="bg-slate-800 border border-white/10 rounded px-2 py-1 w-20 outline-none text-pink-400 font-bold focus:ring-1 focus:ring-pink-500" placeholder="ene-26" />
                                            </td>
                                            {['saldo_cdat', 'saldo_cap', 'tpp_cdat', 'tpp_cap'].map(field => (
                                                <td key={field} className="px-4 py-2">
                                                    <input type="number" step={field.includes('tpp') ? "0.01" : "1"} value={row[field] ?? ''} onChange={(e) => handleUpdate(index, field, e.target.value)} className="bg-slate-800 border border-white/10 rounded px-2 py-1 w-28 outline-none text-white focus:ring-1 focus:ring-pink-500" placeholder={field.includes('tpp') ? "0.00" : "0"} />
                                                </td>
                                            ))}
                                            <td className="px-4 py-2 text-center">
                                                <button onClick={() => handleDeleteRow(index)} className="w-7 h-7 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 font-bold transition-all text-sm" title="Eliminar fila">×</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button onClick={handleAddRow} className="mt-3 w-full py-2 border border-dashed border-white/20 hover:border-pink-500/50 hover:bg-pink-500/5 rounded-xl text-slate-400 hover:text-pink-400 text-sm font-medium transition-all">
                                + Agregar fila
                            </button>
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

'use client';

import React, { useState, useEffect } from 'react';
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
import initialData from '@/data/historical_rates_v2.json';
import { usePresentation } from '@/context/PresentationContext';

export default function HistoricalRatesV2Chart() {
    const { data: globalData, updateSection } = usePresentation();
    // Default to initialData if section doesn't exist yet
    const data = globalData.historicalRatesV2 || initialData;
    const [isEditing, setIsEditing] = useState(false);
    const [chartWidth, setChartWidth] = useState('100%');

    // Dynamic width for scrollability if data is large
    useEffect(() => {
        const points = data.length;
        if (points > 15) {
            setChartWidth(`${points * 60}px`);
        } else {
            setChartWidth('100%');
        }
    }, [data.length]);

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        } catch (e) {
            return dateString;
        }
    };

    const handleUpdate = (index: number, field: string, value: string) => {
        const newData = [...data];
        if (field === 'date') {
            newData[index] = { ...newData[index], date: value };
        } else {
            newData[index] = { ...newData[index], [field]: parseFloat(value) || 0 };
        }
        updateSection('historicalRatesV2', newData);
    };

    const handleAddRow = () => {
        const last = data[data.length - 1];
        const newRow = {
            date: '',
            rate1: last?.rate1 ?? 0,
            rate2: last?.rate2 ?? 0,
            rate3: last?.rate3 ?? 0
        };
        updateSection('historicalRatesV2', [...data, newRow]);
    };

    const handleDeleteRow = (idx: number) => {
        if (data.length <= 1) return;
        const newData = data.filter((_: any, i: number) => i !== idx);
        updateSection('historicalRatesV2', newData);
    };

    return (
        <div className="w-full h-[600px] p-6 bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl relative flex flex-col overflow-hidden">

            <div className="flex justify-between items-center mb-6 shrink-0">
                <div className="flex flex-col">
                    <h3 className="text-3xl font-black text-white tracking-tighter">
                        Curva de Rendimiento <span className="bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">TES</span>
                    </h3>
                    <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-bold opacity-60">Análisis Histórico de Tasas de Interés (2021 - 2026)</p>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all text-slate-300"
                >
                    ✎ Editar Datos
                </button>
            </div>

            <div className="flex-1 w-full overflow-x-auto custom-scrollbar-horizontal pb-4">
                <div style={{ width: chartWidth, minWidth: '100%', height: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#475569"
                                tick={{ fill: '#94A3B8', fontSize: 10 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(val) => {
                                    if (!val) return '';
                                    const d = new Date(val);
                                    return `${d.getMonth() + 1}/${d.getFullYear()}`;
                                }}
                                interval={2}
                            />
                            <YAxis
                                stroke="#475569"
                                tick={{ fill: '#94A3B8', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                domain={[0, 'auto']}
                                unit="%"
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
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                                <span className="text-slate-300">{item.name} :</span>
                                                            </div>
                                                            <span className="text-white font-bold">{Number(item.value).toFixed(2)}%</span>
                                                        </div>
                                                    ))}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend
                                verticalAlign="top"
                                align="center"
                                iconType="circle"
                                wrapperStyle={{ paddingBottom: '20px' }}
                            />

                            <Line
                                type="monotone"
                                dataKey="rate1"
                                name="TES 1 año"
                                stroke="#0F4C81"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />

                            <Line
                                type="monotone"
                                dataKey="rate2"
                                name="TES 5 años"
                                stroke="#F97316"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />

                            <Line
                                type="monotone"
                                dataKey="rate3"
                                name="TES 10 años"
                                stroke="#E91E63"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 0 }}
                            />

                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* EDITING MODAL */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-6 rounded-3xl overflow-hidden flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-bold text-white">Editor Curva TES</h4>
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
                                        <th className="p-3 border-b border-white/10">Fecha (AAAA-MM-DD)</th>
                                        <th className="p-3 border-b border-white/10 text-center">TES 1A (%)</th>
                                        <th className="p-3 border-b border-white/10 text-center">TES 5A (%)</th>
                                        <th className="p-3 border-b border-white/10 text-center">TES 10A (%)</th>
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
                                                    value={row.date ?? ''}
                                                    onChange={(e) => handleUpdate(idx, 'date', e.target.value)}
                                                    placeholder="2021-01-29"
                                                />
                                            </td>
                                            {['rate1', 'rate2', 'rate3'].map(field => (
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
            <style jsx global>{`
                .custom-scrollbar-horizontal::-webkit-scrollbar {
                    height: 8px;
                }
                .custom-scrollbar-horizontal::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar-horizontal::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar-horizontal::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentation } from '@/context/PresentationContext';

export default function BenchmarkingConsumoTodosChart() {
    const { data: globalData, updateSection } = usePresentation();
    const data = globalData.benchmarkingConsumoTodos;
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = (index: number, field: string, value: string) => {
        const newData = [...data];
        newData[index] = {
            ...newData[index],
            [field]: value === '' ? null : parseFloat(value)
        };
        updateSection('benchmarkingConsumoTodos', newData);
    };

    return (
        <div className="w-full h-[580px] p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl flex flex-col relative">

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-white">
                        Benchmarking Desembolsos - Consumo Créditos Noviembre
                    </h3>
                    <p className="text-slate-400 font-semibold text-lg uppercase tracking-widest">Todos los montos</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-center">
                        <p className="text-xs text-slate-400 uppercase">Presente</p>
                        <p className="text-xl font-bold">19,02% <span className="text-sm font-normal text-slate-400">ea</span></p>
                    </div>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors text-sm font-medium shadow-lg"
                    >
                        Editar Datos
                    </button>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0 flex gap-6">
                <div className="w-48 flex flex-col justify-center gap-6 border-r border-white/10 pr-6">
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Entidades</p>
                        <p className="text-2xl font-bold text-sky-400">34</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Monto Total</p>
                        <p className="text-2xl font-bold text-orange-400">$3,42 bill.</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Desembolsos</p>
                        <p className="text-2xl font-bold text-slate-200">313.737</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Tasa Prom. EA</p>
                        <p className="text-2xl font-bold text-emerald-400">21,69%</p>
                    </div>
                </div>

                <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="entity"
                                stroke="#9CA3AF"
                                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis hide={true} />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-slate-900/95 backdrop-blur-sm p-4 border border-white/10 rounded-xl shadow-2xl">
                                                <p className="text-white font-bold mb-2 border-b border-white/10 pb-1">{label}</p>
                                                {[...payload]
                                                    .sort((a, b) => (Number(b.value) - Number(a.value)))
                                                    .map((item: any, idx: number) => {
                                                        const isAmount = item.dataKey === 'amount';
                                                        return (
                                                            <div key={idx} className="flex justify-between items-center gap-4 text-sm mt-1">
                                                                <span style={{ color: item.color }}>{item.name} :</span>
                                                                <span className="text-white font-medium">
                                                                    {isAmount ? `$ ${Number(item.value).toLocaleString()}` : Number(item.value).toLocaleString()}
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
                            <Legend verticalAlign="bottom" align="right" iconType="circle" />

                            <Bar dataKey="disbursements_num" name="# Desembolsos" fill="#0c4a6e" radius={[4, 4, 0, 0]}>
                                {data.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.entity === 'PRESENTE' ? '#D81B60' : '#0c4a6e'} />
                                ))}
                            </Bar>
                            <Bar dataKey="amount" name="$ Desembolsos" fill="#ea580c" radius={[4, 4, 0, 0]}>
                                {data.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.entity === 'PRESENTE' ? '#f472b6' : '#ea580c'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="flex justify-around mt-2 text-[10px] text-slate-500 font-medium">
                        {data.map((d: any, i: number) => (
                            <span key={i}>TPP {d.tpp ? `${d.tpp}%` : '-'}</span>
                        ))}
                    </div>
                </div>
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
                            <h4 className="text-xl font-semibold text-white">Editar Datos Benchmarking (Todos)</h4>
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
                                        <th className="px-4 py-3">Entidad</th>
                                        <th className="px-4 py-3 text-sky-400"># Desembolsos</th>
                                        <th className="px-4 py-3 text-orange-400">$ Monto</th>
                                        <th className="px-4 py-3 text-emerald-400">TPP %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row: any, index: number) => (
                                        <tr key={index} className="border-b border-slate-800 hover:bg-white/5">
                                            <td className="px-4 py-2 font-medium text-slate-200">{row.entity}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={row.disbursements_num ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'disbursements_num', e.target.value)}
                                                    className="bg-transparent border border-slate-700 rounded px-2 py-1 w-24 outline-none text-white focus:border-pink-500"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={row.amount ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'amount', e.target.value)}
                                                    className="bg-transparent border border-slate-700 rounded px-2 py-1 w-24 outline-none text-white focus:border-pink-500"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={row.tpp ?? ''}
                                                    onChange={(e) => handleUpdate(index, 'tpp', e.target.value)}
                                                    className="bg-transparent border border-slate-700 rounded px-2 py-1 w-24 outline-none text-white focus:border-pink-500"
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
                                className="px-6 py-2 bg-gradient-to-r from-pink-600 to-orange-600 text-white rounded-lg font-medium"
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

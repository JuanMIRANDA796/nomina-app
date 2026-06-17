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

export default function DeficitFiscalChart() {
    const { data: globalData, updateSection } = usePresentation();
    const data = globalData.deficitFiscal || [];
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = (index: number, field: string, value: string) => {
        const newData = [...data];
        let parsedVal: any = value === '' ? null : parseFloat(value);
        // If it's NaN (like typing minus sign or dot), but not empty:
        if (value !== '' && isNaN(parsedVal)) {
            parsedVal = value; // keep string for typing intermediate values
        }
        if (field === 'year') {
            parsedVal = value;
        }
        newData[index] = {
            ...newData[index],
            [field]: parsedVal
        };
        updateSection('deficitFiscal', newData);
    };

    const handleAddRow = () => {
        const last = data[data.length - 1];
        const newRow = {
            year: last ? String(Number(last.year) + 1) : "2027",
            enero: null,
            febrero: null,
            marzo: null,
            abril: null,
            mayo: null,
            junio: null,
            julio: null,
            agosto: null,
            septiembre: null,
            octubre: null,
            noviembre: null,
            diciembre: null,
            total: 0
        };
        updateSection('deficitFiscal', [...data, newRow]);
    };

    const handleDeleteRow = (idx: number) => {
        if (data.length <= 1) return;
        const newData = data.filter((_: any, i: number) => i !== idx);
        updateSection('deficitFiscal', newData);
    };

    return (
        <div className="w-full h-[600px] p-6 bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-black text-white tracking-tighter">
                    Déficit <span className="bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">Fiscal</span>
                </h3>
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all text-slate-300"
                >
                    ✎ Editar Datos
                </button>
            </div>

            <ResponsiveContainer width="100%" height="85%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                        dataKey="year"
                        stroke="#475569"
                        tick={{ fill: '#94A3B8', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        hide={false}
                        stroke="#475569"
                        tick={{ fill: '#94A3B8', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        domain={['auto', 'auto']}
                        tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-slate-900/95 backdrop-blur-sm p-4 border border-white/10 rounded-xl shadow-2xl">
                                        <p className="text-white font-bold mb-2 border-b border-white/10 pb-1">Año {label}</p>
                                        {[...payload]
                                            .map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center gap-4 text-sm mt-1">
                                                    <span style={{ color: item.color }}>{item.name} :</span>
                                                    <span className="text-white font-medium">
                                                        {typeof item.value === 'number' ? `${item.value.toFixed(1)}%` : `${item.value}%`}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Legend iconType="circle" />

                    <Line 
                        type="monotone" 
                        dataKey="total" 
                        name="Total Déficit Fiscal" 
                        stroke="#E91E63" 
                        strokeWidth={4} 
                        dot={{ r: 6, strokeWidth: 2, fill: '#0f172a' }}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>

            {/* Editing Modal */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md p-6 rounded-3xl overflow-hidden flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-bold text-white">Editor de Déficit Fiscal</h4>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-pink-600/20"
                            >
                                Finalizar y Guardar
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto custom-scrollbar pr-2">
                            <table className="w-full text-left border-collapse min-w-[1200px]">
                                <thead className="sticky top-0 bg-slate-900 text-slate-400 text-xs uppercase z-10">
                                    <tr>
                                        <th className="p-3 border-b border-white/10 text-center">Año</th>
                                        {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Total'].map(m => (
                                            <th key={m} className="p-3 border-b border-white/10 text-center">{m}</th>
                                        ))}
                                        <th className="p-3 border-b border-white/10 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                                            {/* Year column */}
                                            <td className="p-2 border-b border-white/5">
                                                <input
                                                    type="text"
                                                    className="w-16 bg-white/5 border border-white/10 rounded-lg p-2 text-center font-bold text-pink-400 focus:ring-1 focus:ring-pink-500 outline-none"
                                                    value={row.year ?? ''}
                                                    onChange={(e) => handleUpdate(idx, 'year', e.target.value)}
                                                    placeholder="Año"
                                                />
                                            </td>
                                            {/* Months and Total columns */}
                                            {[
                                                { key: 'enero', label: 'enero' },
                                                { key: 'febrero', label: 'febrero' },
                                                { key: 'marzo', label: 'marzo' },
                                                { key: 'abril', label: 'abril' },
                                                { key: 'mayo', label: 'mayo' },
                                                { key: 'junio', label: 'junio' },
                                                { key: 'julio', label: 'julio' },
                                                { key: 'agosto', label: 'agosto' },
                                                { key: 'septiembre', label: 'septiembre' },
                                                { key: 'octubre', label: 'octubre' },
                                                { key: 'noviembre', label: 'noviembre' },
                                                { key: 'diciembre', label: 'diciembre' },
                                                { key: 'total', label: 'total', isHighlight: true }
                                            ].map(col => (
                                                <td key={col.key} className="p-2 border-b border-white/5">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        className={`w-16 bg-white/5 border border-white/10 rounded-lg p-2 text-center focus:ring-1 focus:ring-pink-500 outline-none ${
                                                            col.isHighlight ? 'text-pink-400 font-bold' : 'text-white'
                                                        }`}
                                                        value={row[col.key] === null || row[col.key] === undefined ? '' : row[col.key]}
                                                        onChange={(e) => handleUpdate(idx, col.key, e.target.value)}
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
                                + Agregar Año
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

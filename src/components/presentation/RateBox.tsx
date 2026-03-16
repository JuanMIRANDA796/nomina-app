'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RateBoxProps {
    presenteTpp: number | null;
    totalsTpp: number | null;
    extraInfo?: string;
    onUpdate: (newValue: number) => void;
}

export default function RateBox({ presenteTpp, totalsTpp, extraInfo, onUpdate }: RateBoxProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(presenteTpp?.toString() ?? '');

    const diff = (totalsTpp != null && presenteTpp != null) ? (totalsTpp - presenteTpp) : null;

    const handleSave = () => {
        const val = parseFloat(tempValue.replace(',', '.'));
        if (!isNaN(val)) {
            onUpdate(val);
        }
        setIsEditing(false);
    };

    return (
        <div className="relative group">
            <div 
                className="bg-white/10 px-4 py-3 rounded-xl border border-white/10 text-center min-w-[120px] backdrop-blur-md shadow-lg transition-all"
            >
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Presente</p>
                <p className="text-xl font-bold leading-none">
                    {presenteTpp != null ? `${presenteTpp.toFixed(2).replace('.', ',')}%` : '-'} 
                    <span className="text-sm font-normal text-slate-400 ml-1">ea</span>
                </p>
                {diff !== null && (
                    <p className={`text-[10px] font-bold mt-1.5 flex items-center justify-center gap-1 ${diff >= 0 ? 'text-emerald-400' : 'text-pink-400'}`}>
                        <span>{diff >= 0 ? '↑' : '↓'}</span>
                        <span>{Math.abs(diff).toFixed(2).replace('.', ',')}%</span>
                        <span className="text-[9px] opacity-70 ml-0.5">vs Prom.</span>
                    </p>
                )}
                {extraInfo && (
                    <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-tighter">{extraInfo}</p>
                )}
            </div>

            {/* HOVER EDIT TRIGGER */}
            <button 
                onClick={() => {
                    setTempValue(presenteTpp?.toString() ?? '');
                    setIsEditing(true);
                }}
                className="absolute -top-2 -right-2 bg-pink-600 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
            </button>

            {/* INLINE EDIT POPOVER */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 border border-white/20 rounded-xl p-3 shadow-2xl z-[60] min-w-[140px]"
                    >
                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Editar Tasa Presente</p>
                        <div className="flex gap-2">
                            <input 
                                autoFocus
                                type="text"
                                className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-sm text-white outline-none focus:border-pink-500"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSave();
                                    if (e.key === 'Escape') setIsEditing(false);
                                }}
                            />
                            <button 
                                onClick={handleSave}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white p-1 rounded-lg transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

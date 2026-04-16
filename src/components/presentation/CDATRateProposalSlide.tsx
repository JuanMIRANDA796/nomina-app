import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePresentation } from '@/context/PresentationContext';

export default function CDATRateProposalSlide() {
    const { data, updateSection, setGlobalEditing } = usePresentation();
    const [isEditing, setIsEditing] = useState(false);
    
    const globalData = data?.cdatTextProposal || {
        dateHighlight: "31 de marzo",
        mainPoint: "Se espera que el próximo 31 de marzo el Banco de la República aumente la tasa de intervención.",
        secondaryPoint: "Se solicita atribuciones al área financiera para aumentar las tasas de los CDATs, dado un aumento en la tasa de intervención."
    };

    const [localData, setLocalData] = useState(globalData);

    useEffect(() => {
        if (!isEditing) {
            setLocalData(globalData);
        }
    }, [globalData, isEditing]);

    const handleUpdate = (field: string, value: string) => {
        setLocalData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        updateSection('cdatTextProposal', localData);
        setIsEditing(false);
        setGlobalEditing(false);
    };

    const handleCancel = () => {
        setLocalData(globalData);
        setIsEditing(false);
        setGlobalEditing(false);
    };

    return (
        <div className="w-full h-full p-8 md:p-16 flex flex-col items-center bg-slate-950 text-white relative overflow-y-auto custom-scrollbar">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-600/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="w-full max-w-5xl flex justify-between items-start mb-16 md:mb-24 relative z-10 shrink-0">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-6">
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-2xl italic">
                            Propuesta Cambio de Tasas CDATs
                        </h1>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-pink-600/20"
                                >
                                    Guardar
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-all"
                                >
                                    Cancelar
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => { setIsEditing(true); setGlobalEditing(true); }}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-all border border-white/10"
                            >
                                Editar Textos
                            </button>
                        )}
                    </div>
                    <div className="h-2 w-64 bg-pink-600 rounded-full shadow-[0_0_30px_rgba(233,30,99,0.5)]" />
                </div>
                <div className="relative w-32 h-12 md:w-56 md:h-20 opacity-40">
                    <img src="/logo-presente.png" alt="Presente" className="object-contain w-full h-full brightness-0 invert" />
                </div>
            </div>

            <div className="w-full max-w-4xl flex flex-col gap-8 md:gap-12 relative z-10 shrink-0 pb-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-pink-600 group-hover:w-2 transition-all" />
                    <div className="flex flex-col gap-8 md:gap-10">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-pink-600/10 flex items-center justify-center rounded-2xl text-2xl md:text-3xl shadow-inner group-hover:bg-pink-600 group-hover:text-white transition-all transform group-hover:rotate-6">🏛️</div>
                            <div className="flex-1">
                                {isEditing ? (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-pink-500 uppercase tracking-widest">Fecha resaltada:</span>
                                            <input
                                                className="bg-pink-500/10 border border-pink-500/30 rounded-lg px-3 py-1 text-pink-500 font-bold outline-none"
                                                value={localData.dateHighlight}
                                                onChange={(e) => handleUpdate('dateHighlight', e.target.value)}
                                            />
                                        </div>
                                        <textarea
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-pink-500 outline-none text-slate-100 text-xl font-medium min-h-[120px]"
                                            value={localData.mainPoint}
                                            onChange={(e) => handleUpdate('mainPoint', e.target.value)}
                                        />
                                    </div>
                                ) : (
                                    <p className="text-xl md:text-2xl font-medium text-slate-100 leading-relaxed max-w-xl group-hover:text-white transition-colors">
                                        {localData.mainPoint.split(localData.dateHighlight).map((part: string, i: number, arr: any[]) => (
                                            <React.Fragment key={i}>
                                                {part}
                                                {i < arr.length - 1 && (
                                                    <span className="text-pink-500 font-bold group-hover:text-amber-400 underline decoration-pink-500/50 underline-offset-8">
                                                        {localData.dateHighlight}
                                                    </span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="h-px w-full bg-white/5" />

                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600/10 flex items-center justify-center rounded-2xl text-2xl md:text-3xl shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:-rotate-6">📈</div>
                            <div className="flex-1">
                                {isEditing ? (
                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-blue-500 outline-none text-slate-100 text-xl font-medium min-h-[100px]"
                                        value={localData.secondaryPoint}
                                        onChange={(e) => handleUpdate('secondaryPoint', e.target.value)}
                                    />
                                ) : (
                                    <p className="text-xl md:text-2xl font-medium text-slate-100 leading-relaxed max-w-xl group-hover:text-white transition-colors">
                                        {localData.secondaryPoint}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <p className="text-center text-slate-500 text-base md:text-lg font-medium opacity-60">
                    Propuesta alineada con la estrategia de competitividad de Mercado.
                </p>
            </div>
        </div>
    );
}

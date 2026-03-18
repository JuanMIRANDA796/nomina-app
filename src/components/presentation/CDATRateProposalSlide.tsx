'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function CDATRateProposalSlide() {
    return (
        <div className="w-full h-full p-16 flex flex-col items-center bg-slate-950 text-white relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-600/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="w-full max-w-5xl flex justify-between items-start mb-24 relative z-10">
                <div className="flex flex-col gap-4">
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase drop-shadow-2xl">
                        Propuesta Cambio de Tasas CDATs
                    </h1>
                    <div className="h-2 w-64 bg-pink-600 rounded-full shadow-[0_0_30px_rgba(233,30,99,0.5)]" />
                </div>
                <div className="relative w-56 h-20 opacity-40">
                    <img src="/logo-presente.png" alt="Presente" className="object-contain w-full h-full brightness-0 invert" />
                </div>
            </div>

            <div className="w-full max-w-4xl flex flex-col gap-12 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-pink-600 group-hover:w-2 transition-all" />
                    <div className="flex flex-col gap-10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-pink-600/10 flex items-center justify-center rounded-2xl text-3xl shadow-inner group-hover:bg-pink-600 group-hover:text-white transition-all transform group-hover:rotate-6">🏛️</div>
                            <p className="text-2xl font-medium text-slate-100 leading-relaxed max-w-xl group-hover:text-white transition-colors">
                                Se espera que el próximo <span className="text-pink-500 font-bold group-hover:text-amber-400 underline decoration-pink-500/50 underline-offset-8">31 de marzo</span> el Banco de la República aumente la tasa de intervención.
                            </p>
                        </div>

                        <div className="h-px w-full bg-white/5" />

                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-blue-600/10 flex items-center justify-center rounded-2xl text-3xl shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:-rotate-6">📈</div>
                            <p className="text-2xl font-medium text-slate-100 leading-relaxed max-w-xl group-hover:text-white transition-colors">
                                Se solicita atribuciones al área financiera para aumentar las tasas de los CDATs, dado un aumento en la tasa de intervención.
                            </p>
                        </div>
                    </div>
                </motion.div>

                <p className="mt-8 text-center text-slate-500 text-lg font-medium opacity-60">
                    Propuesta alineada con la estrategia de competitividad de Mercado.
                </p>
            </div>
        </div>
    );
}

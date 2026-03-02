'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function CDATSocialComparisonSlide() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8 bg-slate-950 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-600/10 blur-[130px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[130px] rounded-full"></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl h-full flex flex-col gap-6">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h3 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-pink-500 via-rose-400 to-indigo-400 bg-clip-text text-transparent leading-tight tracking-tighter">
                        Comparativos CDATs Publicado en Redes
                    </h3>
                    <div className="h-1.5 w-32 bg-pink-500 mx-auto mt-4 rounded-full shadow-lg shadow-pink-500/20"></div>
                </motion.div>

                {/* Main Content: Split Layout */}
                <div className="flex-1 flex flex-col lg:flex-row gap-8 items-stretch min-h-0">
                    {/* Image Card - Larger for better visibility */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="lg:flex-[1.2] flex flex-col gap-3"
                    >
                        <div className="flex items-center justify-between px-2">
                            <span className="text-indigo-300 text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">Referencia Redes</span>
                            <span className="text-slate-500 text-[10px] font-medium italic">Información pública Superfinanciera</span>
                        </div>
                        <div className="flex-1 bg-white rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden group p-4">
                            <img
                                src="/comparativo_redes.png"
                                alt="Comparativo Redes"
                                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                            />
                        </div>
                    </motion.div>

                    {/* Text Area - Optimized for readability */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="lg:flex-1 flex flex-col justify-center gap-8 bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 md:p-12"
                    >
                        <div className="space-y-8">
                            <div className="flex gap-6 items-start">
                                <div className="w-1.5 h-16 bg-pink-500 rounded-full shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.5)]"></div>
                                <p className="text-white text-xl md:text-2xl font-semibold leading-relaxed tracking-tight">
                                    El comparativo de tasas se publica con base en información de la
                                    <span className="text-pink-500 font-black block mt-2 text-2xl md:text-3xl">Superfinanciera de tasas ponderadas.</span>
                                </p>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="w-1.5 h-16 bg-indigo-500 rounded-full shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                                <p className="text-slate-100 text-xl md:text-2xl font-semibold leading-relaxed tracking-tight">
                                    Con las atribuciones de Productos y Gerencia,
                                    <span className="text-white font-black underline decoration-pink-500 decoration-8 underline-offset-12 block mt-2">se le hará retención a capitales importantes.</span>
                                </p>
                            </div>
                        </div>

                        {/* Bottom Highlight */}
                        <div className="mt-4 p-6 bg-gradient-to-br from-pink-600/10 to-transparent border border-pink-500/20 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-pink-500 rounded-xl shadow-lg shadow-pink-500/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.307a.515.515 0 0 0 .799-.037l7.03-10.33" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-black uppercase text-sm tracking-widest">Estratégico</p>
                                    <p className="text-pink-300/80 text-xs font-medium">Monitoreo constante de competitividad.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

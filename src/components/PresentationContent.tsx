'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePresentation } from '@/context/PresentationContext';
import ReferenceRatesChart from '@/components/presentation/ReferenceRatesChart';
import InflationVsRepoChart from '@/components/presentation/InflationVsRepoChart';
import PortfolioStockRatesChart from '@/components/presentation/PortfolioStockRatesChart';
import DisbursementRatesChart from '@/components/presentation/DisbursementRatesChart';
import MonthlyDisbursementsChart from '@/components/presentation/MonthlyDisbursementsChart';
import PortfolioBalanceByLineChart from '@/components/presentation/PortfolioBalanceByLineChart';
import BenchmarkingConsumoHasta1Chart from '@/components/presentation/BenchmarkingConsumoHasta1Chart';
import BenchmarkingConsumo1To3Chart from '@/components/presentation/BenchmarkingConsumo1To3Chart';
import BenchmarkingConsumo3To6Chart from '@/components/presentation/BenchmarkingConsumo3To6Chart';
import BenchmarkingConsumo6To12Chart from '@/components/presentation/BenchmarkingConsumo6To12Chart';
import BenchmarkingConsumo12To25Chart from '@/components/presentation/BenchmarkingConsumo12To25Chart';
import BenchmarkingConsumoTodosChart from '@/components/presentation/BenchmarkingConsumoTodosChart';
import BenchmarkingViviendaVisHasta20Chart from '@/components/presentation/BenchmarkingViviendaVisHasta20Chart';
import BenchmarkingViviendaVisSup20Chart from '@/components/presentation/BenchmarkingViviendaVisSup20Chart';
import BenchmarkingViviendaNoVisHasta20Chart from '@/components/presentation/BenchmarkingViviendaNoVisHasta20Chart';
import BenchmarkingViviendaNoVisSup20Chart from '@/components/presentation/BenchmarkingViviendaNoVisSup20Chart';
import BenchmarkingViviendaVisUvrHasta20Chart from '@/components/presentation/BenchmarkingViviendaVisUvrHasta20Chart';
import BenchmarkingViviendaVisUvrSup20Chart from '@/components/presentation/BenchmarkingViviendaVisUvrSup20Chart';
import BenchmarkingViviendaNoVisUvrHasta20Chart from '@/components/presentation/BenchmarkingViviendaNoVisUvrHasta20Chart';
import BenchmarkingViviendaNoVisUvrSup20Chart from '@/components/presentation/BenchmarkingViviendaNoVisUvrSup20Chart';
import BenchmarkingCreditsTable from '@/components/presentation/BenchmarkingCreditsTable';
import BenchmarkingCDATsTable from '@/components/presentation/BenchmarkingCDATsTable';
import RateProposalTables from '@/components/presentation/RateProposalTables';
import FSGProposalTable from '@/components/presentation/FSGProposalTable';
import EarlyCancellationsChart from '@/components/presentation/EarlyCancellationsChart';
import TotalLiabilitiesBalanceChart from '@/components/presentation/TotalLiabilitiesBalanceChart';
import TPPCaptacionSaldosChart from '@/components/presentation/TPPCaptacionSaldosChart';
import MacroeconomicAnalysisSlide from '@/components/presentation/MacroeconomicAnalysisSlide';
import CDATProposalMainTable from '@/components/presentation/CDATProposalMainTable';
import CDATRateMatrixTable from '@/components/presentation/CDATRateMatrixTable';
import CDATSocialComparisonSlide from '@/components/presentation/CDATSocialComparisonSlide';

export default function PresentationContent() {
    const { resetData, isLoading } = usePresentation();

    if (isLoading) return (
        <div className="w-full h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-white text-2xl font-bold animate-pulse">Cargando Presentación...</div>
        </div>
    );

    const slides = [
        // COVER
        { id: 'cover', isCover: true },

        // MACRO & TRENDS
        { id: 'macro-analysis', component: <MacroeconomicAnalysisSlide /> },
        { id: 'ref-rates', component: <ReferenceRatesChart /> },
        { id: 'inflation-repo', component: <InflationVsRepoChart /> },
        { id: 'portfolio-stocks', component: <PortfolioStockRatesChart /> },
        { id: 'disbursement-rates', component: <DisbursementRatesChart /> },
        { id: 'placement-amounts', component: <MonthlyDisbursementsChart /> },
        { id: 'portfolio-balance', component: <PortfolioBalanceByLineChart /> },

        // BENCHMARKING CONSUMO
        { id: 'benchmarking-consumo-1', component: <BenchmarkingConsumoHasta1Chart /> },
        { id: 'benchmarking-consumo-2', component: <BenchmarkingConsumo1To3Chart /> },
        { id: 'benchmarking-consumo-3', component: <BenchmarkingConsumo3To6Chart /> },
        { id: 'benchmarking-consumo-4', component: <BenchmarkingConsumo6To12Chart /> },
        { id: 'benchmarking-consumo-5', component: <BenchmarkingConsumo12To25Chart /> },
        { id: 'benchmarking-consumo-6', component: <BenchmarkingConsumoTodosChart /> },

        // BENCHMARKING VIVIENDA PESOS
        { id: 'benchmarking-viv-p1', component: <BenchmarkingViviendaVisHasta20Chart /> },
        { id: 'benchmarking-viv-p2', component: <BenchmarkingViviendaVisSup20Chart /> },
        { id: 'benchmarking-viv-p3', component: <BenchmarkingViviendaNoVisHasta20Chart /> },
        { id: 'benchmarking-viv-p4', component: <BenchmarkingViviendaNoVisSup20Chart /> },

        // BENCHMARKING VIVIENDA UVR
        { id: 'benchmarking-viv-u1', component: <BenchmarkingViviendaVisUvrHasta20Chart /> },
        { id: 'benchmarking-viv-u2', component: <BenchmarkingViviendaVisUvrSup20Chart /> },
        { id: 'benchmarking-viv-u3', component: <BenchmarkingViviendaNoVisUvrHasta20Chart /> },
        { id: 'benchmarking-viv-u4', component: <BenchmarkingViviendaNoVisUvrSup20Chart /> },

        // TABLES & LIABILITIES
        { id: 'benchmarking-credits', component: <BenchmarkingCreditsTable /> },
        { id: 'total-liabilities', component: <TotalLiabilitiesBalanceChart /> },
        { id: 'early-cancellations', component: <EarlyCancellationsChart /> },
        { id: 'tpp-captacion', component: <TPPCaptacionSaldosChart /> },

        // CDAT PROPOSALS (NEW INTERACTIVE)
        { id: 'cdat-benchmarking', component: <BenchmarkingCDATsTable /> },
        { id: 'cdat-proposal-main', component: <CDATProposalMainTable /> },
        { id: 'cdat-rate-matrix', component: <CDATRateMatrixTable /> },
        { id: 'cdat-social-comparison', component: <CDATSocialComparisonSlide /> },

        // FINAL PROPOSALS
        { id: 'fsg-proposal', component: <FSGProposalTable /> },
    ];

    return (
        <main className="snap-y snap-mandatory h-screen w-full overflow-y-scroll bg-slate-950 text-white scroll-smooth selection:bg-pink-500 selection:text-white">

            {slides.map((slide) => (
                <section key={slide.id} className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
                    {slide.isCover ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#D4145A] via-[#E91E63] to-[#FBB03B] rounded-[3rem] p-8 m-4">
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative w-full max-w-3xl flex flex-col items-center">
                                <div className="relative w-96 h-48 md:w-[600px] md:h-[300px]">
                                    <img src="/logo-presente.png" alt="Presente" className="object-contain w-full h-full drop-shadow-xl" />
                                </div>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="mt-8 text-center text-white">
                                    <h2 className="text-2xl md:text-3xl font-light tracking-widest uppercase">Comité de precios enero 2026</h2>
                                    <p className="text-xl opacity-80 mt-2 font-medium">Enero 2026</p>
                                </motion.div>
                            </motion.div>
                            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-12">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-60">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </motion.div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className={`w-full h-full flex items-center justify-center ${slide.id.includes('table') || slide.id.includes('matrix') || slide.id.includes('proposal') ? 'max-w-[95rem]' : 'max-w-7xl'}`}
                        >
                            {slide.component}
                        </motion.div>
                    )}
                </section>
            ))}

            {/* FLOATING RESET BUTTON */}
            <div className="fixed bottom-8 right-8 z-[100]">
                <button
                    onClick={resetData}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-white/10 transition-colors text-xs font-medium backdrop-blur-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Restablecer Datos
                </button>
            </div>

        </main>
    );
}
